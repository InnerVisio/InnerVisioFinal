# InnerVisio – innervisio.cz

Web studia architektonických vizualizací InnerVisio (klasické 3D a AI vizualizace).
React 19 + Vite + TypeScript + Tailwind CSS, hosting na Netlify.

## Vývoj

```bash
npm install
npm run dev        # http://localhost:3000 (Vite + lokální /api/* funkce)
npm run typecheck
npm run build      # produkční build do dist/
npm run preview    # náhled produkčního buildu
```

Pro odesílání formulářů lokálně vytvořte `.env.local` s `RESEND_API_KEY=…` (viz `.env.example`).
Na Netlify se klíč nastavuje v Site settings → Environment variables.

## Struktura

| Cesta | Obsah |
|---|---|
| `components/` | Sekce stránky (Hero, Služby, Portfolio, Ceník, FAQ, Kontakt…) |
| `components/pricing/` | Ceník: AI vizualizace a klasické 3D, texty v `aiPricingContent.ts` |
| `components/ui/brand.ts` | Animace a třídy podle brand manuálu „Violet Keynote“ |
| `index.css`, `tailwind.config.js` | Barvy, písma a skleněné komponenty brandu |
| `constants.tsx` | Služby, portfolio, ceny klasických vizualizací, obrázky Před/Po |
| `site.ts` | Firemní údaje pro SEO (strukturovaná data, llms.txt) |
| `analytics.ts` | Cookies souhlas (Consent Mode v2), měření poptávek |
| `public/` | Obrázky, favicon, robots.txt, 404.html |
| `netlify/functions/` | `/api/send-email`, `/api/subscribe`, `/api/unsubscribe` |
| `entry-server.tsx`, `scripts/prerender.mjs` | Předvykreslení HTML, JSON-LD, `llms.txt` a `sitemap.xml` při buildu |

## SEO a AI vyhledávání

`npm run build` vyrenderuje celou stránku do statického `dist/index.html`, takže obsah vidí i vyhledávače
a AI crawlery, které nespouštějí JavaScript. Ze stejných dat jako web vznikne:

- JSON-LD (firma, ceník jako nabídky, portfolio, FAQ),
- `dist/llms.txt` – souhrn služeb, cen a kontaktů pro AI asistenty,
- `dist/sitemap.xml` s obrázky portfolia.

Ceny, služby a FAQ se proto mění jen na jednom místě (komponenty / `constants.tsx`).
