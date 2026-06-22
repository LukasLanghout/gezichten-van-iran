import { NextRequest, NextResponse } from 'next/server'
import { getAuthClient, getAdminClient } from '@/lib/supabase/api-helpers'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const auth = getAuthClient()
  const { data: { user } } = await auth.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = getAdminClient()
  const { data: membership } = await admin
    .from('group_members').select('role').eq('group_id', id).eq('user_id', user.id).single()
  if (!membership || membership.role !== 'admin')
    return NextResponse.json({ error: 'Geen rechten' }, { status: 403 })

  const { email } = await request.json()
  if (!email) return NextResponse.json({ error: 'E-mailadres verplicht' }, { status: 400 })

  // Check for existing pending invite
  const { data: existing } = await admin
    .from('group_invitations').select('id').eq('group_id', id).eq('invited_email', email).eq('status', 'pending').maybeSingle()
  if (existing) return NextResponse.json({ error: 'Er is al een uitnodiging verstuurd' }, { status: 400 })

  // Check already a member
  const { data: allUsers } = await admin.auth.admin.listUsers()
  const invitedUser = allUsers?.users.find(u => u.email === email)
  if (invitedUser) {
    const { data: alreadyMember } = await admin
      .from('group_members').select('id').eq('group_id', id).eq('user_id', invitedUser.id).maybeSingle()
    if (alreadyMember) return NextResponse.json({ error: 'Deze gebruiker is al lid' }, { status: 400 })
  }

  const { data: group } = await admin.from('groups').select('name').eq('id', id).single()
  const inviterName = user.user_metadata?.name || user.email?.split('@')[0] || 'Iemand'

  const { error } = await admin.from('group_invitations').insert({
    group_id: id,
    invited_email: email,
    invited_by: user.id,
    invited_by_name: inviterName,
    group_name: group?.name || '',
    status: 'pending',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
