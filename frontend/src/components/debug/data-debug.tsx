'use client'

import { useQuery } from '@apollo/client'
import { GET_PATIENTS_LIGHT, GET_DOCTORS_LIGHT, GET_APPOINTMENTS_LIGHT } from '@/graphql/queries/appointments-optimized'

export default function DataDebugComponent() {
  const { data: patientsData, loading: patientsLoading, error: patientsError } = useQuery(GET_PATIENTS_LIGHT)
  const { data: doctorsData, loading: doctorsLoading, error: doctorsError } = useQuery(GET_DOCTORS_LIGHT)
  const { data: appointmentsData, loading: appointmentsLoading, error: appointmentsError } = useQuery(GET_APPOINTMENTS_LIGHT)

  return (
    <div className="p-4 bg-gray-100 rounded-lg m-4">
      <h2 className="text-xl font-bold mb-4">🔍 Data Debug Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Patients Debug */}
        <div className="bg-white p-4 rounded">
          <h3 className="font-bold text-green-600">Patients</h3>
          <p>Loading: {patientsLoading ? 'Yes' : 'No'}</p>
          <p>Error: {patientsError ? patientsError.message : 'None'}</p>
          <p>Count: {patientsData?.getPatients?.length || 0}</p>
          {patientsData?.getPatients && (
            <div className="mt-2">
              <p className="text-sm font-semibold">First 3 patients:</p>
              {patientsData.getPatients.slice(0, 3).map((patient: any, index: number) => (
                <p key={index} className="text-xs text-gray-600">
                  {index + 1}. {patient.name} ({patient.email || 'No email'})
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Doctors Debug */}
        <div className="bg-white p-4 rounded">
          <h3 className="font-bold text-blue-600">Doctors</h3>
          <p>Loading: {doctorsLoading ? 'Yes' : 'No'}</p>
          <p>Error: {doctorsError ? doctorsError.message : 'None'}</p>
          <p>Count: {doctorsData?.getDoctors?.length || 0}</p>
          {doctorsData?.getDoctors && (
            <div className="mt-2">
              <p className="text-sm font-semibold">First 3 doctors:</p>
              {doctorsData.getDoctors.slice(0, 3).map((doctor: any, index: number) => (
                <p key={index} className="text-xs text-gray-600">
                  {index + 1}. {doctor.name} ({doctor.specialization || 'No specialization'})
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Appointments Debug */}
        <div className="bg-white p-4 rounded">
          <h3 className="font-bold text-purple-600">Appointments</h3>
          <p>Loading: {appointmentsLoading ? 'Yes' : 'No'}</p>
          <p>Error: {appointmentsError ? appointmentsError.message : 'None'}</p>
          <p>Count: {appointmentsData?.getAppointments?.length || 0}</p>
          {appointmentsData?.getAppointments && (
            <div className="mt-2">
              <p className="text-sm font-semibold">First 3 appointments:</p>
              {appointmentsData.getAppointments.slice(0, 3).map((appointment: any, index: number) => (
                <p key={index} className="text-xs text-gray-600">
                  {index + 1}. {appointment.date} {appointment.time} ({appointment.status})
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 p-4 bg-yellow-50 rounded">
        <h4 className="font-bold text-yellow-800">💡 Troubleshooting Tips:</h4>
        <ul className="text-sm text-yellow-700 mt-2">
          <li>• If counts are 0, check GraphQL queries</li>
          <li>• If errors exist, check backend connection</li>
          <li>• If loading is true, check network requests</li>
          <li>• If data exists but UI doesn't show, check component rendering</li>
        </ul>
      </div>
    </div>
  )
}
