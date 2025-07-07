import React from "react";
import PlaylistViewPage from "@/components/Playlist/PlaylistView";

interface PlaylistPageProps {
  params: { id: string };
}

const PlaylistPage = async ({ params }: PlaylistPageProps) => {
  const resolvedParams = await params;
  const { id: playlistId } = resolvedParams;
  return <PlaylistViewPage playlistId={playlistId} />;
};

export default PlaylistPage;
