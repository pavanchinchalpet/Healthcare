'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { GET_PATIENTS_LIGHT } from '@/graphql/queries/appointments-optimized'
import { UPDATE_PATIENT } from '@/graphql/mutations/patients'
import { useAuth } from '@/lib/auth'

export default function PatientProfilePage() {
  const { userId, role, displayName, logout } = useAuth()
  const [isClient, setIsClient] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch patient data
  const { data: patientsData, loading, refetch } = useQuery(GET_PATIENTS_LIGHT, {
    skip: !userId
  })

  // Find current patient
  const currentPatient = patientsData?.getPatients?.find((p: any) => p.id === userId)

  // Update form when patient data loads
  useEffect(() => {
    if (currentPatient) {
      setName(currentPatient.name || '')
      setEmail(currentPatient.email || '')
      setPhone(currentPatient.phone || '')
      setAddress(currentPatient.address || '')
    }
  }, [currentPatient])

  // Redirect staff members only (allow unauthenticated access)
  useEffect(() => {
    if (role && role !== 'patient') {
      window.location.href = '/dashboard'
    }
  }, [role])

  const [updatePatient, { loading: updating }] = useMutation(UPDATE_PATIENT, {
    onCompleted: () => {
      alert('Profile updated successfully!')
      setIsEditing(false)
      setPassword('')
      setNewPassword('')
      refetch()
    },
    onError: (error) => {
      alert(error.message)
    },
  })

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    const updateData: any = {
      id: userId,
      name,
      email,
      phone,
      address
    }

    // Only include password if new password is provided
    if (newPassword.trim()) {
      updateData.password = newPassword
    }

    await updatePatient({
      variables: {
        updatePatientInput: updateData
      }
    })
  }

  const handleCancel = () => {
    if (currentPatient) {
      setName(currentPatient.name || '')
      setEmail(currentPatient.email || '')
      setPhone(currentPatient.phone || '')
      setAddress(currentPatient.address || '')
    }
    setPassword('')
    setNewPassword('')
    setIsEditing(false)
  }

  if (!isClient) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </main>
    )
  }

  if (!currentPatient) {
    return (
      <main className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">Unable to load your profile information.</p>
          <Button onClick={() => window.location.href = '/patient'}>
            Back to Dashboard
          </Button>
        </div>
      </main>
    )
  }

  return (
    <>
      {/* Patient Profile Page */}
      <main className="min-h-screen bg-blue-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="font-semibold text-gray-800">HealthCare Pro</span>
              </div>

              {/* Navigation */}
              <nav className="flex items-center gap-6">
                <a href="/patient" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  Dashboard
                </a>
                <a href="/patient/appointments" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  My Appointments
                </a>
                <a href="/patient/profile" className="flex items-center gap-1 text-blue-600 font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Profile
                </a>
              </nav>

              {/* User & Logout */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-800">{displayName || 'User'}</div>
                  <div className="text-xs text-gray-600">Patient</div>
                </div>
                <button 
                  onClick={logout}
                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
                >
                  <span>Logout</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Title Section */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">My Profile</h1>
            <p className="text-gray-600">Manage your personal information and account settings</p>
          </div>

          {/* Profile Information */}
          <Card className="shadow-sm border border-gray-100">
            <CardHeader className="text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 text-white flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">{displayName}</CardTitle>
              <CardDescription className="text-gray-600">Patient Profile Information</CardDescription>
            </CardHeader>
            <CardContent>
              {!isEditing ? (
                // View Mode
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                      <p className="text-lg text-gray-900 mt-1">{currentPatient.name || 'Not provided'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Email Address</Label>
                      <p className="text-lg text-gray-900 mt-1">{currentPatient.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Phone Number</Label>
                      <p className="text-lg text-gray-900 mt-1">{currentPatient.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Address</Label>
                      <p className="text-lg text-gray-900 mt-1">{currentPatient.address || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="pt-6 border-t">
                    <Button 
                      onClick={() => setIsEditing(true)}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                    >
                      Edit Profile
                    </Button>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        className="h-10 text-base"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
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
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        className="h-10 text-base"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address</Label>
                      <Textarea 
                        id="address" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        className="text-base resize-none"
                        placeholder="Enter your address"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">New Password</Label>
                        <Input 
                          id="newPassword" 
                          type="password" 
                          value={newPassword} 
                          onChange={(e) => setNewPassword(e.target.value)} 
                          className="h-10 text-base"
                          placeholder="Enter new password (leave blank to keep current)"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Current Password</Label>
                        <Input 
                          type="password" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          className="h-10 text-base"
                          placeholder="Enter current password (required for password change)"
                          required={newPassword.trim() !== ''}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <Button 
                      type="submit" 
                      disabled={updating}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white h-10 text-base font-medium"
                    >
                      {updating ? 'Updating...' : 'Update Profile'}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline" 
                      className="border-2 border-gray-300 hover:bg-gray-50 h-10 px-6"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
