export interface OpenWeatherResponse {
    name: string;
    sys: { country: string };
    main: { temp: number; feels_like: number; humidity: number };
    wind: { speed: number };
    weather: Array<{ main: string; description: string; icon: string }>;
  }
  
  export interface WeatherData {
    city: string;
    country: string;
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    description: string;
    icon: string;
  }
  
  export function normalizeWeatherData(data: OpenWeatherResponse): WeatherData {
    const primary = data.weather[0];
    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      windSpeed: Number((data.wind.speed * 3.6).toFixed(1)),
      condition: primary?.main ?? "Unknown",
      description: primary?.description ?? "No description",
      icon: primary?.icon ?? "01d"
    };
  }
  
  export function getWeatherTheme(condition: string) {
    const key = condition.toLowerCase();
    if (key.includes("clear")) return "from-sky-400/40 via-blue-500/20 to-indigo-900/90";
    if (key.includes("cloud")) return "from-slate-400/30 via-gray-500/20 to-slate-900/90";
    if (key.includes("rain") || key.includes("drizzle")) return "from-cyan-500/30 via-blue-700/20 to-slate-950/90";
    if (key.includes("thunder")) return "from-violet-500/30 via-indigo-700/20 to-slate-950/90";
    if (key.includes("snow")) return "from-cyan-100/40 via-blue-200/20 to-slate-700/90";
    if (key.includes("mist") || key.includes("fog") || key.includes("haze")) return "from-gray-300/30 via-slate-500/20 to-slate-900/90";
    return "from-zinc-500/30 via-slate-700/20 to-slate-950/90";
  }