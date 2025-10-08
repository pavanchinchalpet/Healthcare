import { gql } from '@apollo/client'

// Fragments for reusable field sets
export const PATIENT_FRAGMENT = gql`
  fragment PatientFragment on Patient {
    id
    name
    age
    gender
    email
    phone
    address
    createdAt
  }
`

export const DOCTOR_FRAGMENT = gql`
  fragment DoctorFragment on Doctor {
    id
    name
    specialization
    email
    phone
    experience
    createdAt
  }
`

export const APPOINTMENT_FRAGMENT = gql`
  fragment AppointmentFragment on Appointment {
    id
    patientId
    doctorId
    date
    time
    reason
    status
    createdAt
    patient {
      ...PatientFragment
    }
    doctor {
      ...DoctorFragment
    }
  }
  ${PATIENT_FRAGMENT}
  ${DOCTOR_FRAGMENT}
`

// Optimized queries using fragments
export const GET_PATIENTS = gql`
  query GetPatients {
    getPatients {
      ...PatientFragment
    }
  }
  ${PATIENT_FRAGMENT}
`

export const GET_PATIENT = gql`
  query GetPatient($id: ID!) {
    getPatientById(id: $id) {
      ...PatientFragment
    }
  }
  ${PATIENT_FRAGMENT}
`

export const GET_DOCTORS = gql`
  query GetDoctors {
    getDoctors {
      ...DoctorFragment
    }
  }
  ${DOCTOR_FRAGMENT}
`

export const GET_DOCTOR = gql`
  query GetDoctor($id: ID!) {
    getDoctorById(id: $id) {
      ...DoctorFragment
    }
  }
  ${DOCTOR_FRAGMENT}
`

export const GET_APPOINTMENTS = gql`
  query GetAppointments {
    getAppointments {
      ...AppointmentFragment
    }
  }
  ${APPOINTMENT_FRAGMENT}
`

export const GET_APPOINTMENT = gql`
  query GetAppointment($id: ID!) {
    getAppointmentById(id: $id) {
      ...AppointmentFragment
    }
  }
  ${APPOINTMENT_FRAGMENT}
`
