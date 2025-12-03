'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { LogOut, Save } from 'lucide-react'
import AdminSidebar from '@/components/admin/sidebar'

export default function AdminSettingsPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)
  const [schoolName, setSchoolName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin')
    if (!storedAdmin) {
      router.push('/admin/login')
      return
    }
    const adminData = JSON.parse(storedAdmin)
    setAdmin(adminData)
    setSchoolName(adminData.school_name || '')
    setEmail(adminData.email || '')
    setIsLoading(false)
  }, [router])

  const handleSaveSettings = async () => {
    try {
      const updatedAdmin = { ...admin, school_name: schoolName }
      localStorage.setItem('admin', JSON.stringify(updatedAdmin))
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('[v0] Error saving settings:', error)
      alert('Failed to save settings')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin')
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar activeTab="settings" setActiveTab={() => {}} />

      <main className="flex-1 overflow-auto">
        <div className="border-b border-border bg-card sticky top-0 z-10">
          <div className="flex items-center justify-between p-6">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="p-6 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
              <CardDescription>Update your school details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">School Name</label>
                <Input
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Enter school name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={email}
                  disabled
                  className="bg-muted"
                  placeholder="Email"
                />
              </div>
              <Button onClick={handleSaveSettings} className="bg-primary hover:bg-primary/90 w-full flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
