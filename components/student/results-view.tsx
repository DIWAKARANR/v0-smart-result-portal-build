'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, Share2, Copy } from 'lucide-react'
import { gradeConfig } from '@/lib/types'

interface Result {
  id: string
  exam_id: string
  exam_name: string
  subject_id: string
  subject_name: string
  marks_obtained: number
  max_marks: number
  grade: string
  exam_date: string
  student_name?: string
  register_no?: string
}

interface ResultsViewProps {
  studentId: string
}

export default function ResultsView({ studentId }: ResultsViewProps) {
  const [results, setResults] = useState<Result[]>([])
  const [student, setStudent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedExam, setSelectedExam] = useState<string>('')
  const [shareMessage, setShareMessage] = useState<string>('')

  useEffect(() => {
    const storedStudent = localStorage.getItem('student')
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent))
    }
    fetchResults()
  }, [studentId])

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/student-results/${studentId}`)
      const data = await response.json()
      setResults(data.results || [])
      if (data.results?.length > 0) {
        setSelectedExam(data.results[0].exam_id)
      }
    } catch (error) {
      console.error('[v0] Error fetching results:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getGradeColor = (marks: number, maxMarks: number): keyof typeof gradeConfig => {
    const percentage = (marks / maxMarks) * 100
    if (percentage >= 80) return 'a'
    if (percentage >= 70) return 'b'
    if (percentage >= 60) return 'c'
    if (percentage >= 50) return 'd'
    return 'f'
  }

  const filteredResults = selectedExam
    ? results.filter((r) => r.exam_id === selectedExam)
    : results

  const examList = Array.from(
    new Map(results.map((r) => [r.exam_id, r.exam_name])).entries()
  ).map(([id, name]) => ({ id, name }))

  const totalMarks = filteredResults.reduce((sum, r) => sum + r.marks_obtained, 0)
  const maxTotal = filteredResults.reduce((sum, r) => sum + r.max_marks, 0)
  const percentage = maxTotal > 0 ? ((totalMarks / maxTotal) * 100).toFixed(2) : '0'

  const handleDownloadResults = () => {
    if (filteredResults.length === 0) {
      alert('No results to download')
      return
    }

    const headers = ['Student Name', 'Register No', 'Exam', 'Subject', 'Marks Obtained', 'Max Marks', 'Percentage', 'Grade']
    const rows = filteredResults.map(r => [
      student?.name || 'N/A',
      student?.register_no || 'N/A',
      r.exam_name,
      r.subject_name,
      r.marks_obtained,
      r.max_marks,
      ((r.marks_obtained / r.max_marks) * 100).toFixed(2),
      r.grade.toUpperCase()
    ])

    let csv = headers.join(',') + '\n'
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n'
    })

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${student?.name || 'results'}_${selectedExam}_${new Date().toISOString().split('T')[0]}.csv`)
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleShareResults = () => {
    const shareText = `Check out my exam results: ${totalMarks}/${maxTotal} (${percentage}%) - Grade: ${getGradeColor(totalMarks, maxTotal).toUpperCase()}`
    
    if (navigator.share) {
      navigator.share({
        title: 'My Exam Results',
        text: shareText,
      }).catch(err => {
        console.log('[v0] Share error:', err)
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
          setShareMessage('Results copied to clipboard!')
          setTimeout(() => setShareMessage(''), 3000)
        })
      })
    } else {
      // Fallback for browsers without Share API
      navigator.clipboard.writeText(shareText).then(() => {
        setShareMessage('Results copied to clipboard!')
        setTimeout(() => setShareMessage(''), 3000)
      }).catch(() => {
        alert(shareText)
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Exam Selection */}
      {examList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Exam</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {examList.map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => setSelectedExam(exam.id)}
                  className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-colors text-sm md:text-base ${
                    selectedExam === exam.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                >
                  {exam.name}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Card */}
      {filteredResults.length > 0 && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Exam Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <div className="text-center p-3 md:p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl md:text-3xl font-bold text-primary">{totalMarks}</div>
                <div className="text-xs md:text-sm text-muted-foreground">Total Marks</div>
              </div>
              <div className="text-center p-3 md:p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl md:text-3xl font-bold text-primary">{percentage}%</div>
                <div className="text-xs md:text-sm text-muted-foreground">Percentage</div>
              </div>
              <div className="text-center p-3 md:p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl md:text-3xl font-bold">
                  <span className={gradeConfig[getGradeColor(totalMarks, maxTotal)].color}>
                    {getGradeColor(totalMarks, maxTotal).toUpperCase()}
                  </span>
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">Overall Grade</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Table */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Subject-wise Results</CardTitle>
            <CardDescription className="text-xs md:text-sm">Your marks and grades for each subject</CardDescription>
          </div>
          <div className="flex gap-2 flex-col sm:flex-row">
            <Button variant="outline" size="sm" className="flex items-center gap-2 text-xs md:text-sm" onClick={handleDownloadResults}>
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">CSV</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2 text-xs md:text-sm" onClick={handleShareResults}>
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </CardHeader>

        {shareMessage && (
          <div className="px-6 py-2 bg-green-50 dark:bg-green-950/30 border-t border-green-200 dark:border-green-800 text-green-900 dark:text-green-100 text-sm">
            {shareMessage}
          </div>
        )}

        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Loading results...</div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No results available yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 md:px-4 font-semibold">Subject</th>
                    <th className="text-center py-3 px-2 md:px-4 font-semibold">Marks</th>
                    <th className="text-center py-3 px-2 md:px-4 font-semibold hidden sm:table-cell">Percentage</th>
                    <th className="text-center py-3 px-2 md:px-4 font-semibold">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((result) => {
                    const percent = ((result.marks_obtained / result.max_marks) * 100).toFixed(1)
                    const gradeKey = getGradeColor(result.marks_obtained, result.max_marks)
                    const config = gradeConfig[gradeKey]

                    return (
                      <tr key={result.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-2 md:px-4 font-medium">{result.subject_name}</td>
                        <td className="text-center py-3 px-2 md:px-4 text-sm">
                          {result.marks_obtained}/{result.max_marks}
                        </td>
                        <td className="text-center py-3 px-2 md:px-4 text-muted-foreground hidden sm:table-cell">{percent}%</td>
                        <td className="text-center py-3 px-2 md:px-4">
                          <span
                            className={`inline-block w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full font-bold text-white text-xs md:text-sm ${config.bgColor}`}
                          >
                            {gradeKey.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
