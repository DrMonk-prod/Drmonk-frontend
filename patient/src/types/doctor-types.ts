import { AuthUser } from "@/types/auth";

export type Doctor = {
  id: number;
  experience: number;
  fees: number;
  rating: number;
  description: string;
  user: AuthUser;
  speciality: Speciality;
  clinic: Clinic;
  prime: boolean;
};

type Speciality = {
  id: number;
  name: string;
  description: string;
};

type Clinic = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  pincode: string | null;
  cityName: string;
};


export interface DoctorDistance {
  doctorId: number;
  doctorName: string;           // NEW
  doctorProfileImg: string;     // NEW
  experience: number;
  fees: number;
  rating: number;
  description: string;
  prime: boolean;

  specialityId: number;
  specialityName: string;
  specialityDesc: string;

  clinicId: number;
  clinicName: string;
  address: string;
  latitude: number;
  longitude: number;
  pincode: string;
  cityName: string;

  distanceKm: number;
}
