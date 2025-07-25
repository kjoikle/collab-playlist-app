import type { Song, SupabaseSongCreate } from "@/types/song";
import { createClient } from "../supabase/server";
import { requireAuthenticatedUser } from "../supabase/authHelpers";

export async function addSong(song: Song, playlistId: number) {
  const supabase = await createClient();

  const authResult = await requireAuthenticatedUser(); // TODO: check they can edit; add a param to indicate permission scope
  if ("error" in authResult || !authResult.user) {
    throw new Error("Not authenticated");
  }

  const userData = authResult.user;

  const userId = userData?.id || null;

  const newSong: SupabaseSongCreate = {
    title: song.title,
    artist: song.artist,
    album: song.album,
    cover_image: song.coverImage,
    spotify_url: song.spotifyUrl,
    isrc: song.isrc,
    spotify_uri: song.spotifyUri,
    playlist_id: playlistId,
    user_id: userId || "",
  };
  const { data, error } = await supabase
    .from("songs")
    .insert(newSong)
    .select("id")
    .single();
  if (error) {
    throw new Error(
      `Error adding song to playlist: ${error.message || "Failed to save song"}`
    );
  }
  return data?.id;
}

export async function deleteSong(song: Song, playlistId: number) {
  const supabase = await createClient();

  const authResult = await requireAuthenticatedUser(); // TODO: check they can edit; add a param to indicate permission scope
  if ("error" in authResult || !authResult.user) {
    throw new Error("Not authenticated");
  }

  let deleteField: string;
  let deleteValue: string | number;

  if (song.id) {
    deleteField = "id";
    deleteValue = song.id;
  } else {
    deleteField = "isrc";
    deleteValue = song.isrc;
  }

  const { error } = await supabase
    .from("songs")
    .delete()
    .eq("playlist_id", playlistId)
    .eq(deleteField, deleteValue);
  if (error) {
    throw new Error(
      `Error removing song from playlist: ${
        error.message || "Failed to delete song"
      }`
    );
  }
}
