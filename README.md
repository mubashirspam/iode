# Vidyavasal — University Admissions & Distance Education

Kerala's leading Ed-Tech platform for university admissions, distance education, and online courses. Built with **Next.js 16**, **NeonDB** (Serverless PostgreSQL), and **Drizzle ORM**.

---

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- NeonDB account with access to the `iode` organization

---

## Quick Start

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd iode

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your NeonDB connection strings

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Environment Setup

Copy `.env.example` to `.env.local` and fill in the values:

```env
# Staging database (default for local dev)
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"

# Production database
DATABASE_URL_PRODUCTION="postgresql://user:password@host/neondb?sslmode=require"
```

> ⚠️ `.env.local` is gitignored. Never commit database credentials.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (localhost:3000) |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate SQL migration from schema changes |
| `npm run db:migrate` | Apply migrations to **staging** |
| `npm run db:migrate:prod` | Apply migrations to **production** |
| `npm run db:push` | Push schema directly (dev only, skips migration files) |
| `npm run db:studio` | Open Drizzle Studio to browse the database |

---

## Git Branching & Deployment

### Branches

| Branch | Purpose | Database |
|--------|---------|----------|
| `staging` | Development & testing | `iode-staging` (NeonDB) |
| `main` | Production | `iode-production` (NeonDB) |

### Workflow

```
feature-branch → staging → main
```

1. **Create a feature branch** from `staging`:
   ```bash
   git checkout staging
   git pull origin staging
   git checkout -b feature/your-feature
   ```

2. **Develop & commit**:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

3. **Push & create PR to staging**:
   ```bash
   git push origin feature/your-feature
   # Create PR: feature/your-feature → staging
   ```

4. **Merge to staging** → auto-deploys to staging environment.

5. **Promote to production** — create PR from `staging` → `main`:
   ```bash
   # On GitHub: Create PR staging → main
   # Review, approve, merge
   ```

6. **Merge to main** → auto-deploys to production.

---

## Database Workflow

### Making Schema Changes

```bash
# 1. Edit the schema
#    → src/lib/db/schema.ts

# 2. Generate migration file
npm run db:generate

# 3. Apply to staging
npm run db:migrate

# 4. Test on staging, then apply to production
npm run db:migrate:prod

# 5. Commit the migration files
git add drizzle/
git commit -m "db: your migration description"
```

### Browse Database

```bash
npm run db:studio
```

> 📖 Full database docs: [docs/database-setup.md](docs/database-setup.md)

---

## Project Structure

```
iode/
├── drizzle/                  # Auto-generated migration SQL files
├── docs/
│   └── database-setup.md     # Database documentation
├── public/                   # Static assets (logo, favicon, etc.)
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── layout.tsx        # Root layout with metadata
│   │   ├── page.tsx          # Home page
│   │   ├── about/
│   │   ├── admin/            # Admin dashboard
│   │   ├── contact/
│   │   ├── courses/
│   │   ├── eduthalim/
│   │   ├── montessori/
│   │   ├── privacy-policy/
│   │   ├── universities/
│   │   ├── api/              # API routes
│   │   └── favicon.ico       # Site favicon
│   ├── components/           # Shared React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── NewsletterForm.tsx
│   │   └── admin/
│   └── lib/
│       ├── db/
│       │   ├── index.ts      # Database connection
│       │   └── schema.ts     # Drizzle ORM schema & types
│       └── utils/
├── drizzle.config.ts         # Drizzle Kit config
├── next.config.ts            # Next.js config
├── tailwind.config.ts        # Tailwind CSS config
├── .env.example              # Env template (safe to commit)
├── .env.local                # Your env secrets (gitignored)
├── CLAUDE.md                 # Claude Code instructions
└── package.json
```

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Database**: [NeonDB](https://neon.tech) (Serverless PostgreSQL)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Language**: TypeScript

---

## NeonDB Projects

| Environment | Project | Region | Console |
|-------------|---------|--------|---------|
| Staging | `iode-staging` | ap-southeast-2 | [Open →](https://console.neon.tech/app/projects/red-brook-90660420) |
| Production | `iode-production` | us-east-1 | [Open →](https://console.neon.tech/app/projects/quiet-lab-32189697) |

---

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repo to [Vercel](https://vercel.com).
2. Set environment variables:
   - **Preview/Staging**: `DATABASE_URL` → staging connection string
   - **Production**: `DATABASE_URL` → production connection string
3. Configure branch deployments:
   - `staging` branch → Preview deployments
   - `main` branch → Production deployment

### Manual Build

```bash
npm run build
npm run start
```





 ## Contact

  - 📞 **Phone:** [+91 70347 60995](tel:+917034760995)
  - 💬 **WhatsApp:** [+91 70347 60995](https://wa.me/917034760995)
  - ✉️  **Email:** [info@vidyavasal.com](mailto:info@vidyavasal.com)
  - 📍 **Location:** Kerala, India
  - 🌐 **Website:** [vidyavasal.com](https://vidyavasal.com/)

  **Social:** [Instagram](https://www.instagram.com/vidya.vasal) · [Facebook](https://www.facebook.com/vidyavasal)