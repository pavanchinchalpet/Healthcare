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
  const { loading, error, data } = useQuery(GET_DOCTORS_LIGHT_STANDALONE, {
    ...queryOptions.doctors,
    fetchPolicy: 'cache-first',
    errorPolicy: 'all'
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
    const createDoctorInput: any = { name }
    if (specialization) createDoctorInput.specialization = specialization
    if (email && email.trim()) createDoctorInput.email = email.trim()
    if (phone) createDoctorInput.phone = phone
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
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              variant={showAddForm ? "outline" : "default"}
            >
              {showAddForm ? 'Cancel' : 'Add Doctor'}
            </Button>
          </div>

          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
                </CardTitle>
                <CardDescription>
                  {editingDoctor ? 'Update doctor information' : 'Enter new doctor details'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={onSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter doctor name"
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
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-2">
                    <Button
                      type="submit"
                      disabled={creating || updating || !name.trim()}
                    >
                      {creating || updating ? 'Saving...' : editingDoctor ? 'Update Doctor' : 'Add Doctor'}
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
              <CardTitle>All Doctors</CardTitle>
              <CardDescription>Manage doctor profiles and information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Name</th>
                      <th className="text-left p-2 font-medium">Specialization</th>
                      <th className="text-left p-2 font-medium">Email</th>
                      <th className="text-left p-2 font-medium">Phone</th>
                      <th className="text-left p-2 font-medium">Experience</th>
                      <th className="text-left p-2 font-medium">Created</th>
                      <th className="text-left p-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.getDoctors?.map((doctor: Doctor) => (
                      <tr key={doctor.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{doctor.name || '-'}</td>
                        <td className="p-2 text-muted-foreground">{doctor.specialization || '-'}</td>
                        <td className="p-2 text-muted-foreground">{doctor.email || '-'}</td>
                        <td className="p-2 text-muted-foreground">{doctor.phone || '-'}</td>
                        <td className="p-2 text-muted-foreground">{doctor.experience ? `${doctor.experience} years` : '-'}</td>
                        <td className="p-2 text-muted-foreground">{new Date(doctor.createdAt).toLocaleDateString()}</td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(doctor)}
                              disabled={deleting}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(doctor.id)}
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

          {data?.getDoctors?.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">No doctors found. Add your first doctor above.</p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </>
  )
}
