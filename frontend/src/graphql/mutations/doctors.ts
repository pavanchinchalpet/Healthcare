import { gql } from '@apollo/client'

export const CREATE_DOCTOR = gql`
  mutation CreateDoctor($createDoctorInput: CreateDoctorInput!) {
    createDoctor(createDoctorInput: $createDoctorInput) {
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

export const UPDATE_DOCTOR = gql`
  mutation UpdateDoctor($updateDoctorInput: UpdateDoctorInput!) {
    updateDoctor(updateDoctorInput: $updateDoctorInput) {
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

export const DELETE_DOCTOR = gql`
  mutation DeleteDoctor($id: ID!) {
    deleteDoctor(id: $id)
  }
`

export const BULK_CREATE_DOCTORS = gql`
  mutation BulkCreateDoctors($doctors: [CreateDoctorInput!]!) {
    bulkCreateDoctors(doctors: $doctors) {
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
