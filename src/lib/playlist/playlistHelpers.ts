import { createClient } from "@/lib/supabase/server";
import type { PlaylistCreate, SupabasePlaylistCreate } from "@/types/playlist";
import type { UpdatePlaylistData } from "@/types/playlist";
import type { Song } from "@/types/song";
import { addSong, deleteSong } from "@/lib/playlist/songHelpers";
import { UpdatePlaylistDetailsRequestBody } from "@/types/request";
import { requireAuthenticatedUser } from "../supabase/authHelpers";
import { NextResponse } from "next/server";

export async function createPlaylist(playlistData: PlaylistCreate) {
  const supabase = await createClient();

  // check user authentication
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    throw new Error("Not authenticated");
  }

  const userId = userData.user.id;

  const newPlaylist: SupabasePlaylistCreate = {
    title: playlistData.title || "New Playlist",
    description:
      playlistData.description ||
      `A playlist created with ${process.env.PROJECT_NAME}`,
    user_id: userId,
    is_public:
      typeof playlistData.isPublic === "boolean"
        ? playlistData.isPublic
        : false,
    is_collaborative:
      typeof playlistData.isCollaborative === "boolean"
        ? playlistData.isCollaborative
        : false,
  };

  const { error, data } = await supabase
    .from("playlists")
    .insert(newPlaylist)
    .select();

  if (error || !data || !data[0]?.id) {
    throw new Error(
      `Error creating playlist: ${error?.message || "Failed to save playlist"}`
    );
  }

  const playlistId: number = data[0].id;
  const songs = playlistData.songs || [];

  for (const song of songs) {
    await addSong(supabase, song, playlistId);
  }

  return { success: true, playlistId: playlistId };
}

export async function updatePlaylist(updateData: UpdatePlaylistData) {
  const supabase = await createClient();

  const authResult = await requireAuthenticatedUser(); // TODO: check they can edit; add a param to indicate permission scope
  if ("error" in authResult) {
    return NextResponse.json(authResult.error, { status: authResult.status });
  }

  const userData = authResult.user;

  // TODO: handle collab playlists
  const { data: playlistData, error: playlistError } = await supabase
    .from("playlists")
    .select("user_id")
    .eq("id", updateData.playlistId)
    .single();

  if (playlistError || !playlistData) {
    throw new Error("Failed to fetch playlist");
  }

  if (playlistData.user_id !== userData.id) {
    throw new Error("You are not the owner of this playlist");
  }

  const {
    playlistId,
    title,
    description,
    isCollaborative,
    isPublic,
    addedSongs,
    deletedSongs,
  } = updateData;

  const { error: updateError } = await supabase
    .from("playlists")
    .update({
      title,
      description,
      is_collaborative: isCollaborative,
      is_public: isPublic,
    })
    .eq("id", playlistId);

  if (updateError) {
    throw new Error(`Error updating playlist: ${updateError.message}`);
  }

  // Add new songs
  for (const song of addedSongs as Song[]) {
    await addSong(supabase, song, playlistId);
  }

  // Remove deleted songs
  for (const song of deletedSongs as Song[]) {
    await deleteSong(supabase, song, playlistId);
  }

  return { success: true };
}

export async function updatePlaylistDetails(
  updateData: UpdatePlaylistDetailsRequestBody
) {
  const supabase = await createClient();

  const authResult = await requireAuthenticatedUser(); // TODO: check they can edit; add a param to indicate permission scope
  if ("error" in authResult) {
    return NextResponse.json(authResult.error, { status: authResult.status });
  }

  const { playlistId, title, description, isCollaborative, isPublic } =
    updateData;

  const { error: updateError } = await supabase
    .from("playlists")
    .update({
      title,
      description,
      is_collaborative: isCollaborative,
      is_public: isPublic,
    })
    .eq("id", playlistId);

  if (updateError) {
    throw new Error(`Error updating playlist: ${updateError.message}`);
  }

  return { success: true };
}

// TODO: implement add/remove collaborators
