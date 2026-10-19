// Runs after `vite build` + `vite build --ssr entry-server.tsx --outDir dist-ssr`.
// 1. Puts the server-rendered page into dist/index.html (and /socials into dist/socials/index.html), so search
//    engines and AI crawlers that don't execute JavaScript still get the full content.
// 2. Injects JSON-LD structured data and per-page head metadata.
// 3. Writes dist/llms.txt and dist/sitemap.xml from the same data.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const dist = path.join(root, 'dist');
const indexPath = path.join(dist, 'index.html');

const { render, structuredData, socialsStructuredData, socialsMeta, llmsTxt, sitemapXml } = await import(
  pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href
);

const template = fs.readFileSync(indexPath, 'utf8');
const ROOT_TAG = '<div id="root"></div>';
if (!template.includes(ROOT_TAG)) throw new Error('prerender: <div id="root"></div> not found in dist/index.html');

const jsonLdScripts = (blocks) =>
  blocks
    // `<` is escaped so text inside the JSON can never close the script tag
    .map((data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`)
    .join('\n    ');

const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

// Replaces head tags of the home template for a sub-page
const withHeadMeta = (html, { url, title, description }) => {
  const t = escapeAttr(title);
  const d = escapeAttr(description);
  const swap = (re, replacement) => {
    if (!re.test(html)) throw new Error(`prerender: head tag not found: ${re}`);
    html = html.replace(re, replacement);
  };
  swap(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  swap(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${d}"`);
  swap(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`);
  swap(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${url}"`);
  swap(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${t}"`);
  swap(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${d}"`);
  swap(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${t}"`);
  swap(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${d}"`);
  return html;
};

const buildPage = ({ path: pagePath, meta, blocks }) => {
  let html = template;
  if (meta) html = withHeadMeta(html, meta);
  html = html.replace(ROOT_TAG, `<div id="root">${render(pagePath)}</div>`);
  html = html.replace('</head>', `    ${jsonLdScripts(blocks)}\n  </head>`);
  return html;
};

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

// Home
const homeBlocks = structuredData();
const home = buildPage({ path: '/', blocks: homeBlocks });
fs.writeFileSync(indexPath, home);

// /socials -> dist/socials/index.html (Netlify serves it at /socials)
const socialsBlocks = socialsStructuredData();
const socials = buildPage({
  path: socialsMeta.path,
  meta: {
    url: `https://innervisio.cz${socialsMeta.path}`,
    title: socialsMeta.title,
    description: socialsMeta.description,
  },
  blocks: socialsBlocks,
});
fs.mkdirSync(path.join(dist, 'socials'), { recursive: true });
fs.writeFileSync(path.join(dist, 'socials', 'index.html'), socials);

fs.writeFileSync(path.join(dist, 'llms.txt'), llmsTxt());
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemapXml(new Date().toISOString().slice(0, 10)));

console.log(
  `[prerender] / ${kb(Buffer.byteLength(home))} (${homeBlocks.length} JSON-LD), ` +
    `/socials ${kb(Buffer.byteLength(socials))} (${socialsBlocks.length} JSON-LD), llms.txt + sitemap.xml written`
);
