"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlaylistGrid } from "./PlaylistGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Playlist } from "@/types/playlist";

interface PlaylistSectionProps {
  playlists: Playlist[];
}

export function PlaylistSection({ playlists }: PlaylistSectionProps) {
  const [playlistFilter, setPlaylistFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("recent");
  const itemsPerPage = 8;
  const totalPages = Math.ceil(playlists.length / itemsPerPage);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Your Playlists</h2>
        <Tabs
          defaultValue="all"
          className="w-[400px]"
          onValueChange={setPlaylistFilter}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="owned">Owned</TabsTrigger>
            <TabsTrigger value="collaborative">Collaborative</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search playlists by title or description..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recently Added</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
            <SelectItem value="popular">Most Played</SelectItem>
            <SelectItem value="collaborators">Most Collaborators</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem checked>
              Show Cover Art
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked>
              Show Descriptions
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked>
              Show Collaborators
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ScrollArea className="h-[400px] rounded-md border">
        <PlaylistGrid
          filter={playlistFilter}
          searchQuery={searchQuery}
          sortOrder={sortOrder}
          page={currentPage}
          itemsPerPage={itemsPerPage}
          playlists={playlists}
        />
      </ScrollArea>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, totalPages * itemsPerPage)} of{" "}
          {totalPages * itemsPerPage} playlists
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="icon"
              className="w-8 h-8"
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          )).slice(
            Math.max(0, currentPage - 3),
            Math.min(totalPages, currentPage + 2)
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
