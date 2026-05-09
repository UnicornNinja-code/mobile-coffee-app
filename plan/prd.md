# Product Requirements Document (PRD)
## KopiKeliling — Sistem Pendukung Keputusan Penentuan Lokasi Penjual Kopi Keliling
### Brand: Sejuta Jiwa | Wilayah: Surabaya & Sidoarjo

---

## 1. Ringkasan Produk

**KopiKeliling** adalah aplikasi web berbasis PWA yang dirancang untuk memberikan **rekomendasi lokasi jualan terbaik** kepada rider kopi keliling berdasarkan metode SPK hybrid BWM-TOPSIS. Sistem ini mengintegrasikan data spasial (POI), estimasi keramaian berbasis waktu, dan kondisi cuaca real-time untuk menghasilkan rekomendasi yang akurat dan kontekstual.

| Aspek | Detail |
|---|---|
| **Tipe Aplikasi** | Progressive Web App (PWA) |
| **Platform** | Browser (mobile-first, responsive) |
| **Pengguna Target** | Supervisor Operasional & Rider Kopi Keliling |
| **Cakupan Wilayah** | Kabupaten Surabaya dan Sidoarjo |
| **Brand** | Sejuta Jiwa |

---

## 2. Peran Pengguna

Sistem memiliki **2 peran utama** (disederhanakan dari plan awal sesuai batasan skripsi):

| Peran | Pengguna | Fungsi Utama |
|---|---|---|
| **Supervisor (SPV)** | Manajer operasional lapangan | Setup zona, konfigurasi SPK, monitoring rider, melihat log penjualan |
| **Rider** | Barista/penjual kopi keliling | Menerima rekomendasi lokasi, mencatat penjualan, melihat cuaca |

> **Tidak termasuk (out of scope):** Role Customer, sistem pre-order, loyalty points, payment gateway, notifikasi proximity, rating/ulasan. Fitur-fitur ini ada di plan awal tetapi di luar cakupan penelitian skripsi.

---

## 3. Fitur — Role Supervisor (SPV)

### 3.1 Dashboard Overview

| ID | Kebutuhan | Prioritas |
|---|---|---|
| SPV-01 | SPV dapat melihat dashboard ringkasan: jumlah rider aktif, jumlah zona, total penjualan hari ini | Must |
| SPV-02 | SPV dapat melihat peta real-time posisi semua rider yang sedang beroperasi | Must |

---

### 3.2 Manajemen Zona Operasional

| ID | Kebutuhan | Prioritas |
|---|---|---|
| SPV-03 | SPV dapat melihat peta Surabaya-Sidoarjo dengan semua POI ditampilkan, dibedakan warna per kategori (Sekolah, Kampus, Taman Kota, Pabrik, Kantor) | Must |
| SPV-04 | SPV dapat menggambar polygon di peta menggunakan Leaflet Draw untuk membuat Zona Operasional baru | Must |
| SPV-05 | SPV dapat memberi nama dan deskripsi pada setiap zona (contoh: "Zona Kampus ITS - ramai jam 10-14") | Must |
| SPV-06 | SPV dapat melihat daftar semua zona beserta jumlah POI yang tercakup di dalamnya | Must |
| SPV-07 | SPV dapat mengedit boundary, nama, dan deskripsi zona yang sudah dibuat | Must |
| SPV-08 | SPV dapat mengaktifkan/menonaktifkan zona tanpa menghapusnya | Must |
| SPV-09 | SPV dapat menghapus zona operasional | Must |
| SPV-10 | Sistem otomatis menampilkan POI yang jatuh di luar semua zona sebagai marker abu-abu (non-aktif) | Should |

---

### 3.3 Konfigurasi SPK (BWM)

| ID | Kebutuhan | Prioritas |
|---|---|---|
| SPV-11 | SPV dapat memilih kriteria terbaik (Best) dan terburuk (Worst) dari 5 kriteria yang tersedia | Must |
| SPV-12 | SPV dapat mengisi vektor Best-to-Others (BO): perbandingan kriteria terbaik terhadap 4 kriteria lain, skala 1-9 | Must |
| SPV-13 | SPV dapat mengisi vektor Others-to-Worst (OW): perbandingan 4 kriteria lain terhadap kriteria terburuk, skala 1-9 | Must |
| SPV-14 | Sistem menghitung bobot BWM secara otomatis setelah SPV submit input dan menampilkan hasilnya (bobot per kriteria + Consistency Index) | Must |
| SPV-15 | Sistem menampilkan peringatan jika Consistency Index melebihi threshold (data tidak konsisten, perlu diisi ulang) | Must |
| SPV-16 | SPV dapat mengupdate input BWM kapan saja untuk menghasilkan bobot baru | Should |

---

### 3.4 Konfigurasi Matriks Keramaian

| ID | Kebutuhan | Prioritas |
|---|---|---|
| SPV-17 | SPV dapat mengisi matriks keramaian: 7 interval waktu (06-08, 08-10, 10-12, 12-14, 14-16, 16-18, 18-20) × 5 kategori POI, skala Likert 1-5 | Must |
| SPV-18 | Sistem menampilkan matriks dalam bentuk tabel yang mudah diisi (form grid) | Must |
| SPV-19 | SPV dapat mengupdate nilai matriks kapan saja | Should |
| SPV-20 | Sistem menampilkan heatmap visual dari matriks keramaian (warna intensity berdasarkan skor) | Could |

---

### 3.5 Konfigurasi Koefisien Sensitivitas Cuaca

| ID | Kebutuhan | Prioritas |
|---|---|---|
| SPV-21 | SPV dapat mengisi koefisien sensitivitas cuaca (α) untuk setiap kategori POI, skala 0-1 | Must |
| SPV-22 | Sistem menampilkan penjelasan kontekstual per POI (contoh: "Kantor = indoor, tahan cuaca → nilai tinggi mendekati 1") | Should |
| SPV-23 | Sistem menyediakan nilai default yang bisa diedit SPV: Kantor=0.90, Pabrik=0.85, Kampus=0.60, Sekolah=0.55, Taman=0.20 | Must |

---

### 3.6 Manajemen Data POI

| ID | Kebutuhan | Prioritas |
|---|---|---|
| SPV-24 | SPV dapat memicu scan/sync POI dari Overpass-API untuk memperbarui database POI lokal | Must |
| SPV-25 | Sistem menyimpan hasil scan ke tabel `points_of_interest` dengan kategori, nama, dan koordinat | Must |
| SPV-26 | Sistem otomatis memfilter POI yang berada dalam buffer 50m dari jalur protokoler (highway=primary/trunk/motorway) dan menandainya sebagai `restricted` | Must |
| SPV-27 | SPV dapat melihat daftar POI per zona, termasuk kategori dan status | Should |

---

### 3.7 Monitoring Rider

| ID | Kebutuhan | Prioritas |
|---|---|---|
| SPV-28 | SPV dapat melihat posisi real-time semua rider aktif di peta | Must |
| SPV-29 | SPV dapat melihat status setiap rider: aktif/istirahat/offline | Must |
| SPV-30 | SPV dapat melihat zona mana yang sedang ditempati rider | Should |
| SPV-31 | SPV dapat melihat informasi cuaca terkini di area operasional (data dari Open-Meteo) | Should |

---

### 3.8 Log Penjualan & Evaluasi

| ID | Kebutuhan | Prioritas |
|---|---|---|
| SPV-32 | SPV dapat melihat semua log penjualan dari rider dalam bentuk tabel (zona, tanggal, jam, jumlah cup) | Must |
| SPV-33 | SPV dapat memfilter log penjualan berdasarkan: rider, zona, rentang tanggal | Must |
| SPV-34 | SPV dapat melihat ringkasan penjualan per zona untuk mengevaluasi akurasi rekomendasi SPK | Should |
| SPV-35 | SPV dapat mengekspor log penjualan ke format CSV | Could |

---

## 4. Fitur — Role Rider

### 4.1 Rekomendasi Lokasi (Fitur Utama SPK)

| ID | Kebutuhan | Prioritas |
|---|---|---|
| RDR-01 | Rider dapat melihat peta dengan rekomendasi zona jualan yang sudah diranking oleh TOPSIS | Must |
| RDR-02 | Zona ditampilkan dengan warna: 🟢 V≥0.7 (Sangat Direkomendasikan), 🟡 0.5≤V<0.7 (Direkomendasikan), 🔴 V<0.5 (Kurang Direkomendasikan) | Must |
| RDR-03 | Zona dengan skor V < 0.3 tidak ditampilkan di peta | Must |
| RDR-04 | Rider dapat klik zona untuk melihat detail: nama zona, skor TOPSIS (V), breakdown skor per kriteria (C1-C5), jumlah POI di zona | Must |
| RDR-05 | Rider dapat menekan tombol "Navigasi" untuk membuka navigasi ke centroid zona via Google Maps/Waze | Must |
| RDR-06 | Rekomendasi dihitung ulang setiap kali rider membuka halaman atau menekan tombol refresh | Must |
| RDR-07 | Sistem menampilkan waktu terakhir rekomendasi dihitung | Should |

---

### 4.2 Informasi Cuaca

| ID | Kebutuhan | Prioritas |
|---|---|---|
| RDR-08 | Rider dapat melihat kondisi cuaca terkini di area operasional: precipitation probability, curah hujan, kondisi cuaca, kecepatan angin, kelembapan, titik embun | Must |
| RDR-09 | Sistem menampilkan ikon/badge peringatan jika precipitation probability > 60% | Should |
| RDR-10 | Rider dapat melihat prakiraan cuaca 3 jam ke depan per jam | Could |

---

### 4.3 Pencatatan Penjualan (POS Sederhana)

| ID | Kebutuhan | Prioritas |
|---|---|---|
| RDR-11 | Rider dapat mencatat log penjualan: zona tempat berjualan, jumlah cup terjual | Must |
| RDR-12 | Sistem otomatis mencatat timestamp dan koordinat GPS saat log dibuat | Must |
| RDR-13 | Rider dapat melihat riwayat log penjualan sendiri hari ini | Must |
| RDR-14 | Rider dapat mengedit log penjualan yang sudah diinput (pada hari yang sama) | Should |

---

### 4.4 Status & Kehadiran

| ID | Kebutuhan | Prioritas |
|---|---|---|
| RDR-15 | Rider dapat mengubah status: Aktif (sedang berjualan), Istirahat, Offline | Must |
| RDR-16 | Sistem mengirim posisi GPS rider ke server secara periodik saat status Aktif (interval: setiap 30 detik) | Must |
| RDR-17 | Rider dapat melihat posisi rider lain yang sedang aktif di peta | Should |

---

## 5. Kebutuhan Data & Integrasi

### 5.1 Sumber Data Eksternal

| Sumber | Data | Penggunaan | Frekuensi |
|---|---|---|---|
| **Overpass-API** | POI (sekolah, kampus, taman, pabrik, kantor) di Surabaya-Sidoarjo | Database POI & input kriteria C1-C2 | On-demand (trigger manual oleh SPV) |
| **Overpass-API** | Jaringan jalan (highway classification) | Filter jalur protokoler | On-demand |
| **Open-Meteo API** | Precipitation Probability (hourly forecast) | Input kriteria C5 | Real-time (setiap request rekomendasi) |
| **Open-Meteo API** | rain, weather_code, wind_speed, humidity, dew_point | Display-only di UI rider | Real-time |

### 5.2 Data Internal

| Data | Sumber | Penggunaan |
|---|---|---|
| Zona Operasional (polygon) | Input SPV via Leaflet Draw | Filter + alternatif TOPSIS |
| Matriks Keramaian (Likert) | Input SPV via form | Kriteria C4 |
| Koefisien α (sensitivitas cuaca) | Input SPV via form | Kriteria C5 |
| Bobot BWM | Dihitung dari input SPV | Pembobotan TOPSIS |
| Posisi GPS rider | Device rider (Geolocation API) | Kriteria C3 + monitoring |
| Log penjualan | Input rider via form | Evaluasi akurasi SPK |

---

## 6. Kebutuhan Non-Fungsional

| Aspek | Kebutuhan |
|---|---|
| **Responsivitas** | Mobile-first design, mendukung viewport 360px-1440px |
| **PWA** | Installable, offline fallback untuk halaman statis |
| **Performa TOPSIS** | Perhitungan ranking selesai dalam < 2 detik untuk 20 zona |
| **GPS** | Akurasi lokasi ≤ 50m, update periodik 30 detik saat aktif |
| **Autentikasi** | Login berbasis email/password dengan session management |
| **Role-based Access** | SPV dan Rider memiliki akses terpisah, routing terlindungi middleware |
| **Browser** | Chrome 90+, Safari 15+, Firefox 90+ (mobile & desktop) |
| **Bahasa UI** | Bahasa Indonesia |

---

## 7. Skema Database Inti

```
┌──────────────────┐     ┌──────────────────────┐
│ users             │     │ operational_zones      │
│ ─────────────     │     │ ──────────────────     │
│ id (PK)           │     │ id (PK)                │
│ name              │     │ name                   │
│ email (unique)    │     │ description            │
│ password_hash     │     │ boundary (Polygon)     │
│ role (spv/rider)  │     │ is_active              │
│ is_active         │     │ created_by (FK→users)  │
│ created_at        │     │ created_at / updated_at│
└──────────────────┘     └──────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐
│ points_of_interest    │  │ protocol_roads        │
│ ──────────────────    │  │ ──────────────────    │
│ id (PK)               │  │ id (PK)               │
│ osm_id (unique)       │  │ osm_id                │
│ name                  │  │ name                  │
│ category (enum)       │  │ highway_type          │
│ geom (Point, 4326)    │  │ geom (LineString,4326)│
│ created_at            │  │ created_at            │
└──────────────────────┘  └──────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐
│ crowd_matrix          │  │ weather_sensitivity   │
│ ──────────────────    │  │ ──────────────────    │
│ id (PK)               │  │ id (PK)               │
│ time_slot (enum)      │  │ poi_category (enum)   │
│ poi_category (enum)   │  │ alpha (decimal 0-1)   │
│ score (integer 1-5)   │  │ updated_by (FK→users) │
│ updated_by (FK→users) │  │ updated_at            │
│ updated_at            │  └──────────────────────┘
└──────────────────────┘
                           ┌──────────────────────┐
┌──────────────────────┐  │ rider_locations        │
│ bwm_weights           │  │ ──────────────────    │
│ ──────────────────    │  │ id (PK)               │
│ id (PK)               │  │ rider_id (FK→users)   │
│ criterion (enum C1-5) │  │ geom (Point, 4326)    │
│ weight (decimal)      │  │ status (enum)         │
│ consistency_index     │  │ recorded_at           │
│ updated_by (FK→users) │  └──────────────────────┘
│ updated_at            │
└──────────────────────┘  ┌──────────────────────┐
                           │ sales_logs             │
                           │ ──────────────────     │
                           │ id (PK)                │
                           │ rider_id (FK→users)    │
                           │ zone_id (FK→op_zones)  │
                           │ cups_sold (integer)    │
                           │ geom (Point, 4326)     │
                           │ logged_at (timestamp)  │
                           │ created_at             │
                           └──────────────────────┘
```

**Enum definitions:**
- `category`: sekolah, kampus, taman_kota, pabrik, kantor
- `time_slot`: 06-08, 08-10, 10-12, 12-14, 14-16, 16-18, 18-20
- `criterion`: C1, C2, C3, C4, C5
- `rider_status`: active, resting, offline

---

## 8. Batasan Sistem (Scope Boundaries)

### Dalam Cakupan (In Scope)

| # | Fitur/Aspek |
|---|---|
| 1 | SPK hybrid BWM-TOPSIS untuk rekomendasi zona jualan |
| 2 | Manajemen Zona Operasional (CRUD polygon di peta) |
| 3 | Scan & filter POI dari Overpass-API (5 kategori) |
| 4 | Filter eksklusi jalur protokoler via klasifikasi OSM |
| 5 | Matriks keramaian Likert (7 slot × 5 kategori) |
| 6 | Integrasi cuaca real-time Open-Meteo (precipitation probability) |
| 7 | Monitoring posisi rider secara real-time |
| 8 | POS log sederhana (zona, jam, cup terjual) |
| 9 | Visualisasi peta rekomendasi zona dengan Leaflet.js |
| 10 | Autentikasi & otorisasi 2 role (SPV, Rider) |

### Di Luar Cakupan (Out of Scope)

| # | Fitur/Aspek | Alasan |
|---|---|---|
| 1 | Role Customer & fitur customer-facing | Fokus skripsi pada SPK, bukan marketplace |
| 2 | Sistem pre-order & pembayaran (QRIS) | Di luar batasan penelitian |
| 3 | Loyalty points & promosi | Di luar batasan penelitian |
| 4 | Manajemen inventaris (stok keluar-masuk) | Batasan penelitian #9 |
| 5 | Rekapitulasi laporan keuangan/akuntansi | Batasan penelitian #9 |
| 6 | Rating & ulasan pelanggan | Tidak ada role customer |
| 7 | Push notification proximity | Tidak ada role customer |
| 8 | Geofencing jalan protokol (pembatasan virtual) | Batasan penelitian #7 |
| 9 | Fleet/armada management | Di luar batasan penelitian |
| 10 | Chat/messaging antar pengguna | Di luar batasan penelitian |
| 11 | Multi-brand support | Sistem untuk 1 brand (Sejuta Jiwa) |
| 12 | Real-time crowd data dari API pihak ketiga | Batasan penelitian #4 (menggunakan Likert) |

---

## 9. Batasan Teknis & Asumsi

### Batasan Teknis

| # | Batasan |
|---|---|
| 1 | Data POI dari Overpass-API mungkin tidak lengkap atau outdated — bergantung pada kontribusi komunitas OSM |
| 2 | Akurasi GPS pada mobile browser bervariasi (±10-50m tergantung device dan kondisi) |
| 3 | Open-Meteo API memiliki rate limit — caching diperlukan untuk menghindari throttling |
| 4 | Perhitungan TOPSIS dilakukan di server-side karena membutuhkan akses database PostGIS |
| 5 | Leaflet Draw polygon memerlukan minimal 3 titik untuk membentuk zona valid |
| 6 | PWA Geolocation API memerlukan HTTPS dan izin eksplisit dari user |

### Asumsi

| # | Asumsi |
|---|---|
| 1 | SPV memiliki pengetahuan operasional yang memadai untuk menggambar zona dan mengisi matriks keramaian |
| 2 | Rider memiliki smartphone dengan GPS dan akses internet saat beroperasi |
| 3 | Pola keramaian per jenis POI relatif konsisten (tidak berubah drastis dalam waktu singkat) |
| 4 | Kondisi cuaca di area Surabaya-Sidoarjo relatif seragam pada satu waktu (tidak perlu data cuaca per titik) |
| 5 | Jalur protokoler dapat diidentifikasi secara akurat melalui klasifikasi highway OSM (primary/trunk/motorway) |
| 6 | SPV akan memvalidasi dan mengupdate konfigurasi SPK secara berkala |

---

## 10. User Flow Utama

### Flow A: SPV Setup Awal

```
Login → Dashboard
  → Scan POI dari Overpass-API
  → Lihat POI di peta
  → Gambar Zona Operasional (polygon)
  → Isi Matriks Keramaian (Likert)
  → Isi Koefisien Sensitivitas Cuaca (α)
  → Isi BWM (Best/Worst + BO + OW)
  → Sistem hitung bobot → Lihat hasil
  → Setup selesai ✅
```

### Flow B: Rider Mendapat Rekomendasi

```
Login → Halaman Rekomendasi (Peta)
  → Sistem ambil GPS rider
  → Sistem fetch cuaca dari Open-Meteo
  → Sistem jalankan filter pipeline + TOPSIS
  → Peta menampilkan zona berwarna (hijau/kuning/merah)
  → Rider klik zona → Lihat detail skor
  → Rider klik "Navigasi" → Buka Google Maps
  → Rider pergi ke zona rekomendasi
```

### Flow C: Rider Catat Penjualan

```
Halaman POS → Pilih zona tempat berjualan
  → Input jumlah cup terjual
  → Sistem otomatis catat GPS + timestamp
  → Submit → Log tersimpan
  → Rider bisa lihat riwayat hari ini
```

### Flow D: SPV Evaluasi Akurasi

```
Dashboard → Halaman Log Penjualan
  → Filter: per zona / per rider / per tanggal
  → Lihat tabel log
  → Bandingkan: zona ranking tinggi → penjualan tinggi?
  → Jika tidak akurat → update matriks/bobot BWM
```
