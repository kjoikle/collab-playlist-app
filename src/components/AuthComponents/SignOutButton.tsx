"use client";

import React from "react";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

const SignOutButton = () => {
  const supabase = createClient();

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error);
    } else {
      redirect("/login");
    }
  }

  return (
    <button
      onClick={signOut}
      className="border border-red-500 text-red-500 px-4 py-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
    >
      Logout
    </button>
  );
};

export default SignOutButton;
