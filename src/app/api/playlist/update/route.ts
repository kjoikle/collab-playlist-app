import { NextRequest, NextResponse } from "next/server";
import { updatePlaylist } from "@/lib/playlist/playlistHelpers";

export async function POST(req: NextRequest) {
  const updateData = await req.json();
  try {
    await updatePlaylist(updateData);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating playlist:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error) || "Failed to update playlist",
      },
      { status: 500 }
    );
  }
}
