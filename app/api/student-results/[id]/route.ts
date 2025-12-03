import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return []
          },
        },
      }
    )

    const { data: results, error } = await supabase
      .from('results')
      .select(`
        id,
        marks_obtained,
        grade,
        exams(id, name, exam_date, is_published),
        subjects(id, name, max_marks)
      `)
      .eq('student_id', params.id)
      .eq('exams.is_published', true)
      .order('exams(exam_date)', { ascending: false })

    if (error) throw error

    // Map results to include exam and subject details
    const formattedResults = results?.map((r: any) => ({
      id: r.id,
      exam_id: r.exams?.id,
      exam_name: r.exams?.name,
      exam_date: r.exams?.exam_date,
      subject_id: r.subjects?.id,
      subject_name: r.subjects?.name,
      marks_obtained: r.marks_obtained,
      max_marks: r.subjects?.max_marks || 100,
      grade: r.grade,
    })) || []

    return Response.json({ results: formattedResults }, { status: 200 })
  } catch (error) {
    console.error('[v0] Error:', error)
    return Response.json({ error: 'Failed to fetch results', results: [] }, { status: 500 })
  }
}
