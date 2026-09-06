import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const htmlFiles = ["index.html", "links/index.html", "404.html"];
const errors = [];

const resolveLocalReference = (htmlFile, reference) => {
  const withoutQuery = reference.split(/[?#]/, 1)[0];
  if (!withoutQuery || withoutQuery.startsWith("#")) return null;
  if (/^(https?:|mailto:|tel:|data:)/.test(withoutQuery)) return null;

  let target = withoutQuery.startsWith("/")
    ? join(root, withoutQuery)
    : resolve(root, dirname(htmlFile), withoutQuery);

  if (existsSync(target) && statSync(target).isDirectory()) target = join(target, "index.html");
  if (!extname(target) && !existsSync(target)) target = `${target}.html`;
  return target;
};

for (const htmlFile of htmlFiles) {
  const absoluteFile = join(root, htmlFile);
  const html = readFileSync(absoluteFile, "utf8");

  if (/^\s*\+\s*(?:<|class=|href=)/m.test(html)) {
    errors.push(`${htmlFile}: contém marcador de patch inesperado.`);
  }

  const references = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/g)].map((match) => match[1]);
  for (const reference of references) {
    const target = resolveLocalReference(htmlFile, reference);
    if (target && !existsSync(target)) {
      errors.push(`${htmlFile}: referência local ausente: ${reference}`);
    }
  }

  const ids = new Set([...html.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]));
  for (const anchor of html.matchAll(/<a\b[^>]*href="https:\/\/(?:play\.google\.com|wa\.me|www\.instagram\.com)[^>]*>[\s\S]*?<\/a>/g)) {
    if (anchor[0].includes('<svg') && /play\.google\.com|floating-whatsapp|icon-whatsapp|icon-instagram/.test(anchor[0])) {
      errors.push(`${htmlFile}: marca externa redesenhada em SVG inline.`);
    }
    if (anchor[0].includes('play.google.com') && !anchor[0].includes('/assets/brands/google-play-badge-pt-br.png')) {
      errors.push(`${htmlFile}: download sem o selo oficial do Google Play.`);
    }
  }
  for (const anchor of references.filter((reference) => reference.startsWith("#"))) {
    if (!ids.has(anchor.slice(1))) errors.push(`${htmlFile}: âncora inexistente: ${anchor}`);
  }
}

// Supplied app captures keep their native dimensions; no stretched test renders.
for (const name of ["home", "categories", "more-categories", "food-categories", "benefits", "rides"]) {
  const path = join(root, `assets/app-${name}.png`);
  if (!existsSync(path)) {
    errors.push(`Print ausente: ${name}.`);
    continue;
  }
  const png = readFileSync(path);
  if (png.length < 24 || png.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a"
      || png.readUInt32BE(16) !== 945 || png.readUInt32BE(20) !== 1888) {
    errors.push(`Print ${name}: esperado PNG original 945 × 1888.`);
  }
}

for (const jsonFile of ["package.json", "vercel.json"]) {
  try {
    JSON.parse(readFileSync(join(root, jsonFile), "utf8"));
  } catch (error) {
    errors.push(`${jsonFile}: JSON inválido (${error.message}).`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Site validado: ${htmlFiles.length} páginas e referências locais conferidas.`);
}
