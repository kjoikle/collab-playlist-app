import { User } from "./user";
import type { Song, SupabaseSong } from "./song";

// Add owner property to Playlist interface
export interface Playlist {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  owner: User;
  isCollaborative: boolean;
  isPublic: boolean;
  songs: Song[];
  coverImage?: string;
  collaborators: User[]; // Optional, for collaborative playlists
}

export type PlaylistCreate = Omit<Playlist, "id" | "createdAt" | "owner">;

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
  playlistId: string;
  title: string;
  description?: string;
  isCollaborative: boolean;
  isPublic: boolean;
  addedSongs: Song[];
  deletedSongs: Song[];
}
