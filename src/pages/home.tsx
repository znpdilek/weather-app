import { useState } from "react";
import { CloudSun } from "lucide-react";
import { SearchForm } from "@/components/search-form";
import { WeatherCard } from "@/components/weather-card";
import { StatusState } from "@/components/status-state";
import { BackgroundShell } from "@/components/background-shell";
import { UserMenu } from "@/components/user-menu";
import { fetchWeatherByCoords, type CitySuggestion } from "@/lib/api";
import type { WeatherData } from "@/lib/weather";

export function HomePage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectCity = async (city: CitySuggestion) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeatherByCoords(city.lat, city.lon);
      setWeather({ ...data, city: city.name, country: city.country });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Beklenmeyen bir hata olustu.";
      setError(message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundShell condition={weather?.condition}>
      <header className="mb-8 flex w-full max-w-3xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-border/70 bg-card/80 p-2">
            <CloudSun className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Modern Weather App</h1>
            <p className="text-sm text-muted-foreground">Sehir bazli anlik hava durumu takip uygulamasi</p>
          </div>
        </div>
        <UserMenu />
      </header>

      <SearchForm onSelectCity={handleSelectCity} loading={loading} />

      <main className="mt-6 flex w-full justify-center">
        {loading && <StatusState type="loading" />}
        {!loading && error && <StatusState type="error" message={error} />}
        {!loading && !error && weather && <WeatherCard data={weather} />}
        {!loading && !error && !weather && <StatusState type="idle" />}
      </main>
    </BackgroundShell>
  );
}
