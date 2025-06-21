"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import SignOutButton from "./AuthComponents/SignOutButton";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      console.log(data.user);
      setUser(data.user);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  if (!user || pathname === "/login") return null;

  return (
    <>
      <nav className="p-3 pb-4 items-center w-full fixed top-0 z-50 transition-colors duration-300 pr-5">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-800">Project Meow</div>
          <div className="space-x-4">
            {/* <a href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </a>
            <a href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </a> */}
            <span>Logged in as {user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </nav>
      <div className="pt-10" />
    </>
  );
};

export default Navbar;
