import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// unsure that this is secure -- i need to figure this out later

// TODO: refresh user spotify token if expired
// verify input data; ensure title is not empty, songUris is not empty, etc.

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

  const accessToken = sessionData.session.provider_token;
  if (!accessToken) {
    return NextResponse.json(
      { error: "No Spotify access token" },
      { status: 401 }
    );
  }

  const { title, description, collaborative, isPublic, songUris } =
    await req.json();

  // TODO: Validate the request body (just check that collaborative and isPublic are booleans)

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

  return NextResponse.json({ success: true });
}
