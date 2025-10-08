// Utility functions for the healthcare application

import { Patient, Doctor, Appointment, AppointmentStatus } from '@/types'

// Date formatting utilities
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString()
}

export const formatTime = (timeString: string): string => {
  if (!timeString) return '-'
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// Status utilities
export const getStatusColor = (status: AppointmentStatus): string => {
  switch (status) {
    case 'Scheduled':
      return 'bg-gray-100 text-gray-800'
    case 'Completed':
      return 'bg-black text-white'
    case 'Cancelled':
      return 'bg-gray-200 text-gray-800'
    case 'Rescheduled':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Form validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0
}

// Data transformation utilities
export const transformPatientData = (data: any) => {
  return {
    name: data.name?.trim() || '',
    age: data.age ? parseInt(data.age, 10) : undefined,
    gender: data.gender || '',
    email: data.email?.trim() || '',
    phone: data.phone?.trim() || '',
    address: data.address?.trim() || ''
  }
}

export const transformDoctorData = (data: any) => {
  return {
    name: data.name?.trim() || '',
    specialization: data.specialization?.trim() || '',
    email: data.email?.trim() || '',
    phone: data.phone?.trim() || '',
    experience: data.experience ? parseInt(data.experience, 10) : undefined
  }
}

export const transformAppointmentData = (data: any) => {
  return {
    patientId: data.patientId || '',
    doctorId: data.doctorId || '',
    date: data.date || '',
    time: data.time || '',
    status: data.status || 'Scheduled',
    reason: data.reason?.trim() || ''
  }
}

// Error handling utilities
export const handleGraphQLError = (error: any): string => {
  if (error?.message) {
    return error.message
  }
  if (error?.graphQLErrors?.length > 0) {
    return error.graphQLErrors[0].message
  }
  return 'An unexpected error occurred'
}

// Debounce utility for search/filtering
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Local storage utilities
export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.warn('Failed to save to localStorage:', error)
  }
}

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.warn('Failed to load from localStorage:', error)
    return defaultValue
  }
}
