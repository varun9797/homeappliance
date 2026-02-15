# PRD: Home Appliances E-Commerce Platform

## 1. Project Overview

### Purpose
An e-commerce platform for browsing and managing home appliance products (kitchen chimneys, hobs, cooktops, etc.) with role-based access control for three user types.

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Jotai (state management) |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB + Mongoose ODM |
| Auth | JWT (access + refresh tokens) |
| Image Upload | Multer + Cloudinary (or local storage) |
| Monorepo | npm workspaces |

---

## 2. User Roles & Permissions

| Capability | User | Admin | Super Admin |
|-----------|------|-------|-------------|
| Browse products | Yes | Yes | Yes |
| View product details | Yes | Yes | Yes |
| Search & filter products | Yes | Yes | Yes |
| Register / Login | Yes | Yes | Yes |
| Add product | No | Yes | Yes |
| Edit product | No | Yes | Yes |
| Delete product | No | Yes | Yes |
| Upload product images | No | Yes | Yes |
| Manage categories | No | Yes | Yes |
| View admin panel | No | Yes | Yes |
| Add new admins | No | No | Yes |
| Approve/reject admin requests | No | No | Yes |
| Promote/demote admins | No | No | Yes |
| View all users | No | No | Yes |

---

## 3. Monorepo Structure

```
appliences/
├── package.json              # Root workspace config
├── tsconfig.base.json        # Shared TS config
├── prd.md
│
├── shared/                   # Shared types & constants
│   ├── package.json
│   └── src/
│       ├── types/
│       │   ├── user.ts       # User, Role types
│       │   ├── product.ts    # Product, Category types
│       │   └── api.ts        # API request/response types
│       └── constants/
│           └── roles.ts      # Role enums
│
├── server/                   # Backend (Node + Express + TS)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts          # Entry point
│       ├── config/
│       │   ├── db.ts         # MongoDB connection
│       │   └── env.ts        # Environment variables
│       ├── models/
│       │   ├── User.ts
│       │   ├── Product.ts
│       │   └── Category.ts
│       ├── routes/
│       │   ├── auth.ts
│       │   ├── products.ts
│       │   ├── categories.ts
│       │   └── admin.ts
│       ├── controllers/
│       │   ├── authController.ts
│       │   ├── productController.ts
│       │   ├── categoryController.ts
│       │   └── adminController.ts
│       ├── middleware/
│       │   ├── auth.ts       # JWT verification
│       │   ├── roleGuard.ts  # Role-based access
│       │   └── upload.ts     # Multer config
│       ├── services/
│       │   ├── authService.ts
│       │   ├── productService.ts
│       │   └── imageService.ts
│       └── utils/
│           ├── jwt.ts        # Token generation/verification
│           └── errors.ts     # Custom error classes
│
└── client/                   # Frontend (React + Jotai + TS)
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── api/
        │   ├── client.ts     # Axios instance with interceptors
        │   ├── auth.ts
        │   ├── products.ts
        │   └── admin.ts
        ├── atoms/
        │   ├── authAtom.ts   # Auth state (user, tokens)
        │   ├── productAtom.ts # Product list, filters
        │   └── uiAtom.ts    # Loading, modals, toasts
        ├── components/
        │   ├── layout/
        │   │   ├── Header.tsx
        │   │   ├── Footer.tsx
        │   │   └── Sidebar.tsx
        │   ├── product/
        │   │   ├── ProductCard.tsx
        │   │   ├── ProductList.tsx
        │   │   ├── ProductDetail.tsx
        │   │   ├── ProductFilters.tsx
        │   │   └── SearchBar.tsx
        │   ├── admin/
        │   │   ├── ProductForm.tsx
        │   │   ├── ProductTable.tsx
        │   │   ├── CategoryManager.tsx
        │   │   ├── AdminList.tsx
        │   │   └── ImageUploader.tsx
        │   ├── auth/
        │   │   ├── LoginForm.tsx
        │   │   ├── RegisterForm.tsx
        │   │   └── ProtectedRoute.tsx
        │   └── common/
        │       ├── Button.tsx
        │       ├── Input.tsx
        │       ├── Modal.tsx
        │       └── Loader.tsx
        ├── pages/
        │   ├── HomePage.tsx
        │   ├── ProductPage.tsx
        │   ├── LoginPage.tsx
        │   ├── RegisterPage.tsx
        │   ├── AdminDashboard.tsx
        │   ├── AdminProducts.tsx
        │   ├── AdminCategories.tsx
        │   └── SuperAdminPanel.tsx
        ├── hooks/
        │   ├── useAuth.ts
        │   ├── useProducts.ts
        │   └── useAdmin.ts
        └── utils/
            ├── routes.ts     # Route path constants
            └── validators.ts
```

---

## 4. Database Schema

### Users Collection
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,               // unique, indexed
  password: string,            // bcrypt hashed
  role: "user" | "admin" | "super_admin",
  isApproved: boolean,         // admins need super_admin approval
  refreshToken: string | null,
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```typescript
{
  _id: ObjectId,
  name: string,
  slug: string,                // unique, URL-friendly
  description: string,
  price: number,
  category: ObjectId,          // ref: Category
  images: string[],            // array of image URLs
  specifications: {
    brand: string,
    model: string,
    warranty: string,
    [key: string]: string      // flexible key-value specs
  },
  isActive: boolean,
  createdBy: ObjectId,         // ref: User (admin who created)
  createdAt: Date,
  updatedAt: Date
}
```
- **Indexes**: `slug` (unique), `category`, `name` (text index for search), `price`

### Categories Collection
```typescript
{
  _id: ObjectId,
  name: string,                // e.g. "Kitchen Chimneys", "Hobs"
  slug: string,                // unique
  description: string,
  image: string,               // category thumbnail
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 5. API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT tokens |
| POST | `/api/auth/refresh` | Public | Refresh access token |
| POST | `/api/auth/logout` | Authenticated | Invalidate refresh token |
| GET | `/api/auth/me` | Authenticated | Get current user profile |

### Products
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/products` | Public | List products (paginated, filterable) |
| GET | `/api/products/:slug` | Public | Get single product by slug |
| GET | `/api/products/search?q=` | Public | Full-text search |
| POST | `/api/products` | Admin+ | Create product |
| PUT | `/api/products/:id` | Admin+ | Update product |
| DELETE | `/api/products/:id` | Admin+ | Delete product |
| POST | `/api/products/:id/images` | Admin+ | Upload product images |
| DELETE | `/api/products/:id/images/:imageId` | Admin+ | Remove product image |

**Query params for GET /api/products:**
- `page`, `limit` — pagination
- `category` — filter by category slug
- `minPrice`, `maxPrice` — price range
- `sort` — `price_asc`, `price_desc`, `newest`, `name`
- `brand` — filter by brand

### Categories
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/categories` | Public | List all categories |
| GET | `/api/categories/:slug` | Public | Get category with products |
| POST | `/api/categories` | Admin+ | Create category |
| PUT | `/api/categories/:id` | Admin+ | Update category |
| DELETE | `/api/categories/:id` | Admin+ | Delete category |

### Admin Management (Super Admin only)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/users` | Super Admin | List all users |
| GET | `/api/admin/pending` | Super Admin | List pending admin requests |
| POST | `/api/admin/promote/:userId` | Super Admin | Promote user to admin |
| POST | `/api/admin/approve/:userId` | Super Admin | Approve pending admin |
| POST | `/api/admin/demote/:userId` | Super Admin | Demote admin to user |
| DELETE | `/api/admin/users/:userId` | Super Admin | Remove user |

---

## 6. Authentication Flow

```
1. User registers → stored with role "user" (or "admin" with isApproved=false)
2. User logs in → server returns { accessToken (15min), refreshToken (7d) }
3. Access token sent in Authorization header: "Bearer <token>"
4. On 401 → client auto-calls /auth/refresh with refresh token
5. On refresh failure → redirect to login
6. Logout → server invalidates refresh token in DB
```

### JWT Payload
```typescript
{
  userId: string,
  email: string,
  role: "user" | "admin" | "super_admin"
}
```

---

## 7. Frontend State Management (Jotai)

### Auth Atoms
```typescript
// atoms/authAtom.ts
const userAtom = atom<User | null>(null)
const accessTokenAtom = atom<string | null>(null)
const isAuthenticatedAtom = atom((get) => get(userAtom) !== null)
const isAdminAtom = atom((get) => {
  const user = get(userAtom)
  return user?.role === "admin" || user?.role === "super_admin"
})
const isSuperAdminAtom = atom((get) => get(userAtom)?.role === "super_admin")
```

### Product Atoms
```typescript
// atoms/productAtom.ts
const productsAtom = atom<Product[]>([])
const productFiltersAtom = atom<ProductFilters>({
  category: null,
  minPrice: null,
  maxPrice: null,
  sort: "newest",
  search: "",
  page: 1,
  limit: 12,
})
const filteredProductsAtom = atom(async (get) => {
  const filters = get(productFiltersAtom)
  return await fetchProducts(filters)
})
const categoriesAtom = atom<Category[]>([])
```

### UI Atoms
```typescript
// atoms/uiAtom.ts
const loadingAtom = atom(false)
const toastAtom = atom<Toast | null>(null)
const sidebarOpenAtom = atom(false)
```

---

## 8. Implementation Phases

### Phase 1: Project Setup & Auth
- Initialize monorepo with npm workspaces
- Set up shared types package
- Server: Express + MongoDB connection + User model
- Server: Auth endpoints (register, login, refresh, logout)
- Server: JWT middleware + role guard middleware
- Client: Vite + React + Jotai setup
- Client: Login & Register pages
- Client: Auth atoms + protected routes
- **Seed super admin user via script**

### Phase 2: Product Catalog (User-facing)
- Server: Product & Category models
- Server: Public product endpoints (list, detail, search)
- Server: Category endpoints (list)
- Client: Home page with category grid
- Client: Product listing with pagination
- Client: Product detail page
- Client: Search bar + filters (category, price, sort)
- Client: Product & filter atoms

### Phase 3: Admin Panel
- Server: Product CRUD endpoints (create, update, delete)
- Server: Category CRUD endpoints
- Server: Image upload with Multer + Cloudinary
- Client: Admin dashboard layout (sidebar nav)
- Client: Product management table (list, add, edit, delete)
- Client: Product form with image uploader
- Client: Category management page

### Phase 4: Super Admin Features
- Server: Admin management endpoints
- Client: Super admin panel (user list, approve/reject admins)
- Client: Promote/demote actions

### Phase 5: Polish & Testing
- Error handling & validation across all endpoints
- Loading states & toast notifications
- Responsive design
- API error interceptors with token refresh
- E2E happy path testing

---

## 9. Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/appliences
JWT_ACCESS_SECRET=<secret>
JWT_REFRESH_SECRET=<secret>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
CORS_ORIGIN=http://localhost:5173
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 10. Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| State management | Jotai | Atomic, minimal boilerplate, great TS support |
| Bundler | Vite | Fast dev server, native TS support |
| ODM | Mongoose | Mature, schema validation, great MongoDB integration |
| Image storage | Cloudinary | Free tier, CDN, image transformations |
| Monorepo tool | npm workspaces | Simple, no extra tooling needed |
| API style | REST | Simpler for CRUD-heavy app, well understood |
| Password hashing | bcrypt | Industry standard, built-in salt |
| Validation | zod (shared) | Runtime + static type validation in one |
