import { NextRequest, NextResponse } from "next/server";
import { updatePlaylist } from "@/lib/playlist/playlistHelpers";
import { requireAuthenticatedUser } from "@/lib/supabase/authHelpers";

export async function POST(req: NextRequest) {
  const authResult = await requireAuthenticatedUser();
  if ("error" in authResult) {
    return NextResponse.json(authResult.error, { status: authResult.status });
  }

  const updateData = await req.json();
  try {
    await updatePlaylist(updateData);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error updating playlist:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        error:
          message ||
          "An unexpected error occurred while updating the playlist. Please try again later.",
      },
      { status: 500 }
    );
  }
}
