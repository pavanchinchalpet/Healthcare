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

export const DELETE_PATIENT = gql`
  mutation DeletePatient($id: ID!) {
    deletePatient(id: $id)
  }
`
