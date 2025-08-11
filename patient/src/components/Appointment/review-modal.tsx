"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import StarRating from "./star-rating"
import type { ReviewData, Appointment } from "@/types/appointment-type"
import Image from "next/image"

interface ReviewModalProps {
  appointment: Appointment
  isOpen: boolean
  onClose: () => void
  onSubmit: (doctorId: number, appointmentId: number, review: ReviewData) => void
}

export default function ReviewModal({ appointment, isOpen, onClose, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState(appointment.review?.rating || 0)
  const [comment, setComment] = useState(appointment.review?.comment || "")

  const handleSubmit = () => {
    if (rating === 0) return

    onSubmit(appointment.doctor.id, appointment.id, { rating, comment })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md font-semibold font-poppins">
        <DialogHeader>
          <DialogTitle>{appointment.review ? "Edit Review" : "Leave a Review"}</DialogTitle>
        </DialogHeader>

        <div className="my-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-2 overflow-hidden">
              <Image
                width={64}
                height={64}
                src={appointment.doctor.profileImage || "/placeholder.png"}
                alt={appointment.doctor.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-semibold">{appointment.doctor.name}</h3>
            <p className="text-sm text-muted-foreground">{appointment.doctor.rating}</p>
          </div>

          <div className="my-2">
            <Label className="my-2">Rating</Label>
            <div className="flex justify-center">
              <StarRating rating={rating} onRatingChange={setRating} size="lg" />
            </div>
          </div>

          <div className="my-2">
            <Label htmlFor="comment" className="my-3">Comment (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={rating === 0} className="flex-1">
              {appointment.review ? "Update Review" : "Submit Review"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
