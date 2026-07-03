"""
Spotify Music Discovery — Streamlit shell that embeds the full Next.js UI.

Streamlit Community Cloud cannot run Next.js directly. This app loads the same
React frontend you see locally (npm run dev) inside a full-page iframe.

Set APP_URL in Streamlit secrets to your Vercel deployment, e.g.:
  APP_URL = "https://your-app.vercel.app"

For local testing with Streamlit:
  APP_URL = "http://localhost:3000"
"""
from __future__ import annotations

import os

import requests
import streamlit as st
import streamlit.components.v1 as components

DEFAULT_LOCAL_URL = "http://localhost:3000"


def get_app_url() -> str:
    if "APP_URL" in st.secrets:
        return str(st.secrets["APP_URL"]).rstrip("/")
    env_url = os.environ.get("APP_URL") or os.environ.get("NEXT_PUBLIC_APP_URL")
    if env_url:
        return env_url.rstrip("/")
    return DEFAULT_LOCAL_URL


def url_reachable(url: str) -> bool:
    try:
        resp = requests.get(url, timeout=5)
        return resp.status_code < 500
    except requests.RequestException:
        return False


st.set_page_config(
    page_title="Spotify Music Discovery",
    page_icon="🎵",
    layout="wide",
    initial_sidebar_state="collapsed",
)

st.markdown(
    """
<style>
  .stApp { background: #121212 !important; }
  .block-container { padding: 0 !important; max-width: 100% !important; }
  header[data-testid="stHeader"] { background: #121212; }
  iframe { border: none; width: 100%; min-height: 92vh; background: #121212; }
</style>
""",
    unsafe_allow_html=True,
)

app_url = get_app_url()

if not url_reachable(app_url):
    st.error(f"Cannot reach the Next.js app at **{app_url}**")
    st.markdown(
        f"""
The full Spotify Music Discovery UI runs on **Next.js**, not Streamlit.

### Run locally (same UI as always)
```bash
cd spotify-ai-discovery
npm install
npm run dev
```
Then open [{DEFAULT_LOCAL_URL}]({DEFAULT_LOCAL_URL}) — that is the real frontend.

### Streamlit + local Next.js together
1. Terminal 1: `npm run dev` (port 3000)
2. Terminal 2: `streamlit run streamlit/streamlit_app.py` (port 8501)
3. Set `APP_URL = "{DEFAULT_LOCAL_URL}"` in `.streamlit/secrets.toml`

### Deploy the same UI to the web
1. Import [Spotify-Music-discovery](https://github.com/Somu639/Spotify-Music-discovery) on [Vercel](https://vercel.com/new)
2. Add `ANTHROPIC_API_KEY` in Vercel project settings
3. Set Streamlit secret `APP_URL` to your Vercel URL (e.g. `https://spotify-music-discovery.vercel.app`)

Current configured URL: `{app_url}`
"""
    )
    st.stop()

components.iframe(app_url, height=920, scrolling=True)
