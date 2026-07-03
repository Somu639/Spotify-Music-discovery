import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const TRENDING_BY_MOOD = {
  energetic: [
    ["tr-en-1", "Blinding Lights", "The Weeknd"],
    ["tr-en-2", "Levitating", "Dua Lipa"],
    ["tr-en-3", "Don't Start Now", "Dua Lipa"],
    ["tr-en-4", "Uptown Funk", "Bruno Mars"],
    ["tr-en-5", "Can't Hold Us", "Macklemore & Ryan Lewis"],
    ["tr-en-6", "Shake It Off", "Taylor Swift"],
    ["tr-en-7", "Wake Me Up", "Avicii"],
    ["tr-en-8", "Don't Stop Me Now", "Queen"],
    ["tr-en-9", "Dynamite", "BTS"],
    ["tr-en-10", "Titanium", "David Guetta ft. Sia"],
    ["tr-en-11", "Stronger", "Kanye West"],
    ["tr-en-12", "Good 4 U", "Olivia Rodrigo"],
  ],
  chill: [
    ["tr-ch-1", "Sunset Lover", "Petit Biscuit"],
    ["tr-ch-2", "Intro", "The xx"],
    ["tr-ch-3", "Redbone", "Childish Gambino"],
    ["tr-ch-4", "Ivy", "Frank Ocean"],
    ["tr-ch-5", "Electric Feel", "MGMT"],
    ["tr-ch-6", "Lost in Japan", "Shawn Mendes"],
    ["tr-ch-7", "Sun Model", "ODESZA"],
    ["tr-ch-8", "Night Owl", "Broke For Free"],
    ["tr-ch-9", "Resonance", "Home"],
    ["tr-ch-10", "Breathe Me", "Sia"],
    ["tr-ch-11", "Holocene", "Bon Iver"],
    ["tr-ch-12", "Weightless", "Marconi Union"],
  ],
  happy: [
    ["tr-ha-1", "Happy", "Pharrell Williams"],
    ["tr-ha-2", "Good as Hell", "Lizzo"],
    ["tr-ha-3", "Walking on Sunshine", "Katrina & The Waves"],
    ["tr-ha-4", "I Gotta Feeling", "Black Eyed Peas"],
    ["tr-ha-5", "Three Little Birds", "Bob Marley"],
    ["tr-ha-6", "Here Comes the Sun", "The Beatles"],
    ["tr-ha-7", "Best Day of My Life", "American Authors"],
    ["tr-ha-8", "On Top of the World", "Imagine Dragons"],
    ["tr-ha-9", "Feel It Still", "Portugal. The Man"],
    ["tr-ha-10", "Can't Stop the Feeling!", "Justin Timberlake"],
    ["tr-ha-11", "Shut Up and Dance", "WALK THE MOON"],
    ["tr-ha-12", "Mr. Blue Sky", "Electric Light Orchestra"],
  ],
  melancholic: [
    ["tr-me-1", "Someone Like You", "Adele"],
    ["tr-me-2", "Fix You", "Coldplay"],
    ["tr-me-3", "The Night We Met", "Lord Huron"],
    ["tr-me-4", "Skinny Love", "Bon Iver"],
    ["tr-me-5", "When the Party's Over", "Billie Eilish"],
    ["tr-me-6", "Mad World", "Gary Jules"],
    ["tr-me-7", "Hurt", "Johnny Cash"],
    ["tr-me-8", "Liability", "Lorde"],
    ["tr-me-9", "All Too Well", "Taylor Swift"],
    ["tr-me-10", "Someone You Loved", "Lewis Capaldi"],
    ["tr-me-11", "Snuff", "Slipknot"],
    ["tr-me-12", "Nothing Compares 2 U", "Sinéad O'Connor"],
  ],
  romantic: [
    ["tr-ro-1", "Perfect", "Ed Sheeran"],
    ["tr-ro-2", "All of Me", "John Legend"],
    ["tr-ro-3", "Thinking Out Loud", "Ed Sheeran"],
    ["tr-ro-4", "Make You Feel My Love", "Adele"],
    ["tr-ro-5", "Lover", "Taylor Swift"],
    ["tr-ro-6", "At Last", "Etta James"],
    ["tr-ro-7", "Can't Help Falling in Love", "Elvis Presley"],
    ["tr-ro-8", "Just the Way You Are", "Bruno Mars"],
    ["tr-ro-9", "A Thousand Years", "Christina Perri"],
    ["tr-ro-10", "Shallow", "Lady Gaga & Bradley Cooper"],
    ["tr-ro-11", "Stay With Me", "Sam Smith"],
    ["tr-ro-12", "Adore You", "Harry Styles"],
  ],
  hype: [
    ["tr-hy-1", "Lose Yourself", "Eminem"],
    ["tr-hy-2", "Till I Collapse", "Eminem"],
    ["tr-hy-3", "Eye of the Tiger", "Survivor"],
    ["tr-hy-4", "Thunderstruck", "AC/DC"],
    ["tr-hy-5", "POWER", "Kanye West"],
    ["tr-hy-6", "SICKO MODE", "Travis Scott"],
    ["tr-hy-7", "HUMBLE.", "Kendrick Lamar"],
    ["tr-hy-8", "Enter Sandman", "Metallica"],
    ["tr-hy-9", "Welcome to the Jungle", "Guns N' Roses"],
    ["tr-hy-10", "X Gon' Give It to Ya", "DMX"],
    ["tr-hy-11", "Indestructible", "Disturbed"],
    ["tr-hy-12", "Remember the Name", "Fort Minor"],
  ],
};

const LIBRARY_REAL = [
  ["mc-1", "Here Comes the Sun", "The Beatles"],
  ["mc-2", "What a Wonderful World", "Louis Armstrong"],
  ["mc-3", "Lean on Me", "Bill Withers"],
  ["mc-4", "Stand By Me", "Ben E. King"],
  ["dr-1", "Born to Run", "Bruce Springsteen"],
  ["dr-2", "Hotel California", "Eagles"],
  ["dr-3", "Sweet Child O' Mine", "Guns N' Roses"],
  ["dr-4", "Life is a Highway", "Tom Cochrane"],
  ["si-1", "Motion Sickness", "Phoebe Bridgers"],
  ["si-2", "Kyoto", "Phoebe Bridgers"],
  ["si-3", "Apocalypse", "Cigarettes After Sex"],
  ["si-4", "Heat Waves", "Glass Animals"],
  ["mg-1", "Stronger", "Kanye West"],
  ["mg-2", "Till I Collapse", "Eminem"],
  ["mg-3", "Eye of the Tiger", "Survivor"],
  ["mg-4", "Lose Yourself", "Eminem"],
  ["aj-1", "Take Five", "Dave Brubeck"],
  ["aj-2", "So What", "Miles Davis"],
  ["aj-3", "Feeling Good", "Nina Simone"],
  ["aj-4", "Autumn Leaves", "Cannonball Adderley"],
];

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreMatch(result, title, artist) {
  const trackNorm = normalize(result.trackName);
  const artistNorm = normalize(result.artistName);
  const titleNorm = normalize(title);
  const artistNormQuery = normalize(artist.split(/ ft\.| feat\.| & /i)[0] ?? artist);

  let score = 0;
  if (trackNorm === titleNorm) score += 50;
  else if (trackNorm.includes(titleNorm) || titleNorm.includes(trackNorm)) score += 30;

  if (artistNorm.includes(artistNormQuery) || artistNormQuery.includes(artistNorm)) {
    score += 40;
  } else {
    const artistTokens = artistNormQuery.split(" ");
    score += artistTokens.filter((token) => artistNorm.includes(token)).length * 8;
  }

  if (result.previewUrl) score += 5;
  return score;
}

async function lookupItunesPreview(artist, title) {
  const term = encodeURIComponent(`${artist} ${title}`);
  const url = `https://itunes.apple.com/search?term=${term}&entity=song&limit=8`;
  const response = await fetch(url);
  if (!response.ok) return null;
  const data = await response.json();
  if (!data.results?.length) return null;

  const ranked = [...data.results]
    .filter((result) => Boolean(result.previewUrl))
    .sort((a, b) => scoreMatch(b, title, artist) - scoreMatch(a, title, artist));

  return ranked[0]?.previewUrl ?? null;
}

async function main() {
  const songs = [
    ...Object.values(TRENDING_BY_MOOD).flat(),
    ...LIBRARY_REAL,
  ];

  const previews = {};
  let found = 0;

  for (const [id, title, artist] of songs) {
    if (previews[id]) continue;
    const previewUrl = await lookupItunesPreview(artist, title);
    if (previewUrl) {
      previews[id] = previewUrl;
      found += 1;
      console.log(`✓ ${id}: ${title} — ${artist}`);
    } else {
      console.warn(`✗ ${id}: ${title} — ${artist}`);
    }
    await new Promise((r) => setTimeout(r, 120));
  }

  const outPath = join(root, "lib", "preview-urls.generated.ts");
  const contents = `/** Auto-generated iTunes 30s preview URLs — do not edit by hand */
export const PREVIEW_URLS_BY_ID: Record<string, string> = ${JSON.stringify(previews, null, 2)};
`;
  writeFileSync(outPath, contents, "utf8");
  console.log(`\nSaved ${found}/${songs.length} previews to lib/preview-urls.generated.ts`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
