'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface AddExamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddExam: (data: any) => void
  examTypes: any[]
}

export default function AddExamDialog({ open, onOpenChange, onAddExam, examTypes }: AddExamDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    exam_type_id: '',
    exam_date: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddExam(formData)
    setFormData({ name: '', exam_type_id: '', exam_date: '' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Exam</DialogTitle>
          <DialogDescription>Create a new exam for your school</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Exam Name</label>
            <Input
              name="name"
              placeholder="e.g., Physics Paper 1"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Exam Type</label>
            <select
              name="exam_type_id"
              value={formData.exam_type_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
              required
            >
              <option value="">Select exam type</option>
              {examTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Exam Date</label>
            <Input
              name="exam_date"
              type="date"
              value={formData.exam_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Add Exam
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
