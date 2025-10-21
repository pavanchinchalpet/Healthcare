import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string to a localized date string
 * @param dateString - The date string to format
 * @param options - Intl.DateTimeFormatOptions for customization
 * @returns Formatted date string
 */
export function formatDate(dateString: string | null | undefined, options?: Intl.DateTimeFormatOptions): string {
  if (!dateString) return 'Not available'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid date'
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

/**
 * Formats a time string to a localized time string
 * @param timeString - The time string to format (e.g., "14:30")
 * @returns Formatted time string
 */
export function formatTime(timeString: string | null | undefined): string {
  if (!timeString) return 'Not specified'
  
  try {
    // Handle both "HH:MM" format and full datetime strings
    const time = timeString.includes('T') ? new Date(timeString) : new Date(`2000-01-01T${timeString}`)
    if (isNaN(time.getTime())) return 'Invalid time'
    
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  } catch (error) {
    console.error('Error formatting time:', error)
    return 'Invalid time'
  }
}

/**
 * Formats a datetime string to a localized datetime string
 * @param dateTimeString - The datetime string to format
 * @returns Formatted datetime string
 */
export function formatDateTime(dateTimeString: string | null | undefined): string {
  if (!dateTimeString) return 'Not available'
  
  try {
    const date = new Date(dateTimeString)
    if (isNaN(date.getTime())) return 'Invalid datetime'
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  } catch (error) {
    console.error('Error formatting datetime:', error)
    return 'Invalid datetime'
  }
}