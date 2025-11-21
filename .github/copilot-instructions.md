# GitHub Copilot Instructions

## Project Snapshot
- Vite + React 18 SPA (entry `src/main.jsx`, main shell in `src/App.jsx`) styled with Tailwind tokens from `tailwind.config.js`; assets deploy to GitHub Pages so keep Vite `base: '/Mike_in_Vietnam2/'` and reference static files via root-relative paths like `/images/clip_p1_0.png`.
- Narrative data (remembrances + clippings metadata) lives in `src/data/content.json` and is synchronously imported into `App.jsx`; the `useEffect` wrapper simulates async loading, so maintain the same pattern when replacing the data source.
- Styling is almost entirely utility classes; `src/index.css` only wires Tailwind plus a `.line-clamp-4` helper, so add any bespoke styles via Tailwind `@layer` if possible.

## Data & State Flow
- `App.jsx` stores the parsed JSON in local state, renders all remembrances in the left grid, and owns the image lightbox (`selectedImage`); pass `handleImageClick` to any component that shows images so desktop and mobile clippings stay in sync.
- `Remembrance.jsx` expects `{ text, summary, gruesome, clippings }`; the summary column handles the optional "Warning: Graphic" badge, while the body column pipes `text` through `<WikiText>` and optionally lists per-remembrance clippings. Keep `text` as a raw string so the wiki parser can operate.
- Right-rail clippings (`aside` for large screens, grid below for mobile) consume `data.clippings` from the same JSON file; each item needs `id`, `path`, `ocr_text`, and `summary` to keep rendering/widgets consistent.

## Wikipedia Tooltips
- `src/utils/wikiTerms.js` maps literal text to Wikipedia article titles and builds a longest-match regex; add new keys in descending specificity to prevent nested matches (e.g., add `"USS Okinawa"` before plain `"Okinawa"`).
- `WikiText.jsx` runs the regex once per paragraph, filters overlapping matches manually, and wraps matches with `<WikiTooltip>`; never inject JSX into the source strings or you will break the tokenizer.
- `WikiTooltip.jsx` delays the REST call by 300 ms, caches the fetched summary thumbnail/title/url in component state, and renders via `createPortal` with fixed positioning; read `WIKIPEDIA_TOOLTIPS.md` before altering hover timing or styles.

## Comments Integration
- `src/components/Comments.jsx` simply passes the hard-coded CSV/Form URLs into `GoogleSheetComments`; change those constants if a new Sheet/Form is provided.
- `GoogleSheetComments.jsx` fetches the published CSV, runs a bespoke quoted-field parser, reverses the rows to show newest first, and renders a CTA button linking to the Google Form; avoid embedding commas/newlines in seed data because the parser is intentionally minimal.

## Content + Assets Workflow
- Run `python scripts/process_content.py` (requires `pymupdf`, `pytesseract`, Pillow, and a local Tesseract binary) to regenerate both `src/data/content.json` and `public/images/clip_*.png` from `Docs/Mike Vietnam Remembrances circa 2003 .txt` + `Docs/MikeFitz.pdf`.
- The script writes `remembrances` as plain strings and `clippings` with OCR text; if you hand-edit the JSON, preserve keys (`id`, `path`, `page`, `ocr_text`, `summary`) so renderers don’t crash.
- Because GitHub Pages hosts the app under `/Mike_in_Vietnam2/`, always place new static assets under `public/` and link via `/images/...` or the Vite public root instead of relative `./` paths.

## Build & Debug
- Standard npm scripts: `npm run dev` (Vite dev server), `npm run build` (static output), `npm run preview` (serve build), `npm run lint` (ESLint with React + hooks rules); there are no Jest/Vitest tests.
- Manual QA is the norm: verify tooltips by hovering and confirm comments load by hitting the published CSV endpoint while the dev server runs.
