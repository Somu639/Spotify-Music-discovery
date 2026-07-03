"use client";

import { useMemo } from "react";
import { searchTracks } from "@/lib/search-tracks";
import { TrackRow } from "@/components/ui/TrackRow";

interface SearchResultsProps {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  const results = useMemo(() => searchTracks(query), [query]);

  return (
    <section className="px-4 py-6 sm:px-8">
      <h1 className="text-2xl font-bold text-app-text sm:text-3xl">
        Search results
      </h1>
      <p className="mt-1 text-sm text-app-muted">
        {results.length} {results.length === 1 ? "song" : "songs"} for &ldquo;
        {query.trim()}&rdquo;
      </p>

      {results.length > 0 ? (
        <div className="mt-6 overflow-hidden rounded-lg border border-app-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-app-border text-xs uppercase tracking-wider text-app-subtle">
              <tr>
                <th className="w-12 px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">
                  Album
                </th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">
                  Genre
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((track, index) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={index}
                  queue={results}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-8 text-center text-sm text-app-muted">
          No songs found. Try another artist, title, or genre.
        </p>
      )}
    </section>
  );
}
