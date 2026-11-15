/* Zowcode Invites – shared drawing kit.
   zowEmboss(w, h, base)  → JPEG data URL of embossed damask paper, drawn procedurally (no image files).
   zowSeal(a, b)          → injects <symbol id="zowSeal"> (antique-gold wax seal with monogram a&b) once.
   Filigree symbol id="zowFil" is injected with the seal; colour it with `stroke` on the <use>. */

function zowEmboss(w, h, base = [29, 74, 56]) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(2.6e6 / (w * h)));
  const W = Math.round(w * dpr), H = Math.round(h * dpr);
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  g.scale(dpr, dpr);
  g.lineCap = g.lineJoin = 'round';

  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const ink = v => (g.fillStyle = g.strokeStyle = `rgb(${v},${v},${v})`);
  const dot = (x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };

  function leaf(x, y, ang, len, wid) {
    g.save(); g.translate(x, y); g.rotate(ang);
    ink(255); g.beginPath(); g.moveTo(0, 0);
    g.bezierCurveTo(len * .3, -wid, len * .75, -wid * .8, len, 0);
    g.bezierCurveTo(len * .75, wid * .8, len * .3, wid, 0, 0); g.fill();
    ink(120); g.lineWidth = .7; g.beginPath(); g.moveTo(len * .12, 0); g.lineTo(len * .8, 0); g.stroke();
    g.restore();
  }
  const bez = (p, t) => {
    const u = 1 - t;
    return [0, 1].map(k => u * u * u * p[0][k] + 3 * u * u * t * p[1][k] + 3 * u * t * t * p[2][k] + t * t * t * p[3][k]);
  };
  function curl(x, y, a, r, dir) {
    ink(255); g.lineWidth = 2; g.beginPath(); g.moveTo(x, y);
    for (let i = 0; i < 46; i++) { a += dir * .2; const s = r * (1 - i / 52) * .2; x += Math.cos(a) * s; y += Math.sin(a) * s; g.lineTo(x, y); }
    g.stroke(); dot(x, y, 1.6);
  }
  function frond(p, n, len, dir) {
    ink(255); g.lineWidth = 2.4; g.beginPath(); g.moveTo(...p[0]); g.bezierCurveTo(...p[1], ...p[2], ...p[3]); g.stroke();
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 1), [x, y] = bez(p, t), [x2, y2] = bez(p, t + .01);
      const tan = Math.atan2(y2 - y, x2 - x), k = (1 - t * .55) * (.82 + rnd() * .36);
      leaf(x, y, tan - dir * .95, len * k, len * .4 * k);
      leaf(x, y, tan + dir * .8, len * (i % 2 ? .7 : .45) * k, len * .28 * k);
    }
    const [x, y] = p[3], [x0, y0] = bez(p, .98);
    curl(x, y, Math.atan2(y - y0, x - x0), 14, dir);
    ink(200); dot(x + 10 * dir, y + 8, 1.8); dot(x + 4 * dir, y + 14, 1.4);
  }
  function motif(cx, cy) {
    for (const s of [1, -1]) {
      g.save(); g.translate(cx, cy); g.scale(s, 1);
      for (let i = 0; i < 13; i++) leaf(1.5, 140 - i * 22 + (s < 0 ? 11 : 0), -1.05, 34 - i * 1.8, 11 - i * .5);
      frond([[3, 118], [76, 112], [112, 30], [66, -44]], 16, 32, 1);
      frond([[3, 36], [50, 18], [66, -56], [26, -104]], 12, 24, -1);
      frond([[60, 96], [92, 100], [118, 76], [124, 46]], 6, 16, 1);
      frond([[3, 150], [40, 178], [86, 172], [108, 140]], 8, 18, -1);
      g.restore();
    }
    g.save(); g.translate(cx, cy);
    ink(255); g.lineWidth = 3; g.beginPath(); g.moveTo(0, 158); g.lineTo(0, -150); g.stroke();
    leaf(0, -148, -Math.PI / 2, 34, 10); leaf(0, -146, -Math.PI / 2 - .45, 24, 7); leaf(0, -146, -Math.PI / 2 + .45, 24, 7);
    g.restore();
  }
  function paisley(cx, cy, flip) {
    g.save(); g.translate(cx, cy); g.scale(flip * .8, .8);
    const shape = () => { g.beginPath(); g.moveTo(0, 45); g.bezierCurveTo(-40, 45, -45, -5, -18, -25); g.bezierCurveTo(-2, -37, 8, -52, 2, -75); g.bezierCurveTo(34, -55, 46, -12, 34, 16); g.bezierCurveTo(26, 36, 14, 45, 0, 45); };
    ink(255); g.lineWidth = 3.4; shape(); g.stroke();
    g.save(); g.translate(2, 6); g.scale(.7, .7); g.lineWidth = 2; shape(); g.stroke(); g.restore();
    for (let a = 0; a < 6.2; a += .42) { ink(210); dot(Math.cos(a) * 46, 8 + Math.sin(a) * 46, 1.5); }
    frond([[0, 30], [-12, 12], [8, -10], [4, -34]], 5, 11, 1);
    g.restore();
  }
  function sprig(x, y, s) {
    g.save(); g.translate(x, y); g.scale(s, 1);
    frond([[0, 60], [-20, 30], [18, -10], [0, -56]], 9, 18, 1);
    frond([[0, 30], [24, 20], [40, -4], [36, -26]], 5, 12, -1);
    frond([[0, 20], [-26, 8], [-40, -16], [-30, -36]], 5, 12, 1);
    g.restore();
  }
  function flower(x, y, r) {
    ink(190); for (let a = 0; a < 6.28; a += 1.2566) dot(x + Math.cos(a) * r, y + Math.sin(a) * r, r * .72);
    ink(255); dot(x, y, r * .5);
  }

  // fine paper grain
  for (let i = 0; i < w * h / 240; i++) { ink(40 + rnd() * 60); dot(rnd() * w, rnd() * h, .4 + rnd() * .6); }

  const X = 300, Y = 440;
  for (let col = -2; col <= Math.ceil(w / X / 2) + 1; col++) for (const side of col ? [1, -1] : [1]) {
    const cx = w / 2 + side * col * X;
    for (let row = -1; row <= Math.ceil(h / Y) + 1; row++) {
      const cy = row * Y + (col & 1 ? Y / 2 : 0) + Y * .1;
      g.save(); g.translate(cx, cy); g.scale(1.12, 1.12); motif(0, 0); g.restore();
      paisley(cx + X / 2, cy + Y * .2, side);
      sprig(cx + X / 2, cy - Y * .2, side);
      for (let k = 0; k < 5; k++) flower(cx + X * (.3 + rnd() * .4), cy - Y * (.05 + rnd() * .4), 2.4 + rnd() * 1.8);
    }
  }

  // height map → blur → lighting
  const src = g.getImageData(0, 0, W, H).data;
  let hm = new Float32Array(W * H);
  for (let i = 0; i < hm.length; i++) hm[i] = src[i * 4] / 255;
  const r = Math.max(1, Math.round(1.1 * dpr));
  for (let pass = 0; pass < 2; pass++) hm = boxBlur(hm, W, H, r);

  const out = g.createImageData(W, H), o = out.data;
  const L = norm([-.55, -.68, .55]), Hv = norm([L[0], L[1], L[2] + 1]);
  const S = 3.2 * dpr, spec0 = Math.pow(Hv[2], 28);
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const i = y * W + x;
    const nx = -(hm[i + 1] - hm[i - 1]) * S, ny = -(hm[i + W] - hm[i - W]) * S;
    const inv = 1 / Math.sqrt(nx * nx + ny * ny + 1);
    const dif = (nx * L[0] + ny * L[1] + L[2]) * inv;
    const sp = Math.max(0, (nx * Hv[0] + ny * Hv[1] + Hv[2]) * inv);
    const u = x / W - .5, v = y / H - .5;
    const tone = (1 + (dif - L[2]) * 1.35 + hm[i] * .07) * (1 - .55 * (u * u + v * v))
      * (1 + .045 * Math.sin(x * .011 / dpr + 1.3) * Math.sin(y * .008 / dpr));
    const s = (Math.pow(sp, 28) - spec0) * 70, n = (rnd() - .5) * 7;
    o[i * 4] = base[0] * tone + s + n;
    o[i * 4 + 1] = base[1] * tone + s * .95 + n;
    o[i * 4 + 2] = base[2] * tone + s * .8 + n;
    o[i * 4 + 3] = 255;
  }
  g.putImageData(out, 0, 0);
  return c.toDataURL('image/jpeg', .9);

  function norm(a) { const l = Math.hypot(...a); return a.map(v => v / l); }
}

function boxBlur(a, W, H, r) {
  const t = new Float32Array(a.length), o = new Float32Array(a.length), d = 2 * r + 1;
  for (let y = 0; y < H; y++) {
    let s = 0; const row = y * W;
    for (let x = -r; x <= r; x++) s += a[row + Math.min(W - 1, Math.max(0, x))];
    for (let x = 0; x < W; x++) {
      t[row + x] = s / d;
      s += a[row + Math.min(W - 1, x + r + 1)] - a[row + Math.max(0, x - r)];
    }
  }
  for (let x = 0; x < W; x++) {
    let s = 0;
    for (let y = -r; y <= r; y++) s += t[Math.min(H - 1, Math.max(0, y)) * W + x];
    for (let y = 0; y < H; y++) {
      o[y * W + x] = s / d;
      s += t[Math.min(H - 1, y + r + 1) * W + x] - t[Math.max(0, y - r) * W + x];
    }
  }
  return o;
}

function zowSeal(a, b) {
  if (document.getElementById('zowSeal')) return;
  const relief = (href, extra = '') => `
    <use href="${href}" ${extra} stroke="#3E2B10" fill="#3E2B10" transform="translate(1.1 1.3)" opacity=".85"/>
    <use href="${href}" ${extra} stroke="#FFF2C9" fill="#FFF2C9" transform="translate(-.8 -.9)" opacity=".9"/>
    <use href="${href}" ${extra} stroke="url(#zsFoil)" fill="url(#zsFoil)"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <radialGradient id="zsWax" cx="36%" cy="30%" r="75%"><stop offset="0" stop-color="#F7E6B4"/><stop offset=".42" stop-color="#CDAB69"/><stop offset=".8" stop-color="#8C6A33"/><stop offset="1" stop-color="#5A421E"/></radialGradient>
    <linearGradient id="zsRim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF1C4"/><stop offset=".28" stop-color="#D6B573"/><stop offset=".55" stop-color="#8A6630"/><stop offset=".78" stop-color="#E6C98B"/><stop offset="1" stop-color="#5E451D"/></linearGradient>
    <radialGradient id="zsDisc" cx="66%" cy="72%" r="85%"><stop offset="0" stop-color="#D8BB7C"/><stop offset=".55" stop-color="#A5834A"/><stop offset="1" stop-color="#6E5023"/></radialGradient>
    <linearGradient id="zsFoil" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3DFA6"/><stop offset=".5" stop-color="#D2B06C"/><stop offset="1" stop-color="#A7843F"/></linearGradient>
    <filter id="zsEdge" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="5"/>
      <feDisplacementMap in="SourceGraphic" scale="5" xChannelSelector="R" yChannelSelector="G" result="blob"/>
      <feGaussianBlur in="blob" stdDeviation="5" result="soft"/>
      <feSpecularLighting in="soft" surfaceScale="7" specularConstant="1.05" specularExponent="22" lighting-color="#FFF3D2" result="spec"><fePointLight x="55" y="35" z="230"/></feSpecularLighting>
      <feComposite in="spec" in2="blob" operator="in" result="specIn"/>
      <feComposite in="blob" in2="specIn" operator="arithmetic" k2="1" k3=".75"/>
    </filter>
    <filter id="zsHammer" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="3" seed="8" result="n"/>
      <feDiffuseLighting in="n" surfaceScale="1.6" diffuseConstant="1.15" lighting-color="#fff" result="l"><feDistantLight azimuth="225" elevation="58"/></feDiffuseLighting>
      <feComposite in="l" in2="SourceGraphic" operator="arithmetic" k1="1.18" result="m"/>
      <feComposite in="m" in2="SourceGraphic" operator="in"/>
    </filter>
    <g id="zowFilHalf" fill="none" stroke-width="1.7" stroke-linecap="round">
      <path d="M3 4C10-2 20-4 27 0 32 3 31 10 25 10 20 10 20 4 24 4M27 0C36-4 44-2 50-6 53-8 56-6 55-3M14-1C14-8 19-12 25-11M20-11C17-15 12-15 10-12M40-3C42 1 46 3 50 2M31 8C37 12 44 11 47 8"/>
      <circle cx="44" cy="6.5" r=".9"/><circle cx="35" cy="-9" r=".9"/><circle cx="57" cy="-1" r=".8"/>
    </g>
    <g id="zowFil">
      <use href="#zowFilHalf"/><use href="#zowFilHalf" transform="scale(-1 1)"/>
      <path d="M0-16C2.6-10 3.6-4 0 3-3.6-4-2.6-10 0-16ZM0 3V12" fill="none" stroke-width="1.7" stroke-linecap="round"/>
      <circle cy="14.5" r="1.3"/>
    </g>
    <g id="zsMono" font-family="'Corinthia','Pinyon Script',cursive" text-anchor="middle" stroke="none">
      <text x="80" y="143" font-size="62">${a}</text>
      <text x="123" y="137" font-size="30" font-family="'Cormorant Garamond',serif" font-style="italic">&amp;</text>
      <text x="161" y="143" font-size="62">${b}</text>
    </g>
    <symbol id="zowSeal" viewBox="0 0 240 240" overflow="visible">
      <circle cx="120" cy="120" r="112" fill="url(#zsWax)" filter="url(#zsEdge)"/>
      <circle cx="120" cy="120" r="92" fill="none" stroke="url(#zsRim)" stroke-width="15"/>
      <circle cx="120" cy="120" r="99.5" fill="none" stroke="#FFF3CF" stroke-opacity=".5" stroke-width="1.4"/>
      <circle cx="120" cy="120" r="84" fill="url(#zsDisc)" filter="url(#zsHammer)"/>
      <circle cx="120" cy="120" r="84" fill="none" stroke="#3E2B10" stroke-opacity=".55" stroke-width="2.4"/>
      <circle cx="120.8" cy="120.9" r="76" fill="none" stroke="#FFF0C4" stroke-opacity=".55" stroke-width="1"/>
      <circle cx="120" cy="120" r="76" fill="none" stroke="#4A3515" stroke-opacity=".8" stroke-width="1"/>
      <g transform="translate(120 82) scale(.95)">${relief('#zowFil')}</g>
      <g transform="translate(120 160) scale(.95 -.95)">${relief('#zowFil')}</g>
      ${relief('#zsMono')}
    </symbol></defs></svg>`;
  document.body.insertAdjacentHTML('afterbegin', svg);
}
