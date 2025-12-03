'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Medal, Star } from 'lucide-react'

interface RankingData {
  rank: number
  name: string
  register_no: string
  total_marks: number
  percentage: number
  badges: number
}

export default function RankingDashboard() {
  const [rankings, setRankings] = useState<RankingData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRankings()
  }, [])

  const fetchRankings = async () => {
    try {
      const admin = JSON.parse(localStorage.getItem('admin') || '{}')
      const response = await fetch(`/api/rankings?adminId=${admin.id}`)
      const data = await response.json()
      setRankings(data.rankings || [])
    } catch (error) {
      console.error('[v0] Error fetching rankings:', error)
      setRankings([])
    } finally {
      setIsLoading(false)
    }
  }

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-500'
      case 2:
        return 'text-gray-400'
      case 3:
        return 'text-orange-600'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Student Rankings
          </CardTitle>
          <CardDescription>Current rankings based on total performance</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading rankings...</div>
          ) : rankings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No rankings available yet. Add students and results.</div>
          ) : (
            <div className="space-y-2">
              {rankings.map((student) => (
                <div
                  key={student.rank}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold ${getMedalColor(student.rank)} bg-muted`}>
                      {student.rank <= 3 ? (
                        <Medal className="w-5 h-5" />
                      ) : (
                        <span className="text-foreground">{student.rank}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{student.name}</h4>
                      <p className="text-xs text-muted-foreground">{student.register_no}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{student.percentage.toFixed(1)}%</div>
                      <p className="text-xs text-muted-foreground">{student.total_marks} marks</p>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: student.badges }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
