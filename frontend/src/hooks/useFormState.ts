import { useState, useCallback } from 'react'
import { PatientFormData, DoctorFormData, AppointmentFormData } from '@/types'

// Generic form hook for managing form state and validation
export function useFormState<T extends Record<string, any>>(initialState: T) {
  const [formData, setFormData] = useState<T>(initialState)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})

  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  const resetForm = useCallback(() => {
    setFormData(initialState)
    setErrors({})
  }, [initialState])

  const setFormErrors = useCallback((newErrors: Partial<Record<keyof T, string>>) => {
    setErrors(newErrors)
  }, [])

  const setFormDataValue = useCallback((newData: T) => {
    setFormData(newData)
    setErrors({})
  }, [])

  return {
    formData,
    errors,
    updateField,
    resetForm,
    setFormErrors,
    setFormData: setFormDataValue,
    isValid: Object.keys(errors).length === 0
  }
}

// Specific hooks for each entity type
export function usePatientForm() {
  const initialState: PatientFormData = {
    name: '',
    age: '',
    gender: '',
    email: '',
    phone: '',
    address: ''
  }
  
  return useFormState(initialState)
}

export function useDoctorForm() {
  const initialState: DoctorFormData = {
    name: '',
    specialization: '',
    email: '',
    phone: '',
    experience: ''
  }
  
  return useFormState(initialState)
}

export function useAppointmentForm() {
  const initialState: AppointmentFormData = {
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    status: 'Scheduled',
    reason: ''
  }
  
  return useFormState(initialState)
}
