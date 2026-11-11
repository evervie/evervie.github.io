/* Extra glass pieces (Three.js r128; needs flower.js first):
   1) welcome screen: a big spinning glass star over the greeting (#spStar)
   2) first screen: PORTfolio as 3D iridescent glass letters (#pf3d)
   3) bottom of the page: crystal tulips swaying in the wind (#garden)
   Each piece is independent: if one fails, the page still works. */
(() => {
  const G = window.GLX, root = document.documentElement, $ = id => document.getElementById(id);
  if (!G || !window.THREE) { root.classList.add("nostar"); return; }
  const { glass, irid, env, starGeo, ez, cl, L, LOW, RM, touch } = G;
  const DPR = Math.min(devicePixelRatio || 1, LOW ? 1.25 : 2);
  const loops = [];                       // [fn(now)] run in one rAF
  (function tick(now) { requestAnimationFrame(tick); for (const f of loops) f(now); })(performance.now());

  /* ================= 1) welcome star ================= */
  try {
    const cv = $("spStar"), splash = $("splash");
    const R = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
    R.setPixelRatio(DPR);
    const C = new THREE.PerspectiveCamera(32, 1, .1, 50); C.position.z = 7.5;
    const S = new THREE.Scene(); S.environment = env(R, true);
    const g = starGeo(8, 1.4, .5, 4, .55);
    const star = new THREE.Mesh(g, glass(.14)), film = irid(1.9, .08); film.uniforms.v.value = .12;
    star.add(new THREE.Mesh(g, film));
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(.1), new THREE.MeshBasicMaterial({ color: 0xffffff })); core.scale.y = 1.6; star.add(core);
    const grp = new THREE.Group(); grp.add(star); S.add(grp);
    const sp = starGeo(4, .3, .05, 0, .05), spk = [];
    [[-1.7, 1.2], [1.8, -1.0], [1.5, 1.5], [-1.5, -1.4]].forEach(([x, y], i) => { const m = new THREE.Mesh(sp, new THREE.MeshBasicMaterial({ color: 0xece6ff })); m.position.set(x, y, 0); S.add(m); spk.push(m); });
    const fit = () => { const w = cv.clientWidth || 400; R.setSize(w, w, false); }; fit(); addEventListener("resize", fit);
    const t0 = performance.now(); let alive = true, goneAt = 0;
    loops.push(function (now) {
      if (!alive) return;
      if (splash.classList.contains("gone")) { goneAt = goneAt || now; if (now - goneAt > 2600) { alive = false; R.dispose(); return; } }   /* keep spinning while the screen fades out */
      const t = RM ? 0 : (now - t0) / 1000;
      star.rotation.y = t * 1.05; star.rotation.x = .3 + Math.sin(t * .6) * .25; star.rotation.z = Math.sin(t * .4) * .18;
      film.uniforms.t.value = t * .05; film.uniforms.v.value = .12 + .1 * Math.sin(t * .8);
      spk.forEach((m, i) => { m.scale.setScalar(.7 + .5 * Math.sin(t * 2 + i * 1.7)); m.rotation.z = t * .3; });
      R.render(S, C);
    });
  } catch (e) { root.classList.add("nostar"); }

  /* ================= 2) glass letters ================= */
  try {
    const cv = $("pf3d"), h1 = document.querySelector("h1.pf"), hero = document.querySelector(".hero");
    const R = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: false });
    R.setPixelRatio(1);
    const mask = document.createElement("canvas"), tex = new THREE.CanvasTexture(mask);
    tex.minFilter = tex.magFilter = THREE.LinearFilter; tex.generateMipmaps = false;
    const U = { tM: { value: tex }, px: { value: new THREE.Vector2(1, 1) }, R: { value: 6 }, t: { value: 0 }, reveal: { value: 0 }, tx: { value: 0 }, ty: { value: 0 } };
    const mat = new THREE.ShaderMaterial({
      uniforms: U, defines: { NT: LOW ? 8 : 12 }, transparent: false, depthTest: false, depthWrite: false, blending: THREE.NoBlending,
      vertexShader: "varying vec2 vUv;void main(){vUv=position.xy*.5+.5;gl_Position=vec4(position.xy,0.,1.);}",
      fragmentShader: `
        uniform sampler2D tM; uniform vec2 px; uniform float R,t,reveal,tx,ty; varying vec2 vUv;
        const float TAU=6.2831853;
        float m(vec2 p){return texture2D(tM,p).a;}
        void main(){
          vec2 uv=vUv; float m0=m(uv);
          if(m0<.003){gl_FragColor=vec4(0.);return;}
          float h=0.; vec2 g=vec2(0.);
          for(int i=0;i<NT;i++){
            float a=float(i)/float(NT)*TAU; vec2 d=vec2(cos(a),sin(a));
            float s1=m(uv+d*R*px), s2=m(uv+d*R*.5*px);
            h+=s1+s2; g+=d*(s1+s2*.5);
          }
          g/=float(NT);
          vec3 N=normalize(vec3(-g*2.4,1.));
          vec3 L1=normalize(vec3(-.5+tx*.6,.7+ty*.5,.55));
          float dif=dot(N,L1)*.5+.5;
          vec3 Hh=normalize(L1+vec3(0.,0.,1.));
          float spec=pow(max(dot(N,Hh),0.),70.);
          float fr=1.-N.z;
          vec3 Rv=reflect(vec3(0.,0.,-1.),N);
          float band=sin(Rv.y*6.+Rv.x*4.+t*.25)*.5+.5;
          vec3 chrome=mix(vec3(.08,.08,.12),vec3(.96,.97,1.),smoothstep(.2,.95,dif*.65+band*.55));
          vec3 film=.5+.5*cos(TAU*(fr*1.7+Rv.x*.6+uv.x*.35+t*.03+vec3(0.,.33,.67)));
          film=mix(vec3(.82,.86,1.),film,.85);
          vec3 col=chrome*.85+film*clamp(fr*2.2,0.,1.)*.75+spec*1.1;
          float gl=exp(-pow((uv.x-fract(t*.06)*1.7+.35)*6.,2.)); col+=gl*.55*vec3(.92,.88,1.);
          float a=m0*(.62+.38*clamp(fr*2.6+spec,0.,1.));
          a*=smoothstep(0.,.3,reveal*1.5-uv.x);
          gl_FragColor=vec4(col*a,a);
        }`
    });
    const quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), mat); quad.frustumCulled = false;
    const S = new THREE.Scene(), C = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1); S.add(quad);
    let ok = false, vis = true, pad = 40;

    const layout = () => {
      const l1 = h1.querySelector(".l1"), l2 = h1.querySelector(".l2"); if (!l1 || !l2) return;
      l2.style.marginLeft = Math.round(l1.offsetWidth * .46) + "px";
      const f1 = parseFloat(getComputedStyle(l1).fontSize), f2 = parseFloat(getComputedStyle(l2).fontSize);
      pad = Math.round(f1 * .3);
      const w = h1.offsetWidth + pad * 2, h = h1.offsetHeight + pad * 2, dpr = DPR;
      cv.style.cssText = `position:absolute;left:${-pad}px;top:${-pad}px;width:${w}px;height:${h}px;pointer-events:none`;
      R.setSize(Math.round(w * dpr), Math.round(h * dpr), false);
      mask.width = Math.round(w * dpr); mask.height = Math.round(h * dpr);
      const x = mask.getContext("2d"); x.clearRect(0, 0, mask.width, mask.height); x.scale(dpr, dpr); x.fillStyle = "#fff";
      const draw = (el, font, fs, ls) => {
        x.font = font; if ("letterSpacing" in x) x.letterSpacing = ls + "px"; x.textBaseline = "alphabetic";
        const mt = x.measureText(el.textContent), A = mt.fontBoundingBoxAscent || fs * .8, D = mt.fontBoundingBoxDescent || fs * .25;
        const lh = el.offsetHeight, base = pad + el.offsetTop + (lh - (A + D)) / 2 + A;
        x.fillText(el.textContent, pad + el.offsetLeft, base);
      };
      draw(l1, `200 ${f1}px "Jost", "Inter Tight", sans-serif`, f1, .01 * f1);
      draw(l2, `italic 400 ${f2}px "Playfair Display", "Cormorant Garamond", serif`, f2, 0);
      tex.needsUpdate = true;
      U.px.value.set(1 / mask.width, 1 / mask.height); U.R.value = Math.max(3, f1 * .026 * dpr);
      ok = true; root.classList.add("gl-ok");
    };
    const relayout = () => { if (document.fonts) Promise.all([document.fonts.load('200 100px "Jost"', "PORT"), document.fonts.load('italic 400 100px "Playfair Display"', "folio.")]).then(layout, layout); else layout(); };
    relayout(); addEventListener("resize", relayout); addEventListener("pflayout", relayout);
    if (document.fonts) document.fonts.ready.then(layout);
    new IntersectionObserver(es => { vis = es[0].isIntersecting; }).observe(hero);
    let mx = 0, my = 0; addEventListener("pointermove", e => { mx = e.clientX / innerWidth * 2 - 1; my = -(e.clientY / innerHeight * 2 - 1); });
    const t0 = performance.now(); let rev = 0;
    loops.push(function (now) {
      if (!ok || !vis) return;
      const t = RM ? 4 : (now - t0) / 1000;
      const go = !!window.READY, since = go ? (now - window.READY) / 1000 : 0;
      rev = RM ? 1 : go ? ez(cl(since / 2.4)) : 0;
      U.t.value = t; U.reveal.value = rev; U.tx.value += (mx - U.tx.value) * .06; U.ty.value += (my - U.ty.value) * .06;
      R.render(S, C);
    });
  } catch (e) { /* DOM letters stay visible as a fallback */ }

  /* ================= 3) crystal tulips (contact block + project page) =================
     One visual system with the hero flower: the same pale glass body, the same lilac / white / pink
     thin-film reflections (irid), the same light panels (env) and the same slow, soft motion. */
  function garden(cv, sec, modal) {
  try {
    const R = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: !LOW });
    R.setPixelRatio(Math.min(DPR, 1.6));
    const Z = 10, C = new THREE.PerspectiveCamera(30, 1, .1, 60); C.position.z = Z;
    const S = new THREE.Scene(); S.environment = env(R, true);
    const body = op => new THREE.MeshPhysicalMaterial({ color: 0xe6e8ff, metalness: .1, roughness: .05, clearcoat: 1, clearcoatRoughness: .05, transparent: true, opacity: op, envMapIntensity: 2, side: THREE.DoubleSide, depthWrite: false });
    const edge = op => new THREE.LineBasicMaterial({ color: 0xdfe6ff, transparent: true, opacity: op, depthWrite: false });
    const grid2geo = (pos, nu, nv, count) => {   /* merged grids -> indexed geometry */
      const idx = []; for (let g = 0; g < count; g++) { const off = g * (nu + 1) * (nv + 1); for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { const a = off + i * (nv + 1) + j, b = a + 1, c = a + nv + 1, d = c + 1; idx.push(a, b, c, b, d, c); } }
      const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
    };
    const NU = LOW ? 12 : 20, NV = 10;
    /* tulip head: 3 outer + 3 inner petals; P.open 0 = closed bud ... 1 = wide open */
    function headGeo(P) {
      const pos = [], lp = [];
      for (let k = 0; k < 6; k++) {
        const outer = k < 3, phi = (k % 3) * 2.0944 + (outer ? 0 : 1.0472) + P.rot + P.j[k] * .12;
        const o = cl(P.open + (outer ? .07 : -.05) + P.j[k] * .08), L = P.L * (outer ? 1 : .9 + .04 * P.j[k]);
        const cen = []; let r = .06, y = 0;
        for (let i = 0; i <= NU; i++) {
          const u = i / NU, ang = P.belly * (1 - .3 * o) * (Math.cos(Math.PI * u * 1.15) + .7 * u * u * u) - (1 - o) * P.tuck * u * u + o * P.flare * Math.pow(u, 2);   /* cup: out, then back in; open petals flare at the tips */
          cen.push([r, y]); r = Math.max(.02, r + Math.sin(ang) * L / NU); y += Math.cos(ang) * L / NU;
        }
        const rows = [];
        for (let i = 0; i <= NU; i++) {
          const u = i / NU, aw = P.W * (outer ? 1 : .94) * Math.pow(Math.max(0, Math.sin(Math.PI * Math.pow(u, P.pt))), .85), row = [];
          for (let j = 0; j <= NV; j++) {
            const v = j / NV * 2 - 1, cup = .11 * (1 - o * u) - o * .1 * u * u * u;
            const rr = cen[i][0] * (1 - cup * v * v) * (1 + .03 * Math.sin(v * 3.6 + u * 5 + k * 2.1 + P.seed)), a = phi + v * aw, yy = cen[i][1] + .05 * u * v * v * (1 - o * .5);
            const p = [Math.cos(a) * rr, yy, Math.sin(a) * rr]; pos.push(...p); row.push(p);
          }
          rows.push(row);
        }
        [0, NV / 2, NV].forEach(j => { for (let i = 0; i < NU; i++) lp.push(...rows[i][j], ...rows[i + 1][j]); });   /* thin outline + centre vein */
      }
      return { geo: grid2geo(pos, NU, NV, 6), lines: new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(lp, 3)) };
    }
    /* long glass leaf */
    function leafGeo(Ll, side, seed) {
      const nu = 16, nv = 6, pos = [], th = .7 + .3 * Math.sin(seed);
      for (let i = 0; i <= nu; i++) {
        const u = i / nu, cx = side * Ll * .5 * u * u, cy = Ll * (.92 * u - .06 * u * u), w = .13 * Math.pow(Math.max(0, Math.sin(Math.PI * Math.pow(u, .6))), .9);
        for (let j = 0; j <= nv; j++) { const v = j / nv * 2 - 1; pos.push(cx + Math.cos(th) * v * w, cy, Math.sin(th) * v * w + .05 * v * v * w * 4); }
      }
      return grid2geo(pos, nu, nv, 1);
    }
    function stamens(n, h) {
      const g = new THREE.Group(), p = [], m = new THREE.Matrix4();
      const tips = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshBasicMaterial({ color: 0xfff1e6 }), n); tips.frustumCulled = false;
      for (let i = 0; i < n; i++) { const a = i * 2.39996, s = .06 + .1 * Math.sqrt((i + .5) / n), x = Math.cos(a) * s, z = Math.sin(a) * s, hh = h * (.78 + .22 * ((i * 7) % 5) / 5); p.push(0, 0, 0, x, hh, z); m.makeScale(.028, .028, .028).setPosition(x, hh, z); tips.setMatrixAt(i, m); }
      g.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(p, 3)), edge(.5)), tips); return g;
    }
    /* x (−1..1 of half width), head height (0..1 of canvas), size, lean, phase, open, W, L, belly, tuck, pointiness, tint, leaves */
    const SPEC = [
      [-.80, .56, 1.55,  .12, 0.0, .55, 1.00, 1.22, .52, 1.25, .72, .00, 2],   /* big, slightly open */
      [ .80, .58, 1.40, -.10, 1.6, .92, 1.04, 1.12, .46, 1.10, .62, .10, 2],   /* big, wide open */
      [-.36, .42,  .95,  .06, 3.1, .06, 1.00, 1.30, .60, 1.35, .78, .20, 1],   /* closed */
      [ .24, .46,  .90, -.05, 4.4, .42, .98, 1.18, .50, 1.20, .70, .05, 1],   /* slightly open */
      [-.60, .24,  .60,  .10, 2.2, .00, .92, 1.06, .56, 1.30, .85, .25, 0],   /* small bud */
      [-.10, .30,  .72,  .04, 5.2, .78, 1.06, 1.00, .42, 1.00, .66, .15, 1],   /* open */
      [ .56, .28,  .62, -.08, .70, .22, .98, 1.14, .54, 1.25, .76, .30, 0],
      [ .98, .36,  .66, -.12, 3.7, .50, 1.00, 1.16, .50, 1.18, .72, .08, 0],
      [-.98, .34,  .64,  .10, 5.9, .08, .94, 1.20, .58, 1.30, .80, .22, 0],
      [ .02, .18,  .46,  .02, 1.1, .00, .90, 1.00, .54, 1.30, .84, .12, 0],
    ].slice(0, modal ? (LOW ? 5 : 7) : (LOW ? 6 : 10));
    const T = SPEC.map((sp, n) => {
      const [, , size, lean, ph, open, W, L, belly, tuck, pt, tint, leaves] = sp, rnd = i => Math.sin(n * 12.9898 + i * 78.233);
      const P = { open, W, L, belly: belly * 1.8, tuck: tuck * .18, pt, flare: 1.8, rot: rnd(1) * 1.2, seed: n * 1.7, j: [0, 1, 2, 3, 4, 5].map(i => rnd(i + 3)) };
      const hg = headGeo(P), o = { sp, pivot: new THREE.Group(), head: new THREE.Group(), mats: [] };
      const film = irid(1.7, tint); film.uniforms.v.value = .12 + .1 * open; o.mats.push(film);
      const hm = new THREE.Mesh(hg.geo, body(.2 + .04 * (1 - open))), fm = new THREE.Mesh(hg.geo, film); fm.renderOrder = 1;
      o.head.add(hm, fm, new THREE.LineSegments(hg.lines, edge(.2)));
      if (open > .3) o.head.add(stamens(6, L * .62));
      o.stemFilm = irid(1.0, tint + .1); o.stemFilm.uniforms.v.value = .1; o.mats.push(o.stemFilm);
      o.stem = new THREE.Mesh(new THREE.BufferGeometry(), body(.16)); o.stemF = new THREE.Mesh(o.stem.geometry, o.stemFilm); o.stemF.renderOrder = 1;
      o.pivot.add(o.stem, o.stemF, o.head);
      o.leaves = []; for (let i = 0; i < leaves; i++) { const side = i ? 1 : -1, lg = leafGeo(1, side, n + i), lf = irid(1.3, tint + .15); lf.uniforms.v.value = .1; o.mats.push(lf); const a = new THREE.Mesh(lg, body(.14)), b = new THREE.Mesh(lg, lf); b.renderOrder = 1; const g = new THREE.Group(); g.add(a, b); o.pivot.add(g); o.leaves.push(g); }
      S.add(o.pivot); return o;
    });
    let HW = 4, HH = 2.7;
    const place = () => {
      const w = modal ? innerWidth : sec.clientWidth; if (!w) return;
      const h = Math.round(modal ? Math.min(innerHeight * .56, 520) : Math.min(innerHeight * .82, 760)), asp = w / h;
      cv.style.height = h + "px"; R.setSize(w, h, false); C.aspect = asp; C.updateProjectionMatrix();
      HH = Math.tan(15 * Math.PI / 180) * Z; HW = HH * asp;
      const sc = cl(asp / 1.7, .55, 1.15);
      T.forEach(o => {
        const [fx, fh, size, lean] = o.sp, x = fx * HW * .96, base = -HH - .5, top = -HH + fh * 2 * HH, len = Math.max(1, top - base), s = size * sc;
        o.pivot.position.set(x, base, 0); o.lean = lean;
        const pts = []; for (let i = 0; i <= 14; i++) { const k = i / 14; pts.push(new THREE.Vector3(lean * len * k * k + Math.sin(Math.PI * k) * .05 * len * Math.sign(lean || 1), len * k, 0)); }
        const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 28, .03 * s + .018, LOW ? 5 : 8, false);
        o.stem.geometry.dispose(); o.stem.geometry = g; o.stemF.geometry = g;
        o.head.position.set(pts[14].x, len, 0); o.head.scale.setScalar(s * 1.1);
        o.leaves.forEach((lg, i) => { const Ll = Math.min(len * .55, 2.2 * sc) * (i ? .8 : 1); lg.scale.setScalar(Ll); lg.position.set(pts[2 + i].x, pts[2 + i].y, 0); });
      });
    };
    place(); addEventListener("resize", place);
    let vis = false; if (!modal) new IntersectionObserver(es => { vis = es[0].isIntersecting; }, { rootMargin: "100px" }).observe(sec);
    /* wind: slow and soft; a little stronger when the pointer sweeps over the flowers */
    let energy = 0, dirx = 0, lpx = null;
    addEventListener("pointermove", e => {
      const r = cv.getBoundingClientRect();
      if (e.clientY > r.top && e.clientY < r.bottom) { if (lpx !== null) { const dx = e.clientX - lpx; energy = Math.min(1.4, energy + Math.abs(dx) * .003); dirx = dx > 0 ? 1 : -1; } lpx = e.clientX; } else lpx = null;
    });
    const t0 = performance.now(); let wd = 0;
    loops.push(function (now) {
      if (modal) { const on = root.classList.contains("modal-open"); if (on && !vis) place(); vis = on; }
      if (!vis) return;
      const t = RM ? 0 : (now - t0) / 1000; energy *= .988; wd += (dirx * energy - wd) * .035;
      const gust = Math.max(0, Math.sin(t * .17) * Math.sin(t * .41 + 1));
      T.forEach(o => {
        const ph = o.sp[4], w = Math.sin(t * .38 + ph) * .034 + Math.sin(t * .9 + ph * 1.7) * .012 + gust * .028;
        o.pivot.rotation.z = o.lean * .35 + w + wd * .04;
        o.head.rotation.z = -Math.atan(2 * o.lean) + w * 1.15 + wd * .06;
        o.head.rotation.x = .34 + Math.sin(t * .55 + ph) * .04; o.head.rotation.y = Math.sin(t * .22 + ph) * .22;
        o.leaves.forEach((lg, i) => { lg.rotation.z = Math.sin(t * .5 + ph + i * 1.3) * .035 + w * .6; });
        o.mats.forEach(m => { m.uniforms.t.value = o.sp[11] + t * .012; });
      });
      R.render(S, C);
    });
  } catch (e) { cv.style.display = "none"; }
  }
  garden($("garden"), $("contact"), false);
  garden($("gardenM"), $("modal"), true);
})();
