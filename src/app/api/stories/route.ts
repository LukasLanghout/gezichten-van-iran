import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}

export async function GET() {
  const supabase = createAdminClient()
  const { data } = await supabase.from('stories').select('*').eq('status', 'approved').order('created_at', { ascending: false })
  return NextResponse.json(data || [])
}

export async function POST(request: NextRequest) {
  const supabase = createAdminClient()
  const formData = await request.formData()
  const firstName = formData.get('first_name') as string
  const city = formData.get('city') as string
  const country = formData.get('country') as string
  const storyText = formData.get('story_text') as string
  const photo = formData.get('photo') as File | null

  let photoUrl: string | null = null
  if (photo && photo.size > 0) {
    const bytes = await photo.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileName = `${Date.now()}-${photo.name}`
    const { error } = await supabase.storage.from('photos').upload(fileName, buffer, { contentType: photo.type })
    if (!error) {
      const { data } = supabase.storage.from('photos').getPublicUrl(fileName)
      photoUrl = data.publicUrl
    }
  }

  const { error } = await supabase.from('stories').insert({
    first_name: firstName, city, country, story_text: storyText, photo_url: photoUrl, status: 'pending'
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
