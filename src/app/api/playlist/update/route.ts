import { NextRequest, NextResponse } from "next/server";
import { updatePlaylist } from "@/lib/playlist/playlistHelpers";
import { requireAuthenticatedUser } from "@/lib/supabase/authHelpers";

export async function POST(req: NextRequest) {
  await requireAuthenticatedUser();

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
