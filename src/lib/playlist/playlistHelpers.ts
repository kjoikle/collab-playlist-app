import { createClient } from "@/lib/supabase/server";
import type {
  PlaylistCreate,
  SupabasePlaylistCreate,
  Playlist,
  SupabasePlaylistWithSongs,
} from "@/types/playlist";
import type { UpdatePlaylistData } from "@/types/playlist";
import type { Song } from "@/types/song";
import { addSong, deleteSong } from "@/lib/playlist/songHelpers";
import { UpdatePlaylistDetailsRequestBody } from "@/types/request";
import { requireAuthenticatedUser } from "../supabase/authHelpers";
import { supabasePlaylistWithSongsToPlaylist } from "@/lib/types/casts";

export async function getPlaylist(playlistId: string) {
  await requireAuthenticatedUser(); // TODO: can see this playlist

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("id", playlistId)
    .single();

  if (error || !data) {
    throw new Error(
      `Error fetching playlist: ${error?.message || "Failed to get playlist"}`
    );
  }

  const { data: songs, error: songsError } = await supabase
    .from("songs")
    .select("*")
    .eq("playlist_id", playlistId);

  if (songsError || !songs) {
    throw new Error(
      `Error fetching songs: ${songsError?.message || "Failed to get songs"}`
    );
  }

  const playlistWithSongs: SupabasePlaylistWithSongs = {
    ...data,
    songs: songs || [],
  };

  const playlistObject: Playlist = await supabasePlaylistWithSongsToPlaylist(
    playlistWithSongs
  );

  return playlistObject;
}

export async function createPlaylist(playlistData: PlaylistCreate) {
  const { user } = await requireAuthenticatedUser();

  const supabase = await createClient();

  const userId = user.id;

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

  const playlistId: string = data[0].id;
  const songs = playlistData.songs || [];

  for (const song of songs) {
    await addSong(song, playlistId);
  }

  return { success: true, playlistId: playlistId };
}

export async function updatePlaylist(updateData: UpdatePlaylistData) {
  const supabase = await createClient();

  const { user: userData } = await requireAuthenticatedUser(); // TODO: check they can edit; add a param to indicate permission scope

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
    await addSong(song, playlistId);
  }

  // Remove deleted songs
  for (const song of deletedSongs as Song[]) {
    await deleteSong(song, playlistId);
  }

  return { success: true };
}

export async function updatePlaylistDetails(
  updateData: UpdatePlaylistDetailsRequestBody
) {
  const supabase = await createClient();

  await requireAuthenticatedUser(); // TODO: check they can edit; add a param to indicate permission scope

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
