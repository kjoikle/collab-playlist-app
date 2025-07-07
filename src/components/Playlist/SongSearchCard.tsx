import { Song } from "@/types/song";
import React from "react";

interface SongSearchCardProps {
  song: Song;
}

const SongSearchCard: React.FC<SongSearchCardProps> = ({ song }) => {
  return (
    <div className="flex flex-row gap-2 p-2 bg-white cursor-pointer hover:bg-gray-100 rounded transition-colors">
      <img src={song.coverImage} className="w-10 h-10 rounded" />
      <div>
        <div className="font-semibold text-black">{song.title}</div>
        <div className="text-sm text-gray-500">{song.artist}</div>
      </div>
    </div>
  );
};

export default SongSearchCard;
