'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogOut, Menu, X } from 'lucide-react'
import StudentSidebar from '@/components/student/sidebar'
import StudentMobileSidebar from '@/components/student/mobile-sidebar'
import ResultsView from '@/components/student/results-view'
import PerformanceCharts from '@/components/student/performance-charts'
import StudentBadges from '@/components/student/badges'
import AIPredictions from '@/components/student/ai-predictions'
import AIFeedback from '@/components/student/ai-feedback'

export default function StudentDashboardPage() {
  const router = useRouter()
  const [student, setStudent] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('results')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedStudent = localStorage.getItem('student')
    if (!storedStudent) {
      router.push('/student/login')
      return
    }
    setStudent(JSON.parse(storedStudent))
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('student')
    localStorage.removeItem('studentToken')
    router.push('/student/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <StudentSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Mobile Sidebar */}
      <StudentMobileSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 overflow-auto w-full">
        <div className="border-b border-border bg-card sticky top-0 z-10">
          <div className="flex items-center justify-between p-4 md:p-6 gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground truncate">Student Portal</h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1 truncate">
                {student?.name} • {student?.register_no}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-muted rounded"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {activeTab === 'results' && <ResultsView studentId={student?.id} />}
          {activeTab === 'performance' && <PerformanceCharts studentId={student?.id} />}
          {activeTab === 'badges' && <StudentBadges studentId={student?.id} />}
          {activeTab === 'predictions' && <AIPredictions studentId={student?.id} />}
          {activeTab === 'feedback' && <AIFeedback studentId={student?.id} />}
        </div>
      </main>
    </div>
  )
}
