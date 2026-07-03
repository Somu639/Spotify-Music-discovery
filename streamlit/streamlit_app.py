"""
Spotify Music Discovery — Streamlit shell that embeds the full Next.js UI.

Set APP_URL in Streamlit secrets to your Vercel deployment, e.g.:
  APP_URL = "https://your-app.vercel.app"
"""
from __future__ import annotations

import os

import requests
import streamlit as st
import streamlit.components.v1 as components

DEFAULT_LOCAL_URL = "http://localhost:3000"
IFRAME_HEIGHT = 1000


def get_app_url() -> str:
    if "APP_URL" in st.secrets:
        return str(st.secrets["APP_URL"]).rstrip("/")
    env_url = os.environ.get("APP_URL") or os.environ.get("NEXT_PUBLIC_APP_URL")
    if env_url:
        return env_url.rstrip("/")
    return DEFAULT_LOCAL_URL


def embed_url(base: str) -> str:
    separator = "&" if "?" in base else "?"
    return f"{base}{separator}embed=1"


def url_reachable(url: str) -> bool:
    try:
        resp = requests.get(url, timeout=10)
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
  /* Full-bleed embed — hide Streamlit chrome that clips the top */
  header[data-testid="stHeader"],
  [data-testid="stToolbar"],
  [data-testid="stDecoration"],
  #MainMenu,
  footer {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
    min-height: 0 !important;
  }

  .stApp {
    background: #121212 !important;
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  .stAppViewContainer,
  .main,
  .block-container,
  [data-testid="stAppViewContainer"],
  section.main > div {
    padding: 0 !important;
    margin: 0 !important;
    max-width: 100% !important;
  }

  .block-container {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }

  /* iframe wrapper from st.components.v1.iframe */
  .stApp iframe {
    border: none !important;
    width: 100% !important;
    min-height: 100vh !important;
    display: block !important;
    background: #121212 !important;
  }

  div[data-testid="stVerticalBlock"] > div:has(iframe) {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }
</style>
""",
    unsafe_allow_html=True,
)

app_url = get_app_url()
target = embed_url(app_url)

if not url_reachable(app_url):
    st.error(f"Cannot reach the Next.js app at **{app_url}**")
    st.markdown(
        f"""
Deploy the Next.js app on [Vercel](https://vercel.com/new), then set Streamlit secret:

```toml
APP_URL = "https://YOUR-VERCEL-URL.vercel.app"
```

For local testing: run `npm run dev` and set `APP_URL = "{DEFAULT_LOCAL_URL}"`.
"""
    )
    st.stop()

components.iframe(target, height=IFRAME_HEIGHT, scrolling=False)
