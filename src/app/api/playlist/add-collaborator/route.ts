import { NextRequest, NextResponse } from "next/server";
import { addPlaylistCollaboratorByEmail } from "@/lib/user/collaboratorHelpers";

export async function POST(req: NextRequest) {
  const { playlistId, email } = await req.json();
  try {
    await addPlaylistCollaboratorByEmail(playlistId, email);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
