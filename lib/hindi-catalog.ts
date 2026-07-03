import type { Track } from "@/types";
import { getPreviewUrlForId } from "@/lib/audio-previews";

export type HindiSongSeed = {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  playCount: number;
  energy: number;
  tempo: number;
  mood: string;
};

function toHindiTrack(song: HindiSongSeed): Track {
  return {
    id: song.id,
    title: song.title,
    artist: song.artist,
    album: song.album,
    coverUrl: `https://picsum.photos/seed/${song.id}/300/300`,
    previewUrl: getPreviewUrlForId(song.id),
    genre: song.genre,
    playCount: song.playCount,
    energy: song.energy,
    tempo: song.tempo,
    mood: song.mood,
  };
}

/** Popular Hindi / Bollywood tracks — real titles for preview lookup */
export const HINDI_SONGS: HindiSongSeed[] = [
  { id: "hi-1", title: "Tum Hi Ho", artist: "Arijit Singh", album: "Aashiqui 2", genre: "Bollywood", playCount: 9200, energy: 0.45, tempo: 80, mood: "romantic" },
  { id: "hi-2", title: "Kesariya", artist: "Arijit Singh", album: "Brahmāstra", genre: "Bollywood", playCount: 8800, energy: 0.55, tempo: 95, mood: "romantic" },
  { id: "hi-3", title: "Raataan Lambiyan", artist: "Jubin Nautiyal", album: "Shershaah", genre: "Bollywood", playCount: 8500, energy: 0.42, tempo: 88, mood: "romantic" },
  { id: "hi-4", title: "Apna Bana Le", artist: "Sachin-Jigar", album: "Bhediya", genre: "Bollywood", playCount: 8200, energy: 0.48, tempo: 92, mood: "romantic" },
  { id: "hi-5", title: "Channa Mereya", artist: "Arijit Singh", album: "Ae Dil Hai Mushkil", genre: "Bollywood", playCount: 7900, energy: 0.38, tempo: 78, mood: "melancholic" },
  { id: "hi-6", title: "Kal Ho Naa Ho", artist: "Sonu Nigam", album: "Kal Ho Naa Ho", genre: "Bollywood", playCount: 7600, energy: 0.4, tempo: 72, mood: "melancholic" },
  { id: "hi-7", title: "Gerua", artist: "Arijit Singh", album: "Dilwale", genre: "Bollywood", playCount: 7400, energy: 0.52, tempo: 100, mood: "romantic" },
  { id: "hi-8", title: "Samjhawan", artist: "Arijit Singh", album: "Humpty Sharma Ki Dulhania", genre: "Bollywood", playCount: 7100, energy: 0.35, tempo: 85, mood: "romantic" },
  { id: "hi-9", title: "Ghungroo", artist: "Arijit Singh", album: "War", genre: "Bollywood", playCount: 6900, energy: 0.78, tempo: 128, mood: "energetic" },
  { id: "hi-10", title: "Nashe Si Chadh Gayi", artist: "Arijit Singh", album: "Befikre", genre: "Bollywood", playCount: 6700, energy: 0.82, tempo: 120, mood: "energetic" },
  { id: "hi-11", title: "Raabta", artist: "Pritam", album: "Agent Vinod", genre: "Bollywood", playCount: 6500, energy: 0.58, tempo: 105, mood: "happy" },
  { id: "hi-12", title: "Ilahi", artist: "Arijit Singh", album: "Yeh Jawaani Hai Deewani", genre: "Bollywood", playCount: 6300, energy: 0.72, tempo: 118, mood: "happy" },
  { id: "hi-13", title: "Kabira", artist: "Tochi Raina", album: "Yeh Jawaani Hai Deewani", genre: "Bollywood", playCount: 6100, energy: 0.5, tempo: 98, mood: "chill" },
  { id: "hi-14", title: "Tera Hone Laga Hoon", artist: "Atif Aslam", album: "Ajab Prem Ki Ghazab Kahani", genre: "Bollywood", playCount: 5900, energy: 0.62, tempo: 110, mood: "happy" },
  { id: "hi-15", title: "Ve Kamleya", artist: "Arijit Singh", album: "Rocky Aur Rani", genre: "Bollywood", playCount: 5700, energy: 0.44, tempo: 86, mood: "romantic" },
  { id: "hi-16", title: "Pasoori", artist: "Ali Sethi", album: "Pasoori", genre: "Indie Pop", playCount: 5500, energy: 0.68, tempo: 102, mood: "energetic" },
  { id: "hi-17", title: "Bom Diggy Diggy", artist: "Zack Knight", album: "Sonu Ke Titu Ki Sweety", genre: "Bollywood", playCount: 5300, energy: 0.88, tempo: 125, mood: "hype" },
  { id: "hi-18", title: "Bole Chudiyan", artist: "K.K.", album: "Kabhi Khushi Kabhie Gham", genre: "Bollywood", playCount: 5100, energy: 0.75, tempo: 115, mood: "happy" },
  { id: "hi-19", title: "Chaiyya Chaiyya", artist: "Sukhwinder Singh", album: "Dil Se..", genre: "Bollywood", playCount: 4900, energy: 0.85, tempo: 130, mood: "hype" },
  { id: "hi-20", title: "Pal Pal Dil Ke Paas", artist: "Arijit Singh", album: "Pal Pal Dil Ke Paas", genre: "Bollywood", playCount: 4700, energy: 0.46, tempo: 90, mood: "romantic" },
  { id: "hi-21", title: "Zaalima", artist: "Arijit Singh", album: "Raees", genre: "Bollywood", playCount: 4500, energy: 0.56, tempo: 94, mood: "romantic" },
  { id: "hi-22", title: "Shiddat Title Track", artist: "Jubin Nautiyal", album: "Shiddat", genre: "Bollywood", playCount: 4300, energy: 0.42, tempo: 82, mood: "melancholic" },
  { id: "hi-23", title: "Makhna", artist: "Asees Kaur", album: "Drive", genre: "Bollywood", playCount: 4100, energy: 0.8, tempo: 122, mood: "hype" },
  { id: "hi-24", title: "O Bedardeya", artist: "Arijit Singh", album: "Tu Jhoothi Main Makkaar", genre: "Bollywood", playCount: 3900, energy: 0.36, tempo: 76, mood: "melancholic" },
  { id: "hi-25", title: "Tujhe Kitna Chahne Lage", artist: "Arijit Singh", album: "Kabir Singh", genre: "Bollywood", playCount: 3700, energy: 0.4, tempo: 84, mood: "romantic" },
];

export function getHindiTracks(): Track[] {
  return HINDI_SONGS.map(toHindiTrack);
}

export function getHindiTracksByMood(mood: string, limit = 20): Track[] {
  return HINDI_SONGS.filter((s) => s.mood === mood)
    .slice(0, limit)
    .map(toHindiTrack);
}

export function mergeTracksToCount(
  primary: Track[],
  filler: Track[],
  count = 20
): Track[] {
  const seen = new Set<string>();
  const result: Track[] = [];

  for (const track of [...primary, ...filler]) {
    if (seen.has(track.id)) continue;
    seen.add(track.id);
    result.push(track);
    if (result.length >= count) break;
  }

  return result;
}
