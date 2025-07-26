"use client";

import { useState } from "react";
import { MoreHorizontal, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Song } from "@/types/song";
import { getUserNameToDisplay } from "@/lib/user/userHelpers";

interface SongCardProps {
  song: Song;
  index: number;
  onRemove?: () => void;
  isCollaborative: boolean;
}

export function SongCard({
  song,
  index,
  onRemove,
  isCollaborative,
}: SongCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div
        className="flex items-center gap-4 p-3 hover:bg-muted/50 transition-colors group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-8 text-center">
          {isHovered ? (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Play className="h-4 w-4" />
            </Button>
          ) : (
            <span className="text-sm text-muted-foreground">{index}</span>
          )}
        </div>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img
            src={song.coverImage || "/placeholder.svg"}
            alt={song.title}
            className="w-12 h-12 rounded object-cover"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{song.title}</h4>
            <p className="text-sm text-muted-foreground truncate">
              {song.artist}
            </p>
          </div>
        </div>

        <div className="hidden md:block text-sm text-muted-foreground min-w-0 flex-1">
          <p className="truncate">{song.album}</p>
        </div>

        {isCollaborative && (
          <div className="hidden sm:block text-sm text-muted-foreground">
            <p>Added by {getUserNameToDisplay(song.addedByUser)}</p>
          </div>
        )}

        <div className="text-sm text-muted-foreground">{song.duration}</div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onRemove && (
                <DropdownMenuItem
                  onClick={() => onRemove()}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove from playlist
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}
