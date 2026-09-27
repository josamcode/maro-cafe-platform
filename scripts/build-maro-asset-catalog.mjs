import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../assets/maro/', import.meta.url);
const { assets } = JSON.parse(
  await readFile(new URL('metadata/asset-manifest.json', root), 'utf8'),
);
const escape = (s) =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const cards = assets
  .map((a) => {
    const video = a.path.endsWith('.mp4');
    return `<article data-kind="${escape(a.kind)}" data-text="${escape(a.title.toLowerCase())}">
    <a class="preview" href="${escape(a.path)}" target="_blank">${video ? `<video controls preload="metadata" src="${escape(a.path)}"></video>` : `<img loading="lazy" src="${escape(a.path)}" alt="${escape(a.title)}">`}</a>
    <div class="details"><span class="tag">${escape(a.kind)}</span><h2>${escape(a.title)}</h2>
    <p>${video ? 'Video' : `${a.width} × ${a.height}`} · ${(a.bytes / 1024).toFixed(0)} KB</p>
    <p class="note">${escape(a.usage)}</p><a href="${escape(a.path)}" download>Download</a> · <a href="${escape(a.sourcePage)}" target="_blank" rel="noreferrer">Source</a></div></article>`;
  })
  .join('\n');
const kinds = [...new Set(assets.map((a) => a.kind))];
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MARO Asset Library</title>
<style>
:root{color-scheme:dark;--gold:#c9a876;--ink:#0c0b0a;--cream:#f4ecdf}*{box-sizing:border-box}body{margin:0;background:var(--ink);color:var(--cream);font:15px/1.6 system-ui,sans-serif}header,main{max-width:1500px;margin:auto;padding:32px}header{padding-top:56px}h1{font:clamp(38px,6vw,72px)/1.05 Georgia,serif;margin:12px 0 20px}h2{font-size:15px;overflow-wrap:anywhere;margin:10px 0}.eyebrow,.tag{color:var(--gold);letter-spacing:.08em}.intro{max-width:780px;color:#b9ae9f}a{color:var(--gold)}nav{display:flex;gap:20px;flex-wrap:wrap}.controls{position:sticky;top:0;z-index:1;background:#151210f5;padding:18px 32px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;border-block:1px solid #393025}input,select{background:#201c17;color:var(--cream);border:1px solid #665540;padding:12px;border-radius:6px;font:inherit}input{flex:1;min-width:210px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:22px}article{background:#151210;border:1px solid #332b21;border-radius:12px;overflow:hidden}article[hidden]{display:none}.preview{height:290px;display:flex;align-items:center;justify-content:center;background:#211d18}.preview img,.preview video{width:100%;height:100%;object-fit:contain}.details{padding:18px}.tag{font-size:11px;text-transform:uppercase}p{margin:8px 0}.note{font-size:12px;color:#b9ae9f;min-height:58px}footer{padding:32px;text-align:center;color:#b9ae9f}#count{white-space:nowrap}a:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid var(--gold);outline-offset:3px}@media(max-width:600px){header,main{padding:24px 16px}.controls{padding:12px 16px}.grid{grid-template-columns:1fr 1fr;gap:10px}.preview{height:210px}.details{padding:12px}.note{display:none}h2{font-size:13px}}
</style></head><body>
<header><div class="eyebrow">MARO / SOURCE LIBRARY / 27 SEP 2026</div><h1>Everything collected.<br>Ready to explore.</h1><p class="intro">Branding, social imagery, offers and videos collected from MARO's public pages. Originals are preserved without enhancement or upscaling. Check dimensions and source before choosing an asset.</p><nav><a href="README.md">Collection guide</a><a href="metadata/menu.json">Menu & prices</a><a href="metadata/branches.json">Branches</a><a href="metadata/offers.json">Offer notes</a><a href="metadata/asset-manifest.json">Full manifest</a></nav></header>
<div class="controls"><input id="search" type="search" placeholder="Search title or post ID" aria-label="Search assets"><select id="kind" aria-label="Filter asset type"><option value="">All asset types</option>${kinds.map((k) => `<option value="${escape(k)}">${escape(k)}</option>`).join('')}</select><span id="count" role="status">${assets.length} assets</span></div>
<main><div class="grid">${cards}</div></main><footer>Prices and promotions require owner confirmation. Instagram covers are still images, not reel downloads. No editable design source files were obtained.</footer>
<script>const search=document.querySelector('#search');const kind=document.querySelector('#kind');const cards=[...document.querySelectorAll('article')];function filter(){let count=0;for(const card of cards){card.hidden=!(card.dataset.text.includes(search.value.toLowerCase())&&(!kind.value||card.dataset.kind===kind.value));if(!card.hidden)count++;}document.querySelector('#count').textContent=count+' assets';}search.addEventListener('input',filter);kind.addEventListener('change',filter);</script></body></html>`;
await writeFile(new URL('index.html', root), html);
console.log(`Built catalog with ${assets.length} assets.`);
