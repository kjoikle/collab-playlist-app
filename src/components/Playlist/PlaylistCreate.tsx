"use client";

import SongCard from "@/components/Playlist/SongCard";
import SongSearch from "@/components/Playlist/SongSearch";
import { PlaylistCreate } from "@/types/playlist";
import { Song } from "@/types/song";
import React, { useState } from "react";
import CreatePlaylistHeader from "./CreatePlaylistHeader";
import ExportToSpotifyButton from "./ExportToSpotifyButton";
import { useRouter } from "next/navigation";

const PlaylistCreatePage = () => {
  const router = useRouter();
  const [songs, setSongs] = useState<Song[]>([]);

  const addSong = (song: Song) => {
    setSongs((prevSongs) => [...prevSongs, song]);
  };

  const handleSave = async (
    title: string,
    description: string,
    isCollaborative: boolean,
    isPublic: boolean
  ) => {
    const newPlaylist: PlaylistCreate = {
      title: title || "New Playlist",
      description: description || "A playlist created with Project Meow",
      isCollaborative,
      isPublic,
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
      console.log("Playlist created:", data);
      const playlistId = data?.playlistId;
      if (playlistId) {
        router.push(`/playlist/${playlistId}`);
      }
    } catch (error: any) {
      // TODO: change to a toast notification
      alert(error.message || "An error occurred while creating the playlist.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      <div className="flex justify-end mb-4">
        <ExportToSpotifyButton
          songs={songs}
          title={"New Playlist"}
          description={"A playlist created with Project Meow"}
          collaborative={false}
          isPublic={true}
        />
      </div>
      <CreatePlaylistHeader handleSave={handleSave} />

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

export default PlaylistCreatePage;
