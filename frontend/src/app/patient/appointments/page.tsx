'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { GET_APPOINTMENTS_LIGHT, GET_DOCTORS_LIGHT_STANDALONE } from '@/graphql/queries/appointments-optimized'
import { UPDATE_APPOINTMENT, DELETE_APPOINTMENT } from '@/graphql/mutations/appointments'
import { queryOptions } from '@/lib/apollo-client'
import { useAuth } from '@/lib/auth'
import { formatDate, formatTime } from '@/lib/utils'

interface Appointment {
  id: string
  patientId: string
  doctorId: string
  date: string
  time: string
  reason?: string
  status?: string
  createdAt: string
  doctor: {
    id: string
    name: string
    specialization?: string
    email?: string
    phone?: string
  }
}

export default function PatientAppointmentsPage() {
  const { userId } = useAuth()
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [reason, setReason] = useState('')
  const [status, setStatus] = useState('Scheduled')

  const { data: appointmentsData, loading: appointmentsLoading } = useQuery(GET_APPOINTMENTS_LIGHT, {
    ...queryOptions.appointments,
  })

  const { data: doctorsData } = useQuery(GET_DOCTORS_LIGHT_STANDALONE, {
    ...queryOptions.doctors,
  })

  const [updateAppointment, { loading: updating }] = useMutation(UPDATE_APPOINTMENT, {
    onCompleted: () => {
      alert('Appointment updated successfully!')
      setEditingAppointment(null)
      setDate('')
      setTime('')
      setReason('')
      setStatus('Scheduled')
    },
    onError: (error) => alert(error.message),
  })

  const [deleteAppointment, { loading: deleting }] = useMutation(DELETE_APPOINTMENT, {
    onCompleted: () => {
      alert('Appointment cancelled successfully!')
    },
    onError: (error) => alert(error.message),
  })

  // Filter appointments for current patient
  const patientAppointments = appointmentsData?.getAppointments?.filter(
    (apt: Appointment) => apt.patientId === userId
  ) || []

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setDate(appointment.date || '')
    setTime(appointment.time || '')
    setReason(appointment.reason || '')
    setStatus(appointment.status || 'Scheduled')
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAppointment) return

    await updateAppointment({
      variables: {
        updateAppointmentInput: {
          id: editingAppointment.id,
          date,
          time,
          reason,
          status
        }
      }
    })
  }

  const handleCancel = async (appointmentId: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      await deleteAppointment({
        variables: { id: appointmentId }
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800'
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      case 'In Progress': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }


  return (
    <>
      {/* Patient Appointments Page */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          {/* Header */}
          <section className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              My <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Appointments</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              View and manage your scheduled appointments.
            </p>
          </section>

          {/* Quick Actions */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/patient'}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-green-700 text-white flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                </div>
                <CardTitle className="text-xl">Book New Appointment</CardTitle>
                <CardDescription>Schedule a new appointment with a doctor</CardDescription>
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

          {/* Appointments List */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your Appointments</h2>
            
            {appointmentsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
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
                ))}
              </div>
            ) : patientAppointments.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Appointments Yet</h3>
                  <p className="text-gray-600 mb-6">You haven't booked any appointments yet.</p>
                  <Button 
                    onClick={() => window.location.href = '/patient'}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  >
                    Book Your First Appointment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patientAppointments.map((appointment: Appointment) => (
                  <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{appointment.doctor.name}</CardTitle>
                          <CardDescription>{appointment.doctor.specialization || 'General Practice'}</CardDescription>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status || 'Scheduled')}`}>
                          {appointment.status || 'Scheduled'}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                          {formatDate(appointment.date)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          {formatTime(appointment.time)}
                        </div>
                        {appointment.reason && (
                          <div className="text-sm text-gray-600">
                            <strong>Reason:</strong> {appointment.reason}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(appointment)}
                          className="flex-1"
                        >
                          Reschedule
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleCancel(appointment.id)}
                          disabled={deleting}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Edit Appointment Modal */}
          {editingAppointment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="max-w-md w-full mx-4 shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-gray-900">Reschedule Appointment</CardTitle>
                  <CardDescription>Update your appointment details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 text-left block">Doctor</Label>
                      <div className="p-3 bg-gray-50 rounded-md text-sm">
                        {editingAppointment.doctor.name} - {editingAppointment.doctor.specialization || 'General Practice'}
                      </div>
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
                        disabled={updating}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-10 text-base font-medium"
                      >
                        {updating ? 'Updating...' : 'Update Appointment'}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline" 
                        className="border-2 border-gray-300 hover:bg-gray-50 h-10 px-6"
                        onClick={() => {
                          setEditingAppointment(null)
                          setDate('')
                          setTime('')
                          setReason('')
                        }}
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
