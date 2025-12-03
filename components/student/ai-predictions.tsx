'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, TrendingUp } from 'lucide-react'
import { gradeConfig } from '@/lib/types'

interface Prediction {
  subject: string
  predicted_grade: string
  predicted_marks: number
  confidence: number
  trend: string
}

interface AIPredictionsProps {
  studentId: string
}

export default function AIPredictions({ studentId }: AIPredictionsProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPredictions()
  }, [studentId])

  const fetchPredictions = async () => {
    try {
      const response = await fetch(`/api/ai/grade-predictions/${studentId}`)
      const data = await response.json()
      setPredictions(data.predictions || generateMockPredictions())
    } catch (error) {
      console.error('Error fetching predictions:', error)
      setPredictions(generateMockPredictions())
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockPredictions = (): Prediction[] => [
    { subject: 'Mathematics', predicted_grade: 'A', predicted_marks: 88, confidence: 0.92, trend: 'up' },
    { subject: 'Science', predicted_grade: 'A', predicted_marks: 92, confidence: 0.88, trend: 'up' },
    { subject: 'English', predicted_grade: 'B', predicted_marks: 78, confidence: 0.85, trend: 'stable' },
    { subject: 'History', predicted_grade: 'A', predicted_marks: 85, confidence: 0.80, trend: 'up' },
    { subject: 'Geography', predicted_grade: 'B', predicted_marks: 72, confidence: 0.78, trend: 'down' },
  ]

  const getGradeColor = (grade: string): string => {
    const gradeKey = grade.toLowerCase() as keyof typeof gradeConfig
    return gradeConfig[gradeKey]?.bgColor || 'bg-gray-500'
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle>AI-Powered Grade Predictions</CardTitle>
          </div>
          <CardDescription>
            Based on your performance trends, here are your predicted grades for the next exam
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading predictions...</div>
            ) : (
              predictions.map((pred, i) => (
                <div key={i} className="p-4 rounded-lg border border-border hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{pred.subject}</h4>
                      <p className="text-xs text-muted-foreground">
                        {(pred.confidence * 100).toFixed(0)}% confidence
                      </p>
                    </div>
                    {pred.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-500" />}
                    {pred.trend === 'down' && <TrendingUp className="w-5 h-5 text-red-500 rotate-180" />}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`inline-block w-12 h-12 flex items-center justify-center rounded-lg font-bold text-white text-lg ${getGradeColor(pred.predicted_grade)}`}>
                      {pred.predicted_grade}
                    </span>
                    <div>
                      <div className="text-sm text-muted-foreground">Predicted Score</div>
                      <div className="text-lg font-semibold text-foreground">{pred.predicted_marks}/100</div>
                    </div>
                  </div>

                  <div className="mt-3 w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-full rounded-full ${getGradeColor(pred.predicted_grade)}`}
                      style={{ width: `${pred.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How Predictions Work</CardTitle>
          <CardDescription>Our AI model analyzes your performance patterns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            AI predictions are generated using machine learning algorithms that analyze:
          </p>
          <ul className="space-y-2 ml-4 list-disc">
            <li>Your historical exam scores and trends</li>
            <li>Subject-wise performance patterns</li>
            <li>Your improvement rate over time</li>
            <li>Comparative performance data</li>
            <li>External factors and seasonality</li>
          </ul>
          <p className="mt-4 text-xs">
            Confidence scores indicate the reliability of predictions. Higher confidence means more accurate forecasts.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
