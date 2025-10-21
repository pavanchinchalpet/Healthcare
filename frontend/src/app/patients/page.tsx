'use client'

import { useQuery, useMutation } from '@apollo/client'
import { GET_PATIENTS_LIGHT_STANDALONE } from '@/graphql/queries/appointments-optimized'
import { CREATE_PATIENT, UPDATE_PATIENT, DELETE_PATIENT, BULK_CREATE_PATIENTS } from '@/graphql/mutations/patients'
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
import { formatDate } from '@/lib/utils'

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
  // Optimized query with better performance
  const { loading, error, data } = useQuery(GET_PATIENTS_LIGHT_STANDALONE, {
    ...queryOptions.patients,
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false, // Reduce re-renders
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [showBulkUpload, setShowBulkUpload] = useState(false)
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

  const [bulkCreatePatients, { loading: bulkUploading }] = useMutation(BULK_CREATE_PATIENTS, {
    refetchQueries: [{ query: GET_PATIENTS_LIGHT_STANDALONE }],
    awaitRefetchQueries: true,
    onError: (error) => {
      console.error('❌ Error bulk uploading patients:', error)
      alert(`Error: ${error.message}`)
    },
    onCompleted: (data) => {
      console.log('✅ Patients bulk uploaded successfully:', data)
      alert(`${data.bulkCreatePatients.length} patients uploaded successfully!`)
      setShowBulkUpload(false)
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

  const parseCSV = (csvText: string): any[] => {
    const lines = csvText.split('\n').filter(line => line.trim())
    if (lines.length < 2) return []
    
    const headers = lines[0].split(',').map(h => h.trim())
    const patients = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const patient: any = {}
      
      headers.forEach((header, index) => {
        const value = values[index] || ''
        if (header === 'age' && value) {
          patient[header] = parseInt(value) || null
        } else if (value) {
          patient[header] = value
        }
      })
      
      if (patient.name) {
        patients.push(patient)
      }
    }
    
    return patients
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    if (!file.name.endsWith('.csv')) {
      alert('Please select a CSV file')
      return
    }
    
    const reader = new FileReader()
    reader.onload = async (e) => {
      const csvText = e.target?.result as string
      const patients = parseCSV(csvText)
      
      if (patients.length === 0) {
        alert('No valid patients found in CSV file')
        return
      }
      
      try {
        await bulkCreatePatients({ variables: { patients } })
      } catch (error) {
        console.error('Bulk upload error:', error)
      }
    }
    
    reader.readAsText(file)
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
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
              <h2 className="text-xl font-semibold text-gray-800">Patient Records</h2>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowBulkUpload(!showBulkUpload)}
                variant={showBulkUpload ? "outline" : "secondary"}
                className={showBulkUpload ? "border-orange-300 text-orange-600 hover:bg-orange-50" : "bg-orange-600 hover:bg-orange-700 text-white"}
              >
                {showBulkUpload ? (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel Upload
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Bulk Upload
                  </>
                )}
              </Button>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                variant={showAddForm ? "outline" : "default"}
                className={showAddForm ? "border-red-300 text-red-600 hover:bg-red-50" : "bg-blue-600 hover:bg-blue-700 text-white"}
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
                    Add New Patient
                  </>
                )}
              </Button>
            </div>
          </div>

          {showAddForm && (
            <Card className="border-l-4 border-l-blue-500 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {editingPatient ? 'Edit Patient Information' : 'Add New Patient'}
                </CardTitle>
                <CardDescription className="text-blue-700">
                  {editingPatient ? 'Update patient medical records and personal details' : 'Enter comprehensive patient information for medical records'}
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
                      ) : editingPatient ? (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Update Patient
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add Patient
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

          {showBulkUpload && (
            <Card className="border-l-4 border-l-orange-500 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                <CardTitle className="flex items-center gap-2 text-orange-900">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Bulk Upload Patients
                </CardTitle>
                <CardDescription className="text-orange-700">
                  Upload multiple patients at once using a CSV file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor="csv-file" className="text-sm font-medium">
                      Select CSV File
                    </Label>
                    <Input
                      id="csv-file"
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      disabled={bulkUploading}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="border-orange-300 text-orange-600 hover:bg-orange-50"
                    >
                      <a href="/templates/patients-template.csv" download>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Template
                      </a>
                    </Button>
                  </div>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-medium text-orange-900 mb-2">CSV Format Requirements:</h4>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• <strong>Required:</strong> name</li>
                    <li>• <strong>Optional:</strong> age, gender, email, phone, address</li>
                    <li>• First row must contain column headers</li>
                    <li>• Use commas to separate values</li>
                    <li>• Age should be a number</li>
                  </ul>
                </div>

                {bulkUploading && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Uploading patients...
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
              <CardTitle className="flex items-center gap-3 text-gray-800">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Patient Records
                <span className="ml-auto text-sm font-normal text-gray-500">
                  {data?.getPatients?.length || 0} patients
                </span>
              </CardTitle>
              <CardDescription className="text-gray-600">Complete patient database with medical information</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold text-gray-700">Patient Name</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Age</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Gender</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Contact</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Address</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Registered</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.getPatients?.map((patient: Patient) => (
                      <tr key={patient.id} className="border-b hover:bg-blue-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-sm">
                                {patient.name?.charAt(0)?.toUpperCase() || '?'}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{patient.name || '-'}</div>
                              <div className="text-sm text-gray-500">Patient ID: {patient.id.slice(0, 8)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {patient.age ? `${patient.age} years` : 'Not specified'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            patient.gender === 'Male' ? 'bg-blue-100 text-blue-800' :
                            patient.gender === 'Female' ? 'bg-pink-100 text-pink-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {patient.gender || 'Not specified'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div className="text-gray-900">{patient.email || 'No email'}</div>
                            <div className="text-gray-500">{patient.phone || 'No phone'}</div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                          {patient.address || 'No address provided'}
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-600">
                            {formatDate(patient.createdAt)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(patient)}
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
                              onClick={() => handleDelete(patient.id)}
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

          {data?.getPatients?.length === 0 && (
            <Card className="border-dashed border-2 border-gray-200">
              <CardContent className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Patients Found</h3>
                <p className="text-gray-500 mb-6">Start building your patient database by adding your first patient.</p>
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add First Patient
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </>
  )
}
