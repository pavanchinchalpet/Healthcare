'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/lib/auth'
import { useState, useEffect } from 'react'

export default function StaffAccessPage() {
  const { login } = useAuth()
  const [code, setCode] = useState('')
  const [role, setRole] = useState<'doctor' | 'admin'>('admin')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const configured = process.env.NEXT_PUBLIC_STAFF_ACCESS_CODE || ''
    console.log('🔍 Environment Debug:', {
      configured,
      entered: code.trim(),
      role,
      envVar: process.env.NEXT_PUBLIC_STAFF_ACCESS_CODE,
      allEnv: Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_'))
    })
    
    if (!configured) {
      alert('Staff access code is not configured. Please set NEXT_PUBLIC_STAFF_ACCESS_CODE in .env.local')
      return
    }
    if (code.trim() === configured) {
      console.log('Access code correct, logging in...')
      login({ role, userId: role, displayName: role === 'admin' ? 'Admin' : 'Doctor' })
      console.log('Login called, redirecting to dashboard...')
      window.location.href = '/dashboard'
    } else {
      alert('Invalid access code')
    }
  }

  if (!isClient) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <>
      {/* Staff Access Page */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full">
          <section className="text-center">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                    Staff Access
                  </span>
                </h1>
              </div>

              <Card className="max-w-md mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Enter Access Code</CardTitle>
                  <CardDescription className="text-gray-600">Use the code provided by management</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6" onSubmit={onSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-sm font-medium text-gray-700">Role</Label>
                      <Select value={role} onValueChange={(value: 'doctor' | 'admin') => setRole(value)}>
                        <SelectTrigger className="h-12 text-lg">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="doctor">Doctor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="code" className="text-sm font-medium text-gray-700">Access Code</Label>
                      <Input 
                        id="code" 
                        type="password" 
                        value={code} 
                        onChange={(e) => setCode(e.target.value)} 
                        required 
                        className="h-12 text-center text-lg font-mono tracking-wider"
                        placeholder="Enter code"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button 
                        type="submit" 
                        className="flex-1 bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white h-12 text-lg font-medium"
                      >
                        Unlock
                      </Button>
                      <Button 
                        asChild 
                        variant="outline" 
                        className="border-2 border-gray-300 hover:bg-gray-50 h-12 px-6"
                      >
                        <a href="/">Back</a>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}


