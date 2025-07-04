import React from "react";
import { getPlaylist } from "../actions";

interface PlaylistPageProps {
  params: { id: string };
}

const PlaylistPage = async ({ params }: PlaylistPageProps) => {
  // check that user is allowed to see this playlist

  const { id: playlistId } = await params;

  const playlist = await getPlaylist(playlistId);

  console.log("Playlist:", playlist);

  return <div>PlaylistPage ID: {playlistId}</div>;
};

export default PlaylistPage;
