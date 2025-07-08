"use client";

import { useState } from "react";
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

interface CollaboratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlist: any;
  onUpdate: (data: any) => void;
}

export function CollaboratorDialog({
  open,
  onOpenChange,
  playlist,
  onUpdate,
}: CollaboratorDialogProps) {
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState("");

  const addCollaborator = () => {
    if (
      newCollaboratorEmail &&
      !playlist.collaborators.find((c: any) => c.email === newCollaboratorEmail)
    ) {
      const newCollaborator = {
        id: Date.now().toString(),
        name: newCollaboratorEmail.split("@")[0],
        email: newCollaboratorEmail,
        avatar: "/placeholder.svg?height=40&width=40",
        role: "editor",
      };
      onUpdate({
        collaborators: [...playlist.collaborators, newCollaborator],
      });
      setNewCollaboratorEmail("");
    }
  };

  const removeCollaborator = (id: string) => {
    onUpdate({
      collaborators: playlist.collaborators.filter((c: any) => c.id !== id),
    });
  };

  const toggleRole = (id: string) => {
    onUpdate({
      collaborators: playlist.collaborators.map((c: any) =>
        c.id === id
          ? { ...c, role: c.role === "editor" ? "viewer" : "editor" }
          : c
      ),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addCollaborator())
              }
            />
            <Button onClick={addCollaborator} disabled={!newCollaboratorEmail}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="max-h-[300px]">
            <div className="space-y-2">
              {playlist.collaborators.map((collaborator: any) => (
                <div
                  key={collaborator.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={collaborator.avatar || "/placeholder.svg"}
                        alt={collaborator.name}
                      />
                      <AvatarFallback>
                        {collaborator.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{collaborator.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {collaborator.email || "No email"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        collaborator.role === "editor" ? "default" : "secondary"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleRole(collaborator.id)}
                    >
                      {collaborator.role}
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
