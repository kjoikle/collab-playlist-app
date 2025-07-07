import type { Song } from "@/types/song";
import type { ExportPlaylistBody } from "@/types/playlist";

export async function exportPlaylist(
  songs: Song[],
  title: string,
  description: string,
  collaborative: boolean,
  isPublic: boolean
) {
  const body: ExportPlaylistBody = {
    title: title || "New Playlist",
    description: description || "A playlist created with Project Meow",
    collaborative: collaborative ?? false,
    isPublic: isPublic ?? true,
    songUris: songs.map((song) => song.spotifyUri),
  };

  try {
    const response = await fetch("/api/export-playlist-to-spotify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.error || "Failed to export playlist");
    }

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: message || "An error occurred while exporting the playlist.",
    };
  }
}
