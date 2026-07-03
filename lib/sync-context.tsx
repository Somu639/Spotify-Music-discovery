"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { getSyncedPlaylists } from "@/lib/spotify-mock";
import {
  mockSyncPlaylist,
  SHAREABLE_FF_PLAYLISTS,
  type ShareablePlaylist,
  type SyncStep,
} from "@/lib/sync-mock";
import type { SyncedPlaylist } from "@/types";

interface SyncContextValue {
  syncedPlaylists: SyncedPlaylist[];
  shareablePlaylists: ShareablePlaylist[];
  syncStep: SyncStep;
  syncingShareId: string | null;
  syncPlaylist: (share: ShareablePlaylist) => Promise<SyncedPlaylist | null>;
  getSyncedById: (id: string) => SyncedPlaylist | undefined;
}

const SyncContext = createContext<SyncContextValue | null>(null);

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [syncedPlaylists, setSyncedPlaylists] = useState<SyncedPlaylist[]>(() =>
    getSyncedPlaylists()
  );
  const [syncedShareIds, setSyncedShareIds] = useState<Set<string>>(
    () => new Set()
  );
  const [syncStep, setSyncStep] = useState<SyncStep>("idle");
  const [syncingShareId, setSyncingShareId] = useState<string | null>(null);

  const pendingShareablePlaylists = useMemo(
    () => SHAREABLE_FF_PLAYLISTS.filter((share) => !syncedShareIds.has(share.id)),
    [syncedShareIds]
  );

  const syncPlaylist = useCallback(async (share: ShareablePlaylist) => {
    if (syncStep !== "idle" && syncStep !== "complete") return null;
    if (syncedShareIds.has(share.id)) return null;

    setSyncingShareId(share.id);
    try {
      const playlist = await mockSyncPlaylist(share, setSyncStep);
      setSyncedShareIds((prev) => new Set(prev).add(share.id));
      setSyncedPlaylists((prev) => {
        const withoutDuplicate = prev.filter(
          (p) => !(p.owner === share.owner && p.name === share.name)
        );
        return [playlist, ...withoutDuplicate];
      });
      return playlist;
    } catch {
      setSyncStep("error");
      return null;
    } finally {
      setTimeout(() => {
        setSyncStep("idle");
        setSyncingShareId(null);
      }, 1500);
    }
  }, [syncStep, syncedShareIds]);

  const getSyncedById = useCallback(
    (id: string) => syncedPlaylists.find((p) => p.id === id),
    [syncedPlaylists]
  );

  const value = useMemo<SyncContextValue>(
    () => ({
      syncedPlaylists,
      shareablePlaylists: pendingShareablePlaylists,
      syncStep,
      syncingShareId,
      syncPlaylist,
      getSyncedById,
    }),
    [
      syncedPlaylists,
      pendingShareablePlaylists,
      syncStep,
      syncingShareId,
      syncPlaylist,
      getSyncedById,
    ]
  );

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}

export function useSync() {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error("useSync must be used within SyncProvider");
  return ctx;
}
