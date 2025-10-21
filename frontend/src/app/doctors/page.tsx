'use client'

import { useQuery, useMutation } from '@apollo/client'
import { GET_DOCTORS_LIGHT_STANDALONE } from '@/graphql/queries/appointments-optimized'
import { CREATE_DOCTOR, UPDATE_DOCTOR, DELETE_DOCTOR } from '@/graphql/mutations/doctors'
import { queryOptions } from '@/lib/apollo-client'
import { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import HeaderNav from "@/components/healthcare/header-nav"
import { DoctorsSkeleton } from "@/components/doctors/doctors-skeleton"
import { formatDate } from '@/lib/utils'

interface Doctor {
  id: string
  name: string
  specialization?: string
  email?: string
  phone?: string
  experience?: number
  createdAt: string
}

export default function DoctorsPage() {
  // Optimized query with better fetch policy
  // Optimized query with better performance
  const { loading, error, data } = useQuery(GET_DOCTORS_LIGHT_STANDALONE, {
    ...queryOptions.doctors,
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false, // Reduce re-renders
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)

  const [name, setName] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [experience, setExperience] = useState<string>('')

  // Memoized loading state for better performance
  const isLoading = useMemo(() => loading, [loading])

  const [createDoctor, { loading: creating }] = useMutation(CREATE_DOCTOR, {
    refetchQueries: [{ query: GET_DOCTORS_LIGHT_STANDALONE }],
    awaitRefetchQueries: true,
    onError: (error) => {
      console.error('Error creating doctor:', error)
      alert(`Error: ${error.message}`)
    },
    onCompleted: () => {
      alert('Doctor created successfully!')
    }
  })

  const [updateDoctor, { loading: updating }] = useMutation(UPDATE_DOCTOR, {
    refetchQueries: [{ query: GET_DOCTORS_LIGHT_STANDALONE }],
    awaitRefetchQueries: true,
    onError: (error) => {
      console.error('Error updating doctor:', error)
      alert(`Error: ${error.message}`)
    },
    onCompleted: () => {
      alert('Doctor updated successfully!')
    }
  })

  const [deleteDoctor, { loading: deleting }] = useMutation(DELETE_DOCTOR, {
    refetchQueries: [{ query: GET_DOCTORS_LIGHT_STANDALONE }],
    awaitRefetchQueries: true,
    onError: (error) => {
      console.error('Error deleting doctor:', error)
      alert(`Error: ${error.message}`)
    },
    onCompleted: () => {
      alert('Doctor deleted successfully!')
    }
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!name.trim()) {
      alert('Name is required!')
      return
    }
    
    // Validate experience range
    if (experience && (isNaN(parseInt(experience, 10)) || parseInt(experience, 10) < 0 || parseInt(experience, 10) > 50)) {
      alert('Experience must be between 0 and 50 years!')
      return
    }
    
    const createDoctorInput: any = { name: name.trim() }
    if (specialization) createDoctorInput.specialization = specialization.trim()
    if (email && email.trim()) createDoctorInput.email = email.trim()
    if (phone) createDoctorInput.phone = phone.trim()
    if (experience && !isNaN(parseInt(experience, 10))) {
      createDoctorInput.experience = parseInt(experience, 10)
    }

    if (editingDoctor) {
      // Update existing doctor
      const updateDoctorInput = {
        id: editingDoctor.id,
        ...createDoctorInput
      }
      await updateDoctor({ variables: { updateDoctorInput } })
    } else {
      // Create new doctor
      await createDoctor({ variables: { createDoctorInput } })
    }

    // Reset form
    setName('')
    setSpecialization('')
    setEmail('')
    setPhone('')
    setExperience('')
    setShowAddForm(false)
    setEditingDoctor(null)
  }

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor)
    setName(doctor.name)
    setSpecialization(doctor.specialization || '')
    setEmail(doctor.email || '')
    setPhone(doctor.phone || '')
    setExperience(doctor.experience?.toString() || '')
    setShowAddForm(true)
  }

  const handleDelete = async (doctorId: string) => {
    if (confirm('Are you sure you want to delete this doctor?')) {
      await deleteDoctor({ variables: { id: doctorId } })
    }
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingDoctor(null)
    setName('')
    setSpecialization('')
    setEmail('')
    setPhone('')
    setExperience('')
  }

  // Show skeleton loading state
  if (isLoading) {
    return (
      <>
        <HeaderNav />
        <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
          <DoctorsSkeleton />
        </main>
      </>
    )
  }
  
  // Show error state
  if (error) {
    return (
      <>
        <HeaderNav />
        <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
          <div className="text-center text-destructive">Error: {error.message}</div>
        </main>
      </>
    )
  }

  return (
    <>
      <HeaderNav />
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <section aria-labelledby="doctors-title" className="mb-6 md:mb-8">
          <h1 id="doctors-title" className="text-3xl md:text-4xl font-semibold text-pretty">
            Doctors
          </h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">View and manage doctor profiles.</p>
        </section>

        <section aria-label="Doctor management" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-green-600 rounded-full"></div>
              <h2 className="text-xl font-semibold text-gray-800">Medical Staff</h2>
            </div>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              variant={showAddForm ? "outline" : "default"}
              className={showAddForm ? "border-red-300 text-red-600 hover:bg-red-50" : "bg-green-600 hover:bg-green-700 text-white"}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Doctor
                </>
              )}
            </Button>
          </div>

          {showAddForm && (
            <Card className="border-l-4 border-l-green-500 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {editingDoctor ? 'Edit Doctor Profile' : 'Add New Doctor'}
                </CardTitle>
                <CardDescription className="text-green-700">
                  {editingDoctor ? 'Update doctor credentials and specialization details' : 'Enter comprehensive doctor information and medical expertise'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={onSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter doctor name"
                      required
                      className="border-red-200 focus:border-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      type="text"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      placeholder="Enter specialization"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience (years)</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="Enter years of experience"
                      min="0"
                      max="50"
                      className="border-blue-200 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500">Enter years of experience (0-50)</p>
                  </div>
                  <div className="md:col-span-2 flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={creating || updating || !name.trim()}
                      className="bg-green-600 hover:bg-green-700 text-white px-6"
                    >
                      {creating || updating ? (
                        <>
                          <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Saving...
                        </>
                      ) : editingDoctor ? (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Update Doctor
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add Doctor
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
            <CardHeader className="bg-gradient-to-r from-gray-50 to-green-50">
              <CardTitle className="flex items-center gap-3 text-gray-800">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Doctor Profiles
                <span className="ml-auto text-sm font-normal text-gray-500">
                  {data?.getDoctors?.length || 0} doctors
                </span>
              </CardTitle>
              <CardDescription className="text-gray-600">Complete medical staff database with specializations and credentials</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold text-gray-700">Doctor Name</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Specialization</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Experience</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Contact</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Registered</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.getDoctors?.map((doctor: Doctor) => (
                      <tr key={doctor.id} className="border-b hover:bg-green-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-semibold text-sm">
                                {doctor.name?.charAt(0)?.toUpperCase() || '?'}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{doctor.name || '-'}</div>
                              <div className="text-sm text-gray-500">Doctor ID: {doctor.id.slice(0, 8)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {doctor.specialization || 'Not specified'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {doctor.experience ? `${doctor.experience} years` : 'Not specified'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div className="text-gray-900">{doctor.email || 'No email'}</div>
                            <div className="text-gray-500">{doctor.phone || 'No phone'}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-600">
                            {formatDate(doctor.createdAt)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(doctor)}
                              disabled={deleting}
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(doctor.id)}
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

          {data?.getDoctors?.length === 0 && (
            <Card className="border-dashed border-2 border-gray-200">
              <CardContent className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Doctors Found</h3>
                <p className="text-gray-500 mb-6">Start building your medical staff database by adding your first doctor.</p>
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add First Doctor
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </>
  )
}
