'use client'

import { useQuery, useMutation } from '@apollo/client'
import { GET_APPOINTMENTS_LIGHT, GET_PATIENTS_LIGHT, GET_DOCTORS_LIGHT } from '@/graphql/queries/appointments-optimized'
import { CREATE_APPOINTMENT, UPDATE_APPOINTMENT, DELETE_APPOINTMENT } from '@/graphql/mutations/appointments'
import { queryOptions } from '@/lib/apollo-client'
import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/lib/auth'
import { AppointmentsSkeleton } from "@/components/appointments/appointments-skeleton"

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
  }
  doctor: {
    id: string
    name: string
    specialization?: string
  }
}

export default function AppointmentsPage() {
  const { role, displayName, logout } = useAuth()
  const [filter, setFilter] = useState('All')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)

  const [patientId, setPatientId] = useState('')
  const [doctorId, setDoctorId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [status, setStatus] = useState('Scheduled')
  const [reason, setReason] = useState('')

  const { loading, error, data } = useQuery(GET_APPOINTMENTS_LIGHT, {
    ...queryOptions.appointments,
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
  })

  const { data: patientsData } = useQuery(GET_PATIENTS_LIGHT, {
    ...queryOptions.patients,
    fetchPolicy: 'cache-first',
  })

  const { data: doctorsData } = useQuery(GET_DOCTORS_LIGHT, {
    ...queryOptions.doctors,
    fetchPolicy: 'cache-first',
  })

  const appointments = useMemo(() => data?.getAppointments || [], [data])
  const patients = useMemo(() => patientsData?.getPatients || [], [patientsData])
  const doctors = useMemo(() => doctorsData?.getDoctors || [], [doctorsData])

  const filteredAppointments = useMemo(() => {
    if (filter === 'All') return appointments
    return appointments.filter((apt: Appointment) => apt.status?.toLowerCase() === filter.toLowerCase())
  }, [appointments, filter])

  const [createAppointment, { loading: creating }] = useMutation(CREATE_APPOINTMENT, {
    refetchQueries: [{ query: GET_APPOINTMENTS_LIGHT }],
    onCompleted: () => {
      alert('Appointment created successfully!')
      handleCancel()
    },
  })

  const [updateAppointment, { loading: updating }] = useMutation(UPDATE_APPOINTMENT, {
    refetchQueries: [{ query: GET_APPOINTMENTS_LIGHT }],
    onCompleted: () => {
      alert('Appointment updated successfully!')
      handleCancel()
    },
  })

  const [deleteAppointment] = useMutation(DELETE_APPOINTMENT, {
    refetchQueries: [{ query: GET_APPOINTMENTS_LIGHT }],
    onCompleted: () => {
      alert('Appointment deleted successfully!')
    },
  })

  // Redirect non-staff users
  useEffect(() => {
    if (role === 'patient') {
      window.location.href = '/patient'
    } else if (role === null) {
      window.location.href = '/'
    }
  }, [role])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!patientId || !doctorId || !date || !time) {
      alert('Please fill in all required fields!')
      return
    }
    
    const createAppointmentInput: any = {
      patientId: patientId.trim(),
      doctorId: doctorId.trim(),
      date: date.trim(),
      time: time.trim(),
      status: status || 'Scheduled',
    }
    
    if (reason) createAppointmentInput.reason = reason.trim()

    if (editingAppointment) {
      await updateAppointment({ variables: { updateAppointmentInput: { id: editingAppointment.id, ...createAppointmentInput } } })
    } else {
      await createAppointment({ variables: { createAppointmentInput } })
    }
  }

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setPatientId(appointment.patientId)
    setDoctorId(appointment.doctorId)
    setDate(appointment.date)
    setTime(appointment.time)
    setStatus(appointment.status || 'Scheduled')
    setReason(appointment.reason || '')
    setShowAddForm(true)
  }

  const handleDelete = async (appointmentId: string) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      await deleteAppointment({ variables: { id: appointmentId } })
    }
  }

  const handleCancelAppointment = async (appointment: Appointment) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      await updateAppointment({ variables: { updateAppointmentInput: { id: appointment.id, status: 'Cancelled' } } })
    }
  }

  const handleComplete = async (appointment: Appointment) => {
    await updateAppointment({ variables: { updateAppointmentInput: { id: appointment.id, status: 'Completed' } } })
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

  const formatDate = (dateString: string) => {
    return dateString
  }

  const formatTime = (timeString: string) => {
    return timeString
  }

  if (loading) {
    return <AppointmentsSkeleton />
  }

  if (error) {
    return (
      <main className="min-h-screen bg-blue-50">
        <div className="p-6 text-center text-red-600">Error: {error.message}</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <a href="/" className="flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="font-semibold text-gray-800">HealthCare Pro</span>
              </a>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <a href="/dashboard" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                Dashboard
              </a>
              <a href="/doctors" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Doctors
              </a>
              <a href="/patients" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Patients
              </a>
              <a href="/appointments" className="flex items-center gap-1 text-blue-600 font-medium bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Appointments
              </a>
            </nav>

            {/* User & Logout */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-800">{displayName || 'User'}</div>
                <div className="text-xs text-gray-600">{role?.charAt(0).toUpperCase()}{role?.slice(1)}</div>
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
          <h1 className="text-3xl font-bold text-blue-600 mb-1">Appointment Management</h1>
          <p className="text-gray-600">Schedule and manage patient appointments</p>
        </div>

        {/* Filter Tabs and Add Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {['All', 'Scheduled', 'Completed', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Appointment
          </button>
        </div>

        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{editingAppointment ? 'Edit Appointment' : 'New Appointment'}</h2>
              <form onSubmit={onSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
                    <select
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select patient</option>
                      {patients.map((patient: any) => (
                        <option key={patient.id} value={patient.id}>{patient.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor *</label>
                    <select
                      value={doctorId}
                      onChange={(e) => setDoctorId(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select doctor</option>
                      {doctors.map((doctor: any) => (
                        <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={creating || updating}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {creating ? 'Creating...' : updating ? 'Updating...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Appointment Cards */}
        <div className="space-y-4">
          {filteredAppointments.map((appointment: Appointment) => (
            <div key={appointment.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                {/* Appointment Details */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{appointment.reason || 'Appointment'}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {appointment.patient?.name} • Dr. {appointment.doctor?.name}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{formatDate(appointment.date)}</span>
                    <span>{formatTime(appointment.time)}</span>
                  </div>

                  {/* Action Buttons - Only for Scheduled */}
                  {appointment.status === 'Scheduled' && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleComplete(appointment)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleCancelAppointment(appointment)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Status and Edit/Delete */}
                <div className="flex flex-col items-end gap-3">
                  {/* Status Badge */}
                  <div className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 ${
                    appointment.status === 'Completed' 
                      ? 'bg-green-100 text-green-700' 
                      : appointment.status === 'Cancelled'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {appointment.status === 'Completed' && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {appointment.status === 'Scheduled' && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    )}
                    {appointment.status}
                  </div>

                  {/* Edit & Delete Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(appointment)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(appointment.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAppointments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500">No appointments found</p>
          </div>
        )}
      </div>
    </main>
  )
}
