"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Star,
  Clock,
  Phone,
  Award,
  Users,
  Moon,
  Sun,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { getDoctorBySpecialityAndCity } from "@/lib/appointmentApi";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  reviews: number;
  location: string;
  address: string;
  consultationFee: number;
  availableToday: boolean;
  nextAvailable: string;
  image: string;
  coordinates: { lat: number; lng: number };
  verified: boolean;
}

const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    specialization: "Dermatologist & Cosmetologist",
    experience: 15,
    rating: 4.8,
    reviews: 1250,
    location: "Koramangala",
    address: "123 Main Street, Koramangala, Bangalore",
    consultationFee: 800,
    availableToday: true,
    nextAvailable: "Today, 2:00 PM",
    image: "/placeholder.svg?height=80&width=80",
    coordinates: { lat: 12.9352, lng: 77.6245 },
    verified: true,
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    specialization: "Dermatologist & Hair Transplant Surgeon",
    experience: 12,
    rating: 4.6,
    reviews: 890,
    location: "Indiranagar",
    address: "456 Park Avenue, Indiranagar, Bangalore",
    consultationFee: 1000,
    availableToday: false,
    nextAvailable: "Tomorrow, 10:00 AM",
    image: "/placeholder.svg?height=80&width=80",
    coordinates: { lat: 12.9716, lng: 77.6412 },
    verified: true,
  },
  {
    id: 3,
    name: "Dr. Anita Reddy",
    specialization: "Pediatric Dermatologist",
    experience: 8,
    rating: 4.7,
    reviews: 650,
    location: "Whitefield",
    address: "789 Tech Park Road, Whitefield, Bangalore",
    consultationFee: 600,
    availableToday: true,
    nextAvailable: "Today, 4:30 PM",
    image: "/placeholder.svg?height=80&width=80",
    coordinates: { lat: 12.9698, lng: 77.75 },
    verified: true,
  },
  {
    id: 4,
    name: "Dr. Suresh Patel",
    specialization: "Dermatologist & Venereologist",
    experience: 20,
    rating: 4.9,
    reviews: 1800,
    location: "Jayanagar",
    address: "321 South End Circle, Jayanagar, Bangalore",
    consultationFee: 1200,
    availableToday: true,
    nextAvailable: "Today, 6:00 PM",
    image: "/placeholder.svg?height=80&width=80",
    coordinates: { lat: 12.9279, lng: 77.5937 },
    verified: true,
  },
  {
    id: 5,
    name: "Dr. Meera Singh",
    specialization: "Cosmetic Dermatologist",
    experience: 10,
    rating: 4.5,
    reviews: 720,
    location: "HSR Layout",
    address: "654 Sector 1, HSR Layout, Bangalore",
    consultationFee: 900,
    availableToday: false,
    nextAvailable: "Tomorrow, 11:30 AM",
    image: "/placeholder.svg?height=80&width=80",
    coordinates: { lat: 12.9082, lng: 77.6476 },
    verified: false,
  },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

type DoctorListingPageProps = {
  params: {
    city: string,
    speciality: string,
  }
}

export default function DoctorListingPage({ params }: DoctorListingPageProps) {

  const router = useRouter();
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctors, setDoctors] = useState<Doctor[] | []>([]);
  const { selectedCity } = useSelector((state: RootState) => state.city);

  console.log("Selected of City:", selectedCity);

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.info("Geolocation is not supported by your browser.");
      setLocation({ lat: selectedCity.latitude, lon: selectedCity.longitude });
    }

    const fetchDoctorBySpecialityAndCity = async () => {
      const { speciality } = params;

      if (speciality.length < 2) {
        router.push("/oops?code=Invalid_doctor_slug");
        return;
      }

      try {
        const fetchedDoctors: Doctor[] = await getDoctorBySpecialityAndCity(speciality, selectedCity.label, selectedCity.latitude, selectedCity.longitude);
        setDoctors(fetchedDoctors);
      } catch (error) {
        console.error("Failed to fetch doctor details", error);
        router.push("/oops?code=Fetch_error");
      }
    };

    fetchDoctorBySpecialityAndCity();
  }, [params, router]);

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center space-x-8">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Find Specialists
                </h1>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>Bangalore</span>
                  <span className="text-muted-foreground/60">•</span>
                  <span>{doctors.length} doctors available</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Modern Search and Filter */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
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
                key={doctor.id}
                className={`my-3 group cursor-pointer transition-all duration-200 hover:shadow-lg border-border/60 ${selectedDoctor.id === doctor.id
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
                          src={doctor.image || "/placeholder.svg"}
                          alt={doctor.name}
                        />
                        <AvatarFallback className="text-lg font-medium bg-muted">
                          {doctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {doctor.verified && (
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
                            {doctor.name}
                          </h3>
                          <p className="text-muted-foreground font-medium">
                            {doctor.specialization}
                          </p>
                        </div>
                        {doctor.availableToday && (
                          <Badge className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
                            Available Today
                          </Badge>
                        )}
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
                          <span className="text-muted-foreground">
                            ({doctor.reviews.toLocaleString()})
                          </span>
                        </div>

                        <div className="flex items-center gap-x-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{doctor.experience}+ years exp</span>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-x-2 text-muted-foreground mb-6">
                        <MapPin className="h-4 w-4" />
                        <span>{doctor.location}</span>
                        <span className="text-muted-foreground/60">•</span>
                        <span className="text-sm">
                          {doctor.address.split(",")[0]}
                        </span>
                      </div>

                      {/* Fee and Availability */}
                      <div className="flex flex-col items-baseline md:flex-row p-4 bg-muted/30 rounded-xl mb-6 gap-2">
                        <span className="text-gray-500/80">
                          Consultation fee
                        </span>
                        <span className="text-2xl font-bold text-foreground">
                          ₹{doctor.consultationFee}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-x-3">
                        <Button className="flex-1 h-12 font-medium">
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
          <div className="col-span-12 lg:col-span-5">
            <div className="sticky top-28">
              <Card className="border-border/60">
                <div className="p-6 border-b border-border/60">
                  <h2 className="text-lg font-semibold mb-2">
                    Doctor Location
                  </h2>
                  <p className="text-muted-foreground">
                    {/* {selectedDoctor.name} • {selectedDoctor.location} */}
                  </p>
                </div>

                <div className="relative h-96 bg-muted/20">
                  {/* Map Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <MapPin className="h-8 w-8 text-primary" />
                      </div>
                      {/* <div className="space-y-2">
                        <h4 className="font-semibold">{selectedDoctor.name}</h4>
                        <p className="text-sm text-muted-foreground max-w-xs">
                          {selectedDoctor.address}
                        </p>
                      </div> */}
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

                {/* <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-x-2">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{selectedDoctor.rating} rating</span>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedDoctor.reviews} reviews</span>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedDoctor.nextAvailable}</span>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <span className="font-semibold">
                        ₹{selectedDoctor.consultationFee}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full h-12 mt-3 font-medium">
                    Get Directions
                  </Button>
                </div> */}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
