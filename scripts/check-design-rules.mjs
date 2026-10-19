// Heuristic guard for the "no boxed labels" rule in CLAUDE.md. Prints suspicious lines and exits 1 if any
// are found. Run with `npm run check:design`. It is deliberately NOT part of `npm run build`: it is a
// heuristic, and a false positive must never block a deploy.
//
// Allowed on purpose: buttons, tab/segmented switchers, the language switch and filters (they are controls).
// Mark an intentional exception with `design-rule-ok` in a comment on the same or the previous line.
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const targets = ['components', 'App.tsx'];
const files = [];
const walk = (p) => {
  const full = path.join(root, p);
  if (!fs.existsSync(full)) return;
  if (fs.statSync(full).isDirectory()) fs.readdirSync(full).forEach((f) => walk(path.join(p, f)));
  else if (/\.(tsx|ts)$/.test(p)) files.push(p);
};
targets.forEach(walk);

const rules = [
  { name: 'badge/pill/tag recipe or component', re: /\b(NewBadge|FeaturedBadge|BRAND\.(badge|pill|tag)|featuredBadge|newBadge)\b/ },
  // A rounded-full box carrying tiny uppercase tracked text = the classic eyebrow/badge label
  { name: 'tiny uppercase label inside a rounded-full box', re: /rounded-full[^"`']*uppercase[^"`']*tracking|uppercase[^"`']*tracking[^"`']*rounded-full/ },
  { name: 'tag chip list', re: /aria-label="Tags"/ },
];

const hits = [];
for (const file of files) {
  const lines = fs.readFileSync(path.join(root, file), 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    if (line.includes('design-rule-ok') || (lines[i - 1] ?? '').includes('design-rule-ok')) return;
    for (const rule of rules) if (rule.re.test(line)) hits.push(`${file}:${i + 1}  [${rule.name}]  ${line.trim().slice(0, 110)}`);
  });
}

if (hits.length) {
  console.log('Possible boxed labels (see CLAUDE.md, design rule 1):\n' + hits.join('\n'));
  console.log('\nIf a hit is a real control (button/switcher), add `design-rule-ok` in a comment on that line.');
  process.exit(1);
}
console.log('check:design OK: no boxed labels found.');
