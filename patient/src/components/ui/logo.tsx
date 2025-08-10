import Link from "next/link";
import React from "react";

function Logo() {
  return (
    <div className="logo flex items-center shrink-0 space-x-2 py-2 cursor-pointer">
      <div className="flex relative">
        <div className="delay-5000 absolute -top-4 left-20 h-8 w-8 animate-blob rounded-full bg-teal-600 opacity-90 blur-xl"></div>
        <div className="delay-2000 absolute left-5 top-4 h-8 w-8 animate-blob rounded-full bg-rose-500 opacity-90 blur-xl"></div>

        <Link href="/" className="flex items-center font-chillax">
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 z-20">
            Find <span className="text-indigo-500 dark:text-lime-500">Dr+</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Logo;
