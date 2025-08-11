"use client"

import { useCallback, useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AppointmentCard from "@/components/Appointment/appointment-card"
import ReviewModal from "@/components/Appointment/review-modal"
import type { Appointment, ReviewData } from "@/types/appointment-type"
import { getMyAppointments, submitReview } from "@/lib/appointmentApi"
import { useAuth } from "@/hooks/useAuth"
import FullScreenLoader from "@/components/FullScreenLoader"
import { toast } from "sonner"


export default function AppointmentsPage() {
  const { loading, user } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  const scheduledAppointments = appointments.filter((apt) => apt.status === "SCHEDULED")
  const completedAppointments = appointments.filter((apt) => apt.status === "COMPLETED")
  const cancelledAppointments = appointments.filter((apt) => apt.status === "CANCELLED")


  const fetchMyAppointments = useCallback(async () => {
    if (!loading && !user) {
      toast.error("You must be logged in to view appointments.")
      return;
    }

    try {
      const data = await getMyAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      toast.error("Failed to load appointments. Please try again later.");
    }
  }, [user, loading]);

  useEffect(() => {
    fetchMyAppointments();
  }, [fetchMyAppointments]);

  const handleReview = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsReviewModalOpen(true)
  }

  const handleSubmitReview = async (doctorId: number, appointmentId: number, reviewData: ReviewData) => {

    await submitReview(doctorId, appointmentId, reviewData);
    toast.success("Review submitted successfully!");

    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId
          ? {
            ...apt,
            review: {
              ...reviewData,
              date: new Date().toISOString(),
            },
          }
          : apt,
      ),
    );

  }

  const getTabCount = (status: string) => {
    return appointments.filter((apt) => apt.status === status).length
  }

  if (loading) return <FullScreenLoader />;
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Appointments</h1>
        <p className="text-muted-foreground">Manage and track all your appointments in one place</p>
      </div>

      <Tabs defaultValue="scheduled" className="gap-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            Scheduled
            <Badge variant="secondary" className="ml-1">
              {getTabCount("SCHEDULED")}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            Completed
            <Badge variant="secondary" className="ml-1">
              {getTabCount("COMPLETED")}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex items-center gap-2">
            Cancelled
            <Badge variant="secondary" className="ml-1">
              {getTabCount("CANCELLED")}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="gap-y-4">
          {scheduledAppointments.length > 0 ? (
            <div className="grid gap-4">
              {scheduledAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">No Scheduled Appointments</h3>
                  <p className="text-muted-foreground">You don &apos; t have any upcoming appointments scheduled.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="gap-y-4">
          {completedAppointments.length > 0 ? (
            <div className="grid gap-4">
              {completedAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} onReview={handleReview} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">No Completed Appointments</h3>
                  <p className="text-muted-foreground">Your completed appointments will appear here.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="gap-y-4">
          {cancelledAppointments.length > 0 ? (
            <div className="grid gap-4">
              {cancelledAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">No Cancelled Appointments</h3>
                  <p className="text-muted-foreground">Your cancelled appointments will appear here.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {selectedAppointment && (
        <ReviewModal
          appointment={selectedAppointment}
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false)
            setSelectedAppointment(null)
          }}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  )
}
