import type { Song, SupabaseSong } from "./song";

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

export interface UpdatePlaylistData {
  playlistId: number;
  title: string;
  description?: string;
  isCollaborative: boolean;
  isPublic: boolean;
  addedSongs: Song[];
  deletedSongs: Song[];
}
