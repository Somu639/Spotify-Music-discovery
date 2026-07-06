"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getAllPlaylists as getBuiltinPlaylists } from "@/lib/spotify-mock";
import { isPageReload } from "@/lib/page-reload";
import type { Playlist, Track } from "@/types";

const STORAGE_KEY = "spotify-user-playlists";

function loadUserPlaylists(): Playlist[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Playlist[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUserPlaylists(playlists: Playlist[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
}

interface PlaylistsContextValue {
  userPlaylists: Playlist[];
  allPlaylists: Playlist[];
  createPlaylist: (name: string) => Playlist;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  getPlaylistById: (id: string) => Playlist | undefined;
  isUserPlaylist: (id: string) => boolean;
  resetUserPlaylists: () => void;
}

const PlaylistsContext = createContext<PlaylistsContextValue | null>(null);

export function PlaylistsProvider({ children }: { children: React.ReactNode }) {
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>(() =>
    isPageReload() ? [] : loadUserPlaylists()
  );

  useEffect(() => {
    saveUserPlaylists(userPlaylists);
  }, [userPlaylists]);

  const createPlaylist = useCallback((name: string) => {
    const trimmed = name.trim() || "My Playlist";
    const playlist: Playlist = {
      id: `user-${Date.now()}`,
      name: trimmed,
      tracks: [],
      mood: "custom",
      context: "your playlist",
    };
    setUserPlaylists((prev) => {
      const next = [playlist, ...prev];
      saveUserPlaylists(next);
      return next;
    });
    return playlist;
  }, []);

  const addTrackToPlaylist = useCallback((playlistId: string, track: Track) => {
    setUserPlaylists((prev) => {
      const next = prev.map((playlist) => {
        if (playlist.id !== playlistId) return playlist;
        if (playlist.tracks.some((t) => t.id === track.id)) return playlist;
        return { ...playlist, tracks: [...playlist.tracks, track] };
      });
      saveUserPlaylists(next);
      return next;
    });
  }, []);

  const getPlaylistById = useCallback(
    (id: string) => {
      const user = userPlaylists.find((p) => p.id === id);
      if (user) return user;
      return getBuiltinPlaylists().find((p) => p.id === id);
    },
    [userPlaylists]
  );

  const isUserPlaylist = useCallback(
    (id: string) => userPlaylists.some((p) => p.id === id),
    [userPlaylists]
  );

  const resetUserPlaylists = useCallback(() => {
    setUserPlaylists([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const allPlaylists = useMemo(
    () => [...userPlaylists, ...getBuiltinPlaylists()],
    [userPlaylists]
  );

  const value = useMemo<PlaylistsContextValue>(
    () => ({
      userPlaylists,
      allPlaylists,
      createPlaylist,
      addTrackToPlaylist,
      getPlaylistById,
      isUserPlaylist,
      resetUserPlaylists,
    }),
    [userPlaylists, allPlaylists, createPlaylist, addTrackToPlaylist, getPlaylistById, isUserPlaylist, resetUserPlaylists]
  );

  return (
    <PlaylistsContext.Provider value={value}>{children}</PlaylistsContext.Provider>
  );
}

export function usePlaylists() {
  const ctx = useContext(PlaylistsContext);
  if (!ctx) throw new Error("usePlaylists must be used within PlaylistsProvider");
  return ctx;
}
