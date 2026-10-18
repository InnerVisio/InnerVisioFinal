// Runs after `vite build` + `vite build --ssr entry-server.tsx --outDir dist-ssr`.
// 1. Puts the server-rendered page into dist/index.html, so search engines and AI crawlers
//    that don't execute JavaScript still get the full content.
// 2. Injects JSON-LD structured data.
// 3. Writes dist/llms.txt and dist/sitemap.xml from the same data.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const dist = path.join(root, 'dist');
const indexPath = path.join(dist, 'index.html');

const { render, structuredData, llmsTxt, sitemapXml } = await import(
  pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href
);

let html = fs.readFileSync(indexPath, 'utf8');

const appHtml = render();
const ROOT_TAG = '<div id="root"></div>';
if (!html.includes(ROOT_TAG)) throw new Error('prerender: <div id="root"></div> not found in dist/index.html');
html = html.replace(ROOT_TAG, `<div id="root">${appHtml}</div>`);

// `<` is escaped so text inside the JSON can never close the script tag
const jsonLd = structuredData()
  .map((data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`)
  .join('\n    ');
html = html.replace('</head>', `    ${jsonLd}\n  </head>`);

fs.writeFileSync(indexPath, html);
fs.writeFileSync(path.join(dist, 'llms.txt'), llmsTxt());
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemapXml(new Date().toISOString().slice(0, 10)));

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
console.log(`[prerender] index.html: ${kb(Buffer.byteLength(html))} (app ${kb(Buffer.byteLength(appHtml))}), ${structuredData().length} JSON-LD blocks, llms.txt + sitemap.xml written`);
