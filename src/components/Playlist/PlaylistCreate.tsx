"use client";

import SongCard from "@/components/Playlist/SongCard";
import SongSearch from "@/components/Playlist/SongSearch";
import { Song } from "@/types/types";
import React, { useState } from "react";

interface ExportPlaylistBody {
  title: string;
  description: string;
  collaborative: boolean;
  isPublic: boolean;
  songUris: string[];
}

const PlaylistCreate = () => {
  const [songs, setSongs] = useState<Song[]>([]);

  const addSong = (song: Song) => {
    setSongs((prevSongs) => [...prevSongs, song]);
  };

  const handleExport = async () => {
    const body: ExportPlaylistBody = {
      title: "My Playlist",
      description: "A playlist created with project meow",
      collaborative: false,
      isPublic: true,
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
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      <div className="flex justify-center mb-4">
        <button
          onClick={handleExport}
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition-colors"
        >
          Export to Spotify
        </button>
      </div>

      <SongSearch addSong={addSong} />

      {/* list of songs */}
      <div className="max-w-md mx-auto mt-10">
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

export default PlaylistCreate;
