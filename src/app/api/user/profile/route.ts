import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/session'

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data: { nickname?: string; bio?: string; avatar?: string } = {}

    if (typeof body.nickname === 'string' && body.nickname.trim().length > 0) {
      data.nickname = body.nickname.trim().slice(0, 30)
    }
    if (typeof body.bio === 'string') {
      data.bio = body.bio.trim().slice(0, 200)
    }
    if (typeof body.avatar === 'string') {
      data.avatar = body.avatar
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'no_fields' }, { status: 400 })
    }

    const updated = await db.user.update({
      where: { id: user.id },
      data,
      select: {
        id: true,
        email: true,
        nickname: true,
        avatar: true,
        bio: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      user: {
        ...updated,
        createdAt: updated.createdAt.toISOString(),
      },
    })
  } catch (e) {
    console.error('Profile update error:', e)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
