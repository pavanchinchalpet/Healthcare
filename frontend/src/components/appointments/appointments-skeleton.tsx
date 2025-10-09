import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AppointmentsSkeleton() {
  return (
    <>
      <section aria-labelledby="appointments-title" className="mb-6 md:mb-8">
        <Skeleton className="h-10 w-48 mb-3" />
        <Skeleton className="h-5 w-64" />
      </section>

      <section aria-label="Appointment management" className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-40" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Appointments</CardTitle>
            <CardDescription>Manage scheduled appointments and bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Patient</th>
                    <th className="text-left p-2 font-medium">Doctor</th>
                    <th className="text-left p-2 font-medium">Date & Time</th>
                    <th className="text-left p-2 font-medium">Status</th>
                    <th className="text-left p-2 font-medium">Reason</th>
                    <th className="text-left p-2 font-medium">Created</th>
                    <th className="text-left p-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="p-2">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="p-2">
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </td>
                      <td className="p-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </td>
                      <td className="p-2">
                        <Skeleton className="h-4 w-28" />
                      </td>
                      <td className="p-2">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-8 w-16" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  )
}
