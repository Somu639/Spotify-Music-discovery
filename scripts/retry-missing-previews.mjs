import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outPath = join(root, "lib", "preview-urls.generated.ts");

const MISSING = [
  ["tr-me-1", "Someone Like You", "Adele"],
  ["tr-me-3", "The Night We Met", "Lord Huron"],
  ["tr-me-5", "When the Party's Over", "Billie Eilish"],
  ["tr-me-6", "Mad World", "Gary Jules"],
  ["tr-me-7", "Hurt", "Johnny Cash"],
  ["tr-me-8", "Liability", "Lorde"],
  ["tr-me-10", "Someone You Loved", "Lewis Capaldi"],
  ["tr-ro-1", "Perfect", "Ed Sheeran"],
  ["tr-ro-2", "All of Me", "John Legend"],
  ["tr-ro-6", "At Last", "Etta James"],
  ["tr-ro-10", "Shallow", "Lady Gaga"],
  ["tr-ro-11", "Stay With Me", "Sam Smith"],
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
  ["mc-2", "What a Wonderful World", "Louis Armstrong"],
  ["mc-3", "Lean on Me", "Bill Withers"],
  ["mc-4", "Stand By Me", "Ben E. King"],
  ["dr-2", "Hotel California", "Eagles"],
  ["dr-3", "Sweet Child O' Mine", "Guns N' Roses"],
  ["dr-4", "Life is a Highway", "Tom Cochrane"],
  ["si-1", "Motion Sickness", "Phoebe Bridgers"],
  ["si-2", "Kyoto", "Phoebe Bridgers"],
  ["si-3", "Apocalypse", "Cigarettes After Sex"],
  ["si-4", "Heat Waves", "Glass Animals"],
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
  const trackNorm = normalize(result.trackName ?? result.title ?? "");
  const artistNorm = normalize(result.artistName ?? result.artist?.name ?? "");
  const titleNorm = normalize(title);
  const artistNormQuery = normalize(artist.split(/ ft\.| feat\.| & /i)[0] ?? artist);

  let score = 0;
  if (trackNorm === titleNorm) score += 50;
  else if (trackNorm.includes(titleNorm) || titleNorm.includes(trackNorm)) score += 30;

  if (artistNorm.includes(artistNormQuery) || artistNormQuery.includes(artistNorm)) {
    score += 40;
  }

  if (result.previewUrl || result.preview) score += 5;
  return score;
}

async function lookupItunes(artist, title) {
  const term = encodeURIComponent(`${artist} ${title}`);
  const response = await fetch(
    `https://itunes.apple.com/search?term=${term}&entity=song&limit=8`
  );
  if (!response.ok) return null;
  const data = await response.json();
  const ranked = [...(data.results ?? [])]
    .filter((r) => r.previewUrl)
    .sort((a, b) => scoreMatch(b, title, artist) - scoreMatch(a, title, artist));
  return ranked[0]?.previewUrl ?? null;
}

async function lookupDeezer(artist, title) {
  const query = encodeURIComponent(`artist:"${artist}" track:"${title}"`);
  const response = await fetch(
    `https://api.deezer.com/search/track?q=${query}&limit=8`
  );
  if (!response.ok) return null;
  const data = await response.json();
  const ranked = [...(data.data ?? [])]
    .filter((r) => r.preview)
    .sort((a, b) => scoreMatch(b, title, artist) - scoreMatch(a, title, artist));
  return ranked[0]?.preview ?? null;
}

async function lookup(artist, title) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const itunes = await lookupItunes(artist, title);
    if (itunes) return itunes;
    await new Promise((r) => setTimeout(r, 400));
    const deezer = await lookupDeezer(artist, title);
    if (deezer) return deezer;
    await new Promise((r) => setTimeout(r, 600));
  }
  return null;
}

function loadExisting() {
  const raw = readFileSync(outPath, "utf8");
  const match = raw.match(/=\s*(\{[\s\S]*\});/);
  return match ? JSON.parse(match[1]) : {};
}

async function main() {
  const previews = loadExisting();
  let added = 0;

  for (const [id, title, artist] of MISSING) {
    if (previews[id]) continue;
    const previewUrl = await lookup(artist, title);
    if (previewUrl) {
      previews[id] = previewUrl;
      added += 1;
      console.log(`✓ ${id}: ${title}`);
    } else {
      console.warn(`✗ ${id}: ${title}`);
    }
    await new Promise((r) => setTimeout(r, 450));
  }

  writeFileSync(
    outPath,
    `/** Auto-generated iTunes/Deezer 30s preview URLs — do not edit by hand */\nexport const PREVIEW_URLS_BY_ID: Record<string, string> = ${JSON.stringify(previews, null, 2)};\n`,
    "utf8"
  );

  console.log(`\nAdded ${added} previews (${Object.keys(previews).length} total)`);
}

main().catch(console.error);
