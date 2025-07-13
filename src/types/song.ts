export type Song = {
  id: number;
  addedByUser: string; // TODO implement as a user type
  title: string;
  artist: string;
  album: string;
  coverImage: string;
  spotifyUrl: string;
  isrc: string;
  spotifyUri: string;
  duration?: string; // TODO: make not optional
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
  user_id: string;
};

export type SupabaseSongCreate = Omit<SupabaseSong, "id" | "created_at">;
