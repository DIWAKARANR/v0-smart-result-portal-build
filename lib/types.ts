// Type definitions for SmartResult Portal

export interface Admin {
  id: string
  email: string
  school_name: string
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  admin_id: string
  register_no: string
  name: string
  dob: string
  class: string
  section: string
  email?: string
  created_at: string
  updated_at: string
}

export interface ExamType {
  id: string
  admin_id: string
  name: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface Exam {
  id: string
  admin_id: string
  exam_type_id: string
  name: string
  exam_date: string
  publish_date: string
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Subject {
  id: string
  admin_id: string
  name: string
  max_marks: number
  created_at: string
  updated_at: string
}

export interface Result {
  id: string
  exam_id: string
  student_id: string
  subject_id: string
  marks_obtained: number
  max_marks: number
  grade: string
  created_at: string
  updated_at: string
}

export interface StudentRanking {
  id: string
  exam_id: string
  student_id: string
  rank: number
  total_marks: number
  percentage: number
  created_at: string
  updated_at: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon_url: string
  badge_type: 'top_performer' | 'most_improved' | 'consistent_achiever'
}

export interface StudentBadge {
  id: string
  student_id: string
  badge_id: string
  earned_at: string
}

export interface AiFeedback {
  id: string
  exam_id: string
  student_id: string
  feedback_text: string
  emotion_tone: 'encouraging' | 'neutral' | 'challenging'
  improvement_tips: string
  created_at: string
}

export interface GradePrediction {
  id: string
  student_id: string
  predicted_grade: string
  predicted_marks: number
  confidence_score: number
  created_at: string
}

export type GradeColor = 'a' | 'b' | 'c' | 'd' | 'f'

export const gradeConfig: Record<GradeColor, { color: string; bgColor: string; percentage: number }> = {
  a: { color: 'text-[#4CAF50]', bgColor: 'bg-[#4CAF50]', percentage: 80 },
  b: { color: 'text-[#2196F3]', bgColor: 'bg-[#2196F3]', percentage: 70 },
  c: { color: 'text-[#FFC107]', bgColor: 'bg-[#FFC107]', percentage: 60 },
  d: { color: 'text-[#FF9800]', bgColor: 'bg-[#FF9800]', percentage: 50 },
  f: { color: 'text-[#F44336]', bgColor: 'bg-[#F44336]', percentage: 0 },
}
