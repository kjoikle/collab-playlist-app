import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Song } from "@/types/types";
import { addSong, deleteSong } from "../utils";

interface UpdatePlaylistData {
  playlistId: number;
  title: string;
  description?: string;
  isCollaborative?: boolean;
  isPublic?: boolean;
  addedSongs?: Song[];
  deletedSongs?: Song[];
}

export async function POST(req: NextRequest) {
  const updateData = await req.json();
  try {
    await updatePlaylist(updateData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating playlist:", error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Failed to update playlist",
      },
      { status: 500 }
    );
  }
}

async function updatePlaylist(updateData: UpdatePlaylistData) {
  const supabase = await createClient();
  const {
    playlistId,
    title,
    description,
    isCollaborative,
    isPublic,
    addedSongs = [],
    deletedSongs = [],
  } = updateData;

  const { error: updateError } = await supabase
    .from("playlists")
    .update({
      title,
      description,
      is_collaborative: isCollaborative,
      is_public: isPublic,
    })
    .eq("id", playlistId);

  if (updateError) {
    throw new Error(`Error updating playlist: ${updateError.message}`);
  }

  // Add new songs
  for (const song of addedSongs as Song[]) {
    await addSong(supabase, song, playlistId);
  }

  // Remove deleted songs
  for (const song of deletedSongs as Song[]) {
    await deleteSong(supabase, song, playlistId);
  }

  console.log("Playlist updated successfully!");
}
