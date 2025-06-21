"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(email: String, password: String) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: email as string,
    password: password as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error("Login error:", error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(email: String, password: String) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: email as string,
    password: password as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error("Sign Up error:", error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
