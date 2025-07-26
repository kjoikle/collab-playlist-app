import { createClient } from "@/lib/supabase/server";
import { requireAuthenticatedUser } from "../supabase/authHelpers";
import { getUserById, getUserIdByEmail } from "@/lib/user/userHelpers";
import type { User } from "@/types/user";

export async function getPlaylistCollaborators(
  playlistId: string
): Promise<User[]> {
  await requireAuthenticatedUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("playlist_collaborators")
    .select("user_id")
    .eq("playlist_id", playlistId);

  if (error) {
    console.error("Error fetching collaborators:", error);
    throw new Error("Failed to fetch collaborators");
  }

  // Fetch full user objects for each collaborator
  const users: User[] = await Promise.all(
    (data || []).map(async (collab) => await getUserById(collab.user_id))
  );
  return users.filter(Boolean) as User[];
}

export async function addPlaylistCollaboratorByEmail(
  playlistId: string,
  userEmail: string
): Promise<boolean> {
  const { user: currentUser } = await requireAuthenticatedUser();
  const supabase = await createClient();

  // TODO validation:
  // - Check if user already a collaborator ?

  const collaboratorId = await getUserIdByEmail(userEmail);

  if (!collaboratorId) {
    throw new Error("User not found");
  }

  if (collaboratorId === currentUser.id) {
    throw new Error("Cannot add yourself as a collaborator");
  }

  const { error } = await supabase
    .from("playlist_collaborators")
    .insert([{ playlist_id: playlistId, user_id: collaboratorId }]);

  if (error) {
    console.error("Error adding collaborator:", error);
    throw new Error("Failed to add collaborator");
  }

  return true;
}

export async function removePlaylistCollaborator(
  playlistId: string,
  userId: string
): Promise<boolean> {
  await requireAuthenticatedUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from("playlist_collaborators")
    .delete()
    .eq("playlist_id", playlistId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error removing collaborator:", error);
    throw new Error("Failed to remove collaborator");
  }

  return true;
}
