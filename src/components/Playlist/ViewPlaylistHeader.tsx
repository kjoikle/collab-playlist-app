import { Playlist } from "@/types/types";
import React from "react";

interface ViewPlaylistHeaderProps {
  playlist: Playlist;
}

const ViewPlaylistHeader: React.FC<ViewPlaylistHeaderProps> = ({
  playlist,
}) => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-center">{playlist.title}</h1>
      <div className="flex justify-center mb-4">
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex flex-col gap-2 mb-2">
            <span className="text-lg font-semibold">{playlist.title}</span>
            {playlist.description && (
              <span className="text-gray-600">{playlist.description}</span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="px-2 py-1 rounded bg-gray-100 text-gray-800 text-sm">
              {playlist.isPublic ? "Public" : "Private"}
            </span>
            <span className="px-2 py-1 rounded bg-gray-100 text-gray-800 text-sm">
              {playlist.isCollaborative ? "Collaborative" : "Not Collaborative"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewPlaylistHeader;
