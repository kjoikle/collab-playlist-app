"use client";

import React, { useState } from "react";
import { Users, X, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Playlist } from "@/types/playlist";
import { toast } from "react-toastify";
import { User } from "@/types/user";
import { getUserNameToDisplay } from "@/lib/user/userHelpers";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { removePlaylistCollaborator } from "@/lib/user/collaboratorHelpers";

interface CollaboratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlist: Playlist;
}

export function CollaboratorDialog({
  open,
  onOpenChange,
  playlist,
}: CollaboratorDialogProps) {
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddCollaborator = async () => {
    if (!newCollaboratorEmail || !playlist) return;

    setLoading(true);

    try {
      const res = await fetch("/api/playlist/collaborator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playlistId: playlist.id,
          email: newCollaboratorEmail,
        }),
      });
      const data = await res.json();
      if (!data.success)
        throw new Error(data.error || "Failed to add collaborator");

      toast.success("Collaborator added successfully");
      onOpenChange(false);
      setNewCollaboratorEmail("");
      window.location.reload(); // TODO: better way to refresh collaborators
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add collaborator"
      );
    } finally {
      setLoading(false);
    }
  };

  const removeCollaborator = async (id: string) => {
    if (!playlist) return;

    try {
      const res = await fetch("/api/playlist/collaborator", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playlistId: playlist.id,
          userId: id,
        }),
      });
      const data = await res.json();
      if (!data.success)
        throw new Error(data.error || "Failed to remove collaborator");

      toast.success("Collaborator removed successfully");
      window.location.reload(); // TODO: better way to refresh collaborators
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove collaborator"
      );
    }
  };

  const toggleRole = (id: string) => {
    console.log("Toggling role for collaborator with ID:", id);
  };

  const handleOnOpenChange = (open: boolean) => {
    onOpenChange(open);
    setNewCollaboratorEmail("");
  };

  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manage Collaborators
          </DialogTitle>
          <DialogDescription>
            Add or remove people who can edit this playlist
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newCollaboratorEmail}
              onChange={(e) => setNewCollaboratorEmail(e.target.value)}
              placeholder="Enter email address"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCollaborator();
                }
              }}
            />
            <Button
              onClick={handleAddCollaborator}
              disabled={!newCollaboratorEmail || loading}
              className="min-w-[60px] h-8"
            >
              {loading ? <LoadingSpinner /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>

          <ScrollArea className="max-h-[300px]">
            <div className="space-y-2">
              {playlist.collaborators.map((collaborator: User) => (
                <div
                  key={collaborator.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={collaborator.profilePicture || "/placeholder.svg"}
                        alt={getUserNameToDisplay(collaborator)}
                      />
                      <AvatarFallback>
                        {getUserNameToDisplay(collaborator).toUpperCase() ||
                          "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {getUserNameToDisplay(collaborator)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {collaborator.email || "No email"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={"editor" === "editor" ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => toggleRole(collaborator.id)}
                    >
                      editor {/* Replace with actual role logic */}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCollaborator(collaborator.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
