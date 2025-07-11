import type { Song, SupabaseSongCreate } from "@/types/song";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function addSong(
  supabase: SupabaseClient,
  song: Song,
  playlistId: number
) {
  const { data: user } = await supabase.auth.getUser();
  const userId = user?.user?.id;

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
  const { error } = await supabase.from("songs").insert(newSong);
  if (error) {
    throw new Error(
      `Error adding song to playlist: ${error.message || "Failed to save song"}`
    );
  }
}

export async function deleteSong(
  supabase: SupabaseClient,
  song: Song,
  playlistId: number
) {
  const { error } = await supabase
    .from("songs")
    .delete()
    .eq("playlist_id", playlistId)
    .eq("isrc", song.isrc);
  if (error) {
    throw new Error(
      `Error removing song from playlist: ${
        error.message || "Failed to delete song"
      }`
    );
  }
}
