# Desain SPK BWM-TOPSIS — Final
## Penentuan Lokasi Penjual Kopi Keliling "Sejuta Jiwa"
### Wilayah Operasional: Kabupaten Surabaya & Sidoarjo

---

## 1. Metode: Hybrid BWM-TOPSIS

| Komponen | Metode | Fungsi | Pelaku |
|---|---|---|---|
| **Pembobotan** | BWM (Best-Worst Method, Rezaei 2015) | Menentukan bobot preferensi 5 kriteria | Supervisor (offline, 1x setup) |
| **Perankingan** | TOPSIS (Hwang & Yoon, 1981) | Meranking zona berdasarkan kedekatan ke solusi ideal | Sistem (real-time, setiap request) |

---

## 2. Arsitektur: Pipeline Filter → TOPSIS

```
  Overpass-API → Semua POI Surabaya-Sidoarjo
         │
         ▼
  ┌─────────────────────────────────┐
  │ FILTER 1: Jalur Protokoler      │
  │ Buang POI dalam buffer 50m dari │──→ GUGUR ❌
  │ highway=primary/trunk/motorway  │
  └──────────┬──────────────────────┘
             │
             ▼
  ┌─────────────────────────────────┐
  │ FILTER 2: Zona Operasional SPV  │
  │ Hanya POI di dalam polygon zona │──→ DI LUAR ZONA ⏸️
  │ yang digambar SPV (ST_Within)   │
  └──────────┬──────────────────────┘
             │
             ▼
  ┌─────────────────────────────────┐
  │ FILTER 3: Radius Rider          │
  │ Hanya zona dalam jarak ≤5km     │──→ TERLALU JAUH 🚫
  │ dari posisi GPS rider saat ini  │
  └──────────┬──────────────────────┘
             │
             ▼
  ┌─────────────────────────────────┐
  │ TOPSIS RANKING                  │
  │ Hitung C1-C5 per zona           │
  │ Bobot dari BWM                  │
  │ Output: Top 3-5 zona + skor     │
  └─────────────────────────────────┘
```

---

## 3. Filter 1 — Eksklusi Jalur Protokoler

| Aspek | Detail |
|---|---|
| **Aturan** | Rider dilarang berjualan di/dekat jalur protokoler |
| **Definisi Teknis** | Jalan OSM `highway = primary \| trunk \| motorway` |
| **Buffer** | 50m dari garis jalan |
| **Sumber Data** | Overpass-API (road network) → tabel `protocol_roads` di PostGIS |

**Query Overpass:**
```
[out:json][timeout:30];
area["name"="Surabaya"]->.a;
area["name"="Sidoarjo"]->.b;
(
  way["highway"~"^(primary|trunk|motorway)$"](area.a);
  way["highway"~"^(primary|trunk|motorway)$"](area.b);
);
out geom;
```

**Query PostGIS:**
```sql
-- POI yang LOLOS filter (tidak di jalur protokoler)
SELECT poi.* FROM points_of_interest poi
WHERE NOT EXISTS (
  SELECT 1 FROM protocol_roads pr
  WHERE ST_DWithin(poi.geom::geography, pr.geom::geography, 50)
);
```

---

## 4. Filter 2 — Zona Operasional (Validasi Traffic oleh SPV)

| Aspek | Detail |
|---|---|
| **Aturan** | SPV menggambar polygon di peta untuk area yang tervalidasi traffic-nya |
| **Tool** | Leaflet Draw di dashboard Management |
| **Mekanisme** | POI di dalam zona = valid, POI di luar = tidak masuk TOPSIS |
| **Verifikasi** | Dinamis via `ST_Within(poi.geom, zona.boundary)` |

**Skema Database:**
```sql
CREATE TABLE operational_zones (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  boundary    GEOMETRY(Polygon, 4326) NOT NULL,
  is_active   BOOLEAN DEFAULT true,
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMP DEFAULT now(),
  updated_at  TIMESTAMP DEFAULT now()
);
```

**Query POI terverifikasi:**
```sql
SELECT poi.*
FROM points_of_interest poi
JOIN operational_zones oz ON ST_Within(poi.geom, oz.boundary)
WHERE oz.is_active = true;
```

---

## 5. Alternatif TOPSIS = Centroid Zona Operasional

Alternatif bukan individual POI, melainkan **zona operasional** yang diwakili oleh centroid-nya.

| Aspek | Detail |
|---|---|
| **Apa itu alternatif?** | Setiap Zona Operasional yang dibuat SPV |
| **Titik representasi** | Centroid geometri zona: `ST_Centroid(zona.boundary)` |
| **Jumlah alternatif** | = jumlah zona aktif (estimasi 10-20 zona) |
| **Output untuk rider** | Rekomendasi AREA, bukan titik GPS spesifik |

**Mengapa bukan individual POI:**
- POI berdekatan (100-200m) menghasilkan skor hampir identik → redundan
- Rider pergi ke AREA, bukan titik spesifik — lebih natural
- Jumlah alternatif terkontrol dan benar-benar berbeda karakteristiknya

**Contoh alternatif:**

| ID | Zona | Centroid | POI di Dalam |
|---|---|---|---|
| A1 | Kampus ITS | -7.2820, 112.7954 | 12 POI (kampus, sekolah, kantor) |
| A2 | SIER Rungkut | -7.3280, 112.7610 | 8 POI (pabrik, kantor) |
| A3 | Jl. HR Muhammad | -7.2910, 112.7250 | 6 POI (kantor) |
| A4 | Taman Bungkul | -7.2950, 112.7420 | 3 POI (taman, sekolah) |
| A5 | Industri Berbek | -7.3450, 112.7380 | 5 POI (pabrik) |

---

## 6. Kriteria (5 Kriteria)

### C1 — Densitas POI (Benefit ↑)

| Aspek | Detail |
|---|---|
| **Definisi** | Jumlah POI (dari 5 kategori) di dalam zona |
| **Sumber Data** | Overpass-API → PostGIS |
| **Satuan** | Jumlah POI (integer) |
| **Rasional** | Semakin banyak POI = semakin banyak potensi pelanggan |

```sql
SELECT COUNT(*) FROM points_of_interest poi
JOIN operational_zones oz ON ST_Within(poi.geom, oz.boundary)
WHERE oz.id = [zona_id];
```

---

### C2 — Diversitas Jenis POI (Benefit ↑)

| Aspek | Detail |
|---|---|
| **Definisi** | Jumlah kategori POI unik di dalam zona |
| **Sumber Data** | Overpass-API → PostGIS |
| **Satuan** | Jumlah kategori (1-5) |
| **Rasional** | Variasi POI = target pasar lebih luas sepanjang hari |

```sql
SELECT COUNT(DISTINCT poi.category) FROM points_of_interest poi
JOIN operational_zones oz ON ST_Within(poi.geom, oz.boundary)
WHERE oz.id = [zona_id];
```

**5 Kategori POI:** Sekolah, Kampus, Taman Kota, Pabrik, Kantor

---

### C3 — Jarak dari Rider (Cost ↓)

| Aspek | Detail |
|---|---|
| **Definisi** | Jarak geodesik dari posisi rider ke centroid zona |
| **Sumber Data** | GPS rider → PostGIS |
| **Satuan** | Meter |
| **Rasional** | Semakin dekat = semakin efisien (BBM, waktu) |

```sql
SELECT ST_Distance(
  rider_position::geography,
  ST_Centroid(oz.boundary)::geography
) AS distance_m
FROM operational_zones oz
WHERE oz.id = [zona_id];
```

> Kriteria **cost** — dalam TOPSIS, solusi ideal = nilai minimum.

---

### C4 — Skor Keramaian (Benefit ↑)

| Aspek | Detail |
|---|---|
| **Definisi** | Estimasi keramaian zona berdasarkan jam saat ini × jenis POI |
| **Sumber Data** | Matriks Likert (wawancara SPV) |
| **Satuan** | Skala 1-5 |
| **Rasional** | Potensi penjualan bergantung pada jam ramai setiap jenis POI |

**Matriks Interval Waktu × Jenis POI (diisi oleh SPV):**

| Jam Operasi | Sekolah | Kampus | Taman Kota | Pabrik | Kantor |
|---|---|---|---|---|---|
| 06:00-08:00 | ___ | ___ | ___ | ___ | ___ |
| 08:00-10:00 | ___ | ___ | ___ | ___ | ___ |
| 10:00-12:00 | ___ | ___ | ___ | ___ | ___ |
| 12:00-14:00 | ___ | ___ | ___ | ___ | ___ |
| 14:00-16:00 | ___ | ___ | ___ | ___ | ___ |
| 16:00-18:00 | ___ | ___ | ___ | ___ | ___ |
| 18:00-20:00 | ___ | ___ | ___ | ___ | ___ |

> Skala: 1=Sangat Sepi, 2=Sepi, 3=Sedang, 4=Ramai, 5=Sangat Ramai

**Formula:**
```
1. Ambil jam saat ini → tentukan baris matriks
2. Hitung POI per kategori di dalam zona
3. C4 = Σ(jumlah_POI_kategori_i × skor_likert_i) / total_POI_zona

Contoh: Zona A pada jam 12:30
- 2 Kampus (skor=5), 1 Kantor (skor=5)
- C4 = (2×5 + 1×5) / 3 = 5.0
```

---

### C5 — Ketahanan Cuaca Lokasi (Benefit ↑)

| Aspek | Detail |
|---|---|
| **Definisi** | Skor ketahanan zona terhadap kondisi cuaca saat ini |
| **Parameter Komputasi** | Precipitation Probability saja (0-100%) dari Open-Meteo API |
| **Satuan** | Skor 0-100 |

**Koefisien Sensitivitas Cuaca (α) per Jenis POI (dari wawancara SPV):**

| Jenis POI | α | Penjelasan |
|---|---|---|
| Kantor | 0.90 | Indoor — tahan cuaca |
| Pabrik | 0.85 | Indoor — tahan cuaca |
| Kampus | 0.60 | Campuran indoor/outdoor |
| Sekolah | 0.55 | Campuran indoor/outdoor |
| Taman Kota | 0.20 | Outdoor — sangat sensitif |

**Formula:**
```
PP    = precipitation_probability dari Open-Meteo (0-100%)
S     = 100 - PP
α_avg = Σ(jumlah_POI_kategori_i × α_i) / total_POI_zona
C5    = S + (100 - S) × α_avg
```

**Contoh (PP = 70%, Zona: 2 Kantor + 1 Kampus):**
```
S     = 100 - 70 = 30
α_avg = (2×0.90 + 1×0.60) / 3 = 0.80
C5    = 30 + (100 - 30) × 0.80 = 30 + 56 = 86.0
```

**Parameter display-only di UI** (tidak untuk TOPSIS):
rain, weather_code, wind_speed, relative_humidity, dew_point

---

## 7. Ringkasan Kriteria

| Kode | Kriteria | Tipe | Sumber | Formula Singkat |
|---|---|---|---|---|
| **C1** | Densitas POI | Benefit ↑ | PostGIS | COUNT POI dalam zona |
| **C2** | Diversitas POI | Benefit ↑ | PostGIS | COUNT DISTINCT kategori dalam zona |
| **C3** | Jarak dari Rider | Cost ↓ | GPS+PostGIS | ST_Distance ke centroid zona (m) |
| **C4** | Skor Keramaian | Benefit ↑ | Likert×Jam | Rata-rata tertimbang (1-5) |
| **C5** | Ketahanan Cuaca | Benefit ↑ | PP×α | S + (100-S) × α_avg |

---

## 8. BWM — Pembobotan Kriteria

### Input dari SPV (1x setup, bisa diupdate)

**Langkah 1:** SPV pilih kriteria terbaik dan terburuk
```
Best criterion  = (misal: C4 - Keramaian)
Worst criterion = (misal: C3 - Jarak)
```

**Langkah 2:** SPV isi Best-to-Others (BO) — skala 1-9
```
"Seberapa lebih penting [Best] dibanding [Cj]?"

| Best→ | C1 | C2 | C3 | C4 | C5 |
|-------|----|----|----|----|----| 
| C4    |  3 |  4 |  7 |  1 |  2 |
```

**Langkah 3:** SPV isi Others-to-Worst (OW) — skala 1-9
```
"Seberapa lebih penting [Ci] dibanding [Worst]?"

| →Worst | C3 |
|--------|----| 
| C1     |  5 |
| C2     |  4 |
| C3     |  1 |
| C4     |  7 |
| C5     |  6 |
```

**Total input:** 2×5 - 3 = **7 nilai** (jauh lebih sedikit dari AHP: 10 nilai)

### Perhitungan Bobot (Simplified BWM)

```
1. Bobot awal: w_j = 1 / a_Bj
   w1=1/3, w2=1/4, w3=1/7, w4=1/1, w5=1/2

2. Normalisasi: w_j = w_j / Σw_j
   Σ = 0.333+0.250+0.143+1.000+0.500 = 2.226
   w1=0.150, w2=0.112, w3=0.064, w4=0.449, w5=0.225

3. Consistency Index:
   ξ = max|w_B/w_j - a_Bj| untuk semua j
   Cek: ξ < threshold → Konsisten ✅
```

**Tabel Threshold Konsistensi BWM:**

| a_BW | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| **ξ max** | 0.00 | 0.44 | 1.00 | 1.63 | 2.30 | 3.00 | 3.73 | 4.47 | 5.23 |

---

## 9. TOPSIS — Perankingan Zona

### Langkah-langkah

**Step 1:** Susun Matriks Keputusan

| | C1 | C2 | C3 (m) | C4 | C5 |
|---|---|---|---|---|---|
| A1 (ITS) | 12 | 3 | 2400 | 4.5 | 86.0 |
| A2 (SIER) | 8 | 2 | 3100 | 3.8 | 89.8 |
| A3 (HR Muh) | 6 | 1 | 1800 | 4.2 | 90.5 |
| A4 (Bungkul) | 3 | 2 | 900 | 3.0 | 56.3 |
| A5 (Berbek) | 5 | 1 | 4200 | 3.5 | 88.2 |

**Step 2:** Normalisasi (Vector Normalization)
```
r_ij = x_ij / √(Σ x_ij²)
```

**Step 3:** Matriks Terbobot
```
v_ij = w_j × r_ij   (w dari BWM)
```

**Step 4:** Solusi Ideal Positif (A⁺) dan Negatif (A⁻)
```
A⁺ = (max benefit, min cost) per kolom
A⁻ = (min benefit, max cost) per kolom
```

**Step 5:** Jarak Euclidean
```
D⁺_i = √(Σ (v_ij - A⁺_j)²)
D⁻_i = √(Σ (v_ij - A⁻_j)²)
```

**Step 6:** Nilai Preferensi
```
V_i = D⁻_i / (D⁺_i + D⁻_i)
```

**Step 7:** Ranking berdasarkan V (descending)

---

## 10. Output Sistem

| Aspek | Spesifikasi |
|---|---|
| **Jumlah rekomendasi** | Top 3-5 zona |
| **Threshold** | V < 0.3 → tidak ditampilkan |
| **Visualisasi peta** | 🟢 V ≥ 0.7 (Sangat Direkomendasikan) |
| | 🟡 0.5 ≤ V < 0.7 (Direkomendasikan) |
| | 🔴 V < 0.5 (Kurang Direkomendasikan) |
| **Info per zona** | Nama, skor V, breakdown kriteria, jumlah POI |
| **Navigasi** | Tombol "Navigasi" → Google Maps ke centroid zona |

---

## 11. Alur Lengkap Sistem

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│  TAHAP OFFLINE (Setup 1x oleh SPV)                               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ 1. SPV gambar Zona Operasional di peta (Leaflet Draw)      │  │
│  │ 2. SPV isi Matriks Likert Keramaian (7 jam × 5 kategori)  │  │
│  │ 3. SPV isi Koefisien α Sensitivitas Cuaca (5 nilai)        │  │
│  │ 4. SPV isi BWM: Best/Worst + BO + OW (7 nilai)            │  │
│  │ 5. Sistem hitung bobot BWM → simpan ke database            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  TAHAP REAL-TIME (Setiap rider request rekomendasi)              │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ 1. Ambil posisi GPS rider                                  │  │
│  │ 2. Filter zona: protokoler → zona aktif → radius 5km      │  │
│  │ 3. Hitung C1-C2 per zona (PostGIS count)                   │  │
│  │ 4. Hitung C3 per zona (jarak ke centroid)                   │  │
│  │ 5. Hitung C4 per zona (Likert × jam saat ini)              │  │
│  │ 6. Fetch PP dari Open-Meteo → Hitung C5 per zona          │  │
│  │ 7. Jalankan TOPSIS (normalisasi → bobot → ideal → jarak)  │  │
│  │ 8. Return Top-N zona + skor V                              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  OUTPUT                                                           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Peta dengan zona berwarna (hijau/kuning/merah)             │  │
│  │ + breakdown skor per kriteria                               │  │
│  │ + tombol navigasi                                           │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  POS LOG (Feedback untuk evaluasi masa depan)                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Rider catat: zona, jam, jumlah cup terjual                  │  │
│  │ → Data untuk validasi akurasi SPK di bab pengujian          │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 12. Batasan Penelitian

1. Area operasional: Kabupaten Surabaya dan Sidoarjo
2. Data POI: Overpass-API → PostGIS, 5 kategori (Sekolah, Kampus, Taman Kota, Pabrik, Kantor)
3. Keramaian: Matriks Likert interval 2 jam × 5 kategori POI (bukan Google Popular Times)
4. Cuaca: Open-Meteo API, hanya Precipitation Probability untuk komputasi TOPSIS
5. Metode: BWM (pembobotan) + TOPSIS (perankingan)
6. Output: Visualisasi peta rekomendasi zona jualan potensial, tanpa geofencing jalan protokol
7. POS: Pencatatan log sederhana (zona, jam, cup) untuk evaluasi akurasi
8. Tidak mencakup: manajemen inventaris, laporan keuangan
