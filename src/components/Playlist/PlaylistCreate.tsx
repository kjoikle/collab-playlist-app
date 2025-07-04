"use client";

import SongCard from "@/components/Playlist/SongCard";
import SongSearch from "@/components/Playlist/SongSearch";
import { PlaylistCreate, Song } from "@/types/types";
import React, { useState } from "react";
import EditPlaylistHeader from "./EditPlaylistHeader";
import type { ExportPlaylistBody } from "@/types/types";

const PlaylistEdit = () => {
  const [songs, setSongs] = useState<Song[]>([]);

  const addSong = (song: Song) => {
    setSongs((prevSongs) => [...prevSongs, song]);
  };

  const handleExport = async (
    title: string,
    description: string,
    collaborative: boolean,
    isPublic: boolean
  ) => {
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
        // TODO: replace alert with a toast notification for better UX
        alert("Failed to export: " + (data.error || "Unknown error"));
        return;
      }

      // TODO: replace alert with a toast notification for better UX
      alert("Playlist exported successfully!");
    } catch (error: any) {
      // TODO: replace alert with a toast notification for better UX
      alert(error.message || "An error occurred while exporting the playlist.");
    }
  };

  const handleSave = async (title: string, description: string) => {
    const newPlaylist: PlaylistCreate = {
      title: title || "New Playlist",
      description: description || "A playlist created with Project Meow",
      isCollaborative: false,
      isPublic: true,
      songs: songs,
    };

    try {
      const response = await fetch("/api/playlist/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPlaylist),
      });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Failed to create playlist");
      }
      // TODO: handle success, e.g., show a message or redirect
      console.log("Playlist created:", data);
    } catch (error: any) {
      // TODO: change to a toast notification
      alert(error.message || "An error occurred while creating the playlist.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      <EditPlaylistHeader handleExport={handleExport} handleSave={handleSave} />

      <SongSearch addSong={addSong} />

      {/* list of songs */}
      <div className="max-w-full mt-10">
        <h2 className="text-2xl font-semibold mb-4">Playlist</h2>
        <ul className="list-none pl-5">
          {songs.map((song, index) => (
            <li key={index} className="mb-2">
              <SongCard song={song} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlaylistEdit;
