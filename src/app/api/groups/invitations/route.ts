import { NextResponse } from 'next/server'
import { getAuthClient, getAdminClient } from '@/lib/supabase/api-helpers'

export async function GET() {
  const auth = getAuthClient()
  const { data: { user } } = await auth.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = getAdminClient()
  const { data } = await admin
    .from('group_invitations')
    .select('id, group_id, group_name, invited_by_name, created_at')
    .eq('invited_email', user.email!)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  return NextResponse.json(data || [])
}
