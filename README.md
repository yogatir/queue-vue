# queue-vue

Antarmuka pengguna (_frontend_) untuk sistem manajemen antrian real-time. Dibuat menggunakan Vite + Vue 3 + Tailwind CSS dan terhubung dengan backend `queue-express`.

## Fitur Utama

- Login staff
- Dashboard statistik antrian dan staff aktif
- Tambah antrian baru (walk-in atau reservasi)
- Panggil antrian otomatis (terhubung dengan backend)
- Tandai antrian sebagai selesai
- Real-time update ke tampilan display menggunakan Socket.IO

## Teknologi

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Socket.IO Client](https://socket.io/)
- [Axios](https://axios-http.com/)

## Cara Install & Menjalankan

1. **Clone repository**
   ```bash
   git clone https://github.com/yogatir/queue-vue.git
   cd queue-vue
   ```
2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Jalankan aplikasi**
    ```bash
    npm run dev
    ```

Aplikasi akan berjalan di: http://localhost:5173

## Struktur Halaman

Aplikasi frontend ini memiliki beberapa halaman utama:

| Halaman         | Path      | Deskripsi                                                                        |
|------------------|-----------|---------------------------------------------------------------------------------|
| Login            | `/`       | Form login staff menggunakan PIN                                                |
| Dashboard        | `/dashboard` | Panel utama untuk memantau antrian dan statistik                             |
| Display Antrian | `/display` | Halaman khusus untuk menampilkan antrian yang sedang dipanggil secara real-time |

---

## Lisensi

Proyek ini menggunakan lisensi MIT. Bebas digunakan untuk keperluan pribadi maupun komersial.

## Pengembang

Dibuat oleh Yoga Tirta
GitHub: https://github.com/yogatir