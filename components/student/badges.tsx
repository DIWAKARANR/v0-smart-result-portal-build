'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Star, Zap } from 'lucide-react'

interface Badge {
  name: string
  description: string
  earned: boolean
}

interface StudentBadgesProps {
  studentId: string
}

export default function StudentBadges({ studentId }: StudentBadgesProps) {
  const [badges, setBadges] = useState<Badge[]>([])

  useEffect(() => {
    // Mock badge data
    setBadges([
      {
        name: 'Top Performer',
        description: 'Achieved grade A in all subjects',
        earned: true,
      },
      {
        name: 'Most Improved',
        description: 'Improved score by 15% or more',
        earned: true,
      },
      {
        name: 'Consistent Achiever',
        description: 'Maintained grade A for 3 consecutive exams',
        earned: false,
      },
      {
        name: 'Perfect Attendance',
        description: '100% attendance this semester',
        earned: false,
      },
      {
        name: 'Subject Master',
        description: 'Scored 100% in any subject',
        earned: false,
      },
      {
        name: 'Rising Star',
        description: 'Improved from D to A grade',
        earned: true,
      },
    ])
  }, [studentId])

  const earnedBadges = badges.filter((b) => b.earned)
  const unlockedBadges = badges.filter((b) => !b.earned)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Your Achievements
          </CardTitle>
          <CardDescription>Badges and awards you've earned</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-3">Earned Badges ({earnedBadges.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {earnedBadges.map((badge, i) => (
                  <div key={i} className="p-4 rounded-lg bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-2 border-yellow-500/30">
                    <div className="flex items-start gap-3">
                      <Star className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-foreground">{badge.name}</h4>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">Locked Badges ({unlockedBadges.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unlockedBadges.map((badge, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/50 border border-border opacity-60">
                    <div className="flex items-start gap-3">
                      <Zap className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-foreground">{badge.name}</h4>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
