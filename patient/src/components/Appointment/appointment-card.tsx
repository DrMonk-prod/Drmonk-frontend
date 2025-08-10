"use client"

import { Calendar, Clock, MapPin, MessageSquare, Mail, IndianRupee } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import StarRating from "./star-rating"
import type { Appointment } from "@/types/appointment-type"
import Image from "next/image"
import { convertTo12Hour } from "@/lib/utils"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { toast } from "sonner"
import { cancelAppointment } from "@/lib/appointmentApi"

interface AppointmentCardProps {
  appointment: Appointment
  onReview?: (appointment: Appointment) => void
}

const statusColors = {
  SCHEDULED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
}
export default function AppointmentCard({ appointment, onReview }: AppointmentCardProps) {

  const [open, setOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const handleCancelAppointment = async () => {
    if (cancelReason.trim() === "") {
      toast.error("Please provide a reason for cancellation.");
      return;
    }
    if (cancelReason.length < 10) {
      toast.error("Cancellation reason must be at least 10 characters long.");
      return;
    }

    await cancelAppointment(appointment.id, cancelReason);
    setOpen(false);
    setCancelReason("");
    toast.success("Appointment cancelled successfully!");
  }

  return (
    <Card className="hover:shadow-md transition-shadow font-poppins">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden">
              <Image
                width={48}
                height={48}
                src={appointment.doctor.profileImage || "/placeholder.png"}
                alt={appointment.doctor.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{appointment.doctor.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {appointment.doctor.email} • {appointment.doctor.speciality}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge className={statusColors[appointment.status]}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Badge>
          </div>
        </div>

        <hr className="border-gray-600" />
        <div className="flex flex-col gap-2 mt-2 mb-2">
          <span className="text-lime-500">Reason for your visit</span>
          <p className="text-muted-foreground mb-4">{appointment.reasonForVisit}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{new Date(appointment.appointmentTime).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>
              {convertTo12Hour(appointment.appointmentTime)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{appointment.clinic.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <IndianRupee className="w-4 h-4 text-muted-foreground" />
            <span>{appointment.doctor.fees}</span>
          </div>
        </div>

        {appointment.status === "COMPLETED" && (
          <div className="border-t pt-4">
            {appointment.review ? (
              <div className="my-2">
                <div className="flex items-center justify-between my-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Your Review:</span>
                    <StarRating rating={appointment.review.rating} readonly size="sm" />
                  </div>
                  {/* <Button variant="ghost" size="sm" onClick={() => onReview?.(appointment)}>
                    Edit
                  </Button> */}
                </div>
                {appointment.review.comment && (
                  <p className="text-sm text-muted-foreground bg-zinc-800/60 p-3 rounded-md">
                    &ldquo;{appointment.review.comment}&ldquo;
                  </p>
                )}
                <p className="text-xs text-muted-foreground my-2">
                  Reviewed on {new Date(appointment.review.updatedAt as string).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => onReview?.(appointment)} className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Leave a Review
              </Button>
            )}
          </div>
        )}

        {appointment.status === "SCHEDULED" && (
          <>
            <div className="border-t pt-4 flex gap-2 justify-end">
              {/* <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              Reschedule
            </Button> */}
              <Button onClick={() => setOpen(true)} variant="destructive" size="sm" className="w-44 ">
                Cancel
              </Button>
            </div>

            <Dialog open={open} onOpenChange={() => setOpen(false)}>
              <form className="w-full">
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Reason for cancellation</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Textarea onChange={(e) => setCancelReason(e.target.value)} id="cancel" maxLength={200} name="cancel-reason" className="ring-accent-blue dark:ring-accent-blue outline-none border-none" placeholder="Your reason for cancellation" />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleCancelAppointment} type="submit" className="bg-blue-600 dark:bg-blue-600 font-medium font-poppins">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>

          </>


        )}
      </CardContent>
    </Card>
  )
}
