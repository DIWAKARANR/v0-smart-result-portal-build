'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Upload, Download } from 'lucide-react'

interface Exam {
  id: string
  name: string
  exam_type_id?: string
  exam_type_name?: string
}

interface ExamType {
  id: string
  name: string
}

interface Subject {
  id: string
  name: string
  max_marks: number
}

interface Student {
  id: string
  name: string
  register_no: string
}

interface Result {
  id: string
  student_id: string
  student_name: string
  register_no: string
  exam_id: string
  exam_name: string
  subject_id: string
  subject_name: string
  marks_obtained: number
  grade: string
}

export default function ResultManagement() {
  const [exams, setExams] = useState<Exam[]>([])
  const [examTypes, setExamTypes] = useState<ExamType[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [selectedExam, setSelectedExam] = useState('')
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [marks, setMarks] = useState('')
  const [newSubjectName, setNewSubjectName] = useState('')
  const [newSubjectMaxMarks, setNewSubjectMaxMarks] = useState('100')
  const [results, setResults] = useState<Result[]>([])
  const [isAddingResult, setIsAddingResult] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const admin = JSON.parse(localStorage.getItem('admin') || '{}')
      if (!admin.id) return

      // Fetch all data in parallel
      const [examsRes, examTypesRes, subjectsRes, studentsRes] = await Promise.all([
        fetch(`/api/exams?adminId=${admin.id}`),
        fetch(`/api/exam-types?adminId=${admin.id}`),
        fetch(`/api/subjects?adminId=${admin.id}`),
        fetch(`/api/students?adminId=${admin.id}`)
      ])

      const examsData = await examsRes.json()
      const examTypesData = await examTypesRes.json()
      const subjectsData = await subjectsRes.json()
      const studentsData = await studentsRes.json()

      setExams(examsData.exams || [])
      setExamTypes(examTypesData.exam_types || [])
      setSubjects(subjectsData.subjects || [])
      setStudents(studentsData.students || [])
    } catch (error) {
      console.error('[v0] Error fetching data:', error)
    }
  }

  const fetchResults = async (examId: string) => {
    if (!examId) return
    try {
      const response = await fetch(`/api/results?examId=${examId}`)
      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error('[v0] Error fetching results:', error)
    }
  }

  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) return

    try {
      const admin = JSON.parse(localStorage.getItem('admin') || '{}')
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_id: admin.id,
          name: newSubjectName,
          max_marks: parseInt(newSubjectMaxMarks),
        }),
      })

      if (response.ok) {
        setNewSubjectName('')
        setNewSubjectMaxMarks('100')
        fetchData()
      }
    } catch (error) {
      console.error('[v0] Error adding subject:', error)
    }
  }

  const handleAddResult = async () => {
    if (!selectedExam || !selectedStudent || !selectedSubject || !marks) {
      alert('Please fill all fields')
      return
    }

    setIsAddingResult(true)
    try {
      const admin = JSON.parse(localStorage.getItem('admin') || '{}')
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: selectedExam,
          student_id: selectedStudent,
          subject_id: selectedSubject,
          marks_obtained: parseInt(marks),
          admin_id: admin.id,
        }),
      })

      if (response.ok) {
        setMarks('')
        setSelectedStudent('')
        setSelectedSubject('')
        fetchResults(selectedExam)
        alert('Result added successfully!')
      } else {
        const error = await response.json()
        alert('Error: ' + error.error)
      }
    } catch (error) {
      console.error('[v0] Error adding result:', error)
      alert('Failed to add result')
    } finally {
      setIsAddingResult(false)
    }
  }

  const handleDownloadTemplate = () => {
    if (!selectedExam) {
      alert('Please select an exam first')
      return
    }

    const exam = exams.find(e => e.id === selectedExam)
    const headers = ['Student Register No', 'Student Name', 'Subject Name', 'Max Marks', 'Marks Obtained']
    const rows = students.map(s => [
      s.register_no,
      s.name,
      selectedSubject && subjects.find(sub => sub.id === selectedSubject)?.name || 'Subject',
      selectedSubject && subjects.find(sub => sub.id === selectedSubject)?.max_marks || '100',
      ''
    ])

    let csv = headers.join(',') + '\n'
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n'
    })

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `template_${exam?.name || 'exam'}_${new Date().toISOString().split('T')[0]}.csv`)
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadResults = () => {
    if (results.length === 0) {
      alert('No results found for this exam')
      return
    }

    const headers = ['Student Name', 'Register No', 'Exam', 'Subject', 'Marks', 'Grade']
    const rows = results.map(r => [
      r.student_name,
      r.register_no,
      r.exam_name,
      r.subject_name,
      r.marks_obtained,
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
    link.setAttribute('download', `results_${selectedExam}_${new Date().toISOString().split('T')[0]}.csv`)
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subjects</CardTitle>
          <CardDescription>Manage subjects and their maximum marks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-col sm:flex-row">
            <Input
              placeholder="Subject name..."
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Max marks"
              value={newSubjectMaxMarks}
              onChange={(e) => setNewSubjectMaxMarks(e.target.value)}
              className="w-full sm:w-24"
            />
            <Button onClick={handleAddSubject} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {subjects.map((subject) => (
              <div key={subject.id} className="p-3 bg-muted/50 rounded-lg border border-border">
                <div className="font-medium text-foreground">{subject.name}</div>
                <div className="text-sm text-muted-foreground">Max: {subject.max_marks} marks</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Results</CardTitle>
          <CardDescription>Enter individual student marks for an exam</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Exam Type</label>
              <select
                value={selectedExam}
                onChange={(e) => {
                  setSelectedExam(e.target.value)
                  if (e.target.value) fetchResults(e.target.value)
                }}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
              >
                <option value="">Choose exam type (CAT 1, CAT 2, etc)</option>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
              >
                <option value="">Choose a student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.register_no})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
              >
                <option value="">Choose a subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Marks</label>
              <Input
                type="number"
                placeholder="Enter marks"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                max="100"
              />
            </div>
          </div>
          <Button 
            onClick={handleAddResult} 
            disabled={isAddingResult}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isAddingResult ? 'Adding...' : 'Add Result'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-col sm:flex-row">
            <Button variant="outline" className="flex items-center gap-2" onClick={handleDownloadTemplate}>
              <Download className="w-4 h-4" />
              Download Template
            </Button>
            <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2" onClick={handleDownloadResults}>
              <Download className="w-4 h-4" />
              Download Results
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Color-Coded Grade System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            <div className="text-center">
              <div className="w-10 h-10 bg-green-500 rounded mx-auto mb-2"></div>
              <div className="text-sm font-semibold">A</div>
              <div className="text-xs text-muted-foreground">80%+</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-500 rounded mx-auto mb-2"></div>
              <div className="text-sm font-semibold">B</div>
              <div className="text-xs text-muted-foreground">70-79%</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-yellow-500 rounded mx-auto mb-2"></div>
              <div className="text-sm font-semibold">C</div>
              <div className="text-xs text-muted-foreground">60-69%</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-orange-500 rounded mx-auto mb-2"></div>
              <div className="text-sm font-semibold">D</div>
              <div className="text-xs text-muted-foreground">50-59%</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-red-500 rounded mx-auto mb-2"></div>
              <div className="text-sm font-semibold">F</div>
              <div className="text-xs text-muted-foreground">{'<50%'}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
