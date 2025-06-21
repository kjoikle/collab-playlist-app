import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PlaylistCreate from "@/components/Playlist/PlaylistCreate";

const Dashboard = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mt-10">
        Welcome to Project Meow
      </h1>
      <p className="text-center mt-4">Collaborative Playlist Maker</p>
      <PlaylistCreate />
    </div>
  );
};

export default Dashboard;
