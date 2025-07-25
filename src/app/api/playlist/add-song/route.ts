import { NextRequest, NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/supabase/authHelpers";
import { AddSongToPlaylistRequestBody } from "@/types/request";
import { addSong } from "@/lib/playlist/songHelpers";

export async function POST(req: NextRequest) {
  await requireAuthenticatedUser(); // TODO: check they can edit

  const updateData: AddSongToPlaylistRequestBody = await req.json();
  try {
    const newSongId = await addSong(updateData.song, updateData.playlistId);
    return NextResponse.json({ success: true, id: newSongId }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error adding song:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        error:
          message ||
          "An unexpected error occurred while adding the song. Please try again later.",
      },
      { status: 500 }
    );
  }
}
