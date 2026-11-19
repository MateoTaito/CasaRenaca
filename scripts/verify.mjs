import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const failures = [];
const warnings = [];

function fail(msg) {
  failures.push(msg);
  console.error(`FAIL: ${msg}`);
}
function warn(msg) {
  warnings.push(msg);
  console.warn(`WARN: ${msg}`);
}
function ok(msg) {
  console.log(`OK: ${msg}`);
}

// 1. Archivos base
for (const f of ["index.html", "styles.css", "script.js"]) {
  if (!existsSync(join(DIST, f))) fail(`falta dist/${f} (¿corriste npm run build?)`);
}
if (!existsSync(join(DIST, "assets"))) fail("falta dist/assets/");
if (failures.length) process.exit(1);

const html = readFileSync(join(DIST, "index.html"), "utf8");

// 2. Chequeos básicos del documento
if (!/<title>[^<]+<\/title>/.test(html)) fail("index.html sin <title>");
else ok("título presente");
if (!/styles\.css/.test(html)) fail("index.html no referencia styles.css");
if (!/script\.js/.test(html)) fail("index.html no referencia script.js");

// 3. Sin restos de desarrollo local
for (const bad of ["localhost", "127.0.0.1", "192.168."]) {
  if (html.includes(bad)) fail(`index.html contiene referencia local prohibida: ${bad}`);
}
ok("sin referencias a localhost");

// 4. Referencias locales (src/href) deben existir en dist/
const refs = new Set();
for (const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  const ref = m[1].trim();
  if (!ref || ref.startsWith("http") || ref.startsWith("//") || ref.startsWith("data:") || ref.startsWith("mailto:") || ref.startsWith("#")) continue;
  refs.add(ref.split("?")[0]);
}
let checked = 0;
for (const ref of refs) {
  // Google Fonts y escapes HTML (&amp;) no son archivos locales
  if (ref.includes("fonts.googleapis.com") || ref.includes("&")) continue;
  const path = join(DIST, ref);
  if (!existsSync(path)) fail(`referencia rota: "${ref}" no existe en dist/`);
  else checked++;
}
ok(`${checked} referencias locales resuelven en dist/`);

// 5. Imágenes: existen y tamaño razonable
function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
const files = walk(DIST);
let total = 0;
for (const f of files) {
  const st = statSync(f);
  total += st.size;
  if (/\.(jpe?g|png|webp|avif|gif)$/i.test(f) && st.size > 1_500_000) {
    warn(`${f} pesa ${(st.size / 1_048_576).toFixed(1)} MB, considera comprimirla`);
  }
}
ok(`${files.length} archivos en dist/, total ${(total / 1_048_576).toFixed(2)} MB`);
if (total > 20 * 1_048_576) fail("dist/ supera 20 MB, revisa assets");

if (failures.length) {
  console.error(`\nverificación fallida: ${failures.length} error(es)`);
  process.exit(1);
}
console.log(`\nverificación ok${warnings.length ? ` (${warnings.length} advertencia(s))` : ""}`);
