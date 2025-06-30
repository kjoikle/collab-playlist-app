import { createClient } from "@/lib/supabase/client";
import { Song } from "@/types/types";

export const handleSaveNewPlaylist = async (
  title: string,
  description: string,
  songs: Song[]
) => {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("playlists")
    .insert({
      title: title || "New Playlist",
      description: description || "A playlist created with Project Meow",
      user_id: 1, // replace with actual user ID
    })
    .select();

  if (error) {
    console.error("Error saving playlist:", error);
    return;
  }

  const playlistId = data[0].id;
  songs.forEach(async (song) => {
    const { error } = await supabase.from("songs").insert({
      title: song.title,
      artist: song.artist,
      album: song.album,
      cover_image: song.coverImage,
      spotify_url: song.spotifyUrl,
      isrc: song.isrc,
      spotify_uri: song.spotifyUri,
      playlist_id: playlistId,
    });

    if (error) {
      console.error("Error saving song:", error);
    } else {
      console.log(`Song ${song.title} saved to playlist ${playlistId}`);
    }
  });

  console.log("Playlist saved successfully!");
};
