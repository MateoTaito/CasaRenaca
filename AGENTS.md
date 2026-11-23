# AGENTS.md — CasaReñaca

> Instrucciones obligatorias para cualquier agente IA que trabaje en este repo.
> Leer este archivo siempre al iniciar una sesión, antes de explorar o editar código.

## 1. Tecnología del proyecto

Stack permitido: **HTML + CSS + TS (actualmente JS vanilla) sin framework.**

- `index.html`: HTML semántico, sin build de frontend, sin JSX/TSX.
- `styles.css`: CSS vanilla, sin pre/post-procesadores.
- `script.js`: JS vanilla (ES modules). La migración a **TypeScript sin framework** está prevista pero **aún no aplicada**.
- `scripts/*.mjs`: utilidades Node.js vanilla para build/verify.
- Deploy: sitio estático en `dist/` desplegado con Cloudflare (`npx cf deploy ./dist`).

**Regla estricta:** NO introducir frameworks, librerías, preprocesadores, bundlers, ni nuevas dependencias sin consultar explícitamente al mantenedor. Esto incluye React/Vue/Svelte, Tailwind/Sass, jQuery, Prettier/ESLint configs, Vite/Webpack, etc. Si una tarea parece requerirlos, proponerlo y esperar aprobación.

Comandos válidos:

```bash
npm ci
npm run build   # copia index.html, styles.css, script.js + assets/ a dist/
npm run verify  # valida title, refs locales, sin localhost, peso < 20MB
```

## 2. Estructura del proyecto

Árbol resumido (leer solo lo necesario, no escanear `assets/` salvo que la tarea sea visual):

```
CasaRenaca/
├── index.html                  # Landing completa (~687 líneas). Secciones: hero#inicio, visit#visitanos, carta#carta, manifiesto/collage#la-casa, 4x .atmosphere, statement, social, footer + JSON-LD Restaurant
├── styles.css                  # Estilos globales (~2360 líneas). Clases BEM aprox: .site-header, .hero, .visit, .carta, .collage, .atmosphere, .social, .site-footer
├── script.js                   # Interactividad vanilla (~220 líneas). Header scroll, menú móvil, estado abierto/cerrado por horario, reveal on scroll, collage modal, año footer
├── assets/
│   ├── hero-logo.jpg / carta-foto-1.jpg / casa_*.jpg / *.webp / carta-casa-renaca.pdf
│   └── instagram/              # 13 fotos espejo de @casarenaca + README.md con origen/permisos
├── scripts/
│   ├── build.mjs               # Limpia y genera dist/ (solo copia archivos + assets/, sin bundling)
│   └── verify.mjs              # Falla si falta title, refs rotas, restos localhost, o dist/ > 20MB; avisa si imagen > 1.5MB
├── .github/workflows/
│   ├── ci.yml                  # En PR y push a main: npm ci → build → verify → cf deploy --dry-run
│   └── deploy.yml              # En push a main: igual que CI + deploy real a Cloudflare Workers
├── package.json                # Solo scripts build/verify + devDep `cf`. No añadir deps sin consultar.
├── README.md                   # Descripción pública, stack, comandos y cómo contribuir
└── AGENTS.md                   # Este archivo (mantener actualizado)
```

Descripción general para ahorrar lecturas:

- Es una **landing estática de restaurante** (Casa Reñaca, Reñaca CL): cocina italiana, terraza, pet friendly, eventos. Todo el contenido vive en `index.html`.
- No hay router, estado global ni API propia. Enlaces externos clave: WhatsApp `https://wa.link/pxzelh`, Instagram `@casarenaca`, Google Maps embed con coords `-32.9717295,-71.5331733`.
- `script.js` y `styles.css` están acoplados a los `data-*` y clases de `index.html` (`data-header`, `data-menu-toggle`, `data-mobile-menu`, `data-open-status`, `data-status-dot`, `data-collage-item`, `data-year`, `.reveal`, `.media-reveal`). Cambiar HTML exige revisar ambos.
- `dist/` y `node_modules/` son generados (ver `.gitignore`), nunca editarlos.

## 3. Reglas de aportación y formato

1.  **Reutilizar antes que crear:** cada aporte debe priorizar la reutilización de clases, funciones y patrones existentes por sobre nuevas líneas. No duplicar estilos/funciones; extraer helper o clase común si se repite 2+ veces.
2.  **Formato:** respetar el formato existente (2 espacios, comillas dobles en HTML/JS, punto y coma en JS). NO añadir ni configurar formatters/linters (Prettier, ESLint, etc.) sin consultar, por la regla de stack §1.
3.  **Nomenclatura:** `camelCase` para variables, funciones y archivos JS/TS (`openStatus`, `collageModal`); `kebab-case` para clases CSS y `data-*`; `UPPER_SNAKE` solo para constantes globales.
4.  **Ramas:** trabajar siempre sobre rama nueva con nombre descriptivo, nunca directo en `main`. Formato: `<tipo>/<descripcion-corta>` ej: `feat/reserva-whatsapp`, `fix/horario-domingo`, `docs/agents-inicial`, `style/hero-mobile`, `refactor/collage-modal`.
5.  **Commits:** commits pequeños y separados por unidad lógica, en español o inglés consistente con el historial. Usar **Conventional Commits**: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`, `perf:`, `test:` ej: `feat: añade sección carta con foto local`.
6.  **PRs:** una PR por objetivo, con título conventional-commit y descripción: qué cambia, por qué, cómo verificar (`npm run build && npm run verify`), y capturas si hay cambio visual. Marcar como draft si está incompleta.
7.  **CI:** cuando se lance una PR, esperar a que el CI (`Verify` → build + verify + dry-run) pase completamente. **NO mergear de forma independiente** salvo indicación explícita del mantenedor. Si el CI falla, corregir en la misma rama con nuevos commits.

## 4. Documentación sincronizada

Por cada cambio, dejar actualizado el resto del proyecto:

- Si cambia estructura, scripts, comandos o deploy → actualizar este `AGENTS.md`.
- Si cambia contenido visible, horarios, enlaces, assets o permisos de fotos → actualizar comentarios/alt/textos en `index.html` y `assets/instagram/README.md` si aplica.
- Si cambia una clase `CSS` o un `data-*` en HTML → actualizar `styles.css` y `script.js` en el mismo PR, nunca dejar referencias huérfanas.
- Si cambia `scripts/build.mjs` o `verify.mjs` → verificar que `package.json`, `ci.yml` y `deploy.yml` sigan siendo coherentes.
- No dejar TODOs, código comentado ni docs obsoletas. Cada PR debe dejar el repo en estado consistente y verificable con `npm run build && npm run verify`.
