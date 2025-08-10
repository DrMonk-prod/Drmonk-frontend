"use client";
import React, { useEffect } from "react";
import Logo from "@/components/ui/logo";
import { ChevronDown, ClipboardPen, LogOut, MapPin, User, User2Icon, UserCircleIcon, UserRoundPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/theme-toggle";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/lib/authActions";
import { setUser } from "@/store/slices/authSlice";
import { getProfile } from "@/lib/profileApi";
import Image from "next/image";

function NavBar() {
  const { selectedCity } = useSelector((state: RootState) => state.city);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    getProfile()
      .then((res) => {
        dispatch(setUser(res.data));
      })
      .catch(() => {
        localStorage.removeItem("authToken");
      });
  }, [dispatch]);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo />

          {/* Location, Theme Toggle and Login */}
          <div className="flex items-center gap-x-2">
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{selectedCity.label}</span>
            </div>
            <ThemeToggle />
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none">
                    {
                      user.profileImg ? (
                        <div className="rounded-lg flex items-center font-poppins shrink-0 bg-gray-200 dark:bg-gray-800 py-1 px-2">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden mr-1">
                            <Image
                              src={user.profileImg}
                              alt={user.fullName}
                              fill
                              style={{ objectFit: "cover" }}
                              sizes="32px"
                              priority
                            />
                          </div>
                          <span className="w-20 truncate">{user.fullName}</span>
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      ) : <UserCircleIcon size={30} className="text-gray-300" />
                    }
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="font-medium mt-4 p-2">
                    {/* <DropdownMenuLabel>User</DropdownMenuLabel> */}
                    {/* <DropdownMenuSeparator /> */}


                    <DropdownMenuItem onClick={() => router.push("/profile")} className="px-4 py-2">
                      <User2Icon size={24} /> Profile
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => router.push("/appointment")} className="px-4 py-2">
                      <ClipboardPen size={24} /> My appointments
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => {
                        logout(dispatch);
                        router.push("/");
                      }}
                      className="px-4 py-2 hover:bg-rose-500 hover:dark:bg-rose-500 text-gray-100 dark:text-gray-100"
                    >
                      <LogOut size={24} /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href={"/auth"}>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Login / Signup
                  </Button>
                </Link>
              )}
            </>
          </div>
        </div>
      </div>
    </header>
  );
}

export default NavBar;
