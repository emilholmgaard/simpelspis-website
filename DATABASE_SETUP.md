# Database Setup Guide

## Environment Variables

Opret en `.env.local` fil i roden af projektet med følgende variabler:

```env
# Database
DATABASE_URL="postgres://postgres.arbtgsgihznbjbtofohk:Gdtbge4krffY1KXi@aws-1-eu-central-2.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
DIRECT_URL="postgres://postgres.arbtgsgihznbjbtofohk:Gdtbge4krffY1KXi@aws-1-eu-central-2.pooler.supabase.com:5432/postgres?sslmode=require"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://arbtgsgihznbjbtofohk.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyYnRnc2dpaHpuYmpidG9mb2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4OTcxNDMsImV4cCI6MjA4MDQ3MzE0M30.ltoBGk46SJ0QERtYdqq_ZgfpXLvr7te62WendkxM9vI"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyYnRnc2dpaHpuYmpidG9mb2hrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDg5NzE0MywiZXhwIjoyMDgwNDczMTQzfQ.CzKQJZNqNcMiHXMs06JIxFv7MpX2W6NnQQagYl1USo8"
```

## Database Migration

Kør følgende kommando for at oprette database tabellerne:

```bash
npm run migrate
```

Dette vil oprette:
- `users` tabel - til brugerdata
- `reviews` tabel - til anmeldelser og stjerner

## Features

### Authentication
- Brugere kan oprette konto via email/password
- Brugere kan logge ind/ud
- Authentication håndteres via Supabase Auth

### Reviews & Ratings
- Brugere kan give stjerner (1-5) til opskrifter
- Brugere kan skrive anmeldelser
- Hver bruger kan kun give én anmeldelse per opskrift (kan opdateres)
- Anmeldelser vises med brugerens navn/email og dato
- Gennemsnitlig vurdering og antal anmeldelser vises

## API Routes

### Authentication
- `POST /api/auth/signup` - Opret konto
- `POST /api/auth/login` - Log ind
- `POST /api/auth/logout` - Log ud
- `GET /api/auth/user` - Hent aktuelt bruger

### Reviews
- `GET /api/reviews?recipeSlug=...` - Hent alle anmeldelser for en opskrift
- `POST /api/reviews` - Opret/opdater anmeldelse
- `GET /api/reviews/stats?recipeSlug=...` - Hent statistik (gennemsnit, antal)
- `GET /api/reviews/users/[userId]` - Hent brugerdata

## Database Schema

### users
- `id` (UUID, primary key)
- `email` (TEXT, unique)
- `name` (TEXT, nullable)
- `avatar_url` (TEXT, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### reviews
- `id` (UUID, primary key)
- `recipe_slug` (TEXT)
- `user_id` (UUID, foreign key -> users.id)
- `rating` (INTEGER, 1-5)
- `comment` (TEXT, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- Unique constraint: (recipe_slug, user_id)


