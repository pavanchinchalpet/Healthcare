import { gql } from '@apollo/client'
import { APPOINTMENT_FRAGMENT } from '../fragments'

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
