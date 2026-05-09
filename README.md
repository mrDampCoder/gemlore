# GemLore — A Gemstone Discovery and Learning Platform

GemLore is a full-stack educational web application about natural gemstones. It serves as both a rich encyclopedia of the mineral world and a community platform where enthusiasts can explore gemstone science and folklore, read in-depth articles, save favorites, and participate in discussions. The visual identity is dark, jewel-toned, and elegant — designed to feel like a museum guide rather than a marketplace.

---

## Features

### Public (No Account Required)
- Browse a catalog of 10 gemstones with detailed geology, lore, and SVG illustrations
- Filter gemstones by name (search), category (Precious/Semi-precious/Organic), and color
- Read 5 original long-form articles on gem geology, the Mohs scale, birthstones, care, and mythology
- About page with the GemLore mission
- Contact form with client-side and server-side validation

### User (Registered Accounts)
- Create an account and log in with JWT-based authentication (HTTP-only cookie)
- Save and unsave favorite gemstones
- Post and delete comments on gemstones and articles
- Manage profile: edit display name, change password (requires current password re-entry), delete account
- "Remember me" option extends session to 30 days; default session is 1 hour
- Password reset flow with token-based email simulation

### Admin (Admin Role)
- Admin dashboard with stats (total users, active users, gemstones, articles, comments)
- Recent activity feed (last 5 signups, last 5 comments)
- Gemstone CRUD: create, read, update, delete
- Article CRUD: create, read, update, delete
- User management: toggle active/inactive status, change role (USER ↔ ADMIN). Cannot modify own account.
- Comment moderation: view all comments, filter by gemstone or article, delete any comment

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Database | PostgreSQL via Prisma ORM v5 |
| Authentication | JWT (`jose`) in HTTP-only cookies |
| Password Hashing | `bcryptjs` (cost factor 12) |
| Validation | `zod` v4 (shared client + server) |
| Icons | `lucide-react` |
| Runtime | Node.js 20+ |

---

## Setup Instructions

### Prerequisites
- Node.js 20 or higher
- npm 10+

### Step 1: Clone the repository

```bash
git clone <repository-url>
cd gemlore
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Create a free PostgreSQL database

Go to [https://neon.tech](https://neon.tech) and create a free account. Create a new project and copy the connection string (it looks like `postgresql://...`).

### Step 4: Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```env
DATABASE_URL="your-neon-connection-string-here"
JWT_SECRET="your-random-secret-here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate a secure `JWT_SECRET` with:

```bash
openssl rand -hex 32
```

### Step 5: Push the database schema

```bash
npx prisma db push
```

### Step 6: Seed the database with sample data

```bash
npm run seed
```

### Step 7: Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@gemlore.com` | `Admin@123` |
| **User** | `user@gemlore.com` | `User@123` |
| **User** | `demo@gemlore.com` | `Demo@123` |

---

## Deployment

GemLore is ready for Vercel deployment:

1. Push the repository to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add the three environment variables (`DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_APP_URL`) in the Vercel dashboard
4. The `npm run build` command will run automatically on deploy

The Neon database connection string includes SSL by default and is compatible with Vercel's serverless environment.

---

## Project Structure

```
gemlore/
├── app/
│   ├── (public)/               # Public pages (Home is app/page.tsx)
│   │   ├── gemstones/          # Catalog and detail pages
│   │   ├── articles/           # Article list and detail pages
│   │   ├── about/              # About page
│   │   └── contact/            # Contact form
│   ├── (auth)/                 # Auth pages (no layout override)
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── (user)/                 # Protected user pages
│   │   ├── profile/
│   │   └── favorites/
│   ├── admin/                  # Admin-only pages (with sidebar layout)
│   │   ├── gemstones/
│   │   ├── articles/
│   │   ├── users/
│   │   └── comments/
│   ├── api/                    # API routes
│   │   ├── auth/               # signup, login, logout, me, forgot/reset password
│   │   ├── gemstones/          # CRUD + favorite toggle
│   │   ├── articles/           # CRUD
│   │   ├── comments/           # Post + delete
│   │   ├── user/               # profile update, account delete
│   │   └── admin/              # users list/update, stats, comments
│   ├── 403/                    # Access denied page
│   ├── not-found.tsx           # Custom 404 page
│   ├── globals.css
│   └── layout.tsx              # Root layout with Navbar + Footer
├── components/
│   ├── Navbar.tsx              # Sticky, scroll-aware, role-aware navbar
│   ├── Footer.tsx              # Full footer with links and contact
│   ├── GemstoneVisual.tsx      # SVG gem illustrations (10 variants)
│   ├── GemstoneCard.tsx        # Card for catalog grid
│   ├── ArticleCard.tsx         # Card for articles list
│   ├── CommentSection.tsx      # Interactive comments with post/delete
│   ├── FavoriteButton.tsx      # Toggle favorite with optimistic UI
│   ├── ConfirmDialog.tsx       # Reusable confirmation modal
│   └── ui/                     # Button, Input, Textarea primitives
├── lib/
│   ├── auth.ts                 # JWT sign/verify, cookie helpers, guards
│   ├── prisma.ts               # Singleton Prisma client
│   ├── validation.ts           # Shared Zod schemas
│   └── utils.ts                # cn(), formatDate(), stripPasswordHash()
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed script
├── middleware.ts               # Route protection
├── tailwind.config.ts          # Custom design tokens
├── .env.example
└── README.md
```
