'use client'

import { useQuery, useMutation } from '@apollo/client'
import { GET_APPOINTMENTS_LIGHT, GET_PATIENTS_LIGHT, GET_DOCTORS_LIGHT } from '@/graphql/queries/appointments-optimized'
import { CREATE_APPOINTMENT, UPDATE_APPOINTMENT, DELETE_APPOINTMENT } from '@/graphql/mutations/appointments'
import { queryOptions } from '@/lib/apollo-client'
import { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import HeaderNav from "@/components/healthcare/header-nav"
import { AppointmentsSkeleton } from "@/components/appointments/appointments-skeleton"
import { formatDate, formatTime, formatDateTime } from '@/lib/utils'

interface Appointment {
  id: string
  patientId: string
  doctorId: string
  date: string
  time: string
  reason?: string
  status?: string
  createdAt: string
  patient: {
    id: string
    name: string
    age?: number
    gender?: string
    email?: string
    phone?: string
  }
  doctor: {
    id: string
    name: string
    specialization?: string
    email?: string
    phone?: string
  }
}

export default function AppointmentsPage() {
  // Optimized query with better performance
  const { loading: appointmentsLoading, error: appointmentsError, data: appointmentsData } = useQuery(GET_APPOINTMENTS_LIGHT, {
    ...queryOptions.appointments,
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false, // Reduce re-renders
  })
  
  const { loading: patientsLoading, error: patientsError, data: patientsData } = useQuery(GET_PATIENTS_LIGHT, {
    ...queryOptions.patients,
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false,
  })
  
  const { loading: doctorsLoading, error: doctorsError, data: doctorsData } = useQuery(GET_DOCTORS_LIGHT, {
    ...queryOptions.doctors,
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false,
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)

  const [patientId, setPatientId] = useState('')
  const [doctorId, setDoctorId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [status, setStatus] = useState('Scheduled')
  const [reason, setReason] = useState('')

  // Memoized loading state
  const isLoading = useMemo(() => 
    appointmentsLoading || patientsLoading || doctorsLoading, 
    [appointmentsLoading, patientsLoading, doctorsLoading]
  )

  // Memoized error state
  const hasError = useMemo(() => 
    appointmentsError || patientsError || doctorsError,
    [appointmentsError, patientsError, doctorsError]
  )

  const [createAppointment, { loading: creating }] = useMutation(CREATE_APPOINTMENT, {
    refetchQueries: [{ query: GET_APPOINTMENTS_LIGHT }],
    awaitRefetchQueries: true,
    onError: (error) => {
      console.error('❌ Error creating appointment:', error)
      alert(`Error: ${error.message}`)
    },
    onCompleted: () => {
      alert('Appointment scheduled successfully!')
    }
  })

  const [updateAppointment, { loading: updating }] = useMutation(UPDATE_APPOINTMENT, {
    refetchQueries: [{ query: GET_APPOINTMENTS_LIGHT }],
    awaitRefetchQueries: true,
    onError: (error) => {
      console.error('❌ Error updating appointment:', error)
      alert(`Error: ${error.message}`)
    },
    onCompleted: (data) => {
      console.log('✅ Appointment updated successfully:', data)
      alert('Appointment updated successfully!')
    }
  })

  const [deleteAppointment, { loading: deleting }] = useMutation(DELETE_APPOINTMENT, {
    refetchQueries: [{ query: GET_APPOINTMENTS_LIGHT }],
    awaitRefetchQueries: true,
    onError: (error) => {
      console.error('❌ Error deleting appointment:', error)
      alert(`Error: ${error.message}`)
    },
    onCompleted: (data) => {
      console.log('✅ Appointment deleted successfully:', data)
      alert('Appointment deleted successfully!')
    }
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const createAppointmentInput: any = {
      patientId,
      doctorId,
      date,
      time,
    }
    if (status) createAppointmentInput.status = status
    if (reason) createAppointmentInput.reason = reason

    try {
      if (editingAppointment) {
        const updateAppointmentInput = {
          id: editingAppointment.id,
          ...createAppointmentInput
        }
        console.log('📝 Updating appointment with:', JSON.stringify(updateAppointmentInput, null, 2))
        await updateAppointment({ variables: { updateAppointmentInput } })
        console.log('✅ Appointment update successful')
      } else {
        console.log('📝 Creating new appointment with:', JSON.stringify(createAppointmentInput, null, 2))
        await createAppointment({ variables: { createAppointmentInput } })
        console.log('✅ Appointment creation successful')
      }
    } catch (error) {
      console.error('❌ Form submission error:', error)
      console.error('❌ Error details:', (error as Error).message)
    }
    
    setPatientId('')
    setDoctorId('')
    setDate('')
    setTime('')
    setStatus('Scheduled')
    setReason('')
    setShowAddForm(false)
    setEditingAppointment(null)
  }

  const handleEdit = (appointment: Appointment) => {
    console.log('✏️ Editing appointment:', appointment)
    setEditingAppointment(appointment)
    setPatientId(appointment.patientId)
    setDoctorId(appointment.doctorId)
    setDate(appointment.date || '')
    setTime(appointment.time || '')
    setStatus(appointment.status || 'Scheduled')
    setReason(appointment.reason || '')
    setShowAddForm(true)
  }

  const handleDelete = async (appointmentId: string) => {
    console.log('🗑️ Deleting appointment with id:', appointmentId)
    if (confirm('Are you sure you want to delete this appointment?')) {
      try {
        await deleteAppointment({ variables: { id: appointmentId } })
        console.log('✅ Appointment deletion successful')
      } catch (error) {
        console.error('❌ Delete error:', error)
      }
    }
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingAppointment(null)
    setPatientId('')
    setDoctorId('')
    setDate('')
    setTime('')
    setStatus('Scheduled')
    setReason('')
  }

  // Show skeleton loading state
  if (isLoading) {
    return (
      <>
        <HeaderNav />
        <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
          <AppointmentsSkeleton />
        </main>
      </>
    )
  }
  
  // Show error state
  if (hasError) {
    const errorMessage = appointmentsError?.message || patientsError?.message || doctorsError?.message || 'Unknown error'
    return (
      <>
        <HeaderNav />
        <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
          <div className="text-center text-destructive">Error: {errorMessage}</div>
        </main>
      </>
    )
  }

  return (
    <>
      <HeaderNav />
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <section aria-labelledby="appointments-title" className="mb-6 md:mb-8">
          <h1 id="appointments-title" className="text-3xl md:text-4xl font-semibold text-pretty">
            Appointments
          </h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">Schedule and track appointments.</p>
        </section>

        <section aria-label="Appointment management" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-purple-600 rounded-full"></div>
              <h2 className="text-xl font-semibold text-gray-800">Appointment Scheduling</h2>
            </div>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              variant={showAddForm ? "outline" : "default"}
              className={showAddForm ? "border-red-300 text-red-600 hover:bg-red-50" : "bg-purple-600 hover:bg-purple-700 text-white"}
            >
              {showAddForm ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Schedule New Appointment
                </>
              )}
            </Button>
          </div>

        {showAddForm && (
          <Card className="border-l-4 border-l-purple-500 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50">
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {editingAppointment ? 'Edit Appointment Details' : 'Schedule New Appointment'}
              </CardTitle>
              <CardDescription className="text-purple-700">
                {editingAppointment ? 'Update appointment scheduling and medical consultation details' : 'Enter comprehensive appointment information for medical consultation'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="patient">Patient</Label>
                  <Select value={patientId} onValueChange={setPatientId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patientsData?.getPatients?.map((patient: any) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name} {patient.age ? `(${patient.age})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor">Doctor</Label>
                  <Select value={doctorId} onValueChange={setDoctorId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctorsData?.getDoctors?.map((doctor: any) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          Dr. {doctor.name} {doctor.specialization ? `(${doctor.specialization})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Appointment Date</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={date}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="Rescheduled">Rescheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    rows={3}
                    value={reason}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
                    placeholder="Enter appointment reason"
                  />
                </div>
                <div className="md:col-span-2 flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={creating || updating || !patientId.trim() || !doctorId.trim() || !date}
                    className="bg-green-600 hover:bg-green-700 text-white px-6"
                  >
                    {creating || updating ? (
                      <>
                        <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Saving...
                      </>
                    ) : editingAppointment ? (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Update Appointment
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Schedule Appointment
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-purple-50">
            <CardTitle className="flex items-center gap-3 text-gray-800">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              Appointment Schedule
              <span className="ml-auto text-sm font-normal text-gray-500">
                {appointmentsData?.getAppointments?.length || 0} appointments
              </span>
            </CardTitle>
            <CardDescription className="text-gray-600">Complete appointment calendar with patient and doctor information</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold text-gray-700">Patient</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Doctor</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Date & Time</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Reason</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Scheduled</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentsData?.getAppointments?.map((appointment: Appointment) => (
                    <tr key={appointment.id} className="border-b hover:bg-purple-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {appointment.patient.name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{appointment.patient.name}</div>
                            <div className="text-sm text-gray-500">
                              {appointment.patient.age ? `${appointment.patient.age} years` : 'Age not specified'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-semibold text-sm">
                              {appointment.doctor.name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Dr. {appointment.doctor.name}</div>
                            <div className="text-sm text-gray-500">{appointment.doctor.specialization || 'General'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900">
                            {formatDate(appointment.date)}
                          </div>
                          <div className="text-gray-500">
                            {formatTime(appointment.time)}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                          appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          appointment.status === 'Rescheduled' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status || 'Scheduled'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                        {appointment.reason || 'No reason provided'}
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-600">
                          {formatDate(appointment.createdAt)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(appointment)}
                            disabled={deleting}
                            className="border-purple-200 text-purple-600 hover:bg-purple-50"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(appointment.id)}
                            disabled={deleting}
                            className="bg-red-100 text-red-600 hover:bg-red-200 border-red-200"
                          >
                            {deleting ? (
                              <>
                                <svg className="w-4 h-4 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Deleting...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {appointmentsData?.getAppointments?.length === 0 && (
          <Card className="border-dashed border-2 border-gray-200">
            <CardContent className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments Found</h3>
              <p className="text-gray-500 mb-6">Start scheduling appointments by creating your first appointment.</p>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Schedule First Appointment
              </Button>
            </CardContent>
          </Card>
        )}
        </section>
      </main>
    </>
  )
}