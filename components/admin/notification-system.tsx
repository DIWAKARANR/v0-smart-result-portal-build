'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bell, MessageSquare, Mail, Phone } from 'lucide-react'

interface NotificationConfig {
  whatsapp: boolean
  email: boolean
  sms: boolean
  triggers: {
    resultPublished: boolean
    poorPerformance: boolean
    topPerformer: boolean
    newBadge: boolean
  }
}

interface Student {
  id: string
  name: string
  register_no: string
  email?: string
  phone?: string
  dob: string
}

export default function NotificationSystem() {
  const [config, setConfig] = useState<NotificationConfig>({
    whatsapp: true,
    email: true,
    sms: false,
    triggers: {
      resultPublished: true,
      poorPerformance: true,
      topPerformer: true,
      newBadge: true,
    },
  })
  const [testPhone, setTestPhone] = useState('')
  const [testEmail, setTestEmail] = useState('')
  const [isTestSending, setIsTestSending] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [selectedStudent, setSelectedStudent] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudentContact, setSelectedStudentContact] = useState<{ email?: string; phone?: string }>({})

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
    }
  }

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId)
    const student = students.find(s => s.id === studentId)
    if (student) {
      setSelectedStudentContact({
        email: student.email,
        phone: student.phone
      })
      // Auto-fill test fields for notification sending
      if (student.email) setTestEmail(student.email)
      if (student.phone) setTestPhone(student.phone)
    }
  }

  const toggleChannel = (channel: 'whatsapp' | 'email' | 'sms') => {
    setConfig({ ...config, [channel]: !config[channel] })
  }

  const toggleTrigger = (trigger: keyof typeof config.triggers) => {
    setConfig({
      ...config,
      triggers: { ...config.triggers, [trigger]: !config.triggers[trigger] },
    })
  }

  const handleSendTestNotification = async () => {
    if (!testEmail && !testPhone) {
      alert('Please enter email or phone number')
      return
    }

    setIsTestSending(true)
    setTestResult(null)
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'test',
          email: testEmail,
          phone: testPhone,
          message: notificationMessage || 'This is a test notification from SmartResult Portal. Your exam results are ready!',
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setTestResult({
          success: true,
          message: result.message,
          details: result.details
        })
        setTestEmail('')
        setTestPhone('')
        setTimeout(() => setTestResult(null), 5000)
      } else {
        setTestResult({
          success: false,
          message: result.error || 'Failed to send notification'
        })
      }
    } catch (error) {
      console.error('[v0] Error sending notification:', error)
      setTestResult({
        success: false,
        message: 'Error: ' + (error as Error).message
      })
    } finally {
      setIsTestSending(false)
    }
  }

  const channels = [
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare, description: 'Send notifications via WhatsApp' },
    { id: 'email', name: 'Email', icon: Mail, description: 'Send notifications via email' },
    { id: 'sms', name: 'SMS', icon: Phone, description: 'Send notifications via SMS' },
  ]

  const triggers = [
    { id: 'resultPublished', name: 'Results Published', description: 'Notify when exam results are published' },
    { id: 'poorPerformance', name: 'Poor Performance Alert', description: 'Alert for grades D or F' },
    { id: 'topPerformer', name: 'Top Performer', description: 'Celebrate top performers' },
    { id: 'newBadge', name: 'New Achievement', description: 'Notify when badges are earned' },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notification Channels
          </CardTitle>
          <CardDescription>Configure how notifications are sent to students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {channels.map((channel) => {
            const isEnabled = config[channel.id as 'whatsapp' | 'email' | 'sms']
            const Icon = channel.icon

            return (
              <div key={channel.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-semibold text-foreground">{channel.name}</h4>
                    <p className="text-sm text-muted-foreground">{channel.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleChannel(channel.id as 'whatsapp' | 'email' | 'sms')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    isEnabled ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      isEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  ></div>
                </button>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Triggers</CardTitle>
          <CardDescription>Select which events trigger notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {triggers.map((trigger) => {
            const isEnabled = config.triggers[trigger.id as keyof typeof config.triggers]

            return (
              <div key={trigger.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <h4 className="font-semibold text-foreground">{trigger.name}</h4>
                  <p className="text-sm text-muted-foreground">{trigger.description}</p>
                </div>
                <button
                  onClick={() => toggleTrigger(trigger.id as keyof typeof config.triggers)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    isEnabled ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      isEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  ></div>
                </button>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Notifications</CardTitle>
          <CardDescription>Send a test notification to verify channels are working</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter phone number for WhatsApp (e.g., +91XXXXXXXXXX)"
            type="tel"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            disabled={isTestSending}
          />
          <Input
            placeholder="Enter email address for testing"
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            disabled={isTestSending}
          />
          <Button
            className="w-full bg-primary hover:bg-primary/90"
            onClick={handleSendTestNotification}
            disabled={isTestSending}
          >
            {isTestSending ? 'Sending...' : 'Send Test Notification'}
          </Button>

          {testResult && (
            <div className={`p-4 rounded-lg border ${
              testResult.success 
                ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
            }`}>
              <p className={`text-sm font-semibold ${
                testResult.success
                  ? 'text-green-900 dark:text-green-100'
                  : 'text-red-900 dark:text-red-100'
              }`}>
                {testResult.success ? '✓ Success!' : '✗ Error'}
              </p>
              <p className={`text-sm mt-1 ${
                testResult.success
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {testResult.message}
              </p>
              {testResult.details && (
                <div className={`text-xs mt-2 font-mono ${
                  testResult.success
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  {JSON.stringify(testResult.details, null, 2)}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Send Marks to Students</CardTitle>
          <CardDescription>Select student and send their marks via email or WhatsApp</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => handleStudentSelect(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
            >
              <option value="">Choose a student...</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.register_no})
                </option>
              ))}
            </select>
          </div>

          {selectedStudent && (
            <div className="p-3 bg-muted rounded-lg border border-border text-sm">
              <p className="text-muted-foreground">
                {selectedStudentContact.email && <span>Email: {selectedStudentContact.email}</span>}
                {selectedStudentContact.email && selectedStudentContact.phone && <span> • </span>}
                {selectedStudentContact.phone && <span>Phone: {selectedStudentContact.phone}</span>}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <textarea
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              placeholder="e.g., Hi {name}, your exam marks are ready. Login to view your results!"
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground min-h-20"
            />
          </div>

          <Button
            className="w-full bg-primary hover:bg-primary/90"
            onClick={() => {
              if (!selectedStudent) {
                alert('Please select a student')
                return
              }
              if (!notificationMessage.trim()) {
                alert('Please enter a message')
                return
              }
              if (!testEmail && !testPhone) {
                alert('Student has no email or phone number set')
                return
              }
              handleSendTestNotification()
            }}
            disabled={isTestSending || !selectedStudent}
          >
            {isTestSending ? 'Sending...' : 'Send to Student'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
