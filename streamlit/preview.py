from __future__ import annotations

import json
import re
import unicodedata
from functools import lru_cache
from pathlib import Path
from urllib.parse import quote

import requests

DATA_DIR = Path(__file__).resolve().parent / "data"


@lru_cache(maxsize=1)
def _load_previews() -> dict[str, str]:
    path = DATA_DIR / "preview_urls.json"
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


@lru_cache(maxsize=1)
def _load_catalog() -> dict:
    path = DATA_DIR / "catalog.json"
    if not path.exists():
        raise FileNotFoundError(
            "Missing streamlit/data/catalog.json — run: python streamlit/generate_data.py"
        )
    return json.loads(path.read_text(encoding="utf-8"))


def get_cached_preview(track_id: str) -> str | None:
    return _load_previews().get(track_id)


def _normalize(value: str) -> str:
    value = unicodedata.normalize("NFD", value)
    value = "".join(c for c in value if unicodedata.category(c) != "Mn")
    value = re.sub(r"[^a-z0-9\s]", " ", value.lower())
    return re.sub(r"\s+", " ", value).strip()


def _score_itunes(result: dict, title: str, artist: str) -> int:
    track_norm = _normalize(result.get("trackName", ""))
    artist_norm = _normalize(result.get("artistName", ""))
    title_norm = _normalize(title)
    artist_query = _normalize(re.split(r" ft\.| feat\.| & ", artist, maxsplit=1)[0])

    score = 0
    if track_norm == title_norm:
        score += 50
    elif track_norm in title_norm or title_norm in track_norm:
        score += 30

    if artist_query in artist_norm or artist_norm in artist_query:
        score += 40
    else:
        score += sum(8 for token in artist_query.split() if token in artist_norm)

    if result.get("previewUrl"):
        score += 5
    return score


def lookup_itunes_preview(artist: str, title: str) -> str | None:
    term = quote(f"{artist} {title}")
    url = f"https://itunes.apple.com/search?term={term}&entity=song&limit=8"
    try:
        resp = requests.get(url, timeout=10, headers={"Accept": "application/json"})
        resp.raise_for_status()
        results = resp.json().get("results") or []
    except requests.RequestException:
        return None

    ranked = sorted(
        [r for r in results if r.get("previewUrl")],
        key=lambda r: _score_itunes(r, title, artist),
        reverse=True,
    )
    return ranked[0]["previewUrl"] if ranked else None


def lookup_deezer_preview(artist: str, title: str) -> str | None:
    query = quote(f'artist:"{artist}" track:"{title}"')
    url = f"https://api.deezer.com/search/track?q={query}&limit=5"
    try:
        resp = requests.get(url, timeout=10, headers={"Accept": "application/json"})
        resp.raise_for_status()
        tracks = resp.json().get("data") or []
    except requests.RequestException:
        return None

    title_norm = _normalize(title)
    artist_norm = _normalize(re.split(r" ft\.| feat\.| & ", artist, maxsplit=1)[0])

    def score(track: dict) -> int:
        s = 0
        if _normalize(track.get("title", "")) == title_norm:
            s += 40
        if artist_norm in _normalize(track.get("artist", {}).get("name", "")):
            s += 30
        return s

    ranked = sorted([t for t in tracks if t.get("preview")], key=score, reverse=True)
    return ranked[0]["preview"] if ranked else None


def resolve_preview(track: dict, cache: dict[str, str]) -> str | None:
    track_id = track["id"]
    if track_id in cache:
        return cache[track_id]

    cached = get_cached_preview(track_id)
    if cached:
        cache[track_id] = cached
        return cached

    url = lookup_itunes_preview(track["artist"], track["title"])
    if not url:
        url = lookup_deezer_preview(track["artist"], track["title"])
    if url:
        cache[track_id] = url
    return url
