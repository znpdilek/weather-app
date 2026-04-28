import { normalizeWeatherData, type OpenWeatherResponse, type WeatherData } from "@/lib/weather";

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
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export async function searchCities(query: string, signal?: AbortSignal): Promise<CitySuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 1) return [];

  const url = new URL(PHOTON_URL);
  url.searchParams.set("q", trimmed);
  url.searchParams.set("limit", "20");
  url.searchParams.append("osm_tag", "place:city");
  url.searchParams.append("osm_tag", "place:town");
  url.searchParams.append("osm_tag", "place:village");

  try {
    const response = await fetch(url.toString(), { signal });
    if (!response.ok) return [];

    const data = (await response.json()) as PhotonResponse;
    const normalizedQuery = normalize(trimmed);

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

    return matches.slice(0, 5);
  } catch {
    return [];
  }
}
