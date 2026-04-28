import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { filterCityPool, searchCitiesPool, type CitySuggestion } from "@/lib/api";
import { cn } from "@/lib/utils";

interface SearchFormProps {
  onSelectCity: (city: CitySuggestion) => Promise<void> | void;
  loading: boolean;
}

function countryToFlag(country: string): string {
  if (!country || country.length !== 2) return "";
  return country
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export function SearchForm({ onSelectCity, loading }: SearchFormProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const poolRef = useRef<CitySuggestion[]>([]);
  const poolQueryRef = useRef("");

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length === 0) {
      poolRef.current = [];
      poolQueryRef.current = "";
      setSuggestions([]);
      setSearching(false);
      setOpen(false);
      return;
    }

    if (poolQueryRef.current && !trimmed.startsWith(poolQueryRef.current)) {
      poolRef.current = [];
      poolQueryRef.current = "";
    }

    const canInstant =
      poolQueryRef.current.length > 0 &&
      trimmed.length > poolQueryRef.current.length &&
      trimmed.startsWith(poolQueryRef.current) &&
      poolRef.current.length > 0;

    if (canInstant) {
      const instant = filterCityPool(poolRef.current, trimmed);
      if (instant.length > 0) {
        setSuggestions(instant);
        setOpen(true);
        setActiveIndex(-1);
      }
    }

    const delay = trimmed.length <= 2 ? 85 : 130;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      const instantNow =
        poolQueryRef.current.length > 0 &&
        trimmed.length > poolQueryRef.current.length &&
        trimmed.startsWith(poolQueryRef.current)
          ? filterCityPool(poolRef.current, trimmed)
          : [];
      const quietFetch = instantNow.length > 0;
      if (!quietFetch) setSearching(true);
      try {
        const pool = await searchCitiesPool(trimmed, controller.signal);
        if (controller.signal.aborted) return;
        poolRef.current = pool;
        poolQueryRef.current = trimmed;
        setSuggestions(pool.slice(0, 5));
        setOpen(true);
        setActiveIndex(-1);
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, delay);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = async (city: CitySuggestion) => {
    setQuery(city.name);
    setSuggestions([]);
    poolRef.current = [];
    poolQueryRef.current = "";
    setOpen(false);
    setActiveIndex(-1);
    await onSelectCity(city);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && suggestions.length > 0) {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === "ArrowUp" && suggestions.length > 0) {
      event.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (open && suggestions.length > 0) {
        const target = activeIndex >= 0 ? suggestions[activeIndex] : suggestions[0];
        handleSelect(target);
      }
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const showDropdown = open && query.trim().length > 0;
  const showEmpty = showDropdown && !searching && suggestions.length === 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Sehir ara (ornek: Istanbul, Adana, Paris...)"
          aria-label="Sehir arama"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          autoComplete="off"
          disabled={loading}
          className="h-12 pl-10 pr-10"
        />
        {(searching || loading) && (
          <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-border/70 bg-card/95 shadow-2xl backdrop-blur"
        >
          {suggestions.map((city, index) => {
            const flag = countryToFlag(city.country);
            const subtitle = [city.state, city.country].filter(Boolean).join(", ");
            return (
              <li
                key={`${city.lat}-${city.lon}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
              >
                <button
                  type="button"
                  onClick={() => handleSelect(city)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors",
                    index === activeIndex ? "bg-primary/15" : "hover:bg-muted/60"
                  )}
                >
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1 truncate">
                    <span className="font-medium">{city.name}</span>
                    {subtitle && (
                      <span className="ml-2 text-xs text-muted-foreground">{subtitle}</span>
                    )}
                  </span>
                  {flag && (
                    <span className="text-base" aria-hidden>
                      {flag}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {showEmpty && (
        <div className="absolute z-30 mt-2 w-full rounded-xl border border-border/70 bg-card/95 px-4 py-3 text-sm text-muted-foreground shadow-2xl backdrop-blur">
          "{query}" ile baslayan sehir bulunamadi.
        </div>
      )}
    </div>
  );
}
