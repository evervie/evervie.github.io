# Portfolio

Static site: HTML + CSS + JS, no build step. Three.js is loaded from a CDN (cdnjs), so the page needs internet access.

## Files
- `index.html` — structure. `style.css` — all styles (black glass look, welcome screen, first-screen type).
- `projects.js` — your info (`SITE`), projects (`PROJECTS`) and **special cases** (`SPECIAL`). Social links are placeholders (`YOUR_USERNAME`) — replace them. Texts exist in EN and RU.
- `script.js` — interface texts (`UI`, both languages), rendering, language switch, welcome screen, reveal-on-scroll, magnetic buttons.
- `flower.js` — all 3D: hero flower, glass waves, bottom-left glass object, cursor flower. Petal shape: `surf()`; flower state per scroll position: `OP`, `FD`, `SC`.
- `assets/` — create this folder for your photo, resume and project images.

## Projects gallery
One list: `window.PROJECTS` in `projects.js` (a full template with all fields is in the comment). Card = one main image + title, direction, year, role. Case page = task -> insight -> solution -> results + gallery with captions. Filters show up only when real projects fall into 2+ categories; `special: true` lists a case under "Special cases"; `soon: true` is a non-clickable placeholder (keep just one).

## Notes
- The site is black only (no light theme). Weak devices (≤4 CPU cores / narrow screens) get fewer particles and a lighter wave mesh. "Reduce motion" turns off the spinning, pollen, waves motion and the cursor flower.
- Cursor flower is desktop only.

## Run locally
Open `index.html`, or run `python3 -m http.server` in this folder.

## Update on GitHub Pages
Repository → **Add file → Upload files** → drag in all files (replace existing) → **Commit changes**. Hard-reload (Ctrl/Cmd + Shift + R) if the old version shows.
