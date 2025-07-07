import { Song } from "@/types/types";

interface ExportPlaylistBody {
  title: string;
  description: string;
  collaborative: boolean;
  isPublic: boolean;
  songUris: string[];
}

// todo refresh user spotify token if expired; move from api to here
// verify input data; ensure title is not empty, songUris is not empty, etc.

export async function exportPlaylist(
  title: string,
  description: string,
  collaborative: boolean,
  isPublic: boolean,
  songs: Song[]
) {
  const body: ExportPlaylistBody = {
    title: title || "New Playlist",
    description: description || "A playlist created with Project Meow",
    collaborative: collaborative || false,
    isPublic: isPublic || true,
    songUris: songs.map((song) => song.spotifyUri),
  };

  const res = await fetch("/api/export-playlist-to-spotify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (data.success) {
    console.log("Playlist exported!");
  } else {
    console.error("Failed to export: " + (data.error || "Unknown error"));
  }
}
