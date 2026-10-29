# React + TypeScript + Vite
# 📘 React Template — Struktur Kode Proyek

> Dokumentasi lengkap mengenai arsitektur, konvensi, dan pola kode yang digunakan di proyek **FrontendXav**.
> Menggunakan halaman **Employee** (`dashboardEmployee`) sebagai sample/contoh.

---

## 📦 Tech Stack

| Kategori | Library | Versi |
|---|---|---|
| Framework | React | ^19 |
| Bundler | Vite | ^8 |
| Language | TypeScript | ~6.0 |
| UI Library | MUI (Material UI) | ^9 |
| State Management | Zustand | ^5 |
| Forms | React Hook Form + Yup | ^7 / ^1.7 |
| Routing | React Router DOM | ^7 |
| HTTP Client | Axios | ^1.19 |
| Styling | Tailwind CSS v4 | ^4.3 |
| Notification | Notistack | ^3 |
| SEO | React Helmet Async | ^3 |

---

## 🗂️ Struktur Folder Utama

```
src/
├── main.tsx                    # Entry point aplikasi
├── App.tsx                     # Root component (providers)
├── router.tsx                  # Konfigurasi routing
├── index.css                   # Global styles
├── env.d.ts                    # Type definitions untuk env vars
│
├── api/                        # Layer API (service + model)
│   ├── index.ts                # Base API class (Axios wrapper)
│   ├── employee/               # ← Contoh modul API
│   │   ├── model.ts            # Interface request/response
│   │   └── service.ts          # Service class (CRUD operations)
│   ├── student/
│   ├── announcement/
│   └── ...                     # Modul API lainnya
│
├── common/                     # Shared/reusable code
│   ├── components/             # Reusable UI components
│   │   ├── Table/              # BaseTable, TableHeader, TableBody, TableRow, etc.
│   │   ├── Dialog/             # BaseDialog, DialogHeader, DialogBody, DialogFooter
│   │   ├── Headers/            # DashboardHeader
│   │   ├── Input/              # Custom input components
│   │   ├── Icon/               # Custom icon components
│   │   ├── Theme/              # ThemeInitializer (MUI ThemeProvider)
│   │   ├── NotificationStack/  # Notification system
│   │   └── feedback/           # Feedback components
│   ├── layouts/                # Layout wrappers
│   │   ├── DashboardLayout.tsx # Layout untuk halaman dashboard (Outlet)
│   │   ├── AuthLayout.tsx      # Layout untuk halaman auth
│   │   ├── HeaderApp/          # Top header bar
│   │   ├── NavbarApp/          # Navigation bar
│   │   └── SidebarApp/         # Sidebar navigation
│   ├── hooks/                  # Custom hooks global
│   │   ├── useDebounce.ts
│   │   └── useSidebarActions.tsx
│   ├── store/                  # Global Zustand stores
│   │   ├── useNotificationStore.ts
│   │   ├── useSidebarStore.ts
│   │   ├── useTableStore.ts
│   │   └── useThemeStore.ts
│   ├── types/                  # Shared TypeScript types
│   │   └── index.ts            # PaginationType, FetchCallback, FilterParams, dll.
│   ├── utils/                  # Utility functions
│   │   ├── catchError.ts       # Error handler untuk API calls
│   │   ├── localStorage.ts     # LocalStorage wrapper
│   │   ├── snackbar.ts         # Snackbar utility
│   │   ├── uploadFile.ts       # File upload helper
│   │   ├── parseErrorDetails.ts
│   │   └── ...
│   ├── constants/              # Constant data (e.g. indonesianCities)
│   └── consts/                 # Theme color constants
│
└── pages/                      # Feature pages (per-module)
    ├── Auth/                   # Login page
    ├── Home/                   # Landing page
    ├── Dashboard/              # Main dashboard
    ├── DashboardProfile/       # User profile
    ├── dashboardEmployee/      # ← SAMPLE PAGE (lihat detail di bawah)
    ├── dashboardStudent/
    ├── dashboardAnnouncement/
    ├── dashboardSchedules/
    ├── dashboardSchoolInformation/
    ├── dashboardUploadFile/
    └── ...
```

---

## 🎯 Sample: Halaman Employee (`dashboardEmployee`)

### Struktur Folder

```
pages/dashboardEmployee/
├── index.tsx                           # 🟢 Entry point halaman
├── store/
│   └── index.ts                        # 🔵 Zustand store (state management)
│
├── List/                               # 📋 Fitur: Daftar Employee
│   ├── EmployeeTable.tsx               # Komponen utama tabel
│   ├── hook/
│   │   ├── useEmployeeList.ts          # Hook: fetch data, headers, sort options
│   │   └── useEmployeeFilters.ts       # Hook: pagination, search, sort, order
│   └── utils/
│       └── FilterEmployeeMapper.ts     # Mapper: state → API filter params
│
├── Create/                             # ➕ Fitur: Tambah Employee
│   ├── CreateEmployeeCardDialog.tsx    # Dialog wrapper (FormProvider + BaseDialog)
│   ├── CreateEmployeeFormDialog.tsx    # Form fields
│   ├── CreateEmployeeFooterDialog.tsx  # Footer (submit/cancel buttons)
│   ├── hook/
│   │   ├── useCreateEmployee.ts        # Hook: handle create logic + upload
│   │   └── useCreateEmployeeForm.ts    # Hook: react-hook-form setup
│   └── utils/
│       └── createEmployeeForm.ts       # Yup validation schema
│
├── Detail/                             # 👁️ Fitur: Lihat Detail Employee
│   ├── DetailEmployeeCardDialog.tsx    # Dialog wrapper
│   ├── DetailEmployeeContentDialog.tsx # Content (data display)
│   ├── DetailEmployeeSkeleton.tsx      # Loading skeleton
│   └── hook/
│       └── useDetailEmployee.ts        # Hook: fetch detail by ID
│
└── Update/                             # ✏️ Fitur: Edit Employee
    ├── UpdateEmployeeCardDialog.tsx     # Dialog wrapper
    ├── UpdateEmployeeFormDialog.tsx     # Form fields (pre-filled)
    ├── UpdateEmployeeFooterDialog.tsx   # Footer (submit/cancel buttons)
    └── hook/
        ├── useUpdateEmployee.ts        # Hook: handle update logic + upload
        └── useUpdateEmployeeForm.ts    # Hook: react-hook-form setup (pre-fill)
```

---

## 🔄 Alur Data (Data Flow)

```
┌─────────────────────────────────────────────────────────────┐
│                         COMPONENT                           │
│  (EmployeeTable / CreateDialog / UpdateDialog / Detail)     │
│                            │                                │
│                    menggunakan HOOK                          │
│                            │                                │
│               ┌────────────┼────────────┐                   │
│               ▼            ▼            ▼                   │
│        useEmployeeList  useCreateEmployee  useDetailEmployee│
│               │            │            │                   │
│               │     ┌──────┘            │                   │
│               ▼     ▼                   ▼                   │
│          EmployeeService (API Layer)                        │
│               │                                             │
│               ▼                                             │
│    Zustand Store (useDashboardEmployeeStore)                │
│               │                                             │
│               ▼                                             │
│     React Re-render → UI Update                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Penjelasan Tiap Layer

### 1. Entry Point (`index.tsx`)

File ini adalah komponen utama halaman yang di-import oleh `router.tsx`.

```tsx
// pages/dashboardEmployee/index.tsx
const DashboardEmployee = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    return (
        <>
            <DashboardHeader title="..." description="...">
                <Button onClick={() => setIsCreateOpen(true)}>Tambah Karyawan</Button>
            </DashboardHeader>
            <EmployeeTable />
            <CreateEmployeeCardDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
        </>
    );
};
```

**Pola:**
- Menggunakan `DashboardHeader` dari `@components/Headers` untuk header halaman
- Menyertakan tombol aksi (Tambah) di dalam header
- Menyertakan tabel data dan dialog create

---

### 2. Zustand Store (`store/index.ts`)

Setiap page module memiliki **Zustand store sendiri** untuk state lokal.

```ts
// Pola Store:
export type DashboardEmployeeStoreStateType = {
    data: EmployeeResponseModel[];          // Data dari API
    createEmployeeReqDetails: ...;          // Data form create
    updateEmployeeReqDetails: ...;          // Data form update
    profileFile: File | null;               // File upload
    roleUser: RoleModel[];                  // Data dropdown role
    detailError: { create: ...; update: ...; }; // Error tracking
    isLoading: boolean;                     // Loading state (list)
    isCreateLoading: boolean;               // Loading state (create)
    isUpdateLoading: boolean;               // Loading state (update)
    filters: FilterType;                    // Filter params
    search: SearchType;                     // Search value
    pagination: PaginationType;             // Pagination info
};

// Konvensi penamaan: use[NamaModule]Store
export const useDashboardEmployeeStore = create<StoreType>((set) => ({
    state: { ... },
    setState: (fn) => set((prev) => ({ state: fn(prev.state) })),
}));
```

**Konvensi:**
- State dibungkus dalam objek `state` dengan setter `setState` yang menerima **updater function**
- Semua loading state dipisah per-operasi (`isLoading`, `isCreateLoading`, `isUpdateLoading`)
- Filter, search, dan pagination disimpan di store agar persist saat navigasi antar dialog

---

### 3. API Layer (`api/employee/`)

#### Model (`model.ts`)

Berisi **interface TypeScript** untuk request/response body.

```ts
// Konvensi penamaan:
export interface EmployeeResponseModel { ... }          // Response dari API
export interface CreateEmployeeRequestModel { ... }     // Body untuk POST
export interface UpdateEmployeeRequestModel { ... }     // Body untuk PATCH
```

#### Service (`service.ts`)

Berisi **class** dengan method CRUD yang memanggil base `API` class.

```ts
export default class EmployeeService {
    basePath = "/employees/";
    service = new API();

    // Pola: method menerima callback (FetchCallback<T>) bukan return Promise langsung
    async getAll(callback: FetchCallback<DataWithPagination<EmployeeResponseModel[]>>, params?: FilterParams) {
        const res = await this.service.GET(...);
        if (res.status == "SUCCESS") {
            callback.onSuccess({ data: res.data.data, pagination: res.data.pagination });
        } else {
            callback.onError({ message: res.message, detail: res.details });
        }
        if (callback.onFullfilled) callback.onFullfilled();
    }

    async getById(id, callback) { ... }
    async create(data, callback) { ... }
    async update(id, data, callback) { ... }
    async delete(id, callback) { ... }
}
```

**Konvensi:**
- Setiap service extends base `API` class
- Menggunakan **callback pattern** (`FetchCallback<T>`) dengan `onSuccess`, `onError`, `onFullfilled`
- Base `API` class menyediakan: `GET`, `POST`, `POSTFORMDATA`, `PUT`, `PATCH`, `DELETE`, `DOWNLOADBLOB`

---

### 4. Custom Hooks (`hook/`)

#### `useEmployeeList.ts` — Data Fetching & Table Config

```ts
const useEmployeeList = (): ReturnHook => {
    const { enqueueSnackbar } = useSnackbar();
    const { state, setState } = useDashboardEmployeeStore();
    const service = new EmployeeService();

    const fetchEmployeeList = async (filterParams?: FilterParams) => {
        setState((prev) => ({ ...prev, isLoading: true }));
        return await service.getAll({
            onSuccess: (res) => {
                setState((prev) => ({ ...prev, data: res.data, pagination: res.pagination, isLoading: false }));
            },
            onError: (err) => {
                enqueueSnackbar(err.message, { variant: "error" });
                setState((prev) => ({ ...prev, isLoading: false }));
            },
        }, filterParams);
    };

    // Definisikan table headers dan sort options
    const employeeHeaders: TableHeaderType[] = [ ... ];
    const sortOptions: SortOptionType[] = [ ... ];

    return { statusData, tableData: state.data, employeeHeaders, sortOptions, fetchEmployeeList };
};
```

#### `useEmployeeFilters.ts` — Filter, Search, Sort, Pagination

```ts
const useEmployeeFilters = () => {
    const { setState, state } = useDashboardEmployeeStore();

    const handleChangePage = async (page: number) => { ... };
    const handleSearch = (value: string) => { ... };   // Update state saja, fetch di-trigger oleh useEffect
    const handleSort = async (sort: string) => { ... };
    const handleOrder = async (order_by: "asc" | "desc") => { ... };

    return { handleChangePage, handleSearch, handleSort, handleOrder };
};
```

#### `useCreateEmployee.ts` — Create Logic

```ts
const useCreateEmployee = () => {
    const { handleSubmit, setError } = useFormContext<CreateEmployeeRequestModel>();
    const { state, setState } = useDashboardEmployeeStore();

    const handleCreate = () => {
        return handleSubmit(async (payload) => {
            setState((prev) => ({ ...prev, isCreateLoading: true }));

            // 1. Upload file (jika ada)
            if (state.profileFile) {
                const uploadResult = await validateAndUploadFile(state.profileFile, service.service);
                payload.profile.profile_url = uploadResult.id;
            }

            // 2. Panggil API create
            service.create(payload, {
                onSuccess: () => {
                    fetchEmployeeList(filterEmployeeMapper(state));  // Refresh data
                    snackbar.success("Employee created successfully");
                },
                onError: (err) => {
                    const parsedErrors = parseErrorDetails(err.detail);
                    setError("root.serverError", { ... });
                },
            });
        })();
    };

    return { handleCreate, FetchUserRole };
};
```

#### `useDetailEmployee.ts` — Detail Fetching

```ts
export const useDetailEmployee = (id: string, isOpen: boolean) => {
    const [detail, setDetail] = useState<EmployeeResponseModel | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id && isOpen) {
            // Cek dulu di store (cache), kalau tidak ada baru fetch dari API
            const employee = state.data.find(emp => emp.id === id);
            if (employee) { setDetail(employee); return; }

            new EmployeeService().getById(id, { ... });
        }
    }, [id, isOpen, state.data]);

    return { detail, isLoading };
};
```

---

### 5. Komponen UI

#### Dialog Pattern (Create/Update/Detail)

Setiap operasi CRUD menggunakan dialog (`BaseDialog`) dengan struktur:

```
CardDialog (wrapper)
├── FormProvider (react-hook-form)  ← hanya untuk Create/Update
│   ├── BaseDialog
│   │   ├── DialogHeader
│   │   ├── FormDialog / ContentDialog  ← body form / content
│   │   └── FooterDialog               ← submit & cancel buttons
```

**Create Dialog:**
```tsx
const CreateEmployeeCardDialog = ({ isOpen, onClose }) => {
    const { createEmployeeForm } = useCreateEmployeeForm(); // react-hook-form

    return (
        <FormProvider {...createEmployeeForm}>
            <BaseDialog isOpen={isOpen} onClose={handleClose}>
                <DialogHeader title="Tambah Data Karyawan" onClose={handleClose} />
                <CreateEmployeeFormDialog />
                <CreateEmployeeFooterDialog onClose={handleClose} />
            </BaseDialog>
        </FormProvider>
    );
};
```

#### Tabel Pattern (List)

```tsx
const EmployeeTable = () => {
    // Hooks
    const { tableData, fetchEmployeeList, employeeHeaders, sortOptions } = useEmployeeList();
    const { handleChangePage, handleSearch, handleSort, handleOrder } = useEmployeeFilters();

    // useEffect untuk fetch data dengan debounce
    useEffect(function loadEmployeeData() {
        // Debounce 400ms, dependency: [page, search, sort, order]
    }, [state.pagination.page, state.search.value, state.filters.sort, state.filters.order_by]);

    // Action buttons per-row
    const ListActions = [
        { label: "Detail", icon: <Visibility />, onClick: (item) => openDetailDialog(item) },
        { label: "Edit",   icon: <Edit />,       onClick: (item) => openUpdateDialog(item) },
        { label: "Delete", icon: <Delete />,     onClick: (item) => confirmAndDelete(item) },
    ];

    return (
        <>
            <TableHeader search={...} onSearchChange={...} sortBy={...} ... />
            <BaseTable>
                <TableBody header={employeeHeaders} isLoading={...}>
                    {tableData.map((row) => (
                        <TableRow key={row.id} header={employeeHeaders} actions={renderActions(row)}>
                            <TableCell>...</TableCell>
                            ...
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TablePagination currentPage={...} totalPage={...} onChange={...} />
                </TableFooter>
            </BaseTable>
            {/* Dialogs */}
        </>
    );
};
```

---

### 6. Filter Mapper (`utils/FilterEmployeeMapper.ts`)

Mengubah state store menjadi `FilterParams` yang dikirim ke API.

```ts
export const filterEmployeeMapper = (state: Partial<StoreStateType>): FilterParams => {
    return {
        params: {
            sort: state.filters?.sort,
            order_by: state.filters?.order_by,
            status: state.filters?.status,
            page: state.pagination?.page ?? state.filters?.page,
            limit: state.pagination?.limit ?? state.filters?.limit,
            value: state.search?.value,
        },
    };
};
```

---

## 🔧 Path Aliases

Dikonfigurasi di `vite.config.ts` dan `tsconfig.app.json`:

| Alias | Path |
|---|---|
| `@components/*` | `src/common/components/*` |
| `@hooks/*` | `src/common/hooks/*` |
| `@utils/*` | `src/common/utils/*` |
| `@types/*` | `src/common/types/*` |
| `@api/*` | `src/api/*` |
| `@pages/*` | `src/pages/*` |
| `@common/*` | `src/common/*` |

---

## 🧩 Shared Types Penting (`common/types/index.ts`)

```ts
// Pagination dari API response
type PaginationType = { page, limit, total_data, total_pages };

// Wrapper response API
type APIResponse<T> = { status, statusCode, message, data: T, pagination };

// Data + Pagination (untuk list endpoints)
type DataWithPagination<T> = { data: T; pagination: PaginationType };

// Callback pattern untuk service calls
type FetchCallback<T> = {
    onSuccess: (data: T) => void;
    onError: ({ detail, message }) => void;
    onFullfilled?: () => void;
};

// Params untuk filter/search/sort
type FilterParams = { params: { [key: string]: string | number | ... } };

// Options untuk sort dropdown
type SortOptionType = { label: string; value: string };
```

---

## 🚀 Base API Class (`api/index.ts`)

```ts
export class API {
    protected api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
            withCredentials: true,
        });
        // Interceptor: auto-attach Bearer token dari localStorage
    }

    // Methods tersedia:
    async GET<T>(path, params?) { ... }
    async POST<T>(path, data?) { ... }
    async POSTFORMDATA<T>(path, data: FormData) { ... }
    async PUT<T>(path, data?) { ... }
    async PATCH<T>(path, data?) { ... }
    async DELETE<T>(path) { ... }
    async DOWNLOADBLOB(path, params?, callback?) { ... }
}
```

---

## 📋 Routing (`router.tsx`)

```tsx
const routes = createBrowserRouter([
    { path: "/",      element: <Home /> },
    { path: "/login", element: <Login /> },
    {
        element: <DashboardLayout />,    // Wrapper layout dengan Sidebar, Header
        children: [
            { path: "/dashboard",   element: <DashboardPage /> },
            { path: "/employees",   element: <DashboardEmployee /> },
            { path: "/students",    element: <DashboardStudent /> },
            { path: "/announcements", element: <DashboardAnnouncement /> },
            // ... halaman lainnya
        ],
    },
]);
```

---

## 📐 App Providers (`App.tsx`)

```tsx
function App() {
    return (
        <ThemeInitializer>           {/* MUI Theme + Dark/Light mode */}
            <HelmetProvider>          {/* SEO meta tags */}
                <SnackbarProvider>    {/* Toast notifications */}
                    <RouterProvider router={routes} />
                </SnackbarProvider>
            </HelmetProvider>
        </ThemeInitializer>
    );
}
```

---

## 📌 Konvensi Penamaan

| Elemen | Konvensi | Contoh |
|---|---|---|
| Folder page | `dashboard[NamaModule]` | `dashboardEmployee` |
| Entry component | `Dashboard[Module]` | `DashboardEmployee` |
| Store | `useDashboard[Module]Store` | `useDashboardEmployeeStore` |
| Service class | `[Module]Service` | `EmployeeService` |
| Response model | `[Module]ResponseModel` | `EmployeeResponseModel` |
| Request model | `Create[Module]RequestModel` | `CreateEmployeeRequestModel` |
| Hook (list) | `use[Module]List` | `useEmployeeList` |
| Hook (filters) | `use[Module]Filters` | `useEmployeeFilters` |
| Hook (create) | `useCreate[Module]` | `useCreateEmployee` |
| Hook (detail) | `useDetail[Module]` | `useDetailEmployee` |
| Hook (update) | `useUpdate[Module]` | `useUpdateEmployee` |
| Dialog (create) | `Create[Module]CardDialog` | `CreateEmployeeCardDialog` |
| Dialog (update) | `Update[Module]CardDialog` | `UpdateEmployeeCardDialog` |
| Dialog (detail) | `Detail[Module]CardDialog` | `DetailEmployeeCardDialog` |
| Filter mapper | `filter[Module]Mapper` | `filterEmployeeMapper` |

---

## 🛠️ Checklist Membuat Page Baru

Saat membuat halaman baru (misal: **dashboardProduct**), buat file berikut:

### Step 1: API Layer
- [ ] `src/api/product/model.ts` — Interface request/response
- [ ] `src/api/product/service.ts` — Service class (extends `API`)

### Step 2: Page Module
- [ ] `src/pages/dashboardProduct/index.tsx` — Entry point
- [ ] `src/pages/dashboardProduct/store/index.ts` — Zustand store

### Step 3: List Feature
- [ ] `src/pages/dashboardProduct/List/ProductTable.tsx` — Tabel utama
- [ ] `src/pages/dashboardProduct/List/hook/useProductList.ts` — Fetch + headers
- [ ] `src/pages/dashboardProduct/List/hook/useProductFilters.ts` — Filter handlers
- [ ] `src/pages/dashboardProduct/List/utils/FilterProductMapper.ts` — Mapper

### Step 4: Create Feature
- [ ] `src/pages/dashboardProduct/Create/CreateProductCardDialog.tsx`
- [ ] `src/pages/dashboardProduct/Create/CreateProductFormDialog.tsx`
- [ ] `src/pages/dashboardProduct/Create/CreateProductFooterDialog.tsx`
- [ ] `src/pages/dashboardProduct/Create/hook/useCreateProduct.ts`
- [ ] `src/pages/dashboardProduct/Create/hook/useCreateProductForm.ts`
- [ ] `src/pages/dashboardProduct/Create/utils/createProductForm.ts` — Yup schema

### Step 5: Detail Feature
- [ ] `src/pages/dashboardProduct/Detail/DetailProductCardDialog.tsx`
- [ ] `src/pages/dashboardProduct/Detail/DetailProductContentDialog.tsx`
- [ ] `src/pages/dashboardProduct/Detail/DetailProductSkeleton.tsx`
- [ ] `src/pages/dashboardProduct/Detail/hook/useDetailProduct.ts`

### Step 6: Update Feature
- [ ] `src/pages/dashboardProduct/Update/UpdateProductCardDialog.tsx`
- [ ] `src/pages/dashboardProduct/Update/UpdateProductFormDialog.tsx`
- [ ] `src/pages/dashboardProduct/Update/UpdateProductFooterDialog.tsx`
- [ ] `src/pages/dashboardProduct/Update/hook/useUpdateProduct.ts`
- [ ] `src/pages/dashboardProduct/Update/hook/useUpdateProductForm.ts`

### Step 7: Register Route
- [ ] Import di `src/router.tsx`
- [ ] Tambahkan path di `children` array `DashboardLayout`

---

## 📎 Catatan Tambahan

- **Semua dialog** menggunakan `BaseDialog` dari `@components/Dialog` — jangan buat dialog custom
- **Form validation** menggunakan `Yup` schema yang di-resolve oleh `@hookform/resolvers`
- **File upload** menggunakan utility `validateAndUploadFile` dari `@utils/uploadFile`
- **Error handling** dari API menggunakan `parseErrorDetails` + `formatErrorDetails` dari `@utils/parseErrorDetails`
- **Snackbar** menggunakan `notistack` (`enqueueSnackbar`) atau helper `snackbar.success/error` dari `@utils/snackbar`
- **Debounce** pada search dilakukan di level komponen tabel (bukan di hook), dengan `setTimeout` 400ms
- **Environment variable** `VITE_BACKEND_URL` digunakan sebagai base URL API


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
