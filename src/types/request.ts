export interface UpdatePlaylistDetailsRequestBody {
  title: string;
  description: string;
  playlistId: string;
  isPublic: boolean;
  isCollaborative: boolean;
}
