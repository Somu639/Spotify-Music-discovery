export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  previewUrl: string;
  genre: string;
  playCount: number;
  energy: number;
  tempo: number;
  mood: string;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  mood: string;
  context: string;
}

export interface SyncedPlaylist extends Playlist {
  owner: string;
  relation: string;
  syncedAt: string;
  coverUrl: string;
}

export interface Podcast {
  id: string;
  title: string;
  show: string;
  host: string;
  coverUrl: string;
  duration: string;
  description: string;
  category: string;
}

export interface TrendingItem {
  track: Track;
  trendScore: number;
  reason: string;
  aiExplanation: string;
}

export interface TrendingGroup {
  label: string;
  items: TrendingItem[];
}

export interface SurveyInsight {
  pain: string;
  frequency: string;
  quote: string;
}

export interface ShuffleRecommendation {
  fromPlaylist: string;
  toPlaylist: string;
  bridgeTrack: Track;
  reason: string;
}

export interface FeaturedArtist {
  name: string;
  verified: boolean;
  monthlyListeners: number;
  imageUrl: string;
  tracks: Track[];
}

export interface HomeMix {
  id: string;
  title: string;
  imageUrl: string;
  tracks: Track[];
  description?: string;
  subtitle?: string;
}

export interface RecentlyPlayedItem {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  track: Track;
}

export type ContentTab = "all" | "music" | "trending" | "friends" | "podcasts";

export type ViewId = ContentTab | "search" | "library";
