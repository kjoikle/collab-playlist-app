"use client";

import SongCard from "@/components/Playlist/SongCard";
import SongSearch from "@/components/Playlist/SongSearch";
import { Song } from "@/types/types";
import React, { useState } from "react";
import EditPlaylistHeader from "./EditPlaylistHeader";
import { createClient } from "@/lib/supabase/client";

interface ExportPlaylistBody {
  title: string;
  description: string;
  collaborative: boolean;
  isPublic: boolean;
  songUris: string[];
}

// take in an optional playlist object / else start from scratch

const PlaylistEdit = () => {
  const [songs, setSongs] = useState<Song[]>([]);

  const addSong = (song: Song) => {
    setSongs((prevSongs) => [...prevSongs, song]);
  };

  // some way to check if they already have this playlist saved?
  const handleExport = async (
    title: string,
    description: string,
    collaborative: boolean,
    isPublic: boolean
  ) => {
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
  };

  const handleSaveNewPlaylist = async (title: string, description: string) => {
    const supabase = createClient();

    const { error, data } = await supabase
      .from("playlists")
      .insert({
        title: title || "New Playlist",
        description: description || "A playlist created with Project Meow",
        user_id: 1, // replace with actual user ID
      })
      .select();

    if (error) {
      console.error("Error saving playlist:", error);
      return;
    }

    const playlistId = data[0].id;
    songs.forEach(async (song) => {
      const { error } = await supabase.from("songs").insert({
        title: song.title,
        artist: song.artist,
        album: song.album,
        cover_image: song.coverImage,
        spotify_url: song.spotifyUrl,
        isrc: song.isrc,
        spotify_uri: song.spotifyUri,
        playlist_id: playlistId,
      });

      if (error) {
        console.error("Error saving song:", error);
      } else {
        console.log(`Song ${song.title} saved to playlist ${playlistId}`);
      }
    });

    console.log("Playlist saved successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      <EditPlaylistHeader
        handleExport={handleExport}
        handleSave={handleSaveNewPlaylist}
      />

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
