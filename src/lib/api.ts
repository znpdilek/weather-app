import { normalizeWeatherData, type OpenWeatherResponse, type WeatherData } from "@/lib/weather";
import { STATIC_CITIES } from "@/data/static-cities";

const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const PHOTON_URL = "https://photon.komoot.io/api";

export interface CitySuggestion {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

function getApiKey(): string {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("API key bulunamadi. Lutfen .env dosyani kontrol et.");
  }
  return apiKey;
}

/** OpenWeather geo 1.0 reverse — ülke, il/eyalet ve yerleşim adı (tıklanan noktaya yakın). */
export interface ReverseGeocodeDetail {
  lat: number;
  lon: number;
  /** Genelde ilçe / kasaba / mahalle düzeyi */
  name: string;
  state?: string;
  /** ISO alpha-2 */
  country: string;
}

export async function reverseGeocodeDetail(
  lat: number,
  lon: number,
  signal?: AbortSignal
): Promise<ReverseGeocodeDetail> {
  const apiKey = getApiKey();
  const url = new URL("https://api.openweathermap.org/geo/1.0/reverse");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("limit", "1");
  url.searchParams.set("appid", apiKey);

  const response = await fetch(url.toString(), { signal });
  if (!response.ok) {
    throw new Error("Konumdan yer adi alinamadi.");
  }
  const rows = (await response.json()) as Array<{
    name?: string;
    state?: string;
    country?: string;
    lat?: number;
    lon?: number;
  }>;
  const row = rows[0];
  if (!row?.name || !row.country) {
    throw new Error("Yer adı bulunamadi.");
  }
  return {
    lat: row.lat ?? lat,
    lon: row.lon ?? lon,
    name: row.name,
    state: row.state,
    country: row.country.toUpperCase()
  };
}

/** Eyalet / bolge sufikslerini sadelestirir */
export function sanitizeAdminSuffix(label: string): string {
  return label
    .replace(/\s+Metropolitan Municipality\s*/i, "")
    .replace(/\s+Metropolitan Borough\s*/i, "")
    .replace(/\s+Province\s*/i, "")
    .replace(/\s+Region\s*$/i, "")
    .replace(/\s+Municipality\s*$/i, "")
    .replace(/\s+County\s*$/i, "")
    .replace(/\s+ili\s*$/i, "")
    .trim();
}

/**
 * UI basligi: TR'de il (Istanbul, Ankara), diger ulkelerde genelde yer adi (sehir kasabasi).
 */
export function headlineCityForMap(detail: ReverseGeocodeDetail): string {
  const locality = sanitizeAdminSuffix(detail.name);
  const state = detail.state?.trim() ? sanitizeAdminSuffix(detail.state) : "";
  const country = detail.country.toUpperCase();
  if (country === "TR" && state) return state;
  return locality || state;
}

/** OpenWeather reverse geocoding: ulke kodu alpha-2 (or. TR, US) */
export async function reverseGeocodeCountry(lat: number, lon: number): Promise<string> {
  const apiKey = getApiKey();
  const url = new URL("https://api.openweathermap.org/geo/1.0/reverse");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("limit", "1");
  url.searchParams.set("appid", apiKey);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Konumdan ulke bilgisi alinamadi.");
  }
  const rows = (await response.json()) as Array<{ country?: string }>;
  const code = rows[0]?.country;
  if (!code) throw new Error("Ulke kodu bulunamadi.");
  return code.toUpperCase();
}

export async function fetchWeatherByCity(city: string): Promise<WeatherData> {
  const apiKey = getApiKey();
  const url = new URL(WEATHER_URL);
  url.searchParams.set("q", city);
  url.searchParams.set("appid", apiKey);
  url.searchParams.set("units", "metric");
  url.searchParams.set("lang", "tr");

  const response = await fetch(url.toString());
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Sehir bulunamadi. Lutfen sehir adini kontrol et.");
    }
    throw new Error("Hava durumu verisi alinamadi. Lutfen tekrar dene.");
  }

  const payload = (await response.json()) as OpenWeatherResponse;
  return normalizeWeatherData(payload);
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  const apiKey = getApiKey();
  const url = new URL(WEATHER_URL);
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("appid", apiKey);
  url.searchParams.set("units", "metric");
  url.searchParams.set("lang", "tr");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Hava durumu verisi alinamadi. Lutfen tekrar dene.");
  }

  const payload = (await response.json()) as OpenWeatherResponse;
  return normalizeWeatherData(payload);
}

interface PhotonFeature {
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    osm_key?: string;
    osm_value?: string;
    name?: string;
    country?: string;
    countrycode?: string;
    city?: string;
    state?: string;
  };
}

interface PhotonResponse {
  features: PhotonFeature[];
}

function normalize(value: string): string {
  let s = value.trim();
  s = s.replace(/\u0130/g, "i").replace(/ı/g, "i");
  s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  s = s
    .replace(/ğ/g, "g")
    .replace(/Ğ/g, "g")
    .replace(/ş/g, "s")
    .replace(/Ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/Ç/g, "c")
    .replace(/ü/g, "u")
    .replace(/Ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/Ö/g, "o");
  return s.toLowerCase();
}

const SEARCH_CACHE = new Map<string, CitySuggestion[]>();
const SEARCH_CACHE_MAX = 48;

function cacheGet(key: string): CitySuggestion[] | undefined {
  const hit = SEARCH_CACHE.get(key);
  if (!hit) return undefined;
  SEARCH_CACHE.delete(key);
  SEARCH_CACHE.set(key, hit);
  return hit;
}

function cacheSet(key: string, value: CitySuggestion[]) {
  if (SEARCH_CACHE.has(key)) SEARCH_CACHE.delete(key);
  SEARCH_CACHE.set(key, value);
  while (SEARCH_CACHE.size > SEARCH_CACHE_MAX) {
    const oldest = SEARCH_CACHE.keys().next().value;
    if (oldest === undefined) break;
    SEARCH_CACHE.delete(oldest);
  }
}

const DISPLAY_LIMIT = 5;
const POOL_LIMIT = 18;

function buildMatches(data: PhotonResponse, normalizedQuery: string): CitySuggestion[] {
  const seen = new Set<string>();
  const matches: CitySuggestion[] = [];

  for (const feature of data.features) {
    const name = feature.properties.name ?? feature.properties.city;
    if (!name) continue;

    const normalizedName = normalize(name);
    if (!normalizedName.startsWith(normalizedQuery)) continue;

    const country = (feature.properties.countrycode ?? "").toUpperCase();
    const key = `${normalizedName}_${country}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const [lon, lat] = feature.geometry.coordinates;
    matches.push({
      name,
      country,
      state: feature.properties.state,
      lat,
      lon,
    });
  }

  return matches.slice(0, POOL_LIMIT);
}

function getLocalCityMatches(trimmed: string): CitySuggestion[] {
  const n = normalize(trimmed);
  if (!n) return [];

  const candidates = STATIC_CITIES.filter((row) => normalize(row.name).startsWith(n));
  candidates.sort((a, b) => a.name.localeCompare(b.name, "tr"));

  const seen = new Set<string>();
  const out: CitySuggestion[] = [];
  for (const row of candidates) {
    const key = `${normalize(row.name)}_${row.country}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      name: row.name,
      country: row.country,
      lat: row.lat,
      lon: row.lon,
      state: row.state,
    });
    if (out.length >= POOL_LIMIT) break;
  }
  return out;
}

/** Aninda: yerel liste (ag yok). */
export function getLocalCitySuggestionsSync(query: string): CitySuggestion[] {
  return getLocalCityMatches(query.trim());
}

function mergeUnique(prefer: CitySuggestion[], extra: CitySuggestion[]): CitySuggestion[] {
  const seen = new Set<string>();
  const out: CitySuggestion[] = [];
  for (const c of [...prefer, ...extra]) {
    const key = `${normalize(c.name)}_${c.country}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c);
    if (out.length >= POOL_LIMIT) break;
  }
  return out;
}

const MIN_LOCAL_MATCHES_SKIP_REMOTE = 5;

async function fetchPhotonMatches(trimmed: string, normalizedQuery: string, signal?: AbortSignal) {
  const url = new URL(PHOTON_URL);
  url.searchParams.set("q", trimmed);
  url.searchParams.set("limit", "30");
  url.searchParams.append("osm_tag", "place:city");
  url.searchParams.append("osm_tag", "place:town");
  url.searchParams.append("osm_tag", "place:village");

  const response = await fetch(url.toString(), { signal });
  if (!response.ok) return [];
  const data = (await response.json()) as PhotonResponse;
  return buildMatches(data, normalizedQuery);
}

/** Yerel liste yeterliyse Photon cagrilmaz (cok daha hizli). */
export async function searchCitiesPool(query: string, signal?: AbortSignal): Promise<CitySuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 1) return [];

  const cacheKey = normalize(trimmed);
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const local = getLocalCityMatches(trimmed);
  if (local.length >= MIN_LOCAL_MATCHES_SKIP_REMOTE) {
    cacheSet(cacheKey, local);
    return local;
  }

  try {
    const remote = await fetchPhotonMatches(trimmed, cacheKey, signal);
    const merged = mergeUnique(local, remote);
    const result = merged.length > 0 ? merged : local;
    cacheSet(cacheKey, result);
    return result;
  } catch {
    if (local.length > 0) {
      cacheSet(cacheKey, local);
      return local;
    }
    return [];
  }
}

export async function searchCities(query: string, signal?: AbortSignal): Promise<CitySuggestion[]> {
  const pool = await searchCitiesPool(query, signal);
  return pool.slice(0, DISPLAY_LIMIT);
}
