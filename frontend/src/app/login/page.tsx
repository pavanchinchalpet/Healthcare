'use client'

import { useMutation } from '@apollo/client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PATIENT_LOGIN } from '@/graphql/mutations/patients'
import { useAuth } from '@/lib/auth'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const [patientLogin, { loading }] = useMutation(PATIENT_LOGIN, {
    onCompleted: (data) => {
      const patient = data?.patientLogin
      if (patient?.id) {
        login({ role: 'patient', userId: patient.id, displayName: patient.name || patient.email || 'Patient' })
        window.location.href = '/patient'
      }
    },
    onError: (error) => {
      alert(error.message)
    },
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await patientLogin({
      variables: {
        loginInput: {
          email: email.trim().toLowerCase(),
          password
        }
      }
    })
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
      {/* Patient Login Page */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full">
          <section className="text-center">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    Patient Login
                  </span>
                </h1>
              </div>

              <Card className="max-w-md mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Sign In</CardTitle>
                  <CardDescription className="text-gray-600">Enter your email and password</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={onSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700 text-left block">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="h-10 text-base"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700 text-left block">Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="h-10 text-base"
                        placeholder="Enter your password"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-10 text-base font-medium"
                      >
                        {loading ? 'Logging in...' : 'Login'}
                      </Button>
                      <Button 
                        asChild 
                        variant="outline" 
                        className="border-2 border-gray-300 hover:bg-gray-50 h-10 px-6"
                      >
                        <a href="/register">Register</a>
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


