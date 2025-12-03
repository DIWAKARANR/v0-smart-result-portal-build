'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, TrendingUp } from 'lucide-react'

export default function AnalyticsReports() {
  const [downloadingReport, setDownloadingReport] = useState<string | null>(null)
  const [reportData, setReportData] = useState<any>(null)

  useEffect(() => {
    fetchReportData()
  }, [])

  const fetchReportData = async () => {
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

      setReportData({
        students: studentsData.students || [],
        exams: examsData.exams || [],
        results: resultsData.results || [],
      })
    } catch (error) {
      console.error('[v0] Error fetching report data:', error)
    }
  }

  const generateStudentPerformanceReport = () => {
    if (!reportData || reportData.students.length === 0) return ''

    let csv = 'Student Name,Register No,Total Exams,Average Score %,Grade\n'

    const studentMap: Record<string, any> = {}
    reportData.results.forEach((result: any) => {
      if (!studentMap[result.student_id]) {
        const student = reportData.students.find((s: any) => s.id === result.student_id)
        studentMap[result.student_id] = {
          name: student?.name || 'Unknown',
          register_no: student?.register_no || 'N/A',
          marks: [],
          maxMarks: [],
        }
      }
      studentMap[result.student_id].marks.push(result.marks_obtained || 0)
      studentMap[result.student_id].maxMarks.push(result.max_marks || 100)
    })

    Object.entries(studentMap).forEach(([_, data]: any) => {
      const totalMarks = data.marks.reduce((a: number, b: number) => a + b, 0)
      const totalMaxMarks = data.maxMarks.reduce((a: number, b: number) => a + b, 0)
      const average = totalMaxMarks > 0 ? ((totalMarks / totalMaxMarks) * 100).toFixed(2) : '0'

      let grade = 'F'
      if (average >= 80) grade = 'A'
      else if (average >= 70) grade = 'B'
      else if (average >= 60) grade = 'C'
      else if (average >= 50) grade = 'D'

      csv += `"${data.name}","${data.register_no}",${data.marks.length},${average},${grade}\n`
    })

    return csv
  }

  const generateSubjectWiseReport = () => {
    if (!reportData || reportData.results.length === 0) return ''

    let csv = 'Subject,Average Score %,Grade,Total Students Appeared\n'

    const subjectMap: Record<string, any> = {}
    reportData.results.forEach((result: any) => {
      if (!subjectMap[result.subject_name]) {
        subjectMap[result.subject_name] = { marks: [], students: new Set() }
      }
      subjectMap[result.subject_name].marks.push(result.marks_obtained || 0)
      subjectMap[result.subject_name].students.add(result.student_id)
    })

    Object.entries(subjectMap).forEach(([subject, data]: any) => {
      const totalMarks = data.marks.reduce((a: number, b: number) => a + b, 0)
      const average = (totalMarks / data.marks.length).toFixed(2)

      let grade = 'F'
      if (average >= 80) grade = 'A'
      else if (average >= 70) grade = 'B'
      else if (average >= 60) grade = 'C'
      else if (average >= 50) grade = 'D'

      csv += `"${subject}",${average},${grade},${data.students.size}\n`
    })

    return csv
  }

  const handleDownloadReport = (reportType: string) => {
    setDownloadingReport(reportType)
    try {
      let csv = ''
      let filename = ''

      if (reportType === 'Student Performance Report') {
        csv = generateStudentPerformanceReport() || ''
        filename = `student_performance_${new Date().toISOString().split('T')[0]}.csv`
      } else if (reportType === 'Subject-wise Analytics') {
        csv = generateSubjectWiseReport() || ''
        filename = `subject_analytics_${new Date().toISOString().split('T')[0]}.csv`
      } else if (reportType === 'Class Comparison') {
        csv = 'Note: Add classes (BCA, BSC) to students and use admin dashboard for comparison.\n'
        filename = `class_comparison_guide_${new Date().toISOString().split('T')[0]}.txt`
      } else {
        csv = 'Grade Distribution Report\n' + 
              'Grade,Count\n'
        const gradeCount: Record<string, number> = {}
        reportData.results.forEach((r: any) => {
          const g = r.grade?.toUpperCase() || 'F'
          gradeCount[g] = (gradeCount[g] || 0) + 1
        })
        Object.entries(gradeCount).forEach(([grade, count]) => {
          csv += `${grade},${count}\n`
        })
        filename = `grade_distribution_${new Date().toISOString().split('T')[0]}.csv`
      }

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      window.URL.revokeObjectURL(url)

      console.log(`[v0] ${reportType} downloaded successfully!`)
    } catch (error) {
      console.error('[v0] Error downloading report:', error)
      alert('Failed to download report')
    } finally {
      setDownloadingReport(null)
    }
  }

  const reports = [
    {
      name: 'Student Performance Report',
      description: 'All students with marks, grades and average performance',
    },
    {
      name: 'Subject-wise Analytics',
      description: 'Average performance for each subject across all students',
    },
    {
      name: 'Grade Distribution',
      description: 'Breakdown of grades A, B, C, D, F',
    },
    {
      name: 'Class Comparison',
      description: 'Compare performance between classes',
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Available Reports
          </CardTitle>
          <CardDescription>Download analytics and performance reports with actual data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map((report, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <TrendingUp className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-foreground">{report.name}</h4>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Generated: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 ml-4 flex-shrink-0"
                  onClick={() => handleDownloadReport(report.name)}
                  disabled={downloadingReport === report.name}
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">{downloadingReport === report.name ? 'Downloading...' : 'CSV'}</span>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
