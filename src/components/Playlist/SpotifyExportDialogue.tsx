"use client";

import { useState } from "react";
import { ExternalLink, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface SpotifyExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlist: any;
}

export function SpotifyExportDialog({
  open,
  onOpenChange,
  playlist,
}: SpotifyExportDialogProps) {
  const [exportStatus, setExportStatus] = useState<
    "idle" | "connecting" | "exporting" | "success" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [exportedSongs, setExportedSongs] = useState(0);
  const [failedSongs, setFailedSongs] = useState<string[]>([]);

  const handleExport = async () => {
    setExportStatus("connecting");
    setProgress(0);
    setExportedSongs(0);
    setFailedSongs([]);

    // Simulate Spotify connection
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setExportStatus("exporting");

    // Simulate song export process
    for (let i = 0; i < playlist.songs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Simulate some songs failing to export
      if (Math.random() > 0.85) {
        setFailedSongs((prev) => [...prev, playlist.songs[i].title]);
      } else {
        setExportedSongs((prev) => prev + 1);
      }

      setProgress(((i + 1) / playlist.songs.length) * 100);
    }

    setExportStatus("success");
  };

  const handleReset = () => {
    setExportStatus("idle");
    setProgress(0);
    setExportedSongs(0);
    setFailedSongs([]);
  };

  const handleClose = () => {
    handleReset();
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
          {exportStatus === "idle" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{playlist.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {playlist.songs.length} songs
                  </p>
                </div>
                <img
                  src={playlist.coverUrl || "/placeholder.svg"}
                  alt={playlist.title}
                  className="w-12 h-12 rounded object-cover"
                />
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This will create a new playlist in your Spotify account. Songs
                  not available on Spotify will be skipped.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {exportStatus === "connecting" && (
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-green-500" />
              <p className="text-sm">Connecting to Spotify...</p>
            </div>
          )}

          {exportStatus === "exporting" && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm font-medium">Exporting playlist...</p>
                <p className="text-xs text-muted-foreground">
                  {exportedSongs} of {playlist.songs.length} songs exported
                </p>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {exportStatus === "success" && (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="font-medium">Export completed!</p>
                <p className="text-sm text-muted-foreground">
                  {exportedSongs} songs exported successfully
                </p>
              </div>

              {failedSongs.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <p className="font-medium mb-2">
                      {failedSongs.length} songs couldn't be found on Spotify:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {failedSongs.slice(0, 3).map((song) => (
                        <Badge
                          key={song}
                          variant="secondary"
                          className="text-xs"
                        >
                          {song}
                        </Badge>
                      ))}
                      {failedSongs.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{failedSongs.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <Button
                className="w-full bg-green-500 hover:bg-green-600"
                onClick={() =>
                  window.open("https://open.spotify.com", "_blank")
                }
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in Spotify
              </Button>
            </div>
          )}

          {exportStatus === "error" && (
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <div>
                <p className="font-medium">Export failed</p>
                <p className="text-sm text-muted-foreground">
                  Unable to connect to Spotify. Please try again.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {exportStatus === "idle" && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                className="bg-green-500 hover:bg-green-600"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Export to Spotify
              </Button>
            </>
          )}
          {exportStatus === "success" && (
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          )}
          {exportStatus === "error" && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                className="bg-green-500 hover:bg-green-600"
              >
                Try Again
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
