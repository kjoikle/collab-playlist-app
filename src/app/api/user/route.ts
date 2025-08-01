import { NextRequest, NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/supabase/authHelpers";
import { getUserById, getUserByEmail } from "@/lib/user/userHelpers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const email = searchParams.get("email");

  try {
    if (id) {
      const user = await getUserById(id);
      return NextResponse.json({ user }, { status: 200 });
    }
    if (email) {
      const user = await getUserByEmail(email);
      return NextResponse.json({ user }, { status: 200 });
    }
    // Default: return authenticated user
    const { user } = await requireAuthenticatedUser();
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        user: null,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 404 }
    );
  }
}
