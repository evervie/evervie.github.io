# Portfolio

Static site: HTML + CSS + JS, no build step.

## Edit
- `projects.js` — your info (`SITE`) and your cases (`PROJECTS`). The list of projects is empty until you add one; a template is in the comment.
- Images: put them in an `assets/` folder and reference them in `projects.js`.
- `style.css` — colors are variables at the top (`:root`), animations are `@keyframes` (`rise`, `up`, `drift`).
- `script.js` — rendering, project view, theme toggle, cursor glow.

## Run locally
Open `index.html` in a browser, or run `python3 -m http.server` in this folder.

## Publish on GitHub Pages
1. Create a repository and upload these files.
2. Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. The site appears at `https://<username>.github.io/<repo>/`.
   For a clean address, name the repo `<username>.github.io`.
4. Custom domain: Settings → Pages → Custom domain, then add the DNS records GitHub shows.
