import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PlaylistEdit from "@/components/Playlist/PlaylistEdit";

const EditPlaylistPage = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div>
      <PlaylistEdit />
    </div>
  );
};

export default EditPlaylistPage;
