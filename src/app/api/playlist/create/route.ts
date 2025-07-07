import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type {
  PlaylistCreate,
  SupabasePlaylistCreate,
  Song,
} from "@/types/types";
import { addSong } from "../utils";

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

async function createPlaylist(playlistData: PlaylistCreate) {
  const supabase = await createClient();

  // check user authentication
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    throw new Error("Not authenticated");
  }

  const userId = userData.user.id;

  const newPlaylist: SupabasePlaylistCreate = {
    title: playlistData.title || "New Playlist",
    description:
      playlistData.description ||
      `A playlist created with ${process.env.PROJECT_NAME}`,
    user_id: userId,
    is_public:
      typeof playlistData.isPublic === "boolean"
        ? playlistData.isPublic
        : false,
    is_collaborative:
      typeof playlistData.isCollaborative === "boolean"
        ? playlistData.isCollaborative
        : false,
  };

  const { error, data } = await supabase
    .from("playlists")
    .insert(newPlaylist)
    .select();

  if (error || !data || !data[0]?.id) {
    throw new Error(
      `Error creating playlist: ${error?.message || "Failed to save playlist"}`
    );
  }

  const playlistId = data[0].id;
  const songs = playlistData.songs || [];

  for (const song of songs as Song[]) {
    await addSong(supabase, song, playlistId);
  }

  return { success: true, playlistId: playlistId };
}
