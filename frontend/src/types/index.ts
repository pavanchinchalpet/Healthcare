// Shared TypeScript interfaces for the healthcare application

export interface Patient {
  id: string
  name?: string
  age?: number
  gender?: string
  email?: string
  phone?: string
  address?: string
  createdAt: string
}

export interface Doctor {
  id: string
  name?: string
  specialization?: string
  email?: string
  phone?: string
  experience?: number
  createdAt: string
}

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  date?: string
  time?: string
  reason?: string
  status?: string
  createdAt: string
  patient: Patient
  doctor: Doctor
}

// Form input types
export interface PatientFormData {
  name: string
  age?: string
  gender: string
  email: string
  phone: string
  address: string
}

export interface DoctorFormData {
  name: string
  specialization: string
  email: string
  phone: string
  experience: string
}

export interface AppointmentFormData {
  patientId: string
  doctorId: string
  date: string
  time: string
  status: string
  reason: string
}

// Status types
export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled'
export type Gender = 'Male' | 'Female' | 'Other'

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'
export type FormMode = 'create' | 'edit'
