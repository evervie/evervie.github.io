const S = window.SITE, P = window.PROJECTS || [];
const $ = s => document.querySelector(s);
const esc = t => String(t ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pad = n => String(n).padStart(2, "0");

/* ---- static content ---- */
$("#logo").textContent = S.name + ".";
$("#role").textContent = S.role;
$("#intro").textContent = S.intro;
$("#aboutText").textContent = S.about;
$("#cta").textContent = S.cta;
$("#mail").href = "mailto:" + S.email;
$("#headline").innerHTML = S.headline.map((line, l) =>
  `<span class="ln">${line.split(" ").map((w, i) =>
    `<span class="w"><span style="--d:${(l * 3 + i) * 90}ms">${esc(w)}</span></span>`).join(" ")}</span>`).join("");
$("#skills").innerHTML = S.skills.map(s => `<li>${esc(s)}</li>`).join("");
$("#tools").innerHTML = S.tools.map(s => `<span>${esc(s)}</span>`).join("");
$("#photo").innerHTML = S.photo ? `<img src="${esc(S.photo)}" alt="${esc(S.name)}">` : `<div class="ph"></div>`;
if (S.resume) { const r = $("#resume"); r.href = S.resume; r.hidden = false; r.setAttribute("download", ""); }
$("#social").innerHTML = S.social.map(s => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("");
document.title = `${S.name} — ${S.role}`;

/* ---- project grid ---- */
const grid = $("#grid");
if (!P.length) {
  grid.innerHTML = `<div class="empty"><p>First projects are on the way.</p><a href="#contact">Get in touch</a></div>`;
} else {
  grid.innerHTML = P.map((p, i) => `
    <button class="card" data-i="${i}">
      <div class="thumb">${p.cover ? `<img src="${esc(p.cover)}" alt="${esc(p.title)}" loading="lazy">` : `<div class="ph"></div>`}</div>
      <div class="meta"><div><b>${esc(p.title)}</b><small>${esc(p.type)}</small></div><span>${pad(i + 1)}</span></div>
    </button>`).join("");
  grid.addEventListener("click", e => { const c = e.target.closest(".card"); if (c) openProject(+c.dataset.i); });
}

/* ---- project view ---- */
const modal = $("#modal"); let cur = 0, lastFocus;
function openProject(i) {
  cur = (i + P.length) % P.length;
  const p = P[cur], imgs = p.images?.length ? p.images : (p.cover ? [p.cover] : []);
  $("#mBody").innerHTML = `
    <div class="m-info">
      <h2>${esc(p.title)}</h2><p class="kind">${esc(p.type)}</p>
      <p>${esc(p.description)}</p>
      ${p.task ? `<h4>task</h4><p>${esc(p.task)}</p>` : ""}
      ${p.solution ? `<h4>solution</h4><p>${esc(p.solution)}</p>` : ""}
    </div>
    <div class="m-gallery">
      <div class="m-main">${imgs[0] ? `<img id="mMain" src="${esc(imgs[0])}" alt="">` : `<div class="ph"></div>`}</div>
      ${imgs.length > 1 ? `<div class="m-thumbs">${imgs.map(s => `<button data-src="${esc(s)}"><img src="${esc(s)}" alt=""></button>`).join("")}</div>` : ""}
    </div>`;
  $("#mCount").textContent = `${pad(cur + 1)} / ${pad(P.length)}`;
  const l = $("#mLink"); l.hidden = !p.link; if (p.link) l.href = p.link;
  if (modal.hidden) { lastFocus = document.activeElement; modal.hidden = false; requestAnimationFrame(() => modal.classList.add("open")); document.body.style.overflow = "hidden"; $("#mBack").focus(); }
}
function closeProject() {
  modal.classList.remove("open"); document.body.style.overflow = "";
  setTimeout(() => { modal.hidden = true; lastFocus?.focus(); }, 450);
}
$("#mBack").onclick = closeProject;
$("#mPrev").onclick = () => openProject(cur - 1);
$("#mNext").onclick = () => openProject(cur + 1);
$("#mBody").addEventListener("click", e => { const b = e.target.closest("[data-src]"); if (b) $("#mMain").src = b.dataset.src; });
addEventListener("keydown", e => {
  if (modal.hidden) return;
  if (e.key === "Escape") closeProject();
  if (e.key === "ArrowLeft") openProject(cur - 1);
  if (e.key === "ArrowRight") openProject(cur + 1);
});

/* ---- theme ---- */
const root = document.documentElement;
try { const t = localStorage.getItem("theme"); if (t) root.dataset.theme = t; } catch (e) {}
$("#theme").onclick = () => {
  root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
};

/* ---- cursor glow (skipped for touch / reduced motion) ---- */
if (matchMedia("(hover:hover)").matches && !matchMedia("(prefers-reduced-motion:reduce)").matches) {
  const g = $("#glow"); let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;
  addEventListener("mousemove", e => { tx = e.clientX; ty = e.clientY; g.style.opacity = 1; });
  (function loop() { x += (tx - x) * .08; y += (ty - y) * .08; g.style.transform = `translate(${x}px,${y}px)`; requestAnimationFrame(loop); })();
}
