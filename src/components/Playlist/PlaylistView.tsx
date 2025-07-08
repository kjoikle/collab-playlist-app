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
import { AddSongDialog } from "./AddSongDialogue";
import { EditPlaylistDialog } from "./EditPlaylistDialogue";
import { CollaboratorDialog } from "./CollaboratorDialogue";
import { SpotifyExportDialog } from "./SpotifyExportDialogue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { Playlist } from "@/types/playlist";
import { Song } from "@/types/song";
import { UpdatePlaylistDetailsRequestBody } from "@/types/request";

// Sample playlist data
const playlistData = {
  id: "1",
  title: "Summer Vibes 2024",
  description:
    "Perfect for sunny days and beach parties. A collection of upbeat tracks that capture the essence of summer.",
  coverUrl: "/placeholder.svg?height=300&width=300",
  isPublic: true,
  isCollaborative: true,
  owner: {
    id: "user1",
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  collaborators: [
    {
      id: "user2",
      name: "Jamie Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "editor",
    },
    {
      id: "user3",
      name: "Taylor Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "viewer",
    },
  ],
  createdAt: "2024-06-15",
  updatedAt: "2024-07-05",
  totalDuration: "2h 34m",
  likes: 142,
  songs: [
    {
      id: "song1",
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      duration: "3:20",
      coverUrl: "/placeholder.svg?height=60&width=60",
      addedBy: "Alex Johnson",
      addedAt: "2024-06-15",
    },
    {
      id: "song2",
      title: "Watermelon Sugar",
      artist: "Harry Styles",
      album: "Fine Line",
      duration: "2:54",
      coverUrl: "/placeholder.svg?height=60&width=60",
      addedBy: "Jamie Smith",
      addedAt: "2024-06-18",
    },
    {
      id: "song3",
      title: "Levitating",
      artist: "Dua Lipa",
      album: "Future Nostalgia",
      duration: "3:23",
      coverUrl: "/placeholder.svg?height=60&width=60",
      addedBy: "Alex Johnson",
      addedAt: "2024-06-20",
    },
    {
      id: "song4",
      title: "Good 4 U",
      artist: "Olivia Rodrigo",
      album: "SOUR",
      duration: "2:58",
      coverUrl: "/placeholder.svg?height=60&width=60",
      addedBy: "Taylor Brown",
      addedAt: "2024-06-25",
    },
    {
      id: "song5",
      title: "Stay",
      artist: "The Kid LAROI & Justin Bieber",
      album: "F*CK LOVE 3: OVER YOU",
      duration: "2:21",
      coverUrl: "/placeholder.svg?height=60&width=60",
      addedBy: "Jamie Smith",
      addedAt: "2024-07-01",
    },
  ],
};

interface PlaylistViewProps {
  playlist: Playlist;
}

export function PlaylistView({ playlist }: PlaylistViewProps) {
  const [playlistData, setPlaylistData] = useState(playlist);
  const [isAddSongOpen, setIsAddSongOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCollaboratorOpen, setIsCollaboratorOpen] = useState(false);
  const [isSpotifyExportOpen, setIsSpotifyExportOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleRemoveSong = (song: Song) => {
    setPlaylistData((prev) => ({
      ...prev,
      songs: prev.songs.filter((s) => s.id !== song.id),
    }));
    // toast({
    //   title: "Song removed",
    //   description: "The song has been removed from your playlist.",
    // });
  };

  const handleUpdatePlaylistDetails = (
    updatePayload: UpdatePlaylistDetailsRequestBody
  ) => {
    setPlaylistData((prev) => ({ ...prev, ...updatePayload }));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    // toast({
    //   title: "Link copied!",
    //   description: "Playlist link has been copied to your clipboard.",
    // });
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a playlist file
    // toast({
    //   title: "Download started",
    //   description: "Your playlist is being prepared for download.",
    // });
  };

  // const isOwner = playlistData.owner.name === "You"; // In a real app, this would check against current user
  // const canEdit =
  //   isOwner || playlistData.collaborators.some((c) => c.role === "editor");
  // TODO: Implement real ownership and edit permissions
  const isOwner = true;
  const canEdit = true;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-accent">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-semibold truncate">
                {playlistData.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {/* {playlistData.songs.length} songs • {playlistData.totalDuration} */}
                {playlistData.songs.length} songs • TODO
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
            {/* <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={playlistData.owner.avatar || "/placeholder.svg"}
                    alt={playlistData.owner.name}
                  />
                  <AvatarFallback>{playlistData.owner.name[0]}</AvatarFallback>
                </Avatar>
                <span>{playlistData.owner.name}</span>
              </div>
              <span>•</span>
              <span>{playlistData.songs.length} songs</span>
              <span>•</span>
              <span>{playlistData.totalDuration}</span>
              <span>•</span>
              <span>{playlistData.likes} likes</span>
            </div> */}

            {/* {playlistData.isCollaborative &&
              playlistData.collaborators.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Collaborators</h3>
                  <div className="flex items-center gap-2">
                    {playlistData.collaborators
                      .slice(0, 3)
                      .map((collaborator) => (
                        <Avatar key={collaborator.id} className="h-8 w-8">
                          <AvatarImage
                            src={collaborator.avatar || "/placeholder.svg"}
                            alt={collaborator.name}
                          />
                          <AvatarFallback>
                            {collaborator.name[0]}
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
              )} */}

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={"/placeholder.svg"} />
                  <AvatarFallback>NAME</AvatarFallback>
                </Avatar>
                <span>NAME</span>
              </div>
              <span>•</span>
              <span>0 songs</span>
              <span>•</span>
              <span>0:00</span>
              <span>•</span>
              <span>0 likes</span>
            </div>

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

        {/* Songs List */}
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="space-y-1">
              {playlistData.songs.map((song, index) => (
                <SongCard
                  key={song.id}
                  song={song}
                  index={index + 1}
                  onRemove={canEdit ? () => handleRemoveSong(song) : undefined}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      {/* <AddSongDialog open={isAddSongOpen} onOpenChange={setIsAddSongOpen} /> */}
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
        playlist={playlist}
      />
    </div>
  );
}
