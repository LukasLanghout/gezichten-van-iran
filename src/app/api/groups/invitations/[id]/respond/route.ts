import { NextRequest, NextResponse } from 'next/server'
import { getAuthClient, getAdminClient } from '@/lib/supabase/api-helpers'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const auth = getAuthClient()
  const { data: { user } } = await auth.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action } = await request.json()
  if (action !== 'accept' && action !== 'reject')
    return NextResponse.json({ error: 'Ongeldige actie' }, { status: 400 })

  const admin = getAdminClient()
  const { data: invitation } = await admin
    .from('group_invitations').select('*').eq('id', id).eq('invited_email', user.email!).single()
  if (!invitation) return NextResponse.json({ error: 'Uitnodiging niet gevonden' }, { status: 404 })

  await admin.from('group_invitations').update({ status: action === 'accept' ? 'accepted' : 'rejected' }).eq('id', id)

  if (action === 'accept') {
    await admin.from('group_members').insert({
      group_id: invitation.group_id,
      user_id: user.id,
      role: 'member',
    })
  }

  return NextResponse.json({ success: true })
}
