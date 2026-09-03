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
  for (const anchor of references.filter((reference) => reference.startsWith("#"))) {
    if (!ids.has(anchor.slice(1))) errors.push(`${htmlFile}: âncora inexistente: ${anchor}`);
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
