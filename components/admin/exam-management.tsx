'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react'
import AddExamDialog from './add-exam-dialog'

interface ExamType {
  id: string
  name: string
  order_index: number
}

interface Exam {
  id: string
  name: string
  exam_type_id: string
  exam_date: string
  is_published: boolean
  publish_date: string
  exam_type: ExamType
}

interface EditDialogState {
  isOpen: boolean
  exam: Exam | null
}

export default function ExamManagement() {
  const [exams, setExams] = useState<Exam[]>([])
  const [examTypes, setExamTypes] = useState<ExamType[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editDialog, setEditDialog] = useState<EditDialogState>({ isOpen: false, exam: null })
  const [newExamTypeName, setNewExamTypeName] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchExamTypes()
    fetchExams()
  }, [])

  const fetchExamTypes = async () => {
    try {
      const admin = JSON.parse(localStorage.getItem('admin') || '{}')
      const response = await fetch(`/api/exam-types?adminId=${admin.id}`)
      const data = await response.json()
      setExamTypes(data.examTypes || [])
    } catch (error) {
      console.error('[v0] Error fetching exam types:', error)
    }
  }

  const fetchExams = async () => {
    try {
      const admin = JSON.parse(localStorage.getItem('admin') || '{}')
      const response = await fetch(`/api/exams?adminId=${admin.id}`)
      const data = await response.json()
      setExams(data.exams || [])
    } catch (error) {
      console.error('[v0] Error fetching exams:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddExamType = async () => {
    if (!newExamTypeName.trim()) return

    try {
      const admin = JSON.parse(localStorage.getItem('admin') || '{}')
      const response = await fetch('/api/exam-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_id: admin.id,
          name: newExamTypeName,
          order_index: examTypes.length,
        }),
      })

      if (response.ok) {
        setNewExamTypeName('')
        fetchExamTypes()
      }
    } catch (error) {
      console.error('[v0] Error adding exam type:', error)
    }
  }

  const handleAddExam = async (examData: any) => {
    try {
      const admin = JSON.parse(localStorage.getItem('admin') || '{}')
      const response = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...examData, admin_id: admin.id }),
      })

      if (response.ok) {
        setShowAddDialog(false)
        fetchExams()
      }
    } catch (error) {
      console.error('[v0] Error adding exam:', error)
    }
  }

  const handleEditExam = async (examData: any) => {
    if (!editDialog.exam) return

    try {
      const response = await fetch(`/api/exams/${editDialog.exam.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(examData),
      })

      if (response.ok) {
        setEditDialog({ isOpen: false, exam: null })
        fetchExams()
      } else {
        alert('Failed to update exam')
      }
    } catch (error) {
      console.error('[v0] Error updating exam:', error)
      alert('Error updating exam')
    }
  }

  const handlePublishExam = async (examId: string) => {
    try {
      await fetch(`/api/exams/${examId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      fetchExams()
    } catch (error) {
      console.error('[v0] Error publishing exam:', error)
    }
  }

  const filteredExams = exams.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Exam Types Management */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Types</CardTitle>
          <CardDescription>Manage exam types (Quarterly, Half-Yearly, Annual, etc.)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-col sm:flex-row">
            <Input
              placeholder="New exam type..."
              value={newExamTypeName}
              onChange={(e) => setNewExamTypeName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddExamType} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {examTypes.map((type) => (
              <div key={type.id} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {type.name}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exams Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Exams</CardTitle>
            <CardDescription>Create and manage exams</CardDescription>
          </div>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-primary hover:bg-primary/90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Exam
          </Button>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-2 bg-input rounded-lg px-3 py-2 border border-border mb-4">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 bg-transparent outline-none"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading exams...</div>
          ) : filteredExams.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No exams found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Exam Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExams.map((exam) => (
                    <tr key={exam.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{exam.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{exam.exam_type?.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(exam.exam_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            exam.is_published
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}
                        >
                          {exam.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right flex gap-2 justify-end">
                        <button 
                          onClick={() => setEditDialog({ isOpen: true, exam })}
                          className="p-2 hover:bg-muted rounded text-primary"
                          title="Edit exam"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {!exam.is_published && (
                          <button
                            onClick={() => handlePublishExam(exam.id)}
                            className="px-3 py-2 hover:bg-primary/10 rounded text-primary text-sm font-medium"
                          >
                            Publish
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddExamDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddExam={handleAddExam}
        examTypes={examTypes}
      />

      {editDialog.isOpen && editDialog.exam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>Edit Exam</CardTitle>
              <button
                onClick={() => setEditDialog({ isOpen: false, exam: null })}
                className="p-2 hover:bg-muted rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Exam Name</label>
                <Input
                  defaultValue={editDialog.exam.name}
                  id="edit-exam-name"
                  placeholder="Exam name"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Exam Type</label>
                <select
                  defaultValue={editDialog.exam.exam_type_id}
                  id="edit-exam-type"
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                >
                  {examTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Exam Date</label>
                <Input
                  type="date"
                  defaultValue={editDialog.exam.exam_date?.split('T')[0]}
                  id="edit-exam-date"
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setEditDialog({ isOpen: false, exam: null })}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    const name = (document.getElementById('edit-exam-name') as HTMLInputElement)?.value
                    const typeId = (document.getElementById('edit-exam-type') as HTMLSelectElement)?.value
                    const date = (document.getElementById('edit-exam-date') as HTMLInputElement)?.value

                    if (name && typeId && date) {
                      handleEditExam({ name, exam_type_id: typeId, exam_date: date })
                    } else {
                      alert('Please fill in all fields')
                    }
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
