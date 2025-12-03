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
      .from('students')
      .select('*')
      .eq('admin_id', adminId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return Response.json({ students: data || [] })
  } catch (error) {
    console.error('[v0] Error fetching students:', error)
    return Response.json({ students: [] }, { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const { admin_id, register_no, name, dob, class: studentClass, section } = await request.json()
    
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
      .from('students')
      .insert([{ admin_id, register_no, name, dob, class: studentClass, section }])
      .select()

    if (error) throw error
    return Response.json({ student: data[0] }, { status: 201 })
  } catch (error) {
    console.error('[v0] Error adding student:', error)
    return Response.json({ error: 'Failed to add student' }, { status: 500 })
  }
}
