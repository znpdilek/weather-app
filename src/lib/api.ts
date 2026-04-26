import { normalizeWeatherData, type OpenWeatherResponse, type WeatherData } from "@/lib/weather";

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function fetchWeatherByCity(city: string): Promise<WeatherData> {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("API key bulunamadi. Lutfen .env dosyani kontrol et.");
  }

  const url = new URL(BASE_URL);
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