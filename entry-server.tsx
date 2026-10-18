// Build-time only (vite build --ssr): renders the page to static HTML and derives the SEO/GEO
// files from the same data the page shows, so prices, services and FAQ never drift apart.
// Used by scripts/prerender.mjs; never shipped to the browser.
import React from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import App from './App';
import { LanguageProvider } from './components/LanguageContext';
import { getFaqData } from './components/FaqSection';
import { AI_PRICING_CONTENT } from './components/pricing/aiPricingContent';
import { PRICING, PROJECTS, SERVICES } from './constants';
import { SITE } from './site';

const abs = (path: string) => `${SITE.url}${encodeURI(path)}`;
const priceNumber = (text: string) => Number(text.replace(/[^\d]/g, '')) || null;
// 2900 -> '2 900' (Czech thousands separator, as shown on the page)
const czk = (n: number | null) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const ENTITIES: Record<string, string> = { '&amp;': '&', '&quot;': '"', '&#x27;': "'", '&#39;': "'", '&lt;': '<', '&gt;': '>', '&nbsp;': ' ' };
const toPlainText = (node: React.ReactNode) =>
  renderToStaticMarkup(<>{node}</>)
    .replace(/<\/li>/g, '; ')
    .replace(/<\/(p|ol|ul)>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&[#\w]+;/g, (e) => ENTITIES[e] ?? e)
    .replace(/\s+/g, ' ')
    .replace(/;\s*$/, '')
    .trim();

export const render = () =>
  renderToString(
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );

// ---------- Shared content model (Czech, the default language) ----------

const ai = AI_PRICING_CONTENT.cs;

const aiOffers = ai.plans.map((plan) => ({
  name: plan.title,
  description: plan.description,
  features: plan.features,
  minPrice: priceNumber(plan.price),
  unit: plan.unit.replace(/^\/\s*/, ''),
}));

const classicOffers = PRICING.map((item) => ({
  name: item.title,
  features: item.features,
  minPrice: priceNumber(item.price),
  unit: item.unit.replace(/^Kč\s*\/?\s*/, ''), // 'Kč / celá nemovitost' -> 'celá nemovitost'
}));

const faq = getFaqData('cs').map((item) => ({ question: item.question, answer: toPlainText(item.answer) }));

// ---------- JSON-LD ----------

export const structuredData = () => {
  const businessId = `${SITE.url}/#business`;

  const offer = (o: { name: string; description?: string; features: readonly string[]; minPrice: number | null; unit?: string }) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: o.name,
      ...(o.description ? { description: o.description } : {}),
      provider: { '@id': businessId },
    },
    description: o.features.join(', '),
    ...(o.minPrice
      ? {
          priceSpecification: {
            '@type': 'PriceSpecification',
            minPrice: o.minPrice,
            priceCurrency: 'CZK',
            description: `od ${czk(o.minPrice)} Kč${o.unit ? ` / ${o.unit}` : ''}`,
          },
        }
      : {}),
  });

  const business = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': businessId,
    name: SITE.name,
    alternateName: 'InnerVisio Architecture',
    description: SITE.description,
    url: `${SITE.url}/`,
    logo: abs(SITE.logo),
    image: abs(SITE.socialImage),
    email: SITE.email,
    telephone: SITE.phone,
    founder: { '@type': 'Person', name: SITE.founder },
    identifier: { '@type': 'PropertyValue', propertyID: 'IČO', value: SITE.companyId },
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    areaServed: SITE.areaServed.map((name, i) => ({ '@type': i === 0 ? 'Country' : 'City', name })),
    sameAs: [SITE.instagram],
    knowsAbout: SITE.knowsAbout,
    priceRange: `od ${czk(Math.min(...aiOffers.map((o) => o.minPrice ?? Infinity)))} Kč`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: SITE.email,
      telephone: SITE.phone,
      availableLanguage: ['cs', 'en'],
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Ceník služeb',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'AI vizualizace (dodání do 24 hodin)',
          itemListElement: [
            ...aiOffers.map(offer),
            {
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: ai.package.title, description: ai.package.text, provider: { '@id': businessId } },
              price: priceNumber(ai.package.price),
              priceCurrency: 'CZK',
            },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Klasické 3D vizualizace',
          itemListElement: classicOffers.map(offer),
        },
      ],
    },
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: `${SITE.url}/`,
    name: SITE.name,
    inLanguage: 'cs-CZ',
    publisher: { '@id': businessId },
  };

  const webpage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE.url}/#webpage`,
    url: `${SITE.url}/`,
    name: SITE.title,
    description: SITE.description,
    inLanguage: 'cs-CZ',
    isPartOf: { '@id': `${SITE.url}/#website` },
    about: { '@id': businessId },
    primaryImageOfPage: abs(SITE.socialImage),
  };

  const portfolio = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Portfolio – ukázky realizací',
    itemListElement: PROJECTS.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'CreativeWork',
        name: p.title,
        description: p.description,
        genre: `Vizualizace – ${p.category}`,
        image: (p.galleryUrls ?? [p.imageUrl]).map(abs),
        locationCreated: { '@type': 'Place', name: p.location },
        creator: { '@id': businessId },
      },
    })),
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return [business, website, webpage, portfolio, faqPage];
};

// ---------- llms.txt (https://llmstxt.org): a plain summary for AI assistants ----------

export const llmsTxt = () => {
  const lines: string[] = [];
  const list = (items: readonly string[]) => items.map((i) => `  - ${i}`).join('\n');

  lines.push(`# ${SITE.name}`, '');
  lines.push(`> ${SITE.description}`, '');
  lines.push(
    `InnerVisio nabízí dvě rovnocenné cesty: klasické 3D vizualizace modelované na míru podle projektové dokumentace (přesnost, developerské projekty, prodej z plánu) a AI vizualizace z fotky, skici nebo půdorysu (rychlost, realitní inzerce, rekonstrukce). AI je nástroj v rukou profesionála: každý AI snímek se ručně kontroluje a dodává označený jako ilustrační v souladu s EU AI Act.`,
    ''
  );

  lines.push('## AI vizualizace (dodání do 24 hodin)', '');
  for (const o of aiOffers) {
    lines.push(`- **${o.name}** – od ${czk(o.minPrice)} Kč / ${o.unit}. ${o.description}`, list(o.features));
  }
  lines.push(`- **${ai.package.title}** – ${ai.package.price} (běžně ${ai.package.oldPrice}). ${ai.package.text}`, '');

  lines.push('## Klasické 3D vizualizace', '');
  for (const o of classicOffers) {
    const price = o.minPrice ? `od ${czk(o.minPrice)} Kč${o.unit ? ` (${o.unit})` : ''}` : 'cena individuálně';
    lines.push(`- **${o.name}** – ${price}`, list(o.features));
  }
  lines.push('', 'Ceny jsou orientační a závisí na složitosti projektu a dodaných podkladech. Nacenění je zdarma a nezávazné, odpověď do 24 hodin.', '');

  lines.push('## AI vs. klasické 3D', '');
  for (const row of ai.comparison.rows) {
    lines.push(`- **${row.label}:** AI – ${row.ai}; klasické 3D – ${row.classic}`);
  }
  lines.push('');

  lines.push('## Služby', '');
  for (const s of SERVICES) {
    lines.push(`- **${s.title}** – ${s.description}`);
  }
  lines.push('');

  lines.push('## Ukázky realizací', '');
  for (const p of PROJECTS) {
    lines.push(`- **${p.title}** (${p.location}, ${p.category}) – ${p.description}`);
  }
  lines.push('');

  lines.push('## Časté dotazy', '');
  for (const f of faq) {
    lines.push(`### ${f.question}`, '', f.answer, '');
  }

  lines.push('## Kontakt', '');
  lines.push(
    `- Web: ${SITE.url}/`,
    `- E-mail: ${SITE.email}`,
    `- Telefon: ${SITE.phoneDisplay}`,
    `- Adresa: ${SITE.address.street}, ${SITE.address.city}, Česká republika`,
    `- Kontaktní osoba: ${SITE.founder} (IČO ${SITE.companyId})`,
    `- Instagram: ${SITE.instagram}`,
    `- Působnost: celá Česká republika (mj. ${SITE.areaServed.slice(1).join(', ')})`,
    `- Poptávka: formulář na ${SITE.url}/#contact, ceník AI vizualizací na ${SITE.url}/#pricing-ai`,
    ''
  );

  return lines.join('\n');
};

// ---------- sitemap.xml with image entries ----------

export const sitemapXml = (lastmod: string) => {
  const images = [
    ...new Set([
      ...PROJECTS.flatMap((p) => p.galleryUrls ?? [p.imageUrl]),
      ...SERVICES.flatMap((s) => s.galleryUrls ?? (s.imageUrl ? [s.imageUrl] : [])).filter((u) => u.startsWith('/')),
    ]),
  ];
  const imageTags = images.map((u) => `    <image:image><image:loc>${abs(u)}</image:loc></image:image>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE.url}/</loc>
    <lastmod>${lastmod}</lastmod>
${imageTags}
  </url>
</urlset>
`;
};
