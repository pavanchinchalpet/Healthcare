'use client'

import { useMutation } from '@apollo/client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RESET_PATIENT_PASSWORD } from '@/graphql/mutations/patients'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const [resetPassword, { loading }] = useMutation(RESET_PATIENT_PASSWORD, {
    onCompleted: (data) => {
      const patient = data?.resetPatientPassword
      if (patient?.id) {
        alert('Password reset successfully! You can now login with your new password.')
        window.location.href = '/login'
      }
    },
    onError: (error) => {
      alert(error.message)
    },
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long!')
      return
    }
    
    await resetPassword({
      variables: {
        resetPasswordInput: {
          email: email.trim().toLowerCase(),
          newPassword
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
      {/* Password Reset Page */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full">
          <section className="text-center">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                    Reset Password
                  </span>
                </h1>
                <p className="text-gray-600 text-lg">
                  Enter your email and new password to reset your account
                </p>
              </div>

              <Card className="max-w-xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                    </svg>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Reset Password</CardTitle>
                  <CardDescription className="text-gray-600">Enter your email and new password</CardDescription>
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
                      <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700 text-left block">New Password</Label>
                      <Input 
                        id="newPassword" 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required 
                        className="h-10 text-base"
                        placeholder="Enter new password"
                        minLength={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 text-left block">Confirm Password</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                        className="h-10 text-base"
                        placeholder="Confirm new password"
                        minLength={6}
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button 
                        type="submit" 
                        disabled={loading} 
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-10 text-base font-medium"
                      >
                        {loading ? 'Resetting...' : 'Reset Password'}
                      </Button>
                      <Button 
                        asChild 
                        variant="outline" 
                        className="border-2 border-gray-300 hover:bg-gray-50 h-10 px-6"
                      >
                        <a href="/login">Back to Login</a>
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
