import { gql } from '@apollo/client'

export const CREATE_APPOINTMENT = gql`
  mutation CreateAppointment($createAppointmentInput: CreateAppointmentInput!) {
    createAppointment(createAppointmentInput: $createAppointmentInput) {
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
      }
      doctor {
        id
        name
        specialization
        email
        phone
        experience
      }
    }
  }
`

export const UPDATE_APPOINTMENT = gql`
  mutation UpdateAppointment($updateAppointmentInput: UpdateAppointmentInput!) {
    updateAppointment(updateAppointmentInput: $updateAppointmentInput) {
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
      }
      doctor {
        id
        name
        specialization
        email
        phone
        experience
      }
    }
  }
`

export const DELETE_APPOINTMENT = gql`
  mutation DeleteAppointment($id: ID!) {
    deleteAppointment(id: $id)
  }
`
