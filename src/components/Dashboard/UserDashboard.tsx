"use client";

import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { UserNav } from "@/components/common/UserNav";
import { Search } from "@/components/common/Search";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PlaylistSection } from "./PlaylistSection";
import { EventSection } from "./EventSection";
import Link from "next/link";
import type { Playlist } from "@/types/playlist";

interface UserDashboardProps {
  playlists: Playlist[];
}

export function UserDashboard({ playlists }: UserDashboardProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="flex items-center gap-2 lg:gap-4 w-full">
            <Search />
            <div className="ml-auto flex items-center gap-2">
              <Link href="/playlist/create">
                <Button
                  size="sm"
                  className="h-8 gap-1 bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4" />
                  New Playlist
                </Button>
              </Link>
              <ThemeToggle />
              <UserNav />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <div className="flex flex-col gap-8">
            <PlaylistSection playlists={playlists} />
            <EventSection />
          </div>
        </main>
      </div>
    </div>
  );
}
