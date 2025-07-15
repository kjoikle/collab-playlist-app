"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Plus, Clock, TrendingUp, Music, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Song } from "@/types/song";
import { SongSearchItem } from "@/components/Playlist/SongSearchItem";

interface AddSongDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlistId: string;
  onSongsAdded?: () => void;
}

const recentSearches: string[] = [];

export function AddSongDialog({
  open,
  onOpenChange,
  playlistId,
}: AddSongDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addedSongs, setAddedSongs] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("search");

  // Debounced search
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    setActiveTab("search");
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        .then((res) => res.json())
        .then((results) => {
          setSearchResults(Array.isArray(results) ? results : []);
        })
        .finally(() => setIsSearching(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSongAdded = useCallback((songId: string) => {
    setAddedSongs((prev) => new Set([...prev, songId]));
  }, []);

  const handleSongRemoved = useCallback((songId: string) => {
    setAddedSongs((prev) => {
      const newSet = new Set(prev);
      newSet.delete(songId);
      return newSet;
    });
  }, []);

  const handleQuickSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
  }, []);

  // Helper to reset dialog state
  const resetDialog = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
    setAddedSongs(new Set());
    setActiveTab("search");
  }, []);

  const handleDialogClose = useCallback(
    (open: boolean) => {
      if (!open && addedSongs.size > 0) {
        window.location.reload();
      }
      if (!open) {
        resetDialog();
      }
      onOpenChange(open);
    },
    [addedSongs.size, onOpenChange, resetDialog]
  );

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-5xl w-full h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl">Add Songs to Playlist</DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex flex-col min-h-0">
          {/* Search Bar */}
          <div className="flex-shrink-0 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for songs, artists, or albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-12 text-base"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearSearch}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <LoadingSpinner size="sm" />
                </div>
              )}
            </div>
          </div>
          {/* Content Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col min-h-0"
          >
            <TabsList className="flex-shrink-0 grid w-full grid-cols-3">
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search Results
                {searchResults.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {searchResults.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger
                value="recommended"
                className="flex items-center gap-2"
              >
                <Music className="h-4 w-4" />
                For You
              </TabsTrigger>
            </TabsList>
            {/* Search Results Tab */}
            <TabsContent value="search" className="flex-1 mt-4 min-h-0">
              {searchQuery.length === 0 ? (
                <div className="h-full flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Recent Searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search) => (
                        <Badge
                          key={search}
                          variant="secondary"
                          className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
                          onClick={() => handleQuickSearch(search)}
                        >
                          {search}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-center py-12 text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">
                      Search for music
                    </h3>
                    <p className="text-sm">
                      Find songs, artists, or albums to add to your playlist
                    </p>
                  </div>
                </div>
              ) : isSearching ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Searching for "{searchQuery}"...
                    </p>
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <ScrollArea className="h-full">
                  <div className="space-y-2">
                    {searchResults.map((song, index) => (
                      <SongSearchItem
                        key={index}
                        song={song}
                        playlistId={playlistId}
                        onSongAdded={handleSongAdded}
                        onSongRemoved={handleSongRemoved}
                      />
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-sm">
                    Try searching for a different song, artist, or album
                  </p>
                </div>
              )}
            </TabsContent>
            {/* Trending Tab */}
            {/* <TabsContent value="trending" className="flex-1 mt-4 min-h-0">
              <ScrollArea className="h-full">
                <div className="space-y-2">
                  {trendingSongs.map((song, index) => (
                    <div key={song.id} className="relative">
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-8">
                        <Badge
                          variant="outline"
                          className="w-6 h-6 p-0 flex items-center justify-center text-xs"
                        >
                          {index + 1}
                        </Badge>
                      </div>
                      <SongItem song={song} source="trending" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent> */}

            {/* Recommended Tab */}
            {/* <TabsContent value="recommended" className="flex-1 mt-4 min-h-0">
              <ScrollArea className="h-full">
                <div className="space-y-2">
                  {recommendedSongs.map((song) => (
                    <SongItem key={song.id} song={song} source="recommended" />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent> */}
          </Tabs>
        </div>
        {/* Footer with added songs count */}
        {addedSongs.size > 0 && (
          <div className="flex-shrink-0 border-t pt-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {addedSongs.size} song{addedSongs.size !== 1 ? "s" : ""} added
                to playlist
              </div>
              <Button
                onClick={() => handleDialogClose(false)}
                className="bg-purple-500 hover:bg-purple-600"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
