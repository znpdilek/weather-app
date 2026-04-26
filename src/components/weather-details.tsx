import { Droplets, Wind } from "lucide-react";
import type { WeatherData } from "@/lib/weather";

interface WeatherDetailsProps {
  data: WeatherData;
}

export function WeatherDetails({ data }: WeatherDetailsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-lg border border-border/70 bg-secondary/50 p-3">
        <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
          <Droplets className="h-4 w-4" />
          Nem
        </div>
        <p className="text-lg font-semibold">{data.humidity}%</p>
      </div>
      <div className="rounded-lg border border-border/70 bg-secondary/50 p-3">
        <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
          <Wind className="h-4 w-4" />
          Ruzgar
        </div>
        <p className="text-lg font-semibold">{data.windSpeed} km/h</p>
      </div>
    </div>
  );
}
