import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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

    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', params.id)

    if (error) throw error
    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[v0] Error deleting student:', error)
    return Response.json({ error: 'Failed to delete student' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { register_no, name, dob, class: studentClass, section } = await request.json()
    
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
      .update({ register_no, name, dob, class: studentClass, section })
      .eq('id', params.id)
      .select()

    if (error) throw error
    return Response.json({ student: data[0] }, { status: 200 })
  } catch (error) {
    console.error('[v0] Error updating student:', error)
    return Response.json({ error: 'Failed to update student' }, { status: 500 })
  }
}
