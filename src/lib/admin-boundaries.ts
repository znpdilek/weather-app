import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import type { Feature, GeoJsonObject } from "geojson";

countries.registerLocale(enLocale as countries.LocaleData);

const CACHE_PREFIX = "adm1_geojson_";

export function alpha2ToAlpha3(alpha2: string): string | null {
  return countries.alpha2ToAlpha3(alpha2.toUpperCase()) ?? null;
}

export function buildAdmin1GeoJsonUrl(iso3: string): string {
  const u = iso3.toUpperCase();
  return `https://cdn.jsdelivr.net/gh/wmgeolab/geoBoundaries@master/releaseData/gbOpen/${u}/ADM1/geoBoundaries-${u}-ADM1-all.geojson`;
}

export async function fetchAdmin1GeoJson(iso3: string, signal?: AbortSignal): Promise<GeoJsonObject> {
  const cacheKey = CACHE_PREFIX + iso3.toUpperCase();
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached) as GeoJsonObject;
    }
  } catch {
    /* ignore */
  }

  const url = buildAdmin1GeoJsonUrl(iso3);
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Harita sinirlari yuklenemedi (${iso3}).`);
  }
  const data = (await response.json()) as GeoJsonObject;
  try {
    const str = JSON.stringify(data);
    if (str.length < 4_000_000) {
      sessionStorage.setItem(cacheKey, str);
    }
  } catch {
    /* quota */
  }
  return data;
}

export function regionLabelFromFeature(feature: Feature): string {
  const p = feature.properties as Record<string, unknown> | null | undefined;
  if (!p) return "Bolge";
  const candidates = ["shapeName", "shapeGroup", "ADM1_TR", "NAME_1", "name", "NAME", "NL_NAME_1"];
  for (const key of candidates) {
    const v = p[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "Bolge";
}
