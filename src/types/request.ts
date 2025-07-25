import { Song } from "./song";

export interface UpdatePlaylistDetailsRequestBody {
  title: string;
  description: string;
  playlistId: string;
  isPublic: boolean;
  isCollaborative: boolean;
}

export interface AddSongToPlaylistRequestBody {
  playlistId: string;
  song: Song;
}

export interface DeleteSongFromPlaylistRequestBody {
  playlistId: string;
  song: Song;
}
