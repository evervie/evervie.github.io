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

## What is where (v8)
- `glass.js` — welcome-screen star, 3D glass letters PORTfolio, crystal tulips at the bottom. `flower.js` — hero flower, corner sigil, cursor star.
- Projects are in `projects.js`: each has `tags` (3 shown on the card, they become filters), `badge`, `cover`, `images`. Pictures live in `assets/`.
- First project has no screenshots yet: add them to `assets/utilization/` and set `cover` + `images` (a drawn browser window is shown until then).

## About / resume / project page (v15)
- Resume: put the PDF in `assets/resume/` and set `resume: "assets/resume/resume.pdf"` in `projects.js` — until then the button is shown disabled with "PDF coming soon".
- "My process" and "My story" texts live in `SITE.text.en/ru` (`process`, `story`) in `projects.js`.
- Tulips also grow behind the project page (canvas `#gardenM`, dimmed, behind pictures and text). The "visit website" button shows under the preview whenever a project has `link`.

## Contacts / footer / privacy (v16)
- E-mail icon: soft round glow + "100% chance I'll read it :)" on hover. Pinterest icon: set `social.pinterest` in `projects.js` (the icon stays hidden while it is empty).
- Footer: year + nickname + CREATIVE CODER, lilac "designed & built by me" (links to GitHub), small "Privacy" link that opens a glass dialog (text: `pol_html` in `script.js`).
- Black -> flowers transition is soft: the garden fades in from the top, the violet haze at the bottom matches the footer colour.

## Notes
- The site is black only (no light theme). Weak devices (≤4 CPU cores / narrow screens) get fewer particles and a lighter wave mesh. "Reduce motion" turns off the spinning, pollen, waves motion and the cursor flower.
- Cursor flower is desktop only.

## Run locally
Open `index.html`, or run `python3 -m http.server` in this folder.

## Update on GitHub Pages
Repository → **Add file → Upload files** → drag in all files (replace existing) → **Commit changes**. Hard-reload (Ctrl/Cmd + Shift + R) if the old version shows.
