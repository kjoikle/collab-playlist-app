import { Song } from "./song";

export interface UpdatePlaylistDetailsRequestBody {
  title: string;
  description: string;
  playlistId: string;
  isPublic: boolean;
  isCollaborative: boolean;
}

export interface AddSongToPlaylistRequestBody {
  playlistId: number;
  song: Song;
}

export interface DeleteSongFromPlaylistRequestBody {
  playlistId: number;
  song: Song;
}
