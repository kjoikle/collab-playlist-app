import { getSpotifyToken } from "@/lib/spotify";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  if (!query) return new Response("Missing query", { status: 400 });

  const SPOTIFY_TOKEN = await getSpotifyToken();
  if (!SPOTIFY_TOKEN)
    return new Response("Failed to get Spotify token", { status: 500 });

  const res = await fetch(
    `https://api.spotify.com/v1/search?type=track&limit=5&q=${encodeURIComponent(
      query
    )}`,
    {
      headers: {
        Authorization: `Bearer ${SPOTIFY_TOKEN}`,
      },
    }
  );

  const data = await res.json();

  const results = data.tracks.items.map((item: any) => ({
    title: item.name,
    artist: item.artists.map((a: any) => a.name).join(", "),
    album: item.album.name,
    coverImage: item.album.images[0]?.url,
    spotifyUrl: item.external_urls.spotify,
    isrc: item.external_ids?.isrc,
  }));

  return Response.json(results);
}
