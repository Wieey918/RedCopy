# 红文社 RedCopy - AI 小红书爆款文案生成器

> 粘贴文章，AI 帮你提炼精华，生成带 emoji 的人性化小红书爆款文案。
> Paste your article, AI extracts the essence and generates viral Xiaohongshu copy with emojis.

## 项目简介

红文社（RedCopy）是一个基于 AI 的小红书爆款文案生成工具。用户只需粘贴长文章内容，AI 会自动提炼核心观点，按小红书高赞笔记的逻辑重新组织，生成带 emoji 表情符号、口语化、人性化的爆款文案。

### 核心特性

- **AI 智能提炼**：自动识别文章核心观点，去除冗余信息
- **四种文案风格**：爆款种草风、情感共鸣风、干货教程风、测评分享风
- **人性化表达**：拒绝 AI 味，模拟真人语气，自带 emoji
- **中英文双语**：支持中英文界面切换
- **历史记录**：自动保存生成结果，支持查看、复制、删除
- **个人中心**：可编辑头像、昵称、简介
- **赛璐璐动画风**：独特的 Cel Shading 视觉风格

---

## 技术栈

| 分类 | 技术 | 版本 |
|------|------|------|
| 前端框架 | Next.js (App Router) | 16.1.3 |
| 编程语言 | TypeScript | 5.x |
| 样式方案 | Tailwind CSS | 4.x |
| UI 组件 | 自研 Cel Shading 组件库 + shadcn/ui | - |
| 数据库 ORM | Prisma | 6.x |
| 数据库 | SQLite | - |
| AI 能力 | z-ai-web-dev-sdk (GLM 大模型) | latest |
| 认证方案 | Cookie + Session Token (SHA256) | - |
| 包管理器 | Bun | latest |
| 通知组件 | Sonner | latest |
| 国际化 | 自研 i18n Context (zh/en) | - |

---

## 项目目录结构

```
redcopy/
├── prisma/
│   └── schema.prisma              # 数据库模型定义 (User, History)
├── public/                         # 静态资源
├── src/
│   ├── app/                        # Next.js App Router 页面
│   │   ├── layout.tsx              # 根布局（注入 Provider）
│   │   ├── page.tsx                # 首页
│   │   ├── globals.css             # 全局样式（Cel Shading 主题）
│   │   ├── not-found.tsx           # 404 页面
│   │   ├── tool/
│   │   │   └── page.tsx            # 文案工具页（核心功能）
│   │   ├── login/
│   │   │   └── page.tsx            # 登录页
│   │   ├── register/
│   │   │   └── page.tsx            # 注册页
│   │   ├── profile/
│   │   │   └── page.tsx            # 个人中心
│   │   ├── history/
│   │   │   └── page.tsx            # 历史记录
│   │   ├── about/
│   │   │   └── page.tsx            # 关于我们
│   │   ├── contact/
│   │   │   └── page.tsx            # 联系方式
│   │   ├── privacy/
│   │   │   └── page.tsx            # 隐私协议
│   │   ├── terms/
│   │   │   └── page.tsx            # 服务条款
│   │   └── api/                    # API 路由
│   │       ├── auth/
│   │       │   ├── register/route.ts   # 注册
│   │       │   ├── login/route.ts      # 登录
│   │       │   ├── logout/route.ts     # 退出
│   │       │   └── me/route.ts         # 获取当前用户
│   │       ├── user/
│   │       │   └── profile/route.ts   # 更新个人资料
│   │       ├── history/
│   │       │   ├── list/route.ts      # 历史记录列表
│   │       │   └── delete/route.ts    # 删除历史记录
│   │       └── copywriting/
│   │           └── generate/route.ts  # AI 文案生成（核心）
│   ├── components/
│   │   ├── cel/                    # 赛璐璐风格组件库
│   │   │   ├── index.tsx           # CelButton/Card/Input/Badge/BackButton
│   │   │   ├── Navbar.tsx          # 顶部导航栏
│   │   │   └── Footer.tsx          # 页脚
│   │   └── ui/                     # shadcn/ui 基础组件
│   ├── i18n/
│   │   ├── translations.ts         # 中英文翻译字典
│   │   └── I18nProvider.tsx        # 国际化 Context
│   └── lib/
│       ├── db.ts                   # Prisma 客户端
│       ├── auth-context.tsx        # 用户认证 Context
│       ├── session.ts              # Session 管理（加密/解密）
│       └── utils.ts                # 工具函数
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── tailwind.config.ts
└── README.md
```

---

## 本地运行

### 环境要求

- Node.js >= 18.18.0
- Bun（推荐）或 npm/yarn/pnpm

### 安装与启动

```bash
# 1. 安装依赖
bun install
# 或 npm install

# 2. 初始化数据库
bun run db:push
# 或 npx prisma db push

# 3. 启动开发服务器
bun run dev
# 或 npm run dev

# 4. 浏览器访问
# 打开 http://localhost:3000
```

### 生产构建

```bash
# 构建生产版本
bun run build

# 启动生产服务器
bun run start
```

---

## 部署到公网（域名访问）

### 方案一：Vercel 部署（推荐，免费）

1. 将项目代码推送到 GitHub
2. 访问 https://vercel.com ，用 GitHub 账号登录
3. 点击 "New Project"，导入你的 GitHub 仓库
4. 在环境变量中配置（如需）：
   - `DATABASE_URL`：使用 Vercel Postgres 或保留 SQLite（需挂载持久存储）
5. 点击 "Deploy"，等待构建完成
6. 部署成功后，Vercel 会分配一个 `xxx.vercel.app` 域名
7. 在 Vercel 项目设置 → Domains 中绑定你的自定义域名

### 方案二：自有服务器部署

1. 在服务器上安装 Node.js 18+ 和 Bun
2. 上传项目代码到服务器
3. 执行：
   ```bash
   bun install
   bun run db:push
   bun run build
   bun run start  # 默认监听 3000 端口
   ```
4. 使用 Nginx 反向代理，将域名指向 3000 端口：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```
5. 配置 SSL 证书（推荐使用 certbot 申请 Let's Encrypt 免费证书）

### 方案三：Docker 部署

```dockerfile
FROM oven/bun:1
WORKDIR /app
COPY . .
RUN bun install
RUN bun run db:push
RUN bun run build
EXPOSE 3000
CMD ["bun", "run", "start"]
```

---

## 功能清单

### 页面功能

| 页面 | 路径 | 功能说明 | 返回按钮 |
|------|------|----------|----------|
| 首页 | `/` | Hero区+核心特性+使用步骤+CTA | 顶部Logo可回首页 |
| 文案工具 | `/tool` | 粘贴文章→选风格→AI生成→复制 | ✅ 返回首页 |
| 登录 | `/login` | 邮箱密码登录 | ✅ 返回首页 |
| 注册 | `/register` | 邮箱+昵称+密码注册 | ✅ 返回首页 |
| 个人中心 | `/profile` | 编辑头像/昵称/简介，退出登录 | ✅ 返回首页 |
| 历史记录 | `/history` | 查看生成历史，复制/删除 | ✅ 返回首页 |
| 关于我们 | `/about` | 使命/愿景/价值观/团队 | ✅ 返回首页 |
| 联系方式 | `/contact` | 联系方式+留言表单 | ✅ 返回首页 |
| 隐私协议 | `/privacy` | 隐私政策6条 | ✅ 返回首页 |
| 服务条款 | `/terms` | 服务条款6条 | ✅ 返回首页 |
| 404 | `*` | 错误页面 | ✅ 返回首页 |

### 顶部导航栏（从左到右）

1. **Logo** - 红文社品牌标识，点击回首页
2. **导航栏** - 首页 / 文案工具 / 历史记录 / 关于我们 / 联系方式
3. **登录/注册** - 未登录时显示
4. **菜单栏** - 登录后显示用户头像下拉菜单（个人中心 / 历史记录 / 退出登录）
5. **语言切换** - 中文 / English 切换按钮

### AI 文案生成功能

支持 4 种风格：

| 风格 | 说明 |
|------|------|
| 🔥 爆款种草风 | 标题吸睛有钩子，第一人称分享体验，多用 emoji，结尾带话题标签 |
| 💖 情感共鸣风 | 标题走心，讲故事引发共鸣，语气真诚温暖，结尾有金句 |
| 📚 干货教程风 | 标题突出价值，步骤化结构，每步配 emoji，结尾总结要点 |
| ⭐ 测评分享风 | 标题客观中肯，分维度点评，列出优缺点，结尾给购买建议 |

---

## 测试账号

可使用以下测试账号体验（或自行注册新账号）：

- 邮箱：`test@redcopy.app`
- 密码：`test123456`

---

## 设计风格说明

本项目采用**赛璐璐动画风（Cel Shading）**视觉风格：

- **粗黑边框**：所有元素使用 3px 纯黑边框 `#1a1a2e`
- **硬阴影**：无模糊的偏移阴影 `3px 3px 0 #1a1a2e`
- **平面色块**：高饱和度纯色，无渐变
- **配色方案**：
  - 主色红 `#e63946`
  - 辅色蓝 `#4ea8de`
  - 辅色绿 `#2ecc71`
  - 辅色黄 `#f1c40f`
  - 深色 `#1a1a2e`
  - 背景 `#fafaf5`
- **字体**：加粗、大写、紧凑字距
- **交互**：按钮按下时有位移和阴影变化，模拟物理按压感

---

## 许可证

MIT License

---

© 2026 RedCopy. All rights reserved.
