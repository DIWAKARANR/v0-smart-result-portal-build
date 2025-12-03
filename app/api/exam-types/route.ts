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
      .from('exam_types')
      .select('*')
      .eq('admin_id', adminId)
      .order('order_index', { ascending: true })

    if (error) throw error
    return Response.json({ examTypes: data || [] })
  } catch (error) {
    console.error('[v0] Error fetching exam types:', error)
    return Response.json({ examTypes: [] }, { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const { admin_id, name, order_index } = await request.json()
    
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
      .from('exam_types')
      .insert([{ admin_id, name, order_index }])
      .select()

    if (error) throw error
    return Response.json({ examType: data[0] }, { status: 201 })
  } catch (error) {
    console.error('[v0] Error adding exam type:', error)
    return Response.json({ error: 'Failed to add exam type' }, { status: 500 })
  }
}
