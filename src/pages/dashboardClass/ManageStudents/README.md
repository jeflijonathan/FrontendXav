# 🏛️ Arsitektur Kode: Pemisahan Logika (Clean Architecture)

Modul ini (`ManageStudents`) dirancang dengan prinsip **Separation of Concerns (Pemisahan Tanggung Jawab)** untuk memastikan kode mudah dibaca, dirawat, diuji (*testable*), dan berumur panjang (*long maintainability*).

---

## 🎯 3 Lapisan Utama (The 3 Layers)

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. Representation Logic (UI Logic) — components/ & *.tsx              │
│    Bertanggung jawab atas tampilan: JSX, style MUI/Tailwind, mapping   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ menggunakan
┌───────────────────────────────────▼────────────────────────────────────┐
│ 2. Framework Logic — hook/ (Custom Hooks)                              │
│    Bertanggung jawab atas siklus hidup React: useState, useEffect,     │
│    integrasi API service, modal state, lifecycle, dan event handlers   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ memanggil
┌───────────────────────────────────▼────────────────────────────────────┐
│ 3. Business Logic — utils/ (Pure TypeScript Functions)                 │
│    Bertanggung jawab atas aturan aplikasi: validasi, kalkulasi,        │
│    deteksi konflik, filter data, formatting. Bebas dari React!         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📂 Struktur Folder Modul

```
ManageStudents/
├── ManageClassStudentsDialog.tsx         # 🎨 Main Dialog Wrapper (Entry Point UI)
├── README.md                             # 📖 Panduan arsitektur ini
│
├── hook/                                 # ⚡ FRAMEWORK LOGIC (React-Specific)
│   ├── useManageClassStudents.ts         # Controller hook utama: state dialog, fetch siswa, lifecycle, submit
│   └── useAddStudentsModal.ts            # Hook khusus state & workflow modal tambah siswa
│
├── utils/                                # 🧠 BUSINESS LOGIC (Framework-Agnostic / Pure TS)
│   └── manageStudentsHelper.ts           # Pure functions: filter, deteksi konflik periode, format nama & foto
│
└── components/                           # 🎨 REPRESENTATION LOGIC (Presentational Components)
    ├── ClassHeaderInfo.tsx               # Card informasi kelas (Nama, Jurusan, Wali Kelas, Status)
    ├── EnrolledStudentsTable.tsx         # Tabel daftar siswa aktif di kelas + toolbar cari + tombol keluarkan
    ├── AddStudentsDialog.tsx             # Modal pemilihan siswa tersedia untuk ditambahkan
    ├── TransferConfirmDialog.tsx         # Modal verifikasi jika siswa terdaftar di kelas lain (periode sama)
    └── RemoveStudentConfirmDialog.tsx    # Modal konfirmasi mengeluarkan siswa dari kelas
```

---

## 📐 Penjelasan Detail Tiap Layer

### 1. 🎨 Representation Logic (UI Logic)
* **Lokasi:** `components/` dan file dialog utama (`*.tsx`).
* **Fokus:** *"Bagaimana data ditampilkan ke pengguna?"*
* **Ciri-ciri:**
  * Berisi tag JSX, styling Material UI (`sx`), Tailwind CSS, ikon, dan struktur layout dialog.
  * **Hanya menerima data via `props`** dan memicu aksi melalui fungsi callback (*event callback*).
  * **Tidak boleh** ada pemanggilan API langsung (`fetch` / `axios` / `classService`).
  * **Tidak boleh** ada kalkulasi bisnis yang rumit di tengah JSX (gunakan helper dari `utils/`).

### 2. ⚡ Framework Logic (Hooks)
* **Lokasi:** `hook/` (contoh: `useManageClassStudents.ts`, `useAddStudentsModal.ts`).
* **Fokus:** *"Bagaimana interaksi dengan ekosistem React dan API berjalan?"*
* **Ciri-ciri:**
  * Menggunakan React hooks (`useState`, `useEffect`, `useMemo`, `useCallback`).
  * Mengatur *lifecycle* komponen (misal: fetch data saat modal pertama kali terbuka).
  * Mengatur komunikasi dengan Service API (`classService.getClassStudents`, `classService.addStudentsToClass`).
  * Menghubungkan hasil Business Logic ke dalam state React.

### 3. 🧠 Business Logic (Pure Functions)
* **Lokasi:** `utils/` (contoh: `manageStudentsHelper.ts`).
* **Fokus:** *"Apa aturan bisnis dan validasi aplikasi?"*
* **Ciri-ciri:**
  * Berisi fungsi **murni (pure functions)** tanpa dependensi ke React (tidak ada `useState`, `useEffect`, dsb.).
  * Dapat dijalankan dan diuji di luar React (misal di console Node.js atau unit test Jest/Vitest).
  * **Contoh di modul ini:**
    * `detectTransferConflicts()`: Menentukan siswa mana yang melanggar aturan *"1 siswa hanya boleh 1 kelas pada periode yang sama"*.
    * `filterEnrolledStudents()`: Menyaring siswa terdaftar berdasarkan nama/NIS/NISN.
    * `getGenderChipConfig()`: Mengonversi kode gender (`L`/`P`) menjadi label dan warna chip yang seragam.

---

## 🧩 Standar Folder Fitur di Seluruh Aplikasi

Di modul-modul lain (seperti `dashboardClass`, `dashboardStudent`, `dashboardEmployee`), struktur ini juga diterapkan dengan folder standar CRUD:

```
dashboardClass/
├── index.tsx                             # Entry point halaman
├── store/                                # Zustand store
├── List/                                 # 📋 Fitur Daftar Kelas
│   ├── ClassTable.tsx                    # Representation Logic (Table)
│   ├── hook/                             # Framework Logic
│   │   ├── useClassList.ts               # Fetch data, pagination, sort
│   │   └── useClassFilters.ts            # State filter
│   └── utils/                            # Business Logic
│       └── FilterClassMapper.ts          # Mapper filter request
├── Create/                               # ➕ Fitur Tambah Kelas
│   ├── CreateClassCardDialog.tsx         # Representation Logic (Dialog)
│   ├── hook/                             # Framework Logic
│   │   ├── useCreateClass.ts             # Submit API handler
│   │   └── useCreateClassForm.ts         # React Hook Form binding
│   └── utils/                            # Business Logic
│       └── createClassForm.ts            # Yup validation schema
├── Update/                               # ✏️ Fitur Edit Kelas
│   ├── UpdateClassCardDialog.tsx
│   ├── hook/
│   └── utils/
├── Detail/                               # 👁️ Fitur Detail Kelas
│   ├── DetailClassCardDialog.tsx
│   └── hook/
└── ManageStudents/                       # 👥 Fitur Kelola Anggota Siswa (Modul ini)
    ├── ManageClassStudentsDialog.tsx
    ├── hook/
    ├── utils/
    └── components/
```

---

## 💡 Tips Menjaga Umur Kode Panjang (*Clean Code Guidelines*)

1. **Komponen Tetap Ramping (< 150 baris):**
   Jika sebuah file `.tsx` membengkak hingga > 300 baris, pecahlah menjadi sub-komponen di `components/`.
2. **Keluarkan Logika dari JSX:**
   Hindari conditional logic berbelit-belit di dalam JSX (seperti `condition ? (a ? (b ? c : d) : e) : f`). Hitung nilainya di hook atau buat fungsi helper di `utils/`.
3. **Simpan Validasi di `utils/`:**
   Aturan seperti *"siswa beda periode boleh masuk, siswa sama periode harus konfirmasi"* adalah aturan bisnis inti. Simpan di `utils/` agar bila aturan berubah, cukup ubah satu fungsi tanpa menyentuh tampilan UI.
4. **Hindari Direct Mutation:**
   Selalu gunakan fungsi *immutable* saat mengubah state array atau objek di dalam hook.

