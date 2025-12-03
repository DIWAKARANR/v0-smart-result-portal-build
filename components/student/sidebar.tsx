'use client'

import Link from 'next/link'
import { BarChart3, Trophy, TrendingUp, Award, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StudentSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function StudentSidebar({ activeTab, setActiveTab }: StudentSidebarProps) {
  const tabs = [
    { id: 'results', label: 'My Results', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'badges', label: 'Achievements', icon: Trophy },
    { id: 'predictions', label: 'AI Predictions', icon: Award },
    { id: 'feedback', label: 'AI Feedback', icon: Sparkles },
  ]

  return (
    <aside className="w-64 border-r border-border bg-sidebar">
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold text-primary">SmartResult</h2>
        <p className="text-xs text-muted-foreground mt-1">Student Portal</p>
      </div>

      <nav className="p-4 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
