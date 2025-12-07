# Vercel Domain Setup Guide

## Nuværende Konfiguration

Du har begge domæner konfigureret i Vercel:
- `simpelspis.dk` → Redirecter til `www.simpelspis.dk` (307 redirect)
- `www.simpelspis.dk` → Production domain

## Er redirecten et problem?

**Nej, en enkelt redirect fra non-www til www er faktisk en god praksis!**

### Fordele ved at have én kanonisk version (www):
1. ✅ Konsistent branding
2. ✅ Bedre SEO (Google anbefaler at vælge én version)
3. ✅ Undgår duplicate content issues
4. ✅ Cookies virker bedre med www

### Hvad er forskellen mellem 307 og 301?

- **307 Temporary Redirect** - Fortæller søgemaskiner at redirecten er midlertidig
- **301 Permanent Redirect** - Fortæller søgemaskiner at redirecten er permanent (anbefalet!)

**Anbefaling:** Brug **301 Permanent Redirect** fordi:
- ✅ Google behandler det som en permanent ændring
- ✅ SEO-værdi (link juice) overføres bedre til www-versionen
- ✅ Søgemaskiner cacher redirecten, hvilket gør den hurtigere
- ✅ Det er standard praksis for domain redirects

## Anbefalinger

### 1. I Vercel Dashboard
Sørg for at:
- `www.simpelspis.dk` er sat som **Production** domain
- `simpelspis.dk` redirecter til `www.simpelspis.dk` med **301 Permanent Redirect** (anbefalet!)

**Sådan ændrer du til 301 i Vercel:**
1. Gå til dit projekt i Vercel Dashboard
2. Gå til **Settings** → **Domains**
3. Find `simpelspis.dk` (uden www)
4. Klik på de tre prikker (...) → **Edit**
5. Vælg **Redirect** → **301 Permanent Redirect**
6. Indtast destination: `https://www.simpelspis.dk`
7. Gem ændringerne

### 2. Environment Variables
Sørg for at `NEXT_PUBLIC_BASE_URL` er sat til:
```
https://www.simpelspis.dk
```

I Vercel:
1. Gå til dit projekt
2. Settings → Environment Variables
3. Tilføj/opdater: `NEXT_PUBLIC_BASE_URL = https://www.simpelspis.dk`

### 3. DNS Konfiguration
Begge domæner skal pege på Vercel:
- `simpelspis.dk` → Vercel DNS records
- `www.simpelspis.dk` → Vercel DNS records

## Hvad er blevet rettet i koden?

Alle default base URLs er nu opdateret til `www.simpelspis.dk`:
- ✅ `src/app/layout.tsx`
- ✅ `src/app/page.tsx`
- ✅ `src/app/opskrifter/page.tsx`
- ✅ `src/app/opskrifter/[slug]/page.tsx`
- ✅ `src/app/sitemap.ts`
- ✅ `src/app/robots.ts` (var allerede korrekt)
- ✅ `src/app/api/auth/forgot-password/route.ts`

## Validering

Efter deployment, test:
1. `https://simpelspis.dk` → Skal redirecte til `https://www.simpelspis.dk`
2. `https://www.simpelspis.dk` → Skal vise hjemmesiden direkte
3. Check canonical URLs i HTML → Skal alle være `www.simpelspis.dk`
4. Check structured data (JSON-LD) → Skal alle bruge `www.simpelspis.dk`

## Hvis du vil ændre til non-www i stedet

Hvis du foretrækker `simpelspis.dk` (uden www):
1. Opdater alle base URLs i koden til `https://simpelspis.dk`
2. I Vercel: Sæt `simpelspis.dk` som Production
3. I Vercel: Redirect `www.simpelspis.dk` til `simpelspis.dk`

**Anbefaling:** Behold www-versionen, da den er mere standard og virker bedre med cookies.

