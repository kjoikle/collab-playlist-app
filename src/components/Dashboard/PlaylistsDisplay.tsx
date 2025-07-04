import React from "react";
import { Playlist } from "@/types/types";
import PlaylistDisplayCard from "./PlaylistDisplayCard";

interface PlaylistsDisplayProps {
  playlists: Playlist[];
}

const PlaylistsDisplay = ({ playlists }: PlaylistsDisplayProps) => {
  return (
    <div className="max-w-2xl mx-auto p-5">
      <h2 className="text-2xl font-semibold mb-4">Your Playlists</h2>
      {/* TODO: implement filters here */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <a href="/playlist">
          <div className="bg-gray-100 p-4 rounded shadow hover:shadow-lg transition-shadow flex items-center justify-center">
            <span className="text-gray-600">Create a new playlist</span>
          </div>
        </a>
        {playlists.length > 0 ? (
          playlists.map((playlist) => (
            <PlaylistDisplayCard key={playlist.id} playlist={playlist} />
          ))
        ) : (
          <div className="text-center text-gray-500">
            No playlists found. Start creating your first playlist!
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistsDisplay;
