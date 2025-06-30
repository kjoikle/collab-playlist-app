"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/client";

interface Playlist {
  id: string;
  title: string;
  description: string;
  songs: string[]; // Array of song IDs or URIs
}

// TODO: create playlist card to display

const PlaylistsDisplay = () => {
  // fetch user playlists from db
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const fetchPlaylists = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("playlists")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching playlists:", error);
      return;
    }

    console.log("Fetched playlists:", data);
    setPlaylists(data || []);
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h2 className="text-2xl font-semibold mb-4">Your Playlists</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <a href="/edit-playlist">
          <div className="bg-gray-100 p-4 rounded shadow hover:shadow-lg transition-shadow flex items-center justify-center">
            <span className="text-gray-600">Create a new playlist</span>
          </div>
        </a>
        {playlists.length > 0 ? (
          playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold">{playlist.title}</h3>
              <p className="text-gray-600">{playlist.description}</p>
              <div className="mt-2">
                <span className="text-sm text-gray-500">songs</span>
              </div>
            </div>
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
