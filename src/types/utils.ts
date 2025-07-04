import {
  Playlist,
  Song,
  SupabasePlaylistWithSongs,
  SupabaseSong,
} from "./types";

export function supabasePlaylistWithSongsToPlaylist(
  supabasePlaylist: SupabasePlaylistWithSongs
): Playlist {
  return {
    id: supabasePlaylist.id.toString(),
    title: supabasePlaylist.title,
    description: supabasePlaylist.description,
    createdAt: supabasePlaylist.created_at,
    userId: supabasePlaylist.user_id.toString(),
    isCollaborative: supabasePlaylist.is_collaborative,
    isPublic: supabasePlaylist.is_public,
    songs: supabasePlaylist.songs.map((song) => ({
      ...supabaseSongToSong(song),
    })),
  };
}

export function supabaseSongToSong(supabaseSong: SupabaseSong): Song {
  return {
    title: supabaseSong.title,
    artist: supabaseSong.artist,
    album: supabaseSong.album,
    coverImage: supabaseSong.cover_image,
    spotifyUrl: supabaseSong.spotify_url,
    isrc: supabaseSong.isrc,
    spotifyUri: supabaseSong.spotify_uri,
  };
}
