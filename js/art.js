/*
 * 植物・きのこのイラスト（SVG）を生成するモジュール。
 * 種ごとの「見た目の設定（look）」を js/data.js に書き、ここで組み立てる。
 * すべて viewBox 0 0 100 100、地面（根元）を下にして描く。
 * 見分けポイントになる特徴（葉の形・つや・根元の色・つぼ・ひだの色など）を強調している。
 */
const Art = (() => {
  const OUT = '#26323d'; // 輪郭線の色
  const f = (n) => Math.round(n * 10) / 10;
  const rad = (d) => (d * Math.PI) / 180;

  // 再現性のある疑似乱数（同じ種は毎回同じ形になる）
  function rng(seed) {
    let s = seed >>> 0;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }
  function hash(str) {
    let h = 2166136261;
    for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return h >>> 0;
  }

  function wrap(inner, label, defs = '') {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}"><defs>${defs}</defs>${inner}</svg>`;
  }

  // 点 (x, y) を角度 a（0 = 真上、時計回り）の方向へ d 進めた点
  const step = (x, y, a, d) => [x + Math.sin(rad(a)) * d, y - Math.cos(rad(a)) * d];

  // =====================================================================
  // 葉
  // =====================================================================
  // 葉の輪郭の「半分の幅」を t（0 = 付け根, 1 = 先端）の関数で表す
  const SHAPES = {
    oval: (t) => Math.pow(Math.sin(Math.PI * t), 0.75),
    lance: (t) => Math.pow(Math.sin(Math.PI * Math.pow(t, 0.65)), 0.9),
    linear: (t) => (t < 0.85 ? 0.85 + t * 0.15 : (1 - t) / 0.15),
    needle: (t) => (t < 0.8 ? 1 : (1 - t) / 0.2),
    round: (t) => Math.pow(Math.sin(Math.PI * t), 0.5),
    heart: (t) => Math.pow(Math.sin(Math.PI * (0.18 + t * 0.82)), 0.55) * (t < 0.12 ? 0.6 + t * 3.3 : 1),
    spoon: (t) => Math.pow(Math.sin(Math.PI * Math.pow(t, 1.6)), 0.8),
    tri: (t) => (t < 0.18 ? t / 0.18 : (1 - t) / 0.82) * 0.98 + 0.02,
    arrow: (t) => (t < 0.1 ? 1.25 : Math.pow(1 - t, 0.8) * 1.1),
    obcordate: (t) => Math.pow(t, 0.7) * (t > 0.85 ? 1 - (t - 0.85) * 1.5 : 1),
  };

  // ふち（ぎざぎざ・切れ込み）による幅の倍率
  function edgeMul(edge, t, teeth) {
    const fr = (t * teeth) % 1;
    switch (edge) {
      case 'serrate': return 1 - 0.18 * fr;
      case 'coarse': return 1 - 0.32 * fr;
      case 'crenate': return 0.86 + 0.14 * Math.sin(Math.PI * fr);
      case 'lobed': return 0.42 + 0.58 * Math.pow(Math.abs(Math.sin(Math.PI * t * teeth * 0.5)), 0.7);
      case 'deep': return 0.22 + 0.78 * Math.pow(Math.abs(Math.sin(Math.PI * t * teeth * 0.5)), 0.5);
      case 'wavy': return 0.9 + 0.1 * Math.sin(Math.PI * 2 * t * teeth * 0.5);
      default: return 1;
    }
  }

  // 付け根を原点、先端を (0, -len) とする葉の輪郭パス
  function leafD(L) {
    const shape = SHAPES[L.shape] || SHAPES.oval;
    const N = 34, len = L.len, wid = L.wid, teeth = L.teeth || 8;
    const right = [], left = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      let w = shape(t) * wid * edgeMul(L.edge, t, teeth);
      if (t > 0.97) w *= (1 - t) / 0.03;
      const y = -t * len + (L.shape === 'heart' || L.shape === 'arrow' ? len * 0.12 * (1 - Math.min(1, t * 6)) : 0);
      right.push([w, y]);
      left.unshift([-w * (L.asym || 1), y]);
    }
    if (L.shape === 'obcordate') {
      // 先端のくぼみ（カタバミ・シロツメクサ）
      right[N] = [wid * 0.28, -len * 0.92];
      left[0] = [-wid * 0.28, -len * 0.92];
      right.push([0, -len * 0.8]);
    }
    return 'M 0 0 ' + [...right, ...left].map(([x, y]) => `L ${f(x)} ${f(y)}`).join(' ') + ' Z';
  }

  // 1枚の葉を (x, y) に角度 a で描く
  function leaf(x, y, a, L, flip = false) {
    const color = flip && L.under ? L.under : L.color;
    let s = `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})">`;
    s += `<path d="${leafD(L)}" fill="${color}" stroke="${OUT}" stroke-width="${L.len > 14 ? 1.2 : 0.9}" stroke-linejoin="round"/>`;
    const len = L.len;
    if (L.vein !== 'none' && len > 9) {
      s += `<path d="M 0 0 L 0 ${f(-len * 0.9)}" stroke="${L.veinColor || OUT}" stroke-width="0.7" opacity="0.45"/>`;
      if (L.vein === 'parallel') {
        for (const k of [-0.45, 0.45]) {
          s += `<path d="M 0 0 Q ${f(L.wid * k * 1.4)} ${f(-len * 0.5)} 0 ${f(-len * 0.95)}" fill="none" stroke="${OUT}" stroke-width="0.6" opacity="0.35"/>`;
        }
      } else if (L.vein === 'net' || L.wrinkle) {
        const n = L.wrinkle ? 5 : 3;
        for (let i = 1; i <= n; i++) {
          const t = i / (n + 1);
          const w = (SHAPES[L.shape] || SHAPES.oval)(t) * L.wid * 0.75;
          s += `<path d="M 0 ${f(-len * t)} L ${f(w)} ${f(-len * (t + 0.12))} M 0 ${f(-len * t)} L ${f(-w)} ${f(-len * (t + 0.12))}" stroke="${OUT}" stroke-width="0.55" opacity="${L.wrinkle ? 0.5 : 0.3}"/>`;
        }
      }
    }
    if (L.gloss) s += `<ellipse cx="${f(-L.wid * 0.3)}" cy="${f(-len * 0.55)}" rx="${f(L.wid * 0.18)}" ry="${f(len * 0.16)}" fill="#fff" opacity="0.45"/>`;
    if (L.mark) s += `<path d="M ${f(-L.wid * 0.45)} ${f(-len * 0.35)} L 0 ${f(-len * 0.6)} L ${f(L.wid * 0.45)} ${f(-len * 0.35)}" fill="none" stroke="${L.mark}" stroke-width="1.6" opacity="0.8"/>`;
    if (L.spots) {
      const r = rng(hash(L.color) + Math.round(x * 7));
      for (let i = 0; i < 4; i++) s += `<circle cx="${f((r() - 0.5) * L.wid)}" cy="${f(-len * (0.2 + r() * 0.6))}" r="1.1" fill="${L.spots}" opacity="0.8"/>`;
    }
    return s + '</g>';
  }

  // 複葉・分かれた葉。付け根 (x, y)、角度 a
  function compound(x, y, a, L, scale = 1, flip = false) {
    const k = L.compound;
    const sub = { ...L, len: L.len * scale, wid: L.wid * scale };
    if (!k || k === 'simple') return leaf(x, y, a, sub, flip);
    let s = '';
    if (k === 'tri' || k === 'palm') {
      const n = k === 'tri' ? 3 : (L.n || 5);
      const spread = L.spread || (k === 'tri' ? 55 : 80);
      for (let i = 0; i < n; i++) {
        const da = n === 1 ? 0 : -spread + (2 * spread * i) / (n - 1);
        const m = 1 - Math.abs(da) / spread * (L.taper ?? 0.35);
        s += leaf(x, y, a + da, { ...sub, len: sub.len * m, wid: sub.wid * m }, flip);
      }
      return s;
    }
    if (k === 'pinnate' || k === 'bipinnate') {
      const R = (L.rachis || 22) * scale;
      const n = L.n || 3;
      const [ex, ey] = step(x, y, a, R);
      s += `<path d="M ${f(x)} ${f(y)} L ${f(ex)} ${f(ey)}" stroke="${L.stem || '#5b8a3a'}" stroke-width="1.1"/>`;
      const small = k === 'bipinnate' ? { ...L, compound: 'tri', spread: 40 } : { ...L, compound: 'simple' };
      for (let i = 1; i <= n; i++) {
        const t = i / (n + 0.6);
        const [px, py] = step(x, y, a, R * t);
        const sc = scale * (0.55 + 0.45 * (1 - t * 0.6));
        s += compound(px, py, a - (L.angle || 58), small, sc * 0.8, flip);
        s += compound(px, py, a + (L.angle || 58), small, sc * 0.8, flip);
      }
      s += compound(ex, ey, a, small, scale * 0.85, flip);
      return s;
    }
    if (k === 'fine') {
      // 糸のように細かく分かれた葉（ディル・フェンネル・ドクニンジンなど）
      const R = (L.rachis || 26) * scale;
      const n = L.n || 6;
      const [ex, ey] = step(x, y, a, R);
      const col = L.color;
      s += `<path d="M ${f(x)} ${f(y)} L ${f(ex)} ${f(ey)}" stroke="${col}" stroke-width="1.2" stroke-linecap="round"/>`;
      for (let i = 1; i <= n; i++) {
        const t = i / (n + 1);
        const [px, py] = step(x, y, a, R * t);
        for (const side of [-1, 1]) {
          const l = R * (0.45 - t * 0.25) * (L.feather || 1);
          const [qx, qy] = step(px, py, a + side * 50, l);
          s += `<path d="M ${f(px)} ${f(py)} L ${f(qx)} ${f(qy)}" stroke="${col}" stroke-width="${L.thick || 0.9}" stroke-linecap="round"/>`;
          for (const u of [0.45, 0.8]) {
            const [rx, ry] = step(px, py, a + side * 50, l * u);
            const [sx, sy] = step(rx, ry, a + side * 15, l * 0.4);
            const [tx, ty] = step(rx, ry, a + side * 85, l * 0.35);
            s += `<path d="M ${f(rx)} ${f(ry)} L ${f(sx)} ${f(sy)} M ${f(rx)} ${f(ry)} L ${f(tx)} ${f(ty)}" stroke="${col}" stroke-width="${(L.thick || 0.9) * 0.8}" stroke-linecap="round"/>`;
          }
        }
      }
      return s;
    }
    return leaf(x, y, a, sub, flip);
  }

  // =====================================================================
  // 花・実
  // =====================================================================
  function flower(x, y, F, r) {
    const c = F.color, c2 = F.center || '#ffd23f';
    const sz = F.size || 1;
    let s = '';
    const petal = (cx, cy, n, pr, col) => {
      let p = '';
      for (let i = 0; i < n; i++) {
        const a = (360 / n) * i;
        const [px, py] = step(cx, cy, a, pr);
        p += `<ellipse cx="${f(px)}" cy="${f(py)}" rx="${f(pr * 0.6)}" ry="${f(pr * 0.9)}" transform="rotate(${f(a)} ${f(px)} ${f(py)})" fill="${col}" stroke="${OUT}" stroke-width="0.6"/>`;
      }
      return p;
    };
    switch (F.type) {
      case 'daisy':
        s += petal(x, y, 12, 3.6 * sz, c) + `<circle cx="${f(x)}" cy="${f(y)}" r="${f(2.6 * sz)}" fill="${c2}" stroke="${OUT}" stroke-width="0.7"/>`;
        break;
      case 'star':
        s += petal(x, y, F.n || 5, 3 * sz, c) + `<circle cx="${f(x)}" cy="${f(y)}" r="${f(1.3 * sz)}" fill="${c2}"/>`;
        break;
      case 'cup':
        s += `<path d="M ${f(x - 5 * sz)} ${f(y - 4 * sz)} Q ${f(x)} ${f(y + 6 * sz)} ${f(x + 5 * sz)} ${f(y - 4 * sz)} L ${f(x + 2.5 * sz)} ${f(y - 1.5 * sz)} L ${f(x)} ${f(y - 5 * sz)} L ${f(x - 2.5 * sz)} ${f(y - 1.5 * sz)} Z" fill="${c}" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/>`;
        break;
      case 'trumpet': {
        const L = 16 * sz;
        s += `<path d="M ${f(x)} ${f(y)} L ${f(x - 2)} ${f(y - L * 0.7)} Q ${f(x - 7 * sz)} ${f(y - L)} ${f(x - 7 * sz)} ${f(y - L - 2)} L ${f(x + 7 * sz)} ${f(y - L - 2)} Q ${f(x + 7 * sz)} ${f(y - L)} ${f(x + 2)} ${f(y - L * 0.7)} Z" fill="${c}" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round" transform="rotate(${F.droop ? 160 : 15} ${f(x)} ${f(y)})"/>`;
        break;
      }
      case 'bells': {
        // 下向きのつりがね形の花が並ぶ（スズラン・ジギタリス）
        const n = F.n || 5;
        for (let i = 0; i < n; i++) {
          const bx = x + (F.side ? 3 : (i % 2 ? 3 : -3)), by = y + i * 5 * sz;
          s += `<path d="M ${f(bx - 2.6 * sz)} ${f(by + 3.2 * sz)} Q ${f(bx - 2.8 * sz)} ${f(by - 1.5 * sz)} ${f(bx)} ${f(by - 1.5 * sz)} Q ${f(bx + 2.8 * sz)} ${f(by - 1.5 * sz)} ${f(bx + 2.6 * sz)} ${f(by + 3.2 * sz)} Z" fill="${c}" stroke="${OUT}" stroke-width="0.7"/>`;
          if (F.spots) s += `<circle cx="${f(bx)}" cy="${f(by + 1.5 * sz)}" r="0.8" fill="${F.spots}"/>`;
        }
        break;
      }
      case 'spike': {
        // 穂のように小花がつく（ラベンダー・オオバコ・ジギタリス）
        const n = F.n || 7, h = (F.h || 18) * sz;
        s += `<path d="M ${f(x)} ${f(y)} L ${f(x)} ${f(y - h)}" stroke="${OUT}" stroke-width="0.8"/>`;
        for (let i = 0; i < n; i++) {
          const by = y - (h * i) / n - 2;
          const w = (F.w || 2.4) * sz * (1 - i / (n * 1.6));
          s += `<ellipse cx="${f(x - w * 0.5)}" cy="${f(by)}" rx="${f(w)}" ry="${f(w * 0.75)}" fill="${c}" stroke="${OUT}" stroke-width="0.5"/><ellipse cx="${f(x + w * 0.5)}" cy="${f(by - 1)}" rx="${f(w)}" ry="${f(w * 0.75)}" fill="${c}" stroke="${OUT}" stroke-width="0.5"/>`;
        }
        break;
      }
      case 'umbel': {
        // 傘のように小花が広がる（セリ科）
        const n = F.n || 7, R = 10 * sz;
        for (let i = 0; i < n; i++) {
          const a = -70 + (140 * i) / (n - 1);
          const [px, py] = step(x, y, a, R);
          s += `<path d="M ${f(x)} ${f(y)} L ${f(px)} ${f(py)}" stroke="${F.stem || '#6b9a44'}" stroke-width="0.6"/>`;
          for (let j = 0; j < 4; j++) s += `<circle cx="${f(px + (j - 1.5) * 1.3)}" cy="${f(py - (j % 2) * 1.2)}" r="${f(1 * sz)}" fill="${c}" stroke="${OUT}" stroke-width="0.35"/>`;
        }
        break;
      }
      case 'ball':
        // 小花が丸く集まる（ネギの仲間・シロツメクサ・アジサイ）
        for (let i = 0; i < (F.n || 14); i++) {
          const a = r() * 360, d = r() * 5 * sz;
          const [px, py] = step(x, y, a, d);
          s += F.petals
            ? petal(px, py, 4, 1.4 * sz, c)
            : `<circle cx="${f(px)}" cy="${f(py)}" r="${f(1.5 * sz)}" fill="${c}" stroke="${OUT}" stroke-width="0.5"/>`;
        }
        break;
      case 'hood': {
        // かぶと形（トリカブト）
        const n = F.n || 3;
        for (let i = 0; i < n; i++) {
          const by = y + i * 6;
          s += `<path d="M ${f(x - 3)} ${f(by + 3)} Q ${f(x - 4)} ${f(by - 4)} ${f(x + 1)} ${f(by - 4)} Q ${f(x + 4)} ${f(by - 3)} ${f(x + 3.5)} ${f(by + 1)} L ${f(x + 2)} ${f(by + 3.5)} Z" fill="${c}" stroke="${OUT}" stroke-width="0.7"/>`;
        }
        break;
      }
      case 'spider': {
        // 花びらが反り返り、しべが長い（ヒガンバナ・グロリオサ）
        for (let i = 0; i < 6; i++) {
          const a = -150 + i * 60;
          const [px, py] = step(x, y, a, 7 * sz);
          const [qx, qy] = step(x, y, a + 20, 11 * sz);
          s += `<path d="M ${f(x)} ${f(y)} Q ${f(px)} ${f(py)} ${f(qx)} ${f(qy)}" fill="none" stroke="${c}" stroke-width="${f(2.2 * sz)}" stroke-linecap="round"/>`;
          s += `<path d="M ${f(x)} ${f(y)} L ${f(step(x, y, a + 10, 13 * sz)[0])} ${f(step(x, y, a + 10, 13 * sz)[1])}" stroke="${c2}" stroke-width="0.5"/>`;
        }
        break;
      }
      case 'narcissus':
        s += petal(x, y, 6, 3.4 * sz, c) + `<circle cx="${f(x)}" cy="${f(y)}" r="${f(2.6 * sz)}" fill="${c2}" stroke="${OUT}" stroke-width="0.8"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(1.3 * sz)}" fill="#e98b1a"/>`;
        break;
      case 'plume': {
        // ススキの穂
        for (let i = 0; i < 7; i++) {
          const a = -30 + i * 10;
          const [px, py] = step(x, y, a, 14 * sz);
          s += `<path d="M ${f(x)} ${f(y)} Q ${f((x + px) / 2 + 2)} ${f((y + py) / 2)} ${f(px)} ${f(py)}" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/>`;
        }
        break;
      }
      case 'foxtail': {
        // エノコログサ（ねこじゃらし）の穂
        s += `<path d="M ${f(x)} ${f(y)} q 5 -8 10 -16" fill="none" stroke="${c}" stroke-width="${f(5 * sz)}" stroke-linecap="round"/>`;
        for (let i = 0; i < 12; i++) {
          const t = i / 11;
          const px = x + t * 10, py = y - t * 16;
          s += `<path d="M ${f(px)} ${f(py)} l ${f(-3 + r() * 6)} ${f(-3 + r() * 6)}" stroke="#d9c88c" stroke-width="0.6"/>`;
        }
        break;
      }
      case 'bud':
        s += `<ellipse cx="${f(x)}" cy="${f(y - 3)}" rx="${f(2.6 * sz)}" ry="${f(4.2 * sz)}" fill="${c}" stroke="${OUT}" stroke-width="0.8"/>`;
        break;
      default:
        s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(2.4 * sz)}" fill="${c}" stroke="${OUT}" stroke-width="0.6"/>`;
    }
    return s;
  }

  function fruit(x, y, R, r) {
    const c = R.color;
    let s = '';
    switch (R.type) {
      case 'cluster':
        // 房になった実（ヨウシュヤマゴボウ・ドクウツギ）
        for (let i = 0; i < (R.n || 9); i++) {
          const bx = x + (i % 3 - 1) * 3.6 + r() * 1.2, by = y + Math.floor(i / 3) * 3.6;
          s += `<circle cx="${f(bx)}" cy="${f(by)}" r="2" fill="${c}" stroke="${OUT}" stroke-width="0.6"/><circle cx="${f(bx - 0.6)}" cy="${f(by - 0.7)}" r="0.5" fill="#fff" opacity="0.7"/>`;
        }
        if (R.stem) s = `<path d="M ${f(x)} ${f(y - 3)} L ${f(x)} ${f(y + 11)}" stroke="${R.stem}" stroke-width="1.4"/>` + s;
        break;
      case 'spiny':
        // とげとげの実（チョウセンアサガオ）
        s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="5" ry="6" fill="${c}" stroke="${OUT}" stroke-width="0.8"/>`;
        for (let i = 0; i < 12; i++) {
          const a = i * 30;
          const [px, py] = step(x, y, a, 5.5), [qx, qy] = step(x, y, a, 8);
          s += `<path d="M ${f(px)} ${f(py)} L ${f(qx)} ${f(qy)}" stroke="${OUT}" stroke-width="0.8"/>`;
        }
        break;
      case 'star':
        // 星形の実（シキミ）
        for (let i = 0; i < 8; i++) {
          const a = i * 45;
          const [px, py] = step(x, y, a, 3.4);
          s += `<ellipse cx="${f(px)}" cy="${f(py)}" rx="1.6" ry="3" transform="rotate(${a} ${f(px)} ${f(py)})" fill="${c}" stroke="${OUT}" stroke-width="0.5"/>`;
        }
        break;
      default:
        s += `<circle cx="${f(x)}" cy="${f(y)}" r="${R.size || 2.2}" fill="${c}" stroke="${OUT}" stroke-width="0.6"/>`;
    }
    return s;
  }

  // =====================================================================
  // 植物
  // =====================================================================
  function plant(o, key) {
    const r = rng(hash(key));
    const L = { color: '#5fb544', len: 14, wid: 5, ...(o.leaf || {}) };
    // 茎につく葉・地面に広がる葉は小さく見えるので大きめに描く
    const grow = { stem: 1.35, shrub: 1.2, rosette: 1.5 }[o.habit || 'stem'] || 1;
    L.len *= grow; L.wid *= grow;
    if (L.rachis) L.rachis *= grow;
    const stemCol = o.stemColor || '#5b8a3a';
    const baseY = 94;
    let back = '', mid = '', front = '';

    const stemPath = (x1, y1, x2, y2, bend, w = o.stemW || 1.6, col = stemCol) =>
      `<path d="M ${f(x1)} ${f(y1)} Q ${f((x1 + x2) / 2 + bend)} ${f((y1 + y2) / 2)} ${f(x2)} ${f(y2)}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;

    // 茎の模様（ドクニンジンの紫の斑点など）
    const stemSpots = (x1, y1, x2, y2) => {
      if (!o.stemSpots) return '';
      let s = '';
      for (let i = 1; i < 7; i++) {
        const t = i / 7;
        s += `<ellipse cx="${f(x1 + (x2 - x1) * t)}" cy="${f(y1 + (y2 - y1) * t)}" rx="1" ry="1.6" fill="${o.stemSpots}"/>`;
      }
      return s;
    };

    const habit = o.habit || 'stem';
    const tops = []; // 花・実をつける位置

    if (habit === 'stem' || habit === 'shrub') {
      const n = o.stems || 1;
      const H = o.height || 62;
      for (let k = 0; k < n; k++) {
        const sx = 50 + (n === 1 ? 0 : -12 + (24 * k) / (n - 1)) + (r() - 0.5) * 3;
        const tilt = n === 1 ? (r() - 0.5) * 6 : -14 + (28 * k) / (n - 1);
        const h = H * (n === 1 ? 1 : 0.82 + r() * 0.18);
        const [tx, ty] = step(sx, baseY, tilt, h);
        mid += stemPath(sx, baseY, tx, ty, (r() - 0.5) * 6, o.stemW || (habit === 'shrub' ? 2 : 1.6));
        mid += stemSpots(sx, baseY, tx, ty);
        const nodes = o.nodes || 4;
        for (let i = 0; i < nodes; i++) {
          const t = 0.18 + (0.8 * i) / nodes;
          const px = sx + (tx - sx) * t, py = baseY + (ty - baseY) * t;
          const sc = 1 - t * (o.shrink ?? 0.45);
          const arr = o.arrange || 'opp';
          const ang = o.leafAngle || 58;
          if (arr === 'opp') {
            front += compound(px, py, tilt - ang, L, sc, i % 2 === 1) + compound(px, py, tilt + ang, L, sc);
          } else if (arr === 'whorl') {
            const m = o.whorl || 6;
            for (let j = 0; j < m; j++) front += compound(px, py, tilt - 80 + (160 * j) / (m - 1), L, sc);
          } else if (arr === 'many') {
            // 小さな葉がびっしり（ローズマリー・タイム）
            for (let j = 0; j < 3; j++) {
              const [qx, qy] = [px + (tx - sx) * j * 0.06, py + (ty - baseY) * j * 0.06];
              front += compound(qx, qy, tilt - ang + r() * 12, L, sc) + compound(qx, qy, tilt + ang - r() * 12, L, sc, j === 1);
            }
          } else {
            front += compound(px, py, tilt + (i % 2 ? ang : -ang), L, sc, i % 3 === 2);
          }
        }
        if (o.topLeaf !== false && o.arrange !== 'whorl') front += compound(tx, ty, tilt, L, 0.55);
        tops.push([tx, ty]);
      }
    } else if (habit === 'rosette') {
      const n = o.count || 7;
      for (let i = 0; i < n; i++) {
        const a = -80 + (160 * i) / (n - 1) + (r() - 0.5) * 8;
        const sc = 0.8 + r() * 0.25;
        (Math.abs(a) > 45 ? back : front);
        if (o.petiole) {
          const [px, py] = step(50, baseY, a, o.petiole * sc);
          mid += stemPath(50, baseY, px, py, 0, 1.2);
          front += compound(px, py, a, L, sc, i % 3 === 1);
        } else {
          front += compound(50, baseY, a, L, sc, i % 3 === 1);
        }
      }
      tops.push([50, baseY - 8]);
    } else if (habit === 'clump') {
      // 細長い葉がまとまって立つ（ニラ・スイセン・イネ科）
      const n = o.count || 7;
      const H = o.height || 60;
      const w = L.wid;
      for (let i = 0; i < n; i++) {
        const a = -(o.spread || 24) + (2 * (o.spread || 24) * i) / Math.max(1, n - 1) + (r() - 0.5) * 6;
        const h = H * (0.7 + r() * 0.3);
        const [tx, ty] = step(50 + (i - n / 2) * 0.8, baseY, a, h);
        const bend = (a > 0 ? 1 : -1) * (o.droop || 6) * r();
        const bx = 50 + (i - n / 2) * 0.8;
        const ctrlX = (bx + tx) / 2 + bend, ctrlY = (baseY + ty) / 2;
        const ww = w * (0.8 + r() * 0.3);
        mid += `<path d="M ${f(bx - ww / 2)} ${baseY} Q ${f(ctrlX - ww / 2)} ${f(ctrlY)} ${f(tx + bend)} ${f(ty)} Q ${f(ctrlX + ww / 2)} ${f(ctrlY)} ${f(bx + ww / 2)} ${baseY} Z" fill="${i % 2 && L.color2 ? L.color2 : L.color}" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/>`;
        if (L.midline) mid += `<path d="M ${f(bx)} ${baseY} Q ${f(ctrlX)} ${f(ctrlY)} ${f(tx + bend)} ${f(ty)}" fill="none" stroke="${L.midline}" stroke-width="0.8" opacity="0.8"/>`;
      }
      if (o.scape) {
        const [tx, ty] = step(51, baseY, 4, o.scape);
        mid += stemPath(51, baseY, tx, ty, 2, 1.3);
        tops.push([tx, ty]);
      }
    } else if (habit === 'stalks') {
      // 長い葉柄の先に葉（ミツバ・パセリ・セリ・ワサビ・ツワブキ）
      const n = o.count || 5;
      const H = o.height || 46;
      for (let i = 0; i < n; i++) {
        const a = -(o.spread || 38) + (2 * (o.spread || 38) * i) / Math.max(1, n - 1) + (r() - 0.5) * 8;
        const h = H * (0.75 + r() * 0.3);
        const bx = 50 + (i - n / 2) * 1.5;
        const [tx, ty] = step(bx, baseY, a, h);
        mid += stemPath(bx, baseY, tx, ty, (r() - 0.5) * 6, o.stemW || 1.3, i % 2 && o.stemColor2 ? o.stemColor2 : stemCol);
        mid += stemSpots(bx, baseY, tx, ty);
        front += compound(tx, ty, a * (o.leafTilt ?? 1), L, 0.85 + r() * 0.2, i % 3 === 2);
      }
      if (o.scape) {
        const [tx, ty] = step(50, baseY, 2, o.scape);
        mid += stemPath(50, baseY, tx, ty, 3, 1.4);
        mid += stemSpots(50, baseY, tx, ty);
        tops.push([tx, ty]);
      }
    } else if (habit === 'broad') {
      // 根元から幅の広い葉が数枚（ギョウジャニンニク・スズラン・ウルイ・バイケイソウ）
      const n = o.count || 3;
      for (let i = 0; i < n; i++) {
        const a = -(o.spread || 28) + (2 * (o.spread || 28) * i) / Math.max(1, n - 1);
        const bx = 50 + (i - (n - 1) / 2) * 2.5;
        const neck = o.neck || 10;
        const [px, py] = step(bx, baseY, a * 0.4, neck);
        mid += `<path d="M ${f(bx)} ${baseY} L ${f(px)} ${f(py)}" stroke="${o.neckColor || stemCol}" stroke-width="${o.neckW || 3}" stroke-linecap="round"/>`;
        front += compound(px, py, a, L, 0.9 + r() * 0.15, false);
      }
      if (o.scape) {
        const [tx, ty] = step(50, baseY, -3, o.scape);
        mid += stemPath(50, baseY, tx, ty, -2, 1.3);
        tops.push([tx, ty]);
      }
    } else if (habit === 'vine') {
      // つる（ヤブガラシ・ヘクソカズラ・ヒルガオ）
      let x = 22, y = baseY;
      let d = `M ${x} ${y}`;
      const pts = [];
      for (let i = 0; i < 5; i++) {
        const nx = 22 + i * 14, ny = baseY - 16 - i * 13 + (i % 2 ? 6 : -6);
        d += ` Q ${f((x + nx) / 2 + (i % 2 ? 10 : -10))} ${f((y + ny) / 2)} ${f(nx)} ${f(ny)}`;
        x = nx; y = ny;
        pts.push([nx, ny]);
      }
      mid += `<path d="${d}" fill="none" stroke="${stemCol}" stroke-width="1.6" stroke-linecap="round"/>`;
      pts.forEach(([px, py], i) => {
        front += compound(px, py, i % 2 ? 60 : -60, L, 0.9);
        mid += `<path d="M ${f(px)} ${f(py)} q 4 -2 3 -6 q -1 -3 2 -4" fill="none" stroke="${stemCol}" stroke-width="0.7"/>`;
      });
      tops.push(pts[pts.length - 1], pts[2]);
    }

    // ---- 特殊な形 ----
    let special = '';
    switch (o.special) {
      case 'fukinotou':
        special += `<path d="M 36 94 Q 30 70 50 54 Q 70 70 64 94 Z" fill="#b9d86a" stroke="${OUT}" stroke-width="1.2"/>`
          + `<path d="M 40 94 Q 36 76 50 64 Q 64 76 60 94 Z" fill="#d6ea8e" stroke="${OUT}" stroke-width="1"/>`
          + `<circle cx="50" cy="74" r="6" fill="#eef5c0" stroke="${OUT}" stroke-width="0.8"/>`
          + `<path d="M 32 94 Q 22 84 26 72 Q 36 80 40 94 Z M 68 94 Q 78 84 74 72 Q 64 80 60 94 Z" fill="#8fbf4a" stroke="${OUT}" stroke-width="1"/>`;
        break;
      case 'taranome':
        special += `<rect x="45" y="44" width="10" height="50" rx="3" fill="#a08066" stroke="${OUT}" stroke-width="1.2"/>`
          + [52, 62, 74, 84].map((y) => `<path d="M 45 ${y} l -3 -2 M 55 ${y + 4} l 3 -2" stroke="${OUT}" stroke-width="1"/>`).join('')
          + `<path d="M 44 46 Q 38 30 50 16 Q 62 30 56 46 Z" fill="#9ccc4e" stroke="${OUT}" stroke-width="1.1"/>`
          + `<path d="M 47 46 Q 45 34 50 24 Q 55 34 53 46" fill="none" stroke="#6b9a2c" stroke-width="1"/>`
          + `<path d="M 43 47 Q 50 41 57 47 L 56 50 L 44 50 Z" fill="#c45c3a" stroke="${OUT}" stroke-width="0.8"/>`;
        break;
      case 'kogomi':
        // くるりと巻いた新芽（コゴミ・ワラビ）
        [[38, 0], [52, 6], [64, -4]].forEach(([x, dy]) => {
          special += `<path d="M ${x} 94 Q ${x - 2} ${70 + dy} ${x + 4} ${52 + dy}" fill="none" stroke="${o.stemColor || '#6aa33a'}" stroke-width="3" stroke-linecap="round"/>`
            + `<circle cx="${x + 8}" cy="${50 + dy}" r="6" fill="${L.color}" stroke="${OUT}" stroke-width="1"/>`
            + `<path d="M ${x + 8} ${50 + dy} m -3 0 a 3 3 0 1 1 3 3" fill="none" stroke="${OUT}" stroke-width="0.9"/>`;
        });
        break;
      case 'sugina':
        // スギナ：節ごとに細い枝が輪生
        [[42, -6], [56, 5]].forEach(([x, a]) => {
          const [tx, ty] = step(x, baseY, a, 66);
          special += `<path d="M ${x} ${baseY} L ${f(tx)} ${f(ty)}" stroke="#5f9a3a" stroke-width="1.8"/>`;
          for (let i = 1; i < 9; i++) {
            const t = i / 9;
            const px = x + (tx - x) * t, py = baseY + (ty - baseY) * t;
            const l = 14 * (1 - t * 0.7);
            special += `<path d="M ${f(px - l)} ${f(py - l * 0.3)} Q ${f(px)} ${f(py + 2)} ${f(px + l)} ${f(py - l * 0.3)}" fill="none" stroke="#6fb048" stroke-width="1"/>`;
            special += `<circle cx="${f(px)}" cy="${f(py)}" r="1" fill="#2f5a22"/>`;
          }
        });
        break;
      case 'taro': {
        // クワズイモ：地上に太い茎が立つ
        special = `<path d="M 44 94 L 46 66 L 54 66 L 56 94 Z" fill="#8a9a5a" stroke="${OUT}" stroke-width="1.2"/>`
          + [70, 76, 82, 88].map((y) => `<path d="M 45 ${y} L 55 ${y}" stroke="${OUT}" stroke-width="0.6" opacity="0.5"/>`).join('');
        break;
      }
      case 'myoga':
        // ミョウガ：根元から花穂（食べる部分）が顔を出す
        special += [[40, 0], [58, 2]].map(([x]) => `<path d="M ${x} 95 Q ${x - 4} 86 ${x + 1} 80 Q ${x + 6} 86 ${x + 2} 95 Z" fill="#e58aa0" stroke="${OUT}" stroke-width="0.9"/><path d="M ${x} 94 Q ${x - 1} 87 ${x + 1} 82" fill="none" stroke="#b04f6a" stroke-width="0.6"/>`).join('');
        break;
      case 'wasabi':
        special += `<path d="M 42 96 L 44 84 Q 50 80 56 84 L 58 96 Z" fill="#9fc46a" stroke="${OUT}" stroke-width="1.1"/>`
          + [86, 90, 93].map((y) => `<path d="M 44 ${y} L 56 ${y}" stroke="${OUT}" stroke-width="0.5" opacity="0.6"/>`).join('');
        break;
      case 'hashiri':
        // ハシリドコロの芽：紫がかった芽が丸まって出る
        special += `<path d="M 40 94 Q 36 74 50 62 Q 64 74 60 94 Z" fill="#7d6a8a" stroke="${OUT}" stroke-width="1.1"/>`
          + `<path d="M 44 92 Q 40 76 50 66 Q 60 76 56 92" fill="none" stroke="#b8a6c8" stroke-width="1"/>`;
        break;
      case 'dokuzeri':
        // ドクゼリ：太い緑の地下茎に節（タケノコ状）
        special += `<path d="M 34 96 Q 32 86 40 84 L 62 84 Q 70 86 66 96 Z" fill="#a8c878" stroke="${OUT}" stroke-width="1.2"/>`
          + [42, 50, 58].map((x) => `<path d="M ${x} 84 L ${x} 96" stroke="${OUT}" stroke-width="0.8"/>`).join('');
        break;
      default: break;
    }

    if (o.base === 'redbase') {
      // 根元が赤紫（ギョウジャニンニク）
      mid += `<path d="M 44 94 L 46 80 L 54 80 L 56 94 Z" fill="#a8466a" stroke="${OUT}" stroke-width="1"/>`;
    } else if (o.base === 'bulb') {
      front += `<ellipse cx="50" cy="93" rx="${o.bulbR || 6}" ry="${(o.bulbR || 6) * 0.75}" fill="${o.bulbColor || '#f0ead6'}" stroke="${OUT}" stroke-width="1"/>`;
    } else if (o.base === 'runner') {
      // 白い走出枝（セリ）
      mid += `<path d="M 50 95 Q 30 93 14 96 M 50 95 Q 70 92 88 96" fill="none" stroke="#f3f0e2" stroke-width="2" stroke-linecap="round"/><path d="M 50 95 Q 30 93 14 96 M 50 95 Q 70 92 88 96" fill="none" stroke="${OUT}" stroke-width="0.4"/>`;
    }

    let tops2 = '';
    if (o.flower) tops.forEach(([x, y]) => { tops2 += flower(x, y - 1, o.flower, r); });
    if (o.fruit) {
      const fr = o.fruit;
      if (fr.at === 'side') tops2 += fruit(64, 52, fr, r);
      else tops.forEach(([x, y]) => { tops2 += fruit(x + (fr.dx || 0), y + (fr.dy || 0), fr, r); });
    }

    return back + mid + special + front + tops2;
  }

  // =====================================================================
  // きのこ
  // =====================================================================
  function capPath(shape, W, H) {
    // 原点はかさの下面の中心。上が負
    const w = W / 2;
    switch (shape) {
      case 'flat': return `M ${-w} 0 Q ${-w} ${-H * 0.9} 0 ${-H} Q ${w} ${-H * 0.9} ${w} 0 Q 0 ${H * 0.18} ${-w} 0 Z`;
      case 'umbo': return `M ${-w} 0 Q ${-w * 0.9} ${-H * 0.7} ${-w * 0.25} ${-H * 0.82} Q 0 ${-H * 1.25} ${w * 0.25} ${-H * 0.82} Q ${w * 0.9} ${-H * 0.7} ${w} 0 Q 0 ${H * 0.2} ${-w} 0 Z`;
      case 'funnel': return `M ${-w} ${-H} Q ${-w * 0.4} ${-H * 0.2} 0 ${-H * 0.35} Q ${w * 0.4} ${-H * 0.2} ${w} ${-H} Q ${w * 0.8} ${-H * 0.2} ${w * 0.15} ${H * 0.25} L ${-w * 0.15} ${H * 0.25} Q ${-w * 0.8} ${-H * 0.2} ${-w} ${-H} Z`;
      case 'conical': return `M ${-w} 0 Q ${-w * 0.5} ${-H * 0.6} 0 ${-H * 1.15} Q ${w * 0.5} ${-H * 0.6} ${w} 0 Q 0 ${H * 0.15} ${-w} 0 Z`;
      case 'bell': return `M ${-w} 0 Q ${-w} ${-H * 1.2} 0 ${-H * 1.1} Q ${w} ${-H * 1.2} ${w} 0 Q 0 ${-H * 0.15} ${-w} 0 Z`;
      case 'egg': return `M ${-w * 0.85} 0 Q ${-w * 1.05} ${-H * 1.1} 0 ${-H * 1.15} Q ${w * 1.05} ${-H * 1.1} ${w * 0.85} 0 Q 0 ${H * 0.1} ${-w * 0.85} 0 Z`;
      case 'shaggy': return `M ${-w * 0.6} 0 L ${-w * 0.7} ${-H * 1.2} Q 0 ${-H * 1.6} ${w * 0.7} ${-H * 1.2} L ${w * 0.6} 0 Z`;
      case 'trumpet': return `M ${-w} ${-H} Q ${-w * 0.3} ${-H * 0.6} 0 ${-H * 0.75} Q ${w * 0.3} ${-H * 0.6} ${w} ${-H} Q ${w * 0.5} ${-H * 0.2} ${w * 0.22} ${H * 0.7} L ${-w * 0.22} ${H * 0.7} Q ${-w * 0.5} ${-H * 0.2} ${-w} ${-H} Z`;
      default: return `M ${-w} 0 Q ${-w} ${-H * 1.05} 0 ${-H} Q ${w} ${-H * 1.05} ${w} 0 Q 0 ${H * 0.18} ${-w} 0 Z`; // convex
    }
  }

  // かさの模様
  function capPattern(o, W, H, r) {
    const p = o.pattern;
    const pc = o.patternColor || '#fff';
    const w = W / 2;
    let s = '';
    if (!p) return s;
    const inCap = (x, y) => y < -2 && Math.abs(x) < w * Math.sqrt(Math.max(0, 1 - Math.pow(-y / (H * 1.05), 2))) * 0.95;
    const scatter = (n, draw) => {
      let k = 0;
      for (let i = 0; i < n * 6 && k < n; i++) {
        const x = (r() * 2 - 1) * w, y = -r() * H;
        if (inCap(x, y)) { s += draw(x, y); k++; }
      }
    };
    switch (p) {
      case 'warts': scatter(o.patternN || 12, (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(1.1 + r() * 1.2)}" fill="${pc}" stroke="${OUT}" stroke-width="0.4"/>`); break;
      case 'patches': scatter(o.patternN || 6, (x, y) => `<path d="M ${f(x - 2.4)} ${f(y)} l 1.6 -1.6 l 2.6 0.5 l 0.6 1.8 l -2 1 Z" fill="${pc}" opacity="0.9"/>`); break;
      case 'scales': scatter(o.patternN || 14, (x, y) => `<path d="M ${f(x - 1.4)} ${f(y)} L ${f(x)} ${f(y - 2)} L ${f(x + 1.4)} ${f(y)} Z" fill="${pc}" opacity="0.85"/>`); break;
      case 'flecks': scatter(o.patternN || 12, (x, y) => `<path d="M ${f(x - 2)} ${f(y)} l 4 ${f((r() - 0.5) * 2)}" stroke="${pc}" stroke-width="1.3" stroke-linecap="round"/>`); break;
      case 'dots': scatter(o.patternN || 14, (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="0.8" fill="${pc}"/>`); break;
      case 'cracked': scatter(o.patternN || 9, (x, y) => `<path d="M ${f(x - 2.4)} ${f(y)} l 1.2 -1.6 l 2.4 0 l 1.2 1.6 l -1.2 1.6 l -2.4 0 Z" fill="none" stroke="${pc}" stroke-width="0.8"/>`); break;
      case 'dapple': scatter(o.patternN || 10, (x, y) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="2.2" ry="1.3" fill="${pc}" opacity="0.55"/>`); break;
      case 'fibers': case 'streaks':
        for (let i = -6; i <= 6; i++) {
          const x = (i / 6) * w * 0.9;
          s += `<path d="M ${f(x * 0.2)} ${f(-H * 0.95)} L ${f(x)} ${f(-H * 0.12)}" stroke="${pc}" stroke-width="${p === 'streaks' ? 1 : 0.6}" opacity="0.6"/>`;
        }
        break;
      case 'striate':
        for (let i = -7; i <= 7; i++) {
          const x = (i / 7) * w * 0.92;
          s += `<path d="M ${f(x * 0.8)} ${f(-H * 0.35 + Math.abs(i) * H * 0.04)} L ${f(x)} ${f(-1)}" stroke="${pc}" stroke-width="0.7" opacity="0.7"/>`;
        }
        break;
      case 'zones':
        for (const k of [0.3, 0.55, 0.8]) s += `<path d="M ${f(-w * k)} ${f(-H * (1 - k * 0.9))} Q 0 ${f(-H * (1.08 - k * 0.6))} ${f(w * k)} ${f(-H * (1 - k * 0.9))}" fill="none" stroke="${pc}" stroke-width="1.3" opacity="0.7"/>`;
        break;
      case 'shaggy':
        for (let row = 1; row <= 4; row++) for (let i = -2; i <= 2; i++) {
          const x = i * w * 0.28, y = -H * (row * 0.28);
          s += `<path d="M ${f(x - 1.6)} ${f(y)} Q ${f(x)} ${f(y + 3)} ${f(x + 1.6)} ${f(y)}" fill="none" stroke="${pc}" stroke-width="1.2"/>`;
        }
        break;
      default: break;
    }
    return s;
  }

  // ひだ・管孔・はり（かさの裏）
  function underside(o, W) {
    const w = W / 2;
    const c = o.gills || '#f3ead6';
    const t = o.under || 'gills';
    if (t === 'none') return '';
    let s = `<path d="M ${-w + 1} 0 Q 0 ${f(W * 0.12)} ${w - 1} 0 Q 0 ${f(W * 0.05)} ${-w + 1} 0 Z" fill="${c}" stroke="${OUT}" stroke-width="0.7"/>`;
    if (t === 'gills') {
      for (let i = -5; i <= 5; i++) {
        const x = (i / 5.5) * w;
        s += `<path d="M ${f(x * 0.25)} ${f(W * 0.07)} L ${f(x)} ${f(W * 0.02)}" stroke="${o.gillLine || OUT}" stroke-width="0.4" opacity="0.6"/>`;
      }
    } else if (t === 'pores') {
      for (let i = -4; i <= 4; i++) s += `<circle cx="${f((i / 4.5) * w * 0.8)}" cy="${f(W * 0.045)}" r="0.6" fill="${OUT}" opacity="0.35"/>`;
    } else if (t === 'spines') {
      for (let i = -5; i <= 5; i++) s += `<path d="M ${f((i / 5.5) * w)} ${f(W * 0.03)} l 0 3" stroke="${c}" stroke-width="1.2"/>`;
    }
    if (o.stains) for (let i = -2; i <= 2; i++) s += `<circle cx="${f(i * w * 0.3)}" cy="${f(W * 0.05)}" r="1" fill="${o.stains}"/>`;
    return s;
  }

  // 1本のきのこ（柄の根元 (x, y)、倍率 sc、傾き tilt）
  function shroom(x, y, sc, tilt, o, r) {
    const W = (o.capW || 30) * sc, H = (o.capH || 14) * sc;
    const sh = (o.stemH ?? 26) * sc, sw = (o.stemW || 6) * sc;
    const sCol = o.stemColor || '#f4ecd8';
    let s = `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(tilt)})">`;
    // つぼ（袋状）・根元のふくらみ
    if (o.volva === 'sack') {
      s += `<path d="M ${f(-sw * 1.1)} 0 Q ${f(-sw * 1.3)} ${f(-sw * 1.6)} ${f(-sw * 0.6)} ${f(-sw * 1.9)} L ${f(-sw * 0.3)} ${f(-sw * 1.2)} L ${f(sw * 0.3)} ${f(-sw * 1.2)} L ${f(sw * 0.6)} ${f(-sw * 1.9)} Q ${f(sw * 1.3)} ${f(-sw * 1.6)} ${f(sw * 1.1)} 0 Z" fill="${o.volvaColor || '#fbf8ef'}" stroke="${OUT}" stroke-width="0.9"/>`;
    }
    // 柄
    const base = o.bulb ? sw * 0.85 : sw * 0.55;
    const top = sw * (o.taper ?? 0.45);
    s += `<path d="M ${f(-base)} 0 Q ${f(-base * (o.bulb ? 1.4 : 1))} ${f(-sh * 0.25)} ${f(-top)} ${f(-sh)} L ${f(top)} ${f(-sh)} Q ${f(base * (o.bulb ? 1.4 : 1))} ${f(-sh * 0.25)} ${f(base)} 0 Z" fill="${sCol}" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/>`;
    if (o.stemPattern === 'zigzag') {
      for (let i = 1; i < 6; i++) s += `<path d="M ${f(-top * 1.1)} ${f(-sh * i / 6)} l ${f(top * 0.7)} -1.5 l ${f(top * 0.7)} 1.5 l ${f(top * 0.7)} -1.5" fill="none" stroke="${o.stemPatternColor || '#e2892d'}" stroke-width="0.9"/>`;
    } else if (o.stemPattern === 'net') {
      for (let i = 1; i < 5; i++) s += `<path d="M ${f(-top)} ${f(-sh * i / 5)} l ${f(top)} -2 l ${f(top)} 2 M ${f(-top)} ${f(-sh * i / 5 - 2)} l ${f(top)} 2 l ${f(top)} -2" fill="none" stroke="${o.stemPatternColor || '#8a6a3a'}" stroke-width="0.5"/>`;
    } else if (o.stemPattern === 'scaly') {
      for (let i = 1; i < 6; i++) s += `<path d="M ${f(-top * 0.6)} ${f(-sh * i / 6)} l 1 -1.5 M ${f(top * 0.4)} ${f(-sh * i / 6 - 1.5)} l 1 -1.5" stroke="${o.stemPatternColor || '#8a7a5a'}" stroke-width="0.8"/>`;
    } else if (o.stemPattern === 'dots') {
      for (let i = 1; i < 6; i++) s += `<circle cx="${f((i % 2 ? -1 : 1) * top * 0.4)}" cy="${f(-sh * i / 6)}" r="0.7" fill="${o.stemPatternColor || '#6a5a3a'}"/>`;
    } else if (o.stemPattern === 'fibrils') {
      s += `<path d="M ${f(-top * 0.4)} -2 L ${f(-top * 0.3)} ${f(-sh + 2)} M ${f(top * 0.3)} -2 L ${f(top * 0.25)} ${f(-sh + 2)}" stroke="${o.stemPatternColor || OUT}" stroke-width="0.5" opacity="0.5"/>`;
    }
    if (o.stain) s += `<ellipse cx="0" cy="${f(-sh * 0.12)}" rx="${f(base * 0.7)}" ry="${f(sh * 0.12)}" fill="${o.stain}" opacity="0.9"/>`;
    if (o.volva === 'rings') {
      for (let i = 0; i < 3; i++) s += `<path d="M ${f(-base * 1.1)} ${f(-sw * 0.4 * i - 1)} q ${f(base * 1.1)} 2 ${f(base * 2.2)} 0" fill="none" stroke="${o.volvaColor || '#fff'}" stroke-width="1.4"/>`;
    }
    // つば
    if (o.ring) {
      const ry = -sh * (o.ringAt || 0.72);
      const rw = top * 1.9;
      s += o.ringType === 'net'
        ? `<path d="M ${f(-top)} ${f(ry - 6)} L ${f(-rw * 2.4)} ${f(ry + 14)} L ${f(rw * 2.4)} ${f(ry + 14)} L ${f(top)} ${f(ry - 6)} Z" fill="${o.ring}" stroke="${OUT}" stroke-width="0.6" opacity="0.9"/>` + [...Array(6)].map((_, i) => `<path d="M ${f(-rw * 2.4 + i * rw * 0.96)} ${f(ry + 14)} L 0 ${f(ry - 6)}" stroke="${OUT}" stroke-width="0.4" opacity="0.5"/>`).join('')
        : `<path d="M ${f(-top)} ${f(ry - 2)} Q ${f(-rw * 1.2)} ${f(ry + 2)} ${f(-rw)} ${f(ry + 4)} L ${f(rw)} ${f(ry + 4)} Q ${f(rw * 1.2)} ${f(ry + 2)} ${f(top)} ${f(ry - 2)} Z" fill="${o.ring}" stroke="${OUT}" stroke-width="0.7"/>`;
    }
    // かさ
    s += `<g transform="translate(0 ${f(-sh)})">`;
    if (o.shape !== 'funnel' && o.shape !== 'trumpet') s += underside(o, W);
    s += `<path d="${capPath(o.shape, W, H)}" fill="${o.cap}" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/>`;
    if (o.cap2) s += `<ellipse cx="0" cy="${f(-H * 0.88)}" rx="${f(W * 0.16)}" ry="${f(H * 0.18)}" fill="${o.cap2}" opacity="0.9"/>`;
    if (o.shape === 'funnel' || o.shape === 'trumpet') {
      s += `<ellipse cx="0" cy="${f(-H)}" rx="${f(W / 2 - 1)}" ry="${f(H * 0.18)}" fill="${o.cap2 || o.cap}" stroke="${OUT}" stroke-width="0.8"/>`;
      if (o.under === 'ridges') for (let i = -3; i <= 3; i++) s += `<path d="M ${f(i * W * 0.03)} ${f(H * 0.5)} Q ${f(i * W * 0.08)} ${f(-H * 0.4)} ${f(i * W * 0.13)} ${f(-H * 0.85)}" fill="none" stroke="${o.gills || OUT}" stroke-width="0.7" opacity="0.8"/>`;
    }
    s += capPattern(o, W, H, r);
    if (o.slimy) s += `<path d="M ${f(-W * 0.3)} ${f(-H * 0.7)} Q ${f(-W * 0.1)} ${f(-H * 0.98)} ${f(W * 0.12)} ${f(-H * 0.9)}" fill="none" stroke="#fff" stroke-width="${f(1.4 * sc + 0.6)}" stroke-linecap="round" opacity="0.75"/>`;
    s += '</g></g>';
    return s;
  }

  // 特殊な形のきのこ
  function oddShroom(kind, o, r) {
    const c = o.cap, c2 = o.cap2 || o.cap;
    let s = '';
    switch (kind) {
      case 'shelf': {
        // 木から棚のように重なって生える（ヒラタケ・ツキヨタケ・ムキタケ）
        const n = o.count || 3;
        for (let i = 0; i < n; i++) {
          const y = 74 - i * 15, w = (o.capW || 34) * (1 - i * 0.12);
          const x = 30 + i * 6;
          s += `<path d="M 20 ${y + 4} Q ${x + w * 0.5} ${y - 14} ${x + w} ${y + 2} Q ${x + w * 0.6} ${y + 10} 20 ${y + 8} Z" fill="${c}" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/>`;
          s += `<path d="M 22 ${y + 8} Q ${x + w * 0.6} ${y + 10} ${x + w - 2} ${y + 3}" fill="none" stroke="${o.gills || '#efe6cf'}" stroke-width="2.4"/>`;
          if (o.cap2) s += `<path d="M 22 ${y + 3} Q ${x + w * 0.3} ${y - 6} ${x + w * 0.55} ${y - 4}" fill="none" stroke="${o.cap2}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>`;
          if (o.slimy) s += `<path d="M ${x + w * 0.35} ${y - 4} q 6 -3 10 -1" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/>`;
          if (o.pattern === 'fuzz') s += `<path d="M ${x + w * 0.2} ${y - 2} l 1 -2 M ${x + w * 0.4} ${y - 4} l 1 -2 M ${x + w * 0.6} ${y - 3} l 1 -2" stroke="${OUT}" stroke-width="0.5" opacity="0.6"/>`;
          if (o.stain && i === 0) s += `<ellipse cx="24" cy="${y + 6}" rx="4" ry="3" fill="${o.stain}"/>`;
        }
        if (o.glow) s = `<ellipse cx="44" cy="58" rx="34" ry="30" fill="#b8ffb0" opacity="0.35"/>` + s;
        return s;
      }
      case 'bracket': {
        // サルノコシカケ形（マスタケ・カンゾウタケ）
        for (let i = 0; i < (o.count || 2); i++) {
          const y = 68 - i * 20, w = 46 - i * 8;
          s += `<path d="M 18 ${y} Q ${18 + w * 0.6} ${y - 12} ${18 + w} ${y + 2} Q ${18 + w * 0.7} ${y + 8} 18 ${y + 9} Z" fill="${c}" stroke="${OUT}" stroke-width="1.1"/>`;
          s += `<path d="M 18 ${y + 9} Q ${18 + w * 0.7} ${y + 8} ${18 + w} ${y + 2}" fill="none" stroke="${o.gills || '#f6e6b0'}" stroke-width="2.6"/>`;
          if (o.pattern === 'dots') for (let k = 1; k < 6; k++) s += `<circle cx="${18 + w * k / 6}" cy="${y - 1}" r="0.9" fill="#fff" opacity="0.7"/>`;
        }
        return s;
      }
      case 'coral': {
        // ほうき状（ホウキタケ・ハナホウキタケ・ハナビラタケ風）
        const branch = (x, y, a, len, d) => {
          const [ex, ey] = step(x, y, a, len);
          let p = `<path d="M ${f(x)} ${f(y)} L ${f(ex)} ${f(ey)}" stroke="${d === 0 ? (o.stemColor || c) : c}" stroke-width="${f(5 - d * 1.2)}" stroke-linecap="round"/>`;
          if (d < 3) p += branch(ex, ey, a - 22, len * 0.72, d + 1) + branch(ex, ey, a + 22, len * 0.72, d + 1);
          else p += `<circle cx="${f(ex)}" cy="${f(ey)}" r="1.4" fill="${c2}"/>`;
          return p;
        };
        s += `<g stroke-linejoin="round">${branch(50, 92, 0, 22, 0)}${branch(42, 92, -18, 18, 1)}${branch(58, 92, 18, 18, 1)}</g>`;
        return `<g filter="url(#outline)">${s}</g>`;
      }
      case 'fingers': {
        // 指・棒状（カエンタケ）
        [[-14, 40, -14], [-4, 52, -4], [6, 46, 8], [16, 36, 18]].forEach(([dx, h, a]) => {
          const [ex, ey] = step(50 + dx, 92, a, h);
          s += `<path d="M ${f(50 + dx)} 92 L ${f(ex)} ${f(ey)}" stroke="${OUT}" stroke-width="9.5" stroke-linecap="round"/><path d="M ${f(50 + dx)} 92 L ${f(ex)} ${f(ey)}" stroke="${c}" stroke-width="7.5" stroke-linecap="round"/>`;
          s += `<path d="M ${f(50 + dx - 1.4)} 88 L ${f(ex - 1.4)} ${f(ey + 3)}" stroke="#fff" stroke-width="1.2" opacity="0.35" stroke-linecap="round"/>`;
        });
        return s;
      }
      case 'morel': case 'brain': {
        // アミガサタケ（網目）・シャグマアミガサタケ（脳みそ状）
        const isMorel = kind === 'morel';
        s += `<path d="M 42 94 L 43 70 L 57 70 L 58 94 Z" fill="${o.stemColor || '#f2e8d2'}" stroke="${OUT}" stroke-width="1"/>`;
        s += isMorel
          ? `<path d="M 36 72 Q 34 40 50 22 Q 66 40 64 72 Z" fill="${c}" stroke="${OUT}" stroke-width="1.2"/>`
          : `<path d="M 30 72 Q 24 50 36 40 Q 42 30 52 34 Q 62 28 68 40 Q 78 52 70 72 Z" fill="${c}" stroke="${OUT}" stroke-width="1.2"/>`;
        if (isMorel) {
          for (let y = 30; y < 70; y += 8) for (let x = 38; x < 63; x += 7) {
            const ox = (y / 8) % 2 ? 3 : 0;
            s += `<path d="M ${x + ox} ${y} l 3 2 l 0 4 l -3 2 l -3 -2 l 0 -4 Z" fill="${c2}" stroke="${OUT}" stroke-width="0.6"/>`;
          }
        } else {
          s += `<path d="M 34 60 Q 40 50 46 60 Q 52 48 58 58 Q 64 46 68 58 M 32 50 Q 40 40 46 48 Q 54 38 62 46 M 38 68 Q 48 60 56 68 Q 62 62 68 68" fill="none" stroke="${OUT}" stroke-width="0.9" opacity="0.7"/>`;
        }
        return s;
      }
      case 'ball': {
        // 丸い（ホコリタケ・ショウロ・ニセショウロ・トリュフ）
        const n = o.count || 2;
        for (let i = 0; i < n; i++) {
          const x = 50 + (i - (n - 1) / 2) * 24, R = (o.capW || 16) * (1 - i * 0.12);
          const y = 92 - R * (o.sunk ? 0.6 : 0.9);
          s += `<path d="M ${f(x - R)} ${f(y)} Q ${f(x - R)} ${f(y - R * 1.1)} ${f(x)} ${f(y - R * 1.05)} Q ${f(x + R)} ${f(y - R * 1.1)} ${f(x + R)} ${f(y)} Q ${f(x + R * 0.7)} ${f(y + R * 0.8)} ${f(x)} ${f(y + R * 0.75)} Q ${f(x - R * 0.7)} ${f(y + R * 0.8)} ${f(x - R)} ${f(y)} Z" fill="${c}" stroke="${OUT}" stroke-width="1.1"/>`;
          const pat = o.pattern;
          if (pat === 'warts') for (let k = 0; k < 10; k++) s += `<circle cx="${f(x + (r() - 0.5) * R * 1.4)}" cy="${f(y + (r() - 0.7) * R)}" r="0.9" fill="${o.patternColor || '#fff'}"/>`;
          if (pat === 'cracked') for (let k = 0; k < 6; k++) s += `<path d="M ${f(x + (r() - 0.5) * R * 1.3)} ${f(y + (r() - 0.7) * R)} l 2 -2 l 2 1" fill="none" stroke="${o.patternColor || OUT}" stroke-width="0.8"/>`;
          if (pat === 'bumps') for (let k = 0; k < 12; k++) s += `<path d="M ${f(x + (r() - 0.5) * R * 1.4)} ${f(y + (r() - 0.7) * R)} l 1.4 -2 l 1.4 2 Z" fill="${o.patternColor || '#000'}" opacity="0.5"/>`;
          if (o.cut && i === 0) s += `<path d="M ${f(x + R * 0.1)} ${f(y - R * 0.95)} L ${f(x + R * 0.1)} ${f(y + R * 0.7)} Q ${f(x + R)} ${f(y + R * 0.5)} ${f(x + R)} ${f(y)} Q ${f(x + R)} ${f(y - R)} ${f(x + R * 0.1)} ${f(y - R * 0.95)} Z" fill="${o.cut}" stroke="${OUT}" stroke-width="0.9"/>`;
        }
        return s;
      }
      case 'ear': {
        // キクラゲ（耳の形）・シロキクラゲ（花びら状のゼリー）
        const n = o.count || 3;
        for (let i = 0; i < n; i++) {
          const x = 30 + i * 18, y = 70 - (i % 2) * 14;
          s += `<path d="M ${x} ${y} Q ${x - 12} ${y - 16} ${x + 2} ${y - 22} Q ${x + 18} ${y - 20} ${x + 14} ${y - 4} Q ${x + 8} ${y + 4} ${x} ${y} Z" fill="${c}" stroke="${OUT}" stroke-width="1" opacity="${o.jelly ? 0.85 : 1}"/>`;
          s += `<path d="M ${x + 2} ${y - 4} Q ${x - 2} ${y - 14} ${x + 6} ${y - 16}" fill="none" stroke="${c2}" stroke-width="1.4" opacity="0.8"/>`;
          if (o.jelly) s += `<path d="M ${x + 4} ${y - 18} q 6 -1 7 4" fill="none" stroke="#fff" stroke-width="1.2" opacity="0.8"/>`;
        }
        return s;
      }
      case 'fronds': {
        // マイタケ・ハナビラタケ：へら形のかさが幾重にも重なる
        const n = o.count || 12;
        s += `<ellipse cx="50" cy="88" rx="16" ry="6" fill="${o.stemColor || '#efe8d8'}" stroke="${OUT}" stroke-width="1"/>`;
        for (let i = 0; i < n; i++) {
          const a = -80 + (160 * i) / (n - 1) + (r() - 0.5) * 10;
          const d = 14 + (i % 3) * 7;
          const [x, y] = step(50, 88, a, d);
          s += `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})"><path d="M -8 0 Q -9 -10 0 -11 Q 9 -10 8 0 Q 0 3 -8 0 Z" fill="${i % 2 ? c : c2}" stroke="${OUT}" stroke-width="0.9"/>${o.wavy ? '<path d="M -6 -3 q 3 -2 6 0 q 3 2 6 0" fill="none" stroke="#fff" stroke-width="0.6" opacity="0.6"/>' : ''}</g>`;
        }
        return s;
      }
      case 'pompom': {
        // ヤマブシタケ：白いはりが垂れ下がる
        s += `<ellipse cx="50" cy="54" rx="24" ry="20" fill="${c}" stroke="${OUT}" stroke-width="1.1"/>`;
        for (let x = 30; x <= 70; x += 3) s += `<path d="M ${x} ${56 + Math.abs(x - 50) * -0.3} l 0 ${f(10 - Math.abs(x - 50) * 0.18)}" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/><path d="M ${x} ${56 + Math.abs(x - 50) * -0.3} l 0 ${f(10 - Math.abs(x - 50) * 0.18)}" stroke="${OUT}" stroke-width="0.3" opacity="0.5"/>`;
        return s;
      }
      default: return s;
    }
  }

  // 地面・木
  function substrate(sub) {
    if (sub === 'log') {
      return `<path d="M -4 82 L 104 76 L 104 100 L -4 100 Z" fill="#8a6142" stroke="${OUT}" stroke-width="1.2"/>`
        + `<path d="M 4 88 L 40 86 M 50 92 L 96 88 M 20 95 L 70 93" stroke="#5e4029" stroke-width="1.2"/>`
        + `<ellipse cx="2" cy="91" rx="5" ry="9" fill="#c49a6c" stroke="${OUT}" stroke-width="1"/>`;
    }
    if (sub === 'trunk') {
      return `<path d="M 4 0 L 20 0 L 20 100 L 4 100 Z" fill="#8a6142" stroke="${OUT}" stroke-width="1.2"/>`
        + `<path d="M 8 10 L 9 40 M 14 30 L 15 70 M 9 60 L 10 95" stroke="#5e4029" stroke-width="1.2"/>`;
    }
    return '';
  }

  function mushroom(o, key) {
    const r = rng(hash(key));
    let s = substrate(o.on || (['shelf', 'bracket'].includes(o.form) ? 'trunk' : 'ground'));
    if (o.on === 'log' && o.form === 'shelf') s = substrate('trunk');
    if (o.form && o.form !== 'cap') return s + oddShroom(o.form, o, r);
    const n = o.count || 1;
    const baseY = o.on === 'log' ? 82 : 93;
    const items = [];
    for (let i = 0; i < n; i++) {
      const spread = o.tuft ? 10 : 13;
      const x = 50 + (n === 1 ? 0 : -spread + (2 * spread * i) / (n - 1)) + (r() - 0.5) * 4;
      const sc = n === 1 ? 1 : (i === Math.floor(n / 2) ? 1 : 0.7 + r() * 0.2) * (o.tuft ? 0.85 : 0.9);
      const tilt = o.tuft ? (x - 50) * 1.6 : (r() - 0.5) * 14;
      items.push([x, sc, tilt, i === Math.floor(n / 2) ? 1 : 0]);
    }
    items.sort((a, b) => a[3] - b[3]);
    // 背の高さに合わせて、枠いっぱいに大きく描く
    const tall = (o.stemH ?? 26) + (o.capH || 14) * 1.3;
    const zoom = Math.min(1.75, (baseY - 8) / tall, 88 / ((o.capW || 30) + (n > 1 ? 30 : 0)) * (o.tuft ? 1.25 : 1));
    s += `<g transform="translate(50 ${baseY}) scale(${f(zoom)}) translate(-50 ${-baseY})">`;
    items.forEach(([x, sc, tilt]) => {
      const bx = o.tuft ? 50 + (x - 50) * 0.25 : x;
      s += shroom(bx, baseY, sc, tilt, o, r);
    });
    s += '</g>';
    if (o.glow) s = `<ellipse cx="50" cy="60" rx="34" ry="30" fill="#b8ffb0" opacity="0.35"/>` + s;
    if (o.milk) s += `<circle cx="${50 + (o.capW || 30) * 0.3}" cy="${baseY - (o.stemH ?? 26) + 3}" r="1.6" fill="${o.milk}" stroke="${OUT}" stroke-width="0.4"/><circle cx="${50 + (o.capW || 30) * 0.3}" cy="${baseY - (o.stemH ?? 26) + 7}" r="1.2" fill="${o.milk}" stroke="${OUT}" stroke-width="0.4"/>`;
    return s;
  }

  // 輪郭を太く見せるフィルタ（ほうき形のきのこ用）
  const DEFS = '<filter id="outline" x="-10%" y="-10%" width="120%" height="120%"><feMorphology in="SourceAlpha" operator="dilate" radius="0.9" result="d"/><feFlood flood-color="#26323d"/><feComposite in2="d" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>';

  const cache = new Map();
  function render(sp) {
    if (cache.has(sp.id)) return cache.get(sp.id);
    const inner = sp.stage === 'kinoko' ? mushroom(sp.look, sp.id) : plant(sp.look, sp.id);
    const svg = wrap(inner, sp.label || '植物のイラスト', DEFS);
    cache.set(sp.id, svg);
    return svg;
  }

  return { render };
})();

if (typeof module !== 'undefined') module.exports = Art;
