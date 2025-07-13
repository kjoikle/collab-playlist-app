"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UpdatePlaylistDetailsRequestBody } from "@/types/request";
import { Playlist } from "@/types/playlist";
import { LoadingSpinner } from "../common/LoadingSpinner";

interface EditPlaylistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlist: Playlist;
  onUpdate: (data: UpdatePlaylistDetailsRequestBody) => void;
}

export function EditPlaylistDialog({
  open,
  onOpenChange,
  playlist,
  onUpdate,
}: EditPlaylistDialogProps) {
  const [title, setTitle] = useState(playlist.title);
  const [description, setDescription] = useState(playlist.description);
  const [isPublic, setIsPublic] = useState(playlist.isPublic);
  const [isCollaborative, setIsCollaborative] = useState(
    playlist.isCollaborative
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePlaylistDetails();
  };

  const onUpdatePlaylistDetails = async () => {
    const updatePayload: UpdatePlaylistDetailsRequestBody = {
      title,
      description,
      isPublic,
      isCollaborative,
      playlistId: playlist.id,
    };
    try {
      setIsLoading(true);
      const response = await fetch("/api/playlist/update-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Failed to update playlist");
      }
      // toast
      console.log("Playlist updated successfully");
      onUpdate(updatePayload);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      // toast
      console.error(message);
    } finally {
      setIsLoading(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Playlist</DialogTitle>
          <DialogDescription>
            Make changes to your playlist information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Public Playlist</Label>
                <p className="text-xs text-muted-foreground">
                  Anyone can find and listen to this playlist
                </p>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Collaborative</Label>
                <p className="text-xs text-muted-foreground">
                  Allow others to add and remove songs
                </p>
              </div>
              <Switch
                checked={isCollaborative}
                onCheckedChange={setIsCollaborative}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-500 hover:bg-purple-600">
              {isLoading ? <LoadingSpinner /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
