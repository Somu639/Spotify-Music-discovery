"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface CreatePlaylistModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export function CreatePlaylistModal({
  open,
  onClose,
  onCreate,
}: CreatePlaylistModalProps) {
  const [name, setName] = useState("");
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setName("");
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  if (!open || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(name.trim() || "My Playlist");
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-playlist-title"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-[#282828] p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="create-playlist-title" className="text-xl font-bold text-white">
            Create playlist
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-app-muted hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <label className="block text-sm font-semibold text-white" htmlFor="playlist-name">
          Name
        </label>
        <input
          ref={inputRef}
          id="playlist-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Playlist"
          maxLength={80}
          className="mt-2 w-full rounded-md border border-white/10 bg-[#3e3e3e] px-3 py-2.5 text-sm text-white placeholder:text-app-muted outline-none focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954]"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2 text-sm font-bold text-white hover:underline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full bg-white px-6 py-2 text-sm font-bold text-black transition hover:scale-105"
          >
            Create
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
}
