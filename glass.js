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

  /* ================= 3) crystal tulips (contact block + project page) ================= */
  function garden(cv, sec, modal) {
  try {
    const R = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: !LOW });
    R.setPixelRatio(Math.min(DPR, 1.6));
    const Z = 10, C = new THREE.PerspectiveCamera(30, 1, .1, 60); C.position.z = Z;
    const S = new THREE.Scene();
    const VS = "attribute vec3 pv;varying vec3 vN,vW,vP;void main(){vN=normalize(normalMatrix*normal);vec4 q=modelViewMatrix*vec4(position,1.);vW=-q.xyz;vP=pv;gl_Position=projectionMatrix*q;}";
    const FS = `uniform float t,h,ln; varying vec3 vN,vW,vP;
      void main(){
        vec3 n=normalize(vN); if(!gl_FrontFacing) n=-n; vec3 vv=normalize(vW);
        float f=1.-abs(dot(n,vv)); float u=vP.x, v=vP.y;
        float hue=f*1.4+u*.7+v*.25+h+t*.02;
        vec3 pal=.5+.5*cos(6.2832*(hue+vec3(0.,.33,.67)));
        vec3 col=mix(vec3(.04,.1,.09),pal,.5+.45*f);
        float ed=smoothstep(.9,1.,abs(v)), tip=smoothstep(.93,1.,u);
        float line=max(ed,tip*.8)*ln;
        col=mix(col,vec3(1.,.93,.78),line*.85);
        float spec=pow(max(dot(reflect(-vv,n),normalize(vec3(-.4,.7,.6))),0.),22.);
        col+=spec*.6;
        float a=min(1.,.28+.68*pow(f,1.2)+line*.5+spec*.4);
        gl_FragColor=vec4(col*a,a);
      }`;
    const smat = (hh, ln) => new THREE.ShaderMaterial({ uniforms: { t: { value: 0 }, h: { value: hh }, ln: { value: ln } }, vertexShader: VS, fragmentShader: FS, transparent: true, premultipliedAlpha: true, side: THREE.DoubleSide, depthWrite: false });
    /* head = 6 cupped petals (3 outer + 3 inner) */
    function headGeo() {
      const nu = LOW ? 12 : 18, nv = 8, pos = [], pv = [], idx = []; let off = 0;
      for (let k = 0; k < 6; k++) {
        const o = k < 3, phi = (k % 3) * 2.0944 + (o ? 0 : 1.0472), Rr = o ? 1 : .84, Hh = o ? 1 : .93, wd = o ? 1 : .95;
        for (let i = 0; i <= nu; i++) {
          const u = i / nu, aw = .98 * wd * Math.pow(Math.max(0, Math.sin(Math.PI * Math.pow(u, .7))), .75);
          const r = Rr * (.16 + .84 * Math.pow(Math.max(0, Math.sin(Math.PI * Math.pow(u, .82))), .6)) * .62 + Rr * .12 * Math.pow(u, 5);
          for (let j = 0; j <= nv; j++) { const v = j / nv * 2 - 1, rr = r * (1 - .1 * v * v), a = phi + v * aw; pos.push(Math.cos(a) * rr, u * 1.15 * Hh, Math.sin(a) * rr); pv.push(u, v, k); }
        }
        for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { const a = off + i * (nv + 1) + j, b = a + 1, c = a + nv + 1, d = c + 1; idx.push(a, b, c, b, d, c); }
        off += (nu + 1) * (nv + 1);
      }
      const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("pv", new THREE.Float32BufferAttribute(pv, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
    }
    const HG = headGeo();
    function stamens() {
      const p = []; for (let i = 0; i < 5; i++) { const a = i * 1.26, x = Math.cos(a) * .12, z = Math.sin(a) * .12; p.push(0, 0, 0, x, .62, z); }
      const l = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(p, 3)), new THREE.LineBasicMaterial({ color: 0xfff1d8, transparent: true, opacity: .6 }));
      return l;
    }
    /* [x (−1..1 of half width), head height (0..1 of canvas), size, lean, phase, hue] */
    const SPEC = [[-.78, .72, 1.5, .1, 0, 0], [.8, .74, 1.3, -.09, 1.6, .25], [-.3, .5, .85, .05, 3.1, .5], [.22, .58, .8, -.04, 4.4, .75], [-.55, .28, .5, .08, 2.2, .1], [.55, .33, .55, -.07, 5.2, .4], [.02, .24, .42, .02, .7, .6], [.96, .42, .62, -.12, 3.7, .9], [-.1, .38, .55, .05, 1.1, .3], [-.97, .38, .6, .1, 5.9, .65]].slice(0, modal ? (LOW ? 5 : 7) : (LOW ? 6 : 10));
    const T = SPEC.map(sp => ({ sp, pivot: new THREE.Group(), head: new THREE.Group(), mats: [], S: 3 }));
    T.forEach(o => {
      const [, , size, lean, , hue] = o.sp, hm = smat(hue, 1), sm = smat(hue + .2, 0); o.mats.push(hm, sm);
      const hd = new THREE.Mesh(HG, hm); hd.scale.setScalar(size); o.head.add(hd);
      const st = stamens(); st.scale.setScalar(size); o.head.add(st);
      o.hm = hm; o.sm = sm; o.pivot.add(o.head); S.add(o.pivot);
      o.stem = new THREE.Mesh(new THREE.BufferGeometry(), sm); o.pivot.add(o.stem);
    });
    let HW = 4, HH = 2.7;
    const place = () => {
      const w = modal ? innerWidth : sec.clientWidth; if (!w) return; const h = Math.round(modal ? Math.min(innerHeight * .5, 460) : Math.min(innerHeight * .72, 660)), asp = w / h;
      cv.style.height = h + "px";
      R.setSize(w, h, false); C.aspect = asp; C.updateProjectionMatrix();
      HH = Math.tan(15 * Math.PI / 180) * Z; HW = HH * asp;
      const sc = cl(asp / 1.7, .55, 1.15);
      T.forEach(o => {
        const [fx, fh, size, lean] = o.sp, x = fx * HW * .96, base = -HH - .5, top = -HH + fh * 2 * HH, len = Math.max(1, top - base) , s = size * sc;
        o.pivot.position.set(x, base, 0); o.len = len; o.lean = lean; o.s = s;
        const pts = []; for (let i = 0; i <= 12; i++) { const k = i / 12; pts.push(new THREE.Vector3(lean * len * k * k + Math.sin(Math.PI * k) * .05 * len * Math.sign(lean || 1), len * k, 0)); }
        const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, .035 * s + .02, LOW ? 5 : 8, false), uv = g.attributes.uv, pvv = [];
        for (let i = 0; i < uv.count; i++) pvv.push(uv.getX(i) * .5, uv.getY(i) * 2 - 1, 0);
        g.setAttribute("pv", new THREE.Float32BufferAttribute(pvv, 3)); o.stem.geometry.dispose(); o.stem.geometry = g;
        o.head.position.set(pts[12].x, len, 0); o.head.scale.setScalar(sc);
      });
    };
    place(); addEventListener("resize", place);
    let vis = false; if (!modal) new IntersectionObserver(es => { vis = es[0].isIntersecting; }, { rootMargin: "100px" }).observe(sec);
    /* wind: gentle always, stronger when the pointer moves over the flowers */
    let energy = 0, dirx = 0, lpx = null;
    addEventListener("pointermove", e => {
      const r = cv.getBoundingClientRect();
      if (e.clientY > r.top && e.clientY < r.bottom) { if (lpx !== null) { const dx = e.clientX - lpx; energy = Math.min(1.6, energy + Math.abs(dx) * .004); dirx = dx > 0 ? 1 : -1; } lpx = e.clientX; } else lpx = null;
    });
    const t0 = performance.now(); let wd = 0;
    loops.push(function (now) {
      if (modal) { const on = root.classList.contains("modal-open"); if (on && !vis) place(); vis = on; }
      if (!vis) return;
      const t = RM ? 0 : (now - t0) / 1000; energy *= .985; wd += (dirx * energy - wd) * .05;
      const gust = Math.max(0, Math.sin(t * .23) * Math.sin(t * .57 + 1));
      T.forEach(o => {
        const ph = o.sp[4], w = Math.sin(t * .55 + ph) * .04 + Math.sin(t * 1.3 + ph * 1.7) * .016 + gust * .035;
        o.pivot.rotation.z = o.lean * .35 + w + wd * .05;
        o.head.rotation.z = -Math.atan(2 * o.lean) + w * 1.1 + wd * .08;
        o.head.rotation.x = .38 + Math.sin(t * .8 + ph) * .05; o.head.rotation.y = Math.sin(t * .3 + ph) * .25;
        o.mats.forEach(m => { m.uniforms.t.value = t; });
      });
      R.render(S, C);
    });
  } catch (e) { cv.style.display = "none"; }
  }
  garden($("garden"), $("contact"), false);
  garden($("gardenM"), $("modal"), true);
})();
