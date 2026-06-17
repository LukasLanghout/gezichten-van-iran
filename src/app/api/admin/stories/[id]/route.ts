import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

type CookieToSet = { name: string; value: string; options?: object }

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const adminClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: (_: CookieToSet[]) => {} } }
  )
  const body = await request.json()
  const { error } = await adminClient.from('stories').update({ status: body.status }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
