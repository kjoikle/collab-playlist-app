import React from "react";
import { getPlaylist } from "../actions";
import PlaylistViewPage from "@/components/Playlist/PlaylistView";
import { supabasePlaylistWithSongsToPlaylist } from "@/types/utils";

interface PlaylistPageProps {
  params: { id: string };
}

const PlaylistPage = async ({ params }: PlaylistPageProps) => {
  // check that user is allowed to see this playlist

  const { id: playlistId } = await params;

  const supabasePlaylist = await getPlaylist(playlistId);

  if (!supabasePlaylist) {
    // TODO: handle not found
    return <div>Playlist not found</div>;
  }

  const playlist = supabasePlaylistWithSongsToPlaylist(supabasePlaylist);

  return <PlaylistViewPage playlist={playlist} />;
};

export default PlaylistPage;
