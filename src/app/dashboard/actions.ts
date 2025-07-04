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

  // TODO: update to just get from a specific user
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching playlists:", error);
    return;
  }

  // can create a DTO to return only necessary fields; may need to to recast to Playlist type
  return data;
}
