"use client";

import { ExternalLink, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { exportPlaylist } from "@/lib/playlist/exportHelpers";
import { Playlist } from "@/types/playlist";
import { toast } from "react-toastify";
import { useState } from "react";
import { LoadingSpinner } from "../common/LoadingSpinner";

interface SpotifyExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlist: Playlist;
}

export function SpotifyExportDialog({
  open,
  onOpenChange,
  playlist,
}: SpotifyExportDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    const result = await exportPlaylist(playlist);
    if (!result.success) {
      toast.error("Failed to export: " + (result.error || "Unknown error"));
      return;
    }
    toast.success("Playlist exported successfully!");
    setIsLoading(false);
    handleClose();
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-green-500" />
            Export to Spotify
          </DialogTitle>
          <DialogDescription>
            Export "{playlist.title}" to your Spotify account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">{playlist.title}</p>
              <p className="text-sm text-muted-foreground">
                {playlist.songs.length} songs
              </p>
            </div>
            <img
              src={playlist.coverImage || "/placeholder.svg"}
              alt={playlist.title}
              className="w-12 h-12 rounded object-cover"
            />
          </div>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This will create a new playlist in your Spotify account. Songs not
              available on Spotify will be skipped.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              className="bg-green-500 hover:bg-green-600 min-w-[150px] "
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <ExternalLink className="mr-2 h-4 w-4" />
              )}
              Export to Spotify
            </Button>
          </>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
