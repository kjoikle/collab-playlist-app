import React from "react";
import { Song } from "@/types/types";
import { exportPlaylist } from "@/lib/playlist/exportHelpers";

interface ExportToSpotifyButtonProps {
  songs: Song[];
  title: string;
  description: string;
  collaborative: boolean;
  isPublic: boolean;
}

const ExportToSpotifyButton: React.FC<ExportToSpotifyButtonProps> = ({
  songs,
  title,
  description,
  collaborative,
  isPublic,
}) => {
  const handleExport = async () => {
    const result = await exportPlaylist(
      songs,
      title,
      description,
      collaborative,
      isPublic
    );
    if (!result.success) {
      alert("Failed to export: " + (result.error || "Unknown error"));
      return;
    }
    alert("Playlist exported successfully!");
  };

  return (
    <button
      onClick={handleExport}
      className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-700 transition-colors"
    >
      Export to Spotify
    </button>
  );
};

export default ExportToSpotifyButton;
