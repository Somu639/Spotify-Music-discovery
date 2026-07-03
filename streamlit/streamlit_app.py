"""
Spotify Music Discovery — Streamlit edition.
Deploy on Streamlit Community Cloud with main file: streamlit/streamlit_app.py
"""
from __future__ import annotations

import random
from pathlib import Path

import streamlit as st

from catalog import (
    get_hindi_tracks,
    get_playlist_by_id,
    get_playlists,
    get_shareable_playlists,
    get_trending_by_mood,
)
from preview import resolve_preview

st.set_page_config(
    page_title="Spotify Music Discovery",
    page_icon="🎵",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown(
    """
<style>
  .block-container { padding-top: 1.5rem; max-width: 1200px; }
  .stApp { background: #ffffff; color: #121212; }
  div[data-testid="stSidebar"] { background: #f6f6f6; }
  .hero {
    background: linear-gradient(135deg, #1ed760 0%, #1db954 45%, #169c46 100%);
    border-radius: 12px; padding: 2rem 2.2rem; color: #fff; margin-bottom: 1.5rem;
  }
  .hero h1 { margin: 0; font-size: 2rem; font-weight: 700; }
  .hero p { margin: 0.5rem 0 0; opacity: 0.95; }
  .track-card {
    border: 1px solid #e8e8e8; border-radius: 10px; padding: 0.75rem 1rem;
    margin-bottom: 0.5rem; background: #fafafa;
  }
  .track-title { font-weight: 600; color: #121212; }
  .track-meta { color: #666; font-size: 0.85rem; }
  .badge {
    display: inline-block; background: #e8f5e9; color: #1b5e20;
    border-radius: 999px; padding: 0.15rem 0.55rem; font-size: 0.75rem; margin-right: 0.35rem;
  }
</style>
""",
    unsafe_allow_html=True,
)

SECTIONS = [
    "Home",
    "Music Library",
    "Bollywood Hits",
    "Trending",
    "Sync Friends & Family",
]


def init_state() -> None:
    defaults = {
        "section": "Home",
        "queue": [],
        "queue_index": 0,
        "shuffle": False,
        "preview_cache": {},
        "synced_ids": set(),
        "now_playing": None,
    }
    for key, val in defaults.items():
        if key not in st.session_state:
            st.session_state[key] = val


def play_track(track: dict, queue: list[dict] | None = None) -> None:
    st.session_state.now_playing = track
    if queue is not None:
        st.session_state.queue = queue
        st.session_state.queue_index = next(
            (i for i, t in enumerate(queue) if t["id"] == track["id"]), 0
        )


def render_player(track: dict) -> None:
    cache: dict[str, str] = st.session_state.preview_cache
    with st.spinner(f"Loading preview for {track['title']}…"):
        url = resolve_preview(track, cache)

    if url:
        st.audio(url, format="audio/mp4")
    else:
        st.warning("No 30s preview found for this track on iTunes/Deezer.")


def render_track_row(track: dict, index: int, queue: list[dict]) -> None:
    cols = st.columns([0.5, 5, 2, 1.2])
    with cols[0]:
        st.caption(str(index))
    with cols[1]:
        st.markdown(
            f'<div class="track-title">{track["title"]}</div>'
            f'<div class="track-meta">{track["artist"]} · {track.get("album", "")}</div>',
            unsafe_allow_html=True,
        )
    with cols[2]:
        st.caption(track.get("genre", ""))
    with cols[3]:
        if st.button("▶", key=f"play-{track['id']}-{index}", help="Play"):
            play_track(track, queue)
            st.rerun()


def render_playlist(playlist: dict) -> None:
    tracks = playlist.get("tracks") or []
    st.subheader(playlist["name"])
    st.caption(f"{len(tracks)} tracks · {playlist.get('context', '')}")

    c1, c2 = st.columns(2)
    with c1:
        if st.button("▶ Play", key=f"play-all-{playlist['id']}", type="primary"):
            if tracks:
                play_track(tracks[0], tracks)
                st.rerun()
    with c2:
        if st.button("🔀 Shuffle", key=f"shuffle-{playlist['id']}"):
            shuffled = tracks.copy()
            random.shuffle(shuffled)
            if shuffled:
                play_track(shuffled[0], shuffled)
                st.rerun()

    if st.session_state.now_playing and any(
        t["id"] == st.session_state.now_playing["id"] for t in tracks
    ):
        st.markdown("**Now playing**")
        render_player(st.session_state.now_playing)

    st.divider()
    for i, track in enumerate(tracks, start=1):
        render_track_row(track, i, tracks)


def page_home() -> None:
    st.markdown(
        """
<div class="hero">
  <h1>Spotify Music Discovery</h1>
  <p>Browse playlists, trending moods, Bollywood hits, and sync friends & family — with real 30s previews.</p>
</div>
""",
        unsafe_allow_html=True,
    )

    col1, col2, col3 = st.columns(3)
    col1.metric("Playlists", len(get_playlists()))
    col2.metric("Trending moods", len(get_trending_by_mood()))
    col3.metric("Bollywood tracks", len(get_hindi_tracks()))

    st.markdown("### Quick picks")
    for pl in get_playlists()[:3]:
        with st.expander(f"🎧 {pl['name']} ({len(pl['tracks'])} tracks)"):
            render_playlist(pl)


def page_music_library() -> None:
    st.title("Music Library")
    playlists = get_playlists()
    names = {p["name"]: p["id"] for p in playlists}
    choice = st.selectbox("Choose a playlist", list(names.keys()))
    playlist = get_playlist_by_id(names[choice])
    if playlist:
        render_playlist(playlist)


def page_bollywood() -> None:
    st.title("Bollywood Hits")
    playlist = get_playlist_by_id("bollywood-hits") or {
        "id": "bollywood-hits",
        "name": "Bollywood Hits",
        "context": "bollywood favorites",
        "tracks": get_hindi_tracks()[:20],
    }
    render_playlist(playlist)


def page_trending() -> None:
    st.title("Trending")
    moods = get_trending_by_mood()
    view = st.radio("View", ["By Mood", "All moods"], horizontal=True)

    if view == "By Mood":
        mood = st.selectbox("Mood", list(moods.keys()))
        tracks = [{**t, "mood": t.get("mood", mood)} for t in moods[mood]]
        st.subheader(mood.capitalize())
        st.caption(f"{len(tracks)} tracks")
        if st.session_state.now_playing:
            st.markdown("**Now playing**")
            render_player(st.session_state.now_playing)
        st.divider()
        for i, track in enumerate(tracks, start=1):
            render_track_row(track, i, tracks)
    else:
        for mood, tracks in moods.items():
            st.markdown(f"#### {mood.capitalize()}")
            st.caption(f"{len(tracks)} tracks")
            cols = st.columns(min(4, len(tracks)))
            for i, track in enumerate(tracks[:4]):
                with cols[i]:
                    if st.button(track["title"][:22], key=f"t-{mood}-{track['id']}"):
                        play_track(track, tracks)
                        st.rerun()
            st.divider()


def page_sync() -> None:
    st.title("Sync Friends & Family")
    st.caption("Pick a shared playlist to import into your library (mock sync).")

    synced: set[str] = st.session_state.synced_ids
    pending = [s for s in get_shareable_playlists() if s["id"] not in synced]

    if not pending and synced:
        st.success("All shared playlists synced this session. Refresh the page to see them again.")
    elif not pending:
        st.info("No pending shares.")

    for share in pending:
        with st.container():
            st.markdown(f"### {share['name']}")
            st.caption(f"From **{share['owner']}** ({share['relation']}) · {share['description']}")
            st.caption(f"{len(share['tracks'])} tracks")
            if st.button(f"Sync “{share['name']}”", key=f"sync-{share['id']}", type="primary"):
                bar = st.progress(0, text="Connecting to their Spotify…")
                bar.progress(33, text="Fetching playlist tracks…")
                bar.progress(66, text="Importing to your library…")
                bar.progress(100, text="Sync complete!")
                synced.add(share["id"])
                st.session_state.synced_ids = synced
                st.success(f"Synced {share['name']} — {len(share['tracks'])} tracks added.")
                st.rerun()
            st.divider()

    if synced:
        st.markdown("### Synced this session")
        for share in get_shareable_playlists():
            if share["id"] in synced:
                with st.expander(f"✅ {share['name']} — {share['owner']}"):
                    render_playlist(
                        {
                            "id": share["id"],
                            "name": share["name"],
                            "context": share.get("description", ""),
                            "tracks": share["tracks"],
                        }
                    )


def main() -> None:
    init_state()

    with st.sidebar:
        st.markdown("## 🎵 Spotify Music Discovery")
        st.caption("Streamlit deployment")
        section = st.radio("Navigate", SECTIONS, index=SECTIONS.index(st.session_state.section))
        st.session_state.section = section

        if st.session_state.now_playing:
            st.divider()
            np = st.session_state.now_playing
            st.markdown(f"**Now playing**  \n{np['title']}  \n_{np['artist']}_")

        st.divider()
        st.caption(
            "Previews via iTunes & Deezer. "
            "Regenerate catalog: `python streamlit/generate_data.py`"
        )

    pages = {
        "Home": page_home,
        "Music Library": page_music_library,
        "Bollywood Hits": page_bollywood,
        "Trending": page_trending,
        "Sync Friends & Family": page_sync,
    }
    pages[st.session_state.section]()


if __name__ == "__main__":
    main()
