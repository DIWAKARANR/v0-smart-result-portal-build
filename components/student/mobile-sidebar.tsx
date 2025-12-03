'use client'

import Link from 'next/link'
import { BarChart3, Trophy, TrendingUp, Award, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StudentMobileSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  isOpen: boolean
  onClose: () => void
}

export default function StudentMobileSidebar({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
}: StudentMobileSidebarProps) {
  const tabs = [
    { id: 'results', label: 'My Results', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'badges', label: 'Achievements', icon: Trophy },
    { id: 'predictions', label: 'AI Predictions', icon: Award },
    { id: 'feedback', label: 'AI Feedback', icon: Sparkles },
  ]

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Mobile Menu */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-64 border-r border-border bg-sidebar transform transition-transform duration-200 z-50 md:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">SmartResult</h2>
            <p className="text-xs text-muted-foreground mt-1">Student</p>
          </div>
          <button onClick={onClose} className="md:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  onClose()
                }}
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
    </>
  )
}
