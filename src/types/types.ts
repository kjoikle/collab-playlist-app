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
};

export type SupabasePlaylist = {
  id: number;
  created_at: string;
  title: string;
  description: string;
  user_id: number;
};
