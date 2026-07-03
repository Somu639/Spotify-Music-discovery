export interface ItunesTrackResult {
  trackName: string;
  artistName: string;
  previewUrl: string;
}

interface ItunesSearchResponse {
  resultCount: number;
  results: ItunesTrackResult[];
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreMatch(
  result: ItunesTrackResult,
  title: string,
  artist: string
): number {
  const trackNorm = normalize(result.trackName);
  const artistNorm = normalize(result.artistName);
  const titleNorm = normalize(title);
  const artistNormQuery = normalize(artist.split(/ ft\.| feat\.| & /i)[0] ?? artist);

  let score = 0;
  if (trackNorm === titleNorm) score += 50;
  else if (trackNorm.includes(titleNorm) || titleNorm.includes(trackNorm)) score += 30;

  if (artistNorm.includes(artistNormQuery) || artistNormQuery.includes(artistNorm)) {
    score += 40;
  } else {
    const artistTokens = artistNormQuery.split(" ");
    const matchedTokens = artistTokens.filter((token) => artistNorm.includes(token));
    score += matchedTokens.length * 8;
  }

  if (result.previewUrl) score += 5;
  return score;
}

export async function lookupItunesPreview(
  artist: string,
  title: string
): Promise<string | null> {
  const term = encodeURIComponent(`${artist} ${title}`);
  const url = `https://itunes.apple.com/search?term=${term}&entity=song&limit=8`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 * 60 * 24 * 7 },
  });

  if (!response.ok) return null;

  const data = (await response.json()) as ItunesSearchResponse;
  if (!data.results?.length) return null;

  const ranked = [...data.results]
    .filter((result) => Boolean(result.previewUrl))
    .sort((a, b) => scoreMatch(b, title, artist) - scoreMatch(a, title, artist));

  return ranked[0]?.previewUrl ?? null;
}

async function lookupDeezerPreview(
  artist: string,
  title: string
): Promise<string | null> {
  const query = encodeURIComponent(`artist:"${artist}" track:"${title}"`);
  const url = `https://api.deezer.com/search/track?q=${query}&limit=5`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 * 60 * 24 * 7 },
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    data?: Array<{ title: string; preview?: string; artist?: { name: string } }>;
  };

  if (!data.data?.length) return null;

  const titleNorm = normalize(title);
  const artistNorm = normalize(artist.split(/ ft\.| feat\.| & /i)[0] ?? artist);

  const ranked = [...data.data]
    .filter((track) => Boolean(track.preview))
    .sort((a, b) => {
      const scoreA =
        (normalize(a.title) === titleNorm ? 40 : 0) +
        (normalize(a.artist?.name ?? "").includes(artistNorm) ? 30 : 0);
      const scoreB =
        (normalize(b.title) === titleNorm ? 40 : 0) +
        (normalize(b.artist?.name ?? "").includes(artistNorm) ? 30 : 0);
      return scoreB - scoreA;
    });

  return ranked[0]?.preview ?? null;
}

export async function lookupTrackPreview(
  artist: string,
  title: string
): Promise<string | null> {
  const itunes = await lookupItunesPreview(artist, title);
  if (itunes) return itunes;
  return lookupDeezerPreview(artist, title);
}
