export type Song = {
  title: string;
  artist: string;
  album: string;
  coverImage: string;
  spotifyUrl: string;
  isrc: string;
  spotifyUri: string;
};

export type SupabaseSong = {
  id: number;
  created_at: string;
  title: string;
  artist: string;
  album: string;
  cover_image: string;
  spotify_url: string;
  isrc: string;
  spotify_uri: string;
  playlist_id: number;
  user_id: string; // tbd if this is needed
};

export type SupabaseSongCreate = Omit<SupabaseSong, "id" | "created_at">;

// tbd on this definition
export interface Playlist {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  userId: string;
  isCollaborative: boolean;
  isPublic: boolean;
  songs?: Song[];
}

export type PlaylistCreate = Omit<Playlist, "id" | "createdAt" | "userId">;

export type SupabasePlaylist = {
  id: number;
  created_at: string;
  title: string;
  description: string;
  user_id: string;
  is_public: boolean;
  is_collaborative: boolean;
};

export type SupabasePlaylistWithSongs = SupabasePlaylist & {
  songs: SupabaseSong[];
};

export type SupabasePlaylistCreate = Omit<
  SupabasePlaylist,
  "id" | "created_at"
>;

export interface ExportPlaylistBody {
  title: string;
  description: string;
  collaborative: boolean;
  isPublic: boolean;
  songUris: string[];
}
