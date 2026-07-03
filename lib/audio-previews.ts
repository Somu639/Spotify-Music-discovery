import { PREVIEW_URLS_BY_ID } from "@/lib/preview-urls.generated";

export function getPreviewUrlForId(id: string): string {
  return PREVIEW_URLS_BY_ID[id] ?? "";
}

export function isRealPreviewUrl(url: string | undefined): boolean {
  if (!url) return false;
  return (
    url.includes("itunes.apple.com") ||
    url.includes("audio-ssl.itunes.apple.com") ||
    url.includes("deezer.com") ||
    url.includes("cdn-preview")
  );
}

export async function resolvePreviewUrl(track: {
  id: string;
  title: string;
  artist: string;
  previewUrl?: string;
}): Promise<string | null> {
  if (PREVIEW_URLS_BY_ID[track.id]) {
    return PREVIEW_URLS_BY_ID[track.id]!;
  }

  if (isRealPreviewUrl(track.previewUrl)) {
    return track.previewUrl!;
  }

  const params = new URLSearchParams({
    id: track.id,
    title: track.title,
    artist: track.artist,
  });

  try {
    const response = await fetch(`/api/preview?${params.toString()}`);
    if (!response.ok) return null;
    const data = (await response.json()) as { previewUrl: string };
    return data.previewUrl ?? null;
  } catch {
    return null;
  }
}
