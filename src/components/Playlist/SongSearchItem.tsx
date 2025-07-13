import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Song } from "@/types/song";

interface SongSearchItemProps {
  song: Song;
  playlistId: number;
  onSongAdded: (songId: number) => void;
  onSongRemoved: (songId: number) => void;
}

export function SongSearchItem({
  song,
  playlistId,
  onSongAdded,
  onSongRemoved,
}: SongSearchItemProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddSong = async () => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      if (isAdded) {
        // Remove song from playlist
        const res = await fetch("/api/playlist/delete-song", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ song, playlistId }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to remove song");
        }
        setIsAdded(false);
        onSongRemoved(song.id);
      } else {
        // Add song to playlist
        const res = await fetch("/api/playlist/add-song", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ song, playlistId }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to add song");
        }
        const data = await res.json();
        setIsAdded(true);
        onSongAdded(data.id ?? song.isrc);
        song.id = data.id; // Update song object with new ID if available
      }
    } catch (error) {
      // Optionally show a toast
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors group w-full max-w-full">
      <img
        src={song.coverImage || "/placeholder.svg"}
        alt={song.title}
        className="w-12 h-12 rounded object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0 overflow-hidden">
        <h4 className="font-medium truncate max-w-[220px]">{song.title}</h4>
        <p className="text-sm text-muted-foreground truncate max-w-[220px]">
          {song.artist} • {song.album}
        </p>
      </div>
      <span className="text-sm text-muted-foreground hidden sm:inline-block w-16 text-right flex-shrink-0">
        {song.duration}
      </span>
      <Button
        size="sm"
        onClick={handleAddSong}
        disabled={isAdding}
        className={
          (isAdded
            ? "bg-green-500 hover:bg-green-600"
            : "bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700") +
          " transition-colors duration-300"
        }
        style={{
          minWidth: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isAdding ? (
          <LoadingSpinner size="sm" />
        ) : isAdded ? (
          "Added ✓"
        ) : (
          <>
            <Plus className="h-4 w-4 mr-1" /> Add
          </>
        )}
      </Button>
    </div>
  );
}
