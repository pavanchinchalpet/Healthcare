'use client'

import { useAuth } from '@/lib/auth'
import { validateAccessCode, type AccessCodeRole } from '@/config/access-codes'
import { useState, useEffect } from 'react'

type UserRole = 'patient' | 'doctor' | 'admin' | 'staff' | null

export default function StaffAccessPage() {
  const { login, role: currentRole } = useAuth()
  const [code, setCode] = useState('')
  const [role, setRole] = useState<'doctor' | 'admin' | 'staff'>('admin')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Redirect already logged-in staff
  useEffect(() => {
    if (isClient) {
      if (currentRole === 'admin' || currentRole === 'doctor' || currentRole === 'staff') {
        window.location.href = '/dashboard'
      } else if (currentRole === 'patient') {
        window.location.href = '/patient'
      }
    }
  }, [isClient, currentRole])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateAccessCode(code, role.toUpperCase() as AccessCodeRole)) {
      login({ 
        role: role as UserRole, 
        userId: role, 
        displayName: role === 'admin' ? 'Admin' : role === 'doctor' ? 'Doctor' : 'Staff' 
      })
      window.location.href = '/dashboard'
    } else {
      alert('Invalid access code')
    }
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

        {/* Staff Access Card */}
        <div className="flex items-center justify-center pt-12 pb-4">
          <div className="w-full max-w-md px-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Staff Access
              </h1>

              {/* Description */}
              <p className="text-gray-600 text-center mb-8">
                Enter your role and access code to continue.
              </p>

              {/* Form */}
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'doctor' | 'admin' | 'staff')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="admin">Admin</option>
                    <option value="doctor">Doctor</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                    Access Code
                  </label>
                  <input
                    id="code"
                    type="password"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-mono tracking-wider"
                    placeholder="Enter access code"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Unlock Access
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
