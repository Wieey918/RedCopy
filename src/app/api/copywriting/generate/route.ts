import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/session'

const STYLE_PROMPTS: Record<string, { zh: string; en: string }> = {
  viral: {
    zh: '爆款种草风：标题要吸睛、有钩子，正文用第一人称分享体验，多用 emoji 表情，结尾带话题标签',
    en: 'Viral recommendation style: catchy title with hook, first-person experience sharing, lots of emojis, end with hashtags',
  },
  emotional: {
    zh: '情感共鸣风：标题走心，正文讲故事引发共鸣，语气真诚温暖，结尾有金句',
    en: 'Emotional resonance style: heartfelt title, storytelling body, sincere warm tone, ending with a quotable line',
  },
  tutorial: {
    zh: '干货教程风：标题突出价值，正文用步骤化结构，每步配 emoji，结尾总结要点',
    en: 'Tutorial style: value-driven title, step-by-step body structure, emojis for each step, summary at end',
  },
  review: {
    zh: '测评分享风：标题客观中肯，正文分维度点评，列出优缺点，结尾给购买建议',
    en: 'Review style: objective title, multi-dimensional body, pros and cons listed, purchase recommendation at end',
  },
}

// ===== 通用 AI 调用函数（OpenAI 兼容接口）=====
async function callAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const baseUrl = process.env.AI_BASE_URL
  const apiKey = process.env.AI_API_KEY
  const model = process.env.AI_MODEL

  if (!baseUrl || !apiKey || !model) {
    throw new Error('AI_CONFIG_MISSING: 请在 .env 中配置 AI_BASE_URL / AI_API_KEY / AI_MODEL')
  }

  const res = await fetch(`${baseUrl.replace(/\/+$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8, // 文案创作适当调高随机性；如果你的模型不支持此参数报错，删掉这行即可
      // 若使用智谱 glm-4.5 系列想关闭深度思考提速，取消下一行注释：
      // thinking: { type: 'disabled' },
    }),
    signal: AbortSignal.timeout(120_000), // 2 分钟超时，防止请求挂死
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`AI_API_ERROR ${res.status}: ${errText.slice(0, 300)}`)
  }

  const data = await res.json()
  return data?.choices?.[0]?.message?.content || ''
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const { sourceText, style = 'viral', lang = 'zh' } = await req.json()

    if (!sourceText || typeof sourceText !== 'string') {
      return NextResponse.json({ error: 'source_required' }, { status: 400 })
    }

    if (sourceText.length < 50) {
      return NextResponse.json({ error: 'source_too_short' }, { status: 400 })
    }

    if (sourceText.length > 8000) {
      return NextResponse.json({ error: 'source_too_long' }, { status: 400 })
    }

    const stylePrompt = STYLE_PROMPTS[style]?.[lang as 'zh' | 'en'] || STYLE_PROMPTS.viral.zh

    const systemPrompt = lang === 'en'
      ? `You are a top Xiaohongshu (Little Red Book) copywriter. Your task is to transform long-form articles into viral Xiaohongshu posts.

Style requirements: ${stylePrompt}

Output format (STRICT):
1. Title line: starts with 【】, 15-25 chars, eye-catching
2. Body: 3-5 short paragraphs, each 1-3 sentences, separated by blank lines
3. Use emojis naturally (5-10 total), don't overuse
4. End with 3-5 relevant hashtags starting with #
5. Total length: 200-400 chars

CRITICAL RULES:
- Sound like a real person, NOT an AI
- Use casual, conversational tone
- Include personal feelings and experiences
- Avoid clichés like "今天给大家分享" or "姐妹们"
- Don't use markdown formatting
- Don't add any meta commentary or explanations
- Output ONLY the post content, nothing else`
      : `你是一位顶级小红书爆款文案写手。你的任务是把长文章转化为小红书爆款笔记。

风格要求：${stylePrompt}

输出格式（严格遵守）：
1. 标题行：以【】开头，15-25字，吸睛有钩子
2. 正文：3-5个短段落，每段1-3句话，段落之间空一行
3. 自然使用 emoji 表情（共5-10个），不要堆砌
4. 结尾带3-5个相关话题标签，以#开头
5. 总字数：200-400字

绝对规则：
- 像真人说话，不要 AI 味
- 用口语化、生活化的表达
- 加入个人感受和体验
- 避免烂大街的开头如"今天给大家分享"、"姐妹们"
- 不要使用 markdown 格式
- 不要添加任何元说明或解释
- 只输出文案内容，不要输出其他任何东西`

    const result = await callAI(
      systemPrompt,
      `请把以下文章转化为小红书爆款文案：\n\n${sourceText}`
    )

    if (!result) {
      return NextResponse.json({ error: 'generate_failed' }, { status: 500 })
    }

    // Extract title from result (first line with 【】)
    const lines = result.split('\n').filter(l => l.trim())
    const titleLine = lines.find(l => l.includes('【')) || lines[0] || '小红书文案'
    const title = titleLine.replace(/【|】/g, '').slice(0, 50)

    // Save to history
    const history = await db.history.create({
      data: {
        userId: user.id,
        title,
        sourceText: sourceText.slice(0, 5000),
        result,
        style,
      },
    })

    return NextResponse.json({
      result,
      historyId: history.id,
      title,
    })
  } catch (e) {
    console.error('Generate error:', e)
    // 方便排查：把 AI 相关错误透传给前端（上线前不想暴露细节可删掉这两个 if）
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.startsWith('AI_CONFIG_MISSING')) {
      return NextResponse.json({ error: 'ai_config_missing' }, { status: 500 })
    }
    if (msg.startsWith('AI_API_ERROR')) {
      return NextResponse.json({ error: 'ai_api_error', detail: msg }, { status: 502 })
    }
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
