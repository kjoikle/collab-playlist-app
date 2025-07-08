"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Plus, Clock, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { cn } from "@/lib/utils";

// Sample song search results and suggestions
const allSongs = [
  {
    id: "search1",
    title: "As It Was",
    artist: "Harry Styles",
    album: "Harry's House",
    duration: "2:47",
    coverUrl: "/placeholder.svg?height=60&width=60",
    popularity: 95,
  },
  {
    id: "search2",
    title: "Heat Waves",
    artist: "Glass Animals",
    album: "Dreamland",
    duration: "3:58",
    coverUrl: "/placeholder.svg?height=60&width=60",
    popularity: 92,
  },
  {
    id: "search3",
    title: "Anti-Hero",
    artist: "Taylor Swift",
    album: "Midnights",
    duration: "3:20",
    coverUrl: "/placeholder.svg?height=60&width=60",
    popularity: 98,
  },
  {
    id: "search4",
    title: "Flowers",
    artist: "Miley Cyrus",
    album: "Endless Summer Vacation",
    duration: "3:20",
    coverUrl: "/placeholder.svg?height=60&width=60",
    popularity: 89,
  },
  {
    id: "search5",
    title: "Unholy",
    artist: "Sam Smith ft. Kim Petras",
    album: "Gloria",
    duration: "2:36",
    coverUrl: "/placeholder.svg?height=60&width=60",
    popularity: 87,
  },
];

const recentSearches = [
  "Taylor Swift",
  "Harry Styles",
  "Dua Lipa",
  "The Weeknd",
];
const trendingSongs = allSongs.slice(0, 4);

interface AddSongDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddSongDialog({ open, onOpenChange }: AddSongDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<typeof allSongs>([]);
  const [suggestions, setSuggestions] = useState<typeof allSongs>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [addingSongs, setAddingSongs] = useState<Set<string>>(new Set());
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsSearching(true);
      // Simulate search delay
      const timer = setTimeout(() => {
        const filtered = allSongs.filter(
          (song) =>
            song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
            song.album.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setResults(filtered);
        setSuggestions(filtered.slice(0, 5));
        setShowDropdown(true);
        setIsSearching(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setSuggestions(trendingSongs);
      setShowDropdown(false);
      setIsSearching(false);
    }
    setSelectedIndex(-1);
  }, [searchQuery]);

  const handleAddSong = async (songId: string) => {
    setAddingSongs((prev) => new Set([...prev, songId]));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setAddingSongs((prev) => {
      const newSet = new Set(prev);
      newSet.delete(songId);
      return newSet;
    });

    const song = allSongs.find((s) => s.id === songId);
    if (song) {
      console.log(`Added "${song.title}" by ${song.artist}`);
    }
  };

  const handleSuggestionClick = (song: (typeof allSongs)[0]) => {
    setSearchQuery(song.title);
    setShowDropdown(false);
    handleAddSong(song.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Songs to Playlist</DialogTitle>
          <DialogDescription>
            Search for songs to add to your playlist
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
            {isSearching && (
              <LoadingSpinner
                size="sm"
                className="absolute right-2.5 top-2.5 z-10"
              />
            )}
            <Input
              ref={searchRef}
              placeholder="Search for songs, artists, or albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-8"
            />

            {/* Search Dropdown */}
            {(showDropdown ||
              (searchQuery.length === 0 &&
                searchRef.current === document.activeElement)) && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-20 max-h-80 overflow-hidden">
                {searchQuery.length === 0 ? (
                  <div className="p-3">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Recent Searches
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((search) => (
                            <Badge
                              key={search}
                              variant="secondary"
                              className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900"
                              onClick={() => setSearchQuery(search)}
                            >
                              {search}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Trending Now
                        </h4>
                        <div className="space-y-1">
                          {trendingSongs.map((song, index) => (
                            <div
                              key={song.id}
                              className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                              onClick={() => handleSuggestionClick(song)}
                            >
                              <img
                                src={song.coverUrl || "/placeholder.svg"}
                                alt={song.title}
                                className="w-8 h-8 rounded object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {song.title}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {song.artist}
                                </p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                #{index + 1}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <ScrollArea className="max-h-80">
                    <div className="p-1">
                      {suggestions.map((song, index) => (
                        <div
                          key={song.id}
                          className={cn(
                            "flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md cursor-pointer",
                            selectedIndex === index && "bg-muted/50"
                          )}
                          onClick={() => handleSuggestionClick(song)}
                        >
                          <img
                            src={song.coverUrl || "/placeholder.svg"}
                            alt={song.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {song.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {song.artist} • {song.album}
                            </p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {song.duration}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            )}
          </div>

          {/* Search Results */}
          {results.length > 0 && (
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                <h3 className="text-sm font-medium mb-2">
                  Search Results ({results.length})
                </h3>
                {results.map((song) => (
                  <div
                    key={song.id}
                    className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg"
                  >
                    <img
                      src={song.coverUrl || "/placeholder.svg"}
                      alt={song.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{song.title}</h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {song.artist} • {song.album}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {song.duration}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddSong(song.id)}
                      disabled={addingSongs.has(song.id)}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      {addingSongs.has(song.id) ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-1" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* No Results */}
          {searchQuery.length > 0 && results.length === 0 && !isSearching && (
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No songs found for "{searchQuery}"</p>
              <p className="text-sm">
                Try searching for a different song, artist, or album
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
