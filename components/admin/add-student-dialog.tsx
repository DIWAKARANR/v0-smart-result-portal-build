'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface AddStudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddStudent: (data: any) => void
}

export default function AddStudentDialog({ open, onOpenChange, onAddStudent }: AddStudentDialogProps) {
  const [formData, setFormData] = useState({
    register_no: '',
    name: '',
    dob: '',
    class: '',
    section: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddStudent(formData)
    setFormData({ register_no: '', name: '', dob: '', class: '', section: '' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>Enter student details to add to the system</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Register No</label>
            <Input
              name="register_no"
              placeholder="e.g., REG001"
              value={formData.register_no}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              name="name"
              placeholder="Student name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Date of Birth</label>
            <Input
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Class</label>
            <Input
              name="class"
              placeholder="e.g., 10A"
              value={formData.class}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Section</label>
            <Input
              name="section"
              placeholder="e.g., A"
              value={formData.section}
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
              Add Student
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
