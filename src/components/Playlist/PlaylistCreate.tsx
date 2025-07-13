"use client";

import type React from "react";

import { useState } from "react";
import { ArrowLeft, Upload, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { PlaylistCreate } from "@/types/playlist";
import { toast } from "react-toastify";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "../common/LoadingSpinner";

interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "editor" | "viewer";
}

export function PlaylistCreate() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addCollaborator = () => {
    if (
      collaboratorEmail &&
      !collaborators.find((c) => c.email === collaboratorEmail)
    ) {
      const newCollaborator: Collaborator = {
        id: Date.now().toString(),
        name: collaboratorEmail.split("@")[0],
        email: collaboratorEmail,
        avatar: "/placeholder.svg?height=40&width=40",
        role: "editor",
      };
      setCollaborators([...collaborators, newCollaborator]);
      setCollaboratorEmail("");
      toast.success(
        `${newCollaborator.name} has been added as a collaborator.`
      );
    }
  };

  const removeCollaborator = (id: string) => {
    setCollaborators(collaborators.filter((c) => c.id !== id));
  };

  const toggleCollaboratorRole = (id: string) => {
    setCollaborators(
      collaborators.map((c) =>
        c.id === id
          ? { ...c, role: c.role === "editor" ? "viewer" : "editor" }
          : c
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const newPlaylist: PlaylistCreate = {
      title: title || "New Playlist",
      description: description || "A playlist created with Project Meow",
      isCollaborative,
      isPublic,
      songs: [],
      // TODO: add rest of state variables
    };

    try {
      const response = await fetch("/api/playlist/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPlaylist),
      });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Failed to create playlist");
      }
      console.log("Playlist created:", data);
      const playlistId = data?.playlistId;

      if (playlistId) {
        router.push(`/playlist/${playlistId}`);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message || "An error occurred while creating the playlist.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Create New Playlist</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cover Image */}
            <div className="space-y-4">
              <Label>Cover Image</Label>
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                {coverImage ? (
                  <img
                    src={coverImage || "/placeholder.svg"}
                    alt="Playlist cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <Upload className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Upload cover image
                    </p>
                  </div>
                )}
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="cursor-pointer"
              />
            </div>

            {/* Basic Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Playlist Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter playlist title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your playlist..."
                  rows={4}
                />
              </div>

              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Playlist Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Public Playlist</Label>
                      <p className="text-sm text-muted-foreground">
                        Anyone can find and listen to this playlist
                      </p>
                    </div>
                    <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Collaborative</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow others to add and remove songs
                      </p>
                    </div>
                    <Switch
                      checked={isCollaborative}
                      onCheckedChange={setIsCollaborative}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Collaborators */}
              {isCollaborative && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Collaborators
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={collaboratorEmail}
                        onChange={(e) => setCollaboratorEmail(e.target.value)}
                        placeholder="Enter email address"
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addCollaborator())
                        }
                      />
                      <Button
                        type="button"
                        onClick={addCollaborator}
                        disabled={!collaboratorEmail}
                      >
                        Add
                      </Button>
                    </div>

                    {collaborators.length > 0 && (
                      <div className="space-y-2">
                        {collaborators.map((collaborator) => (
                          <div
                            key={collaborator.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={
                                    collaborator.avatar || "/placeholder.svg"
                                  }
                                  alt={collaborator.name}
                                />
                                <AvatarFallback>
                                  {collaborator.name[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {collaborator.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {collaborator.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  collaborator.role === "editor"
                                    ? "default"
                                    : "secondary"
                                }
                                className="cursor-pointer"
                                onClick={() =>
                                  toggleCollaboratorRole(collaborator.id)
                                }
                              >
                                {collaborator.role}
                              </Badge>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  removeCollaborator(collaborator.id)
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link href="/dashboard">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600"
              disabled={!title || isLoading}
              style={{
                minWidth: 130,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isLoading ? <LoadingSpinner /> : "Create Playlist"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
