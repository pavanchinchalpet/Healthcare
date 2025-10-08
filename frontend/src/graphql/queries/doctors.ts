import { gql } from '@apollo/client'
import { DOCTOR_FRAGMENT } from '../fragments'

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
