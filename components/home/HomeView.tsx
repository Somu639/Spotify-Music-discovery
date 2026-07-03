"use client";

import { useEffect, useState } from "react";
import {
  getFeaturedArtist,
  getGoodEveningMixes,
  getMadeForYouMixes,
  getRecentlyPlayed,
} from "@/lib/spotify-mock";
import { FeaturedArtistHero } from "./FeaturedArtistHero";
import { QuickAccessTile } from "./QuickAccessTile";
import { MadeForYouCard } from "./MadeForYouCard";
import { RecentlyPlayedCard } from "./RecentlyPlayedCard";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function HomeView() {
  const [greeting, setGreeting] = useState("Good evening");

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);
  const artist = getFeaturedArtist();
  const eveningMixes = getGoodEveningMixes();
  const madeForYou = getMadeForYouMixes();
  const recentlyPlayed = getRecentlyPlayed();

  return (
    <div className="pb-10">
      <FeaturedArtistHero artist={artist} />

      <section className="mt-8 px-4 sm:px-8">
        <h2 className="mb-4 text-2xl font-bold text-app-text">{greeting}</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {eveningMixes.map((mix) => (
            <QuickAccessTile key={mix.id} mix={mix} />
          ))}
        </div>
      </section>

      <section className="mt-10 px-4 sm:px-8">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-app-text hover:underline">
            Made For Alex
          </h2>
          <button
            type="button"
            className="text-xs font-bold uppercase tracking-wider text-app-muted hover:text-app-text hover:underline"
          >
            Show all
          </button>
        </div>
        <div className="-mx-1 flex gap-4 overflow-x-auto pb-2 spotify-scroll">
          {madeForYou.map((mix) => (
            <MadeForYouCard key={mix.id} mix={mix} />
          ))}
        </div>
      </section>

      <section className="mt-10 px-4 sm:px-8">
        <h2 className="mb-4 text-2xl font-bold text-app-text hover:underline">
          Recently played
        </h2>
        <div className="-mx-1 flex gap-3 overflow-x-auto pb-2 spotify-scroll">
          {recentlyPlayed.map((item) => (
            <RecentlyPlayedCard
              key={item.id}
              item={item}
              queue={recentlyPlayed}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
