# NETRA - Network Inventory Manager

**NETRA Network Tracking** adalah aplikasi web berbasis React yang dirancang untuk mempermudah manajemen inventaris perangkat jaringan (Network Devices). Aplikasi ini memungkinkan administrator jaringan untuk memantau, mendata, dan mengelola status perangkat seperti Router, Switch, Server, dan Access Point secara real-time.

---

## Fitur Unggulan

* **CRUD Management:** Tambah, Baca, Edit, dan Hapus data perangkat dengan mudah.
* **Real-time Monitoring:** Indikator visual status **Online/Offline** yang jelas.
* **Smart Filtering:** Filter perangkat berdasarkan Status (All, Online, Offline) dan Tipe Device (All Device, Switch, Router, Access Point, Server).
* **Live Search:** Pencarian perangkat berdasarkan Nama Device atau IP Address secara instan.
* **Responsive Design:** Tampilan adaptif yang rapi di Desktop, Tablet, maupun Mobile.
* **Image Handling:** Upload gambar perangkat dengan kompresi otomatis (Base64) dan dukungan transparansi (PNG).
* **Interactive UI:**
    * Notifikasi interaktif menggunakan **SweetAlert2**.
    * Highlight animasi untuk data baru (New) dan data yang baru diedit (Updated).
    * Pagination untuk menangani jumlah data yang banyak.
    * Detail untuk memuat lebih banyak informasi

---

## Teknologi yang Digunakan

Aplikasi ini dibangun menggunakan teknologi modern:

* **Frontend:** [React.js](https://reactjs.org/) (Vite)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **HTTP Client:** [Axios](https://axios-http.com/)
* **Alerts:** [SweetAlert2](https://sweetalert2.github.io/)
* **Icons:** Heroicons / SVG
* **Backend / Database:** [MockAPI.io](https://mockapi.io/) (Cloud JSON Database)

---

## Cara Menjalankan Project

Ikuti langkah-langkah berikut untuk menjalankan aplikasi ini di komputer lokal Anda:

### 1. Clone Repository
```bash
git clone [https://github.com/meyaraa/netra-app.git](https://github.com/meyaraa/netra-app.git)
cd netra-inventory

### 2. Install Node.js
```bash
npm install

### 3. Konfigurasi API
Aplikasi ini menggunakan MockAPI. Pastikan URL API sudah terkonfigurasi di file src/App.jsx.
// src/App.jsx
const API_URL = '[https://6980da3c6570ee87d51088af.mockapi.io/api/v1/devices](https://6980da3c6570ee87d51088af.mockapi.io/api/v1/devices)';

### 4. Jalankan aplikasi pada terminal
```npm run dev
