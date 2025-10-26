'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState, useEffect, memo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { GET_DOCTORS_LIGHT_STANDALONE } from '@/graphql/queries/appointments-optimized'
import { CREATE_APPOINTMENT } from '@/graphql/mutations/appointments'
import { queryOptions } from '@/lib/apollo-client'
import { useAuth } from '@/lib/auth'

// Memoized doctor card component for better performance
const DoctorCard = memo(({ doctor, onBook }: any) => (
  <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <CardTitle className="text-lg">{doctor.name}</CardTitle>
      <CardDescription>{doctor.specialization || 'General Practice'}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2 text-sm text-gray-600">
        {doctor.email && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {doctor.email}
          </div>
        )}
        {doctor.phone && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            {doctor.phone}
          </div>
        )}
      </div>
      <Button 
        className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
        onClick={onBook}
      >
        Book Appointment
      </Button>
    </CardContent>
  </Card>
))

DoctorCard.displayName = 'DoctorCard'

export default function PatientHomePage() {
  const { userId, role, displayName, logout } = useAuth()
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [reason, setReason] = useState('')
  const [status, setStatus] = useState('Scheduled')
  const [showBookingForm, setShowBookingForm] = useState(false)

  const { data: doctorsData, loading: doctorsLoading } = useQuery(GET_DOCTORS_LIGHT_STANDALONE, {
    ...queryOptions.doctors,
  })

  const [createAppointment, { loading: creating }] = useMutation(CREATE_APPOINTMENT, {
    onCompleted: () => {
      alert('Appointment booked successfully!')
      setSelectedDoctor('')
      setDate('')
      setTime('')
      setReason('')
      setStatus('Scheduled')
      setShowBookingForm(false)
    },
    onError: (error) => alert(error.message),
  })

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    await createAppointment({
      variables: {
        createAppointmentInput: {
          patientId: userId,
          doctorId: selectedDoctor,
          date,
          time,
          reason,
          status
        }
      }
    })
  }

  const doctors = doctorsData?.getDoctors || []

  // Redirect staff members only (allow unauthenticated access)
  useEffect(() => {
    if (role && role !== 'patient') {
      window.location.href = '/dashboard'
    }
  }, [role])

  return (
    <>
      {/* Patient Home Page */}
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
                <a href="/patient" className="flex items-center gap-1 text-blue-600 font-medium">
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
                <a href="/patient/profile" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
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
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Title Section */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Patient Dashboard</h1>
            <p className="text-gray-600">Welcome, {displayName}</p>
          </div>

          {/* Quick Actions */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowBookingForm(true)}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-green-700 text-white flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                </div>
                <CardTitle className="text-xl">Book Appointment</CardTitle>
                <CardDescription>Schedule a new appointment with a doctor</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/patient/appointments'}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <CardTitle className="text-xl">My Appointments</CardTitle>
                <CardDescription>View and manage your scheduled appointments</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/patient/profile'}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 text-white flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <CardTitle className="text-xl">My Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
            </Card>
          </section>

          {/* Available Doctors */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Doctors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctorsLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                doctors.map((doctor: any) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    onBook={() => {
                      setSelectedDoctor(doctor.id)
                      setShowBookingForm(true)
                    }}
                  />
                ))
              )}
            </div>
          </section>

          {/* Booking Form Modal */}
          {showBookingForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
              <Card className="max-w-md w-full mx-4 shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-gray-900">Book Appointment</CardTitle>
                  <CardDescription>Schedule your appointment</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBookAppointment} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor" className="text-sm font-medium text-gray-700 text-left block">Doctor</Label>
                      <Select value={selectedDoctor} onValueChange={setSelectedDoctor} required>
                        <SelectTrigger id="doctor" className="h-10">
                          <SelectValue placeholder="Select a doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor: any) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              {doctor.name} - {doctor.specialization || 'General Practice'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-sm font-medium text-gray-700 text-left block">Date</Label>
                      <Input 
                        id="date" 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        required 
                        className="h-10 text-base"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-sm font-medium text-gray-700 text-left block">Time</Label>
                      <Input 
                        id="time" 
                        type="time" 
                        value={time} 
                        onChange={(e) => setTime(e.target.value)} 
                        required 
                        className="h-10 text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-sm font-medium text-gray-700 text-left block">Status</Label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="h-10 text-base">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Scheduled">Scheduled</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                          <SelectItem value="Rescheduled">Rescheduled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason" className="text-sm font-medium text-gray-700 text-left block">Reason (Optional)</Label>
                      <Textarea 
                        id="reason" 
                        value={reason} 
                        onChange={(e) => setReason(e.target.value)} 
                        className="text-base resize-none"
                        placeholder="Brief description of your visit reason"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button 
                        type="submit" 
                        disabled={creating}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white h-10 text-base font-medium"
                      >
                        {creating ? 'Booking...' : 'Book Appointment'}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline" 
                        className="border-2 border-gray-300 hover:bg-gray-50 h-10 px-6"
                        onClick={() => setShowBookingForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
