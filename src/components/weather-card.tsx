import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WeatherDetails } from "@/components/weather-details";
import type { WeatherData } from "@/lib/weather";

interface WeatherCardProps {
  data: WeatherData;
}

export function WeatherCard({ data }: WeatherCardProps) {
  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>
              {data.city}, {data.country}
            </CardTitle>
            <CardDescription className="mt-1 capitalize">{data.description}</CardDescription>
          </div>
          <Badge variant="secondary">{data.condition}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-end gap-2">
          <span className="text-6xl font-bold leading-none">{data.temperature}°</span>
          <span className="pb-2 text-sm text-muted-foreground">Hissedilen {data.feelsLike}°</span>
        </div>
        <WeatherDetails data={data} />
      </CardContent>
    </Card>
  );
}