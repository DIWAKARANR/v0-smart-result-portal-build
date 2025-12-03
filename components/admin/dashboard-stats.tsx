'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, BookOpen, TrendingUp, Award } from 'lucide-react'

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalExams: 0,
    avgPerformance: 0,
    topPerformers: 0,
  })
  const [performanceData, setPerformanceData] = useState<any[]>([])
  const [gradeDistribution, setGradeDistribution] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const admin = JSON.parse(localStorage.getItem('admin') || '{}')
      if (!admin.id) return

      const [studentsRes, examsRes, resultsRes] = await Promise.all([
        fetch(`/api/students?adminId=${admin.id}`),
        fetch(`/api/exams?adminId=${admin.id}`),
        fetch(`/api/results?adminId=${admin.id}`)
      ])

      const studentsData = await studentsRes.json()
      const examsData = await examsRes.json()
      const resultsData = await resultsRes.json()

      const totalStudents = studentsData.students?.length || 0
      const totalExams = examsData.exams?.length || 0
      const allResults = resultsData.results || []

      let totalMarks = 0
      let totalMaxMarks = 0
      let gradeCount: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 }
      const studentGrades: Record<string, string> = {}
      const examPerformance: Record<string, { marks: number; total: number; count: number }> = {}

      allResults.forEach((result: any) => {
        totalMarks += result.marks_obtained || 0
        totalMaxMarks += result.max_marks || 100
        const grade = result.grade?.toUpperCase() || 'F'
        gradeCount[grade] = (gradeCount[grade] || 0) + 1
        if (!studentGrades[result.student_id]) {
          studentGrades[result.student_id] = grade
        }

        // Track exam-wise performance
        const examName = result.exam_name || 'Unknown'
        if (!examPerformance[examName]) {
          examPerformance[examName] = { marks: 0, total: 0, count: 0 }
        }
        examPerformance[examName].marks += result.marks_obtained || 0
        examPerformance[examName].total += result.max_marks || 100
        examPerformance[examName].count += 1
      })

      const avgPerformance = totalMaxMarks > 0 ? ((totalMarks / totalMaxMarks) * 100).toFixed(1) : '0'
      const topPerformers = Object.values(studentGrades).filter(g => g === 'A').length

      setStats({
        totalStudents,
        totalExams,
        avgPerformance: parseFloat(avgPerformance),
        topPerformers,
      })

      setGradeDistribution([
        { name: 'A', value: gradeCount['A'] || 0, color: '#4CAF50' },
        { name: 'B', value: gradeCount['B'] || 0, color: '#2196F3' },
        { name: 'C', value: gradeCount['C'] || 0, color: '#FFC107' },
        { name: 'D', value: gradeCount['D'] || 0, color: '#FF9800' },
        { name: 'F', value: gradeCount['F'] || 0, color: '#F44336' },
      ])

      const trendData = Object.entries(examPerformance).map(([examName, data]) => ({
        name: examName,
        avg: parseFloat(((data.marks / data.total) * 100).toFixed(1))
      }))

      setPerformanceData(trendData.length > 0 ? trendData : [
        { name: 'No Exams Yet', avg: 0 }
      ])
    } catch (error) {
      console.error('[v0] Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Registered students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <BookOpen className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExams}</div>
            <p className="text-xs text-muted-foreground">Exams conducted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <TrendingUp className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgPerformance}%</div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
            <Award className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topPerformers}</div>
            <p className="text-xs text-muted-foreground">Grade A students</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
            <CardDescription>Average scores across exams</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading data...</div>
            ) : performanceData.length === 0 || performanceData[0].avg === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No exam data available yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }} />
                  <Line type="monotone" dataKey="avg" stroke="var(--color-primary)" strokeWidth={2} name="Average Score %" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription>Student grades breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {gradeDistribution.every(g => g.value === 0) ? (
              <div className="text-center py-8 text-muted-foreground">No results published yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {gradeDistribution.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
