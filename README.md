# Modern Weather App

?ehir bazl?, anl?k hava durumu gösteren modern bir web uygulamas?. OpenWeather API'den canl? veri çeker, hava ko?ullar?na göre AI ile üretilmi? arka plan görselleri kullan?r.

?? **Canl? demo:** [weather-app-iota-eight-56.vercel.app](https://weather-app-iota-eight-56.vercel.app)

![Modern Weather App](public/screenshot.png)

---

## Özellikler

- ?? **?ehir aramas?** — Dünyan?n herhangi bir ?ehri için anl?k hava durumu
- ??? **Detayl? veri** — S?cakl?k, hissedilen, nem, rüzgar h?z?
- ?? **Dinamik arka planlar** — Hava durumuna göre AI ile üretilmi? 6 farkl? görsel (güne?li, bulutlu, ya?murlu, karl?, f?rt?nal?, sisli)
- ?? **Responsive** — Mobil, tablet ve masaüstünde sorunsuz çal???r
- ? **H?zl?** — Vite ile build, Vercel'in CDN'i üzerinde da??t?l?yor
- ??? **Hata yönetimi** — Geçersiz ?ehir, a? hatas? gibi durumlar için kullan?c? dostu mesajlar
- ? **Eri?ilebilir** — `prefers-reduced-motion` deste?i, semantic HTML, ARIA etiketleri

---

## Teknoloji Y???n?

| Katman | Teknoloji |
|---|---|
| Frontend | [React 18](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| Build Tool | [Vite 5](https://vitejs.dev) |
| Stil | [Tailwind CSS 3](https://tailwindcss.com) |
| UI Bile?enleri | [shadcn/ui](https://ui.shadcn.com) (Button, Input, Card, Badge) |
| ?konlar | [lucide-react](https://lucide.dev) |
| API | [OpenWeather](https://openweathermap.org/api) |
| Görsel Üretimi | AI ile üretilmi? arka plan görselleri |
| Deploy | [Vercel](https://vercel.com) |
| Versiyon Kontrol | Git + GitHub |

---

## Klasör Yap?s?

```
weather/
??? public/
?   ??? backgrounds/          # AI ile üretilmi? hava durumu görselleri
?   ?   ??? clear.jpg
?   ?   ??? clouds.jpg
?   ?   ??? rain.jpg
?   ?   ??? snow.jpg
?   ?   ??? thunder.jpg
?   ?   ??? mist.jpg
?   ??? screenshot.png
??? src/
?   ??? components/
?   ?   ??? ui/               # shadcn/ui bile?enleri
?   ?   ?   ??? button.tsx
?   ?   ?   ??? input.tsx
?   ?   ?   ??? card.tsx
?   ?   ?   ??? badge.tsx
?   ?   ??? background-shell.tsx  # Arka plan + overlay
?   ?   ??? search-form.tsx       # ?ehir arama
?   ?   ??? status-state.tsx      # Loading / error / idle durumlar?
?   ?   ??? weather-card.tsx      # Hava durumu kart?
?   ?   ??? weather-details.tsx   # Detay metrikleri
?   ??? lib/
?   ?   ??? api.ts            # OpenWeather API ça?r?lar?
?   ?   ??? weather.ts        # Tip tan?mlar? + yard?mc? fonksiyonlar
?   ?   ??? utils.ts          # cn() yard?mc? fonksiyonu
?   ??? App.tsx               # Ana uygulama bile?eni
?   ??? main.tsx              # Giri? noktas?
?   ??? index.css             # Tailwind direktifleri + tema de?i?kenleri
??? .env.example
??? tailwind.config.ts
??? vite.config.ts
??? package.json
```

---

## Lokal Kurulum

### Gereksinimler

- [Node.js](https://nodejs.org) 18+
- [npm](https://www.npmjs.com) (Node ile birlikte gelir)
- [OpenWeather API key](https://openweathermap.org/api) (ücretsiz)

### Ad?mlar

```bash
# 1. Repo'yu klonla
git clone https://github.com/znpdilek/weather-app.git
cd weather-app

# 2. Ba??ml?l?klar? kur
npm install

# 3. Ortam de?i?kenlerini ayarla
cp .env.example .env
# .env dosyas?n? aç ve VITE_OPENWEATHER_API_KEY de?erini gir

# 4. Geli?tirme sunucusunu ba?lat
npm run dev
```

Taray?c?da `http://localhost:5173` adresini aç.

### Di?er komutlar

| Komut | Aç?klama |
|---|---|
| `npm run dev` | Geli?tirme sunucusunu ba?lat?r (HMR ile) |
| `npm run build` | Production için optimize edilmi? build olu?turur |
| `npm run preview` | Production build'i lokalde önizler |

---

## Mimari Kararlar

### 1. Veri katman? ayr?m? (`src/lib/`)

API ça?r?lar?, tip tan?mlar? ve veri normalizasyonu UI'dan ayr? bir katmana ta??nd?. `src/components/` sadece görsel sunumdan sorumlu.

```
src/lib/api.ts              ? OpenWeather'a HTTP istekleri
src/lib/weather.ts          ? Tip tan?mlar? + normalizeWeatherData
src/components/*            ? Sadece UI
```

### 2. Veri normalizasyonu

`OpenWeatherResponse` (API'den gelen ham JSON) ? `WeatherData` (UI için temizlenmi? ?ekil) dönü?ümü tek bir yerde (`normalizeWeatherData`) yap?l?yor. UI bile?enleri API'nin de?i?iminden etkilenmez.

### 3. Hava durumu ? görsel e?leme

`getWeatherImage(condition)` fonksiyonu OpenWeather'?n `weather.main` alan?n? uygun arka plan görseline e?ler. Yeni bir hava durumu eklemek için sadece bu fonksiyon ve `public/backgrounds/` güncellenir.

### 4. Tema sistemi

Tüm renkler `src/index.css` içinde CSS de?i?kenleri olarak tan?mland? (HSL format?nda). Tek bir de?i?ikli?i de?i?tirerek tüm uygulaman?n temas?n? de?i?tirebilirsin.

```css
:root {
  --primary: 198 93% 60%;
  --background: 222 47% 8%;
  /* ... */
}
```

### 5. Tip güvenli?i

Tüm proje TypeScript ile yaz?ld?. API yan?tlar?, props, state — hepsi tipli. Build a?amas?nda (`tsc -b`) tip hatalar? yakalan?r.

---

## Deploy

Proje [Vercel](https://vercel.com) üzerinde otomatik olarak deploy edilir. `main` branch'e her push i?leminden sonra Vercel otomatik build ba?lat?r.

### Ortam de?i?kenleri

Vercel dashboard ? Project Settings ? Environment Variables:

| Anahtar | De?er | Ortamlar |
|---|---|---|
| `VITE_OPENWEATHER_API_KEY` | OpenWeather API key | Production, Preview |

### Build ayarlar?

Vercel otomatik olarak Vite'? alg?lar:

- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Install command:** `npm install`

---

## Lisans

Bu proje e?itim amaçl? geli?tirilmi?tir.

---

**Geli?tiren:** [@znpdilek](https://github.com/znpdilek)
