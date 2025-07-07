import { createClient } from "@/lib/supabase/server";
import { SupabasePlaylistWithSongs } from "@/types/types";
import { supabasePlaylistWithSongsToPlaylist } from "@/types/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  // check user authentication
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

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
