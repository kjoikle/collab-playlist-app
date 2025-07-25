import { NextRequest, NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/supabase/authHelpers";
import { createClient } from "@/lib/supabase/server";
import { User } from "@/types/user";

export async function GET(req: NextRequest) {
  // Authenticate user
  const authResult = await requireAuthenticatedUser();
  if ("error" in authResult || !authResult.user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const userId = authResult.user.id;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return NextResponse.json({ user: null }, { status: 404 });
  }

  const user: User = {
    id: data.id,
    email: data.email,
    displayName: data.display_name,
    createdAt: data.created_at,
    profilePicture: data.profile_picture,
    loginMethod: data.login_method,
  };

  return NextResponse.json({ user }, { status: 200 });
}
