import { cpSync, mkdirSync, rmSync, existsSync } from "node:fs";

const root = new URL("..", import.meta.url);

rmSync(new URL("dist/", root), { recursive: true, force: true });
mkdirSync(new URL("dist/", root), { recursive: true });

for (const file of ["index.html", "styles.css", "script.js"]) {
  if (!existsSync(new URL(file, root))) {
    console.error(`Falta archivo requerido: ${file}`);
    process.exit(1);
  }
  cpSync(new URL(file, root), new URL(`dist/${file}`, root));
}

if (!existsSync(new URL("assets/", root))) {
  console.error("Falta carpeta requerida: assets/");
  process.exit(1);
}
cpSync(new URL("assets/", root), new URL("dist/assets/", root), { recursive: true });

// Limpieza: READMEs no son parte del sitio público
rmSync(new URL("dist/README.md", root), { force: true });
rmSync(new URL("dist/assets/README.md", root), { force: true });
rmSync(new URL("dist/assets/instagram/README.md", root), { force: true });

console.log("build ok: dist/ lista para desplegar");
