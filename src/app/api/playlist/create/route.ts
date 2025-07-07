import { NextRequest, NextResponse } from "next/server";
import type { PlaylistCreate } from "@/types/types";
import { createPlaylist } from "@/lib/playlist/playlistHelpers";

export async function POST(req: NextRequest) {
  const playlistData: PlaylistCreate = await req.json();
  try {
    const result = await createPlaylist(playlistData);
    return NextResponse.json(
      { success: true, playlistId: result.playlistId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating playlist:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error) || "Failed to create playlist",
      },
      { status: 500 }
    );
  }
}
