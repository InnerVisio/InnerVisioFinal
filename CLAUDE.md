# InnerVisio web: rules for working in this repo

Site for a Czech architectural visualization studio (classic 3D + AI visualizations). Brand: "Violet Keynote"
(dark, plum, liquid glass, calm motion). Czech first, English second. See README.md for structure and commands.

## Design rules (the owner insists on these)

1. **No boxed labels. Ever.** No "eyebrow boxes": no small pills, chips, badges or tags used as decoration
   or categorisation. That means no "NEW"/"NOVÉ" badges, no "Popular"/"Doporučujeme"/"Nejoblíbenější" badges,
   no tag chips ("Fast delivery", "3 styles"), no category chips on photos, no "Before" thumbnails or captions
   in little boxes, no "AI"/"Brand" markers on list items. They read as generic AI-template slop.
   - Emphasis comes from layout, type and colour: a tinted/bordered featured card, bigger type, a plain sentence.
   - A plain text label with no box is acceptable but rare. Do not open every section with a tiny uppercase
     tracked line; a strong headline is enough. Use one only where it carries real information.
   - Allowed boxes are *controls*: buttons, the tab/segmented switchers, the language switch, the nav pill bar,
     filters. If it can't be clicked or toggled, it must not be a pill.
   - There are intentionally no `badge`/`pill`/`tag` recipes in `components/ui/brand.ts`. Don't add them.
   - `npm run check:design` greps for the usual offenders; run it before finishing UI work.
2. One gradient word per headline (`.text-gradient`), Poppins headings, Inter text, plum palette only
   (no red/green/blue/neon accents). Calm blur-in motion, no bounce/shake.
3. Don't invent facts: no fake follower/like counts, no made-up accounts, prices only from
   `components/pricing/aiPricingContent.ts` and `constants.tsx`.
4. Classic 3D visualizations are never mocked or shown as the lesser option; AI is a tool in a professional's hands.
   AI output is labelled as illustrative (EU AI Act).
5. Contact e-mail is `zakazky@innervisio.cz` (the form still delivers to the Gmail inbox until a domain is
   verified in Resend, see `netlify/lib/http.ts`).

## Technical rules

- The page is prerendered at build time (`entry-server.tsx`, `scripts/prerender.mjs`): never touch `window`,
  `document` or `localStorage` while rendering; use effects/handlers.
- SEO/GEO output (JSON-LD, `llms.txt`, sitemap) is generated from the same data as the page. Change prices,
  services and FAQ in one place (components / `constants.tsx`), not in the generated files.
- Keep consent behaviour intact (`analytics.ts`): Google Consent Mode denied by default, Meta Pixel only after
  marketing consent.
- Images/videos live in `public/`; keep images ≤ ~1920 px wide webp, videos web-optimised H.264 MP4.
