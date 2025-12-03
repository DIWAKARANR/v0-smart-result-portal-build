'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Lightbulb, Heart, AlertCircle } from 'lucide-react'

interface FeedbackItem {
  subject: string
  feedback_text: string
  emotion_tone: 'encouraging' | 'neutral' | 'challenging'
  improvement_tips: string[]
}

interface AIFeedbackProps {
  studentId: string
}

export default function AIFeedback({ studentId }: AIFeedbackProps) {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFeedback()
  }, [studentId])

  const fetchFeedback = async () => {
    try {
      const response = await fetch(`/api/ai/feedback/${studentId}`)
      const data = await response.json()
      setFeedback(data.feedback || generateMockFeedback())
    } catch (error) {
      console.error('Error fetching feedback:', error)
      setFeedback(generateMockFeedback())
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockFeedback = (): FeedbackItem[] => [
    {
      subject: 'Mathematics',
      feedback_text: 'Excellent performance in Mathematics! Your scores have consistently improved. You demonstrate strong problem-solving skills and are mastering complex concepts.',
      emotion_tone: 'encouraging',
      improvement_tips: [
        'Challenge yourself with advanced problems',
        'Explore different solution methods',
        'Help peers understand concepts'
      ],
    },
    {
      subject: 'Science',
      feedback_text: 'Great work! Your understanding of practical concepts is excellent. Focus on strengthening your theoretical knowledge in a few areas.',
      emotion_tone: 'encouraging',
      improvement_tips: [
        'Review theory chapters thoroughly',
        'Practice more numerical problems',
        'Conduct revision sessions weekly'
      ],
    },
    {
      subject: 'English',
      feedback_text: 'You have room for improvement in comprehension skills. Consistent effort will help you master this subject.',
      emotion_tone: 'neutral',
      improvement_tips: [
        'Read regularly and diversify your reading',
        'Practice paragraph writing daily',
        'Focus on grammar fundamentals'
      ],
    },
    {
      subject: 'Geography',
      feedback_text: 'Your performance has been declining recently. It\'s time to buckle down and focus on core concepts. With dedicated effort, you can recover quickly.',
      emotion_tone: 'challenging',
      improvement_tips: [
        'Create concept maps for each topic',
        'Use visual aids and diagrams',
        'Join study groups for support'
      ],
    },
  ]

  const getToneIcon = (tone: string) => {
    switch (tone) {
      case 'encouraging':
        return <Heart className="w-5 h-5 text-green-500" />
      case 'challenging':
        return <AlertCircle className="w-5 h-5 text-orange-500" />
      default:
        return <Lightbulb className="w-5 h-5 text-blue-500" />
    }
  }

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'encouraging':
        return 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20'
      case 'challenging':
        return 'border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-900/20'
      default:
        return 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20'
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle>Personalized AI Feedback</CardTitle>
          </div>
          <CardDescription>
            Emotion-linked feedback tailored to your performance and emotional context
          </CardDescription>
        </CardHeader>
      </Card>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading feedback...</div>
      ) : (
        <div className="space-y-4">
          {feedback.map((item, i) => (
            <Card key={i} className={`border-2 ${getToneColor(item.emotion_tone)}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{item.subject}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      {getToneIcon(item.emotion_tone)}
                      <span className="capitalize">{item.emotion_tone} Tone</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground italic">"{item.feedback_text}"</p>

                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-primary" />
                    Improvement Tips
                  </h4>
                  <ul className="space-y-2 ml-6">
                    {item.improvement_tips.map((tip, j) => (
                      <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
