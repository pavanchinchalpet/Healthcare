import { gql } from '@apollo/client'

export const CREATE_PATIENT = gql`
  mutation CreatePatient($createPatientInput: CreatePatientInput!) {
    createPatient(createPatientInput: $createPatientInput) {
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

export const PATIENT_LOGIN = gql`
  mutation PatientLogin($loginInput: PatientLoginInput!) {
    patientLogin(loginInput: $loginInput) {
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

export const UPDATE_PATIENT = gql`
  mutation UpdatePatient($updatePatientInput: UpdatePatientInput!) {
    updatePatient(updatePatientInput: $updatePatientInput) {
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

export const RESET_PATIENT_PASSWORD = gql`
  mutation ResetPatientPassword($resetPasswordInput: ResetPasswordInput!) {
    resetPatientPassword(resetPasswordInput: $resetPasswordInput) {
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

export const DELETE_PATIENT = gql`
  mutation DeletePatient($id: ID!) {
    deletePatient(id: $id)
  }
`

export const BULK_CREATE_PATIENTS = gql`
  mutation BulkCreatePatients($patients: [CreatePatientInput!]!) {
    bulkCreatePatients(patients: $patients) {
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
