import apiClient from "@/lib/axios";
import { toast } from "sonner";

export const getDoctorDetailsById = async (doctorId: string) => {
  const response = await apiClient.get(`/doctors/${doctorId}`);
  return response.data;
};

export const getTimeSlotByDoctorIdAndDate = async (doctorId: string, date: string) => {
  const response = await apiClient.get(
    `/doctors/${doctorId}/slots?date=${date}`
  );
  return response.data;
};


export const initiateAppointment = async (data: {
  doctorId: string;
  date: string;
  time: string;
  reason: string;
}) => {
  const response = await apiClient.post(`/appointments/book`, data);
  return response.data.data;
}


export const getMyAppointments = async () => {
  const response = await apiClient.get(`patients/appointments`);
  return response.data;
}


export const submitReview = async (doctorId: number, appointmentId: number, reviewData: {
  rating: number;
  comment: string;
}) => {
  const reviewRequestData = {
    doctorId,
    appointmentId,
    ...reviewData,
  };

  const response = await apiClient.post(`/reviews`, reviewRequestData);
  return response.data;
}

export const cancelAppointment = async (appointmentId: number, reason: string) => {
  const body = {
    appointmentId,
    cancelledBy: "PATIENT",
    reason
  }
  const response = await apiClient.put(`/appointments/cancel/${appointmentId}`, body);
  return response.data;
}


export const getDoctorBySpecialityAndCity = async (speciality: string, city: string, latitude: number, longitude: number) => {
  if (!speciality || !city) {
    toast.warning("Speciality and city are required to fetch doctors.");
  }
  if (!latitude || !longitude) {
    toast.warning("Latitude and longitude are required to fetch doctors.");
  }

  if (!speciality || !city || !latitude || !longitude) {
    return [];
  }

  const response = await apiClient.get(`/doctors/speciality`, {
    params: {
      speciality,
      city,
      latitude,
      longitude
    }
  });
  return response.data;
}