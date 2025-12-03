'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import AddStudentDialog from './add-student-dialog'

interface Student {
  id: string
  register_no: string
  name: string
  dob: string
  class: string
  section: string
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const admin = JSON.parse(localStorage.getItem('admin') || '{}')
      const response = await fetch(`/api/students?adminId=${admin.id}`)
      const data = await response.json()
      setStudents(data.students || [])
    } catch (error) {
      console.error('[v0] Error fetching students:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddStudent = async (studentData: any) => {
    try {
      const admin = JSON.parse(localStorage.getItem('admin') || '{}')
      
      if (editingStudent) {
        const response = await fetch(`/api/students/${editingStudent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentData),
        })
        if (response.ok) {
          setEditingStudent(null)
          setShowAddDialog(false)
          fetchStudents()
        }
      } else {
        // Add new student
        const response = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...studentData, admin_id: admin.id }),
        })
        if (response.ok) {
          setShowAddDialog(false)
          fetchStudents()
        }
      }
    } catch (error) {
      console.error('[v0] Error saving student:', error)
    }
  }

  const handleDeleteStudent = async (studentId: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        await fetch(`/api/students/${studentId}`, { method: 'DELETE' })
        fetchStudents()
      } catch (error) {
        console.error('[v0] Error deleting student:', error)
      }
    }
  }

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student)
    setShowAddDialog(true)
  }

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.register_no.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Student Management</CardTitle>
            <CardDescription>Add, edit, and manage student records</CardDescription>
          </div>
          <Button
            onClick={() => {
              setEditingStudent(null)
              setShowAddDialog(true)
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </Button>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 bg-input rounded-lg px-3 py-2 border border-border">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or register no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 bg-transparent outline-none"
            />
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading students...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No students found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Register No</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">DOB</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Class</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Section</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-foreground">{student.register_no}</td>
                      <td className="py-3 px-4 text-foreground">{student.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{new Date(student.dob).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-foreground">{student.class}</td>
                      <td className="py-3 px-4 text-foreground">{student.section}</td>
                      <td className="py-3 px-4 text-right flex gap-2 justify-end">
                        <button
                          onClick={() => handleEditStudent(student)}
                          className="p-2 hover:bg-muted rounded text-primary"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="p-2 hover:bg-muted rounded text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddStudentDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddStudent={handleAddStudent}
        initialStudent={editingStudent}
      />
    </div>
  )
}
