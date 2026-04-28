# Urun Gereksinim Belgesi (PRD)

**Proje Adi:** Modern Weather App  
**Tip:** Web Uygulamasi  
**Versiyon:** 1.0.0

---

## 1. Amac

Kullanicinin dunyanin herhangi bir sehri icin anlik hava durumu bilgisini, modern ve gorsel olarak zengin bir arayuzde gorebilecegi bir web uygulamasi gelistirmek.

Proje ayni zamanda ogrenim amacli:

- Modern frontend ekosistemini (React, TypeScript, Tailwind, shadcn/ui) uygulamali ogrenmek
- Ucuncu taraf API entegrasyonu deneyimi kazanmak
- Git versiyon kontrolu ve Vercel deploy sureclerini deneyimlemek
- AI ile gorsel uretim teknolojisini bir projede kullanmak

---

## 2. Hedef Kitle

- Hizli sekilde bir sehrin hava durumunu ogrenmek isteyen son kullanicilar
- Frontend gelistirme sureclerini incelemek isteyen gelistiriciler

---

## 3. Hedefler

### Birincil hedefler

1. Kullanici bir sehir adi girip hava durumu bilgisini gorebilmeli
2. Arayuz responsive olmali (mobil, tablet, masaustu)
3. Hata durumlarinda (gecersiz sehir, ag hatasi) kullaniciya acik mesajlar verilmeli
4. Hava durumuna gore dinamik gorseller ile kullanici deneyimi zenginlestirilmeli

### Ikincil hedefler

1. Kod kalitesi: Bilesen bazli, tip guvenli, surdurulebilir mimari
2. Performans: Lighthouse performans skoru 90+
3. Erisilebilirlik: Klavye ile gezinme, screen reader uyumlulugu

---

## 4. Ozellikler (Functional Requirements)

### F0 - Kullanici Authentication (Supabase Auth)
- Yeni kullanici email + sifre ile **kayit** olabilir
- Kayit sonrasi gelen email linki ile hesabini **dogrular**
- Kayitli kullanici email + sifre ile **giris** yapabilir
- Login olmamis kullanici **/login** sayfasina yonlendirilir (ProtectedRoute)
- Header'da kullanici email'i ve **cikis** butonu gosterilir
- Sifreler bcrypt ile hash'lenir (Supabase tarafinda otomatik)
- JWT token'lar localStorage'da saklanir, otomatik yenilenir
- Hatali giris denemeleri kullanici dostu mesajlarla bildirilir

### F1 - Sehir Arama
- Kullanici bir input alanina sehir adi yazabilir
- "Ara" butonuna tiklayarak veya Enter'a basarak arama tetiklenir
- Bos arama onlenir (input bossa istek gonderilmez)

### F2 - Hava Durumu Goruntuleme
- Bulunan sehir icin asagidaki bilgiler gosterilir:
  - Sehir adi ve ulke kodu
  - Sicaklik (C)
  - Hissedilen sicaklik (C)
  - Hava durumu aciklamasi (Turkce)
  - Nem orani (%)
  - Ruzgar hizi (km/h)
  - Hava durumu ikonu

### F3 - Dinamik Arka Planlar
- Hava durumu ana kosuluna gore arka plan gorseli degisir:
  - **Clear** -> Gunesli kirlar
  - **Clouds** -> Parcali bulutlu manzara
  - **Rain / Drizzle** -> Yagmurlu sokak
  - **Snow** -> Karli orman
  - **Thunderstorm** -> Simsekli gokyuzu
  - **Mist / Fog / Haze** -> Sisli orman
- Gorseller AI ile uretilmistir (Nano Banana yaklasimi)
- Gorsel degisiminde 0.7 saniyelik yumusak fade-in animasyonu uygulanir

### F4 - Durum Yonetimi
- **Idle:** Hicbir arama yapilmadiginda karsilama mesaji
- **Loading:** Arama sirasinda "Araniyor..." gostergesi
- **Error:** Hata durumunda anlasilir mesaj (orn: "Sehir bulunamadi")
- **Success:** Veri basariyla geldiginde hava durumu karti

---

## 5. Functional Olmayan Gereksinimler (Non-Functional)

### N1 - Performans
- Ilk yuklenme suresi < 2 saniye (Vercel CDN uzerinde)
- API yanit suresi < 1 saniye (OpenWeather)
- Gorsel boyutlari optimize edilmis (jpg formati)

### N2 - Responsive Tasarim
- 320px (kucuk telefon) ile 1920px (genis masaustu) arasinda sorunsuz calismali
- Mobile-first yaklasimi, Tailwind breakpoint'leri (`sm:`, `md:`)

### N3 - Erisilebilirlik
- Semantic HTML (`<header>`, `<main>`, `<form>`)
- ARIA etiketleri (input icin `aria-label`, dekoratif ogeler icin `aria-hidden`)
- Klavyeyle tam gezinilebilirlik
- `prefers-reduced-motion` destegi

### N4 - Guvenlik
- API key'ler kodda hardcode edilmeyecek, ortam degiskeni olarak saklanacak
- `.env` dosyasi `.gitignore`'a ekli
- HTTPS uzerinden API istekleri

### N5 - Surdurulebilirlik
- TypeScript ile tip guvenligi
- Bilesen bazli mimari (her bilesen tek sorumluluk)
- Veri katmani ile UI katmaninin ayrilmasi
- Tutarli klasor yapisi

---

## 6. Teknoloji Yigini

| Katman | Secim | Gerekce |
|---|---|---|
| Frontend Framework | React 18 | Populer, genis ekosistem, mentor istegi |
| Dil | TypeScript | Tip guvenligi, IDE destegi, hata yakalama |
| Build Tool | Vite | Hizli dev server, modern ESM bazli |
| Stil | Tailwind CSS | Utility-first, hizli gelistirme |
| UI Bilesenleri | shadcn/ui | Modern, accessible, copy-paste yaklasimi |
| Routing | React Router 6 | Standart, declerative, nested routes |
| Authentication | Supabase Auth | Email/password, JWT, hashing, RLS otomatik |
| Database | Supabase (PostgreSQL) | Auth ile entegre, ucretsiz tier |
| Ikonlar | lucide-react | Tutarli, hafif |
| API | OpenWeather | Ucretsiz tier, genis sehir kapsami |
| Gorsel Uretimi | AI image generation | Mentor istegi (Nano Banana yaklasimi) |
| Hosting | Vercel | Otomatik deploy, ucretsiz tier, CDN |
| Versiyon Kontrol | Git + GitHub | Standart |

---

## 6.1 Authentication ve Authorization Kavramlari

### Authentication (Kimlik Dogrulama)

**Tanim:** "Sen kimsin?" sorusunun cevabi. Kullanici kim oldugunu kanitlar.

**Bu projede:** Email + sifre ile yapildi. Supabase Auth servisi kullanilarak:
- Sifreler bcrypt ile hash'lenip saklanir (asla duz metin degil)
- Login sonrasi JWT (JSON Web Token) uretilir
- Token localStorage'da saklanir, otomatik yenilenir
- Email dogrulama ile hesap aktiflestirilir

### Authorization (Yetkilendirme)

**Tanim:** "Ne yapabilirsin?" sorusunun cevabi. Authentication tamamlandiktan sonra kullanicinin hangi kaynaklara erisebilecegine karar verir.

**Bu projede:**
- Login olmamis kullanici sadece **/login** ve **/signup** sayfalarini gorebilir
- Login olmus kullanici hava durumu sayfasina (**/**) erisebilir
- ProtectedRoute bileseni bu kontrolu yapar
- Ileride eklenebilecek RLS (Row Level Security) ile her kullanici sadece kendi verilerini gorebilir

### Kullanilan Guvenlik Teknolojileri

| Teknoloji | Amac |
|---|---|
| **bcrypt hashing** | Sifreler asla duz metin saklanmaz, geriye cevrilemez |
| **JWT (JSON Web Token)** | Her istekte kim oldugunu kanitlar, server stateless calisir |
| **HTTPS** | Tum auth verileri sifrelenmis kanaldan gecer |
| **Email verification** | Hesabin gercek bir email adresine ait oldugunu garantiler |
| **Row Level Security (RLS)** | Veritabani seviyesinde "her kullanici sadece kendi verisini gorur" garantisi |

---

## 7. Mimari Genel Bakis

```
[ Kullanici ]
     |
     v
[ React UI ]  <-  Tailwind + shadcn/ui
     |
     v
[ State Yonetimi ]  <-  useState (App.tsx)
     |
     v
[ API Katmani ]  <-  src/lib/api.ts
     |
     v
[ OpenWeather API ]
     |
     v
[ Veri Normalizasyonu ]  <-  src/lib/weather.ts
     |
     v
[ UI Render ]  <-  WeatherCard + BackgroundShell
```

### Katmanlar

1. **UI Katmani** (`src/components/`) - Sadece gorsel render, business logic yok
2. **Veri Katmani** (`src/lib/`) - API cagrilari, tip tanimlari, normalizasyon
3. **State Katmani** (`App.tsx`) - Uygulamanin tek state kaynagi (single source of truth)

---

## 8. Basari Kriterleri

- [x] Kullanici email + sifre ile kayit olabiliyor (Supabase Auth)
- [x] Email dogrulama ile hesap aktiflestiriliyor
- [x] Login zorunlulugu var, korumali sayfalara erisim guvenli
- [x] Cikis yapma calisiyor
- [x] Kullanici bir sehir aramasi yapip hava durumunu gorebiliyor
- [x] Sonuc ekrani tum gerekli verileri iceriyor
- [x] Hata durumlarinda kullanici dostu mesaj gosteriliyor
- [x] Mobil ve masaustunde responsive calisiyor
- [x] Hava durumuna gore arka plan degisiyor
- [x] Kod GitHub'a yuklendi
- [x] Vercel'de production'a deploy edildi
- [x] HTTPS uzerinden erisilebilir

---

## 9. Olasi Gelistirmeler (Roadmap)

Ileride eklenebilecek ozellikler (mevcut surumde yer almiyor):

- [ ] 5 gunluk tahmin (forecast)
- [ ] Saatlik hava durumu grafigi
- [ ] Geolocation API ile otomatik mevcut konum
- [ ] Sicaklik birimi secimi (C / F)
- [ ] Coklu dil destegi (i18n)
- [ ] Favori sehir kaydetme (localStorage)
- [ ] Hava kalitesi indeksi (AQI)
- [ ] PWA destegi (offline calisma)

---

## 10. Kullanici Hikayeleri

> **Kullanici 1 (Yolcu):** "Yarin Istanbul'a gidiyorum. Yagmur yagacak mi, yoksa semsiye gerekmiyor mu, hizlica ogrenmek istiyorum."  
> -> Sehir arar, sonucu gorur, kararini verir.

> **Kullanici 2 (Gelistirici):** "Yeni bir frontend projesi baslatacagim. Bu projeyi inceleyerek modern stack nasil kuruluyor gormek istiyorum."  
> -> GitHub'da kodu inceler, README'den teknik detaylari ogrenir.

---

**Dokuman Sahibi:** [@znpdilek](https://github.com/znpdilek)  
**Son Guncelleme:** 2026-04-27
