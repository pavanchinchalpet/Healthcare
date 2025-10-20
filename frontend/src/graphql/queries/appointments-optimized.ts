import { gql } from '@apollo/client'

// Lightweight queries for initial load - only essential fields
export const GET_APPOINTMENTS_LIGHT = gql`
  query GetAppointmentsLight {
    getAppointments {
      id
      patientId
      doctorId
      date
      time
      reason
      status
      createdAt
      patient {
        id
        name
      }
      doctor {
        id
        name
        specialization
      }
    }
  }
`

export const GET_PATIENTS_LIGHT = gql`
  query GetPatientsLight {
    getPatients {
      id
      name
      age
      gender
      email
      phone
      address
      createdAt
    }
  }
`

export const GET_DOCTORS_LIGHT = gql`
  query GetDoctorsLight {
    getDoctors {
      id
      name
      specialization
    }
  }
`

// Full queries for detailed views
export const GET_APPOINTMENTS_FULL = gql`
  query GetAppointmentsFull {
    getAppointments {
      id
      patientId
      doctorId
      date
      time
      reason
      status
      createdAt
      patient {
        id
        name
        age
        gender
        email
        phone
        address
        createdAt
      }
      doctor {
        id
        name
        specialization
        email
        phone
        experience
        createdAt
      }
    }
  }
`

export const GET_PATIENTS_FULL = gql`
  query GetPatientsFull {
    getPatients {
      id
      name
      age
      gender
      email
      phone
      address
      createdAt
    }
  }
`

export const GET_DOCTORS_FULL = gql`
  query GetDoctorsFull {
    getDoctors {
      id
      name
      specialization
      email
      phone
      experience
      createdAt
    }
  }
`

// Additional lightweight queries for other pages
export const GET_PATIENTS_LIGHT_STANDALONE = gql`
  query GetPatientsLightStandalone {
    getPatients {
      id
      name
      age
      gender
      email
      phone
      address
      createdAt
    }
  }
`

export const GET_DOCTORS_LIGHT_STANDALONE = gql`
  query GetDoctorsLightStandalone {
    getDoctors {
      id
      name
      specialization
      email
      phone
      experience
      createdAt
    }
  }
`
