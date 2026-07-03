import type {
  FeaturedArtist,
  HomeMix,
  Playlist,
  Podcast,
  RecentlyPlayedItem,
  SyncedPlaylist,
  Track,
  TrendingGroup,
  TrendingItem,
} from "@/types";
import { getPreviewUrlForId } from "@/lib/audio-previews";
import {
  getTrendingCatalogTracks,
  TRENDING_MOOD_MIN_TRACKS,
} from "@/lib/trending-catalog";
import { getHindiTracks, mergeTracksToCount } from "@/lib/hindi-catalog";

function createTrack(
  id: string,
  title: string,
  artist: string,
  album: string,
  genre: string,
  playCount: number,
  energy: number,
  tempo: number,
  mood: string
): Track {
  return {
    id,
    title,
    artist,
    album,
    coverUrl: `https://picsum.photos/seed/${id}/80/80`,
    previewUrl: getPreviewUrlForId(id),
    genre,
    playCount,
    energy,
    tempo,
    mood,
  };
}

const morningEnergyTracks: Track[] = [
  createTrack("me-1", "Rise & Grind", "Solar State", "Daybreak", "Pop", 4200, 0.91, 128, "motivational"),
  createTrack("me-2", "First Light", "Apex Run", "Momentum", "Electronic", 3900, 0.88, 132, "energetic"),
  createTrack("me-3", "No Snooze", "Kira Bloom", "Alarm Clock", "Dance Pop", 3600, 0.85, 124, "uplifting"),
  createTrack("me-4", "Coffee Rush", "The Early Birds", "Sunrise Sessions", "Indie Pop", 620, 0.79, 118, "bright"),
  createTrack("me-5", "Window Seat", "Metro Glow", "Commute", "Synth Pop", 480, 0.82, 120, "focused"),
  createTrack("me-6", "Stretch Marks", "Flex Theory", "Warm Up", "Funk", 350, 0.76, 116, "groovy"),
  createTrack("me-7", "Open Road", "Highway Kids", "Miles Ahead", "Rock", 290, 0.84, 140, "driving"),
  createTrack("me-8", "Pulse Start", "DJ Meridian", "Morning Shift", "House", 210, 0.9, 126, "hype"),
];

const lateNightCodingTracks: Track[] = [
  createTrack("ln-1", "Midnight Terminal", "Null Pointer", "Compile Dreams", "Lo-Fi", 2100, 0.32, 78, "focused"),
  createTrack("ln-2", "Soft Keys", "Desk Lamp", "After Hours", "Lo-Fi Hip Hop", 1850, 0.28, 72, "calm"),
  createTrack("ln-3", "Rain on Glass", "Pixel Drift", "Window View", "Ambient", 1620, 0.24, 68, "introspective"),
  createTrack("ln-4", "Syntax Highlight", "Code Cave", "Refactor", "Chillhop", 980, 0.35, 82, "steady"),
  createTrack("ln-5", "404 Lullaby", "Sleep Stack", "Debug Mode", "Lo-Fi", 870, 0.3, 76, "quiet"),
  createTrack("ln-6", "Neon Cursor", "Night Shift", "Pull Request", "Downtempo", 740, 0.38, 85, "flow"),
  createTrack("ln-7", "Low Light", "Analog Heart", "Dim Room", "Ambient", 610, 0.22, 70, "minimal"),
  createTrack("ln-8", "Stack Trace", "Binary Bloom", "Late Commit", "Lo-Fi", 520, 0.33, 80, "contemplative"),
];

const weekendVibesTracks: Track[] = [
  createTrack("wv-1", "Golden Hour", "The Coastlines", "Summer Ends", "Indie Pop", 2800, 0.58, 104, "relaxed"),
  createTrack("wv-2", "Porch Swing", "Willow Lane", "Lazy Days", "Indie Folk", 2400, 0.52, 98, "easygoing"),
  createTrack("wv-3", "Barefoot Walk", "Sand & Salt", "Coastal", "Indie Pop", 1950, 0.55, 110, "warm"),
  createTrack("wv-4", "Farmers Market", "Sunday Cart", "Local Love", "Indie Pop", 1320, 0.48, 102, "cheerful"),
  createTrack("wv-5", "Open Windows", "Breeze Theory", "Airflow", "Dream Pop", 1180, 0.5, 96, "breezy"),
  createTrack("wv-6", "Picnic Blanket", "Honey Sun", "Soft Light", "Indie Pop", 890, 0.46, 108, "content"),
  createTrack("wv-7", "Bike Ride", "Pedal Push", "Side Streets", "Indie Rock", 760, 0.6, 115, "light"),
  createTrack("wv-8", "Sunset Soda", "Fizz Club", "Evening Glow", "Indie Pop", 640, 0.53, 100, "nostalgic"),
];

const gymBeastModeTracks: Track[] = [
  createTrack("gb-1", "Beast Mode", "Iron Pulse", "PR Season", "Hip-Hop", 4500, 0.96, 150, "aggressive"),
  createTrack("gb-2", "Rep Counter", "Gains Gang", "Heavy Set", "Trap", 4100, 0.94, 145, "intense"),
  createTrack("gb-3", "Drop the Weight", "Bass Legion", "Max Volume", "EDM", 3800, 0.98, 160, "explosive"),
  createTrack("gb-4", "Sweat Equity", "Flex Zone", "No Days Off", "Hip-Hop", 920, 0.88, 138, "driven"),
  createTrack("gb-5", "Pre-Workout", "Adrenaline Lab", "Lift Off", "EDM", 680, 0.92, 155, "hyped"),
  createTrack("gb-6", "Plate Stack", "Gym Rats", "Volume Day", "Hip-Hop", 540, 0.9, 142, "powerful"),
  createTrack("gb-7", "Final Set", "PR Hunters", "Last Rep", "Trap", 430, 0.93, 148, "relentless"),
  createTrack("gb-8", "Cooldown Skip", "No Rest", "All Gas", "EDM", 310, 0.87, 152, "unstoppable"),
];

const chillSundayTracks: Track[] = [
  createTrack("cs-1", "Soft Rain", "Luna Vale", "Quiet Hours", "Ambient", 1900, 0.28, 72, "peaceful"),
  createTrack("cs-2", "Acoustic Morning", "Timber & Twine", "Unplugged", "Acoustic", 1650, 0.22, 68, "gentle"),
  createTrack("cs-3", "Low Tide", "Harbor Ghost", "Drift", "Dream Pop", 1420, 0.35, 80, "melancholic"),
  createTrack("cs-4", "Tea Steam", "Kitchen Radio", "Slow Brew", "Acoustic", 1100, 0.25, 64, "cozy"),
  createTrack("cs-5", "Cloud Reading", "Sky Pillow", "Daydream", "Ambient", 980, 0.18, 60, "serene"),
  createTrack("cs-6", "Wool Blanket", "Fireside", "Indoor Weather", "Acoustic Folk", 820, 0.2, 66, "warm"),
  createTrack("cs-7", "Page Turner", "Quiet Library", "Soft Covers", "Ambient", 690, 0.3, 74, "reflective"),
  createTrack("cs-8", "Window Drizzle", "Grey Afternoon", "Still Life", "Ambient", 550, 0.24, 70, "calm"),
];

const hindiTracks = getHindiTracks();
const catalogPool = getTrendingCatalogTracks();

function padPlaylist(base: Track[], count = 20): Track[] {
  return mergeTracksToCount(base, [...hindiTracks, ...catalogPool], count);
}

const bollywoodHitsTracks = hindiTracks.slice(0, 20);

const syncedFriendsFamilyPlaylists: SyncedPlaylist[] = [
  {
    id: "sync-mom-classics",
    name: "Mom's Sunday Classics",
    owner: "Priya M.",
    relation: "Family",
    syncedAt: "2 min ago",
    coverUrl: "https://picsum.photos/seed/mom-classics/300/300",
    tracks: padPlaylist([
      createTrack("mc-1", "Here Comes the Sun", "The Beatles", "Abbey Road", "Classic Rock", 890, 0.55, 102, "warm"),
      createTrack("mc-2", "What a Wonderful World", "Louis Armstrong", "Greatest Hits", "Jazz", 720, 0.42, 88, "nostalgic"),
      createTrack("mc-3", "Lean on Me", "Bill Withers", "Still Bill", "Soul", 650, 0.48, 95, "uplifting"),
      createTrack("mc-4", "Stand By Me", "Ben E. King", "Don't Play That Song", "Soul", 580, 0.5, 98, "timeless"),
    ]),
    mood: "nostalgic",
    context: "family gatherings",
  },
  {
    id: "sync-dad-roadtrip",
    name: "Dad's Road Trip Mix",
    owner: "James R.",
    relation: "Family",
    syncedAt: "5 min ago",
    coverUrl: "https://picsum.photos/seed/dad-roadtrip/300/300",
    tracks: padPlaylist([
      createTrack("dr-1", "Born to Run", "Bruce Springsteen", "Born to Run", "Rock", 1100, 0.82, 147, "driving"),
      createTrack("dr-2", "Hotel California", "Eagles", "Hotel California", "Rock", 980, 0.65, 75, "classic"),
      createTrack("dr-3", "Sweet Child O' Mine", "Guns N' Roses", "Appetite", "Rock", 870, 0.78, 125, "anthemic"),
      createTrack("dr-4", "Life is a Highway", "Tom Cochrane", "Mad Mad World", "Rock", 760, 0.8, 130, "road"),
    ]),
    mood: "driving",
    context: "road trips",
  },
  {
    id: "sync-sarah-indie",
    name: "Sarah's Indie Finds",
    owner: "Sarah K.",
    relation: "Friend",
    syncedAt: "12 min ago",
    coverUrl: "https://picsum.photos/seed/sarah-indie/300/300",
    tracks: padPlaylist([
      createTrack("si-1", "Motion Sickness", "Phoebe Bridgers", "Stranger in the Alps", "Indie", 1420, 0.45, 105, "melancholic"),
      createTrack("si-2", "Kyoto", "Phoebe Bridgers", "Punisher", "Indie", 1280, 0.52, 112, "bittersweet"),
      createTrack("si-3", "Apocalypse", "Cigarettes After Sex", "Cigarettes After Sex", "Dream Pop", 990, 0.35, 72, "dreamy"),
      createTrack("si-4", "Heat Waves", "Glass Animals", "Dreamland", "Indie Pop", 2100, 0.58, 80, "hypnotic"),
    ]),
    mood: "indie",
    context: "late night drives",
  },
  {
    id: "sync-mike-gym",
    name: "Mike's Gym Bangers",
    owner: "Mike T.",
    relation: "Friend",
    syncedAt: "18 min ago",
    coverUrl: "https://picsum.photos/seed/mike-gym/300/300",
    tracks: padPlaylist([
      createTrack("mg-1", "Stronger", "Kanye West", "Graduation", "Hip-Hop", 1800, 0.92, 104, "powerful"),
      createTrack("mg-2", "Till I Collapse", "Eminem", "The Eminem Show", "Hip-Hop", 1650, 0.95, 171, "intense"),
      createTrack("mg-3", "Eye of the Tiger", "Survivor", "Eye of the Tiger", "Rock", 1200, 0.88, 109, "motivational"),
      createTrack("mg-4", "Lose Yourself", "Eminem", "8 Mile", "Hip-Hop", 1900, 0.86, 86, "focused"),
    ]),
    mood: "intense",
    context: "workout",
  },
  {
    id: "sync-aunt-jazz",
    name: "Aunt Lisa's Jazz Lounge",
    owner: "Lisa W.",
    relation: "Family",
    syncedAt: "25 min ago",
    coverUrl: "https://picsum.photos/seed/aunt-jazz/300/300",
    tracks: padPlaylist([
      createTrack("aj-1", "Take Five", "Dave Brubeck", "Time Out", "Jazz", 850, 0.38, 176, "smooth"),
      createTrack("aj-2", "So What", "Miles Davis", "Kind of Blue", "Jazz", 920, 0.32, 136, "cool"),
      createTrack("aj-3", "Feeling Good", "Nina Simone", "I Put a Spell", "Jazz", 780, 0.55, 95, "soulful"),
      createTrack("aj-4", "Autumn Leaves", "Cannonball Adderley", "Somethin' Else", "Jazz", 640, 0.4, 88, "mellow"),
    ]),
    mood: "sophisticated",
    context: "dinner party",
  },
];

const podcasts: Podcast[] = [
  {
    id: "pod-1",
    title: "Why Your Discover Weekly Keeps Repeating",
    show: "Music & Mind",
    host: "Dr. Anya Patel",
    coverUrl: "https://picsum.photos/seed/pod-music-mind/300/300",
    duration: "42 min",
    description: "Exploring the psychology of music repetition and how AI could break the loop.",
    category: "Music",
  },
  {
    id: "pod-2",
    title: "The Future of AI in Streaming",
    show: "Tech Tonic",
    host: "Marcus Chen",
    coverUrl: "https://picsum.photos/seed/pod-tech-tonic/300/300",
    duration: "55 min",
    description: "How Spotify, Apple Music, and startups are racing to build contextual AI discovery.",
    category: "Technology",
  },
  {
    id: "pod-3",
    title: "Indie Artists on the Rise in 2026",
    show: "New Noise",
    host: "Jordan Lee",
    coverUrl: "https://picsum.photos/seed/pod-new-noise/300/300",
    duration: "38 min",
    description: "Breaking down this week's indie trends and what's driving listener momentum.",
    category: "Music",
  },
  {
    id: "pod-4",
    title: "Building Products Users Actually Want",
    show: "PM Deep Dive",
    host: "Rachel Kim",
    coverUrl: "https://picsum.photos/seed/pod-pm-dive/300/300",
    duration: "48 min",
    description: "From survey insights to shipped features — a PM's guide to AI-native MVPs.",
    category: "Business",
  },
  {
    id: "pod-5",
    title: "Lo-Fi Beats to Code To",
    show: "Focus Flow Daily",
    host: "Studio 404",
    coverUrl: "https://picsum.photos/seed/pod-focus-flow/300/300",
    duration: "60 min",
    description: "Live session featuring the best lo-fi tracks for deep work and flow states.",
    category: "Music",
  },
  {
    id: "pod-6",
    title: "The Science of Mood-Based Playlists",
    show: "Sound Psychology",
    host: "Dr. Elena Rossi",
    coverUrl: "https://picsum.photos/seed/pod-sound-psych/300/300",
    duration: "35 min",
    description: "Why mood-bridged transitions feel smoother than random shuffle.",
    category: "Science",
  },
];

const lunarEchoesTracks: Track[] = [
  createTrack("le-1", "Midnight City", "Lunar Echoes", "Neon Horizons", "Synth Pop", 5200, 0.72, 118, "dreamy"),
  createTrack("le-2", "Starlight Drive", "Lunar Echoes", "Neon Horizons", "Synth Pop", 4800, 0.68, 112, "nostalgic"),
  createTrack("le-3", "Echo Park", "Lunar Echoes", "After Dark", "Indie Pop", 4100, 0.55, 104, "atmospheric"),
  createTrack("le-4", "Prism", "Lunar Echoes", "After Dark", "Indie Pop", 3600, 0.62, 108, "reflective"),
  createTrack("le-5", "Electric Dreams", "Lunar Echoes", "Voltage", "Electronic", 3200, 0.78, 128, "energetic"),
];

const featuredArtist: FeaturedArtist = {
  name: "Lunar Echoes",
  verified: true,
  monthlyListeners: 18_542_031,
  imageUrl: "https://picsum.photos/seed/lunar-echoes-hero/640/640",
  tracks: lunarEchoesTracks,
};

const goodEveningMixes: HomeMix[] = [
  {
    id: "ge-techno",
    title: "Techno Bunker",
    imageUrl: "https://picsum.photos/seed/techno-bunker/160/160",
    tracks: padPlaylist(gymBeastModeTracks),
  },
  {
    id: "ge-midnight",
    title: "Midnight Chill",
    imageUrl: "https://picsum.photos/seed/midnight-chill/160/160",
    tracks: padPlaylist(lateNightCodingTracks),
  },
  {
    id: "ge-classical",
    title: "Classical Focus",
    imageUrl: "https://picsum.photos/seed/classical-focus/160/160",
    tracks: padPlaylist(chillSundayTracks),
  },
  {
    id: "ge-jazz",
    title: "Late Night Jazz",
    imageUrl: "https://picsum.photos/seed/late-jazz/160/160",
    tracks: syncedFriendsFamilyPlaylists[4]!.tracks,
  },
  {
    id: "ge-retro",
    title: "Retro Wave",
    imageUrl: "https://picsum.photos/seed/retro-wave/160/160",
    tracks: padPlaylist(morningEnergyTracks),
  },
  {
    id: "ge-global",
    title: "Global Top 50",
    imageUrl: "https://picsum.photos/seed/global-top50/160/160",
    tracks: getTrendingTrackList(),
  },
];

function getTrendingTrackList(): Track[] {
  const all = [
    ...morningEnergyTracks,
    ...lateNightCodingTracks,
    ...weekendVibesTracks,
    ...gymBeastModeTracks,
    ...lunarEchoesTracks,
  ];
  return [...all].sort((a, b) => b.playCount - a.playCount).slice(0, 20);
}

const madeForYouMixes: HomeMix[] = [
  {
    id: "mfy-daily-1",
    title: "Daily Mix 1",
    subtitle: "LANY, Lauv, Troye Sivan and more",
    description: "Made for you",
    imageUrl: "https://picsum.photos/seed/daily-mix-1/300/300",
    tracks: padPlaylist(morningEnergyTracks.slice(0, 4).concat(weekendVibesTracks.slice(0, 4))),
  },
  {
    id: "mfy-daily-2",
    title: "Daily Mix 2",
    subtitle: "Disclosure, Kaytranada, Fred again.. and more",
    description: "Made for you",
    imageUrl: "https://picsum.photos/seed/daily-mix-2/300/300",
    tracks: padPlaylist(gymBeastModeTracks.slice(0, 4).concat(lateNightCodingTracks.slice(0, 4))),
  },
  {
    id: "mfy-discover",
    title: "Discover Weekly",
    subtitle: "Your weekly mixtape of fresh music",
    description: "Updated every Monday",
    imageUrl: "https://picsum.photos/seed/discover-weekly/300/300",
    tracks: getTrendingTrackList(),
  },
  {
    id: "mfy-radar",
    title: "Release Radar",
    subtitle: "Catch all the latest music from artists you follow",
    description: "Updated every Friday",
    imageUrl: "https://picsum.photos/seed/release-radar/300/300",
    tracks: padPlaylist(lunarEchoesTracks),
  },
  {
    id: "mfy-chill",
    title: "Chill Mix",
    subtitle: "Mellow tracks for easy listening",
    description: "Made for you",
    imageUrl: "https://picsum.photos/seed/chill-mix/300/300",
    tracks: padPlaylist(chillSundayTracks),
  },
];

const recentlyPlayed: RecentlyPlayedItem[] = [
  {
    id: "rp-1",
    title: "Nights Like These",
    artist: "Vanguard",
    imageUrl: "https://picsum.photos/seed/nights-like-these/160/160",
    track: createTrack("rp-t1", "Nights Like These", "Vanguard", "City Lights", "Indie Pop", 1200, 0.58, 102, "moody"),
  },
  {
    id: "rp-2",
    title: "Star Gazer",
    artist: "Cosmo Kids",
    imageUrl: "https://picsum.photos/seed/star-gazer/160/160",
    track: createTrack("rp-t2", "Star Gazer", "Cosmo Kids", "Orbit", "Dream Pop", 980, 0.52, 96, "ethereal"),
  },
  {
    id: "rp-3",
    title: "Electric Dreams",
    artist: "Volt",
    imageUrl: "https://picsum.photos/seed/electric-dreams-volt/160/160",
    track: lunarEchoesTracks[4]!,
  },
  {
    id: "rp-4",
    title: "Prism",
    artist: "Refractions",
    imageUrl: "https://picsum.photos/seed/prism-refractions/160/160",
    track: createTrack("rp-t4", "Prism", "Refractions", "Light Split", "Electronic", 860, 0.65, 120, "shimmering"),
  },
  {
    id: "rp-5",
    title: "Midnight Terminal",
    artist: "Null Pointer",
    imageUrl: "https://picsum.photos/seed/midnight-terminal/160/160",
    track: lateNightCodingTracks[0]!,
  },
  {
    id: "rp-6",
    title: "Golden Hour",
    artist: "The Coastlines",
    imageUrl: "https://picsum.photos/seed/golden-hour-coast/160/160",
    track: weekendVibesTracks[0]!,
  },
];

const playlists: Playlist[] = [
  {
    id: "morning-energy",
    name: "Morning Energy",
    tracks: padPlaylist(morningEnergyTracks),
    mood: "motivational",
    context: "morning routine",
  },
  {
    id: "late-night-coding",
    name: "Late Night Coding",
    tracks: padPlaylist(lateNightCodingTracks),
    mood: "focused",
    context: "deep work",
  },
  {
    id: "weekend-vibes",
    name: "Weekend Vibes",
    tracks: padPlaylist(weekendVibesTracks),
    mood: "relaxed",
    context: "leisure",
  },
  {
    id: "gym-beast-mode",
    name: "Gym Beast Mode",
    tracks: padPlaylist(gymBeastModeTracks),
    mood: "intense",
    context: "workout",
  },
  {
    id: "chill-sunday",
    name: "Chill Sunday",
    tracks: padPlaylist(chillSundayTracks),
    mood: "calm",
    context: "wind down",
  },
  {
    id: "bollywood-hits",
    name: "Bollywood Hits",
    tracks: bollywoodHitsTracks,
    mood: "hindi",
    context: "bollywood favorites",
  },
];

function computeTrendScore(track: Track): number {
  const recentPlays = track.playCount;
  return recentPlays * 0.4 + track.energy * 100 * 0.3 + track.tempo * 0.3;
}

function buildTrendReason(track: Track): string {
  if (track.playCount > 3500) {
    return `Heavy rotation — ${track.playCount.toLocaleString("en-US")} recent plays in your library`;
  }
  if (track.energy > 0.85) {
    return `High-energy ${track.genre.toLowerCase()} tracks are spiking in workout playlists`;
  }
  if (track.tempo > 130) {
    return `Fast tempo (${track.tempo} BPM) driving discovery this week`;
  }
  return `Rising in ${track.mood} discovery feeds across indie listeners`;
}

function buildAiExplanation(track: Track, score: number): string {
  return `${track.title} scores ${Math.round(score)} on our composite trend index — driven by ${track.playCount} recent plays, ${Math.round(track.energy * 100)}% energy, and ${track.tempo} BPM. Listeners in similar ${track.mood} contexts are replaying ${track.genre.toLowerCase()} at 2× the weekly average.`;
}

export function getAllPlaylists(): Playlist[] {
  return playlists;
}

export function getSyncedPlaylists(): SyncedPlaylist[] {
  return syncedFriendsFamilyPlaylists;
}

export function getSyncedPlaylistById(id: string): SyncedPlaylist | undefined {
  return syncedFriendsFamilyPlaylists.find((p) => p.id === id);
}

export function podcastToTrack(pod: Podcast): Track {
  return {
    id: `pod-${pod.id}`,
    title: pod.title,
    artist: pod.show,
    album: pod.host,
    coverUrl: pod.coverUrl,
    previewUrl: getPreviewUrlForId(`pod-${pod.id}`),
    genre: "Podcast",
    playCount: 0,
    energy: 0.25,
    tempo: 100,
    mood: "informative",
  };
}

export function getAllTracks(): Track[] {
  const ownTracks = playlists.flatMap((p) => p.tracks);
  const syncedTracks = syncedFriendsFamilyPlaylists.flatMap((p) => p.tracks);
  const seen = new Set<string>();
  return [...ownTracks, ...syncedTracks].filter((t) => {
    if (seen.has(t.id)) return false;
    seen.add(t.id);
    return true;
  });
}

export function getLikedTracksForLibrary(likedIds: Set<string>): Track[] {
  const all = getAllTracks();
  const fromLikes = all.filter((t) => likedIds.has(t.id));
  if (fromLikes.length >= 5) return fromLikes;
  const merged = [...fromLikes];
  const seen = new Set(merged.map((t) => t.id));
  for (const track of all) {
    if (merged.length >= 12) break;
    if (!seen.has(track.id)) {
      merged.push(track);
      seen.add(track.id);
    }
  }
  return merged;
}

export function getPodcasts(): Podcast[] {
  return podcasts;
}

export function getPlaylistById(id: string): Playlist | undefined {
  return playlists.find((playlist) => playlist.id === id);
}

export function getTrendingTracks(): TrendingItem[] {
  return getTrendingCatalogItems().slice(0, 6);
}

function getTrendingCatalogItems(): TrendingItem[] {
  return getTrendingCatalogTracks()
    .map((track) => {
      const trendScore = computeTrendScore(track);
      return {
        track,
        trendScore: Math.round(trendScore),
        reason: buildTrendReason(track),
        aiExplanation: buildAiExplanation(track, trendScore),
      };
    })
    .sort((a, b) => b.trendScore - a.trendScore);
}

function groupTrendingItems(
  items: TrendingItem[],
  key: "mood" | "genre",
  limitPerGroup = TRENDING_MOOD_MIN_TRACKS
): TrendingGroup[] {
  const groups = new Map<string, TrendingItem[]>();

  for (const item of items) {
    const label = key === "mood" ? item.track.mood : item.track.genre;
    const normalized = label.trim();
    if (!groups.has(normalized)) groups.set(normalized, []);
    groups.get(normalized)!.push(item);
  }

  return Array.from(groups.entries())
    .map(([label, groupItems]) => ({
      label,
      items: groupItems
        .sort((a, b) => b.trendScore - a.trendScore)
        .slice(0, limitPerGroup),
    }))
    .sort(
      (a, b) =>
        (b.items[0]?.trendScore ?? 0) - (a.items[0]?.trendScore ?? 0)
    );
}

export function getTrendingGroupedByMood(): TrendingGroup[] {
  return groupTrendingItems(getTrendingCatalogItems(), "mood", 20).filter(
    (group) => group.items.length >= TRENDING_MOOD_MIN_TRACKS
  );
}

export function getTrendingGroupedByGenre(): TrendingGroup[] {
  return groupTrendingItems(getTrendingCatalogItems(), "genre", 20);
}

export function getRepetitionWarning(playlistId: string): boolean {
  const playlist = getPlaylistById(playlistId);
  if (!playlist || playlist.tracks.length < 3) return false;

  const sorted = [...playlist.tracks].sort((a, b) => b.playCount - a.playCount);
  const totalPlays = playlist.tracks.reduce((sum, track) => sum + track.playCount, 0);
  const topThreePlays = sorted.slice(0, 3).reduce((sum, track) => sum + track.playCount, 0);

  return topThreePlays / totalPlays > 0.6;
}

export function getFeaturedArtist(): FeaturedArtist {
  return featuredArtist;
}

export function getGoodEveningMixes(): HomeMix[] {
  return goodEveningMixes;
}

export function getMadeForYouMixes(): HomeMix[] {
  return madeForYouMixes;
}

export function getRecentlyPlayed(): RecentlyPlayedItem[] {
  return recentlyPlayed;
}
