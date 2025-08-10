export interface ReviewData {
  rating: number
  comment: string
  createdAt?: string
  updatedAt?: string
}


export interface Appointment {
  id: number
  createdAt: string
  updatedAt: string
  appointmentTime: string
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED"
  reasonForVisit: string
  cancelledBy: "PATIENT" | "DOCTOR" | null
  cancellationReason: string | null
  doctor: {
    id: number
    fees: number
    rating: number
    name: string
    profileImage: string | null
    email: string
    speciality: string
  }
  clinic: {
    id: number
    name: string
    address: string
    latitude: number
    longitude: number
    pincode: string
    cityName: string
  },
  review: ReviewData | null
}
