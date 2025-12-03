import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { register_no, dob } = await request.json()

    if (!register_no || !dob) {
      return new Response(
        JSON.stringify({ error: 'Register No and DOB are required' }),
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    const { data: student, error: queryError } = await supabase
      .from('students')
      .select('id, register_no, name, dob, class, section')
      .eq('register_no', register_no)
      .eq('dob', dob)
      .maybeSingle()

    if (queryError) {
      console.error('[v0] Error querying student:', queryError)
      throw queryError
    }

    if (!student) {
      return new Response(
        JSON.stringify({ error: 'Invalid Register No or Date of Birth' }),
        { status: 401 }
      )
    }

    return new Response(
      JSON.stringify({
        student: {
          id: student.id,
          register_no: student.register_no,
          name: student.name,
          dob: student.dob,
          class: student.class,
          section: student.section,
        },
        token: Buffer.from(`${student.id}:${Date.now()}`).toString('base64'),
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Student login error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    )
  }
}
