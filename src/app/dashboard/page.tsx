import PlaylistsDisplay from "@/components/Dashboard/PlaylistsDisplay";
import { getUserPlaylists } from "@/actions/dashboardActions";
import { Playlist } from "@/types/types";

const Dashboard = async () => {
  const playlists: Playlist[] = (await getUserPlaylists()) ?? [];

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mt-10">
        Welcome to Project Meow
      </h1>
      <p className="text-center mt-4">Collaborative Playlist Maker</p>

      <PlaylistsDisplay playlists={playlists} />
    </div>
  );
};

export default Dashboard;
