import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/session'

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const histories = await db.history.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json({
      histories: histories.map(h => ({
        id: h.id,
        title: h.title,
        sourceText: h.sourceText,
        result: h.result,
        style: h.style,
        createdAt: h.createdAt.toISOString(),
      })),
    })
  } catch (e) {
    console.error('History list error:', e)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
