const S = window.SITE, P = window.PROJECTS || [], SP = window.SPECIAL || [];
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const root = document.documentElement;
const esc = t => String(t ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pad = n => String(n).padStart(2, "0");
const RM = matchMedia("(prefers-reduced-motion:reduce)").matches;
window.READY = 0;   // set when the welcome screen ends; the 3D flower starts opening then

/* ---- interface texts (edit freely) ---- */
const UI = {
  en: { nav_projects:"projects", nav_about:"about", nav_contact:"contact", h_projects:"selected <em>projects</em>", h_about:"about <span>me.</span>",
    sp_title:"special <em>cases</em>", sp_note:"Experimental work. This shelf keeps growing.", hello:"Hello! I’m",
    skills:"skills", tools:"tools", resume:"download resume", mail:"contact me", empty:"First projects are on the way.", touch:"Get in touch",
    back:"← back to projects", task:"task", solution:"solution", site:"view website ↗", prev:"Previous project", next:"Next project", lang:"Switch language" },
  ru: { nav_projects:"проекты", nav_about:"обо мне", nav_contact:"контакты", h_projects:"избранные <em>проекты</em>", h_about:"обо <span>мне.</span>",
    sp_title:"особые <em>кейсы</em>", sp_note:"Экспериментальные работы. Эта полка будет пополняться.", hello:"Привет! Я",
    skills:"навыки", tools:"инструменты", resume:"скачать резюме", mail:"связаться со мной", empty:"Первые проекты скоро появятся.", touch:"Написать мне",
    back:"← к проектам", task:"задача", solution:"решение", site:"открыть сайт ↗", prev:"Предыдущий проект", next:"Следующий проект", lang:"Сменить язык" }
};
const UI2 = {
  en: { h_projects:"projects", p_eyebrow:"selected works", p_sub:"ideas · design · experience", f_all:"All projects", f_special:"Special cases", sp_big:"Special cases", sp_desc:"Experimental projects and unique concepts.", explore:"Explore", soon:"coming soon", scroll:"scroll to explore", pf:"Portfolio", pf1:"PORT", pf2:"folio", role:"role", insight:"insight", results:"results" },
  ru: { h_projects:"проекты", p_eyebrow:"избранные работы", p_sub:"идеи · дизайн · опыт", f_all:"Все проекты", f_special:"Особые кейсы", sp_big:"Особые кейсы", sp_desc:"Экспериментальные проекты и уникальные концепции.", explore:"Смотреть", soon:"скоро", scroll:"листайте вниз", pf:"Портфолио", pf1:"ПОРТ", pf2:"фолио", role:"роль", insight:"инсайт", results:"результат" }
};
Object.keys(UI2).forEach(l => Object.assign(UI[l], UI2[l]));
let lang; try { lang = localStorage.getItem("lang"); } catch (e) {}
if (!UI[lang]) lang = /^ru/i.test(navigator.language || "") ? "ru" : "en";
const tr = v => v && typeof v === "object" ? (v[lang] ?? v.en ?? "") : (v ?? "");

/* ---- scroll reveal (things rise out of the dark) ---- */
const rvIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); rvIO.unobserve(e.target); } }), { threshold: .12 });
const rv = () => $$(".rv:not(.in)").forEach(e => rvIO.observe(e));

/* ---- static content ---- */
$("#logo").textContent = S.name + ".";
$("#mail").href = "mailto:" + S.email;
$("#tools").innerHTML = S.tools.map(s => `<span>${esc(s)}</span>`).join("");
$("#photo").innerHTML = S.photo ? `<img src="${esc(S.photo)}" alt="${esc(S.name)}">` : `<div class="ph"></div>`;
const letters = (s, d, cls = "") => [...s].map((c, i) => `<span class="ch ${cls}"><span style="--d:${d + i * 70}ms">${c}</span></span>`).join("");


/* ---- icons (same thin style everywhere) ---- */
const IC = {
  github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
  telegram: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
  x: '<path d="M3 3h5.2l12.8 18h-5.2z"/><path d="M20.4 3.4 13.3 10.9M10.7 13.1 3.6 20.6"/>',
  email: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>'
};
const link = k => k === "email" ? "mailto:" + S.email : S.social[k];
const icons = (keys, mag) => keys.filter(link).map(k => `<a class="ico${mag ? " mag" : ""}" href="${esc(link(k))}"${k === "email" ? "" : ' target="_blank" rel="noopener"'} aria-label="${k[0].toUpperCase() + k.slice(1)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${IC[k]}</svg></a>`).join("");
$("#topSoc").innerHTML = icons(["github", "telegram"]);
$("#socIcons").innerHTML = icons(["telegram", "instagram", "github", "x", "email"], true);

/* ---- projects: bento gallery + category filter + paging ---- */
const PO = P.filter(p => !p.soon);
const catKey = p => p.special ? "special" : String(typeof p.cat === "object" ? p.cat.en : (p.cat || "")).toLowerCase();
const WAVE = '<svg class="wsv" viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="wg" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".55" stop-color="#d6c8ff" stop-opacity=".9"/><stop offset="1" stop-color="#7b4dff" stop-opacity=".45"/></linearGradient></defs><g fill="none" stroke="url(#wg)" stroke-linecap="round"><path d="M-20 340C110 310 170 170 300 215S470 340 620 80" stroke-width="30" opacity=".35"/><path d="M-20 360C130 330 190 200 310 240S480 350 620 130" stroke-width="12" opacity=".6"/><path d="M-20 300C120 270 200 140 320 190S500 300 620 40" stroke-width="2" opacity=".9"/></g></svg>';
let flt = "all", page = 0;
const items = () => { const b = P.filter(p => flt === "all" || catKey(p) === flt); return flt === "all" || flt === "special" ? [{ intro: 1 }, ...b] : b; };
function filters() {
  const cats = []; P.forEach(p => { const k = catKey(p); if (k && k !== "special" && !cats.find(c => c.k === k)) cats.push({ k, l: p.cat }); });
  return [{ k: "all", l: UI[lang].f_all }, { k: "special", l: UI[lang].f_special }, ...cats.map(c => ({ k: c.k, l: tr(c.l) }))];
}
function renderBento() {
  const u = UI[lang], real = P.filter(p => !p.soon), showF = new Set(real.map(catKey).filter(Boolean)).size >= 2;
  if (!showF) flt = "all";
  const L = items(), pages = Math.max(1, Math.ceil(L.length / 5)); page = Math.min(page, pages - 1);
  const sl = L.slice(page * 5, page * 5 + 5);
  $("#filters").hidden = !showF; $("#bento").dataset.n = sl.length;
  $("#filters").innerHTML = filters().map(f => `<button class="fp${f.k === flt ? " on" : ""}" data-f="${esc(f.k)}">${esc(f.l)}</button>`).join("");
  $("#bento").innerHTML = sl.map((p, i) => {
    const n = pad(page * 5 + i + 1), big = i === 0 ? " big" : "";
    if (p.intro) return `<${showF ? 'button data-f="special"' : "div"} class="bc rv big intro"><div class="art">${WAVE}</div><div class="bt"><span class="bn">${n}</span><h3>${u.sp_big}</h3><p>${u.sp_desc}</p><span class="ex">${showF ? u.explore + " →" : u.soon}</span></div></${showF ? "button" : "div"}>`;
    const tag = p.soon ? "div" : "button", meta = [tr(p.type || p.cat), p.year, tr(p.role)].filter(Boolean).join(" · ");
    return `<${tag} class="bc rv${big}${p.soon ? " soon" : ""}"${p.soon ? "" : ` data-o="${PO.indexOf(p)}"`}><div class="art${p.cover ? " has" : ""}" style="--a:${(page * 5 + i) * 70}deg">${p.cover ? `<img src="${esc(p.cover)}" alt="" loading="lazy">` : ""}</div><div class="bt"><span class="bn">${n}</span><h3>${esc(tr(p.title))}</h3><small>${esc(meta)}</small><span class="go2">${p.soon ? u.soon : "↗"}</span></div></${tag}>`;
  }).join("");
  $("#pager").hidden = pages < 2; $("#pCount").textContent = `${page + 1} / ${pages}`; rv();
}
const setFlt = k => { flt = k; page = 0; renderBento(); };
$("#filters").addEventListener("click", e => { const b = e.target.closest("[data-f]"); if (b) setFlt(b.dataset.f); });
$("#bento").addEventListener("click", e => { const c = e.target.closest(".bc"); if (!c) return; if (c.dataset.f) setFlt(c.dataset.f); else if (c.dataset.o) openProject(+c.dataset.o); });
$("#pPrev").onclick = () => { page = Math.max(0, page - 1); renderBento(); };
$("#pNext").onclick = () => { page++; renderBento(); };

/* ---- project view ---- */
const modal = $("#modal"); let cur = 0, lastFocus;
let mImgs = [];
function openProject(i) {
  cur = (i + PO.length) % PO.length;
  const p = PO[cur], u = UI[lang], imgs = (p.images?.length ? p.images : (p.cover ? [p.cover] : [])).map(x => typeof x === "string" ? { src: x } : x);
  mImgs = imgs;
  const meta = [tr(p.type), p.year, tr(p.role) && `${u.role}: ${tr(p.role)}`].filter(Boolean).join(" · "), sec = (k, v) => v ? `<h4>${u[k]}</h4><p>${esc(tr(v))}</p>` : "";
  const body = $("#mBody"); body.innerHTML = `
    <div class="m-info"><h2>${esc(tr(p.title))}</h2><p class="kind">${esc(meta)}</p><p>${esc(tr(p.description))}</p>
      ${sec("task", p.task)}${sec("insight", p.insight)}${sec("solution", p.solution)}${sec("results", p.results)}</div>
    <div class="m-gallery">
      <div class="m-main">${imgs[0] ? `<img id="mMain" src="${esc(imgs[0].src)}" alt="${esc(tr(imgs[0].caption))}">` : `<div class="ph"></div>`}</div>
      <p class="cap" id="mCap">${esc(tr(imgs[0]?.caption))}</p>
      ${imgs.length > 1 ? `<div class="m-thumbs">${imgs.map((x, n) => `<button class="${n ? "" : "on"}" data-n="${n}" aria-label="${n + 1} / ${imgs.length}"><img src="${esc(x.src)}" alt=""></button>`).join("")}</div>` : ""}
    </div>`;
  $("#mCount").textContent = `${pad(cur + 1)} / ${pad(PO.length)}`;
  const l = $("#mLink"); l.hidden = !p.link; if (p.link) l.href = p.link;
  if (modal.hidden) { root.classList.add("modal-open"); lastFocus = document.activeElement; modal.hidden = false; requestAnimationFrame(() => modal.classList.add("open")); document.body.style.overflow = "hidden"; $("#mBack").focus(); }
  else { body.classList.remove("swap"); void body.offsetWidth; body.classList.add("swap"); }
}
function closeProject() {
  modal.classList.remove("open"); root.classList.remove("modal-open"); document.body.style.overflow = "";
  setTimeout(() => { modal.hidden = true; lastFocus?.focus(); }, 450);
}
$("#mBack").onclick = closeProject;
$("#mPrev").onclick = () => openProject(cur - 1);
$("#mNext").onclick = () => openProject(cur + 1);
$("#mBody").addEventListener("click", e => { const b = e.target.closest("[data-n]"); if (!b) return; const x = mImgs[+b.dataset.n], m = $("#mMain"); m.src = x.src; m.alt = tr(x.caption); $("#mCap").textContent = tr(x.caption); $$("#mBody [data-n]").forEach(t => t.classList.toggle("on", t === b)); });
addEventListener("keydown", e => {
  if (modal.hidden) return;
  if (e.key === "Escape") closeProject();
  if (e.key === "ArrowLeft") openProject(cur - 1);
  if (e.key === "ArrowRight") openProject(cur + 1);
});

/* ---- language ---- */
function applyLang(l) {
  lang = l; try { localStorage.setItem("lang", l); } catch (e) {}
  const t = S.text[l], u = UI[l];
  root.lang = l; root.dataset.lang = l;
  $$("[data-i]").forEach(e => e.innerHTML = u[e.dataset.i]);
  $("#lang").setAttribute("aria-label", u.lang); $("#mPrev").setAttribute("aria-label", u.prev); $("#mNext").setAttribute("aria-label", u.next);
  $("#pfEn").innerHTML = letters(u.pf1, 0) + letters(u.pf2, 1000, "ink"); $("h1.pf").setAttribute("aria-label", u.pf);
  $("#role").textContent = t.role; $("#intro").textContent = t.intro;
  $("#aboutText").textContent = t.about; $("#cta").textContent = t.cta;
  $("#spHello").textContent = `${u.hello} ${S.name}.`; $("#spRole").textContent = t.role;
  $("#skills").innerHTML = t.skills.map(s => `<li>${esc(s)}</li>`).join("");
  const r = $("#resume"), href = tr(S.resume); r.hidden = !href; if (href) { r.href = href; r.setAttribute("download", ""); }
  document.title = `${S.name} — ${t.role}`;
  renderBento(); if (!modal.hidden) openProject(cur);
}
$("#lang").onclick = () => applyLang(lang === "en" ? "ru" : "en");

/* ---- welcome screen: ~5 s, then fades out and the page starts ---- */
const splash = $("#splash"); let splashDone = false;
document.body.style.overflow = "hidden";
function endSplash() {
  if (splashDone) return; splashDone = true;
  splash.classList.add("gone"); if (modal.hidden) document.body.style.overflow = "";
  setTimeout(() => { root.classList.add("ready"); window.READY = performance.now(); }, RM ? 0 : 600);
}
setTimeout(endSplash, RM ? 300 : 4000); splash.addEventListener("click", endSplash);

/* ---- soft magnetic buttons + glass glare (desktop only) ---- */
if (matchMedia("(hover:hover)").matches) {
  addEventListener("pointermove", e => {
    if (scrollY < innerHeight) pfEl.style.setProperty("--gx", (e.clientX / innerWidth * 2 - 1).toFixed(2));
    const c = e.target.closest && e.target.closest(".glass");
    if (c) { const r = c.getBoundingClientRect(); c.style.setProperty("--mx", e.clientX - r.left + "px"); c.style.setProperty("--my", e.clientY - r.top + "px"); }
    if (RM) return;
    $$(".mag").forEach(b => {
      const r = b.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < Math.max(r.width, r.height) * .9) { b.style.transition = "transform .15s"; b.style.transform = `translate(${dx * .22}px,${dy * .22}px)`; }
      else if (b.style.transform) { b.style.transition = "transform .7s cubic-bezier(.2,.7,.2,1)"; b.style.transform = ""; }
    });
  });
}

/* ---- contact button: moves anywhere inside the whole panel ---- */
const cbox = $(".c-box"), cbtn = $("#mail");
if (cbox && matchMedia("(hover:hover)").matches && !RM) addEventListener("pointermove", e => {
  const r = cbox.getBoundingClientRect();
  if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
    const w = cbtn.offsetWidth, h = cbtn.offsetHeight, cx = r.left + cbox.clientLeft + cbtn.offsetLeft + w / 2, cy = r.top + cbox.clientTop + cbtn.offsetTop + h / 2;
    const x = Math.max(r.left + 14 - (cx - w / 2), Math.min(r.right - 14 - (cx + w / 2), (e.clientX - cx)));
    const y = Math.max(r.top + 14 - (cy - h / 2), Math.min(Math.min(r.bottom, $("#socIcons").getBoundingClientRect().top) - 14 - (cy + h / 2), (e.clientY - cy)));
    cbtn.dataset.on = 1; cbtn.style.transition = "transform .16s cubic-bezier(.2,.7,.2,1)"; cbtn.style.transform = `translate(${x}px,${y}px)`;
  } else if (cbtn.dataset.on) { delete cbtn.dataset.on; cbtn.style.transition = "transform .8s cubic-bezier(.2,.7,.2,1)"; cbtn.style.transform = ""; }
});

/* "scroll" hint hides while you scroll and returns at the top */
const pfEl = $("h1.pf");
const onScroll = () => { root.classList.toggle("scrolled", scrollY > 30); pfEl.style.setProperty("--s", Math.min(1, scrollY / (innerHeight * .6)).toFixed(3)); };
addEventListener("scroll", onScroll, { passive: true }); onScroll();
applyLang(lang);
