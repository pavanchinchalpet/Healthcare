'use client'

import { useMutation } from '@apollo/client'
import { useState, useEffect } from 'react'
import { PATIENT_LOGIN } from '@/graphql/mutations/patients'
import { useAuth } from '@/lib/auth'

export default function LoginPage() {
  const { login, role: currentRole } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Redirect already logged-in users
  useEffect(() => {
    if (isClient) {
      if (currentRole === 'patient') {
        window.location.href = '/patient'
      } else if (currentRole === 'admin' || currentRole === 'doctor' || currentRole === 'staff') {
        window.location.href = '/dashboard'
      }
    }
  }, [isClient, currentRole])

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

  if (!isClient || currentRole) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-white"></main>
    )
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-white">
        {/* Header with Logo - Clickable to Home */}
        <div className="max-w-6xl mx-auto px-6 pt-4">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="font-semibold text-gray-800">HealthCare Pro</span>
          </a>
        </div>

        {/* Login Card */}
        <div className="flex items-center justify-center pt-4 pb-4">
          <div className="w-full max-w-md px-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              {/* Icon */}
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Patient Login
              </h1>

              {/* Description */}
              <p className="text-gray-600 text-center mb-8">
                Sign in to manage your appointments.
              </p>

              {/* Form */}
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              {/* Register Link */}
              <div className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                  Register here
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
