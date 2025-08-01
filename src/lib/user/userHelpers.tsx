import { createClient } from "@/lib/supabase/server";
import { Playlist } from "@/types/playlist";
import { User } from "@/types/user";
import { supabaseUserToUser } from "../types/casts";

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

  return supabaseUserToUser(data);
}

/**
 * Returns the user id for a given email, or null if not found
 */
export async function getUserIdByEmail(email: string): Promise<string | null> {
  const supabase = await createClient();

  const { data: collaboratorUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (!collaboratorUser || !collaboratorUser.id) {
    return null;
  }

  return collaboratorUser.id;
}

/**
 * Returns the user for a given email, or throws an error
 */
export async function getUserByEmail(email: string): Promise<User> {
  const supabase = await createClient();

  const { data: collaboratorUser } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!collaboratorUser) {
    throw new Error("User not found");
  }

  return supabaseUserToUser(collaboratorUser);
}

export function isPlaylistOwner(playlist: Playlist, user: User | null) {
  if (!user) return false;
  return playlist.owner.id === user.id;
}

export function userCanEditPlaylist(
  playlist: Playlist,
  user: User | null
): boolean {
  if (!user) return false;
  if (isPlaylistOwner(playlist, user)) return true;
  return playlist.collaborators.some((collab) => collab.id === user.id);
}

export function getUserNameToDisplay(user: User | null): string {
  return user?.displayName || user?.email || "Anonymous";
}
