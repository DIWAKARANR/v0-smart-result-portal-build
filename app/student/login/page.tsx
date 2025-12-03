'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AlertCircle, Info } from 'lucide-react'

export default function StudentLoginPage() {
  const router = useRouter()
  const [registerNo, setRegisterNo] = useState('')
  const [dob, setDob] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ register_no: registerNo, dob }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Login failed')
        return
      }

      localStorage.setItem('student', JSON.stringify(result.student))
      localStorage.setItem('studentToken', result.token || '')
      router.push('/student/dashboard')
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-primary">Student Login</CardTitle>
          <CardDescription>SmartResult Portal - Access your exam results</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex gap-2 items-start">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Register No</label>
              <Input
                type="text"
                placeholder="e.g., REG001"
                value={registerNo}
                onChange={(e) => setRegisterNo(e.target.value)}
                disabled={isLoading}
                className="bg-input border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Date of Birth</label>
              <Input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                disabled={isLoading}
                className="bg-input border-border"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
            <div className="flex gap-2 items-start">
              <Info className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-green-900 dark:text-green-100 mb-1">Demo Account (Testing Only)</p>
                <p className="text-xs text-green-800 dark:text-green-200 break-all">Register No: DEMO001</p>
                <p className="text-xs text-green-800 dark:text-green-200">DOB: 2005-01-15</p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1 italic">⚠️ Ask your admin for your credentials to login.</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-center text-muted-foreground mt-4">
            <Link href="/" className="text-primary hover:underline font-medium">
              Back to home
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
