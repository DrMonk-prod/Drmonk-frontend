"use client";

import { Button } from '@/components/ui/button';
import React, { ChangeEvent, useEffect, useState } from 'react'

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { cn, convertTo24Hour } from "@/lib/utils";

import { getTimeSlotByDoctorIdAndDate, initiateAppointment } from "@/lib/appointmentApi";
import { CalendarOff } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { displayRazorpay } from '@/lib/razorpay';
import { useRouter } from 'next/navigation';

interface TimeSlot {
  time: string;
  available: boolean;
}

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDateLabel(date: Date, index: number): string {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";

  const dayName = WEEK_DAYS[date.getDay()];
  const dayNumber = date.getDate();
  const monthName = MONTHS[date.getMonth()];

  return `${dayName}, ${dayNumber} ${monthName}`;
}

export function formatDateValue(date: Date) {
  return date.toISOString().split("T")[0]; // yyyy-mm-dd
}

interface SlotPickerProps {
  doctorId: number;
}
function SlotPicker({ doctorId }: SlotPickerProps) {
  const { user } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [timeSlots, setTimeSlots] = useState<TimeSlot[] | []>([]);

  const today = new Date();
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });

  const [api, setApi] = React.useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const index = api.selectedScrollSnap();
      const newDate = dates[index];

      setCurrent(index + 1); // Update current slide position
      setSelectedDate(newDate); // Update date
      handleDateChange(index);  // Fetch new time slots
    };

    // Initial trigger
    onSelect();

    // Subscribe to changes
    api.on("select", onSelect);

    // Cleanup
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 200) {
      e.preventDefault();
      toast.info("Reason cannot exceed 200 characters.");
      return;
    }
    setReason(e.target.value.trim().slice(0, 200));
  }

  const handleDateChange = async (index: number) => {
    setSelectedTime(null);

    try {
      const slots = await getTimeSlotByDoctorIdAndDate(doctorId.toString(), formatDateValue(dates[index]));
      setTimeSlots(slots);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setTimeSlots([]);
    }
  };

  const handleBooking = async () => {
    if (!selectedTime) {
      toast.error("Please select a time slot.");
      return;
    }
    if (!reason || reason.trim() === "") {
      toast.error("Please provide a reason for the visit.");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to book an appointment.");
      return;
    }
    setLoading(true);

    try {
      const appointment = await initiateAppointment({
        doctorId: doctorId.toString(),
        date: formatDateValue(selectedDate),
        time: convertTo24Hour(selectedTime),
        reason: reason,
      });

      if (appointment) {
        await displayRazorpay(appointment.doctor.fees, appointment.id, appointment.doctor.name);
        setSelectedTime(null);
        setReason("");
        setTimeSlots([]);
        api?.scrollTo(0);
      }
      toast.success("Appointment booked successfully!");
      router.push("/appointment");
    } catch (error) {
      console.log("Error initiating appointment:", error);
      toast.error("Failed to book appointment. Please try again.");
    }
    finally {
      setLoading(false);
    }


  }

  return (
    <div className='w-full mx-auto'>

      <div className="mx-auto my-3 w-full px-10">
        <Carousel
          setApi={setApi}
          className="w-full max-w-xs mx-auto"
          opts={{ loop: false, align: "center" }}
        >
          <CarouselContent className='h-20'>
            {dates.map((date, index) => (
              <CarouselItem key={index} className="h-full basis-3/7 bg-transparent">
                <Card
                  className={cn(
                    "text-primary-foreground border-none transition-all duration-500 h-full bg-transparent",
                    {
                      "opacity-30": index !== current - 1,
                    }
                  )}
                >
                  <CardContent className="flex items-center justify-center p-2 h-full bg-transparent">
                    <Button
                      key={index}
                      variant={
                        selectedDate === date ? "default" : "outline"
                      }
                      size="lg"
                      className={clsx(
                        current === index + 1 && " text-white font-semibold bg-primary dark:bg-primary hover:bg-primary/90",
                      )}
                      onClick={() => setSelectedDate(date)}
                    >
                      {formatDateLabel(dates[index], index)}
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious size={"lg"} />
          <CarouselNext size={"lg"} />
        </Carousel>
      </div>

      <div className="my-3">
        <h4 className="font-medium my-3">Available Slots</h4>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto min-h-54 transistion-all duration-500 px-2">
          {timeSlots.length === 0 && (
            <div className="flex col-span-2 justify-center items-center w-full h-full text-center text-gray-500">
              <div className='flex flex-col items-center justify-center'>
                <CalendarOff size={60} />
                No slots available for this date.
              </div>
            </div>
          )}
          {timeSlots.map((slot) => (
            <Button
              key={slot.time}
              variant={
                selectedTime === slot.time ? "default" : "outline"
              }
              size="sm"
              disabled={!slot.available}
              onClick={() => setSelectedTime(slot.time)}
              className="text-sm h-10 mt-2 ring-[1px] ring-gray-600 text-white-50 font-semibold hover:bg-primary hover:text-amber-500 cursor-pointer disabled:ring-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {slot.time}
            </Button>
          ))}
        </div>
      </div>

      {selectedTime && (
        <div className="grid w-full gap-3">
          <Label htmlFor="message-2">Reason for visit</Label>
          <Textarea onChange={(e) => handleTextChange(e)} maxLength={200} placeholder="Type your message here." id="message-2" />
        </div>
      )}

      <Button
        className="w-full my-5"
        size="lg"
        disabled={!selectedTime}
        onClick={handleBooking}
      >
        {selectedTime
          ? `Book for ${selectedTime}`
          : "Select Time Slot"}
      </Button>
    </div>
  )
}

export default SlotPicker