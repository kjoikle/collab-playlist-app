import { createClient } from "@/lib/supabase/server";
import PlaylistsDisplay from "@/components/Dashboard/PlaylistsDisplay";

const Dashboard = async () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center mt-10">
        Welcome to Project Meow
      </h1>
      <p className="text-center mt-4">Collaborative Playlist Maker</p>

      <PlaylistsDisplay />
    </div>
  );
};

export default Dashboard;
