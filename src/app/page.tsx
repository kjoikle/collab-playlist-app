"use client";

import React, { useState } from "react";

export default function Home() {
  const [song, setSong] = useState("");
  const [songs, setSongs] = useState<string[]>([]);

  const handleAddSong = () => {
    console.log("Adding song:", song);
    setSongs((prevSongs) => [...prevSongs, song]);
    setSong("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSong(e.target.value);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mt-10">
        Welcome to Project Meow
      </h1>
      <p className="text-center mt-4">Collaborative Playlist Maker</p>

      {/* enter song area */}
      <div className="max-w-md mt-10 flex flex-row gap-1 mx-auto px-4">
        <input
          type="text"
          placeholder="Enter song name"
          className="flex-grow p-2 border border-gray-300 rounded"
          onChange={handleInputChange}
          value={song}
          autoFocus
          aria-label="Song name input"
        />
        <button
          onClick={handleAddSong}
          className="bg-blue-500 text-white p-2 rounded sm:w-32 w-20 text-sm hover:bg-blue-600 transition-colors cursor-pointer"
        >
          Add Song
        </button>
      </div>

      {/* list of songs */}
      <div className="max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-4">Playlist</h2>
        <ul className="list-disc pl-5">
          {songs.map((song, index) => (
            <li key={index} className="mb-2">
              {song}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
