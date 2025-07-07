export interface SpotifyArtist {
  name: string;
}

export interface SpotifyAlbum {
  name: string;
  images: { url: string }[];
}

export interface SpotifyTrack {
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  external_urls: { spotify: string };
  external_ids?: { isrc?: string };
  uri: string;
}

export interface SpotifyTracksResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}
