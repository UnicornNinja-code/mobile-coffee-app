# Landasan Teori — Jawaban Pertanyaan Penggalian
## SPK BWM-TOPSIS untuk Penentuan Lokasi Penjual Kopi Keliling "Sejuta Jiwa"

> Dokumen ini menjawab pertanyaan-pertanyaan penggalian landasan teori agar bab tinjauan pustaka memiliki alur: **masalah → metode → kecocokan → penerapan**.

---

## A. Sistem Pendukung Keputusan (SPK)

### A1. Apa yang dimaksud dengan Sistem Pendukung Keputusan (SPK)?

Sistem Pendukung Keputusan (SPK) atau *Decision Support System* (DSS) adalah sistem berbasis komputer yang membantu pengambil keputusan memanfaatkan data dan model untuk menyelesaikan masalah semi-terstruktur. SPK tidak membuat keputusan secara otomatis, melainkan menyediakan informasi, analisis, dan rekomendasi agar keputusan yang diambil lebih objektif dan terukur. Dalam konteks penelitian ini, SPK mengolah data spasial (POI), data cuaca, dan preferensi supervisor menjadi rekomendasi zona jualan yang terstruktur.

### A2. Masalah seperti apa yang cocok diselesaikan menggunakan SPK?

SPK cocok untuk masalah **semi-terstruktur** — yaitu masalah yang memiliki data kuantitatif yang bisa diolah, tetapi tetap membutuhkan pertimbangan manusia. Contohnya: pemilihan lokasi usaha, evaluasi kinerja, pemilihan pemasok. Masalah ini memiliki banyak faktor yang saling bertentangan (misalnya lokasi ramai tetapi jauh, atau dekat tetapi cuacanya buruk) sehingga tidak bisa diselesaikan hanya dengan satu kriteria.

### A3. Mengapa pemilihan lokasi penjualan kopi keliling dapat dikategorikan sebagai masalah SPK?

Karena pemilihan lokasi kopi keliling melibatkan **banyak faktor** (keramaian, jarak, cuaca, kepadatan POI, variasi POI) yang saling berkompetisi dan tidak bisa diselesaikan hanya dengan intuisi. Seorang rider harus mempertimbangkan jarak tempuh vs potensi keramaian vs risiko hujan secara bersamaan. Tanpa sistem, rider cenderung memilih lokasi berdasarkan kebiasaan atau coba-coba selama satu minggu — proses yang tidak efisien dan menghabiskan waktu serta biaya operasional.

### A4. Apa peran SPK dalam membantu keputusan yang sebelumnya berbasis intuisi?

Sebelum ada SPK, supervisor dan rider menentukan lokasi berdasarkan pengalaman pribadi dan *trial-and-error* selama ±1 minggu di lokasi baru. SPK mengubah proses ini dengan: (1) mengkuantifikasi faktor-faktor keputusan menjadi nilai numerik, (2) memberikan bobot prioritas berdasarkan preferensi ahli (supervisor), dan (3) menghasilkan ranking lokasi yang transparan dan bisa dijelaskan — sehingga keputusan berpindah dari "perasaan" menjadi "data + model".

### A5. Apakah SPK menggantikan keputusan manusia atau hanya mendukung?

SPK **hanya mendukung**, bukan menggantikan. Sistem menghasilkan rekomendasi Top 3-5 zona beserta skor dan breakdown kriteria. Keputusan akhir tetap di tangan rider (memilih zona mana yang didatangi) dan supervisor (mengonfigurasi bobot, zona operasional, dan matriks keramaian). SPK menyediakan informasi terstruktur agar keputusan manusia lebih berkualitas.

### A6. Siapa pengguna utama SPK dalam penelitian ini?

Ada dua pengguna utama: **Supervisor (SPV)** dan **Rider**. Supervisor berperan sebagai *decision maker* pada tahap konfigurasi — menentukan zona operasional, mengisi matriks keramaian, menetapkan bobot kriteria via BWM. Rider berperan sebagai penerima rekomendasi — melihat ranking zona di peta dan memutuskan zona mana yang akan didatangi. Keduanya saling melengkapi: supervisor menyediakan *expert knowledge*, rider menggunakan hasilnya di lapangan.

### A7. Output keputusan seperti apa yang dihasilkan oleh SPK?

Output SPK berupa **ranking zona operasional** dengan skor preferensi TOPSIS (V) antara 0–1. Zona ditampilkan di peta dengan kode warna: 🟢 V ≥ 0.7 (Sangat Direkomendasikan), 🟡 0.5 ≤ V < 0.7 (Direkomendasikan), 🔴 V < 0.5 (Kurang Direkomendasikan). Zona dengan V < 0.3 tidak ditampilkan. Setiap zona dilengkapi breakdown skor per kriteria (C1–C5) dan tombol navigasi ke Google Maps.

### A8. Apa perbedaan SPK dengan sistem informasi biasa?

Sistem informasi biasa hanya menyajikan data (misalnya peta dengan titik POI atau informasi cuaca). SPK melangkah lebih jauh: ia **mengolah data menjadi rekomendasi** menggunakan model matematis (BWM-TOPSIS). Jika sistem hanya menampilkan peta POI, rider tetap harus menganalisis sendiri mana lokasi terbaik. SPK memproses data tersebut, menimbang setiap kriteria, dan menghasilkan ranking yang actionable.

---

## B. Multi-Criteria Decision Making (MCDM)

### B1. Apa yang dimaksud dengan MCDM?

*Multi-Criteria Decision Making* (MCDM) adalah cabang ilmu pengambilan keputusan yang mengevaluasi alternatif berdasarkan **lebih dari satu kriteria** secara simultan. MCDM menyediakan kerangka matematis untuk menangani trade-off antar kriteria yang saling bertentangan — misalnya lokasi yang dekat tetapi sepi, atau lokasi ramai tetapi rawan hujan.

### B2. Mengapa kasus ini termasuk masalah MCDM?

Penentuan lokasi kopi keliling harus mempertimbangkan 5 kriteria sekaligus: densitas POI, diversitas POI, jarak rider, skor keramaian, dan ketahanan cuaca. Kriteria ini memiliki arah yang berbeda (benefit vs cost) dan satuan yang berbeda (jumlah, meter, skala 1-5, skor 0-100). Tidak ada satu lokasi yang unggul di semua kriteria — sehingga diperlukan metode MCDM untuk menemukan alternatif terbaik secara keseluruhan.

### B3. Apa saja kriteria yang digunakan?

| Kode | Kriteria | Satuan | Sumber Data |
|---|---|---|---|
| C1 | Densitas POI | Jumlah POI (integer) | Overpass-API → PostGIS |
| C2 | Diversitas Jenis POI | Jumlah kategori unik (1-5) | Overpass-API → PostGIS |
| C3 | Jarak dari Rider | Meter | GPS rider → PostGIS |
| C4 | Skor Keramaian | Skala 1-5 | Matriks Likert (SPV) × jam saat ini |
| C5 | Ketahanan Cuaca Lokasi | Skor 0-100 | Open-Meteo API × koefisien sensitivitas |

### B4. Apakah semua kriteria memiliki tingkat kepentingan yang sama?

Tidak. Setiap kriteria memiliki bobot berbeda yang ditentukan oleh supervisor melalui metode BWM. Misalnya, dalam simulasi pada penelitian ini, keramaian (C4) memiliki bobot 0.449 (paling tinggi) sementara jarak (C3) hanya 0.064 (paling rendah). Perbedaan bobot ini mencerminkan bahwa bagi operasional kopi keliling, potensi keramaian jauh lebih penting daripada jarak — karena jarak sudah dibatasi oleh filter radius 5 km.

### B5. Mengapa diperlukan pembobotan kriteria?

Tanpa pembobotan, semua kriteria dianggap sama pentingnya — padahal dalam realitas operasional, keramaian lokasi jelas lebih menentukan penjualan daripada sekadar variasi jenis POI. Pembobotan memungkinkan supervisor menuangkan *expert knowledge*-nya ke dalam model matematis, sehingga rekomendasi SPK selaras dengan prioritas bisnis yang sebenarnya.

### B6. Apa perbedaan kriteria benefit dan cost?

**Benefit** (↑): semakin tinggi nilainya, semakin baik. Contoh: semakin banyak POI, semakin bagus. **Cost** (↓): semakin rendah nilainya, semakin baik. Contoh: semakin dekat jarak, semakin efisien. Perbedaan ini penting dalam TOPSIS karena menentukan arah solusi ideal: untuk benefit, solusi ideal = nilai maksimum; untuk cost, solusi ideal = nilai minimum.

### B7. Kriteria benefit dalam penelitian ini?

C1 (Densitas POI), C2 (Diversitas POI), C4 (Skor Keramaian), dan C5 (Ketahanan Cuaca). Keempatnya bersifat "semakin tinggi semakin baik" — semakin banyak POI, semakin beragam, semakin ramai, dan semakin tahan cuaca, maka zona tersebut semakin potensial untuk berjualan.

### B8. Kriteria cost dalam penelitian ini?

Hanya C3 (Jarak dari Rider). Semakin dekat zona dari posisi rider saat ini, semakin efisien dari segi BBM, waktu tempuh, dan tenaga. Oleh karena itu, nilai jarak yang lebih kecil dianggap lebih baik.

### B9. Mengapa MCDM lebih tepat daripada memilih berdasarkan satu kriteria?

Jika rider hanya memilih berdasarkan jarak terdekat, ia bisa saja mendatangi zona yang dekat tetapi sepi dan rawan hujan. Sebaliknya, jika hanya melihat keramaian, ia mungkin pergi ke zona yang sangat jauh sehingga tidak efisien. MCDM mempertimbangkan semua faktor secara bersamaan dan menghasilkan keputusan yang seimbang — zona yang cukup dekat, cukup ramai, dan cukup tahan cuaca.

---

## C. Best Worst Method (BWM)

### C1. Apa yang dimaksud dengan BWM?

Best Worst Method (BWM) adalah metode pembobotan kriteria dalam MCDM yang dikembangkan oleh Rezaei (2015). BWM bekerja dengan cara: (1) pengambil keputusan memilih kriteria **terbaik** (paling penting) dan **terburuk** (paling tidak penting), (2) membandingkan kriteria terbaik terhadap semua kriteria lain (*Best-to-Others*), (3) membandingkan semua kriteria lain terhadap kriteria terburuk (*Others-to-Worst*), (4) dari perbandingan tersebut dihitung bobot optimal setiap kriteria.

### C2. Mengapa BWM digunakan untuk pembobotan?

BWM dipilih karena: (1) membutuhkan **lebih sedikit input** dibanding AHP — hanya 2n−3 perbandingan vs n(n−1)/2 pada AHP (untuk 5 kriteria: 7 vs 10 nilai), (2) perbandingannya lebih **konsisten** karena tidak membandingkan semua pasangan, (3) prosesnya lebih mudah dipahami oleh supervisor non-teknis, dan (4) menghasilkan bobot yang reliable dengan mekanisme pengecekan konsistensi bawaan.

### C3. Apa perbedaan fungsi BWM dengan TOPSIS?

BWM dan TOPSIS memiliki fungsi yang berbeda dan saling melengkapi. **BWM** bertugas menentukan **bobot** setiap kriteria — seberapa penting C1 dibanding C4, misalnya. **TOPSIS** bertugas melakukan **perankingan** alternatif zona berdasarkan bobot tersebut. BWM menjawab "kriteria mana yang lebih penting?", TOPSIS menjawab "zona mana yang terbaik?".

### C4. Siapa yang menentukan kriteria terbaik dan terburuk?

Supervisor operasional (SPV) yang bertanggung jawab atas strategi penjualan lapangan. SPV memilih kriteria terbaik (paling berpengaruh terhadap keberhasilan jualan) dan terburuk (paling tidak berpengaruh) berdasarkan pengalaman operasionalnya di Surabaya dan Sidoarjo.

### C5. Mengapa supervisor cocok menjadi pengambil keputusan BWM?

Supervisor memiliki **pengetahuan operasional langsung**: ia tahu pola keramaian tiap jenis lokasi, dampak cuaca terhadap penjualan, dan efisiensi jarak tempuh. Ia sudah terbiasa memutuskan rider dikirim ke mana setiap hari. Pengetahuan tacit ini yang dikuantifikasi melalui BWM — mengubah expertise menjadi bobot numerik yang bisa diproses sistem.

### C6. Apa yang dimaksud Best-to-Others (BO)?

BO adalah vektor perbandingan yang menjawab: "Seberapa lebih penting kriteria terbaik dibanding kriteria lain?" Menggunakan skala 1-9 (1 = sama penting, 9 = sangat jauh lebih penting). Contoh: jika Best = C4 (Keramaian), maka SPV menilai BO = {C1:3, C2:4, C3:7, C4:1, C5:2} — artinya keramaian 3× lebih penting dari densitas POI, 7× lebih penting dari jarak.

### C7. Apa yang dimaksud Others-to-Worst (OW)?

OW adalah vektor perbandingan yang menjawab: "Seberapa lebih penting kriteria lain dibanding kriteria terburuk?" Contoh: jika Worst = C3 (Jarak), maka SPV menilai OW = {C1:5, C2:4, C3:1, C4:7, C5:6} — artinya densitas POI 5× lebih penting dari jarak, keramaian 7× lebih penting dari jarak.

### C8. Bagaimana BWM menghasilkan bobot kriteria?

BWM menghitung bobot optimal melalui **model optimasi** yang memanfaatkan kedua vektor input (BO dan OW) secara bersamaan. Model ini mencari bobot w₁–w₅ yang meminimalkan nilai inkonsistensi maksimum (ξ) dengan dua kelompok kendala:

1. **Dari vektor BO**: |w_B / w_j − a_Bj| ≤ ξ untuk setiap kriteria j
2. **Dari vektor OW**: |w_j / w_W − a_jW| ≤ ξ untuk setiap kriteria j
3. **Kendala normalisasi**: Σw_j = 1, w_j ≥ 0

Model ini diselesaikan sebagai *min-max optimization problem* (Rezaei, 2015). Hasilnya adalah vektor bobot optimal yang paling konsisten terhadap seluruh input BO dan OW. Contoh hasil: w1=0.150, w2=0.112, w3=0.064, w4=0.449, w5=0.225 — menunjukkan C4 (Keramaian) paling dominan dan C3 (Jarak) paling kecil.

> **Catatan**: pendekatan sederhana w_j = 1/a_Bj (hanya memakai BO) bisa digunakan untuk simulasi awal, tetapi model optimasi di atas adalah rumus utama BWM karena memperhitungkan BO dan OW sekaligus serta menghasilkan Consistency Index secara langsung.

### C9. Apa kelebihan BWM dibanding AHP?

(1) **Input lebih sedikit**: 2n−3 vs n(n−1)/2 perbandingan. (2) **Konsistensi lebih tinggi**: hanya membandingkan terhadap best dan worst, bukan semua pasangan. (3) **Lebih mudah** bagi responden non-teknis. (4) **Tidak memerlukan matriks besar**: AHP untuk 5 kriteria butuh matriks 5×5, BWM hanya butuh 2 vektor.

### C10. Bagaimana BWM mengurangi ketergantungan pada intuisi?

BWM tidak menghilangkan peran ahli — justru memanfaatkannya secara terstruktur. Perbedaannya: tanpa BWM, supervisor membuat keputusan berdasarkan "feeling" yang tidak bisa diukur. Dengan BWM, "feeling" tersebut diterjemahkan menjadi perbandingan numerik yang transparan, bisa divalidasi konsistensinya, dan bisa diupdate jika kondisi berubah.

### C11. Apakah bobot BWM objektif sepenuhnya?

Tidak. BWM digunakan untuk mengubah preferensi supervisor yang bersifat **subjektif** menjadi bobot kriteria yang lebih **terstruktur** dan dapat diuji konsistensinya. Inputnya tetap berasal dari penilaian ahli (*subjective weighting*), tetapi proses optimasi matematis memastikan bobot tersebut konsisten secara internal. Keunggulannya: bobot mencerminkan prioritas bisnis yang sesungguhnya — bukan asumsi bahwa semua kriteria sama penting, dan bukan hanya pola statistik data.

### C12. Bagaimana menguji konsistensi BWM?

BWM memiliki **Consistency Index (ξ)** yang dihitung sebagai: ξ = max|w_B/w_j − a_Bj| untuk semua j. Nilai ξ dibandingkan dengan tabel threshold berdasarkan a_BW (nilai BO untuk kriteria terburuk). Jika ξ ≤ threshold → konsisten ✅. Jika melebihi → SPV perlu mengisi ulang perbandingannya.

### C13. Mengapa konsistensi penting?

Jika SPV mengatakan "keramaian 7× lebih penting dari jarak" di BO, tetapi di OW mengatakan "jarak hanya 2× kurang penting dari keramaian", maka ada kontradiksi. Pengecekan konsistensi memastikan bahwa penilaian SPV tidak saling bertentangan — sehingga bobot yang dihasilkan benar-benar mencerminkan preferensinya.

### C14. Kriteria apa yang kemungkinan menjadi terbaik?

C4 (Skor Keramaian) — karena keramaian adalah faktor paling langsung terhadap penjualan. Zona yang ramai berarti lebih banyak calon pembeli. Dalam simulasi, C4 mendapat bobot tertinggi (0.449).

### C15. Kriteria apa yang kemungkinan menjadi terburuk?

C3 (Jarak dari Rider) — karena sistem sudah menerapkan filter radius 5 km sebelum TOPSIS. Semua zona yang masuk TOPSIS sudah dijamin dalam jangkauan. Perbedaan jarak 1-5 km tidak terlalu signifikan dibanding perbedaan keramaian atau cuaca.

### C16. Bagaimana bobot BWM digunakan di TOPSIS?

Bobot BWM menjadi **pengali matriks ternormalisasi** di Step 3 TOPSIS: v_ij = w_j × r_ij. Kriteria dengan bobot besar (C4=0.449) akan memiliki pengaruh besar pada jarak ke solusi ideal, sementara kriteria berbobot kecil (C3=0.064) pengaruhnya minimal. Ini memastikan ranking TOPSIS mencerminkan prioritas yang ditetapkan supervisor.

---

## D. TOPSIS

### D1. Apa yang dimaksud dengan TOPSIS?

TOPSIS (*Technique for Order of Preference by Similarity to Ideal Solution*) adalah metode MCDM yang dikembangkan oleh Hwang dan Yoon (1981). Prinsipnya: alternatif terbaik adalah yang **paling dekat** dengan solusi ideal positif (kondisi sempurna) dan **paling jauh** dari solusi ideal negatif (kondisi terburuk). TOPSIS menghasilkan skor preferensi V antara 0–1 untuk setiap alternatif.

### D2. Mengapa TOPSIS digunakan untuk perankingan?

TOPSIS dipilih karena: (1) konsep "kedekatan ke solusi ideal" sangat natural untuk kasus rekomendasi lokasi, (2) mampu menangani kriteria benefit dan cost secara jelas, (3) skor 0–1 langsung bisa dipetakan ke kategori visual (hijau/kuning/merah), (4) komputasinya ringan untuk dihitung real-time setiap request rider, dan (5) sudah banyak digunakan dalam penelitian SPK sehingga mudah dipertanggungjawabkan secara akademik.

### D3. Apa yang dimaksud solusi ideal positif (A⁺)?

A⁺ adalah kondisi hipotetis di mana setiap kriteria bernilai terbaik: nilai **maksimum** untuk kriteria benefit, nilai **minimum** untuk kriteria cost. A⁺ mewakili "zona sempurna" yang POI-nya paling banyak, paling beragam, paling dekat, paling ramai, dan paling tahan cuaca.

### D4. Apa yang dimaksud solusi ideal negatif (A⁻)?

A⁻ adalah kebalikannya: nilai **minimum** untuk benefit, nilai **maksimum** untuk cost. A⁻ mewakili "zona terburuk" — POI sedikit, tidak beragam, paling jauh, paling sepi, dan paling rentan cuaca.

### D5. Lokasi ideal positif dalam kasus kopi keliling?

Zona yang memiliki POI terbanyak (C1 max), kategori POI paling beragam (C2 max), jarak paling dekat dari rider (C3 min), keramaian tertinggi pada jam saat ini (C4 max), dan ketahanan cuaca terbaik (C5 max). Contoh: zona kampus dengan 12 POI, 3 kategori, jarak 900m, skor keramaian 5.0, ketahanan cuaca 90.5.

### D6. Lokasi ideal negatif dalam kasus kopi keliling?

Zona dengan POI paling sedikit, hanya 1 kategori, jarak paling jauh, keramaian terendah, dan ketahanan cuaca terburuk. Contoh: zona taman kota yang hanya punya 3 POI, 1 kategori, jarak 4200m, skor keramaian 3.0, ketahanan cuaca 56.3 (karena outdoor dan sedang musim hujan).

### D7. Bagaimana TOPSIS menangani benefit dan cost?

Pada penentuan A⁺ dan A⁻: untuk benefit → A⁺ = max, A⁻ = min; untuk cost → A⁺ = min, A⁻ = max. Ini memastikan bahwa zona dengan jarak pendek (cost rendah) dianggap lebih dekat ke solusi ideal, sementara zona dengan keramaian tinggi (benefit tinggi) juga dianggap lebih dekat ke solusi ideal.

### D8. Mengapa jarak rider dikategorikan cost?

Karena jarak yang lebih besar berarti konsumsi BBM lebih banyak, waktu tempuh lebih lama, dan efisiensi operasional menurun. Rider ingin jarak **sekecil mungkin** — sehingga jarak bersifat cost (↓).

### D9. Mengapa C1, C2, C4, C5 dikategorikan benefit?

- **C1 (Densitas POI)**: semakin banyak POI = semakin banyak potensi pelanggan.
- **C2 (Diversitas POI)**: semakin beragam = target pasar lebih luas sepanjang hari.
- **C4 (Keramaian)**: semakin ramai = semakin besar peluang penjualan.
- **C5 (Ketahanan Cuaca)**: semakin tahan cuaca = semakin kecil risiko kehilangan pelanggan karena hujan.

### D10. Bagaimana normalisasi TOPSIS dilakukan?

TOPSIS menggunakan **vector normalization**: r_ij = x_ij / √(Σ x_ij²). Setiap nilai dibagi akar kuadrat dari jumlah kuadrat semua nilai pada kolom yang sama. Ini mengubah semua kriteria menjadi skala yang sebanding (0–1) tanpa mengubah proporsi antar alternatif.

### D11. Mengapa normalisasi dibutuhkan?

Kriteria memiliki satuan dan rentang berbeda: C1 dalam jumlah (3-12), C3 dalam meter (900-4200), C5 dalam skor (56-90). Tanpa normalisasi, kriteria dengan nilai besar (jarak dalam meter) akan mendominasi perhitungan jarak Euclidean, mengabaikan kriteria bernilai kecil. Normalisasi memastikan setiap kriteria berkontribusi secara proporsional.

### D12. Bagaimana bobot BWM masuk ke TOPSIS?

Setelah normalisasi (Step 2), matriks ternormalisasi dikalikan bobot BWM: v_ij = w_j × r_ij (Step 3). Ini disebut **weighted normalized matrix**. Bobot BWM menentukan seberapa besar pengaruh setiap kriteria pada perhitungan jarak ke solusi ideal.

### D13. Apa arti nilai preferensi (V)?

V_i = D⁻_i / (D⁺_i + D⁻_i), nilainya 0–1. V = 1 berarti zona persis di solusi ideal positif; V = 0 berarti persis di solusi ideal negatif. Semakin tinggi V, semakin "ideal" zona tersebut secara keseluruhan. Dalam penelitian ini: V ≥ 0.7 = sangat direkomendasikan, 0.5–0.7 = direkomendasikan, < 0.5 = kurang.

### D14. Bagaimana ranking ditentukan?

Zona diurutkan berdasarkan nilai V secara **descending** (tertinggi ke terendah). Zona dengan V tertinggi = ranking 1 (rekomendasi utama). Sistem menampilkan Top 3-5 zona dengan V ≥ 0.3.

### D15. Mengapa TOPSIS cocok untuk Top-N?

TOPSIS secara natural menghasilkan skor kontinu 0–1 yang langsung bisa diurutkan. Tidak seperti beberapa metode lain yang hanya menghasilkan perbandingan berpasangan, TOPSIS memberikan skor absolut per alternatif — cocok untuk mengambil Top-N dan memvisualisasikan dengan gradasi warna.

### D16. Kelemahan TOPSIS yang perlu diakui?

(1) **Rank reversal**: jika zona ditambah/dihapus, skor zona lain bisa berubah meskipun datanya tetap — karena normalisasi dan solusi ideal bergantung pada semua alternatif. (2) **Asumsi jarak Euclidean**: mengasumsikan kriteria independen satu sama lain. (3) **Sensitif terhadap outlier**: satu zona dengan nilai ekstrem bisa menggeser solusi ideal secara signifikan.

---

## E. Hybrid BWM-TOPSIS

### E1. Mengapa menggunakan metode hybrid BWM-TOPSIS?

Karena masalah pemilihan lokasi kopi keliling memiliki **dua sub-masalah** yang berbeda: (1) menentukan prioritas kriteria (mana yang lebih penting antara keramaian vs jarak vs cuaca), dan (2) meranking zona berdasarkan prioritas tersebut. Tidak ada satu metode MCDM yang optimal untuk kedua tugas sekaligus. BWM unggul di pembobotan, TOPSIS unggul di perankingan — menggabungkan keduanya menghasilkan sistem yang lebih kuat daripada masing-masing berdiri sendiri.

### E2. Mengapa tidak cukup hanya BWM?

BWM hanya menghasilkan **bobot kriteria** — ia menjawab "kriteria mana yang paling penting?" tetapi tidak bisa meranking alternatif zona. BWM tidak memiliki mekanisme untuk membandingkan zona A1 vs A2 vs A3 berdasarkan data kuantitatif setiap kriteria. Untuk itu dibutuhkan metode perankingan seperti TOPSIS.

### E3. Mengapa tidak cukup hanya TOPSIS?

TOPSIS bisa bekerja tanpa BWM, tetapi bobotnya harus ditentukan secara ad hoc (misalnya semua sama 0.2) atau berdasarkan metode lain. Tanpa pembobotan terstruktur, TOPSIS kehilangan kemampuan untuk mencerminkan prioritas bisnis. BWM memberikan TOPSIS bobot yang **terukur, konsisten, dan berbasis expertise** — bukan asumsi semata.

### E4. Bagaimana alur integrasi BWM dan TOPSIS?

```
TAHAP OFFLINE (1x setup oleh Supervisor):
  SPV pilih Best/Worst criterion → Isi BO & OW → Sistem hitung BWM → Bobot (w1-w5)

TAHAP REAL-TIME (setiap rider request):
  Ambil GPS rider → Filter zona → Hitung C1-C5 per zona → 
  Normalisasi → Kalikan bobot BWM → Tentukan A⁺ & A⁻ → 
  Hitung jarak → Hitung V → Ranking → Top-N zona
```

### E5. Pada tahap mana BWM digunakan?

BWM digunakan pada **tahap offline/setup** — satu kali konfigurasi oleh supervisor. Hasilnya (bobot w1–w5) disimpan di database dan digunakan berulang kali oleh TOPSIS. BWM hanya perlu diulang jika supervisor ingin mengubah prioritas kriteria.

### E6. Pada tahap mana TOPSIS digunakan?

TOPSIS digunakan pada **tahap real-time** — setiap kali rider meminta rekomendasi. TOPSIS mengambil bobot BWM dari database, menghitung nilai C1–C5 per zona berdasarkan data terkini (posisi rider, jam saat ini, cuaca saat ini), lalu menghasilkan ranking.

### E7. Apa input BWM?

(1) Pemilihan kriteria terbaik dan terburuk oleh supervisor. (2) Vektor Best-to-Others: 5 nilai perbandingan skala 1-9. (3) Vektor Others-to-Worst: 5 nilai perbandingan skala 1-9. Total: 7 nilai unik (karena Best vs Best = 1 dan Worst vs Worst = 1).

### E8. Apa output BWM?

(1) Vektor bobot 5 kriteria: [w1, w2, w3, w4, w5] dengan Σw = 1. (2) Consistency Index (ξ) untuk validasi. Contoh output: w1=0.150, w2=0.112, w3=0.064, w4=0.449, w5=0.225, ξ < threshold.

### E9. Apa input TOPSIS?

(1) **Matriks keputusan**: m zona × 5 kriteria (data real-time C1–C5). (2) **Bobot BWM**: [w1–w5] dari database. (3) **Tipe kriteria**: [benefit, benefit, cost, benefit, benefit].

### E10. Apa output TOPSIS?

(1) Nilai preferensi V untuk setiap zona (0–1). (2) Ranking zona berdasarkan V descending. (3) Breakdown skor per kriteria untuk transparansi. Contoh: A1=0.887 (Rank 1), A2=0.560 (Rank 2), A3=0.522 (Rank 3).

### E11. Bagaimana hybrid ini menjawab masalah intuisi?

Sebelumnya: supervisor bilang "coba jualan di daerah kampus" berdasarkan insting → rider coba 1 minggu → evaluasi penjualan → pindah jika gagal. Sekarang: supervisor menuangkan expertise ke BWM (bobot) → sistem mengolah data spasial + cuaca via TOPSIS → rider langsung mendapat ranking zona dengan skor terukur. Proses trial-and-error 1 minggu digantikan rekomendasi instan berbasis data.

### E12. Bagaimana BWM-TOPSIS mendukung keputusan berbasis data?

BWM mengkonversi pengetahuan tacit supervisor menjadi bobot numerik. TOPSIS mengolah data objektif (POI dari OSM, jarak GPS, cuaca Open-Meteo) menggunakan bobot tersebut. Hasilnya: keputusan yang **menggabungkan expertise manusia dengan data real-time** — lebih terstruktur daripada intuisi murni, lebih kontekstual daripada data murni.

### E13. Apa perbedaan dengan penelitian BWM-TOPSIS terdahulu?

Penelitian BWM-TOPSIS terdahulu umumnya digunakan untuk evaluasi pemasok (Asadabadi et al., 2022), penilaian kredit (Roy & Shaw, 2021), atau evaluasi wilayah statis (Tu et al., 2020). Penelitian ini **berbeda** karena: (1) diterapkan pada pemilihan lokasi penjualan **mobile/keliling** yang bersifat dinamis, (2) kriteria C3 (jarak) dan C5 (cuaca) berubah real-time setiap request, (3) alternatif berupa zona geospasial yang divalidasi oleh expert, bukan entitas statis.

### E14. Apa gap yang ingin diisi?

Gap yang diisi: (1) Belum ada penelitian BWM-TOPSIS untuk kasus **penjual keliling/mobile vendor**. (2) Belum ada SPK yang mengintegrasikan data geospasial (PostGIS), data cuaca real-time, dan pembobotan expert dalam satu pipeline untuk rekomendasi lokasi jualan. (3) Penelitian pemilihan lokasi kuliner sebelumnya (Isyriyah et al., 2024) menggunakan AHP-TOPSIS dengan kriteria statis — penelitian ini menggunakan BWM dan kriteria dinamis.

### E15. Bagaimana BWM-TOPSIS diadaptasi untuk kasus dinamis?

Adaptasi kunci: (1) **Bobot BWM bersifat semi-statis** — di-setup sekali oleh SPV, bisa diupdate kapan saja. (2) **TOPSIS bersifat fully dynamic** — dihitung ulang setiap request dengan data real-time: posisi GPS rider (C3 berubah), jam saat ini (C4 berubah), cuaca saat ini (C5 berubah). (3) **Filter pipeline sebelum TOPSIS** memastikan hanya zona yang relevan (dalam radius, di zona aktif, bukan jalur protokoler) yang masuk perhitungan.

---

## F. Kriteria Penilaian Lokasi

### F1. Mengapa densitas POI digunakan sebagai kriteria?

Densitas POI (C1) mengukur **jumlah titik keramaian** dalam suatu zona. Semakin banyak POI (sekolah, kampus, taman, pabrik, kantor), semakin besar potensi pelanggan yang berkumpul di area tersebut. Zona dengan 12 POI jelas lebih potensial daripada zona dengan 3 POI — karena lebih banyak sumber arus orang.

### F2. Bagaimana densitas POI dihitung?

Dengan query PostGIS: `SELECT COUNT(*) FROM points_of_interest poi JOIN operational_zones oz ON ST_Within(poi.geom, oz.boundary) WHERE oz.id = [zona_id]`. Hasilnya berupa integer — jumlah POI dari 5 kategori yang jatuh di dalam polygon zona.

### F3. Mengapa diversitas POI digunakan?

Diversitas POI (C2) mengukur **variasi jenis POI** dalam zona. Zona yang hanya berisi pabrik akan ramai pada jam tertentu saja (shift masuk/pulang). Zona yang memiliki kampus + kantor + taman memiliki arus orang yang lebih merata sepanjang hari — target pasar lebih luas dan jam jualan lebih fleksibel.

### F4. Bagaimana diversitas POI dihitung?

`SELECT COUNT(DISTINCT poi.category) FROM points_of_interest poi JOIN operational_zones oz ON ST_Within(poi.geom, oz.boundary) WHERE oz.id = [zona_id]`. Nilainya antara 1–5 (karena ada 5 kategori: Sekolah, Kampus, Taman Kota, Pabrik, Kantor).

### F5. Mengapa jarak rider digunakan?

Jarak rider (C3) mengukur **efisiensi operasional**. Semakin jauh zona, semakin banyak BBM, waktu, dan tenaga yang terbuang untuk perjalanan — mengurangi margin keuntungan. Rider yang sudah di daerah tertentu idealnya mendapat rekomendasi zona yang dekat dari posisinya saat ini.

### F6. Bagaimana jarak rider dihitung?

Dengan PostGIS geodesic distance: `ST_Distance(rider_position::geography, ST_Centroid(oz.boundary)::geography)`. Hasilnya dalam meter, mengukur jarak garis lurus dari GPS rider ke titik tengah (centroid) zona. Jarak geodesik digunakan agar akurat di permukaan bumi.

### F7. Mengapa tingkat keramaian digunakan?

Keramaian (C4) adalah **proxy paling langsung** terhadap potensi penjualan. Zona dengan POI banyak tetapi sedang sepi (misalnya kampus jam 20:00) tidak akan menghasilkan penjualan tinggi. C4 menambahkan dimensi **temporal** — kapan zona tersebut ramai, bukan hanya apa isinya.

### F8. Bagaimana keramaian diperkirakan?

Menggunakan **matriks Likert** yang diisi oleh supervisor: 7 interval waktu (06-08 s/d 18-20) × 5 kategori POI, skala 1-5. Saat rider request, sistem mengambil baris matriks sesuai jam saat ini, lalu menghitung rata-rata tertimbang: C4 = Σ(jumlah_POI_kategori_i × skor_likert_i) / total_POI_zona. Pendekatan ini dipilih karena Google Popular Times tidak tersedia via API publik.

### F9. Mengapa ketahanan cuaca digunakan?

Cuaca sangat memengaruhi perilaku konsumen outdoor. Saat hujan, orang cenderung tidak keluar membeli kopi dari gerobak. Namun dampak cuaca **berbeda per jenis lokasi**: zona kantor (indoor) tetap ramai saat hujan, sementara zona taman kota menjadi sepi. C5 mengkuantifikasi perbedaan ini.

### F10. Bagaimana peluang hujan memengaruhi keputusan?

Precipitation Probability (PP) dari Open-Meteo dikonversi menjadi skor ketahanan: S = 100 − PP. Lalu dikalikan koefisien sensitivitas per jenis POI (α). Formula: C5 = S + (100−S) × α_avg. Jika PP tinggi (80%) tetapi zona berisi kantor (α=0.90), C5 tetap tinggi (~82) karena kantor tahan cuaca. Jika zona berisi taman (α=0.20), C5 akan rendah (~36).

### F11. Apakah semua kriteria dari data otomatis?

Tidak. C1, C2, C3 bersifat otomatis (dari PostGIS dan GPS). C4 berasal dari matriks Likert yang diisi manual oleh supervisor. C5 gabungan: PP otomatis dari API, tetapi koefisien α diisi manual oleh supervisor. Kombinasi ini memastikan data objektif diperkaya dengan pengetahuan operasional.

### F12. Kriteria dari data spasial?

C1 (Densitas POI), C2 (Diversitas POI), dan C3 (Jarak dari Rider) — ketiganya dihitung dari query PostGIS menggunakan data POI dari Overpass-API dan posisi GPS rider.

### F13. Kriteria dari preferensi supervisor?

C4 (Skor Keramaian) — sepenuhnya dari matriks Likert yang diisi supervisor. C5 (Ketahanan Cuaca) — koefisien sensitivitas α ditentukan supervisor (meskipun PP dari API). Bobot seluruh kriteria juga dari preferensi supervisor via BWM.

### F14. Kriteria yang berubah real-time?

- **C3** berubah setiap request karena posisi GPS rider bergerak.
- **C4** berubah berdasarkan jam saat ini (baris matriks Likert berbeda).
- **C5** berubah berdasarkan Precipitation Probability terkini dari Open-Meteo.
- C1 dan C2 relatif statis (berubah hanya jika ada sync POI baru atau zona diubah).

### F15. Bagaimana setiap kriteria dikonversi menjadi nilai numerik?

| Kriteria | Nilai Mentah | Konversi |
|---|---|---|
| C1 | COUNT POI | Sudah integer, langsung pakai |
| C2 | COUNT DISTINCT kategori | Sudah integer (1-5), langsung pakai |
| C3 | ST_Distance (meter) | Sudah numerik (float), langsung pakai |
| C4 | Likert × komposisi POI | Rata-rata tertimbang → float (1.0-5.0) |
| C5 | PP × α_avg | Formula S + (100-S)×α_avg → float (0-100) |

Semua nilai sudah numerik sebelum masuk matriks keputusan TOPSIS. Normalisasi vektor kemudian membawa semua ke skala sebanding.

---

## G. Kaitan Metode dengan Kasus

### G1. Masalah utama apa yang diselesaikan?

Masalah utama: rider kopi keliling "Sejuta Jiwa" **tidak memiliki dasar objektif** untuk memilih lokasi berjualan. Selama ini pemilihan berdasarkan intuisi supervisor dan trial-and-error selama ±1 minggu — proses yang membuang waktu, BBM, dan potensi penjualan. BWM-TOPSIS menyediakan rekomendasi zona yang terukur, real-time, dan berbasis data.

### G2. Bagaimana metode ini membantu mengurangi trial 1 minggu?

Tanpa SPK, rider harus **mencoba** lokasi baru selama seminggu untuk mengevaluasi potensinya. Dengan SPK BWM-TOPSIS, sistem langsung menghitung potensi setiap zona berdasarkan data POI, keramaian per jam, jarak, dan cuaca — menghasilkan ranking instan. Rider tidak perlu trial-and-error karena sistem sudah "mencoba" secara matematis.

### G3. Bagaimana metode ini membantu rider?

Rider membuka halaman rekomendasi → melihat peta dengan zona berwarna hijau/kuning/merah → klik zona untuk lihat detail skor → tekan "Navigasi" ke zona terbaik. Rider tidak perlu berpikir "enaknya jualan di mana ya?" — sistem sudah menyajikan jawaban yang terstruktur dan bisa langsung ditindaklanjuti.

### G4. Bagaimana metode ini membantu supervisor?

Supervisor menuangkan expertise-nya ke dalam sistem secara terstruktur: menggambar zona, mengisi matriks keramaian, menentukan bobot BWM. Setelah setup, ia bisa memonitor apakah rekomendasi SPK akurat dengan membandingkan ranking vs log penjualan. Jika tidak akurat, ia bisa update konfigurasi — proses **continuous improvement** yang terukur.

### G5. Bagaimana cuaca masuk ke pengambilan keputusan?

Precipitation Probability diambil real-time dari Open-Meteo API setiap kali rider request rekomendasi. Nilai PP dikonversi menjadi skor ketahanan cuaca (C5) menggunakan koefisien sensitivitas per jenis POI. Zona yang berisi POI indoor (kantor, pabrik) mendapat skor C5 tinggi meskipun PP tinggi — sehingga tetap direkomendasikan saat hujan. Zona outdoor (taman) skornya turun drastis.

### G6. Bagaimana posisi rider membuat rekomendasi dinamis?

Setiap kali rider request, posisi GPS-nya diambil dan digunakan untuk menghitung C3 (jarak ke centroid setiap zona). Jika rider berpindah posisi, ranking bisa berubah — zona yang tadinya jauh bisa menjadi dekat dan naik ranking. Ini membuat rekomendasi selalu relevan dengan kondisi rider saat itu.

### G7. Mengapa tidak cukup hanya menampilkan peta tanpa SPK?

Peta tanpa SPK hanya menampilkan informasi mentah — titik POI, zona, cuaca. Rider tetap harus **menganalisis sendiri** mana yang terbaik dari puluhan zona. Ini membutuhkan kemampuan analisis multikriteria yang sulit dilakukan secara mental, apalagi saat di jalan. SPK memproses data tersebut dan menyajikan rekomendasi yang sudah jadi.

### G8. Mengapa tidak cukup hanya menampilkan cuaca tanpa TOPSIS?

Informasi cuaca saja hanya menjawab satu pertanyaan: "apakah akan hujan?" Rider masih harus mempertimbangkan 4 faktor lainnya. Bahkan jika cuaca cerah, belum tentu zona tersebut ramai atau dekat. TOPSIS menggabungkan cuaca dengan semua kriteria lain untuk menghasilkan rekomendasi yang holistik.

### G9. Apa makna ranking lokasi bagi operasional?

Ranking memberikan **prioritas yang jelas**: zona ranking 1 adalah yang paling potensial secara keseluruhan, ranking 2 adalah cadangan, dst. Ini memungkinkan: (1) rider langsung menuju zona terbaik, (2) jika ada 2 rider di area yang sama, mereka bisa membagi zona — satu ke ranking 1, satu ke ranking 2, (3) supervisor bisa mengevaluasi apakah zona ranking tinggi memang menghasilkan penjualan tinggi.

### G10. Bagaimana hasil rekomendasi dievaluasi menggunakan log penjualan?

Rider mencatat log penjualan (zona, jam, jumlah cup) di sistem POS sederhana. Supervisor bisa membandingkan: apakah zona dengan skor TOPSIS tinggi konsisten menghasilkan penjualan tinggi? Jika ya, SPK akurat. Jika tidak, supervisor bisa: (1) mengupdate bobot BWM, (2) merevisi matriks keramaian, (3) menyesuaikan koefisien sensitivitas cuaca. Log penjualan menjadi **feedback loop** untuk continuous improvement SPK.

---

> **Rangkuman Alur Landasan Teori:**
>
> 1. **Masalah** → Pemilihan lokasi kopi keliling berbasis intuisi, tidak efisien (trial 1 minggu)
> 2. **Butuh SPK** → Karena masalahnya semi-terstruktur dengan banyak kriteria yang saling bertentangan
> 3. **Butuh MCDM** → Karena ada 5 kriteria (benefit + cost) dengan satuan dan bobot berbeda
> 4. **BWM untuk bobot** → Menangkap expertise supervisor secara terstruktur, input sedikit, konsistensi terjaga
> 5. **TOPSIS untuk ranking** → Meranking zona berdasarkan kedekatan ke solusi ideal, output 0–1 cocok untuk visualisasi
> 6. **Hybrid BWM-TOPSIS** → BWM (offline, bobot) + TOPSIS (real-time, ranking) = pipeline yang efisien dan adaptif
> 7. **Diterapkan ke kasus** → Data spasial PostGIS + cuaca Open-Meteo + expertise SPV → rekomendasi zona instan untuk rider
