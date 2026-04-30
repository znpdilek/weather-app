export interface WikipediaSummary {
  title: string;
  extract: string;
  thumbnailUrl: string | null;
  pageUrl: string;
}

/** Wikipedia summary thumb cogu zaman ulusal bayrak / armasi; tarihi foto degil — elenir. */
export function isProbablyNationalSymbolThumbnail(url: string | null | undefined): boolean {
  if (!url) return false;
  let u = url.toLowerCase();
  try {
    u = decodeURIComponent(url).toLowerCase();
  } catch {
    /* kullanildi */
  }
  if (/[/_-]flag[_-]?of\b|[/_-]_flag\b|\/flag_of|^flag_of\b|national[_\- ]flag|\/flags?\//i.test(u)) {
    return true;
  }
  if (/[/_]coat[_\- ]of[_\- ]arms|coat_of_arms|great[_\- ]seal|^seal[_\- ]of\b|government[_\- ]seal/i.test(u)) {
    return true;
  }
  if (/national[_\- ]emblem|state[_\- ]emblem|^emblem[_\- ]of\b|armorial|^arms[_\- ]of\b|heraldiska/i.test(u)) {
    return true;
  }
  return false;
}

async function trySummaryWiki(
  lang: "tr" | "en",
  title: string,
  signal?: AbortSignal
): Promise<WikipediaSummary | null> {
  const host = lang === "tr" ? "tr.wikipedia.org" : "en.wikipedia.org";
  const pathTitle = encodeURIComponent(title.replace(/ /g, "_"));
  const url = `https://${host}/api/rest_v1/page/summary/${pathTitle}`;
  const res = await fetch(url, { signal });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    title?: string;
    extract?: string;
    thumbnail?: { source?: string };
    content_urls?: { desktop?: { page?: string } };
    type?: string;
  };

  /** Disambiguation / redirect-only sayfa */
  const type = String(data.type ?? "");
  if (type === "disambiguation") return null;

  const thumb = data.thumbnail?.source ?? null;
  const pageUrl =
    data.content_urls?.desktop?.page ??
    `https://${host}/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;

  return {
    title: data.title ?? title,
    extract: data.extract ?? "",
    thumbnailUrl: thumb,
    pageUrl
  };
}

/** Sehir/im eslesmesi: once sehir/kasaba maddesi, ulke ile sinirlar. Ilce kombinlari yok. */
function landmarkTitleCandidates(cityOrPlaceLabel: string, countryEnglish?: string): string[] {
  const base = cityOrPlaceLabel.trim();
  if (!base) return [];
  const out: string[] = [base];
  if (!base.toLowerCase().includes("province")) out.push(`${base} Province`);
  if (countryEnglish?.trim()) {
    const c = countryEnglish.trim();
    out.push(`${base}, ${c}`);
    out.push(`${base} (${c})`);
  }
  return [...new Set(out)];
}

/**
 * Oncelik: Turkce sonra Ingilizce wiki. Yalnizca bayrak/armasi olmayan gorseli kabul eder.
 */
export async function fetchLandmarkSummary(
  cityOrPlaceDisplayName: string,
  options?: { countryNameHint?: string; signal?: AbortSignal }
): Promise<WikipediaSummary | null> {
  const { countryNameHint, signal } = options ?? {};
  const titles = landmarkTitleCandidates(cityOrPlaceDisplayName, countryNameHint);

  for (const t of titles) {
    const s = await trySummaryWiki("tr", t, signal);
    if (
      s?.thumbnailUrl &&
      !isProbablyNationalSymbolThumbnail(s.thumbnailUrl)
    ) {
      return { ...s, extract: "", thumbnailUrl: s.thumbnailUrl };
    }
  }
  for (const t of titles) {
    const s = await trySummaryWiki("en", t, signal);
    if (
      s?.thumbnailUrl &&
      !isProbablyNationalSymbolThumbnail(s.thumbnailUrl)
    ) {
      return { ...s, extract: "", thumbnailUrl: s.thumbnailUrl };
    }
  }
  return null;
}
