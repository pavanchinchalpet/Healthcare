'use client'

import { useQuery, useMutation } from '@apollo/client'
import { GET_PATIENTS_LIGHT_STANDALONE } from '@/graphql/queries/appointments-optimized'
import { CREATE_PATIENT, UPDATE_PATIENT, DELETE_PATIENT } from '@/graphql/mutations/patients'
import { queryOptions } from '@/lib/apollo-client'
import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/lib/auth'
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
  const { role, displayName, logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)

  const [name, setName] = useState('')
  const [age, setAge] = useState<string>('')
  const [gender, setGender] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  const { loading, error, data } = useQuery(GET_PATIENTS_LIGHT_STANDALONE, {
    ...queryOptions.patients,
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false,
  })

  const patients = useMemo(() => data?.getPatients || [], [data])

  const filteredPatients = useMemo(() => {
    if (!searchTerm.trim()) return patients
    const term = searchTerm.toLowerCase()
    return patients.filter((patient: Patient) =>
      patient.name?.toLowerCase().includes(term) ||
      patient.email?.toLowerCase().includes(term) ||
      patient.phone?.toLowerCase().includes(term)
    )
  }, [patients, searchTerm])

  const [createPatient, { loading: creating }] = useMutation(CREATE_PATIENT, {
    refetchQueries: [{ query: GET_PATIENTS_LIGHT_STANDALONE }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      alert('Patient created successfully!')
      handleCancel()
    },
  })

  const [updatePatient, { loading: updating }] = useMutation(UPDATE_PATIENT, {
    refetchQueries: [{ query: GET_PATIENTS_LIGHT_STANDALONE }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      alert('Patient updated successfully!')
      handleCancel()
    },
  })

  const [deletePatient] = useMutation(DELETE_PATIENT, {
    refetchQueries: [{ query: GET_PATIENTS_LIGHT_STANDALONE }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      alert('Patient deleted successfully!')
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
    
    if (!name.trim()) {
      alert('Name is required!')
      return
    }
    
    const createPatientInput: any = { name: name.trim() }
    if (age && !isNaN(parseInt(age, 10))) createPatientInput.age = parseInt(age, 10)
    if (gender) createPatientInput.gender = gender.trim()
    if (email && email.trim()) createPatientInput.email = email.trim()
    if (phone) createPatientInput.phone = phone.trim()
    if (address) createPatientInput.address = address.trim()

    if (editingPatient) {
      await updatePatient({ variables: { updatePatientInput: { id: editingPatient.id, ...createPatientInput } } })
    } else {
      await createPatient({ variables: { createPatientInput } })
    }
  }

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient)
    setName(patient.name)
    setAge(patient.age?.toString() || '')
    setGender(patient.gender || '')
    setEmail(patient.email || '')
    setPhone(patient.phone || '')
    setAddress(patient.address || '')
    setShowAddForm(true)
  }

  const handleDelete = async (patientId: string) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      await deletePatient({ variables: { id: patientId } })
    }
  }

  const handleView = (patient: Patient) => {
    // Navigate to patient detail page or show modal
    alert(`View patient: ${patient.name}`)
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  if (loading) {
    return <PatientsSkeleton />
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
              <a href="/patients" className="flex items-center gap-1 text-blue-600 font-medium bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Patients
              </a>
              <a href="/appointments" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
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
          <h1 className="text-3xl font-bold text-blue-600 mb-1">Patient Management</h1>
          <p className="text-gray-600">View and manage patient records</p>
        </div>

        {/* Search and Add Button */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Patient
          </button>
        </div>

        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{editingPatient ? 'Edit Patient' : 'Add Patient'}</h2>
              <form onSubmit={onSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
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

        {/* Patient Cards */}
        <div className="grid grid-cols-1 gap-4">
          {filteredPatients.map((patient: Patient) => (
            <div key={patient.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between gap-6">
                {/* Left Side - Icon and Name */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{patient.name}</h3>
                    <p className="text-sm text-gray-600">Last visit: {formatDate(patient.createdAt)}</p>
                  </div>
                </div>

                {/* Middle - Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 mx-8">
                  {patient.email && (
                    <div>
                      <span className="text-sm text-gray-600">Email:</span>
                      <p className="text-sm text-gray-900">{patient.email}</p>
                    </div>
                  )}
                  {patient.phone && (
                    <div>
                      <span className="text-sm text-gray-600">Phone:</span>
                      <p className="text-sm text-gray-900">{patient.phone}</p>
                    </div>
                  )}
                  {patient.address && (
                    <div>
                      <span className="text-sm text-gray-600">Address:</span>
                      <p className="text-sm text-gray-900">{patient.address}</p>
                    </div>
                  )}
                </div>

                {/* Right Side - Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleView(patient)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View"
                  >
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleEdit(patient)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(patient.id)}
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
          ))}
        </div>

        {/* Empty State */}
        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No patients found</p>
          </div>
        )}
      </div>
    </main>
  )
}
