import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Landmark,
  Loader2,
  X as XIcon
} from "lucide-react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import {
  type CitySuggestion,
  fetchWeatherByCoords,
  headlineCityForMap,
  reverseGeocodeDetail
} from "@/lib/api";
import type { WeatherData } from "@/lib/weather";
import { fetchLandmarkSummary } from "@/lib/landmark";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { WeatherDetails } from "@/components/weather-details";
import { SearchForm } from "@/components/search-form";
import { Button } from "@/components/ui/button";

countries.registerLocale(enLocale as countries.LocaleData);

/** [lat, lng] - dunya ozeti */
const WORLD_CENTER: [number, number] = [20, 0];
const INITIAL_ZOOM = 2;
const CITY_FLY_ZOOM = 11;

function MapClickProbe({
  onPick
}: {
  onPick: (lat: number, lon: number, screenX: number, screenY: number) => void;
}) {
  useMapEvents({
    click(e) {
      const oe = e.originalEvent as MouseEvent;
      const { lat, lng } = e.latlng;
      onPick(lat, lng, oe.clientX, oe.clientY);
    }
  });
  return null;
}

function FlyToCoords({
  target,
  programmaticMoveRef,
  onComplete
}: {
  target: { lat: number; lon: number; id: number } | null;
  programmaticMoveRef: React.MutableRefObject<boolean>;
  onComplete: (lat: number, lon: number) => void;
}) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    programmaticMoveRef.current = true;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.clearTimeout(safetyTimer);
      map.off("moveend", finish);
      programmaticMoveRef.current = false;
      onComplete(target.lat, target.lon);
    };
    const safetyTimer = window.setTimeout(finish, 2200);
    map.once("moveend", finish);
    map.flyTo([target.lat, target.lon], CITY_FLY_ZOOM, {
      duration: 1.35
    });
    return () => {
      window.clearTimeout(safetyTimer);
      map.off("moveend", finish);
      programmaticMoveRef.current = false;
    };
  }, [target, map, onComplete, programmaticMoveRef]);
  return null;
}

function MapInteractionSearchBridge({
  programmaticMoveRef,
  onInteractStart,
  onSettled
}: {
  programmaticMoveRef: React.MutableRefObject<boolean>;
  onInteractStart: () => void;
  onSettled: () => void;
}) {
  const map = useMap();
  const settleTimerRef = useRef<number>();

  const clearTimer = useCallback(() => {
    if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current);
  }, []);

  const scheduleSettled = useCallback(() => {
    clearTimer();
    settleTimerRef.current = window.setTimeout(() => {
      if (!programmaticMoveRef.current) onSettled();
    }, 480);
  }, [clearTimer, onSettled, programmaticMoveRef]);

  useMapEvents({
    dragstart() {
      if (programmaticMoveRef.current) return;
      clearTimer();
      onInteractStart();
    },
    zoomstart() {
      if (programmaticMoveRef.current) return;
      clearTimer();
      onInteractStart();
    },
    moveend() {
      scheduleSettled();
    }
  });

  useEffect(() => {
    const el = map.getContainer();
    const onWheel = () => {
      if (programmaticMoveRef.current) return;
      clearTimer();
      onInteractStart();
    };
    el.addEventListener("wheel", onWheel, { passive: true });
    return () => el.removeEventListener("wheel", onWheel);
  }, [map, onInteractStart, clearTimer, programmaticMoveRef]);

  useEffect(() => () => clearTimer(), [clearTimer]);
  return null;
}

export default function MapExplorer() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });
  const [regionTitle, setRegionTitle] = useState("");
  const [regionSubtitle, setRegionSubtitle] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [wiki, setWiki] = useState<Awaited<ReturnType<typeof fetchLandmarkSummary>>>(null);
  const [wikiLoading, setWikiLoading] = useState(false);
  const [searchBarVisible, setSearchBarVisible] = useState(true);
  const [flyTo, setFlyTo] = useState<{
    lat: number;
    lon: number;
    id: number;
  } | null>(null);
  const programmaticMoveRef = useRef(false);

  const closePopover = useCallback(() => {
    setPopoverOpen(false);
  }, []);

  const openPlaceDetail = useCallback(
    async (lat: number, lon: number, anchorX: number, anchorY: number) => {
      setAnchor({ x: anchorX, y: anchorY });
      setPopoverOpen(true);
      setRegionTitle("");
      setRegionSubtitle("");
      setWeather(null);
      setWiki(null);
      setWeatherLoading(true);
      setWikiLoading(true);

      try {
        const detail = await reverseGeocodeDetail(lat, lon);
        const countryName = countries.getName(detail.country, "en") ?? detail.country;
        const headline = headlineCityForMap(detail);
        setRegionTitle(headline);
        setRegionSubtitle(countryName);

        const [w, land] = await Promise.all([
          fetchWeatherByCoords(lat, lon),
          fetchLandmarkSummary(headline, { countryNameHint: countryName })
        ]);
        setWeather({ ...w, city: headline, country: detail.country });
        setWiki(land);
      } catch {
        setRegionTitle("Konum algilanamadi");
        setRegionSubtitle("Karada baska bir nokta deneyin.");
        setWeather(null);
        setWiki(null);
      } finally {
        setWeatherLoading(false);
        setWikiLoading(false);
      }
    },
    []
  );

  const onFlightEnded = useCallback(
    (lat: number, lon: number) => {
      void openPlaceDetail(lat, lon, window.innerWidth / 2, window.innerHeight * 0.42);
      setFlyTo(null);
    },
    [openPlaceDetail]
  );

  const handleMapPick = useCallback(
    (lat: number, lon: number, screenX: number, screenY: number) => {
      void openPlaceDetail(lat, lon, screenX, screenY);
    },
    [openPlaceDetail]
  );

  const onSelectCity = useCallback((_city: CitySuggestion) => {
    programmaticMoveRef.current = true;
    setFlyTo({ lat: _city.lat, lon: _city.lon, id: Date.now() });
  }, []);

  return (
    <div className="relative flex min-h-[min(720px,calc(100dvh-4.5rem))] flex-1 flex-col md:min-h-[calc(100dvh-4.5rem)]">
      <Popover modal={false} open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverAnchor asChild>
          <span
            className="pointer-events-none fixed block h-px w-px opacity-0"
            style={{ left: anchor.x, top: anchor.y }}
            aria-hidden
          />
        </PopoverAnchor>
        <PopoverContent
          side="bottom"
          align="center"
          sideOffset={10}
          collisionPadding={20}
          avoidCollisions
          className="w-[min(96vw,52rem)] max-w-none p-0 shadow-xl"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-2 sm:px-4">
            <Button type="button" variant="ghost" size="icon" aria-label="Kapat ve haritaya don" onClick={closePopover}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="sr-only sm:not-sr-only sm:flex-1 sm:text-center sm:text-xs sm:font-medium sm:text-muted-foreground">
              Bolge karti (Popover)
            </span>
            <Button type="button" variant="ghost" size="icon" aria-label="Kapat" onClick={closePopover}>
              <XIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="max-h-[min(78vh,40rem)] space-y-4 overflow-y-auto p-4 sm:p-5">
            <div>
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl" id="map-popover-heading">
                {regionTitle || "Yukleniyor..."}
              </h2>
              {regionSubtitle ? (
                <p className="mt-1 text-sm text-muted-foreground">{regionSubtitle}</p>
              ) : null}
            </div>

            <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/30">
              {wikiLoading && !wiki?.thumbnailUrl && (
                <div className="flex aspect-[16/9] max-h-[min(38vh,22rem)] min-h-[11rem] items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
              {!wikiLoading && wiki?.thumbnailUrl && (
                <img
                  src={wiki.thumbnailUrl}
                  alt=""
                  className="aspect-[16/9] max-h-[min(38vh,24rem)] w-full object-cover object-center"
                />
              )}
              {!wikiLoading && !wiki?.thumbnailUrl && (
                <div
                  className="flex aspect-[16/9] max-h-[min(38vh,22rem)] min-h-[11rem] flex-col items-center justify-center gap-2 bg-muted/50 text-muted-foreground"
                  aria-label="Wikipedia tarihi yapi gorseli yok"
                >
                  <Landmark className="h-10 w-10 opacity-60" aria-hidden />
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="sr-only">Anlik hava</h3>
              {weatherLoading && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
              {!weatherLoading && weather && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-baseline gap-2 gap-y-1">
                    <span className="text-4xl font-bold tabular-nums">
                      {weather.temperature}{"\u00b0"}
                    </span>
                    <span className="text-muted-foreground capitalize">{weather.description}</span>
                  </div>
                  <WeatherDetails data={weather} />
                </div>
              )}
              {!weatherLoading && !weather && (
                <p className="text-sm text-muted-foreground">Hava verisi alinamadi.</p>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div
        className={`pointer-events-none absolute left-1/2 top-3 z-[450] w-[min(96vw,28rem)] -translate-x-1/2 transition-opacity duration-200 ${
          searchBarVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`rounded-xl border border-border/70 bg-card/95 p-2 shadow-lg backdrop-blur ${
            searchBarVisible ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <SearchForm loading={false} onSelectCity={onSelectCity} />
        </div>
      </div>

      <MapContainer
        center={WORLD_CENTER}
        zoom={INITIAL_ZOOM}
        minZoom={2}
        maxZoom={18}
        worldCopyJump
        className="relative z-0 h-full min-h-[min(720px,calc(100dvh-4.5rem))] w-full flex-1 rounded-b-lg md:rounded-lg"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyToCoords
          target={flyTo}
          programmaticMoveRef={programmaticMoveRef}
          onComplete={onFlightEnded}
        />
        <MapInteractionSearchBridge
          programmaticMoveRef={programmaticMoveRef}
          onInteractStart={() => setSearchBarVisible(false)}
          onSettled={() => setSearchBarVisible(true)}
        />
        <MapClickProbe onPick={handleMapPick} />
      </MapContainer>

      <p className="pointer-events-none absolute bottom-3 left-1/2 z-[400] max-w-[min(92vw,30rem)] -translate-x-1/2 rounded-lg border border-border/60 bg-background/90 px-3 py-2 text-center text-xs text-muted-foreground shadow-sm backdrop-blur-sm">
        Detay karti shadcn Popover (modal kapali); tiklama noktasina yapiskan akis, kenar icin pozisyon otomatik ayarlanir. Fotograf ve hava.
      </p>
    </div>
  );
}
