import { createClient } from "@/lib/supabase/server";
import { SupabasePlaylistWithSongs } from "@/types/playlist";
import { supabasePlaylistWithSongsToPlaylist } from "@/lib/types/casts";
import { NextRequest, NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/supabase/authHelpers";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAuthenticatedUser();
  if ("error" in authResult) {
    return NextResponse.json(authResult.error, { status: authResult.status });
  }

  const supabase = await createClient();

  const { id: playlistId } = await params;
  if (!playlistId) {
    return NextResponse.json(
      { error: "Playlist ID is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("id", playlistId)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Failed to fetch playlist" },
      { status: 404 }
    );
  }

  const { data: songs, error: songsError } = await supabase
    .from("songs")
    .select("*")
    .eq("playlist_id", playlistId);

  if (songsError) {
    return NextResponse.json(
      { error: "Failed to fetch songs" },
      { status: 500 }
    );
  }

  const playlistWithSongs: SupabasePlaylistWithSongs = {
    ...data,
    songs: songs || [],
  };

  const returnPlaylist = supabasePlaylistWithSongsToPlaylist(playlistWithSongs);

  return NextResponse.json({ playlist: returnPlaylist });
}
