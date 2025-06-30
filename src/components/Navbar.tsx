import React from "react";
import { createClient } from "@/lib/supabase/client";
import SignOutButton from "./AuthComponents/SignOutButton";
import { usePathname } from "next/navigation";

const Navbar = () => {
  return (
    <>
      <nav className="p-3 pb-4 items-center w-full fixed top-0 z-50 transition-colors duration-300 pr-5">
        <div className="flex items-center justify-between">
          <a href="/dashboard">
            <div className="text-2xl font-bold text-gray-800">Project Meow</div>
          </a>
          <SignOutButton />
        </div>
      </nav>
      <div className="pt-10" />
    </>
  );
};

export default Navbar;
