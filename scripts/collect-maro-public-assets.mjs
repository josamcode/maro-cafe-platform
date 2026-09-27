import { createHash } from 'node:crypto';
import { Buffer } from 'node:buffer';
import { mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import ts from 'typescript';

// Parse public source as data only. Never execute downloaded JavaScript.
const origin = 'https://maro-cafe-3.vercel.app/';
const root = new URL('../assets/maro/', import.meta.url);
const temp = join(tmpdir(), 'maro-public-source');
await mkdir(temp, { recursive: true });
async function source(name) {
  const response = await fetch(new URL(name, origin), { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Source ${name}: HTTP ${response.status}`);
  const body = await response.text();
  await writeFile(join(temp, name), body);
  return body;
}
const [html, script, stories] = await Promise.all([
  source('index.html'),
  source('MARO.js'),
  source('stories.html'),
]);
const records = [];
const hashes = new Set();
await mkdir(new URL('metadata/', root), { recursive: true });

function literal(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node))
    return Object.fromEntries(
      node.properties.map((property) => {
        if (!ts.isPropertyAssignment(property)) throw new Error('Unsupported source property.');
        return [property.name.text, literal(property.initializer)];
      }),
    );
  throw new Error('Source contains a non-literal expression.');
}
let menu;
const tree = ts.createSourceFile('MARO.js', script, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
function visit(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(tree) === 'MARO_MENU')
    menu = literal(node.initializer);
  ts.forEachChild(node, visit);
}
visit(tree);
if (!Array.isArray(menu)) throw new Error('Menu data was not found.');
const catalog = menu.map((category) => ({
  id: category.id,
  name: category.en,
  sourceServingNote: category.note?.en ?? null,
  items: category.items.map((item) => ({
    name: item.en,
    prices: item.price2
      ? [
          { label: item.unit === 'shot' ? 'Single' : 'Small', amount: item.price, currency: 'EGP' },
          {
            label: item.unit === 'shot' ? 'Double' : 'Large',
            amount: item.price2,
            currency: 'EGP',
          },
        ]
      : [{ label: 'Standard', amount: item.price, currency: 'EGP' }],
    sourceCanBadge: Boolean(category.allCanned || item.canned),
    verification: 'Source-listed; requires owner confirmation before launch',
  })),
}));
await writeFile(
  new URL('metadata/menu.json', root),
  JSON.stringify(
    {
      source: origin,
      sourceData: origin + 'MARO.js',
      capturedAt: new Date().toISOString(),
      currency: 'EGP',
      notes: [
        'The source script describes this as a transcription of a printed menu; that PDF has not been obtained.',
        'Sizes follow the source UI labels. Serving volumes and branch-specific availability are unconfirmed.',
        'The source lists Avocado under Hot Coffee; confirm whether this is a naming/transcription error.',
      ],
      categories: catalog,
    },
    null,
    2,
  ) + '\n',
);

const slug = (text) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
async function save(bytes, path, info) {
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  if (hashes.has(sha256)) return;
  hashes.add(sha256);
  const target = new URL(path, root);
  await mkdir(new URL('.', target), { recursive: true });
  await writeFile(target, bytes);
  records.push({ path, bytes: bytes.length, sha256, ...info });
}

for (const match of html.matchAll(/<img\b[^>]*>/g)) {
  const tag = match[0];
  const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
  const title = tag.match(/\balt="([^"]*)"/)?.[1] || 'MARO logo';
  if (!src?.startsWith('data:image/')) continue;
  const [, type, base64] = src.match(/^data:(image\/[^;]+);base64,(.+)$/) || [];
  if (!base64) continue;
  const isBrand = /logo/i.test(title);
  const extension = type === 'image/png' ? 'png' : 'jpg';
  await save(
    Buffer.from(base64, 'base64'),
    `${isBrand ? 'brand' : 'offers'}/${slug(title)}.${extension}`,
    {
      title,
      sourcePage: origin,
      sourceKind: 'embedded-website-image',
      mediaType: type,
      approval: isBrand
        ? 'Brand identity candidate; confirm preferred version'
        : 'Historical promotional artwork; price and validity unconfirmed',
    },
  );
}

const videoSources = [...stories.matchAll(/<video\b[^>]*\bsrc="([^"]+)"/g)].map(
  (match) => match[1],
);
for (const src of ['talabat.png', ...videoSources]) {
  const url = new URL(src, origin).href;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    await save(bytes, src.endsWith('.mp4') ? `video/${src.toLowerCase()}` : `reference/${src}`, {
      title: src,
      sourcePage: src.endsWith('.mp4') ? origin + 'stories.html' : origin,
      sourceUrl: url,
      sourceKind: 'website-file',
      mediaType: response.headers.get('content-type'),
      approval: src.endsWith('.mp4')
        ? 'Review visual content and audio rights before publication'
        : 'Third-party partner mark; use only for the appropriate delivery link',
    });
  } catch (error) {
    records.push({ sourceUrl: url, status: 'unavailable', reason: error.message });
  }
}

await writeFile(
  new URL('metadata/website-assets.json', root),
  JSON.stringify(
    {
      capturedAt: new Date().toISOString(),
      assets: records,
      knownMissing: [{ url: origin + 'images/place-2.jpeg', status: 'HTTP 404 during collection' }],
    },
    null,
    2,
  ) + '\n',
);
console.log(
  JSON.stringify(
    {
      categories: catalog.length,
      items: catalog.reduce((sum, c) => sum + c.items.length, 0),
      priceOptions: catalog.flatMap((c) => c.items).reduce((sum, i) => sum + i.prices.length, 0),
      assets: records.map(({ path, bytes, status }) => ({ path, bytes, status })),
    },
    null,
    2,
  ),
);
