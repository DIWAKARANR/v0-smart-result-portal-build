import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const adminId = searchParams.get('adminId')
    
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
      .select('*, exam_type:exam_types(*)')
      .eq('admin_id', adminId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return Response.json({ exams: data || [] })
  } catch (error) {
    console.error('[v0] Error fetching exams:', error)
    return Response.json({ exams: [] }, { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const { admin_id, exam_type_id, name, exam_date } = await request.json()
    
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
      .insert([{ admin_id, exam_type_id, name, exam_date, is_published: false }])
      .select()

    if (error) throw error
    return Response.json({ exam: data[0] }, { status: 201 })
  } catch (error) {
    console.error('[v0] Error adding exam:', error)
    return Response.json({ error: 'Failed to add exam' }, { status: 500 })
  }
}
