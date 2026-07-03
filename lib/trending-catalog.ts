import type { Track } from "@/types";
import { getPreviewUrlForId } from "@/lib/audio-previews";
import { HINDI_SONGS } from "@/lib/hindi-catalog";

type SongSeed = {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  playCount: number;
  energy: number;
  tempo: number;
};

function toTrack(song: SongSeed, mood: string): Track {
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
    mood,
  };
}

/** Real popular songs grouped by mood — 10+ per category for Trending */
export const TRENDING_BY_MOOD: Record<string, SongSeed[]> = {
  energetic: [
    { id: "tr-en-1", title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", genre: "Synth Pop", playCount: 9820, energy: 0.92, tempo: 171 },
    { id: "tr-en-2", title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", genre: "Disco Pop", playCount: 9100, energy: 0.88, tempo: 103 },
    { id: "tr-en-3", title: "Don't Start Now", artist: "Dua Lipa", album: "Future Nostalgia", genre: "Disco Pop", playCount: 8650, energy: 0.86, tempo: 124 },
    { id: "tr-en-4", title: "Uptown Funk", artist: "Bruno Mars", album: "Uptown Special", genre: "Funk", playCount: 8400, energy: 0.94, tempo: 115 },
    { id: "tr-en-5", title: "Can't Hold Us", artist: "Macklemore & Ryan Lewis", album: "The Heist", genre: "Hip-Hop", playCount: 7900, energy: 0.91, tempo: 146 },
    { id: "tr-en-6", title: "Shake It Off", artist: "Taylor Swift", album: "1989", genre: "Pop", playCount: 7600, energy: 0.89, tempo: 160 },
    { id: "tr-en-7", title: "Wake Me Up", artist: "Avicii", album: "True", genre: "EDM", playCount: 7200, energy: 0.87, tempo: 124 },
    { id: "tr-en-8", title: "Don't Stop Me Now", artist: "Queen", album: "Jazz", genre: "Rock", playCount: 6800, energy: 0.93, tempo: 156 },
    { id: "tr-en-9", title: "Dynamite", artist: "BTS", album: "BE", genre: "K-Pop", playCount: 6500, energy: 0.9, tempo: 114 },
    { id: "tr-en-10", title: "Titanium", artist: "David Guetta ft. Sia", album: "Nothing but the Beat", genre: "EDM", playCount: 6200, energy: 0.88, tempo: 126 },
    { id: "tr-en-11", title: "Stronger", artist: "Kanye West", album: "Graduation", genre: "Hip-Hop", playCount: 5900, energy: 0.85, tempo: 104 },
    { id: "tr-en-12", title: "Good 4 U", artist: "Olivia Rodrigo", album: "SOUR", genre: "Pop Rock", playCount: 5600, energy: 0.84, tempo: 166 },
    { id: "tr-en-13", title: "Believer", artist: "Imagine Dragons", album: "Evolve", genre: "Pop Rock", playCount: 5400, energy: 0.9, tempo: 125 },
    { id: "tr-en-14", title: "Firework", artist: "Katy Perry", album: "Teenage Dream", genre: "Pop", playCount: 5200, energy: 0.87, tempo: 124 },
    { id: "tr-en-15", title: "Roar", artist: "Katy Perry", album: "Prism", genre: "Pop", playCount: 5000, energy: 0.85, tempo: 180 },
    { id: "tr-en-16", title: "Pumped Up Kicks", artist: "Foster the People", album: "Torches", genre: "Indie Pop", playCount: 4800, energy: 0.83, tempo: 128 },
    { id: "tr-en-17", title: "Happy Now", artist: "Kygo & Sandro Cavazza", album: "Kids in Love", genre: "EDM", playCount: 4600, energy: 0.8, tempo: 118 },
    { id: "tr-en-18", title: "Run the World", artist: "Beyoncé", album: "4", genre: "Pop", playCount: 4400, energy: 0.88, tempo: 127 },
    { id: "tr-en-19", title: "Can't Stop the Feeling!", artist: "Justin Timberlake", album: "Trolls", genre: "Pop", playCount: 4200, energy: 0.81, tempo: 113 },
    { id: "tr-en-20", title: "Viva La Vida", artist: "Coldplay", album: "Viva la Vida", genre: "Rock", playCount: 4000, energy: 0.79, tempo: 138 },
  ],
  chill: [
    { id: "tr-ch-1", title: "Sunset Lover", artist: "Petit Biscuit", album: "Presence", genre: "Electronic", playCount: 5400, energy: 0.35, tempo: 98 },
    { id: "tr-ch-2", title: "Intro", artist: "The xx", album: "xx", genre: "Indie", playCount: 5100, energy: 0.28, tempo: 105 },
    { id: "tr-ch-3", title: "Redbone", artist: "Childish Gambino", album: "Awaken, My Love!", genre: "R&B", playCount: 4900, energy: 0.42, tempo: 67 },
    { id: "tr-ch-4", title: "Ivy", artist: "Frank Ocean", album: "Blonde", genre: "R&B", playCount: 4700, energy: 0.38, tempo: 118 },
    { id: "tr-ch-5", title: "Electric Feel", artist: "MGMT", album: "Oracular Spectacular", genre: "Psychedelic Pop", playCount: 4500, energy: 0.55, tempo: 103 },
    { id: "tr-ch-6", title: "Lost in Japan", artist: "Shawn Mendes", album: "Shawn Mendes", genre: "Pop", playCount: 4300, energy: 0.48, tempo: 102 },
    { id: "tr-ch-7", title: "Sun Model", artist: "ODESZA", album: "In Return", genre: "Electronic", playCount: 4100, energy: 0.52, tempo: 110 },
    { id: "tr-ch-8", title: "Night Owl", artist: "Broke For Free", album: "Layers", genre: "Lo-Fi", playCount: 3900, energy: 0.32, tempo: 88 },
    { id: "tr-ch-9", title: "Resonance", artist: "Home", album: "Odyssey", genre: "Synthwave", playCount: 3700, energy: 0.45, tempo: 95 },
    { id: "tr-ch-10", title: "Breathe Me", artist: "Sia", album: "Colour the Small One", genre: "Pop", playCount: 3500, energy: 0.3, tempo: 78 },
    { id: "tr-ch-11", title: "Holocene", artist: "Bon Iver", album: "Bon Iver", genre: "Indie Folk", playCount: 3300, energy: 0.25, tempo: 92 },
    { id: "tr-ch-12", title: "Weightless", artist: "Marconi Union", album: "Weightless", genre: "Ambient", playCount: 3100, energy: 0.12, tempo: 60 },
    { id: "tr-ch-13", title: "Stay", artist: "Rihanna", album: "Unapologetic", genre: "Pop", playCount: 2900, energy: 0.38, tempo: 112 },
    { id: "tr-ch-14", title: "Slow Dancing in the Dark", artist: "Joji", album: "Ballads 1", genre: "R&B", playCount: 2700, energy: 0.32, tempo: 95 },
    { id: "tr-ch-15", title: "Location", artist: "Khalid", album: "American Teen", genre: "R&B", playCount: 2500, energy: 0.4, tempo: 98 },
    { id: "tr-ch-16", title: "Sunflower", artist: "Post Malone", album: "Spider-Man", genre: "Pop", playCount: 2300, energy: 0.45, tempo: 90 },
    { id: "tr-ch-17", title: "Dreams", artist: "Fleetwood Mac", album: "Rumours", genre: "Rock", playCount: 2100, energy: 0.42, tempo: 120 },
    { id: "tr-ch-18", title: "Yellow", artist: "Coldplay", album: "Parachutes", genre: "Rock", playCount: 1900, energy: 0.36, tempo: 86 },
    { id: "tr-ch-19", title: "The Night We Met", artist: "Lord Huron", album: "Strange Trails", genre: "Indie Folk", playCount: 1700, energy: 0.28, tempo: 105 },
    { id: "tr-ch-20", title: "Riptide", artist: "Vance Joy", album: "Dream Your Life Away", genre: "Indie Folk", playCount: 1500, energy: 0.48, tempo: 102 },
  ],
  happy: [
    { id: "tr-ha-1", title: "Happy", artist: "Pharrell Williams", album: "G I R L", genre: "Pop", playCount: 8800, energy: 0.82, tempo: 160 },
    { id: "tr-ha-2", title: "Good as Hell", artist: "Lizzo", album: "Cuz I Love You", genre: "Pop", playCount: 8200, energy: 0.78, tempo: 96 },
    { id: "tr-ha-3", title: "Walking on Sunshine", artist: "Katrina & The Waves", album: "Walking on Sunshine", genre: "Pop Rock", playCount: 7800, energy: 0.86, tempo: 109 },
    { id: "tr-ha-4", title: "I Gotta Feeling", artist: "Black Eyed Peas", album: "The E.N.D.", genre: "Dance Pop", playCount: 7500, energy: 0.84, tempo: 128 },
    { id: "tr-ha-5", title: "Three Little Birds", artist: "Bob Marley", album: "Exodus", genre: "Reggae", playCount: 7100, energy: 0.65, tempo: 76 },
    { id: "tr-ha-6", title: "Here Comes the Sun", artist: "The Beatles", album: "Abbey Road", genre: "Rock", playCount: 6900, energy: 0.58, tempo: 129 },
    { id: "tr-ha-7", title: "Best Day of My Life", artist: "American Authors", album: "Oh, What a Life", genre: "Indie Pop", playCount: 6600, energy: 0.8, tempo: 100 },
    { id: "tr-ha-8", title: "On Top of the World", artist: "Imagine Dragons", album: "Night Visions", genre: "Pop Rock", playCount: 6300, energy: 0.76, tempo: 102 },
    { id: "tr-ha-9", title: "Feel It Still", artist: "Portugal. The Man", album: "Woodstock", genre: "Pop Rock", playCount: 6000, energy: 0.72, tempo: 79 },
    { id: "tr-ha-10", title: "Can't Stop the Feeling!", artist: "Justin Timberlake", album: "Trolls", genre: "Pop", playCount: 5700, energy: 0.81, tempo: 113 },
    { id: "tr-ha-11", title: "Shut Up and Dance", artist: "WALK THE MOON", album: "Talking Is Hard", genre: "Indie Pop", playCount: 5400, energy: 0.83, tempo: 128 },
    { id: "tr-ha-12", title: "Mr. Blue Sky", artist: "Electric Light Orchestra", album: "Out of the Blue", genre: "Rock", playCount: 5100, energy: 0.77, tempo: 178 },
    { id: "tr-ha-13", title: "Dynamite", artist: "BTS", album: "BE", genre: "K-Pop", playCount: 4900, energy: 0.9, tempo: 114 },
    { id: "tr-ha-14", title: "Uptown Funk", artist: "Bruno Mars", album: "Uptown Special", genre: "Funk", playCount: 4700, energy: 0.94, tempo: 115 },
    { id: "tr-ha-15", title: "Treasure", artist: "Bruno Mars", album: "Unorthodox Jukebox", genre: "Pop", playCount: 4500, energy: 0.84, tempo: 116 },
    { id: "tr-ha-16", title: "Count on Me", artist: "Bruno Mars", album: "Doo-Wops & Hooligans", genre: "Pop", playCount: 4300, energy: 0.7, tempo: 89 },
    { id: "tr-ha-17", title: "Love Yourself", artist: "Justin Bieber", album: "Purpose", genre: "Pop", playCount: 4100, energy: 0.55, tempo: 100 },
    { id: "tr-ha-18", title: "Sugar", artist: "Maroon 5", album: "V", genre: "Pop", playCount: 3900, energy: 0.78, tempo: 120 },
    { id: "tr-ha-19", title: "Can't Stop the Feeling!", artist: "Justin Timberlake", album: "Trolls", genre: "Pop", playCount: 3700, energy: 0.81, tempo: 113 },
    { id: "tr-ha-20", title: "Good Life", artist: "OneRepublic", album: "Waking Up", genre: "Pop Rock", playCount: 3500, energy: 0.76, tempo: 140 },
  ],
  melancholic: [
    { id: "tr-me-1", title: "Someone Like You", artist: "Adele", album: "21", genre: "Pop", playCount: 7200, energy: 0.32, tempo: 68 },
    { id: "tr-me-2", title: "Fix You", artist: "Coldplay", album: "X&Y", genre: "Rock", playCount: 6800, energy: 0.38, tempo: 138 },
    { id: "tr-me-3", title: "The Night We Met", artist: "Lord Huron", album: "Strange Trails", genre: "Indie Folk", playCount: 6500, energy: 0.28, tempo: 105 },
    { id: "tr-me-4", title: "Skinny Love", artist: "Bon Iver", album: "For Emma, Forever Ago", genre: "Indie Folk", playCount: 6200, energy: 0.22, tempo: 78 },
    { id: "tr-me-5", title: "When the Party's Over", artist: "Billie Eilish", album: "When We All Fall Asleep", genre: "Pop", playCount: 5900, energy: 0.18, tempo: 65 },
    { id: "tr-me-6", title: "Mad World", artist: "Gary Jules", album: "Trading Snakeoil for Wolftickets", genre: "Pop", playCount: 5600, energy: 0.15, tempo: 96 },
    { id: "tr-me-7", title: "Hurt", artist: "Johnny Cash", album: "American IV", genre: "Country", playCount: 5300, energy: 0.2, tempo: 90 },
    { id: "tr-me-8", title: "Liability", artist: "Lorde", album: "Melodrama", genre: "Pop", playCount: 5000, energy: 0.25, tempo: 88 },
    { id: "tr-me-9", title: "All Too Well", artist: "Taylor Swift", album: "Red", genre: "Pop", playCount: 4700, energy: 0.35, tempo: 93 },
    { id: "tr-me-10", title: "Someone You Loved", artist: "Lewis Capaldi", album: "Divinely Uninspired", genre: "Pop", playCount: 4400, energy: 0.3, tempo: 110 },
    { id: "tr-me-11", title: "Snuff", artist: "Slipknot", album: "All Hope Is Gone", genre: "Rock", playCount: 4100, energy: 0.24, tempo: 72 },
    { id: "tr-me-12", title: "Nothing Compares 2 U", artist: "Sinéad O'Connor", album: "I Do Not Want What I Haven't Got", genre: "Pop", playCount: 3800, energy: 0.26, tempo: 84 },
    { id: "tr-me-13", title: "Say Something", artist: "A Great Big World", album: "Is There Anybody Out There?", genre: "Pop", playCount: 3600, energy: 0.22, tempo: 76 },
    { id: "tr-me-14", title: "Hallelujah", artist: "Jeff Buckley", album: "Grace", genre: "Rock", playCount: 3400, energy: 0.2, tempo: 112 },
    { id: "tr-me-15", title: "Let Her Go", artist: "Passenger", album: "All the Little Lights", genre: "Folk", playCount: 3200, energy: 0.28, tempo: 75 },
    { id: "tr-me-16", title: "Tears in Heaven", artist: "Eric Clapton", album: "Rush", genre: "Rock", playCount: 3000, energy: 0.24, tempo: 82 },
    { id: "tr-me-17", title: "Black", artist: "Pearl Jam", album: "Ten", genre: "Rock", playCount: 2800, energy: 0.3, tempo: 92 },
    { id: "tr-me-18", title: "Creep", artist: "Radiohead", album: "Pablo Honey", genre: "Rock", playCount: 2600, energy: 0.32, tempo: 92 },
    { id: "tr-me-19", title: "The Scientist", artist: "Coldplay", album: "A Rush of Blood", genre: "Rock", playCount: 2400, energy: 0.26, tempo: 74 },
    { id: "tr-me-20", title: "Fix You", artist: "Coldplay", album: "X&Y", genre: "Rock", playCount: 2200, energy: 0.38, tempo: 138 },
  ],
  romantic: [
    { id: "tr-ro-1", title: "Perfect", artist: "Ed Sheeran", album: "÷", genre: "Pop", playCount: 8100, energy: 0.42, tempo: 95 },
    { id: "tr-ro-2", title: "All of Me", artist: "John Legend", album: "Love in the Future", genre: "R&B", playCount: 7700, energy: 0.38, tempo: 120 },
    { id: "tr-ro-3", title: "Thinking Out Loud", artist: "Ed Sheeran", album: "x", genre: "Pop", playCount: 7400, energy: 0.45, tempo: 79 },
    { id: "tr-ro-4", title: "Make You Feel My Love", artist: "Adele", album: "19", genre: "Pop", playCount: 7000, energy: 0.35, tempo: 66 },
    { id: "tr-ro-5", title: "Lover", artist: "Taylor Swift", album: "Lover", genre: "Pop", playCount: 6700, energy: 0.48, tempo: 69 },
    { id: "tr-ro-6", title: "At Last", artist: "Etta James", album: "At Last!", genre: "Soul", playCount: 6400, energy: 0.4, tempo: 68 },
    { id: "tr-ro-7", title: "Can't Help Falling in Love", artist: "Elvis Presley", album: "Blue Hawaii", genre: "Pop", playCount: 6100, energy: 0.32, tempo: 100 },
    { id: "tr-ro-8", title: "Just the Way You Are", artist: "Bruno Mars", album: "Doo-Wops & Hooligans", genre: "Pop", playCount: 5800, energy: 0.55, tempo: 109 },
    { id: "tr-ro-9", title: "A Thousand Years", artist: "Christina Perri", album: "The Twilight Saga", genre: "Pop", playCount: 5500, energy: 0.36, tempo: 87 },
    { id: "tr-ro-10", title: "Shallow", artist: "Lady Gaga & Bradley Cooper", album: "A Star Is Born", genre: "Pop", playCount: 5200, energy: 0.44, tempo: 96 },
    { id: "tr-ro-11", title: "Stay With Me", artist: "Sam Smith", album: "In the Lonely Hour", genre: "Soul", playCount: 4900, energy: 0.41, tempo: 84 },
    { id: "tr-ro-12", title: "Adore You", artist: "Harry Styles", album: "Fine Line", genre: "Pop", playCount: 4600, energy: 0.52, tempo: 99 },
    { id: "tr-ro-13", title: "Love Story", artist: "Taylor Swift", album: "Fearless", genre: "Country", playCount: 4400, energy: 0.58, tempo: 119 },
    { id: "tr-ro-14", title: "Marry You", artist: "Bruno Mars", album: "Doo-Wops & Hooligans", genre: "Pop", playCount: 4200, energy: 0.72, tempo: 145 },
    { id: "tr-ro-15", title: "Just the Way You Are", artist: "Bruno Mars", album: "Doo-Wops & Hooligans", genre: "Pop", playCount: 4000, energy: 0.55, tempo: 109 },
    { id: "tr-ro-16", title: "Something", artist: "The Beatles", album: "Abbey Road", genre: "Rock", playCount: 3800, energy: 0.42, tempo: 66 },
    { id: "tr-ro-17", title: "Your Song", artist: "Elton John", album: "Elton John", genre: "Pop", playCount: 3600, energy: 0.38, tempo: 74 },
    { id: "tr-ro-18", title: "I Will Always Love You", artist: "Whitney Houston", album: "The Bodyguard", genre: "Pop", playCount: 3400, energy: 0.45, tempo: 68 },
    { id: "tr-ro-19", title: "Unchained Melody", artist: "The Righteous Brothers", album: "Just Once in My Life", genre: "Soul", playCount: 3200, energy: 0.35, tempo: 72 },
    { id: "tr-ro-20", title: "At Last", artist: "Etta James", album: "At Last!", genre: "Soul", playCount: 3000, energy: 0.4, tempo: 68 },
  ],
  hype: [
    { id: "tr-hy-1", title: "Lose Yourself", artist: "Eminem", album: "8 Mile", genre: "Hip-Hop", playCount: 9500, energy: 0.96, tempo: 86 },
    { id: "tr-hy-2", title: "Till I Collapse", artist: "Eminem", album: "The Eminem Show", genre: "Hip-Hop", playCount: 9200, energy: 0.94, tempo: 171 },
    { id: "tr-hy-3", title: "Eye of the Tiger", artist: "Survivor", album: "Eye of the Tiger", genre: "Rock", playCount: 8900, energy: 0.92, tempo: 109 },
    { id: "tr-hy-4", title: "Thunderstruck", artist: "AC/DC", album: "The Razors Edge", genre: "Rock", playCount: 8600, energy: 0.98, tempo: 133 },
    { id: "tr-hy-5", title: "POWER", artist: "Kanye West", album: "My Beautiful Dark Twisted Fantasy", genre: "Hip-Hop", playCount: 8300, energy: 0.91, tempo: 154 },
    { id: "tr-hy-6", title: "SICKO MODE", artist: "Travis Scott", album: "ASTROWORLD", genre: "Hip-Hop", playCount: 8000, energy: 0.89, tempo: 155 },
    { id: "tr-hy-7", title: "HUMBLE.", artist: "Kendrick Lamar", album: "DAMN.", genre: "Hip-Hop", playCount: 7700, energy: 0.87, tempo: 150 },
    { id: "tr-hy-8", title: "Enter Sandman", artist: "Metallica", album: "Metallica", genre: "Metal", playCount: 7400, energy: 0.95, tempo: 123 },
    { id: "tr-hy-9", title: "Welcome to the Jungle", artist: "Guns N' Roses", album: "Appetite for Destruction", genre: "Rock", playCount: 7100, energy: 0.93, tempo: 123 },
    { id: "tr-hy-10", title: "X Gon' Give It to Ya", artist: "DMX", album: "Grand Champ", genre: "Hip-Hop", playCount: 6800, energy: 0.9, tempo: 95 },
    { id: "tr-hy-11", title: "Indestructible", artist: "Disturbed", album: "Indestructible", genre: "Metal", playCount: 6500, energy: 0.97, tempo: 108 },
    { id: "tr-hy-12", title: "Remember the Name", artist: "Fort Minor", album: "The Rising Tied", genre: "Hip-Hop", playCount: 6200, energy: 0.88, tempo: 86 },
    { id: "tr-hy-13", title: "Stronger", artist: "Kanye West", album: "Graduation", genre: "Hip-Hop", playCount: 6000, energy: 0.85, tempo: 104 },
    { id: "tr-hy-14", title: "Can't Hold Us", artist: "Macklemore & Ryan Lewis", album: "The Heist", genre: "Hip-Hop", playCount: 5800, energy: 0.91, tempo: 146 },
    { id: "tr-hy-15", title: "Seven Nation Army", artist: "The White Stripes", album: "Elephant", genre: "Rock", playCount: 5600, energy: 0.9, tempo: 123 },
    { id: "tr-hy-16", title: "Smells Like Teen Spirit", artist: "Nirvana", album: "Nevermind", genre: "Rock", playCount: 5400, energy: 0.92, tempo: 117 },
    { id: "tr-hy-17", title: "We Will Rock You", artist: "Queen", album: "News of the World", genre: "Rock", playCount: 5200, energy: 0.88, tempo: 81 },
    { id: "tr-hy-18", title: "Lose Control", artist: "Missy Elliott", album: "The Cookbook", genre: "Hip-Hop", playCount: 5000, energy: 0.86, tempo: 130 },
    { id: "tr-hy-19", title: "In Da Club", artist: "50 Cent", album: "Get Rich or Die Tryin'", genre: "Hip-Hop", playCount: 4800, energy: 0.84, tempo: 90 },
    { id: "tr-hy-20", title: "Till I Collapse", artist: "Eminem", album: "The Eminem Show", genre: "Hip-Hop", playCount: 4600, energy: 0.94, tempo: 171 },
  ],
  hindi: HINDI_SONGS.slice(0, 20).map((song) => ({
    id: song.id,
    title: song.title,
    artist: song.artist,
    album: song.album,
    genre: song.genre,
    playCount: song.playCount,
    energy: song.energy,
    tempo: song.tempo,
  })),
};

export const TRENDING_MOOD_MIN_TRACKS = 20;

export function getTrendingCatalogTracks(): Track[] {
  return Object.entries(TRENDING_BY_MOOD).flatMap(([mood, songs]) =>
    songs.map((song) => toTrack(song, mood))
  );
}

export function getTrendingMoodLabels(): string[] {
  return Object.keys(TRENDING_BY_MOOD);
}
