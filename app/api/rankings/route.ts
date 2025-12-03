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

    const { data: students, error } = await supabase
      .from('students')
      .select(`
        id, 
        name, 
        register_no,
        results(marks_obtained)
      `)
      .eq('admin_id', adminId)

    if (error) throw error

    // Calculate rankings
    const rankings = (students || [])
      .map((student: any) => ({
        ...student,
        total_marks: student.results?.reduce((sum: number, r: any) => sum + r.marks_obtained, 0) || 0,
        badges: Math.floor((student.results?.length || 0) / 3),
      }))
      .sort((a: any, b: any) => b.total_marks - a.total_marks)
      .map((student: any, index: number) => ({
        rank: index + 1,
        name: student.name,
        register_no: student.register_no,
        total_marks: student.total_marks,
        percentage: student.results?.length > 0 ? Math.floor((student.total_marks / (student.results.length * 100)) * 100) : 0,
        badges: student.badges,
      }))

    return Response.json({ rankings })
  } catch (error) {
    console.error('[v0] Error fetching rankings:', error)
    return Response.json({ rankings: [] }, { status: 200 })
  }
}
