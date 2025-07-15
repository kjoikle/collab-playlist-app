import { getUserById } from "@/lib/userHelpers";
import { Playlist, SupabasePlaylistWithSongs } from "@/types/playlist";
import { Song, SupabaseSong } from "@/types/song";
import { User } from "@/types/user";

export async function supabasePlaylistWithSongsToPlaylist(
  supabasePlaylist: SupabasePlaylistWithSongs
): Promise<Playlist> {
  const owner: User = await getUserById(supabasePlaylist.user_id);
  return {
    id: supabasePlaylist.id.toString(),
    title: supabasePlaylist.title,
    description: supabasePlaylist.description,
    createdAt: supabasePlaylist.created_at,
    owner: owner,
    isCollaborative: supabasePlaylist.is_collaborative,
    isPublic: supabasePlaylist.is_public,
    songs: await Promise.all(
      supabasePlaylist.songs.map((song) => supabaseSongToSong(song))
    ),
  };
}

export async function supabasePlaylistToPlaylistWithoutSongs(
  supabasePlaylist: SupabasePlaylistWithSongs
): Promise<Playlist> {
  const owner: User = await getUserById(supabasePlaylist.user_id);
  return {
    id: supabasePlaylist.id.toString(),
    title: supabasePlaylist.title,
    description: supabasePlaylist.description,
    createdAt: supabasePlaylist.created_at,
    owner: owner,
    isCollaborative: supabasePlaylist.is_collaborative,
    isPublic: supabasePlaylist.is_public,
    songs: [],
  };
}

export async function supabaseSongToSong(
  supabaseSong: SupabaseSong
): Promise<Song> {
  const addedByUser: User = await getUserById(supabaseSong.user_id);
  return {
    id: supabaseSong.id.toString(),
    addedByUser: addedByUser,
    title: supabaseSong.title,
    artist: supabaseSong.artist,
    album: supabaseSong.album,
    coverImage: supabaseSong.cover_image,
    spotifyUrl: supabaseSong.spotify_url,
    isrc: supabaseSong.isrc,
    spotifyUri: supabaseSong.spotify_uri,
  };
}
