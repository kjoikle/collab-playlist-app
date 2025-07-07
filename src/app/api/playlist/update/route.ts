import { NextRequest, NextResponse } from "next/server";
import { updatePlaylist } from "@/lib/playlist/playlistHelpers";

export async function POST(req: NextRequest) {
  const updateData = await req.json();
  try {
    await updatePlaylist(updateData);
    return NextResponse.json({ success: true }, { status: 200 });
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
