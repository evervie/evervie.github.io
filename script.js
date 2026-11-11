const S = window.SITE, P = window.PROJECTS || [], SP = window.SPECIAL || [];
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const root = document.documentElement;
const esc = t => String(t ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pad = n => String(n).padStart(2, "0");
const RM = matchMedia("(prefers-reduced-motion:reduce)").matches;
window.READY = 0;   // set when the welcome screen ends; the 3D flower starts opening then

/* ---- interface texts (edit freely) ---- */
const UI = {
  en: { nav_projects:"portfolio", nav_about:"about", nav_contact:"contact", h_projects:"selected <em>projects</em>", h_about:"about <span>me.</span>",
    sp_title:"special <em>cases</em>", sp_note:"Experimental work. This shelf keeps growing.", hello:"Hello! I’m",
    skills:"skills", tools:"tools", resume:"download resume", mail:"contact me", empty:"First projects are on the way.", touch:"Get in touch",
    back:"← back to portfolio", visit:"Visit website", menu:"Menu", mailhint:"100% chance I’ll read it :)", policy:"Privacy", pol_t:"Privacy policy", pol_close:"Close", pol_html:"<p>This site is a portfolio. There are no forms, no analytics and no advertising cookies.</p><ul><li>Your language choice is saved in your browser (localStorage) and is never sent anywhere.</li><li>To display the page, fonts from Google Fonts and the three.js library (cdnjs) are loaded. These services may see your IP address and browser data.</li><li>The site is hosted on GitHub Pages, which may keep technical visit logs under its own rules.</li><li>If you write to me by email or in a messenger, I use your message only to reply and never share it.</li><li>Links to other sites (Telegram, Instagram, Pinterest, GitHub, the EcoUtil website) lead to resources with their own policies.</li></ul><p>Questions? Just write to me.</p>", h_process:"my <span>process</span>", h_story:"my <span>story</span>", resume_soon:"PDF coming soon", task:"task", solution:"solution", site:"view website ↗", prev:"Previous project", next:"Next project", lang:"Switch language" },
  ru: { nav_projects:"портфолио", nav_about:"обо мне", nav_contact:"контакты", h_projects:"избранные <em>проекты</em>", h_about:"обо <span>мне.</span>",
    sp_title:"особые <em>кейсы</em>", sp_note:"Экспериментальные работы. Эта полка будет пополняться.", hello:"Привет! Я",
    skills:"навыки", tools:"инструменты", resume:"скачать резюме", mail:"связаться со мной", empty:"Первые проекты скоро появятся.", touch:"Написать мне",
    back:"← к портфолио", visit:"Перейти на сайт", menu:"Меню", mailhint:"100% шанс, что я прочитаю :)", policy:"Политика", pol_t:"Политика конфиденциальности", pol_close:"Закрыть", pol_html:"<p>Этот сайт — портфолио. На нём нет форм, аналитики и рекламных cookies.</p><ul><li>Выбранный язык интерфейса сохраняется в вашем браузере (localStorage) и никуда не отправляется.</li><li>Для отображения страницы загружаются шрифты Google Fonts и библиотека three.js (cdnjs). Эти сервисы могут видеть ваш IP-адрес и данные браузера.</li><li>Сайт размещён на GitHub Pages, который может вести технические журналы посещений по своим правилам.</li><li>Если вы пишете мне на почту или в мессенджер, я использую сообщение только для ответа и никому не передаю.</li><li>Ссылки на другие сайты (Telegram, Instagram, Pinterest, GitHub, сайт ЭкоУтиль) ведут на ресурсы со своими политиками.</li></ul><p>Есть вопросы — просто напишите мне.</p>", h_process:"мой <span>процесс</span>", h_story:"моя <span>история</span>", resume_soon:"PDF скоро появится", task:"задача", solution:"решение", site:"открыть сайт ↗", prev:"Предыдущий проект", next:"Следующий проект", lang:"Сменить язык" }
};
const UI2 = {
  en: { h_projects:"portfolio", p_eyebrow:"selected projects", p_sub:"my design & experience", hm1:"<b>2</b> complete projects in the portfolio", hm2:"<b>5</b> years in digital design", hbtn:"My work", f_all:"All projects", f_special:"Special cases", sp_big:"Special cases", sp_desc:"Experimental projects and unique concepts.", explore:"Explore", soon:"coming soon", scroll:"scroll to explore", made:"designed & built by me", pf:"Portfolio", pf1:"PORT", pf2:"folio", hi1:"Hello!", hi2:"I’m", role:"role", insight:"insight", results:"results" },
  ru: { h_projects:"портфолио", p_eyebrow:"избранные проекты", p_sub:"мой дизайн и опыт", hm1:"<b>2</b> полноценные работы в портфолио", hm2:"<b>5</b> лет в digital-дизайне", hbtn:"Мои работы", f_all:"Все проекты", f_special:"Особые кейсы", sp_big:"Особые кейсы", sp_desc:"Экспериментальные проекты и уникальные концепции.", explore:"Смотреть", soon:"скоро", scroll:"листайте вниз", made:"создано и разработано мной", pf:"Portfolio", pf1:"PORT", pf2:"folio", hi1:"Привет!", hi2:"Я", role:"роль", insight:"инсайт", results:"результат" }
};
Object.keys(UI2).forEach(l => Object.assign(UI[l], UI2[l]));
let lang; try { lang = localStorage.getItem("lang"); } catch (e) {}
if (!UI[lang]) {   /* first visit: Russian, Ukrainian, Belarusian (or a UA/BY region) -> RU; everything else -> EN */
  const sys = (navigator.languages && navigator.languages[0]) || navigator.language || "";
  lang = /^(ru|uk|be)(\b|$)/i.test(sys) || /[-_](UA|BY)$/i.test(sys) ? "ru" : "en";
}
const tr = v => v && typeof v === "object" ? (v[lang] ?? v.en ?? "") : (v ?? "");

/* ---- scroll reveal (things rise out of the dark) ---- */
const rvIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); rvIO.unobserve(e.target); } }), { threshold: .12 });
const rv = () => $$(".rv:not(.in)").forEach(e => rvIO.observe(e));

/* ---- static content ---- */
$("#logo").textContent = S.name + ".";
$("#tools").innerHTML = S.tools.map(s => `<span>${esc(s)}</span>`).join("");
$("#photo").innerHTML = S.photo ? `<img src="${esc(S.photo)}" alt="${esc(S.name)}">` : ""; $("#photo").hidden = !S.photo; $("#about").classList.toggle("no-photo", !S.photo);
const letters = (s, d, cls = "") => [...s].map((c, i) => `<span class="ch ${cls}"><span style="--d:${d + i * 70}ms">${c}</span></span>`).join("");


/* ---- icons (same thin style everywhere) ---- */
const IC = {
  github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
  telegram: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
  pinterest: '<circle cx="12" cy="12" r="10"/><path d="M9.2 20.6l2.2-9.1"/><path d="M8.6 12.4c-.7-2.9 1.2-5.3 4.1-5.3 2.4 0 3.9 1.6 3.9 3.7 0 2.7-1.5 4.5-3.5 4.5-.9 0-1.7-.5-2-1.2"/>',
  x: '<path d="M3 3h5.2l12.8 18h-5.2z"/><path d="M20.4 3.4 13.3 10.9M10.7 13.1 3.6 20.6"/>',
  email: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>'
};
const link = k => k === "email" ? "mailto:" + S.email : S.social[k];
const icons = (keys, mag) => keys.filter(link).map(k => `<a class="ico${mag ? " mag" : ""}${k === "email" ? " mail" : ""}" href="${esc(link(k))}"${k === "email" ? "" : ' target="_blank" rel="noopener"'} aria-label="${k[0].toUpperCase() + k.slice(1)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${IC[k]}</svg>${k === "email" ? '<span class="mh" data-i="mailhint"></span>' : ""}</a>`).join("");
$("#topSoc").innerHTML = icons(["github", "telegram"]);
$("#socIcons").innerHTML = icons(["telegram", "instagram", "pinterest", "github", "x", "email"], true);

/* ---- projects: classic card grid + filter by tag ---- */
const PO = P.filter(p => !p.soon);
const tkey = t => String(typeof t === "object" ? t.en : t).toLowerCase();
let flt = "all";
const FL = window.FILTERS || [];
const filters = () => [{ k: "all", l: UI[lang].f_all }, ...FL.map(f => ({ k: f.k, l: tr(f.l) }))];
let fOpen = false;
const tagsHTML = p => (p.tags || []).length ? `<ul class="tags">${p.tags.slice(0, 3).map(t => `<li>${esc(tr(t))}</li>`).join("")}</ul>` : "";
const mockHTML = (p, lg) => { const m = p.mock; return `<div class="mock${lg ? " lg" : ""}"><div class="mk-bar"><i></i><i></i><i></i><span>${esc(m.url)}</span></div><div class="mk-body"><b class="mk-name">${esc(m.name)}</b></div></div>`; };
function renderGrid() {
  const u = UI[lang], fl = filters(); if (!fl.find(f => f.k === flt)) flt = "all";
  const L = P.filter(p => flt === "all" || (p.cats || []).includes(flt));
  $("#filters").hidden = fl.length < 2;
  $("#filters").innerHTML = `<button class="burger" aria-haspopup="true" aria-expanded="${fOpen}" aria-label="${lang === "ru" ? "Категории" : "Categories"}"><span class="bl"><i></i><i></i><i></i></span><span>${esc(fl.find(f => f.k === flt).l)}</span></button><div class="fmenu"${fOpen ? "" : " hidden"}>${fl.map(f => `<button class="fp${f.k === flt ? " on" : ""}" data-f="${esc(f.k)}">${esc(f.l)}</button>`).join("")}</div>`;
  $("#grid").innerHTML = L.map((p, i) => {
    const n = pad(i + 1), meta = [tr(p.type), p.year].filter(Boolean).join(" · "), o = PO.indexOf(p);
    const tag = p.soon ? "div" : "a", attr = p.soon ? "" : ` href="#project-${o + 1}" data-o="${o}"`;
    return `<${tag} class="card rv${p.soon ? " soon" : ""}"${attr}><div class="thumb"><div class="art${p.cover || p.mock ? " has" : ""}" style="--a:${i * 70}deg">${p.cover ? `<img src="${esc(p.cover)}" alt="" loading="lazy">` : p.mock ? mockHTML(p) : ""}</div><span class="num">${n}</span>${p.badge ? `<span class="badge">${esc(tr(p.badge))}</span>` : ""}<span class="go2">${p.soon ? u.soon : "↗"}</span></div><div class="meta"><h3>${esc(tr(p.title))}</h3><small>${esc(meta)}</small></div>${tagsHTML(p)}</${tag}>`;
  }).join("");
  rv();
}
$("#filters").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.classList.contains("burger")) { fOpen = !fOpen; b.setAttribute("aria-expanded", fOpen); $(".fmenu").hidden = !fOpen; }
  else if (b.dataset.f) { flt = b.dataset.f; fOpen = false; renderGrid(); }
});
const closeMenu = () => { if (!fOpen) return; fOpen = false; const m = $(".fmenu"); if (m) m.hidden = true; const b = $(".burger"); if (b) b.setAttribute("aria-expanded", "false"); };
document.addEventListener("click", e => { if (!e.target.closest("#filters")) closeMenu(); });
addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
$("#grid").addEventListener("click", e => { const c = e.target.closest(".card"); if (!c) return; e.preventDefault(); if (c.dataset.o) openProject(+c.dataset.o); });

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
      ${p.badge ? `<p class="badge-in">${esc(tr(p.badge))}</p>` : ""}${tagsHTML(p)}${sec("task", p.task)}${sec("insight", p.insight)}${sec("solution", p.solution)}${sec("results", p.results)}</div>
    <div class="m-gallery">
      <div class="m-main">${imgs[0] ? `<img id="mMain" src="${esc(imgs[0].src)}" alt="${esc(tr(imgs[0].caption))}">` : p.mock ? mockHTML(p, true) : `<div class="ph"></div>`}</div>
      ${p.link ? `<a class="btn m-visit" href="${esc(p.link)}" target="_blank" rel="noopener"><span>${u.visit}</span><i aria-hidden="true">↗</i></a>` : ""}
      <p class="cap" id="mCap">${esc(tr(imgs[0]?.caption))}</p>
      ${imgs.length > 1 ? `<div class="m-thumbs">${imgs.map((x, n) => `<button class="${n ? "" : "on"}" data-n="${n}" aria-label="${n + 1} / ${imgs.length}"><img src="${esc(x.src)}" alt=""></button>`).join("")}</div>` : ""}
    </div>`;
  $("#mCount").textContent = `${pad(cur + 1)} / ${pad(PO.length)}`;
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
  $("#lang").setAttribute("aria-label", u.lang); $("#langM").setAttribute("aria-label", u.lang); $("#burger").setAttribute("aria-label", u.menu); $("#mPrev").setAttribute("aria-label", u.prev); $("#mNext").setAttribute("aria-label", u.next);
  $("#pfEn").innerHTML = `<span class="l1">${u.pf1}</span><span class="l2">${u.pf2}.</span>`; dispatchEvent(new Event("pflayout")); $("h1.pf").setAttribute("aria-label", u.pf);
  $("#role").textContent = t.role;
  $("#cta").textContent = t.cta;
  $("#spHello").innerHTML = `${u.hi1}<br>${u.hi2} ${esc(S.name)}.`;
  $("#skills").innerHTML = t.skills.map(s => `<li>${esc(s)}</li>`).join("");
  const r = $("#resume"), href = tr(S.resume);
  r.classList.toggle("off", !href); $("#resumeNote").textContent = href ? "" : u.resume_soon;
  if (href) { r.href = href; r.setAttribute("download", ""); r.removeAttribute("aria-disabled"); } else { r.removeAttribute("href"); r.removeAttribute("download"); r.setAttribute("aria-disabled", "true"); }
  $("#steps").innerHTML = (t.process || []).map((x, i) => `<li><span class="sn">${pad(i + 1)}</span><div><b>${esc(x.t)}</b><p>${esc(x.d)}</p></div></li>`).join("");
  $("#story").innerHTML = (t.story || []).map(x => `<li><time>${esc(x.y)}</time><p>${esc(x.t)}</p></li>`).join("");
  $("#foot").innerHTML = `<span class="fl">© 2026 ${esc(S.name)} <em>Creative Coder</em></span><i></i><a class="made" href="https://github.com/evervie" target="_blank" rel="noopener">${u.made}</a><i></i><button class="pol-link" type="button">${u.policy}</button>`;
  $("#polT").textContent = u.pol_t; $("#polBody").innerHTML = u.pol_html; $("#polX").setAttribute("aria-label", u.pol_close);
  const m = $("#mail"); m.href = lang === "ru" ? S.social.telegram : S.social.instagram; m.target = "_blank"; m.rel = "noopener";
  document.title = `${S.name} — ${t.role}`;
  renderGrid(); if (!modal.hidden) openProject(cur);
}
$("#lang").onclick = $("#langM").onclick = () => applyLang(lang === "en" ? "ru" : "en");

/* ---- welcome screen: ~5 s, then fades out and the page starts ---- */
const splash = $("#splash"); let splashDone = false;
document.body.style.overflow = "hidden";
function endSplash() {
  if (splashDone) return; splashDone = true;
  splash.classList.add("gone"); if (modal.hidden) document.body.style.overflow = "";
  setTimeout(() => { root.classList.add("ready"); window.READY = performance.now(); }, RM ? 0 : 600);
}
const showSplash = () => splash.classList.add("go");
(document.fonts ? document.fonts.ready : Promise.resolve()).then(showSplash); setTimeout(showSplash, 1500);
setTimeout(endSplash, RM ? 300 : 4800); splash.addEventListener("click", endSplash);

/* ---- soft magnetic buttons + glass glare (desktop only) ---- */
let lit = null;
document.addEventListener("mouseleave", () => { if (lit) { lit.classList.remove("lit"); lit = null; } });
if (matchMedia("(hover:hover)").matches) {
  addEventListener("pointermove", e => {
    if (scrollY < innerHeight) pfEl.style.setProperty("--gx", (e.clientX / innerWidth * 2 - 1).toFixed(2));
    const c = e.target.closest && e.target.closest(".glass");
    if (lit && lit !== c) lit.classList.remove("lit"); lit = c || null; if (c) c.classList.add("lit");
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
  if (e.target.closest && e.target.closest(".ico")) return;   /* over the social icons the button stays put */
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
const onScroll = () => { root.classList.toggle("scrolled", scrollY > 30); pfEl.style.setProperty("--s", Math.min(1, scrollY / (innerHeight * .6)).toFixed(3)); root.style.setProperty("--bs", Math.min(1, scrollY / (innerHeight * .3)).toFixed(3)); };
addEventListener("scroll", onScroll, { passive: true }); onScroll();
applyLang(lang);

$("#resume").addEventListener("click", e => { if (e.currentTarget.getAttribute("aria-disabled") === "true") e.preventDefault(); });

/* ---- privacy policy: small glass dialog ---- */
const pol = $("#pol"); let polFocus;
function openPol() { polFocus = document.activeElement; pol.hidden = false; requestAnimationFrame(() => pol.classList.add("open")); $("#polX").focus(); }
function closePol() { pol.classList.remove("open"); setTimeout(() => { pol.hidden = true; polFocus?.focus(); }, 350); }
$("#foot").addEventListener("click", e => { if (e.target.closest(".pol-link")) openPol(); });
$("#polX").onclick = closePol;
pol.addEventListener("click", e => { if (e.target === pol) closePol(); });
addEventListener("keydown", e => { if (e.key === "Escape" && !pol.hidden) closePol(); });

/* ---- mobile menu: glass side panel ---- */
const mnav = $("#mnav"), burger = $("#burger"), wide = matchMedia("(min-width:861px)");
function setMenu(on) {
  root.classList.toggle("menu-open", on); burger.setAttribute("aria-expanded", on); mnav.inert = !on;
  if (on) mnav.querySelector("a").focus(); else if (root.dataset.menuFocus) burger.focus();
  root.dataset.menuFocus = on ? "1" : "";
}
burger.onclick = () => setMenu(!root.classList.contains("menu-open"));
$("#mnavBg").onclick = () => setMenu(false);
mnav.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
addEventListener("keydown", e => { if (e.key === "Escape" && root.classList.contains("menu-open")) setMenu(false); });
wide.addEventListener("change", e => { if (e.matches) setMenu(false); });
