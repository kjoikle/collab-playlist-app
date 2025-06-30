"use client";

import { Song } from "@/types/types";
import React, { useState, useEffect } from "react";
import SongSearchCard from "./SongSearchCard";

interface SongSearchProps {
  addSong: (song: Song) => void;
}

const SongSearch: React.FC<SongSearchProps> = ({ addSong }) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Song[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSongClick = (song: Song) => {
    addSong(song);
    setQuery("");
    setResults([]);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.length > 2) {
        fetch(`/api/search?q=${encodeURIComponent(query)}`)
          .then((res) => res.json())
          .then(setResults);
      } else {
        setResults([]);
      }
    }, 300); // debounce

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="max-w-full mt-10 flex flex-col">
      <input
        type="text"
        placeholder="Enter song name"
        className="flex-grow p-2 border border-gray-300 rounded"
        onChange={handleInputChange}
        value={query}
        autoFocus
        aria-label="Song name input"
      />
      {results.length > 0 && (
        <ul className="bg-white mt-2 rounded shadow">
          {results.map((song, i) => (
            <li key={i} className="" onClick={() => handleSongClick(song)}>
              <SongSearchCard song={song} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SongSearch;
