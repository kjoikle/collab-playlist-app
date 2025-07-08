"use client";

import { useState } from "react";
import Link from "next/link";
import { Playlist } from "@/types/playlist";
import PlaylistCard from "../Playlist/PlaylistCard";

interface PlaylistGridProps {
  filter: string;
  searchQuery?: string;
  sortOrder?: string;
  page?: number;
  itemsPerPage?: number;
  playlists: Playlist[];
}

export function PlaylistGrid({
  filter,
  searchQuery = "",
  sortOrder = "recent",
  page = 1,
  itemsPerPage = 8,
  playlists = [],
}: PlaylistGridProps) {
  const [loadingPlaylist, setLoadingPlaylist] = useState<string | null>(null);

  const handlePlaylistClick = (playlistId: string | number) => {
    setLoadingPlaylist(playlistId.toString());
    // The loading will be handled by Next.js navigation
    // setTimeout(() => setLoadingPlaylist(null), 2000);
  };

  // Filter by type (all, owned, collaborative)
  let filteredPlaylists = playlists.filter((playlist) => {
    if (filter === "all") return true;
    if (filter === "owned") return true; // TODO: actually check ownership
    if (filter === "collaborative") return playlist.isCollaborative;
    return true;
  });

  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredPlaylists = filteredPlaylists.filter(
      (playlist) =>
        playlist.title.toLowerCase().includes(query) ||
        playlist.description.toLowerCase().includes(query)
    );
  }

  // Sort playlists
  filteredPlaylists = [...filteredPlaylists].sort((a, b) => {
    if (sortOrder === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === "alphabetical") {
      return a.title.localeCompare(b.title);
    } else if (sortOrder === "popular") {
      //   return b.plays - a.plays; // TODO: Implement actual popularity logic or delete this sortOrder
      return a.title.localeCompare(b.title); // Placeholder for popularity sort
    } else if (sortOrder === "collaborators") {
      //   return b.collaborators - a.collaborators; // TODO: Implement actual popularity logic or delete this sortOrder
      return a.title.localeCompare(b.title); // Placeholder for collaborators sort
    }
    return 0;
  });

  // Paginate
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedPlaylists = filteredPlaylists.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {paginatedPlaylists.length > 0 ? (
        paginatedPlaylists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            loadingPlaylist={loadingPlaylist}
            handlePlaylistClick={handlePlaylistClick}
          />
        ))
      ) : (
        <div className="col-span-4 py-8 text-center text-muted-foreground">
          No playlists found. Try adjusting your search or filters.
        </div>
      )}
    </div>
  );
}
