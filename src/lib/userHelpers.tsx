import { createClient } from "@/lib/supabase/server";
import { Playlist } from "@/types/playlist";
import { User } from "@/types/user";

/**
 * Fetches a user from the public.users table by id.
 * Throws an error if not found or on error.
 */
export async function getUserById(id: string): Promise<User> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    throw new Error(error?.message || "User not found");
  }

  return {
    id: data.id,
    email: data.email,
    displayName: data.display_name,
    createdAt: data.created_at,
    profilePicture: data.profile_picture,
    loginMethod: data.login_method,
  };
}

export function isPlaylistOwner(playlist: Playlist, user: User | null) {
  if (!user) return false;
  return playlist.owner.id === user.id;
}

export function getUserNameToDisplay(user: User | null): string {
  return user?.displayName || user?.email || "Anonymous";
}
