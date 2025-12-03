import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { exam_id, student_id, subject_id, marks_obtained, admin_id } = await request.json()
    
    if (!admin_id) {
      return Response.json({ error: 'Admin ID is required' }, { status: 400 })
    }

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

    // Get subject max marks for grade calculation
    const { data: subject, error: subjectError } = await supabase
      .from('subjects')
      .select('max_marks')
      .eq('id', subject_id)
      .maybeSingle()

    if (subjectError) throw subjectError

    const percentage = (marks_obtained / subject.max_marks) * 100
    let grade = 'F'
    if (percentage >= 80) grade = 'A'
    else if (percentage >= 70) grade = 'B'
    else if (percentage >= 60) grade = 'C'
    else if (percentage >= 50) grade = 'D'

    const { data, error } = await supabase
      .from('results')
      .upsert(
        [{ exam_id, student_id, subject_id, marks_obtained, grade, admin_id }],
        { onConflict: 'exam_id,student_id,subject_id' }
      )
      .select()

    if (error) throw error
    return Response.json({ result: data[0] }, { status: 201 })
  } catch (error) {
    console.error('[v0] Error adding result:', error)
    return Response.json({ error: 'Failed to add result' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const adminId = searchParams.get('adminId')
    const examId = searchParams.get('examId')
    
    if (!adminId && !examId) {
      return Response.json({ results: [] }, { status: 200 })
    }

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

    let query = supabase
      .from('results')
      .select('*, subject:subjects(*)')

    if (examId) {
      query = query.eq('exam_id', examId)
    } else if (adminId) {
      query = query.eq('admin_id', adminId)
    }

    const { data, error } = await query

    if (error) throw error
    return Response.json({ results: data || [] })
  } catch (error) {
    console.error('[v0] Error fetching results:', error)
    return Response.json({ results: [] }, { status: 200 })
  }
}
