"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ProfileImageUpload from "@/components/Profile/profile-image-upload";
import GenderSelect from "@/components/Profile/gender-select";
import { Sparkles } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useAuth } from "@/hooks/useAuth";
import FullScreenLoader from "@/components/FullScreenLoader";
import { updateProfile } from "@/lib/profileApi";
import { AuthUser } from "@/types/auth";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import { toast } from "sonner";



export default function Page() {
  const { pending } = useFormStatus();
  const { user, loading } = useAuth("/auth");

  const dispatch = useDispatch();

  if (loading) return <FullScreenLoader />;
  if (!user) return null;

  async function saveProfile(formData: FormData) {
    const data = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      gender: formData.get("gender") as "MEN" | "FEMALE" | "OTHER",
      phoneNumber: formData.get("phoneNumber") as string,
    };

    const updatedProfile = await updateProfile(data as AuthUser)
    dispatch(setUser(updatedProfile.data));
    toast.success("Profile updated successfully!");
  }

  return (
    <div>
      {/* Background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-clip font-poppins"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/70 via-white to-white dark:from-cyan-950/40 dark:via-background dark:to-background" />
        <div className="absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl dark:bg-cyan-900/30" />
        <div className="absolute bottom-[-10%] left-[-10%] h-72 w-72 rounded-full bg-neutral-200/50 blur-3xl dark:bg-neutral-800/30" />
      </div>

      <main className="relative mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 md:px-10">
        {/* Hero */}
        <header className="mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/60 px-3 py-1 text-xs font-medium text-cyan-800 shadow-sm backdrop-blur dark:border-cyan-800 dark:bg-card/60 dark:text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Patient Account
          </div>

          <h1 className="mt-5 text-pretty text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-b from-neutral-900 to-neutral-700 bg-clip-text text-transparent dark:from-neutral-100 dark:to-neutral-300">
              Craft your care profile
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Your details, beautifully organized. For worry free appointments
            booking
          </p>
        </header>

        {/* Profile Card */}
        <Card className="rounded-2xl border-border bg-white/80 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-card dark:supports-[backdrop-filter]:bg-card/60">
          <form action={saveProfile}>
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-xl">Profile</CardTitle>
              <CardDescription>
                Keep your information up to date.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-10 sm:space-y-12">
              {/* Profile Image */}
              <section>
                <ProfileImageUpload name="image" />
              </section>

              {/* Fields */}
              <section aria-labelledby="basic-info-title" className="my-8">
                <div
                  id="basic-info-title"
                  className="text-sm font-medium text-foreground"
                >
                  Basic information
                </div>

                <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
                  <div className="my-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="e.g., Alex Johnson"
                      required
                      defaultValue={user.fullName}
                      autoComplete="name"
                      className="h-11 rounded-lg"
                    />
                  </div>

                  <div className="my-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="alex@example.com"
                      defaultValue={user.email}
                      required
                      autoComplete="email"
                      className="h-11 rounded-lg"
                    />
                  </div>

                  <div className="my-2">
                    <Label>Gender</Label>
                    <GenderSelect
                      name="gender"
                      defaultValue={user.gender || ""}
                    />
                  </div>

                  <div className="my-2">
                    <Label htmlFor="phoneNumber">Phone number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      inputMode="tel"
                      defaultValue={user.phoneNumber || ""}
                      placeholder="+91 832914578"
                      autoComplete="tel"
                      className="h-11 rounded-lg"
                    />
                  </div>
                </div>
              </section>
            </CardContent>

            <CardFooter className="flex items-center justify-end gap-3 pt-6">
              <Button
                type="reset"
                variant="outline"
                className="rounded-lg bg-transparent"
              >
                Cancel
              </Button>

              <Button>
                <span className="rounded-sm px-4 py-2 text-white shadow-sm cursor-pointer">
                  {pending ? "Saving..." : "Save changes"}
                </span>
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Trust bar */}
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <span>Private and secure</span>
          <span className="hidden h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-600 sm:inline-block" />
          <span>Designed for seamless appointments</span>
          <span className="hidden h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-600 sm:inline-block" />
          <span>Update anytime</span>
        </div>
      </main>
    </div>
  );
}
