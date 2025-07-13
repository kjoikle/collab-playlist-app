const SongItem = ({
  song,
  source,
}: {
  song: (typeof allSongs)[0];
  source: string;
}) => {
  const isAdding = addingSongs.has(song.id);
  const isAdded = addedSongs.has(song.id);

  return (
    <div className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors group">
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
      <div className="text-sm text-muted-foreground hidden sm:block">
        {song.duration}
      </div>
      <Button
        size="sm"
        onClick={() => handleAddSong(song, source)}
        disabled={isAdding || isAdded}
        className={`${
          isAdded
            ? "bg-green-500 hover:bg-green-600"
            : "bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700"
        } transition-all`}
      >
        {isAdding ? (
          <>
            <LoadingSpinner size="sm" className="mr-1" />
            Adding...
          </>
        ) : isAdded ? (
          "Added ✓"
        ) : (
          <>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </>
        )}
      </Button>
    </div>
  );
};
