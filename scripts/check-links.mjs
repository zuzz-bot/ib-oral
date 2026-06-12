// Verifies every source URL in the topic DATA. Reports broken links.
// Run: node scripts/check-links.mjs
import { DATA } from "../src/data/content.js";

const entries = [];
for (const [topic, d] of Object.entries(DATA)) {
  for (const s of d.sources) entries.push({ topic, title: s.title, url: s.url });
}

console.log(`Checking ${entries.length} source links...\n`);

const check = async ({ topic, title, url }) => {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 12000);
  try {
    // Some servers reject HEAD; fall back to a ranged GET.
    let res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: ctrl.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
        Accept: "text/html,*/*",
      },
    });
    clearTimeout(t);
    return { topic, title, url, status: res.status, finalUrl: res.url };
  } catch (e) {
    clearTimeout(t);
    return { topic, title, url, status: "ERR", err: e.cause?.code || e.name };
  }
};

// limited concurrency
const out = [];
const pool = 8;
let i = 0;
await Promise.all(
  Array.from({ length: pool }, async () => {
    while (i < entries.length) {
      const e = entries[i++];
      out.push(await check(e));
    }
  })
);

const bad = out.filter(
  (r) => r.status === "ERR" || (typeof r.status === "number" && r.status >= 400)
);
const ok = out.length - bad.length;
console.log(`OK (2xx/3xx): ${ok}   Problem: ${bad.length}\n`);
console.log("=== PROBLEM LINKS ===");
for (const b of bad.sort((a, z) => a.topic.localeCompare(z.topic))) {
  console.log(`[${b.status}] ${b.topic} — ${b.title}\n        ${b.url}${b.err ? "  (" + b.err + ")" : ""}`);
}
