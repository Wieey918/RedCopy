import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/session'

export async function DELETE(req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'missing_id' }, { status: 400 })
    }

    const history = await db.history.findUnique({ where: { id } })
    if (!history || history.userId !== user.id) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }

    await db.history.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('History delete error:', e)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
