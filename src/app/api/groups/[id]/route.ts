import { NextRequest, NextResponse } from 'next/server'
import { getAuthClient, getAdminClient } from '@/lib/supabase/api-helpers'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const auth = getAuthClient()
  const { data: { user } } = await auth.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = getAdminClient()
  const { data: membership } = await admin
    .from('group_members').select('role').eq('group_id', id).eq('user_id', user.id).single()
  if (!membership) return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })

  const [{ data: group }, { data: memberRows }] = await Promise.all([
    admin.from('groups').select('*').eq('id', id).single(),
    admin.from('group_members').select('user_id, role').eq('group_id', id),
  ])

  const members = await Promise.all(
    (memberRows || []).map(async (m) => {
      const { data } = await admin.auth.admin.getUserById(m.user_id)
      return {
        user_id: m.user_id,
        role: m.role,
        display_name: data.user?.user_metadata?.name || data.user?.email?.split('@')[0] || 'Onbekend',
        email: data.user?.email || '',
      }
    })
  )

  return NextResponse.json({ group, members })
}
