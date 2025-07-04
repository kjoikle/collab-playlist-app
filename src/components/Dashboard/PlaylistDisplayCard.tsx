import { Playlist } from "@/types/types";
import Link from "next/link";
import React from "react";

interface PlaylistDisplayCardProps {
  playlist: Playlist;
}

// TODO: handle click

const PlaylistDisplayCard = ({ playlist }: PlaylistDisplayCardProps) => {
  return (
    <Link href={`/playlist/${playlist.id}`}>
      <div
        key={playlist.id}
        className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow"
      >
        <h3 className="text-xl font-semibold">{playlist.title}</h3>
        <p className="text-gray-600">{playlist.description}</p>
      </div>
    </Link>
  );
};

export default PlaylistDisplayCard;
