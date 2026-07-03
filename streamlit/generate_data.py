"""Generate streamlit/data/catalog.json and preview_urls.json from TS sources."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = Path(__file__).resolve().parent / "data"
OUT.mkdir(exist_ok=True)

SONG_RE = re.compile(
    r'\{\s*id:\s*"([^"]+)"\s*,\s*title:\s*"([^"]+)"\s*,\s*artist:\s*"([^"]+)"\s*,'
    r'\s*album:\s*"([^"]+)"\s*,\s*genre:\s*"([^"]+)"\s*,\s*playCount:\s*(\d+)\s*,'
    r'\s*energy:\s*([\d.]+)\s*,\s*tempo:\s*(\d+)(?:\s*,\s*mood:\s*"([^"]+)")?\s*\}',
    re.MULTILINE,
)

CREATE_TRACK_RE = re.compile(
    r'createTrack\("([^"]+)", "([^"]+)", "([^"]+)", "([^"]+)", "([^"]+)", '
    r"(\d+), ([\d.]+), (\d+), \"([^\"]+)\"\)",
)

PREVIEW_RE = re.compile(r'"([^"]+)":\s*"(https://[^"]+)"')

PLAYLIST_DEFS = [
    ("morning-energy", "Morning Energy", "motivational", "morning routine", "morningEnergyTracks"),
    ("late-night-coding", "Late Night Coding", "focused", "deep work", "lateNightCodingTracks"),
    ("weekend-vibes", "Weekend Vibes", "relaxed", "leisure", "weekendVibesTracks"),
    ("gym-beast-mode", "Gym Beast Mode", "intense", "workout", "gymBeastModeTracks"),
    ("chill-sunday", "Chill Sunday", "calm", "wind down", "chillSundayTracks"),
]


def song_from_match(m: re.Match) -> dict:
    song = {
        "id": m.group(1),
        "title": m.group(2),
        "artist": m.group(3),
        "album": m.group(4),
        "genre": m.group(5),
        "playCount": int(m.group(6)),
        "energy": float(m.group(7)),
        "tempo": int(m.group(8)),
    }
    if m.lastindex and m.lastindex >= 9 and m.group(9):
        song["mood"] = m.group(9)
    return song


def parse_songs(text: str) -> list[dict]:
    return [song_from_match(m) for m in SONG_RE.finditer(text)]


def parse_create_tracks(text: str, var_name: str) -> list[dict]:
    block = re.search(rf"const {var_name}: Track\[\] = \[([\s\S]*?)\];", text)
    if not block:
        return []
    songs = []
    for m in CREATE_TRACK_RE.finditer(block.group(1)):
        songs.append(
            {
                "id": m.group(1),
                "title": m.group(2),
                "artist": m.group(3),
                "album": m.group(4),
                "genre": m.group(5),
                "playCount": int(m.group(6)),
                "energy": float(m.group(7)),
                "tempo": int(m.group(8)),
                "mood": m.group(9),
            }
        )
    return songs


def parse_trending(text: str) -> dict[str, list[dict]]:
    trending: dict[str, list[dict]] = {}
    body = text.split("TRENDING_BY_MOOD")[1].split("};")[0]
    for mood, chunk in re.findall(r"(\w+):\s*\[([\s\S]*?)\],?\s*(?=\w+:|$)", body):
        trending[mood] = parse_songs(chunk)
    return trending


def merge_to_count(primary: list[dict], filler: list[dict], count: int = 20) -> list[dict]:
    seen: set[str] = set()
    result: list[dict] = []
    for track in primary + filler:
        tid = track["id"]
        if tid in seen:
            continue
        seen.add(tid)
        result.append(track)
        if len(result) >= count:
            break
    return result


def main() -> None:
    hindi_text = (ROOT / "lib" / "hindi-catalog.ts").read_text(encoding="utf-8")
    trending_text = (ROOT / "lib" / "trending-catalog.ts").read_text(encoding="utf-8")
    mock_text = (ROOT / "lib" / "spotify-mock.ts").read_text(encoding="utf-8")
    preview_text = (ROOT / "lib" / "preview-urls.generated.ts").read_text(encoding="utf-8")

    hindi = parse_songs(hindi_text.split("HINDI_SONGS")[1])
    trending = parse_trending(trending_text)
    trending["hindi"] = hindi[:20]
    previews = dict(PREVIEW_RE.findall(preview_text))

    filler_pool: list[dict] = []
    for songs in trending.values():
        filler_pool.extend(songs)
    filler_pool.extend(hindi)

    playlists = []
    for pid, name, mood, context, var in PLAYLIST_DEFS:
        base = parse_create_tracks(mock_text, var)
        playlists.append(
            {
                "id": pid,
                "name": name,
                "mood": mood,
                "context": context,
                "tracks": merge_to_count(base, filler_pool, 20),
            }
        )

    playlists.append(
        {
            "id": "bollywood-hits",
            "name": "Bollywood Hits",
            "mood": "hindi",
            "context": "bollywood favorites",
            "tracks": hindi[:20],
        }
    )

    shareable = [
        {
            "id": "share-cousin-riya",
            "owner": "Riya S.",
            "relation": "Family",
            "name": "Cousin Riya's Bollywood Mix",
            "description": "Shared from her Spotify — updated weekly",
            "tracks": [{**s, "id": f"sh-ri-{s['id']}"} for s in hindi[:20]],
        },
        {
            "id": "share-emma-chill",
            "owner": "Emma L.",
            "relation": "Friend",
            "name": "Emma's Chill Vibes",
            "description": "Lo-fi and soft indie for study nights",
            "tracks": trending.get("chill", [])[:20],
        },
        {
            "id": "share-jake-party",
            "owner": "Jake P.",
            "relation": "Friend",
            "name": "Jake's Party Starters",
            "description": "High-energy tracks from weekend hangouts",
            "tracks": trending.get("hype", [])[:20],
        },
    ]

    payload = {"hindi": hindi, "trending": trending, "playlists": playlists, "shareable": shareable}
    (OUT / "catalog.json").write_text(json.dumps(payload, indent=2), encoding="utf-8")
    (OUT / "preview_urls.json").write_text(json.dumps(previews, indent=2), encoding="utf-8")
    print(f"Wrote catalog.json — {len(hindi)} hindi, {len(trending)} moods, {len(playlists)} playlists")
    print(f"Wrote preview_urls.json — {len(previews)} cached previews")


if __name__ == "__main__":
    main()
