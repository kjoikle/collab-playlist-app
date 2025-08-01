import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { Play, Users } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Playlist } from "../../types/playlist";
import { Badge } from "../ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { getUserNameToDisplay } from "@/lib/user/userHelpers";

type PlaylistCardProps = {
  playlist: Playlist;
  loadingPlaylist?: string | null;
  handlePlaylistClick?: (id: string) => void;
};

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  loadingPlaylist,
  handlePlaylistClick = () => {},
}) => {
  const userName = getUserNameToDisplay(playlist.owner);
  return (
    <Link
      href={`/playlist/${playlist.id}`}
      key={playlist.id}
      onClick={() => handlePlaylistClick(playlist.id)}
    >
      <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer">
        <CardHeader className="p-0 relative group">
          <div className="aspect-square overflow-hidden bg-muted">
            <img
              src={playlist.coverImage || "/placeholder.svg"}
              alt={playlist.title}
              className="object-cover w-full h-full transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {loadingPlaylist === playlist.id.toString() ? (
                <LoadingSpinner
                  size="lg"
                  className="border-white border-t-purple-500"
                />
              ) : (
                <Button
                  size="icon"
                  className="rounded-full bg-purple-500 hover:bg-purple-600 h-12 w-12"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Play className="h-6 w-6" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4">
          <CardTitle className="text-base line-clamp-1">
            {playlist.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-xs mt-1">
            {playlist.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={playlist.owner.profilePicture || "/placeholder.svg"}
                alt={userName}
              />
              <AvatarFallback>{userName[0]}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{userName}</span>
          </div>
          {playlist.isCollaborative && (
            <Badge
              variant="outline"
              className="gap-1 text-xs border-purple-200 text-purple-500"
            >
              <Users className="h-3 w-3" />
              {playlist.collaborators.length}
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PlaylistCard;
