import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignUpForm from "@/components/AuthComponents/SignUpForm";

const SignUpPage = async () => {
  // check that user is not already logged in; redirect to dashboard if they are
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen items-center justify-center w-full">
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
