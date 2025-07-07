"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// TODO: start FormData as unknown, then validate
export async function login(formData: FormData) {
  const supabase = await createClient();

  const emailRaw = formData.get("email");
  const email = typeof emailRaw === "string" ? emailRaw : "";
  const passwordRaw = formData.get("password");
  const password = typeof passwordRaw === "string" ? passwordRaw : "";

  // TODO: validate input

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("Login error:", error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
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
