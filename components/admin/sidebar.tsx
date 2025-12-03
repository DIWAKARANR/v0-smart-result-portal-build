'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BarChart3, BookOpen, Settings, Users, Trophy, Bell, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const router = useRouter()
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'exams', label: 'Exams', icon: BookOpen },
    { id: 'results', label: 'Results', icon: BookOpen },
    { id: 'rankings', label: 'Rankings', icon: Trophy },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const handleTabClick = (tabId: string) => {
    if (tabId === 'settings') {
      router.push('/admin/settings')
    } else {
      setActiveTab(tabId)
    }
  }

  return (
    <aside className="w-64 border-r border-border bg-sidebar">
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold text-primary">SmartResult</h2>
        <p className="text-xs text-muted-foreground mt-1">Admin Portal</p>
      </div>

      <nav className="p-4 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium',
                activeTab === tab.id
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
