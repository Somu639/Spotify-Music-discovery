"use client";

import { Check, Loader2, RefreshCw, Users } from "lucide-react";
import { SYNC_STEP_LABELS, type ShareablePlaylist, type SyncStep } from "@/lib/sync-mock";
import { useSync } from "@/lib/sync-context";

interface SyncPlaylistFlowProps {
  onSynced?: (playlistId: string) => void;
}

export function SyncPlaylistFlow({ onSynced }: SyncPlaylistFlowProps) {
  const { shareablePlaylists, syncStep, syncingShareId, syncPlaylist } =
    useSync();

  const isBusy =
    syncStep !== "idle" && syncStep !== "complete" && syncStep !== "error";

  const handleSync = async (share: ShareablePlaylist) => {
    const playlist = await syncPlaylist(share);
    if (playlist) onSynced?.(playlist.id);
  };

  return (
    <div className="mt-6 rounded-xl border border-app-border bg-app-panel p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <Users className="h-5 w-5 text-[#1DB954]" />
        <h3 className="text-lg font-bold text-app-text">Sync a new playlist</h3>
      </div>
      <p className="text-sm text-app-muted">
        Friends and family can share playlists with you on Spotify. Pick one below
        to mock the sync — it copies their tracks into your Sync F&F library.
      </p>

      {syncStep !== "idle" && syncStep !== "error" && (
        <SyncProgress step={syncStep} />
      )}

      <ol className="mt-4 space-y-2 text-xs text-app-subtle sm:text-sm">
        <li>
          <span className="font-semibold text-app-text">1.</span> Open{" "}
          <strong>Sync F&F</strong> (sidebar or top tab)
        </li>
        <li>
          <span className="font-semibold text-app-text">2.</span> Choose a shared
          playlist below and click <strong>Sync</strong>
        </li>
        <li>
          <span className="font-semibold text-app-text">3.</span> Wait for import
          — the playlist appears in your sidebar under Synced F&F
        </li>
        <li>
          <span className="font-semibold text-app-text">4.</span> Play or shuffle
          like any other playlist
        </li>
      </ol>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shareablePlaylists.length === 0 ? (
          <p className="col-span-full rounded-lg border border-dashed border-app-border bg-app-shell px-4 py-6 text-center text-sm text-app-muted">
            All shared playlists are synced to your library. Refresh the app to
            reset this demo.
          </p>
        ) : (
          shareablePlaylists.map((share) => {
            const syncing = syncingShareId === share.id && isBusy;
            const done = syncingShareId === share.id && syncStep === "complete";

            return (
              <div
                key={share.id}
                className="flex flex-col rounded-lg border border-app-border bg-app-shell p-3"
              >
                <img
                  src={`https://picsum.photos/seed/${share.coverSeed}/120/120`}
                  alt=""
                  className="mb-3 h-16 w-16 rounded-md object-cover shadow-sm"
                />
                <p className="font-bold text-app-text">{share.name}</p>
                <p className="text-xs text-app-muted">
                  {share.owner} · {share.relation}
                </p>
                <p className="mt-1 line-clamp-2 flex-1 text-xs text-app-subtle">
                  {share.description}
                </p>
                <p className="mt-2 text-[11px] text-app-subtle">
                  {share.tracks.length} tracks
                </p>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => handleSync(share)}
                  className="mt-3 flex items-center justify-center gap-2 rounded-full bg-[#1DB954] px-4 py-2 text-sm font-bold text-black transition hover:scale-[1.02] hover:bg-[#1ed760] disabled:opacity-50"
                >
                  {syncing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Syncing…
                    </>
                  ) : done ? (
                    <>
                      <Check className="h-4 w-4" />
                      Synced!
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Sync playlist
                    </>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function SyncProgress({ step }: { step: SyncStep }) {
  const steps: SyncStep[] = ["connecting", "fetching", "importing", "complete"];
  const currentIdx = steps.indexOf(step);

  return (
    <div
      className="mt-4 rounded-lg border border-[#1DB954]/30 bg-[#1DB954]/10 px-4 py-3"
      role="status"
      aria-live="polite"
    >
      <p className="text-sm font-semibold text-[#1a7f37]">
        {step === "complete"
          ? SYNC_STEP_LABELS.complete
          : SYNC_STEP_LABELS[step as keyof typeof SYNC_STEP_LABELS]}
      </p>
      <div className="mt-2 flex gap-2">
        {steps.slice(0, -1).map((s, i) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full ${
              i <= currentIdx ? "bg-[#1DB954]" : "bg-app-elevated"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
