import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
  await supabase.from('qr_scans').insert({ source: 'homepage' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gezichten-van-iran.vercel.app'
  return NextResponse.redirect(siteUrl)
}
