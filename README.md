# SIBISA Kabupaten Bima

Portal data statis Pemerintah Kabupaten Bima (Sistem Informasi Bima Satu Data).

## Menjalankan secara lokal

Gunakan server statis sederhana (jangan buka file langsung agar fitur pencarian berfungsi):

```bash
python3 -m http.server 8000
```

Lalu buka `http://localhost:8000`.

## Deploy

Unggah seluruh isi folder ke direktori web server (Apache/Nginx). Tidak memerlukan Node.js, Next.js, atau proses build. Pastikan file `index.html` menjadi halaman utama.

## Teknologi

- HTML5
- CSS3
- JavaScript (ES6+)

## Catatan backend

Implementasi asli berbasis Next.js hanya menggunakan perenderan sisi server untuk data statis. Tidak ada API route, server action, atau integrasi backend yang memerlukan server. Data katalog disematkan pada `js/data.js` dan diproses di peramban. Tidak ada kunci API atau kredensial yang digunakan.
EOF