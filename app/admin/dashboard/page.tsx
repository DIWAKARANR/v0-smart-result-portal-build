'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogOut, Users, BookOpen, BarChart3, Settings, Plus } from 'lucide-react'
import AdminSidebar from '@/components/admin/sidebar'
import DashboardStats from '@/components/admin/dashboard-stats'
import StudentManagement from '@/components/admin/student-management'
import ExamManagement from '@/components/admin/exam-management'
import ResultManagement from '@/components/admin/result-management'
import RankingDashboard from '@/components/admin/ranking-dashboard'
import NotificationSystem from '@/components/admin/notification-system'
import AnalyticsReports from '@/components/admin/analytics-reports'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin')
    if (!storedAdmin) {
      router.push('/admin/login')
      return
    }
    setAdmin(JSON.parse(storedAdmin))
    setIsLoading(false)
  }, [router])

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
          <p className="text-muted-foreground">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-auto">
        <div className="border-b border-border bg-card sticky top-0 z-10">
          <div className="flex items-center justify-between p-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">{admin?.school_name || 'Your School'}</p>
            </div>
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

        <div className="p-6">
          {activeTab === 'overview' && <DashboardStats />}
          {activeTab === 'students' && <StudentManagement />}
          {activeTab === 'exams' && <ExamManagement />}
          {activeTab === 'results' && <ResultManagement />}
          {activeTab === 'rankings' && <RankingDashboard />}
          {activeTab === 'notifications' && <NotificationSystem />}
          {activeTab === 'reports' && <AnalyticsReports />}
        </div>
      </main>
    </div>
  )
}
