import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// TODO: check spotify refresh worked

async function refreshSpotifyToken(refreshToken: string) {
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);
  params.append("client_id", process.env.SPOTIFY_CLIENT_ID!);
  params.append("client_secret", process.env.SPOTIFY_CLIENT_SECRET!);

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!response.ok) {
    throw new Error("Failed to refresh Spotify token");
  }

  return response.json(); // contains access_token, expires_in, etc.
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // check user authentication
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Get the session to access the provider token
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();
  if (sessionError || !sessionData?.session) {
    return NextResponse.json({ error: "No session found" }, { status: 401 });
  }

  let accessToken = sessionData.session.provider_token;
  const refreshToken = sessionData.session.provider_refresh_token;

  // TODO: FIX THIS; If no access token, try to refresh it first
  if (!accessToken && refreshToken) {
    try {
      const refreshed = await refreshSpotifyToken(refreshToken);
      accessToken = refreshed.access_token;
    } catch (refreshError) {
      return NextResponse.json(
        { error: "No Spotify access token and failed to refresh token" },
        { status: 401 }
      );
    }
  }

  if (!accessToken) {
    return NextResponse.json(
      { error: "No Spotify access token" },
      { status: 401 }
    );
  }

  const { title, description, collaborative, isPublic, songUris } =
    await req.json();

  // Validate the request body
  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof collaborative !== "boolean" ||
    typeof isPublic !== "boolean" ||
    !Array.isArray(songUris)
  ) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const userId = userData.user.user_metadata.provider_id;

  const createPlaylistEndpoint = `https://api.spotify.com/v1/users/${userId}/playlists`;
  const createPlaylistBody = {
    name: title ? title : "New Playlist",
    description: description ? description : "Created with Project Meow",
    public: isPublic !== undefined ? isPublic : true,
    collaborative: collaborative !== undefined ? collaborative : false,
  };

  const createPlaylistResponse = await fetch(createPlaylistEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createPlaylistBody),
  });

  if (!createPlaylistResponse.ok) {
    const errorData = await createPlaylistResponse.json();
    return NextResponse.json(
      { error: "Failed to create playlist", details: errorData },
      { status: createPlaylistResponse.status }
    );
  }

  const playlistData = await createPlaylistResponse.json();

  const playlistId = playlistData.id;
  const updatePlaylistEndpoint = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  const updatePlaylistBody = {
    uris: songUris,
  };

  // NOTE: max of 100 songs per request
  const updatePlaylistResponse = await fetch(updatePlaylistEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatePlaylistBody),
  });

  if (!updatePlaylistResponse.ok) {
    const errorData = await updatePlaylistResponse.json();
    return NextResponse.json(
      { error: "Failed to add songs to playlist", details: errorData },
      { status: updatePlaylistResponse.status }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
