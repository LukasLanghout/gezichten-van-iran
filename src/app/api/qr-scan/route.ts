import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
  await supabase.from('qr_scans').insert({})
  return NextResponse.json({ success: true })
}
