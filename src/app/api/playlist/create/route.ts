import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type {
  PlaylistCreate,
  SupabasePlaylistCreate,
  SupabaseSongCreate,
} from "@/types/types";

export async function POST(req: NextRequest) {
  const playlistData: PlaylistCreate = await req.json();
  try {
    await createPlaylist(playlistData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating playlist:", error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Failed to create playlist",
      },
      { status: 500 }
    );
  }
}

async function createPlaylist(playlistData: PlaylistCreate) {
  const supabase = await createClient();

  // TODO: auth

  const newPlaylist: SupabasePlaylistCreate = {
    title: playlistData.title || "New Playlist",
    description:
      playlistData.description ||
      `A playlist created with ${process.env.PROJECT_NAME}`,
    user_id: 1, // replace with actual user ID
    is_public: playlistData.isPublic || false,
    is_collaborative: playlistData.isCollaborative || false,
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

  songs.forEach(async (song) => {
    const newSong: SupabaseSongCreate = {
      title: song.title,
      artist: song.artist,
      album: song.album,
      cover_image: song.coverImage,
      spotify_url: song.spotifyUrl,
      isrc: song.isrc,
      spotify_uri: song.spotifyUri,
      playlist_id: playlistId,
    };

    const { error: songError } = await supabase.from("songs").insert(newSong);

    if (songError) {
      throw new Error(
        `Error adding song to playlist: ${
          songError.message || "Failed to save song"
        }`
      );
    }
  });

  console.log("Playlist saved successfully!");
}
