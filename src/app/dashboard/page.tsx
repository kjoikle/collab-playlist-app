import { getUserPlaylists } from "@/actions/dashboardActions";
import { Playlist } from "@/types/playlist";
import { UserDashboard } from "@/components/Dashboard/UserDashboard";

const Dashboard = async () => {
  const playlists: Playlist[] = (await getUserPlaylists()) ?? [];

  return <UserDashboard playlists={playlists} />;
};

export default Dashboard;
