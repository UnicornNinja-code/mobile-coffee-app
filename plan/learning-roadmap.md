# Learning Roadmap — KopiKeliling App
## Dari Nol Hingga Jadi 🚀

Panduan belajar bertahap untuk membangun aplikasi KopiKeliling. 
Setiap fase membangun di atas fondasi fase sebelumnya.

---

## Fase 0: Fondasi Wajib
> Pastikan ini sudah dikuasai sebelum mulai. Jika belum, pelajari dulu.

### 0.1 HTML, CSS, JavaScript Modern
- [ ] HTML5 semantic elements (`section`, `article`, `nav`, `main`)
- [ ] CSS Flexbox & Grid layout
- [ ] JavaScript ES6+: arrow functions, destructuring, spread operator, template literals
- [ ] `async/await` dan `fetch()` API
- [ ] Array methods: `map`, `filter`, `reduce`, `find`
- [ ] Modules: `import` / `export`

📚 Resource: [javascript.info](https://javascript.info)

### 0.2 Git Dasar
- [ ] `git init`, `add`, `commit`, `push`, `pull`
- [ ] Branching: `checkout -b`, `merge`
- [ ] `.gitignore` setup

### 0.3 Terminal / Command Line
- [ ] Navigasi direktori, menjalankan perintah
- [ ] `npm` / `npx` dasar: `install`, `run dev`, `run build`

---

## Fase 1: React & TypeScript
> Framework utama yang dipakai. Pelajari ini sampai nyaman.

### 1.1 React Fundamentals
- [ ] JSX syntax
- [ ] Components (function components)
- [ ] Props dan Children
- [ ] State dengan `useState`
- [ ] Side effects dengan `useEffect`
- [ ] Conditional rendering dan list rendering
- [ ] Event handling (`onClick`, `onChange`, `onSubmit`)
- [ ] Forms: controlled components
- [ ] Lifting state up (share state antar komponen)

📚 Resource: [react.dev/learn](https://react.dev/learn)

### 1.2 React Lanjutan
- [ ] `useRef` untuk akses DOM
- [ ] `useContext` untuk global state sederhana
- [ ] Custom hooks
- [ ] `useMemo` dan `useCallback` (optimasi)
- [ ] React.lazy dan Suspense (code splitting)
- [ ] Error boundaries

### 1.3 TypeScript
- [ ] Tipe dasar: `string`, `number`, `boolean`, `array`, `object`
- [ ] Interface dan Type alias
- [ ] Union types dan Literal types
- [ ] Generics dasar
- [ ] Typing React components: `FC`, props interface, event types
- [ ] Typing state: `useState<Type>()`
- [ ] Utility types: `Partial`, `Pick`, `Omit`, `Record`

📚 Resource: [typescriptlang.org/docs/handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### 🧪 Mini Project Fase 1
> Buat **Todo App** dengan React + TypeScript. CRUD sederhana, data di state lokal.
> Tujuan: memastikan nyaman dengan component, state, props, dan TypeScript.

---

## Fase 2: Next.js 15 (App Router)
> Framework full-stack yang menggabungkan frontend + backend.

### 2.1 App Router Basics
- [ ] Struktur folder `app/` — file-based routing
- [ ] `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- [ ] Dynamic routes: `[id]`, `[...slug]`
- [ ] Route groups: `(auth)`, `(dashboard)`
- [ ] `Link` component dan `useRouter`
- [ ] Metadata API (`generateMetadata`)

### 2.2 Server vs Client Components
- [ ] Default = Server Component (SC)
- [ ] `"use client"` directive — kapan dipakai
- [ ] Data fetching di Server Components
- [ ] Tidak boleh pakai hooks di SC
- [ ] Komposisi: SC membungkus CC

### 2.3 API Routes (Route Handlers)
- [ ] `app/api/*/route.ts` — `GET`, `POST`, `PUT`, `DELETE`
- [ ] Request/Response handling
- [ ] Validasi input dengan Zod
- [ ] Error handling dan status codes

### 2.4 Server Actions
- [ ] `"use server"` directive
- [ ] Form actions tanpa API route
- [ ] `revalidatePath` dan `revalidateTag`

### 2.5 Middleware
- [ ] `middleware.ts` di root project
- [ ] Route protection (redirect jika belum login)
- [ ] Role-based routing

📚 Resource: [nextjs.org/docs](https://nextjs.org/docs)

### 🧪 Mini Project Fase 2
> Upgrade Todo App ke Next.js: simpan data ke JSON file via API routes, tambah halaman login sederhana.

---

## Fase 3: Database — PostgreSQL + PostGIS + Drizzle ORM
> Backend data layer. Ini inti dari sistem geospasial.

### 3.1 PostgreSQL Dasar
- [ ] Install PostgreSQL (via Docker lebih mudah)
- [ ] `CREATE DATABASE`, `CREATE TABLE`
- [ ] Tipe data: `TEXT`, `INTEGER`, `BOOLEAN`, `TIMESTAMP`, `UUID`
- [ ] `INSERT`, `SELECT`, `UPDATE`, `DELETE`
- [ ] `WHERE`, `JOIN`, `GROUP BY`, `ORDER BY`
- [ ] Primary keys, foreign keys, indexes

📚 Resource: [postgresqltutorial.com](https://www.postgresqltutorial.com)

### 3.2 PostGIS (Ekstensi Geospasial)
- [ ] Install ekstensi PostGIS: `CREATE EXTENSION postgis;`
- [ ] Tipe data `GEOMETRY(Point, 4326)` dan `GEOMETRY(Polygon, 4326)`
- [ ] `ST_MakePoint(longitude, latitude)`
- [ ] `ST_Distance()` — hitung jarak 2 titik
- [ ] `ST_DWithin()` — cek apakah dalam radius
- [ ] `ST_Within()` — cek apakah titik di dalam polygon
- [ ] `ST_Centroid()` — hitung titik tengah polygon
- [ ] `::geography` cast untuk jarak dalam meter
- [ ] SRID 4326 (WGS84 — standar GPS)

📚 Resource: [postgis.net/documentation](https://postgis.net/documentation/)

### 3.3 Drizzle ORM
- [ ] Setup: `drizzle.config.ts`, koneksi database
- [ ] Definisi schema: `pgTable`, kolom types
- [ ] Custom type untuk PostGIS geometry
- [ ] Migrations: `drizzle-kit generate` dan `drizzle-kit push`
- [ ] Query builder: `select`, `insert`, `update`, `delete`
- [ ] Joins dan relations
- [ ] Raw SQL dengan `sql` template tag (untuk PostGIS queries)
- [ ] Transaksi

📚 Resource: [orm.drizzle.team/docs](https://orm.drizzle.team/docs/overview)

### 3.4 Docker (untuk PostgreSQL)
- [ ] Install Docker Desktop
- [ ] `docker-compose.yml` untuk PostgreSQL + PostGIS
- [ ] Volume persistence
- [ ] `docker compose up -d`

### 🧪 Mini Project Fase 3
> Buat API CRUD sederhana: simpan lokasi (nama + koordinat) ke PostgreSQL+PostGIS via Drizzle. Bisa query "lokasi dalam radius X meter dari titik Y".

---

## Fase 4: Autentikasi — Better Auth
> Login, session, dan role-based access control.

### 4.1 Setup Better Auth
- [ ] Install `better-auth` dan plugin admin
- [ ] Konfigurasi `auth.ts` dengan PostgreSQL adapter
- [ ] Setup session management

### 4.2 RBAC (Role-Based Access Control)
- [ ] Definisi 2 role: `supervisor`, `rider`
- [ ] `createAccessControl` — permission per resource
- [ ] Middleware protection per route

### 4.3 Auth UI
- [ ] Halaman login (email + password)
- [ ] Halaman register (dengan role selection)
- [ ] Redirect setelah login berdasarkan role
- [ ] Logout

📚 Resource: [better-auth.com/docs](https://www.better-auth.com/docs)

### 🧪 Mini Project Fase 4
> Tambahkan login ke project Fase 3. SPV bisa akses semua, Rider hanya bisa lihat data sendiri.

---

## Fase 5: Peta — Leaflet.js + React-Leaflet
> Visualisasi peta interaktif. Ini komponen UI utama aplikasi.

### 5.1 Leaflet Dasar
- [ ] Setup React-Leaflet di Next.js (dynamic import, `ssr: false`)
- [ ] `MapContainer`, `TileLayer` (OpenStreetMap tiles)
- [ ] `Marker` dan `Popup` — menampilkan titik di peta
- [ ] Custom marker icons (warna berbeda per kategori)
- [ ] `useMap()` hook — kontrol peta secara programatik
- [ ] Zoom, center, bounds

### 5.2 Leaflet Draw
- [ ] Install `react-leaflet-draw`
- [ ] Draw polygon di peta
- [ ] Capture koordinat polygon setelah digambar
- [ ] Edit dan delete polygon
- [ ] Simpan polygon ke database (GeoJSON → PostGIS)

### 5.3 Interaksi Lanjutan
- [ ] GeoJSON layer — render zona sebagai polygon berwarna
- [ ] `Polygon` component dengan style dinamis (warna berdasarkan skor)
- [ ] Marker clustering (jika banyak POI)
- [ ] Popup dengan informasi detail (nama, skor, tombol navigasi)
- [ ] FitBounds — otomatis zoom ke semua marker

📚 Resource: [react-leaflet.js.org](https://react-leaflet.js.org/docs/start-introduction/)

### 🧪 Mini Project Fase 5
> Buat halaman peta: tampilkan POI dari database sebagai marker warna-warni. SPV bisa gambar polygon dan simpan ke database. Polygon tampil di peta sebagai overlay.

---

## Fase 6: Integrasi API Eksternal
> Menghubungkan sistem dengan Overpass-API dan Open-Meteo.

### 6.1 Overpass-API (Data POI)
- [ ] Memahami Overpass QL syntax
- [ ] Query POI berdasarkan area (Surabaya, Sidoarjo)
- [ ] Filter by tag: `amenity=school`, `amenity=university`, `leisure=park`, `landuse=industrial`, `office=*`
- [ ] Parse response JSON → simpan ke database
- [ ] Query jalan protokoler: `highway=primary/trunk/motorway`

📚 Resource: [overpass-turbo.eu](https://overpass-turbo.eu) (interactive query builder)

### 6.2 Open-Meteo API (Cuaca)
- [ ] Endpoint forecast: `api.open-meteo.com/v1/forecast`
- [ ] Parameter: `precipitation_probability` (hourly)
- [ ] Parameter display: `rain`, `weather_code`, `wind_speed_10m`, `relative_humidity_2m`, `dew_point_2m`
- [ ] Parsing response dan caching (hindari rate limit)

📚 Resource: [open-meteo.com/en/docs](https://open-meteo.com/en/docs)

### 6.3 Geolocation API (GPS Rider)
- [ ] `navigator.geolocation.getCurrentPosition()`
- [ ] `navigator.geolocation.watchPosition()` — tracking berkala
- [ ] Handle permission denied
- [ ] Accuracy dan error handling
- [ ] Kirim posisi ke server via `POST /api/location`

### 🧪 Mini Project Fase 6
> Buat halaman yang: (1) scan POI dari Overpass dan tampilkan di peta, (2) tampilkan cuaca dari Open-Meteo, (3) tampilkan posisi user saat ini di peta.

---

## Fase 7: Algoritma SPK — BWM + TOPSIS
> Implementasi inti sistem pendukung keputusan.

### 7.1 Memahami BWM (Teori)
- [ ] Konsep Best-Worst Method (Rezaei, 2015)
- [ ] Best-to-Others vector dan Others-to-Worst vector
- [ ] Formulasi linear programming
- [ ] Simplified BWM (tanpa LP solver)
- [ ] Consistency Index dan threshold

### 7.2 Implementasi BWM (Kode)
- [ ] Form input: pilih Best/Worst criterion
- [ ] Form input: BO dan OW comparison values (1-9)
- [ ] Fungsi `calculateBWMWeights(bo, ow)` → array bobot
- [ ] Fungsi `checkConsistency(weights, bo, ow)` → CI value
- [ ] Simpan bobot ke database

### 7.3 Memahami TOPSIS (Teori)
- [ ] 7 langkah TOPSIS (normalisasi → bobot → ideal → jarak → preferensi → ranking)
- [ ] Benefit vs Cost criteria
- [ ] Vector normalization
- [ ] Solusi ideal positif (A⁺) dan negatif (A⁻)
- [ ] Euclidean distance
- [ ] Nilai preferensi V dan ranking

### 7.4 Implementasi TOPSIS (Kode)
- [ ] Fungsi `buildDecisionMatrix(zones, currentTime, riderPosition, precipProb)`
- [ ] Fungsi `normalizeMatrix(matrix)` — vector normalization
- [ ] Fungsi `applyWeights(normalizedMatrix, bwmWeights)`
- [ ] Fungsi `findIdealSolutions(weightedMatrix, criteriaTypes)`
- [ ] Fungsi `calculateDistances(weightedMatrix, idealPositive, idealNegative)`
- [ ] Fungsi `calculatePreference(distancesPositive, distancesNegative)` → V values
- [ ] Fungsi `rankZones(zones, vValues)` → sorted results
- [ ] API endpoint: `GET /api/recommendations?lat=X&lng=Y`

### 7.5 Integrasi Kriteria
- [ ] C1: Query PostGIS → count POI dalam zona
- [ ] C2: Query PostGIS → count distinct kategori dalam zona
- [ ] C3: Query PostGIS → `ST_Distance` rider ke centroid zona
- [ ] C4: Lookup matriks Likert × jam saat ini × komposisi POI zona
- [ ] C5: Fetch precipitation_probability × α_avg zona

📚 Resource:
- BWM: Rezaei, J. (2015). "Best-worst multi-criteria decision-making method." Omega, 53, 49-57
- TOPSIS: [youtube search "TOPSIS step by step"](https://www.youtube.com/results?search_query=TOPSIS+step+by+step+tutorial)

### 🧪 Mini Project Fase 7
> Buat halaman standalone: input matriks keputusan manual → jalankan TOPSIS → tampilkan ranking. Verifikasi dengan perhitungan manual di Excel.

---

## Fase 8: Styling — Tailwind CSS + shadcn/ui
> Membuat tampilan profesional dan responsif.

### 8.1 Tailwind CSS v4
- [ ] Utility-first concept
- [ ] Responsive design: `sm:`, `md:`, `lg:`
- [ ] Dark mode: `dark:`
- [ ] Custom colors dan spacing
- [ ] Flexbox dan Grid utilities

### 8.2 shadcn/ui
- [ ] Install dan konfigurasi
- [ ] Komponen yang dipakai: Button, Card, Table, Dialog, Form, Input, Select, Tabs, Badge, Sheet, Toast
- [ ] Customisasi tema

📚 Resource: [ui.shadcn.com](https://ui.shadcn.com)

---

## Fase 9: Real-time & Finishing
> Fitur real-time dan polish akhir.

### 9.1 Real-time Location Tracking
- [ ] Rider kirim GPS periodik (30 detik) saat status aktif
- [ ] Server simpan ke `rider_locations`
- [ ] SPV dashboard polling / SSE untuk update posisi rider
- [ ] Tampilkan marker rider yang bergerak di peta

### 9.2 PWA Setup
- [ ] `manifest.json` — app name, icons, theme color
- [ ] Service worker registration (Serwist atau next-pwa)
- [ ] Offline fallback page
- [ ] Install prompt

### 9.3 State Management (Zustand)
- [ ] Store untuk posisi rider
- [ ] Store untuk konfigurasi SPK (bobot, matriks)
- [ ] Store untuk UI state (sidebar, dialog)

📚 Resource: [zustand docs](https://zustand-demo.pmnd.rs/)

### 9.4 Testing & Validasi
- [ ] Tes manual: perhitungan BWM-TOPSIS manual vs output sistem
- [ ] Tes responsif: mobile viewport (360px, 390px, 414px)
- [ ] Tes PWA: install di HP, cek offline
- [ ] Tes geolocation: cek akurasi GPS di lapangan
- [ ] Tes Overpass: pastikan POI Surabaya-Sidoarjo terload

---

## Fase 10: Deployment
> Membawa aplikasi ke production.

### 10.1 Persiapan
- [ ] Environment variables (`.env.production`)
- [ ] Database migration di production
- [ ] Build check: `npm run build` tanpa error

### 10.2 Opsi Deploy
- [ ] **VPS + Docker** (recommended untuk skripsi): Beli VPS murah → install Docker → docker-compose up
- [ ] **Vercel + Supabase**: Vercel untuk Next.js, Supabase untuk PostgreSQL+PostGIS

---

## Timeline Estimasi

| Fase | Topik | Durasi (jika belajar dari 0) | Durasi (jika sudah familiar) |
|---|---|---|---|
| 0 | Fondasi (HTML/CSS/JS) | 2 minggu | skip |
| 1 | React + TypeScript | 2 minggu | 3-4 hari |
| 2 | Next.js 15 | 1 minggu | 2-3 hari |
| 3 | PostgreSQL + PostGIS + Drizzle | 1.5 minggu | 3-4 hari |
| 4 | Better Auth | 3-4 hari | 1-2 hari |
| 5 | Leaflet + Draw | 1 minggu | 2-3 hari |
| 6 | API Eksternal | 3-4 hari | 1-2 hari |
| 7 | BWM + TOPSIS | 1 minggu | 3-4 hari |
| 8 | Tailwind + shadcn | 3-4 hari | 1-2 hari |
| 9 | Real-time + PWA | 1 minggu | 2-3 hari |
| 10 | Deployment | 2-3 hari | 1 hari |
| | **Total** | **~10-12 minggu** | **~3-4 minggu** |

---

## Tips Belajar

1. **Jangan skip mini project** — setiap fase punya mini project yang membangun skill secara bertahap
2. **Fase 1-3 adalah fondasi kritis** — jangan terburu-buru, pastikan paham sebelum lanjut
3. **Fase 7 (SPK) bisa dipelajari paralel** — teori BWM-TOPSIS bisa dibaca sambil belajar frontend
4. **Gunakan ChatGPT/AI** untuk debugging, tapi pastikan paham kodenya
5. **Buat repository Git dari awal** — commit setiap selesai satu checklist item
6. **Dokumentasikan error dan solusi** — ini berguna untuk bab implementasi skripsi
