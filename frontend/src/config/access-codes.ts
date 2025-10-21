/**
 * Access Code Configuration
 * 
 * This file contains the access codes for different roles in the healthcare system.
 * These codes are used for staff authentication and should be kept secure.
 * 
 * Note: In a production environment, these should be stored securely on the server
 * and validated through a proper authentication API.
 */

export const ACCESS_CODES = {
  // Admin access code - provides full system access
  ADMIN: 'admin123',
  
  // Doctor access code - provides doctor-level access
  DOCTOR: 'doctor123',
  
  // Staff access code - provides general staff access
  STAFF: 'staff123',
} as const

export type AccessCodeRole = keyof typeof ACCESS_CODES

/**
 * Validates an access code against the configured codes
 * @param code - The access code to validate
 * @param role - The role being requested
 * @returns true if the code is valid for the role
 */
export function validateAccessCode(code: string, role: AccessCodeRole): boolean {
  const trimmedCode = code.trim()
  return trimmedCode === ACCESS_CODES[role]
}

/**
 * Gets the access code for a specific role
 * @param role - The role to get the code for
 * @returns The access code for the role
 */
export function getAccessCode(role: AccessCodeRole): string {
  return ACCESS_CODES[role]
}

/**
 * Checks if a code matches any of the configured access codes
 * @param code - The code to check
 * @returns The role that matches the code, or null if no match
 */
export function getRoleFromCode(code: string): AccessCodeRole | null {
  const trimmedCode = code.trim()
  
  for (const [role, accessCode] of Object.entries(ACCESS_CODES)) {
    if (trimmedCode === accessCode) {
      return role as AccessCodeRole
    }
  }
  
  return null
}
