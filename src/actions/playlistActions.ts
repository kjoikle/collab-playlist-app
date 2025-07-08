import { createClient } from "@/lib/supabase/server";
import { supabasePlaylistWithSongsToPlaylist } from "@/lib/types/casts";
import { Playlist, SupabasePlaylistWithSongs } from "@/types/playlist";
import { redirect } from "next/navigation";

export async function getPlaylist(playlistId: string) {
  const supabase = await createClient();

  // check authenticated and
  // TODO: can see this playlist
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("id", playlistId)
    .single();

  // TODO: should handle this more gracefully
  if (error) {
    console.error("Error fetching playlist:", error);
    return;
  }

  const { data: songs, error: songsError } = await supabase
    .from("songs")
    .select("*")
    .eq("playlist_id", playlistId);

  if (songsError) {
    console.error("Error fetching songs:", songsError);
    return;
  }

  const playlistWithSongs: SupabasePlaylistWithSongs = {
    ...data,
    songs: songs || [],
  };

  const playlistObject: Playlist =
    supabasePlaylistWithSongsToPlaylist(playlistWithSongs);

  // can create a DTO to return only necessary fields
  return playlistObject;
}
