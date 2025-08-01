import { NextRequest, NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/supabase/authHelpers";
import { DeleteSongFromPlaylistRequestBody } from "@/types/request";
import { deleteSong } from "@/lib/playlist/songHelpers";

export async function POST(req: NextRequest) {
  await requireAuthenticatedUser();

  const updateData: DeleteSongFromPlaylistRequestBody = await req.json();
  try {
    await deleteSong(updateData.song, updateData.playlistId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error deleting song:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        error:
          message ||
          "An unexpected error occurred while deleting the song. Please try again later.",
      },
      { status: 500 }
    );
  }
}
