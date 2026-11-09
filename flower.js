/* Glass world (Three.js r128). Background canvas (#bg3d): hero flower (anchored to the first screen, also on the project page) (waves removed: About now uses a CSS frosted gradient).
   Two small canvases above the page: bottom-left star sigil (#sigil) and the cursor star (#mini). Tweak: surf() = petal shape, SCROLL_CLOSE = how fast the flower closes on scroll. */
(() => {
  const root = document.documentElement, $ = id => document.getElementById(id);
  const RM = matchMedia("(prefers-reduced-motion:reduce)").matches, touch = matchMedia("(hover:none)").matches;
  if (!window.THREE) { root.classList.add("nogl"); return; }
  const LOW = (navigator.hardwareConcurrency || 8) <= 4 || innerWidth < 700 || (navigator.deviceMemory || 8) <= 4 || !!(navigator.connection && navigator.connection.saveData);
  const L = (a, b, t) => a + (b - a) * t, cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), ez = t => t * t * (3 - 2 * t);
  const wrap = a => ((a + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
  const curve = (P, f) => { for (let i = 1; i < P.length; i++) if (f <= P[i][0]) { const a = P[i - 1], b = P[i]; return L(a[1], b[1], ez(cl((f - a[0]) / (b[0] - a[0])))); } return P[P.length - 1][1]; };

  /* ---- materials: nearly colourless glass + a thin-film rainbow overlay; violet only when "activated" (uniform v) ---- */
  const glass = op => new THREE.MeshPhysicalMaterial({ color: 0xf4f5ff, metalness: .05, roughness: .03, clearcoat: 1, clearcoatRoughness: .03, transparent: true, opacity: op, envMapIntensity: 2.2, side: THREE.DoubleSide, depthWrite: false });
  const VS = "varying vec3 n,w;void main(){n=normalize(normalMatrix*normal);vec4 q=modelViewMatrix*vec4(position,1.);w=-q.xyz;gl_Position=projectionMatrix*q;}";
  const FS = "uniform float t,k,v;varying vec3 n,w;void main(){float f=1.-abs(dot(normalize(n),normalize(w)));float h=f*1.5+n.y*.4+t;vec3 r=vec3(.62,.6,.95)+vec3(.36,.3,.16)*cos(6.2832*(h+vec3(0.,.2,.5)));r=mix(vec3(.92,.94,1.),r,.65);float a=(.04+.5*pow(f,1.7))*k;vec3 c=mix(r,vec3(.56,.32,1.),v*(.35+.5*f));gl_FragColor=vec4(c,a+v*.22*k*(.3+f));}";
  const irid = (k, t0) => new THREE.ShaderMaterial({ uniforms: { t: { value: t0 || 0 }, k: { value: k }, v: { value: 0 } }, transparent: true, depthWrite: false, side: THREE.DoubleSide, vertexShader: VS, fragmentShader: FS });
  const radial = (c0, c1) => { const c = document.createElement("canvas"); c.width = c.height = 64; const x = c.getContext("2d"), r = x.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, c0); r.addColorStop(1, c1); x.fillStyle = r; x.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); };
  function env(R, pink) {
    const es = new THREE.Scene();
    es.add(new THREE.Mesh(new THREE.SphereGeometry(20, 16, 16), new THREE.MeshBasicMaterial({ color: 0x08080e, side: THREE.BackSide })));
    [[0xffffff, 0, 8, 4, 8, 3], [0xb9a6ff, -8, 2, 2, 3, 8], [0x8fd3ff, 8, -2, 3, 3, 8], [0xffb8e6, 4, -6, 3, 6, 2], [0xffffff, 0, -8, 0, 10, 2]].filter((a, i) => pink || i !== 3).forEach(a => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(a[4], a[5]), new THREE.MeshBasicMaterial({ color: new THREE.Color(a[0]).multiplyScalar(6), side: THREE.DoubleSide }));
      m.position.set(a[1], a[2], a[3]); m.lookAt(0, 0, 0); es.add(m);
    });
    return new THREE.PMREMGenerator(R).fromScene(es, .04).texture;
  }

  /* ---- hero flower: wide oval petals ---- */
  function surf(u, v) {
    const s = Math.pow(u, .85), w = Math.sqrt(Math.max(0, 1 - (2 * s - 1) ** 2));
    return [v * .62 * w, u * 1.9, .3 - .5 * u * u - .35 * v * v * w + .05 * Math.sin(u * 11) * Math.abs(v) * w];
  }
  function petalGeo() {
    const nu = 28, nv = 14, pos = [], idx = [];
    for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) pos.push(...surf(i / nu, j / nv * 2 - 1));
    for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { const a = i * (nv + 1) + j, b = a + 1, c = a + nv + 1, d = c + 1; idx.push(a, b, c, b, d, c); }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
  }
  function stamens(n, r) {
    const g = new THREE.Group(), p = [], m = new THREE.Matrix4();
    const tips = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshBasicMaterial({ color: 0xfff1e6 }), n); tips.frustumCulled = false;
    for (let i = 0; i < n; i++) {
      const a = i * 2.39996, s = Math.sqrt((i + .5) / n), h = .3 + .3 * (1 - s) + .08 * ((i * 7) % 5) / 5, x = Math.cos(a) * s * r, z = Math.sin(a) * s * r;
      p.push(0, 0, 0, x * .35, h * .5, z * .35, x * .35, h * .5, z * .35, x, h, z); m.makeScale(.03, .03, .03).setPosition(x, h, z); tips.setMatrixAt(i, m);
    }
    g.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(p, 3)), new THREE.LineBasicMaterial({ color: 0xfff1e6, transparent: true, opacity: .4 })), tips); return g;
  }
  function veinGeo() { /* very faint edge + centre vein */
    const p = [];
    [-1, 0, 1].forEach(v => { for (let i = 0; i < 40; i++) p.push(...surf(i / 40, v), ...surf((i + 1) / 40, v)); });
    return new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
  }
  function makeFlower(rings, sn, sr) { /* ring: [petals, scale, yaw offset, max open angle, open delay] */
    const fl = new THREE.Group(), sg = new THREE.Group(); fl.add(sg);
    const gm = new THREE.MeshPhysicalMaterial({ color: 0xe6e8ff, metalness: .1, roughness: .05, clearcoat: 1, clearcoatRoughness: .05, transparent: true, opacity: .22, envMapIntensity: 2, side: THREE.DoubleSide, depthWrite: false });
    const lm = new THREE.LineBasicMaterial({ color: 0xdfe6ff, transparent: true, opacity: .14, depthWrite: false });
    const pg = petalGeo(), vg = veinGeo(), petals = [];
    rings.forEach(([n, sc, off, mul, lag], r) => { for (let i = 0; i < n; i++) {
      const v = new THREE.Group(), m = new THREE.Mesh(pg, gm), k = .85 + .3 * (((i * 7 + r * 3) % 5) / 4);
      v.rotation.y = i / n * Math.PI * 2 + off; m.scale.set(sc * k * (.9 + .2 * ((i * 3) % 4) / 3), sc * k, sc); m.add(new THREE.LineSegments(vg, lm)); v.add(m); sg.add(v);
      petals.push({ v, m, b: v.rotation.y, i, mul, lag, roll: Math.sin(i * 2.7 + r) * .15 });
    } });
    const st = stamens(sn, sr); sg.add(st); return { fl, sg, petals, st };
  }
  function pose(F, o, t, wob) {
    F.petals.forEach(p => { const k = ez(cl(o * 1.25 - p.lag)); p.m.rotation.x = .12 + k * p.mul + Math.sin(t * .8 + p.i * 1.3) * .03 * k; p.m.rotation.z = p.roll * k; p.v.rotation.y = p.b + Math.sin(t * .5 + p.i * 1.3) * .5 * wob; });
  }
  /* ---- pollen: a few slow, twinkling specks around the open flower ---- */
  function pollen(n) {
    const g = new THREE.BufferGeometry(), P = new Float32Array(n * 3), A = new Float32Array(n), Z = new Float32Array(n), D = [];
    for (let i = 0; i < n; i++) { D.push({ life: 1, max: 5 + Math.random() * 4, ph: Math.random() * 6, v: [0, 0, 0] }); Z[i] = 3 + Math.random() * 4; }
    g.setAttribute("position", new THREE.BufferAttribute(P, 3)); g.setAttribute("a", new THREE.BufferAttribute(A, 1)); g.setAttribute("s", new THREE.BufferAttribute(Z, 1));
    const m = new THREE.ShaderMaterial({ uniforms: { px: { value: 1 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: "attribute float a,s;varying float va;uniform float px;void main(){va=a;vec4 q=modelViewMatrix*vec4(position,1.);gl_PointSize=s*px*7./-q.z;gl_Position=projectionMatrix*q;}",
      fragmentShader: "varying float va;void main(){float f=smoothstep(.5,0.,length(gl_PointCoord-.5));gl_FragColor=vec4(.95,.9,1.,f*va);}" });
    const pts = new THREE.Points(g, m); pts.frustumCulled = false; return { pts, g, P, A, D, n, m };
  }
  function pollenStep(po, dt, t, cx, cy, sp, open, fade) {
    for (let i = 0; i < po.n; i++) {
      const d = po.D[i]; d.life += dt / d.max;
      if (d.life >= 1) {
        po.A[i] = 0; if (open < .2 || Math.random() > dt * 1.2) continue;
        d.life = 0; const a = Math.random() * 6.283, r = .15 + Math.random() * .35 * sp, s = .05 + Math.random() * .1;
        po.P[i * 3] = cx + Math.cos(a) * r; po.P[i * 3 + 1] = cy + Math.sin(a) * r * .8; po.P[i * 3 + 2] = (Math.random() - .4) * .8; d.v = [Math.cos(a) * s, Math.sin(a) * s * .8 + .03, (Math.random() - .5) * .04];
      }
      po.P[i * 3] += d.v[0] * dt * 3 + Math.sin(t * .6 + d.ph) * dt * .03; po.P[i * 3 + 1] += d.v[1] * dt * 3; po.P[i * 3 + 2] += d.v[2] * dt * 3;
      po.A[i] = Math.max(0, Math.sin(d.life * Math.PI) * (.45 + .55 * Math.sin(t * 3 + d.ph))) * (.3 + .7 * open) * fade * .55;
    }
    po.g.attributes.position.needsUpdate = true; po.g.attributes.a.needsUpdate = true;
  }
  /* ---- corner sigil: eight-point glass star, needle, helix ribbon, sparkles ---- */
  function starGeo(n, ro, ri, longEvery, depth) {
    const s = new THREE.Shape();
    for (let i = 0; i < n * 2; i++) { const a = i * Math.PI / n + Math.PI / 2, r = i % 2 ? ri : (longEvery && i % longEvery ? ro * .6 : ro); i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: depth * .5, bevelSize: ri * .12, bevelSegments: 3 }); g.translate(0, 0, -depth / 2); return g;
  }
  function ribbonGeo() {
    const nu = 90, pos = [], idx = [];
    for (let i = 0; i <= nu; i++) { const t = i / nu, a = -2.4 + t * 5.6, y = (t - .5) * 3; for (const w of [-1, 1]) pos.push(Math.sin(a) * 1.45, y + w * .13, Math.cos(a) * 1.45); }
    for (let i = 0; i < nu; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
  }
  function makeSigil(opt) {
    const grp = new THREE.Group(), core = new THREE.Group(), ribG = new THREE.Group(), spk = new THREE.Group(), ims = [];
    const mk = (g, op, k, v) => { const m = new THREE.Mesh(g, glass(op)), im = irid(k, .05); im.uniforms.v.value = v || 0; ims.push(im); m.add(new THREE.Mesh(g, im)); return m; };
    core.add(mk(starGeo(8, 1.25, .26, 4, .16), .36, 1.6, .15));
    const cone = new THREE.ConeGeometry(.055, .75, 10), up = mk(cone, .4, 1.4), dn = mk(cone, .4, 1.4); up.position.y = 1.55; dn.position.y = -1.55; dn.rotation.z = Math.PI; core.add(up, dn);
    const dia = new THREE.Mesh(new THREE.OctahedronGeometry(.17), new THREE.MeshBasicMaterial({ color: 0xffffff })); dia.scale.y = 1.5; core.add(dia);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: radial("rgba(200,180,255,.95)", "rgba(200,180,255,0)"), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); glow.scale.setScalar(1.7); core.add(glow);
    if (opt.ribbon) ribG.add(mk(ribbonGeo(), .32, 1.5, .2));
    const sp = starGeo(4, .27, .05, 0, .05);
    [[-1.3, .95], [1.4, 1], [-1.35, -.9], [1.25, -1.15]].forEach(([x, y], i) => { const m = new THREE.Mesh(sp, new THREE.MeshBasicMaterial({ color: 0xe9e2ff })); m.position.set(x, y, i % 2 ? .3 : -.3); spk.add(m); });
    grp.add(core, ribG, spk); grp.scale.setScalar(opt.scale); return { grp, core, ribG, spk, glow, ims };
  }
  function animSigil(o, tt, shift, calm) {
    o.core.rotation.y = calm ? Math.sin(tt * .6) * .3 : tt * .35; o.ribG.rotation.y = -tt * .25; o.spk.rotation.z = tt * (calm ? .04 : .1);
    o.spk.children.forEach((s, i) => s.scale.setScalar(calm ? .9 + .15 * Math.sin(tt * 1.4 + i * 1.7) : .75 + .45 * Math.sin(tt * 2 + i * 1.7))); o.glow.scale.setScalar(1.7 + Math.sin(tt * 1.6) * .15);
    o.ims.forEach(im => { im.uniforms.t.value = tt * .02 + shift; });
  }

  window.GLX = { glass, irid, env, starGeo, ez, cl, L, LOW, RM, touch };
  /* ---- setup ---- */
  let R, C, S1, F, po, SG = null, ST = null;
  const mouse = { x: 0, y: 0 }; let tx = 0, ty = 0, seen = false, hot = false;
  const SCROLL_CLOSE = .6, HH = Math.tan(17.5 * Math.PI / 180) * 7, heroEl = document.querySelector(".hero");
  try {
    R = new THREE.WebGLRenderer({ canvas: $("bg3d"), antialias: !LOW, alpha: true }); R.setPixelRatio(Math.min(devicePixelRatio, LOW ? 1.1 : 1.5)); R.autoClear = false;
    C = new THREE.PerspectiveCamera(35, 1, .1, 50); C.position.z = 7;
    S1 = new THREE.Scene(); S1.environment = env(R, false);
    F = makeFlower([[7, 1, 0, 1.35, 0], [6, .85, .45, 1.05, .12], [5, .62, .2, .7, .24]], 45, .3); F.fl.rotation.order = "YXZ"; S1.add(F.fl);
    po = pollen(LOW ? 14 : 26); po.m.uniforms.px.value = R.getPixelRatio(); S1.add(po.pts);
  } catch (e) { root.classList.add("nogl"); return; }
  /* two small canvases that sit ABOVE the page: the bottom-left sigil and the cursor star (no ribbon) */
  function overlay(canvas, fov, z, size, opt) {
    const R2 = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); R2.setPixelRatio(Math.min(devicePixelRatio, 1.75)); R2.setSize(size, size, false);
    const c = new THREE.PerspectiveCamera(fov, 1, .1, 50); c.position.z = z; const s = new THREE.Scene(); s.environment = env(R2, true);
    const o = makeSigil(opt); s.add(o.grp); return { R: R2, C: c, S: s, o };
  }
  const miniEl = $("mini"), csz = () => innerWidth < 700 ? 96 : 150;
  try { SG = overlay($("sigil"), 35, 7, csz(), { ribbon: true, scale: .82 }); } catch (e) { SG = null; }
  if (!touch && !RM) try { ST = overlay(miniEl, 30, 6, 150, { ribbon: false, scale: .5 }); } catch (e) { ST = null; }
  let fx0 = 0, fy0 = 0, fs0 = 1;
  function layout(w, h) { const asp = w / h; if (asp < .85) { fs0 = .7; fx0 = 0; fy0 = 1.1; } else { fs0 = cl(asp / 1.55, .65, 1.2); fx0 = Math.max(0, HH * asp - 1.8 * fs0); fy0 = 0; } }
  function size() { R.setSize(innerWidth, innerHeight, false); if (SG) SG.R.setSize(csz(), csz(), false); }
  function view(x, y, w, h, S) { C.aspect = w / h; C.updateProjectionMatrix(); R.setViewport(x, y, w, h); R.setScissor(x, y, w, h); R.clearDepth(); R.render(S, C); }
  size(); addEventListener("resize", size);

  const ang = { x: 0, y: 0, z: 0 }, av = { x: 0, y: 0, z: 0 }; let px = 0, py = 0, speed = 0, lx = null, ly = null, shift = 0;
  addEventListener("pointermove", e => {
    mouse.x = e.clientX / innerWidth * 2 - 1; mouse.y = e.clientY / innerHeight * 2 - 1; tx = e.clientX; ty = e.clientY;
    if (!seen) { seen = true; px = tx; py = ty; } if (ST) miniEl.style.opacity = 1;
    if (lx !== null) speed = Math.max(speed, Math.hypot(tx - lx, ty - ly)); lx = tx; ly = ty;
    hot = !!(e.target.closest && e.target.closest("a,button,.bc,input,textarea"));
  });
  root.addEventListener("mouseleave", () => { if (ST) miniEl.style.opacity = 0; lx = null; });
  addEventListener("blur", () => { if (ST) miniEl.style.opacity = 0; });

  /* ---- loop ---- */
  let open = 0, wv = 0, last = performance.now(); const T0 = last;
  (function frame(now) {
    requestAnimationFrame(frame); if (document.hidden) { last = now; return; }
    const t = (now - T0) / 1000, dt = Math.min(.05, (now - last) / 1000), tt = RM ? 0 : t; last = now;
    const mo = root.classList.contains("modal-open"), hr = heroEl.getBoundingClientRect();
    const started = !!window.READY, since = started ? (now - window.READY) / 1000 : 0, intro = RM ? 1 : started ? ez(cl((since - .2) / 2.6)) : 0;
    /* hero flower lives in the first screen: open at the top, closes into a bud while you scroll; shown open on the project page */
    const gone = mo ? 0 : ez(cl(scrollY / (innerHeight * SCROLL_CLOSE)));
    open += (Math.min(intro, 1 - gone) - open) * (RM ? 1 : .05);
    const vx = mo ? 0 : hr.left, vw = mo ? innerWidth : hr.width, vh = mo ? innerHeight : hr.height, top = mo ? 0 : hr.top, vy = innerHeight - top - vh;
    layout(vw, vh);
    pose(F, open, tt, 0); F.st.scale.setScalar(.35 + .65 * ez(open));
    F.sg.rotation.y = RM ? 0 : tt * .04 + Math.sin(tt * .2) * .35;
    F.fl.rotation.y = -.85 + Math.sin(tt * .17) * .08 - mouse.x * .08;
    F.fl.rotation.x = L(.55, 1, open) + Math.sin(tt * .3) * .04 + mouse.y * .06; F.fl.rotation.z = Math.sin(tt * .22) * .05;
    F.fl.position.set(fx0, fy0 + Math.sin(tt * .5) * .06, 0); F.fl.scale.setScalar(fs0);
    if (!RM && (mo || hr.bottom > 0)) pollenStep(po, dt, t, fx0, fy0, fs0, open, 1);   /* subtle, only while the hero is on screen */

    R.setScissorTest(false); R.clear(); R.setScissorTest(true);
    if (mo || (hr.bottom > 0 && hr.top < innerHeight)) view(vx, vy, vw, vh, S1);
    R.setScissorTest(false);

    if (SG) { animSigil(SG.o, tt, mouse.x * .1); SG.o.grp.rotation.set(.22 + mouse.y * .2 + Math.sin(tt * .3) * .08, 0, 0); SG.R.render(SG.S, SG.C); }
    if (ST && seen) {   /* cursor star: soft follow, gentle tilt toward the direction of movement */
      const dx = tx - px, dy = ty - py; px += dx * .12; py += dy * .12; speed *= .9; shift += speed * .003 + dx * .00015;
      miniEl.style.transform = `translate(${px}px,${py}px)`;
      av.y += (cl(dx * .012, -.6, .6) - av.y) * .06; av.x += (cl(-dy * .012, -.6, .6) - av.x) * .06; ang.z += .003 + cl(dx * .00006, -.004, .004);
      ST.o.grp.rotation.set(av.x, av.y, ang.z); ST.o.grp.scale.setScalar(L(ST.o.grp.scale.x, hot ? .58 : .5, .08));
      animSigil(ST.o, tt, shift, true); ST.o.ims.forEach(im => { im.uniforms.v.value += ((hot ? .5 : 0) - im.uniforms.v.value) * .1; });
      ST.R.render(ST.S, ST.C);
    }
  })(performance.now());
})();
