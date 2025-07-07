import { NextRequest, NextResponse } from "next/server";
import type { PlaylistCreate } from "@/types/playlist";
import { createPlaylist } from "@/lib/playlist/playlistHelpers";

export async function POST(req: NextRequest) {
  const playlistData: PlaylistCreate = await req.json();
  try {
    const result = await createPlaylist(playlistData);
    return NextResponse.json(
      { success: true, playlistId: result.playlistId },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating playlist:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        error: message || "Failed to create playlist",
      },
      { status: 500 }
    );
  }
}
