import { gql } from '@apollo/client'
import { PATIENT_FRAGMENT } from '../fragments'

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
