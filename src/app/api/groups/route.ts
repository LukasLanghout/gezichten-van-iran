import { NextRequest, NextResponse } from 'next/server'
import { getAuthClient, getAdminClient } from '@/lib/supabase/api-helpers'

export async function GET() {
  const auth = getAuthClient()
  const { data: { user } } = await auth.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = getAdminClient()
  const { data: memberRows } = await admin
    .from('group_members').select('group_id').eq('user_id', user.id)

  const groupIds = memberRows?.map(r => r.group_id) || []
  if (groupIds.length === 0) return NextResponse.json([])

  const { data: groups } = await admin.from('groups').select('*').in('id', groupIds)
  return NextResponse.json(groups || [])
}

export async function POST(request: NextRequest) {
  const auth = getAuthClient()
  const { data: { user } } = await auth.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, description } = await request.json()
  if (!name) return NextResponse.json({ error: 'Naam verplicht' }, { status: 400 })

  const admin = getAdminClient()
  const { data: group, error } = await admin
    .from('groups').insert({ name, description, created_by: user.id }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await admin.from('group_members').insert({ group_id: group.id, user_id: user.id, role: 'admin' })
  return NextResponse.json(group)
}
