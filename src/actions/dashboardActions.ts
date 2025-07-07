"server-only";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getUserPlaylists() {
  const supabase = await createClient();

  // check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // TODO: figure out collaborative playlists fetching?
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching playlists:", error);
    return;
  }

  // can create a DTO to return only necessary fields; may need to to recast to Playlist type
  return data;
}
