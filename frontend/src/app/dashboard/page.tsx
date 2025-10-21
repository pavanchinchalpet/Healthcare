'use client'

import { useAuth } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_PATIENTS_LIGHT, GET_DOCTORS_LIGHT, GET_APPOINTMENTS_LIGHT } from '@/graphql/queries/appointments-optimized'
import DataDebugComponent from '@/components/debug/data-debug'
import { formatDate } from '@/lib/utils'

interface DashboardStats {
  totalPatients: number
  totalDoctors: number
  totalAppointments: number
  todayAppointments: number
  pendingAppointments: number
  completedAppointments: number
}

export default function DashboardPage() {
  const { role, displayName } = useAuth()
  const [isClient, setIsClient] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch data
  const { data: patientsData } = useQuery(GET_PATIENTS_LIGHT)
  const { data: doctorsData } = useQuery(GET_DOCTORS_LIGHT)
  const { data: appointmentsData } = useQuery(GET_APPOINTMENTS_LIGHT)

  useEffect(() => {
    if (patientsData?.getPatients && doctorsData?.getDoctors && appointmentsData?.getAppointments) {
      const today = new Date().toISOString().split('T')[0]
      
      const todayAppts = appointmentsData.getAppointments.filter((apt: any) => apt.date === today)
      const pendingAppts = appointmentsData.getAppointments.filter((apt: any) => apt.status === 'Scheduled')
      const completedAppts = appointmentsData.getAppointments.filter((apt: any) => apt.status === 'Completed')

      setStats({
        totalPatients: patientsData.getPatients.length,
        totalDoctors: doctorsData.getDoctors.length,
        totalAppointments: appointmentsData.getAppointments.length,
        todayAppointments: todayAppts.length,
        pendingAppointments: pendingAppts.length,
        completedAppointments: completedAppts.length
      })
    }
  }, [patientsData, doctorsData, appointmentsData])

  // Redirect if not authenticated (only after client mount)
  useEffect(() => {
    if (isClient && !role) {
      console.log('No role found, redirecting to landing page')
      window.location.href = '/'
    }
  }, [isClient, role])

  if (!isClient || !role) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Healthcare Dashboard
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome back, {displayName}! Here's your healthcare system overview.
          </p>
        </div>

        {/* Debug Component - Remove this after fixing the issue */}
        <DataDebugComponent />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalPatients}</div>
              <p className="text-xs opacity-75 mt-1">Registered patients</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalDoctors}</div>
              <p className="text-xs opacity-75 mt-1">Available doctors</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalAppointments}</div>
              <p className="text-xs opacity-75 mt-1">All appointments</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.todayAppointments}</div>
              <p className="text-xs opacity-75 mt-1">Scheduled today</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Appointment Status Pie Chart */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">Appointment Status</CardTitle>
              <CardDescription>Distribution of appointment statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64">
                <div className="relative w-48 h-48">
                  {/* Pie Chart using CSS */}
                  <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                  <div 
                    className="absolute inset-0 rounded-full border-8 border-blue-500"
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + (stats.pendingAppointments / stats.totalAppointments) * 50}% 0%, 50% 50%)`
                    }}
                  ></div>
                  <div 
                    className="absolute inset-0 rounded-full border-8 border-green-500"
                    style={{
                      clipPath: `polygon(50% 50%, ${50 + (stats.pendingAppointments / stats.totalAppointments) * 50}% 0%, 100% 0%, 100% 50%, 50% 50%)`
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-700">{stats.totalAppointments}</div>
                      <div className="text-sm text-gray-500">Total</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Pending ({stats.pendingAppointments})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Completed ({stats.completedAppointments})</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">Recent Activity</CardTitle>
              <CardDescription>Latest system activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">New patient registered</p>
                    <p className="text-xs text-gray-500">Just now</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Appointment completed</p>
                    <p className="text-xs text-gray-500">5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Doctor schedule updated</p>
                    <p className="text-xs text-gray-500">10 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">New appointment scheduled</p>
                    <p className="text-xs text-gray-500">15 minutes ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a 
                href="/patients" 
                className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-center"
              >
                <div className="text-2xl mb-2">👥</div>
                <div className="font-medium">Manage Patients</div>
              </a>
              <a 
                href="/doctors" 
                className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 text-center"
              >
                <div className="text-2xl mb-2">👨‍⚕️</div>
                <div className="font-medium">Manage Doctors</div>
              </a>
              <a 
                href="/appointments" 
                className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 text-center"
              >
                <div className="text-2xl mb-2">📅</div>
                <div className="font-medium">Manage Appointments</div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
