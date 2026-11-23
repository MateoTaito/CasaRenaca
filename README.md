# CasaReñaca

Landing estática del restaurante Casa Reñaca (Reñaca, Viña del Mar): cocina italiana, bolognesa de 6 horas, terraza/jardín, pet friendly y eventos en casona.

- Dirección: Vicuña Mackenna 901, Reñaca
- Reservas: WhatsApp https://wa.link/pxzelh (`+56 9 6638 0478`)
- Instagram: https://www.instagram.com/casarenaca/
- Horario: Mar–Mié 13:00–22:00, Jue–Sáb 13:00–23:00, Dom 13:00–17:00, Lun cerrado. Cocina cierra 1h antes.

## Stack

HTML + CSS + TS (actualmente JS vanilla) **sin framework**. No añadir frameworks, librerías, bundlers ni dependencias sin consultar al mantenedor. Ver reglas completas en `AGENTS.md`.

- `index.html` — contenido y estructura completa (hero, visita/horarios, carta, collage, atmósfera, social, footer + JSON-LD).
- `styles.css` — estilos vanilla.
- `script.js` — interactividad vanilla (header, menú móvil, estado abierto/cerrado, reveal, modal collage).
- `scripts/` + `package.json` — solo build/verify con Node vanilla, sin bundling.

## Estructura

```
CasaRenaca/
├── index.html
├── styles.css
├── script.js
├── assets/              # fotos locales + carta-casa-renaca.pdf + instagram/ (ver assets/instagram/README.md)
├── scripts/             # build.mjs → genera dist/ | verify.mjs → valida dist/
├── .github/workflows/  # ci.yml (PR: build+verify+dry-run) | deploy.yml (main: deploy Cloudflare)
├── package.json
├── AGENTS.md            # reglas obligatorias para agentes IA / contribuidores
└── README.md
```

`dist/` y `node_modules/` son generados, no se editan. `script.js` y `styles.css` dependen de las clases y `data-*` de `index.html` (`data-header`, `data-menu-toggle`, `data-open-status`, `data-collage-item`, etc.): cambiar HTML exige revisar ambos.

## Desarrollo

```bash
npm ci
npm run build   # copia index.html, styles.css, script.js + assets/ a dist/
npm run verify  # valida title, refs locales, sin localhost, peso < 20MB
```

Deploy: push a `main` → `deploy.yml` publica `dist/` en Cloudflare Workers. Las PRs solo hacen `dry-run`.

## Contribuir

1. Lee `AGENTS.md` antes de empezar.
2. Rama nueva descriptiva: `feat/...`, `fix/...`, `docs/...`.
3. Reutiliza código existente, respeta formato (2 espacios, `camelCase` en JS), commits y PR con Conventional Commits.
4. Espera a que el CI pase, no mergees sin indicación.
5. Deja docs y comentarios actualizados en el mismo PR (`README.md`, `AGENTS.md`, `assets/instagram/README.md` si aplica).

Fotos: con permiso del local, crédito a `@casarenaca` en footer. Detalle de origen en `assets/instagram/README.md`.
