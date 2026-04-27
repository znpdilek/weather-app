# �r�n Gereksinim Belgesi (PRD)

**Proje Ad?:** Modern Weather App  
**Tip:** Web Uygulamas?  
**Versiyon:** 1.0.0

---

## 1. Ama�

Kullan?c?n?n d�nyan?n herhangi bir ?ehri i�in anl?k hava durumu bilgisini, modern ve g�rsel olarak zengin bir aray�zde g�rebilece?i bir web uygulamas? geli?tirmek.

Proje ayn? zamanda �?renim ama�l?:

- Modern frontend ekosistemini (React, TypeScript, Tailwind, shadcn/ui) uygulamal? �?renmek
- ���nc� taraf API entegrasyonu deneyimi kazanmak
- Git versiyon kontrol� ve Vercel deploy s�re�lerini deneyimlemek
- AI ile g�rsel �retim teknolojisini bir projede kullanmak

---

## 2. Hedef Kitle

- H?zl? ?ekilde bir ?ehrin hava durumunu �?renmek isteyen son kullan?c?lar
- Frontend geli?tirme s�re�lerini incelemek isteyen geli?tiriciler

---

## 3. Hedefler

### Birincil hedefler

1. Kullan?c? bir ?ehir ad? girip 3 saniye i�inde hava durumu bilgisini g�rebilmeli
2. Aray�z responsive olmal? (mobil, tablet, masa�st�)
3. Hata durumlar?nda (ge�ersiz ?ehir, a? hatas?) kullan?c?ya a�?k mesajlar verilmeli
4. Hava durumuna g�re dinamik g�rseller ile kullan?c? deneyimi zenginle?tirilmeli

### ?kincil hedefler

1. Kod kalitesi: Bile?en bazl?, tip g�venli, s�rd�r�lebilir mimari
2. Performans: Lighthouse performans skoru 90+
3. Eri?ilebilirlik: Klavye ile gezinme, screen reader uyumlulu?u

---

## 4. �zellikler (Functional Requirements)

### F1 � ?ehir Arama

- Kullan?c? bir input alan?na ?ehir ad? yazabilir
- "Ara" butonuna t?klayarak veya Enter'a basarak arama tetiklenir
- Bo? arama �nlenir (input bo?sa istek g�nderilmez)

### F2 � Hava Durumu G�r�nt�leme

- Bulunan ?ehir i�in a?a??daki bilgiler g�sterilir:
  - ?ehir ad? ve �lke kodu
  - S?cakl?k (�C)
  - Hissedilen s?cakl?k (�C)
  - Hava durumu a�?klamas? (T�rk�e)
  - Nem oran? (%)
  - R�zgar h?z? (km/h)
  - Hava durumu ikonu

### F3 � Dinamik Arka Planlar

- Hava durumu ana ko?uluna g�re arka plan g�rseli de?i?ir:
  - **Clear** ? G�ne?li k?rlar
  - **Clouds** ? Par�al? bulutlu manzara
  - **Rain / Drizzle** ? Ya?murlu sokak
  - **Snow** ? Karl? orman
  - **Thunderstorm** ? ?im?ekli g�ky�z�
  - **Mist / Fog / Haze** ? Sisli orman
- G�rseller AI ile �retilmi?tir (Nano Banana yakla??m?)
- G�rsel de?i?iminde 0.7 saniyelik yumu?ak fade-in animasyonu uygulan?r

### F4 � Durum Y�netimi

- **Idle:** Hi�bir arama yap?lmad???nda kar??lama mesaj?
- **Loading:** Arama s?ras?nda "Aran?yor..." g�stergesi
- **Error:** Hata durumunda anla??l?r mesaj (�rn: "?ehir bulunamad?")
- **Success:** Veri ba?ar?yla geldi?inde hava durumu kart?

---

## 5. Functional Olmayan Gereksinimler (Non-Functional)

### N1 � Performans

- ?lk y�klenme s�resi < 2 saniye (Vercel CDN �zerinde)
- API yan?t s�resi < 1 saniye (OpenWeather)
- G�rsel boyutlar? optimize edilmi? (jpg format?)

### N2 � Responsive Tasar?m

- 320px (k���k telefon) ile 1920px (geni? masa�st�) aras?nda sorunsuz �al??mal?
- Mobile-first yakla??m?, Tailwind breakpoint'leri (`sm:`, `md:`)

### N3 � Eri?ilebilirlik

- Semantic HTML (`<header>`, `<main>`, `<form>`)
- ARIA etiketleri (input i�in `aria-label`, dekoratif �?eler i�in `aria-hidden`)
- Klavyeyle tam gezinilebilirlik
- `prefers-reduced-motion` deste?i

### N4 � G�venlik

- API key'ler kodda hardcode edilmeyecek, ortam de?i?keni olarak saklanacak
- `.env` dosyas? `.gitignore`'a ekli
- HTTPS �zerinden API istekleri

### N5 � S�rd�r�lebilirlik

- TypeScript ile tip g�venli?i
- Bile?en bazl? mimari (her bile?en tek sorumluluk)
- Veri katman? ile UI katman?n?n ayr?lmas?
- Tutarl? klas�r yap?s?

---

## 6. Teknoloji Y???n?


| Katman             | Se�im               | Gerek�e                                   |
| ------------------ | ------------------- | ----------------------------------------- |
| Frontend Framework | React 18            | Pop�ler, geni? ekosistem, ment�r iste?i   |
| Dil                | TypeScript          | Tip g�venli?i, IDE deste?i, hata yakalama |
| Build Tool         | Vite                | H?zl? dev server, modern ESM bazl?        |
| Stil               | Tailwind CSS        | Utility-first, h?zl? geli?tirme           |
| UI Bile?enleri     | shadcn/ui           | Modern, accessible, copy-paste yakla??m?  |
| ?konlar            | lucide-react        | Tutarl?, hafif                            |
| API                | OpenWeather         | �cretsiz tier, geni? ?ehir kapsam?        |
| G�rsel �retimi     | AI image generation | Ment�r iste?i (Nano Banana yakla??m?)     |
| Hosting            | Vercel              | Otomatik deploy, �cretsiz tier, CDN       |
| Versiyon Kontrol   | Git + GitHub        | Standart                                  |


---

## 7. Mimari Genel Bak??

```
[ Kullan?c? ]
     ?
[ React UI ]  ?  Tailwind + shadcn/ui
     ?
[ State Y�netimi ]  ?  useState (App.tsx)
     ?
[ API Katman? ]  ?  src/lib/api.ts
     ?
[ OpenWeather API ]
     ?
[ Veri Normalizasyonu ]  ?  src/lib/weather.ts
     ?
[ UI Render ]  ?  WeatherCard + BackgroundShell
```

### Katmanlar

1. **UI Katman?** (`src/components/`) � Sadece g�rsel render, business logic yok
2. **Veri Katman?** (`src/lib/`) � API �a?r?lar?, tip tan?mlar?, normalizasyon
3. **State Katman?** (`App.tsx`) � Uygulaman?n tek state kayna?? (single source of truth)

---

## 8. Ba?ar? Kriterleri

- Kullan?c? bir ?ehir aramas? yap?p hava durumunu g�rebiliyor
- Sonu� ekran? t�m gerekli verileri i�eriyor
- Hata durumlar?nda kullan?c? dostu mesaj g�steriliyor
- Mobil ve masa�st�nde responsive �al???yor
- Hava durumuna g�re arka plan de?i?iyor
- Kod GitHub'a y�klendi
- Vercel'de production'a deploy edildi
- HTTPS �zerinden eri?ilebilir

---

## 9. Olas? Geli?tirmeler (Roadmap)

?leride eklenebilecek �zellikler (mevcut s�r�mde yer alm?yor):

- 5 g�nl�k tahmin (forecast)
- Saatlik hava durumu grafi?i
- Geolocation API ile otomatik mevcut konum
- S?cakl?k birimi se�imi (�C / �F)
- �oklu dil deste?i (i18n)
- Favori ?ehir kaydetme (localStorage)
- Hava kalitesi indeksi (AQI)
- PWA deste?i (offline �al??ma)

---

## 10. Kullan?c? Hikayeleri

> **Kullan?c? 1 (Yolcu):** "Yar?n ?stanbul'a gidiyorum. Ya?mur ya?acak m?, yoksa ?emsiye gerekmiyor mu, h?zl?ca �?renmek istiyorum."  
> ? ?ehir arar, sonucu g�r�r, karar?n? verir.

> **Kullan?c? 2 (Geli?tirici):** "Yeni bir frontend projesi ba?lataca??m. Bu projeyi inceleyerek modern stack nas?l kuruluyor g�rmek istiyorum."  
> ? GitHub'da kodu inceler, README'den teknik detaylar? �?renir.

---

**Dok�man Sahibi:** [@znpdilek](https://github.com/znpdilek)  
**Son G�ncelleme:** 2026-04-27