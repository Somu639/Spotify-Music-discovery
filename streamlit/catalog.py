from __future__ import annotations

from functools import lru_cache

from preview import _load_catalog


@lru_cache(maxsize=1)
def get_playlists() -> list[dict]:
    return _load_catalog()["playlists"]


@lru_cache(maxsize=1)
def get_trending_by_mood() -> dict[str, list[dict]]:
    return _load_catalog()["trending"]


@lru_cache(maxsize=1)
def get_hindi_tracks() -> list[dict]:
    return _load_catalog()["hindi"]


@lru_cache(maxsize=1)
def get_shareable_playlists() -> list[dict]:
    return _load_catalog()["shareable"]


def get_playlist_by_id(playlist_id: str) -> dict | None:
    return next((p for p in get_playlists() if p["id"] == playlist_id), None)


def all_trending_tracks() -> list[dict]:
    tracks: list[dict] = []
    seen: set[str] = set()
    for mood, items in get_trending_by_mood().items():
        for track in items:
            if track["id"] in seen:
                continue
            seen.add(track["id"])
            enriched = {**track, "mood": track.get("mood", mood)}
            tracks.append(enriched)
    return tracks
