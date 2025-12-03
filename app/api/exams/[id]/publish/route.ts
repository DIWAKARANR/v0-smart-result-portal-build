import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    const { data, error } = await supabase
      .from('exams')
      .update({ is_published: true, publish_date: new Date().toISOString() })
      .eq('id', params.id)
      .select()

    if (error) throw error
    return Response.json({ exam: data[0] }, { status: 200 })
  } catch (error) {
    console.error('[v0] Error publishing exam:', error)
    return Response.json({ error: 'Failed to publish exam' }, { status: 500 })
  }
}
