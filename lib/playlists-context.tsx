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
import type { Playlist, Track } from "@/types";

const LEGACY_STORAGE_KEY = "spotify-user-playlists";

interface PlaylistsContextValue {
  userPlaylists: Playlist[];
  allPlaylists: Playlist[];
  createPlaylist: (name: string) => Playlist;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  getPlaylistById: (id: string) => Playlist | undefined;
  isUserPlaylist: (id: string) => boolean;
}

const PlaylistsContext = createContext<PlaylistsContextValue | null>(null);

export function PlaylistsProvider({ children }: { children: React.ReactNode }) {
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  }, []);

  const createPlaylist = useCallback((name: string) => {
    const trimmed = name.trim() || "My Playlist";
    const playlist: Playlist = {
      id: `user-${Date.now()}`,
      name: trimmed,
      tracks: [],
      mood: "custom",
      context: "your playlist",
    };
    setUserPlaylists((prev) => [playlist, ...prev]);
    return playlist;
  }, []);

  const addTrackToPlaylist = useCallback((playlistId: string, track: Track) => {
    setUserPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id !== playlistId) return playlist;
        if (playlist.tracks.some((t) => t.id === track.id)) return playlist;
        return { ...playlist, tracks: [...playlist.tracks, track] };
      })
    );
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
    }),
    [userPlaylists, allPlaylists, createPlaylist, addTrackToPlaylist, getPlaylistById, isUserPlaylist]
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

export function isSessionPlaylistId(id: string | null): boolean {
  return Boolean(id?.startsWith("user-"));
}
