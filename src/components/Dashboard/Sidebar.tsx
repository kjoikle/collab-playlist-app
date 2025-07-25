import type React from "react";
import Link from "next/link";
import {
  Home,
  Library,
  ListMusic,
  Music,
  Radio,
  User,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("pb-12 w-64 border-r bg-card", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <Link href="/" className="flex items-center gap-2">
            <Music className="h-6 w-6 text-purple-500 dark:text-purple-400" />
            <h2 className="text-xl font-bold tracking-tight">Harmony</h2>
          </Link>
        </div>
        <div className="px-4">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start hover:bg-accent"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start hover:bg-accent"
            >
              <Radio className="mr-2 h-4 w-4" />
              Browse
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start hover:bg-accent"
            >
              <ListMusic className="mr-2 h-4 w-4" />
              For You
            </Button>
          </div>
        </div>
        <div className="px-4">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Library
          </h2>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start hover:bg-accent"
            >
              <ListMusic className="mr-2 h-4 w-4" />
              Playlists
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start hover:bg-accent"
            >
              <Users className="mr-2 h-4 w-4" />
              Collaborators
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start hover:bg-accent"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </div>
        </div>
        <div className="px-4">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Your Playlists
          </h2>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-xs font-normal hover:bg-accent"
            >
              <Library className="mr-2 h-4 w-4" />
              Summer Vibes 2024
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-xs font-normal hover:bg-accent"
            >
              <Library className="mr-2 h-4 w-4" />
              Workout Mix
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-xs font-normal hover:bg-accent"
            >
              <Library className="mr-2 h-4 w-4" />
              Chill Evening
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-xs font-normal hover:bg-accent"
            >
              <Library className="mr-2 h-4 w-4" />
              Road Trip Classics
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-xs font-normal hover:bg-accent"
            >
              <Library className="mr-2 h-4 w-4" />
              Party Anthems
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
