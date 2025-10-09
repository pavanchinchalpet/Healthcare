'use client'

import { useQuery, useMutation } from '@apollo/client'
import { GET_PATIENTS_LIGHT_STANDALONE } from '@/graphql/queries/appointments-optimized'
import { CREATE_PATIENT, UPDATE_PATIENT, DELETE_PATIENT } from '@/graphql/mutations/patients'
import { queryOptions } from '@/lib/apollo-client'
import { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import HeaderNav from "@/components/healthcare/header-nav"
import { PatientsSkeleton } from "@/components/patients/patients-skeleton"

interface Patient {
  id: string
  name: string
  age?: number
  gender?: string
  email?: string
  phone?: string
  address?: string
  createdAt: string
}

export default function PatientsPage() {
  // Optimized query with better fetch policy
  const { loading, error, data } = useQuery(GET_PATIENTS_LIGHT_STANDALONE, {
    ...queryOptions.patients,
    fetchPolicy: 'cache-first',
    errorPolicy: 'all'
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)

  const [name, setName] = useState('')
  const [age, setAge] = useState<string>('')
  const [gender, setGender] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  // Memoized loading state for better performance
  const isLoading = useMemo(() => loading, [loading])

  const [createPatient, { loading: creating }] = useMutation(CREATE_PATIENT, {
    refetchQueries: [{ query: GET_PATIENTS_LIGHT_STANDALONE }],
    awaitRefetchQueries: true,
    onError: (error) => {
      console.error('❌ Error creating patient:', error)
      alert(`Error: ${error.message}`)
    },
    onCompleted: (data) => {
      console.log('✅ Patient created successfully:', data)
      alert('Patient created successfully!')
    }
  })

  const [updatePatient, { loading: updating }] = useMutation(UPDATE_PATIENT, {
    refetchQueries: [{ query: GET_PATIENTS_LIGHT_STANDALONE }],
    awaitRefetchQueries: true,
    onError: (error) => {
      console.error('❌ Error updating patient:', error)
      alert(`Error: ${error.message}`)
    },
    onCompleted: (data) => {
      console.log('✅ Patient updated successfully:', data)
      alert('Patient updated successfully!')
    }
  })

  const [deletePatient, { loading: deleting }] = useMutation(DELETE_PATIENT, {
    refetchQueries: [{ query: GET_PATIENTS_LIGHT_STANDALONE }],
    awaitRefetchQueries: true,
    onError: (error) => {
      console.error('❌ Error deleting patient:', error)
      alert(`Error: ${error.message}`)
    },
    onCompleted: (data) => {
      console.log('✅ Patient deleted successfully:', data)
      alert('Patient deleted successfully!')
    }
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('📝 Form submitted - editingPatient:', editingPatient)
    console.log('📝 Form data before processing:')
    console.log('  - name:', name)
    console.log('  - age:', age)
    console.log('  - gender:', gender)
    console.log('  - email:', email)
    console.log('  - phone:', phone)
    console.log('  - address:', address)
    
    const createPatientInput: any = { name }
    if (age && !isNaN(parseInt(age, 10))) {
      createPatientInput.age = parseInt(age, 10)
    }
    if (gender) createPatientInput.gender = gender
    if (email && email.trim()) createPatientInput.email = email.trim()
    if (phone) createPatientInput.phone = phone
    if (address) createPatientInput.address = address

    console.log('📝 Final patient input data:', JSON.stringify(createPatientInput, null, 2))

    try {
      if (editingPatient) {
        // Update existing patient
        const updatePatientInput = {
          id: editingPatient.id,
          ...createPatientInput
        }
        console.log('📝 Updating patient with:', JSON.stringify(updatePatientInput, null, 2))
        await updatePatient({ variables: { updatePatientInput } })
        console.log('✅ Patient update successful')
      } else {
        // Create new patient
        console.log('📝 Creating new patient with:', JSON.stringify(createPatientInput, null, 2))
        await createPatient({ variables: { createPatientInput } })
        console.log('✅ Patient creation successful')
      }
    } catch (error) {
      console.error('❌ Form submission error:', error)
      console.error('❌ Error details:', (error as Error).message)
    }
    
    setName('')
    setAge('')
    setGender('')
    setEmail('')
    setPhone('')
    setAddress('')
    setShowAddForm(false)
  }

  const handleEdit = (patient: Patient) => {
    console.log('✏️ Editing patient:', patient)
    setEditingPatient(patient)
    setName(patient.name || '')
    setAge(patient.age?.toString() || '')
    setGender(patient.gender || '')
    setEmail(patient.email || '')
    setPhone(patient.phone || '')
    setAddress(patient.address || '')
    setShowAddForm(true)
  }

  const handleDelete = async (patientId: string) => {
    console.log('🗑️ Deleting patient with id:', patientId)
    if (confirm('Are you sure you want to delete this patient?')) {
      try {
        await deletePatient({ variables: { id: patientId } })
        console.log('✅ Patient deletion successful')
      } catch (error) {
        console.error('❌ Delete error:', error)
      }
    }
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingPatient(null)
    setName('')
    setAge('')
    setGender('')
    setEmail('')
    setPhone('')
    setAddress('')
  }

  // Show skeleton loading state
  if (isLoading) {
    return (
      <>
        <HeaderNav />
        <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
          <PatientsSkeleton />
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
        <section aria-labelledby="patients-title" className="mb-6 md:mb-8">
          <h1 id="patients-title" className="text-3xl md:text-4xl font-semibold text-pretty">
            Patients
          </h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">Manage patient records and medical history.</p>
        </section>

        <section aria-label="Patient management" className="space-y-6">
          <div className="flex justify-between items-center">
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              variant={showAddForm ? "outline" : "default"}
            >
              {showAddForm ? 'Cancel' : 'Add Patient'}
            </Button>
          </div>

          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingPatient ? 'Edit Patient' : 'Add New Patient'}
                </CardTitle>
                <CardDescription>
                  {editingPatient ? 'Update patient information' : 'Enter new patient details'}
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                      placeholder="Enter patient name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAge(e.target.value)}
                      placeholder="Enter age"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      rows={3}
                      value={address}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAddress(e.target.value)}
                      placeholder="Enter address"
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-2">
                    <Button
                      type="submit"
                      disabled={creating || updating || !name.trim()}
                    >
                      {creating || updating ? 'Saving...' : editingPatient ? 'Update Patient' : 'Add Patient'}
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
              <CardTitle>All Patients</CardTitle>
              <CardDescription>Manage patient records and information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Name</th>
                      <th className="text-left p-2 font-medium">Age</th>
                      <th className="text-left p-2 font-medium">Gender</th>
                      <th className="text-left p-2 font-medium">Email</th>
                      <th className="text-left p-2 font-medium">Phone</th>
                      <th className="text-left p-2 font-medium">Address</th>
                      <th className="text-left p-2 font-medium">Created</th>
                      <th className="text-left p-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.getPatients?.map((patient: Patient) => (
                      <tr key={patient.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{patient.name || '-'}</td>
                        <td className="p-2 text-muted-foreground">{patient.age || '-'}</td>
                        <td className="p-2 text-muted-foreground">{patient.gender || '-'}</td>
                        <td className="p-2 text-muted-foreground">{patient.email || '-'}</td>
                        <td className="p-2 text-muted-foreground">{patient.phone || '-'}</td>
                        <td className="p-2 text-muted-foreground max-w-xs truncate">{patient.address || '-'}</td>
                        <td className="p-2 text-muted-foreground">{new Date(patient.createdAt).toLocaleDateString()}</td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(patient)}
                              disabled={deleting}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(patient.id)}
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

          {data?.getPatients?.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">No patients found. Add your first patient above.</p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </>
  )
}
