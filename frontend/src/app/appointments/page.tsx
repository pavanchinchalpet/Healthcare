'use client'

import { useQuery, useMutation } from '@apollo/client'
import { GET_APPOINTMENTS } from '@/graphql/queries/appointments'
import { GET_PATIENTS } from '@/graphql/queries/patients'
import { GET_DOCTORS } from '@/graphql/queries/doctors'
import { CREATE_APPOINTMENT, UPDATE_APPOINTMENT, DELETE_APPOINTMENT } from '@/graphql/mutations/appointments'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import HeaderNav from "@/components/healthcare/header-nav"

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
  const { loading, error, data } = useQuery(GET_APPOINTMENTS)
  const { data: patientsData } = useQuery(GET_PATIENTS)
  const { data: doctorsData } = useQuery(GET_DOCTORS)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)

  const [patientId, setPatientId] = useState('')
  const [doctorId, setDoctorId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [status, setStatus] = useState('Scheduled')
  const [reason, setReason] = useState('')

  const [createAppointment, { loading: creating }] = useMutation(CREATE_APPOINTMENT, {
    refetchQueries: [{ query: GET_APPOINTMENTS }],
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
    refetchQueries: [{ query: GET_APPOINTMENTS }],
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
    refetchQueries: [{ query: GET_APPOINTMENTS }],
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
        // Update existing appointment
        const updateAppointmentInput = {
          id: editingAppointment.id,
          ...createAppointmentInput
        }
        console.log('📝 Updating appointment with:', JSON.stringify(updateAppointmentInput, null, 2))
        await updateAppointment({ variables: { updateAppointmentInput } })
        console.log('✅ Appointment update successful')
      } else {
        // Create new appointment
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

  if (loading) return (
    <>
      <HeaderNav />
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="text-center">Loading...</div>
      </main>
    </>
  )
  
  if (error) return (
    <>
      <HeaderNav />
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="text-center text-destructive">Error: {error.message}</div>
      </main>
    </>
  )

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
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              variant={showAddForm ? "outline" : "default"}
            >
              {showAddForm ? 'Cancel' : 'Schedule Appointment'}
            </Button>
          </div>

        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
              </CardTitle>
              <CardDescription>
                {editingAppointment ? 'Update appointment details' : 'Enter appointment information'}
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
                <div className="md:col-span-2 flex gap-2">
                  <Button
                    type="submit"
                    disabled={creating || updating || !patientId.trim() || !doctorId.trim() || !date}
                  >
                    {creating || updating ? 'Saving...' : editingAppointment ? 'Update Appointment' : 'Schedule Appointment'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>All Appointments</CardTitle>
            <CardDescription>Manage scheduled appointments and bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Patient</th>
                    <th className="text-left p-2 font-medium">Doctor</th>
                    <th className="text-left p-2 font-medium">Date & Time</th>
                    <th className="text-left p-2 font-medium">Status</th>
                    <th className="text-left p-2 font-medium">Reason</th>
                    <th className="text-left p-2 font-medium">Created</th>
                    <th className="text-left p-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.getAppointments?.map((appointment: Appointment) => (
                    <tr key={appointment.id} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">{appointment.patient.name}</td>
                      <td className="p-2 text-muted-foreground">Dr. {appointment.doctor.name}</td>
                      <td className="p-2 text-muted-foreground">
                        <div>
                          <div>{appointment.date ? new Date(appointment.date).toLocaleDateString() : '-'}</div>
                          <div className="text-xs text-muted-foreground">
                            {appointment.time || '-'}
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          appointment.status === 'Scheduled' ? 'bg-gray-100 text-gray-800' :
                          appointment.status === 'Completed' ? 'bg-black text-white' :
                          appointment.status === 'Cancelled' ? 'bg-gray-200 text-gray-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status || 'Scheduled'}
                        </span>
                      </td>
                      <td className="p-2 text-muted-foreground max-w-xs truncate">{appointment.reason || '-'}</td>
                      <td className="p-2 text-muted-foreground">{new Date(appointment.createdAt).toLocaleDateString()}</td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(appointment)}
                            disabled={deleting}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(appointment.id)}
                            disabled={deleting}
                          >
                            {deleting ? 'Deleting...' : 'Delete'}
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

        {data?.getAppointments?.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No appointments found. Schedule your first appointment above.</p>
            </CardContent>
          </Card>
        )}
        </section>
      </main>
    </>
  )
}
