"use client";

import SongCard from "@/components/Playlist/SongCard";
import SongSearch from "@/components/Playlist/SongSearch";
import { Song } from "@/types/types";
import React, { useEffect, useState } from "react";
import EditPlaylistHeader from "./EditPlaylistHeader";
import ViewPlaylistHeader from "./ViewPlaylistHeader";
import ExportToSpotifyButton from "./ExportToSpotifyButton";
import useSWR from "swr";

interface PlaylistViewPageProps {
  playlistId: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const PlaylistViewPage: React.FC<PlaylistViewPageProps> = ({ playlistId }) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/playlist/${playlistId}`,
    fetcher
  );

  const [songs, setSongs] = useState<Song[]>([]);
  const [addedSongs, setAddedSongs] = useState<Song[]>([]);
  const [deletedSongs, setDeletedSongs] = useState<Song[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // Use state for all editable fields
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isCollaborative, setIsCollaborative] = useState(false);

  useEffect(() => {
    if (data && data.playlist) {
      const playlist = data.playlist;
      setSongs(playlist.songs || []);
      setPlaylistTitle(playlist.title);
      setPlaylistDescription(playlist.description || "");
      setIsPublic(playlist.isPublic);
      setIsCollaborative(playlist.isCollaborative);
    }
  }, [data]);

  const addSong = (song: Song) => {
    setSongs((prevSongs) => [...prevSongs, song]);
    setAddedSongs((prev) => [...prev, song]);
    setDeletedSongs((prev) => prev.filter((s) => s.isrc !== song.isrc));
  };

  const removeSong = (song: Song) => {
    const newSongList = songs.filter((s) => s.isrc !== song.isrc);

    setSongs(newSongList);
    if (playlist.songs?.some((s: Song) => s.isrc === song.isrc)) {
      setDeletedSongs((prev) => [...prev, song]);
    }
    setAddedSongs((prev) => prev.filter((s) => s.isrc !== song.isrc));
  };

  // Always use state values for update
  const handleSave = async (
    title: string,
    description: string,
    isPublic: boolean,
    isCollaborative: boolean
  ) => {
    setPlaylistTitle(title);
    setPlaylistDescription(description);
    setIsPublic(isPublic);
    setIsCollaborative(isCollaborative);
    const updatePayload = {
      playlistId: playlist.id,
      title,
      description,
      isCollaborative,
      isPublic,
      addedSongs,
      deletedSongs,
    };

    try {
      const response = await fetch("/api/playlist/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Failed to update playlist");
      }
      setAddedSongs([]);
      setDeletedSongs([]);
      console.log("Playlist updated:", data);
      mutate(); // Refetch the playlist data after saving
    } catch (error: any) {
      alert(error.message || "An error occurred while updating the playlist.");
      console.error(error);
    } finally {
      setIsEditing(false);
    }
  };

  const toggleEditMode = () => {
    if (isEditing) {
      // If switching to view mode, reset the playlist state
      resetPlaylistState();
    }
    setIsEditing((prev) => !prev);
  };

  // Remove or rewrite resetPlaylistState, since state is now initialized from fetched playlist
  const resetPlaylistState = () => {
    setSongs(playlist.songs || []);
    setAddedSongs([]);
    setDeletedSongs([]);
    setPlaylistTitle(playlist.title);
    setPlaylistDescription(playlist.description || "");
    setIsPublic(playlist.isPublic);
    setIsCollaborative(playlist.isCollaborative);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error || !data || !data.playlist)
    return <div>Error loading playlist.</div>;

  const playlist = data.playlist;

  return (
    <div className="max-w-2xl mx-auto p-5">
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleEditMode}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          aria-label={isEditing ? "Cancel editing playlist" : "Edit playlist"}
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      <div className="flex justify-end mb-4">
        <ExportToSpotifyButton
          songs={songs}
          title={playlistTitle}
          description={playlistDescription}
          collaborative={isCollaborative}
          isPublic={isPublic}
        />
      </div>

      {isEditing ? (
        <>
          <EditPlaylistHeader
            handleSave={handleSave}
            originalTitle={playlistTitle}
            originalDescription={playlistDescription}
            isPublic={isPublic}
            collaborative={isCollaborative}
          />
          <SongSearch addSong={addSong} />
        </>
      ) : (
        <ViewPlaylistHeader
          playlist={{
            ...playlist,
            title: playlistTitle,
            description: playlistDescription,
            isPublic,
            isCollaborative,
            songs,
          }}
        />
      )}

      {/* list of songs */}
      <div className="max-w-full mt-10">
        <h2 className="text-2xl font-semibold mb-4">Playlist</h2>
        <ul className="list-none pl-5">
          {songs.map((song, index) => (
            <li key={index} className="mb-2">
              {isEditing ? (
                <SongCard song={song} onRemove={() => removeSong(song)} />
              ) : (
                <SongCard song={song} />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlaylistViewPage;
