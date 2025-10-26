'use client'

import { useMutation } from '@apollo/client'
import { useState, useEffect } from 'react'
import { CREATE_PATIENT } from '@/graphql/mutations/patients'
import { useAuth } from '@/lib/auth'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function RegisterPage() {
  const { login, role: currentRole } = useAuth()
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
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

  const [createPatient, { loading }] = useMutation(CREATE_PATIENT, {
    onCompleted: (data) => {
      const p = data?.createPatient
      if (p?.id) {
        login({ role: 'patient', userId: p.id, displayName: p.name || 'Patient' })
        window.location.href = '/patient'
      }
    },
    onError: (e) => {
      console.error('Registration error:', e)
      alert(e.message)
    },
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createPatient({ 
      variables: { 
        createPatientInput: { 
          name, 
          age: age ? parseInt(age) : undefined,
          gender: gender || undefined,
          email, 
          phone, 
          address, 
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

        {/* Register Card */}
        <div className="flex items-center justify-center pt-4 pb-4">
          <div className="w-full max-w-2xl px-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              {/* Title */}
              <h1 className="text-xl font-bold text-gray-900 text-center mb-1">
                Patient Registration
              </h1>

              {/* Description */}
              <p className="text-sm text-gray-600 text-center mb-4">
                Fill your basic details to create your account.
              </p>

              {/* Form */}
              <form onSubmit={onSubmit} className="space-y-3">
                {/* Row 1: Name and Age */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your age"
                      min="1"
                      max="150"
                    />
                  </div>
                </div>

                {/* Row 2: Gender and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your phone"
                    />
                  </div>
                </div>

                {/* Row 3: Email - Full Width */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Row 4: Address - Full Width */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    id="address"
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Enter your address"
                  />
                </div>

                {/* Row 5: Password - Full Width */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 mt-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>

              {/* Login Link */}
              <div className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-green-600 hover:text-green-800 font-medium">
                  Login here
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
