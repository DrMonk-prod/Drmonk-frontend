"use client";

import { use, useEffect, useState } from "react";
import {
  MapPin,
  Star,
  Clock,
  Phone,
  Award,
  Search,
  Filter,
  ChevronDown,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useParams, useRouter } from "next/navigation";
import { getDoctorBySpecialityAndCity } from "@/lib/appointmentApi";
import { DoctorDistance } from "@/types/doctor-types";
import FullScreenLoader from "@/components/FullScreenLoader";
import { formatDistance } from "@/lib/utils";



export default function DoctorListingPage() {
  const { city, speciality } = useParams<{ city: string; speciality: string }>();
  const router = useRouter();

  const [selectedDoctor, setSelectedDoctor] = useState<DoctorDistance | null>(null);
  const [doctors, setDoctors] = useState<DoctorDistance[] | []>([]);
  const { selectedCity } = useSelector((state: RootState) => state.city);

  const [loading, setLoading] = useState(false);


  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.info("Geolocation not supported. Using city coordinates.");
      setLocation({ lat: selectedCity.latitude, lon: selectedCity.longitude });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Unable to retrieve location. Using city coordinates.");
        setLocation({ lat: selectedCity.latitude, lon: selectedCity.longitude });
      }
    );
  }, [selectedCity]);


  useEffect(() => {
    if (!location) return;

    if (speciality.length < 2) {
      router.push("/oops?code=Invalid_speciality");
      return;
    }

    const fetchDoctorBySpecialityAndCity = async () => {
      setLoading(true);
      try {
        const fetchedDoctors: DoctorDistance[] = await getDoctorBySpecialityAndCity(
          speciality,
          selectedCity.label,
          location.lat,
          location.lon
        );
        setDoctors(fetchedDoctors);
        setSelectedDoctor(fetchedDoctors[0] || null);
      } catch (error) {
        console.error("Failed to fetch doctor details", error);
        router.push("/oops?code=Fetch_error");
      }
      finally {
        setLoading(false);
      }
    };

    fetchDoctorBySpecialityAndCity();
  }, [location, speciality, city, router]);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <div className="flex h-20 items-center justify-between my-5">
            <div className="flex items-center gap-x-8">
              <div>
                <h1 className="text-2xl my-5 font-semibold tracking-tight">
                  Found doctors with this Speciality
                </h1>
                <div className="flex items-center space-x-2 text-base text-muted-foreground mt-1 gap-x-4">
                  <MapPin className="h-6 w-6" />
                  <span>{selectedCity.label}</span>
                  <span className="text-muted-foreground/60">•</span>
                  <span>{doctors.length} doctors available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Modern Search and Filter */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-x-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, specialty..."
                className="w-80 pl-11 h-12 bg-background border-border/60 focus:border-border"
              />
            </div>
            <Button variant="outline" className="h-12 px-6 bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {doctors.length} results
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Doctor Cards - Modern Layout */}
          <div className="col-span-12 lg:col-span-7">
            {doctors.map((doctor) => (
              <Card
                key={doctor.doctorName}
                className={`my-3 group cursor-pointer transition-all duration-200 hover:shadow-lg border-border/60 ${selectedDoctor?.doctorId === doctor.doctorId
                  ? "ring-2 ring-primary/20 shadow-lg bg-accent/30"
                  : "hover:border-border"
                  }`}
                onClick={() => setSelectedDoctor(doctor)}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-x-6">
                    {/* Doctor Avatar */}
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-20 w-20 ring-1 ring-border/20">
                        <AvatarImage
                          src={doctor.doctorProfileImg || "/placeholder.png"}
                          alt={doctor.doctorName}
                        />
                        <AvatarFallback className="text-lg font-medium bg-muted">
                          {doctor.doctorName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {doctor.prime && (
                        <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5">
                          <Award className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Doctor Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                            {doctor.doctorName}
                          </h3>
                          <p className="text-muted-foreground font-medium">
                            {doctor.specialityName}
                          </p>
                        </div>
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center gap-x-6 mb-4">
                        <div className="flex items-center gap-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(doctor.rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground/30"
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="font-semibold text-foreground">
                            {doctor.rating}
                          </span>
                          {/* <span className="text-muted-foreground">
                            ({doctor.reviews.toLocaleString()})
                          </span> */}
                        </div>

                        <div className="flex items-center gap-x-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{doctor.experience}+ years exp</span>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-x-2 text-muted-foreground mb-6">
                        <MapPin className="h-4 w-4" />
                        <span>{doctor.address}</span>
                        <span className="text-muted-foreground/60">•</span>
                        <span className="text-sm">
                          {doctor.cityName || ""} • {doctor.pincode || ""}
                        </span>
                      </div>

                      {/* Fee and Availability */}
                      <div className="flex flex-col items-baseline md:flex-row p-4 bg-muted/30 rounded-xl mb-6 gap-2">
                        <span className="text-gray-500/80">
                          Consultation fee
                        </span>
                        <span className="text-2xl font-bold text-foreground">
                          ₹{doctor.fees}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-x-3">
                        <Button onClick={() => router.push(`doctor/${doctor.doctorName + "_" + doctor.doctorId}`)} className="flex-1 h-12 font-medium">
                          Book Appointment
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-11 w-11 bg-transparent"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Modern Map Section */}
          {selectedDoctor && (
            <div className="col-span-12 lg:col-span-5">
              <div className="sticky top-28">
                <Card className="border-border/60">
                  <div className="p-6 border-b border-border/60">
                    <h2 className="text-lg font-semibold mb-2">
                      Doctor Location
                    </h2>
                    <p className="text-muted-foreground">
                      {selectedDoctor.address} • {selectedDoctor.cityName || ""} •  {selectedDoctor.pincode || ""}
                    </p>
                  </div>

                  <div className="relative h-96 bg-muted/20">
                    {/* Map Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                          <MapPin className="h-8 w-8 text-primary" />
                        </div>
                        <div className="my-2">
                          <h4 className="font-semibold">{selectedDoctor.doctorName}</h4>
                          <p className="text-sm text-muted-foreground max-w-xs">
                            {selectedDoctor.address}
                          </p>
                          <span className="animate-pulse text-base mt-4 text-lime-300">{formatDistance(selectedDoctor.distanceKm)} away from you</span>
                        </div>
                      </div>
                    </div>

                    {/* Subtle grid overlay */}
                    <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
                      <div className="grid grid-cols-8 grid-rows-8 h-full">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <div key={i} className="border border-foreground"></div>
                        ))}
                      </div>
                    </div>
                  </div>



                  <div className="p-6 my-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-x-2">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span>{selectedDoctor.rating} rating</span>
                      </div>
                      <div className="flex items-center gap-x-2">
                        <span className="font-semibold">
                          ₹{selectedDoctor.fees}
                        </span>
                      </div>
                    </div>

                    <Button className="w-full h-12 mt-3 font-medium">
                      Get Directions
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
