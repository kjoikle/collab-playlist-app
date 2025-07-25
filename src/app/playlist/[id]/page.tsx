import { PlaylistView } from "@/components/Playlist/PlaylistView";
import { notFound } from "next/navigation";
import { getPlaylist } from "@/lib/playlist/playlistHelpers";
import { Playlist } from "@/types/playlist";

interface PlaylistPageProps {
  params: {
    id: string;
  };
}

const PlaylistPage = async ({ params }: PlaylistPageProps) => {
  const resolvedParams = await params;
  const { id: playlistId } = resolvedParams;

  if (!playlistId) {
    notFound();
  }

  const playlist: Playlist | undefined = await getPlaylist(playlistId);

  if (!playlist) {
    notFound();
  }

  return <PlaylistView playlist={playlist} />;
};

export default PlaylistPage;
