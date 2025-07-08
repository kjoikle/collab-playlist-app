import { Song } from "@/types/song";
import React from "react";

interface SongSearchCardProps {
  song: Song;
  onRemove?: (song: Song) => void;
}

const SongSearchCard: React.FC<SongSearchCardProps> = ({ song, onRemove }) => {
  return (
    <div className="flex flex-row gap-2 p-2 bg-white cursor-pointer hover:bg-gray-100 rounded transition-colors">
      <img src={song.coverImage} className="w-10 h-10 rounded" />
      <div>
        <div className="font-semibold text-black">{song.title}</div>
        <div className="text-sm text-gray-500">{song.artist}</div>
      </div>
      {onRemove && (
        <button
          onClick={() => onRemove(song)}
          className="ml-auto px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Remove
        </button>
      )}
    </div>
  );
};

export default SongSearchCard;
