'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface PerformanceChartsProps {
  studentId: string
}

export default function PerformanceCharts({ studentId }: PerformanceChartsProps) {
  const [performanceData, setPerformanceData] = useState<any[]>([])
  const [subjectData, setSubjectData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPerformanceData()
  }, [studentId])

  const fetchPerformanceData = async () => {
    try {
      // Fetch student results grouped by exam
      const response = await fetch(`/api/student-results/${studentId}`)
      const data = await response.json()
      
      if (data.results && data.results.length > 0) {
        // Group by exam and calculate average
        const examGroups: Record<string, any> = {}
        data.results.forEach((result: any) => {
          if (!examGroups[result.exam_name]) {
            examGroups[result.exam_name] = { total: 0, count: 0, marks: 0, max: 0 }
          }
          examGroups[result.exam_name].count += 1
          examGroups[result.exam_name].marks += result.marks_obtained
          examGroups[result.exam_name].max += result.max_marks
        })

        const perfData = Object.entries(examGroups).map(([exam, stats]: any) => ({
          exam: exam,
          score: Math.round((stats.marks / stats.max) * 100),
          average: 75,
        }))
        setPerformanceData(perfData)

        // Subject-wise data
        const subjectGroups: Record<string, any> = {}
        data.results.forEach((result: any) => {
          if (!subjectGroups[result.subject_name]) {
            subjectGroups[result.subject_name] = { total: 0, count: 0 }
          }
          subjectGroups[result.subject_name].total += result.marks_obtained
          subjectGroups[result.subject_name].count += 1
        })

        const subjData = Object.entries(subjectGroups).map(([subject, stats]: any) => ({
          subject: subject,
          score: Math.round(stats.total / stats.count),
        }))
        setSubjectData(subjData)
      }
    } catch (error) {
      console.error('[v0] Error fetching performance data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Trend</CardTitle>
          <CardDescription>Your scores compared to class average</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading data...</div>
          ) : performanceData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No performance data available yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="exam" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }} />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={2} name="Your Score" />
                <Line type="monotone" dataKey="average" stroke="var(--color-muted-foreground)" strokeWidth={2} strokeDasharray="5 5" name="Class Average" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
          <CardDescription>Your scores by subject</CardDescription>
        </CardHeader>
        <CardContent>
          {subjectData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No subject data available yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="subject" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }} />
                <Bar dataKey="score" fill="var(--color-primary)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
