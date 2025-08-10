"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Star,
  Clock,
  Phone,
  GraduationCap,
  Building2,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { getDoctorDetailsById } from "@/lib/appointmentApi";
import { Doctor } from "@/types/doctor-types";
import FullScreenLoader from "@/components/FullScreenLoader";
import SlotPicker from "@/components/Booking/SlotPicker";


interface Review {
  id: number;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}


const reviews: Review[] = [
  {
    id: 1,
    patientName: "Rajesh S.",
    rating: 5,
    comment:
      "Excellent doctor! Dr. Kamat performed my knee replacement surgery and the results are amazing. Very professional and caring.",
    date: "2 days ago",
    verified: true,
  },
  {
    id: 2,
    patientName: "Priya M.",
    rating: 5,
    comment:
      "Best orthopedic doctor in Pune. Explained everything clearly and the treatment was very effective. Highly recommended!",
    date: "1 week ago",
    verified: true,
  },
  {
    id: 3,
    patientName: "Amit K.",
    rating: 4,
    comment:
      "Good experience overall. Dr. Kamat is very knowledgeable and the clinic staff is helpful. Wait time was a bit long.",
    date: "2 weeks ago",
    verified: true,
  },
];

interface DoctorPageProps {
  params: {
    city: string;
    doctorSlug: string;
  };
}

export default function DoctorDetailPage({ params }: DoctorPageProps) {

  const router = useRouter();

  const [doctor, setDoctor] = useState<Doctor | null>();

  useEffect(() => {
    const fetchDoctor = async () => {
      const { doctorSlug } = params;
      const parts = doctorSlug.split('_');

      if (parts.length < 2) {
        router.push("/oops?code=Invalid_doctor_slug");
        return;
      }

      const doctorId = parts.pop();
      if (!doctorId || isNaN(Number(doctorId))) {
        router.push("/oops?code=Invalid_doctor_id");
        return;
      }

      try {
        const fetchedDoctor: Doctor = await getDoctorDetailsById(doctorId);
        setDoctor(fetchedDoctor);
      } catch (error) {
        console.error("Failed to fetch doctor details", error);
        router.push("/oops?code=Fetch_error");
      }
    };

    fetchDoctor();
  }, [params, router]);


  if (!doctor) {
    return <FullScreenLoader />
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-background max-w-7xl mx-auto">
      {/* Header */}
      <header className="z-50 mt-5 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
          {/* Main Content */}
          <div className="lg:col-span-2 gap-y-8 w-full">
            {/* Doctor Profile Card */}
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start gap-y-6 md:gap-y-0 md:gap-x-8">
                  <div className="relative">
                    <Avatar className="h-32 w-32">
                      <AvatarImage
                        src={doctor.user.profileImg || "/placeholder.png"}
                        alt={doctor.user.fullName}
                      />
                      <AvatarFallback className="text-2xl font-semibold">
                        {doctor.user.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {doctor.prime && (
                      <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                        <CheckCircle className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 gap-y-4">
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight">
                        {doctor.user.fullName}
                      </h1>
                      <p className="text-xl text-muted-foreground">
                        {doctor.speciality.name}
                      </p>
                      <p>
                        {doctor.speciality.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < Math.floor(doctor.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground/30"
                                }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold">{doctor.rating}</span>
                        <span className="text-sm text-muted-foreground">
                        </span>
                      </div>

                      <div className="flex items-center gap-x-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                          {doctor.experience} years experience
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-x-2 mt-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{doctor.clinic.cityName}</span>
                    </div>

                    {/* <div className="flex flex-wrap gap-2">
                      {doctor.map((qual, index) => (
                        <Badge key={index} variant="secondary">
                          {qual}
                        </Badge>
                      ))}
                    </div> */}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Section */}
            <Tabs defaultValue="about" className="w-full mt-5">
              <TabsList className="grid h-12 grid-cols-3 w-full">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="clinic">Clinic</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <GraduationCap className="h-5 w-5 mr-2" />
                      <span>About Dr. {doctor.user.fullName.split(" ")[1]}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {doctor.description}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Reviews</span>
                      <Badge variant="secondary">
                        {doctor.rating}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="gap-y-6">
                    {reviews.map((review, index) => (
                      <div key={review.id}>
                        <div className="flex items-start gap-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="text-sm">
                              {review.patientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 gap-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-x-2">
                                <span className="font-medium text-sm">
                                  {review.patientName}
                                </span>
                                {review.verified && (
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {review.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-x-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted-foreground/30"
                                      }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                        {index < reviews.length - 1 && (
                          <hr className="my-3 border-[1] border-gray-500" />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="clinic" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-x-2">
                      <Building2 className="h-5 w-5" />
                      <span>Clinic Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="gap-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">
                        {doctor.clinic.name}
                      </h4>
                      <div className="gap-y-3 text-sm text-muted-foreground">
                        <div className="flex items-start gap-x-3">
                          <MapPin className="h-4 w-4 mt-0.5" />
                          <span>{doctor.clinic.address}</span>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <Phone className="h-4 w-4" />
                          <span>{doctor.user.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <Clock className="h-4 w-4" />
                          <span>{doctor.clinic.pincode}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Appointment Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    Book Appointment
                  </CardTitle>
                </CardHeader>
                <CardContent className="gap-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      ₹{doctor.fees}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Consultation Fee
                    </div>
                  </div>

                  <hr className="my-2 border-[1] border-gray-300" />

                  <SlotPicker doctorId={doctor.id} />

                  <div className="text-center">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Clinic
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
