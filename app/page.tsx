'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading SmartResult Portal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            SmartResult Portal
          </h1>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            Comprehensive exam management system with AI-powered insights and gamified student engagement
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-primary">For Administrators</CardTitle>
              <CardDescription>Manage students, exams, and results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Student management (Register No, DOB, Class, Section)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Publish exam results with auto color-coded grades</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Dynamic exam type management</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Detailed analytics and reports</span>
                </li>
              </ul>
              <Link href="/admin/login" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Admin Login
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-primary">For Students</CardTitle>
              <CardDescription>View results and track performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Login with Register No and DOB</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>View exam results and grades</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Download PDF reports and compare performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>View AI feedback and grade predictions</span>
                </li>
              </ul>
              <Link href="/student/login" className="block">
                <Button variant="outline" className="w-full">
                  Student Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Color-Coded Grades', desc: 'Auto-generated grades with visual indicators' },
              { title: 'AI Predictions', desc: 'Forecast future grades based on performance' },
              { title: 'Gamification', desc: 'Badges, rankings, and achievement system' },
              { title: 'Analytics', desc: 'Comprehensive performance insights and reports' },
              { title: 'Mobile Friendly', desc: 'Optimized for all devices' },
              { title: 'Secure', desc: 'Enterprise-grade authentication and data protection' },
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-card rounded-lg border border-border text-center hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
