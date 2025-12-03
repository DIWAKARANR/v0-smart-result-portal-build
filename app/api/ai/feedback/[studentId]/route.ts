import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: Request,
  { params }: { params: { studentId: string } }
) {
  try {
    // Fetch student's actual results
    const { data: results, error } = await supabase
      .from('results')
      .select('marks_obtained, max_marks, subjects(name)')
      .eq('student_id', params.studentId)

    if (error || !results || results.length === 0) {
      return new Response(JSON.stringify({ feedback: [] }), { status: 200 })
    }

    // Generate feedback based on actual performance
    const feedback = results.map((result: any) => {
      const percentage = (result.marks_obtained / (result.max_marks || 100)) * 100
      let emotion_tone: 'encouraging' | 'neutral' | 'challenging'
      let feedback_text = ''
      let improvement_tips: string[] = []

      if (percentage >= 80) {
        emotion_tone = 'encouraging'
        feedback_text = `Excellent performance in ${result.subjects?.name}! You scored ${result.marks_obtained}/${result.max_marks} marks. Your strong understanding and consistent effort are paying off. Keep up this outstanding work!`
        improvement_tips = [
          'Help peers understand challenging topics',
          'Explore advanced concepts beyond curriculum',
          'Challenge yourself with complex problems'
        ]
      } else if (percentage >= 70) {
        emotion_tone = 'neutral'
        feedback_text = `Good work in ${result.subjects?.name}! Your score of ${result.marks_obtained}/${result.max_marks} shows solid understanding. With focused practice on weak areas, you can achieve higher grades.`
        improvement_tips = [
          'Identify and practice weak topics',
          'Review previous exams for patterns',
          'Join study groups for peer learning'
        ]
      } else if (percentage >= 60) {
        emotion_tone = 'neutral'
        feedback_text = `Average performance in ${result.subjects?.name} with ${result.marks_obtained}/${result.max_marks} marks. You need more focus and consistent practice to improve your scores.`
        improvement_tips = [
          'Create a structured study schedule',
          'Break topics into smaller chunks',
          'Take regular practice tests'
        ]
      } else {
        emotion_tone = 'challenging'
        feedback_text = `Your score of ${result.marks_obtained}/${result.max_marks} in ${result.subjects?.name} indicates you need significant improvement. This is a critical moment to buckle down and seek help. With dedicated effort, you can quickly improve.`
        improvement_tips = [
          'Seek one-on-one tutoring support',
          'Focus on fundamentals first',
          'Practice daily without missing sessions',
          'Talk to your teacher about difficulties'
        ]
      }

      return {
        subject: result.subjects?.name || 'Unknown',
        feedback_text,
        emotion_tone,
        improvement_tips,
      }
    })

    return new Response(JSON.stringify({ feedback }), { status: 200 })
  } catch (error) {
    console.error('[v0] Feedback error:', error)
    return new Response(JSON.stringify({ feedback: [] }), { status: 200 })
  }
}
