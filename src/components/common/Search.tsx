import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Search() {
  return (
    <div className="relative w-full max-w-sm">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search playlists, events, or users..."
        className="w-full bg-background pl-8 rounded-full"
      />
    </div>
  );
}
