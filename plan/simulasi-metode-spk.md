# Simulasi Perbandingan Metode SPK
## Kasus: Rekomendasi Zona Penjual Kopi Keliling

Dokumen ini membandingkan tiga kombinasi metode:

1. BWM-TOPSIS
2. BWM-MARCOS
3. BWM-WASPAS

Semua simulasi memakai data contoh pada `perhitunganspk.md`, sehingga bobot dan matriks keputusan yang dibandingkan sama.

---

## 1. Data Simulasi

### Alternatif

| ID | Zona | C1 Densitas POI | C2 Diversitas | C3 Jarak (m) | C4 Keramaian | C5 Ketahanan Cuaca |
|---|---|---:|---:|---:|---:|---:|
| A1 | Kampus ITS | 12 | 3 | 2400 | 4.5 | 86.0 |
| A2 | SIER Rungkut | 8 | 2 | 3100 | 3.8 | 89.8 |
| A3 | Jl. HR Muhammad | 6 | 1 | 1800 | 4.2 | 90.5 |
| A4 | Taman Bungkul | 3 | 2 | 900 | 3.0 | 56.3 |
| A5 | Industri Berbek | 5 | 1 | 4200 | 3.5 | 88.2 |

### Tipe Kriteria

| Kriteria | Tipe |
|---|---|
| C1 Densitas POI | Benefit |
| C2 Diversitas POI | Benefit |
| C3 Jarak dari Rider | Cost |
| C4 Skor Keramaian | Benefit |
| C5 Ketahanan Cuaca | Benefit |

### Bobot BWM

Bobot diambil dari contoh BWM pada `perhitunganspk.md`.

| Kriteria | Bobot |
|---|---:|
| C1 Densitas POI | 0.150 |
| C2 Diversitas POI | 0.112 |
| C3 Jarak dari Rider | 0.064 |
| C4 Skor Keramaian | 0.449 |
| C5 Ketahanan Cuaca | 0.225 |

Interpretasi bobot:

- C4 Keramaian menjadi faktor paling dominan.
- C5 Ketahanan Cuaca menjadi faktor penting kedua.
- C3 Jarak memiliki bobot paling kecil karena sistem sudah memakai filter radius maksimal 5 km sebelum ranking.

---

## 2. Hasil Simulasi Ranking

### BWM-TOPSIS

| Ranking | Alternatif | Zona | Skor |
|---:|---|---|---:|
| 1 | A1 | Kampus ITS | 0.887 |
| 2 | A2 | SIER Rungkut | 0.560 |
| 3 | A3 | Jl. HR Muhammad | 0.522 |
| 4 | A5 | Industri Berbek | 0.327 |
| 5 | A4 | Taman Bungkul | 0.260 |

TOPSIS menilai alternatif berdasarkan kedekatan terhadap solusi ideal positif dan jarak dari solusi ideal negatif. Pada kasus ini, A1 unggul kuat karena C1, C2, dan C4 paling baik, walaupun bukan zona terdekat.

### BWM-MARCOS

| Ranking | Alternatif | Zona | Skor |
|---:|---|---|---:|
| 1 | A1 | Kampus ITS | 0.949 |
| 2 | A2 | SIER Rungkut | 0.796 |
| 3 | A3 | Jl. HR Muhammad | 0.788 |
| 4 | A5 | Industri Berbek | 0.682 |
| 5 | A4 | Taman Bungkul | 0.615 |

MARCOS membandingkan alternatif terhadap kondisi ideal dan anti-ideal. Skornya lebih mudah dibaca sebagai derajat utilitas terhadap kondisi ideal, tetapi selisih A2 dan A3 sangat tipis.

### BWM-WASPAS

Simulasi memakai lambda 0.5, yaitu gabungan seimbang antara Weighted Sum Model dan Weighted Product Model.

| Ranking | Alternatif | Zona | Skor |
|---:|---|---|---:|
| 1 | A1 | Kampus ITS | 0.939 |
| 2 | A2 | SIER Rungkut | 0.782 |
| 3 | A3 | Jl. HR Muhammad | 0.764 |
| 4 | A5 | Industri Berbek | 0.653 |
| 5 | A4 | Taman Bungkul | 0.598 |

WASPAS memberi hasil yang sangat mirip dengan MARCOS karena keduanya memakai normalisasi min-max/rasio dan utilitas terbobot. Metode ini sederhana dan cepat, tetapi lebih sensitif pada nilai ekstrem dan pemilihan lambda.

---

## 3. Perbandingan Hasil

| Ranking | BWM-TOPSIS | BWM-MARCOS | BWM-WASPAS |
|---:|---|---|---|
| 1 | A1 Kampus ITS | A1 Kampus ITS | A1 Kampus ITS |
| 2 | A2 SIER Rungkut | A2 SIER Rungkut | A2 SIER Rungkut |
| 3 | A3 Jl. HR Muhammad | A3 Jl. HR Muhammad | A3 Jl. HR Muhammad |
| 4 | A5 Industri Berbek | A5 Industri Berbek | A5 Industri Berbek |
| 5 | A4 Taman Bungkul | A4 Taman Bungkul | A4 Taman Bungkul |

Kesimpulan simulasi numerik:

- Ketiga metode menghasilkan ranking yang sama pada data contoh.
- A1 konsisten menjadi rekomendasi terbaik.
- A2 dan A3 adalah pasangan yang paling dekat; perubahan bobot C3 atau C5 bisa membuat posisi keduanya bertukar.
- A4 tetap paling rendah meskipun paling dekat, karena C1, C4, dan C5 rendah.

---

## 4. Analisis Kecocokan Metode

### BWM-TOPSIS

Kelebihan:

- Cocok untuk kasus rekomendasi lokasi karena konsep "paling dekat dengan kondisi ideal" mudah dijelaskan.
- Mendukung benefit dan cost secara jelas.
- Bagus untuk output Top 3 sampai Top 5 zona.
- Sudah umum dipakai dalam penelitian SPK, sehingga lebih aman untuk skripsi/tugas akhir.
- Skor 0 sampai 1 bisa langsung dipakai untuk kategori hijau, kuning, dan merah.

Kekurangan:

- Hasil dipengaruhi oleh alternatif yang sedang dibandingkan.
- Jika jumlah zona berubah, skor bisa berubah meskipun data satu zona tetap sama.
- Membutuhkan penjelasan normalisasi dan solusi ideal.

Kecocokan untuk kasus ini: sangat cocok.

### BWM-MARCOS

Kelebihan:

- Memakai pembanding ideal dan anti-ideal secara eksplisit.
- Interpretasi utilitas terhadap kondisi ideal cukup kuat.
- Baik ketika peneliti ingin menunjukkan seberapa dekat zona terhadap skenario terbaik.
- Stabil untuk data yang memiliki rentang nilai berbeda.

Kekurangan:

- Literatur dan penerapan di aplikasi umum belum sepopuler TOPSIS.
- Rumus utilitas MARCOS lebih panjang untuk dijelaskan ke pembaca non-teknis.
- Untuk kasus sederhana 10-20 zona, kelebihannya tidak terlalu terasa dibanding TOPSIS.

Kecocokan untuk kasus ini: cocok, terutama bila ingin metode yang lebih baru.

### BWM-WASPAS

Kelebihan:

- Komputasi paling sederhana.
- Cepat dijalankan real-time.
- Menggabungkan model penjumlahan dan perkalian.
- Mudah diimplementasikan di backend.

Kekurangan:

- Ada parameter lambda yang harus dipilih dan dijustifikasi.
- Weighted Product Model bisa sensitif pada nilai sangat kecil.
- Secara naratif, "zona terbaik" kurang intuitif dibanding konsep solusi ideal TOPSIS.

Kecocokan untuk kasus ini: cukup cocok, tetapi lebih kuat sebagai metode pembanding daripada metode utama.

---

## 5. Rekomendasi Metode

Metode paling cocok untuk kasus ini adalah BWM-TOPSIS.

Alasannya:

1. Kasusnya adalah rekomendasi lokasi/zona, sehingga konsep kedekatan terhadap solusi ideal sangat natural.
2. Data memiliki campuran benefit dan cost, dan TOPSIS menangani keduanya dengan rapi.
3. Jumlah alternatif kecil sampai sedang, yaitu sekitar 10-20 zona aktif.
4. Sistem butuh output Top-N real-time, dan TOPSIS cukup ringan untuk dihitung setiap request.
5. BWM-TOPSIS lebih mudah dipertanggungjawabkan secara akademik dibanding BWM-MARCOS atau BWM-WASPAS.
6. Skor TOPSIS cocok dengan desain UI pada dokumen awal: hijau, kuning, merah berdasarkan rentang skor.

Rekomendasi struktur penelitian:

- Metode utama: BWM-TOPSIS.
- Metode pembanding: BWM-MARCOS dan BWM-WASPAS.
- Evaluasi: bandingkan ranking, stabilitas ranking, dan kecocokan hasil dengan log penjualan POS.

---

## 6. Catatan Penting untuk Penelitian

Untuk dokumen akademik, sebaiknya BWM dihitung memakai model optimasi BWM, bukan hanya pembobotan sederhana `1 / a_Bj`. Pembobotan sederhana masih bisa dipakai untuk prototipe, tetapi model optimasi BWM lebih kuat karena mempertimbangkan input Best-to-Others dan Others-to-Worst secara bersamaan.

Jika tetap memakai bobot contoh saat ini, TOPSIS sudah layak sebagai metode utama karena hasilnya konsisten dengan MARCOS dan WASPAS pada simulasi awal.
