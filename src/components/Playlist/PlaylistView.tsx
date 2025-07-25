"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Edit,
  Heart,
  MoreHorizontal,
  Play,
  Plus,
  Share,
  Users,
  Download,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { SongCard } from "./SongCard";
import { AddSongDialog } from "./AddSongDialog";
import { EditPlaylistDialog } from "./EditPlaylistDialog";
import { CollaboratorDialog } from "./CollaboratorDialog";
import { SpotifyExportDialog } from "./SpotifyExportDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import Link from "next/link";
import { Playlist } from "@/types/playlist";
import { Song } from "@/types/song";
import { UpdatePlaylistDetailsRequestBody } from "@/types/request";
import { PageLoading } from "../common/PageLoading";
import { getUserNameToDisplay, isPlaylistOwner } from "@/lib/userHelpers";
import { useUser } from "@/context/UserContext";
interface PlaylistViewProps {
  playlist: Playlist;
}

export function PlaylistView({ playlist }: PlaylistViewProps) {
  const { user } = useUser();
  const [playlistData, setPlaylistData] = useState<Playlist | null>(playlist);
  const [isAddSongOpen, setIsAddSongOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCollaboratorOpen, setIsCollaboratorOpen] = useState(false);
  const [isSpotifyExportOpen, setIsSpotifyExportOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleRemoveSong = async (song: Song) => {
    // Optimistically update UI
    setPlaylistData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        songs: prev.songs.filter((s) => s.id !== song.id),
      };
    });
    try {
      const res = await fetch("/api/playlist/delete-song", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ song, playlistId: playlistData?.id }),
      });
      if (!res.ok) {
        throw new Error("Failed to remove song from playlist");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
      // Reset UI by refetching playlist
      try {
        const res = await fetch(`/api/playlist/${playlistData?.id}`);
        if (res.ok) {
          const updated = await res.json();
          setPlaylistData(updated);
        }
      } catch {}
    }
  };

  const handleUpdatePlaylistDetails = (
    updatePayload: UpdatePlaylistDetailsRequestBody
  ) => {
    setPlaylistData((prev) => {
      if (!prev) return prev;
      return { ...prev, ...updatePayload };
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success(
      "Link copied! Playlist link has been copied to your clipboard."
    );
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a playlist file
    toast.info(
      "Download started. Your playlist is being prepared for download."
    );
  };

  // const isOwner = playlistData.owner.name === "You"; // In a real app, this would check against current user
  // const canEdit =
  //   isOwner || playlistData.collaborators.some((c) => c.role === "editor");
  // TODO: Implement real ownership and edit permissions
  const isOwner = playlistData ? isPlaylistOwner(playlistData, user) : false;
  const canEdit = isOwner; // add collab logic

  // Refetch playlist from API after adding songs
  const handleSongsAdded = async () => {
    try {
      const res = await fetch(`/api/playlist/${playlistData?.id}`);
      if (!res.ok) throw new Error("Failed to fetch playlist");
      const updated = await res.json();
      setPlaylistData(updated);
    } catch (err) {
      // Optionally show a toast or error
    }
  };

  if (!playlistData || !Array.isArray(playlistData.songs)) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="hover:bg-accent">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-semibold truncate">
                {playlistData?.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {playlistData?.songs.length == 1
                  ? "1 song"
                  : `${playlistData?.songs.length} songs`}{" "}
                • duration
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
                className={`hover:bg-accent ${isLiked ? "text-red-500" : ""}`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="hover:bg-accent"
              >
                <Share className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-accent"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canEdit && (
                    <>
                      <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Playlist
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={() => setIsSpotifyExportOpen(true)}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Export to Spotify
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Playlist
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Playlist Info */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="flex-shrink-0">
            <img
              src={playlistData.coverImage || "/placeholder.svg"}
              alt={playlistData.title}
              className="w-64 h-64 rounded-lg object-cover shadow-lg"
            />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">Playlist</Badge>
                  {playlistData.isPublic && (
                    <Badge variant="outline">Public</Badge>
                  )}
                  {playlistData.isCollaborative && (
                    <Badge
                      variant="outline"
                      className="gap-1 border-purple-200 text-purple-500 dark:border-purple-800 dark:text-purple-400"
                    >
                      <Users className="h-3 w-3" />
                      Collaborative
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl font-bold mb-2">
                  {playlistData.title}
                </h1>
                <p className="text-muted-foreground mb-4">
                  {playlistData.description}
                </p>
              </div>
            </div>

            {/* TODO */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={
                      playlistData.owner.profilePicture || "/placeholder.svg"
                    }
                    alt={getUserNameToDisplay(playlistData.owner)}
                  />
                  <AvatarFallback>
                    {getUserNameToDisplay(playlistData.owner)[0]}
                  </AvatarFallback>
                </Avatar>
                <span>{getUserNameToDisplay(playlistData.owner)}</span>
              </div>
              <span>•</span>
              <span>
                {playlistData.songs.length === 1
                  ? "1 song"
                  : `${playlistData.songs.length} songs`}
              </span>
              <span>•</span>
              <span>TODO mins</span>
              <span>•</span>
              <span>TODO likes</span>
            </div>

            {playlistData.isCollaborative &&
              playlistData.collaborators.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Collaborators</h3>
                  <div className="flex items-center gap-2">
                    {playlistData.collaborators
                      .slice(0, 3)
                      .map((collaborator) => (
                        <Avatar key={collaborator.id} className="h-8 w-8">
                          <AvatarImage
                            src={
                              collaborator.profilePicture || "/placeholder.svg"
                            }
                            alt={getUserNameToDisplay(collaborator)}
                          />
                          <AvatarFallback>
                            {getUserNameToDisplay(collaborator)[0]}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    {playlistData.collaborators.length > 3 && (
                      <span className="text-sm text-muted-foreground">
                        +{playlistData.collaborators.length - 3} more
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsCollaboratorOpen(true)}
                      className="hover:bg-accent"
                    >
                      View All
                    </Button>
                  </div>
                </div>
              )}

            <div className="flex items-center gap-3">
              <Button
                size="lg"
                className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700"
              >
                <Play className="mr-2 h-5 w-5" />
                Play
              </Button>
              {canEdit && (
                <Button
                  variant="outline"
                  onClick={() => setIsAddSongOpen(true)}
                  className="hover:bg-accent"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Songs
                </Button>
              )}
            </div>
          </div>
        </div>
        {/* END Playlist Info */}

        {/* Songs List */}
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            {playlistData.songs.length === 0 ? (
              <div className="py-4 text-center text-muted-foreground text-lg">
                <span>No songs added yet.</span>
              </div>
            ) : (
              <div className="space-y-1">
                {playlistData.songs.map((song, index) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    index={index + 1}
                    onRemove={
                      canEdit ? () => handleRemoveSong(song) : undefined
                    }
                    isCollaborative={playlistData.isCollaborative}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <AddSongDialog
        playlistId={playlistData.id}
        open={isAddSongOpen}
        onOpenChange={setIsAddSongOpen}
        onSongsAdded={handleSongsAdded}
      />
      <EditPlaylistDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        playlist={playlistData}
        onUpdate={handleUpdatePlaylistDetails}
      />
      {/* <CollaboratorDialog
        open={isCollaboratorOpen}
        onOpenChange={setIsCollaboratorOpen}
        playlist={playlist}
        onUpdate={handleUpdatePlaylist}
      /> */}
      <SpotifyExportDialog
        open={isSpotifyExportOpen}
        onOpenChange={setIsSpotifyExportOpen}
        playlist={playlistData}
      />
    </div>
  );
}
