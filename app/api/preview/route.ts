import { NextRequest, NextResponse } from "next/server";
import { lookupTrackPreview } from "@/lib/itunes-preview";

const memoryCache = new Map<string, string>();

export async function GET(request: NextRequest) {
  const artist = request.nextUrl.searchParams.get("artist");
  const title = request.nextUrl.searchParams.get("title");
  const id = request.nextUrl.searchParams.get("id");

  if (!artist || !title) {
    return NextResponse.json(
      { error: "artist and title are required" },
      { status: 400 }
    );
  }

  const cacheKey = id ?? `${artist}|${title}`;
  const cached = memoryCache.get(cacheKey);
  if (cached) {
    return NextResponse.json({ previewUrl: cached, source: "cache" });
  }

  const previewUrl = await lookupTrackPreview(artist, title);
  if (!previewUrl) {
    return NextResponse.json(
      { error: "No preview found for this track" },
      { status: 404 }
    );
  }

  memoryCache.set(cacheKey, previewUrl);
  return NextResponse.json({ previewUrl, source: "itunes" });
}
