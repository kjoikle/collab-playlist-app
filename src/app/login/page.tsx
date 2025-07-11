import React from "react";
import LoginForm from "@/components/AuthComponents/LoginForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const LoginPage = async () => {
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
      <LoginForm />
    </div>
  );
};

export default LoginPage;
