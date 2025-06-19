"use client";

import SongCard from "@/components/Playlist/SongCard";
import SongSearch from "@/components/Playlist/SongSearch";
import { Song } from "@/types/types";
import React, { useState } from "react";

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);

  const addSong = (song: Song) => {
    console.log("Adding song:", song);
    setSongs((prevSongs) => [...prevSongs, song]);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mt-10">
        Welcome to Project Meow
      </h1>
      <p className="text-center mt-4">Collaborative Playlist Maker</p>

      {/* enter song area */}
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
}
