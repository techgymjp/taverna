/*
 * 食べるな危険 ゲーム本体
 * 仲間のハンターのために、野山に次々と生えてくる植物・きのこから
 * 食べられるものだけを収穫する。雑草や毒を採るとライフが減り、ハンターが怒る。
 */
(() => {
  const TIME = 60000; // 1回の制限時間（ミリ秒）
  const LIVES = 3;
  const CELLS = 12; // 畑のマス（4 × 3）
  const STAGE_KEY = 'taberuna.stage';
  const CLEAR_KEY = 'taberuna.cleared';

  const $ = (id) => document.getElementById(id);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const lerp = (a, b, t) => a + (b - a) * Math.min(1, Math.max(0, t));
  const fill = (tpl, vars) => tpl.replace(/\{(\w)\}/g, (_, k) => vars[k]);

  const state = {
    stage: loadStage(), running: false, paused: false,
    elapsed: 0, last: 0, nextSpawn: 0, nextOrder: 0,
    score: 0, lives: LIVES, combo: 0, maxCombo: 0, harvested: 0,
    cells: [], order: null, basket: {}, mistakes: [], marks: [],
    rankingStage: 'herb', zukanStage: 'herb', zukanKind: 'all', lastRecord: null, raf: 0,
  };

  // ---------- ハンターのセリフ（{n} に名前が入る） ----------
  const ORDERS = [
    '腹ペコだ！{n}を採ってきてくれ！',
    '{n}が食いてえなあ。たのむぞ！',
    '今夜の鍋に{n}を入れたい！',
    'おい、{n}はあるか？見つけたら頼む！',
    '{n}で一杯やりたいねえ！',
  ];
  const PRAISES = ['うまそうだ！', 'いいぞ、その調子！', 'でかした！', 'それそれ、それが食いたかった！'];
  const ORDER_DONE = ['よし、{n}だ！ありがてえ！', 'これこれ！{n}だよ！'];
  // 間違えたときは、かならず「こら、それは○○だ！」と名前を言う
  const ANGRY_WEED = ['ただの雑草じゃねえか！', 'そんなもん食えるか！', 'よく見て採れ！'];
  const ANGRY_POISON = ['毒だぞ！食べるな危険！', 'みんなを殺す気か！', 'あぶねえ、そいつは毒だ！'];
  const LEVEL_UP = { 2: 'だんだん紛らわしいのが生えてきたぞ。', 3: 'ここからは山のプロでも迷う難所だ！' };

  // ---------- ハンターのイラスト ----------
  function hunterSvg(mood = 'normal') {
    const angry = mood === 'angry';
    const face = angry ? '#ff9c84' : '#f6c79a';
    const mouth = {
      normal: '<path d="M 52 82 Q 60 87 68 82" fill="none" stroke="#233050" stroke-width="3" stroke-linecap="round"/>',
      happy: '<path d="M 48 79 Q 60 96 72 79 Z" fill="#c4473a" stroke="#233050" stroke-width="2.5" stroke-linejoin="round"/>',
      angry: '<path d="M 47 86 Q 60 74 73 86 Z" fill="#7a1f1f" stroke="#233050" stroke-width="2.5" stroke-linejoin="round"/><path d="M 51 84 L 69 84" stroke="#fff" stroke-width="2.5"/>',
    }[mood];
    const eyes = mood === 'happy'
      ? '<path d="M 42 62 Q 47 56 52 62 M 68 62 Q 73 56 78 62" fill="none" stroke="#233050" stroke-width="3.5" stroke-linecap="round"/>'
      : `<circle cx="47" cy="62" r="${angry ? 3.4 : 4}" fill="#233050"/><circle cx="73" cy="62" r="${angry ? 3.4 : 4}" fill="#233050"/>`;
    const brows = angry
      ? '<path d="M 38 50 L 54 57 M 82 50 L 66 57" stroke="#233050" stroke-width="5" stroke-linecap="round"/>'
      : '<path d="M 39 54 L 53 51 M 81 54 L 67 51" stroke="#233050" stroke-width="5" stroke-linecap="round"/>';
    const vein = angry ? '<path d="M 86 30 l 6 6 m 0 -6 l -6 6 M 96 22 l 6 6 m 0 -6 l -6 6" stroke="#e8202a" stroke-width="3.5" stroke-linecap="round"/><path d="M 14 44 q -6 -8 0 -14 M 106 44 q 6 -8 0 -14" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"/>' : '';
    return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ハンター">
      <path d="M 10 124 Q 14 96 60 94 Q 106 96 110 124 Z" fill="#5b7a3a" stroke="#233050" stroke-width="3"/>
      <path d="M 34 100 L 34 124 M 86 100 L 86 124" stroke="#f08a1e" stroke-width="8"/>
      <path d="M 50 95 L 60 108 L 70 95" fill="#c8402a" stroke="#233050" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="28" cy="66" r="7" fill="${face}" stroke="#233050" stroke-width="2.5"/>
      <circle cx="92" cy="66" r="7" fill="${face}" stroke="#233050" stroke-width="2.5"/>
      <ellipse cx="60" cy="66" rx="32" ry="30" fill="${face}" stroke="#233050" stroke-width="3"/>
      <path d="M 30 72 Q 32 100 60 101 Q 88 100 90 72 Q 82 84 72 80 Q 60 90 48 80 Q 38 84 30 72 Z" fill="#6a4630" stroke="#233050" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M 44 76 Q 52 71 60 75 Q 68 71 76 76" fill="none" stroke="#6a4630" stroke-width="6" stroke-linecap="round"/>
      ${mouth}
      <path d="M 26 46 Q 26 14 60 14 Q 94 14 94 46 Z" fill="#f08a1e" stroke="#233050" stroke-width="3" stroke-linejoin="round"/>
      <path d="M 20 46 Q 60 38 104 48 Q 102 54 92 52 Q 60 46 26 52 Z" fill="#e0701a" stroke="#233050" stroke-width="3" stroke-linejoin="round"/>
      <path d="M 40 24 Q 60 20 80 24" fill="none" stroke="#ffd09a" stroke-width="3" stroke-linecap="round"/>
      ${brows}${eyes}
      <circle cx="40" cy="74" r="4.5" fill="#ff8a7a" opacity=".6"/><circle cx="80" cy="74" r="4.5" fill="#ff8a7a" opacity=".6"/>
      ${vein}
    </svg>`;
  }

  function setHunter(id, mood) {
    const el = $(id);
    el.innerHTML = hunterSvg(mood);
    el.classList.toggle('angry', mood === 'angry');
    el.classList.remove('talk');
    void el.offsetWidth; // アニメーションをやり直す
    el.classList.add('talk');
  }

  // ---------- 画面切り替え ----------
  function show(name) {
    document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === `screen-${name}`));
    window.scrollTo(0, 0);
  }

  // ---------- 保存 ----------
  function loadStage() {
    try {
      const s = localStorage.getItem(STAGE_KEY);
      return STAGES.some((x) => x.id === s) && isUnlocked(s) ? s : 'herb';
    } catch { return 'herb'; }
  }
  function cleared() {
    try { return JSON.parse(localStorage.getItem(CLEAR_KEY)) || {}; } catch { return {}; }
  }
  function markCleared(stage) {
    const c = cleared();
    c[stage] = true;
    try { localStorage.setItem(CLEAR_KEY, JSON.stringify(c)); } catch { /* 保存できなくても遊べる */ }
  }
  function isUnlocked(stageId) {
    const st = STAGES.find((s) => s.id === stageId);
    return !st.unlock || !!cleared()[st.unlock];
  }

  const stageOf = (id) => STAGES.find((s) => s.id === id);
  const poolOf = (stage) => SPECIES.filter((s) => s.stage === stage);

  // ---------- 紙吹雪 ----------
  const COLORS = ['#ff5c8a', '#ffd23f', '#3ec6e0', '#3ddc84', '#ff9f43', '#9b6dff'];
  function confetti(target, count = 24) {
    const rect = target ? target.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 3, width: 0, height: 0 };
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    const box = $('confetti');
    for (let i = 0; i < count; i++) {
      const p = document.createElement('i');
      const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 160;
      p.style.left = `${cx}px`;
      p.style.top = `${cy}px`;
      p.style.background = pick(COLORS);
      p.style.setProperty('--dx', `${Math.cos(a) * d}px`);
      p.style.setProperty('--dy', `${Math.sin(a) * d + 120}px`);
      p.style.setProperty('--r', `${Math.random() * 720 - 360}deg`);
      box.appendChild(p);
      setTimeout(() => p.remove(), 1100);
    }
  }

  // ---------- イラストを枠いっぱいに ----------
  // 絵の余白を切り詰めて、枠いっぱいに大きく見せる（根元・地面は下にそろえる）
  function fitArt(root) {
    requestAnimationFrame(() => {
      root.querySelectorAll('svg').forEach((svg) => {
        if (svg.dataset.fit) return;
        // 背景（丸太・幹）はいったん隠して、本体だけの大きさをはかる
        const subs = svg.querySelectorAll('.sub');
        subs.forEach((g) => { g.style.display = 'none'; });
        let bb;
        try { bb = svg.getBBox(); } catch { bb = null; }
        subs.forEach((g) => { g.style.display = ''; });
        if (!bb || !bb.width || !bb.height) return;
        const pad = 3;
        const size = Math.max(bb.width, bb.height, 30) + pad * 2;
        const x = bb.x + bb.width / 2 - size / 2;
        const y = Math.min(bb.y - pad, bb.y + bb.height + pad - size);
        svg.setAttribute('viewBox', `${x.toFixed(1)} ${y.toFixed(1)} ${size.toFixed(1)} ${size.toFixed(1)}`);
        svg.dataset.fit = '1';
      });
    });
  }

  // ---------- タイトル ----------
  function renderTitle() {
    // 食べられるものと、そっくりな毒のペアを並べて見せる
    const pairs = SPECIES.filter((s) => s.kind === 'poison' && Array.isArray(s.like));
    const bad = pick(pairs);
    const good = SPECIES_BY_ID[pick(bad.like)];
    $('title-vs').innerHTML = `<figure class="ok">${Art.render(good)}<figcaption>${good.name}<small>食べられる</small></figcaption></figure><span class="vs">VS</span><figure class="ng">${Art.render(bad)}<figcaption>${bad.name}<small>毒</small></figcaption></figure>`;
    $('title-hunter').innerHTML = hunterSvg('happy');
    renderStages();
    show('title');
    fitArt($('title-vs'));
    Sound.startBgm('title');
  }

  function renderStages() {
    const box = $('stages');
    box.innerHTML = '';
    STAGES.forEach((st) => {
      const open = isUnlocked(st.id);
      const pool = poolOf(st.id);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `stage stage-${st.id}`;
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', String(st.id === state.stage));
      btn.disabled = !open;
      btn.innerHTML = `<span class="icon">${open ? st.icon : '🔒'}</span><b>${st.label}</b>`
        + `<small>${open ? `${pool.length}種・ノルマ${st.quota}個` : `${stageOf(st.unlock).label}をクリアで解放`}</small>`
        + (cleared()[st.id] ? '<em class="cleared">CLEAR</em>' : '');
      btn.addEventListener('click', () => {
        state.stage = st.id;
        try { localStorage.setItem(STAGE_KEY, st.id); } catch { /* 保存できなくても遊べる */ }
        Sound.play('tap');
        renderStages();
      });
      box.appendChild(btn);
    });
    const top = Ranking.list(state.stage)[0];
    $('best-score').textContent = top ? `🏆 ${stageOf(state.stage).label}の1位：${top.score}点（${top.name}）` : '';
  }

  // ---------- 畑 ----------
  function buildField() {
    const field = $('field');
    field.innerHTML = '';
    field.dataset.stage = state.stage;
    state.cells = [];
    for (let i = 0; i < CELLS; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'plot';
      btn.setAttribute('aria-label', '空いている地面');
      btn.addEventListener('pointerdown', (e) => { e.preventDefault(); tap(i); });
      btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(i); } });
      field.appendChild(btn);
      state.cells.push({ el: btn, item: null });
    }
  }

  // 経過時間から、出てくる種のむずかしさの上限を決める
  const maxLevel = () => (state.elapsed < 15000 ? 1 : state.elapsed < 35000 ? 2 : 3);

  function available(kindFilter) {
    const lv = maxLevel();
    return poolOf(state.stage).filter((s) => kindFilter(s.kind) && s.level <= lv);
  }

  // 次に生える種を決める（注文の品や、そっくりな毒が混ざりやすい）
  function chooseSpecies() {
    const goods = available((k) => k === 'good');
    const bads = available((k) => k !== 'good');
    if (Math.random() < 0.52) {
      if (state.order && Math.random() < 0.25) return state.order;
      return pick(goods);
    }
    if (Math.random() < 0.4) {
      const target = state.order && Math.random() < 0.6 ? state.order : pick(goods);
      const looks = bads.filter((b) => Array.isArray(b.like) && b.like.includes(target.id));
      if (looks.length) return pick(looks);
    }
    return pick(bads);
  }

  function spawn() {
    const empty = state.cells.filter((c) => !c.item);
    if (!empty.length) return;
    const cell = pick(empty);
    const sp = chooseSpecies();
    const t = state.elapsed / TIME;
    const life = lerp(3600, 2200, t) * (0.85 + Math.random() * 0.3);
    cell.item = { sp, born: state.elapsed, life };
    // 丸太・木の幹に生えるきのこは、幹が畑の外へ飛び出さないよう控えめに拡大する
    const onWood = sp.stage === 'kinoko' && (sp.look.on || ['shelf', 'bracket'].includes(sp.look.form));
    cell.el.innerHTML = `<span class="sprout"${onWood ? ' data-wood' : ''}>${Art.render(sp)}</span>`;
    cell.el.className = 'plot grow';
    cell.el.setAttribute('aria-label', 'なにか生えている');
  }

  function clearCell(cell, cls, delay = 450) {
    cell.item = null;
    cell.el.className = `plot ${cls}`;
    cell.el.setAttribute('aria-label', '空いている地面');
    const el = cell.el;
    setTimeout(() => {
      if (!state.cells.some((c) => c.el === el && c.item)) {
        el.className = 'plot';
        el.innerHTML = '';
      }
    }, delay);
  }

  // 引き抜いたときに根元から舞い上がる土ぼこり
  function dust(cell) {
    const box = document.createElement('span');
    box.className = 'dust';
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('i');
      const a = (-160 + Math.random() * 140) * Math.PI / 180; // 上向きに広がる
      const d = 26 + Math.random() * 44;
      const size = 14 + Math.random() * 16;
      p.style.width = p.style.height = `${size}px`;
      p.style.setProperty('--dx', `${Math.cos(a) * d}px`);
      p.style.setProperty('--dy', `${Math.sin(a) * d}px`);
      p.style.animationDelay = `${Math.random() * 60}ms`;
      box.appendChild(p);
    }
    cell.el.appendChild(box);
    setTimeout(() => box.remove(), 800);
  }

  // 浮かび上がる文字（+10 など）
  function floatText(cell, text, cls) {
    const s = document.createElement('span');
    s.className = `float ${cls}`;
    s.textContent = text;
    cell.el.appendChild(s);
  }

  // ---------- 注文 ----------
  function newOrder() {
    const goods = available((k) => k === 'good');
    // そっくりな毒がある品を優先して注文する
    const tricky = goods.filter((g) => SPECIES.some((b) => b.kind !== 'good' && Array.isArray(b.like) && b.like.includes(g.id)));
    let next = pick(Math.random() < 0.6 && tricky.length ? tricky : goods);
    if (state.order && next.id === state.order.id) next = pick(goods);
    state.order = next;
    state.nextOrder = state.elapsed + 10000;
    const lv = maxLevel();
    const intro = lv > state.shownLevel ? LEVEL_UP[lv] || '' : '';
    state.shownLevel = lv;
    const line = intro + pick(ORDERS);
    $('order').innerHTML = fill(line, { n: `<span class="target">${next.name}</span>` }) + '<small>（注文の品は3倍！）</small>';
    setHunter('play-hunter', 'normal');
    Sound.play('order');
    Sound.say(fill(line, { n: next.name }));
  }

  // ---------- タップ ----------
  function tap(i) {
    if (!state.running || state.paused) return;
    const cell = state.cells[i];
    const item = cell.item;
    if (!item) return;
    const sp = item.sp;
    if (sp.kind === 'good') {
      const isOrder = state.order && sp.id === state.order.id;
      state.combo++;
      state.maxCombo = Math.max(state.maxCombo, state.combo);
      state.harvested++;
      const pts = (isOrder ? 30 : 10) + Math.min(state.combo - 1, 10) * 2;
      state.score += pts;
      state.basket[sp.id] = (state.basket[sp.id] || 0) + 1;
      state.marks.push(isOrder ? '⭐' : '🌿');
      floatText(cell, `+${pts}`, isOrder ? 'order' : 'ok');
      dust(cell);
      clearCell(cell, 'picked');
      Sound.play('harvest', state.combo, isOrder);
      if (isOrder) {
        confetti(cell.el, 30);
        const line = fill(pick(ORDER_DONE), { n: sp.name });
        $('order').textContent = line;
        setHunter('play-hunter', 'happy');
        Sound.say(line);
        state.order = null;
        state.nextOrder = state.elapsed + 1400;
      } else if (state.combo % 5 === 0) {
        $('order').textContent = `${state.combo}連続！${pick(PRAISES)}`;
        setHunter('play-hunter', 'happy');
        state.nextOrder = Math.max(state.nextOrder, state.elapsed + 1400);
        state.order = null;
      }
    } else {
      mistake(cell, sp);
    }
    updateHud();
  }

  function mistake(cell, sp) {
    state.combo = 0;
    state.lives--;
    state.marks.push(sp.kind === 'poison' ? '☠️' : '🌾');
    if (!state.mistakes.includes(sp)) state.mistakes.push(sp);
    const poison = sp.kind === 'poison';
    floatText(cell, `${poison ? '☠' : '🌾'} ${sp.name}`, 'ng');
    clearCell(cell, 'bad', 700);
    const line = `こら、それは${sp.name}だ！${pick(poison ? ANGRY_POISON : ANGRY_WEED)}`;
    $('order').textContent = line;
    setHunter('play-hunter', 'angry');
    Sound.play(poison ? 'poison' : 'miss');
    Sound.say(line);
    const stamp = $('stamp');
    stamp.textContent = poison ? '食べるな危険！' : 'それは雑草だ！';
    stamp.className = `stamp ${poison ? 'poison' : 'weed'}`;
    stamp.hidden = false;
    clearTimeout(mistake.timer);
    mistake.timer = setTimeout(() => { stamp.hidden = true; }, 1000);
    $('field').classList.remove('shake');
    void $('field').offsetWidth;
    $('field').classList.add('shake');
    // 怒ったあと、少しして次の注文へ
    state.order = null;
    state.nextOrder = state.elapsed + 1800;
    if (state.lives <= 0) {
      state.running = false;
      setTimeout(finish, 900);
    }
  }

  // ---------- HUD ----------
  function updateHud() {
    const st = stageOf(state.stage);
    $('hud-lives').innerHTML = [...Array(LIVES)].map((_, i) => `<span class="${i < state.lives ? 'on' : 'off'}">❤</span>`).join('');
    $('hud-score').textContent = `${state.score}点`;
    const h = $('hud-harvest');
    h.textContent = `収穫 ${state.harvested} / ${st.quota}`;
    h.classList.toggle('done', state.harvested >= st.quota);
    const combo = $('hud-combo');
    combo.hidden = state.combo < 2;
    combo.textContent = `🔥 ${state.combo}連続`;
  }

  function updateTimer() {
    const left = Math.max(0, TIME - state.elapsed);
    $('hud-time').style.width = `${(left / TIME) * 100}%`;
    const sec = Math.ceil(left / 1000);
    const el = $('hud-sec');
    if (el.textContent !== String(sec)) {
      el.textContent = sec;
      if (sec <= 5 && sec > 0 && state.running) Sound.play('tick');
    }
    $('hud-time').parentElement.classList.toggle('hurry', sec <= 10);
  }

  // ---------- ゲームの進行 ----------
  function loop(now) {
    if (!state.running) return;
    const dt = Math.min(100, now - state.last);
    state.last = now;
    if (!state.paused) {
      state.elapsed += dt;
      const t = state.elapsed / TIME;
      if (state.elapsed >= state.nextSpawn) {
        spawn();
        // 時間がたつほど早く生える
        state.nextSpawn = state.elapsed + lerp(900, 420, t) * (0.8 + Math.random() * 0.4);
        if (Math.random() < lerp(0.1, 0.35, t)) spawn();
      }
      if (state.elapsed >= state.nextOrder) newOrder();
      // 時間切れの植物はしおれて消える
      state.cells.forEach((c) => {
        if (!c.item) return;
        const age = state.elapsed - c.item.born;
        if (age > c.item.life) clearCell(c, 'gone', 400);
        else if (age > c.item.life - 700) c.el.classList.add('wilt');
      });
      updateTimer();
      if (state.elapsed >= TIME) {
        state.running = false;
        finish();
        return;
      }
    }
    state.raf = requestAnimationFrame(loop);
  }

  function start() {
    if (!isUnlocked(state.stage)) state.stage = 'herb';
    Sound.stopBgm();
    Sound.play('depart');
    Object.assign(state, {
      running: false, paused: false, elapsed: 0, nextSpawn: 0, nextOrder: 0, shownLevel: 1,
      score: 0, lives: LIVES, combo: 0, maxCombo: 0, harvested: 0, order: null, basket: {}, mistakes: [], marks: [],
    });
    cancelAnimationFrame(state.raf);
    buildField();
    updateHud();
    updateTimer();
    show('play');
    document.querySelector('.field-wrap').dataset.stage = state.stage;
    const st = stageOf(state.stage);
    const intro = `${st.place}に着いたぞ！${st.desc}`;
    $('order').textContent = intro;
    setHunter('play-hunter', 'normal');
    // 出発のファンファーレを聞かせてから、ハンターのひとことと3・2・1
    clearTimeout(start.timer);
    start.timer = setTimeout(() => {
      Sound.say(intro);
      countdown(3);
    }, 1100);
  }

  function countdown(n) {
    // カウントダウン中に小屋へ戻ったら止める
    if (!$('screen-play').classList.contains('active')) return;
    const el = $('countdown');
    el.hidden = false;
    el.textContent = n || 'スタート！';
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
    if (n) Sound.play('count', n);
    else Sound.play('go');
    if (n) {
      setTimeout(() => countdown(n - 1), 750);
    } else {
      setTimeout(() => { el.hidden = true; }, 500);
      Sound.startBgm('play');
      state.running = true;
      state.last = performance.now();
      state.nextOrder = 600;
      state.raf = requestAnimationFrame(loop);
    }
  }

  // タブを切り替えたら一時停止
  document.addEventListener('visibilitychange', () => {
    state.paused = document.hidden;
    if (!document.hidden) state.last = performance.now();
  });

  // ---------- 結果 ----------
  function rankOf(win, harvested, quota) {
    if (!win) {
      return state.lives <= 0
        ? { title: '🤢 腹をこわした新入り', msg: 'おいおい、毒や雑草ばっかりじゃねえか！図鑑でしっかり勉強してこい！', mood: 'angry' }
        : { title: '🌱 見習いハンター', msg: `収穫が足りねえな。ノルマは${quota}個だ。もっと手早く見分けろ！`, mood: 'normal' };
    }
    if (harvested >= quota * 1.6) return { title: '👑 伝説の山の達人', msg: 'こいつはたまげた！今夜はごちそうだ。お前こそ山の達人だ！', mood: 'happy' };
    if (harvested >= quota * 1.3) return { title: '🏹 一流ハンター', msg: 'いい目をしてるな！仲間たちも大喜びだ！', mood: 'happy' };
    return { title: '🎒 一人前のハンター', msg: 'よくやった！これでみんな腹いっぱいだ。', mood: 'happy' };
  }

  function finish() {
    state.running = false;
    cancelAnimationFrame(state.raf);
    const st = stageOf(state.stage);
    const win = state.lives > 0 && state.harvested >= st.quota;
    const rank = rankOf(win, state.harvested, st.quota);
    const firstClear = win && !cleared()[st.id];
    if (win) markCleared(st.id);

    $('r-title').textContent = win ? '🎉 ミッション成功！' : state.lives <= 0 ? '💀 ミッション失敗…' : '⌛ ノルマ未達成…';
    $('r-title').className = `result-title ${win ? 'win' : 'lose'}`;
    $('r-stage').textContent = `${st.icon} ${st.label}`;
    $('r-score').textContent = state.score;
    $('r-detail').textContent = `収穫 ${state.harvested}個（ノルマ${st.quota}）・最大${state.maxCombo}連続・ミス${LIVES - state.lives}回`;
    $('r-rank').textContent = rank.title;
    $('r-msg').textContent = rank.msg;

    const next = STAGES.find((s) => s.unlock === st.id);
    $('r-unlock').hidden = !(firstClear && next);
    if (next) $('r-unlock').textContent = `${next.icon} ${next.label}が解放された！`;
    $('btn-next-stage').hidden = !(win && next);
    if (next) $('btn-next-stage').textContent = `${next.label}へ進む ▶`;

    const name = Ranking.getName() || Ranking.DEFAULT_NAME;
    const rec = Ranking.add(st.id, { name, score: state.score, harvest: state.harvested, win, title: rank.title });
    state.lastRecord = rec.id;
    $('r-rankin').hidden = !rec.rank;
    $('r-rankin').textContent = rec.rank === 1 ? '🎉 ランキング 1位 更新！' : `ランキング ${rec.rank}位 にランクイン！`;

    // 収穫したもの
    const got = Object.entries(state.basket).sort((a, b) => b[1] - a[1]);
    $('r-basket').innerHTML = got.length
      ? `<h3>🧺 収穫したもの</h3><div class="basket-items">${got.map(([id, n]) => `<figure>${Art.render(SPECIES_BY_ID[id])}<figcaption>${SPECIES_BY_ID[id].name}<b>×${n}</b></figcaption></figure>`).join('')}</div>`
      : '';
    $('review').innerHTML = state.mistakes.length
      ? `<h3>まちがえて採ったものをおさらい</h3>${state.mistakes.map(speciesCard).join('')}`
      : '';
    setupShare(rank, win);
    show('result');
    fitArt($('r-basket'));
    fitArt($('review'));
    setHunter('result-hunter', rank.mood);

    Sound.stopBgm();
    Sound.play('fanfare', win);
    // ファンファーレのあとは、タイトルの曲に戻す
    clearTimeout(finish.bgm);
    finish.bgm = setTimeout(() => {
      if ($('screen-result').classList.contains('active')) Sound.startBgm('title');
    }, 2800);
    setTimeout(() => Sound.say(rank.msg), 1500);
    if (win) {
      confetti(null, 60);
      setTimeout(() => confetti(null, 60), 500);
    }
  }

  // ---------- SNS シェア ----------
  // シェアするリンク先（ゲームの紹介記事）
  const SHARE_URL = 'https://techgym.jp/column/claude-code-game-taverna/';
  const HASHTAG = '食べるな危険';
  let shareText = '';

  function setupShare(rank, win) {
    const st = stageOf(state.stage);
    const marks = state.marks.slice(0, 40).join('');
    $('share-marks').textContent = marks;
    shareText = `食べるな危険【${st.label}】で ${state.score}点！収穫${state.harvested}個${win ? '（ミッション成功）' : ''}\n称号：${rank.title}`;
    const enc = encodeURIComponent;
    $('share-x').href = `https://twitter.com/intent/tweet?text=${enc(shareText)}&url=${enc(SHARE_URL)}&hashtags=${enc(HASHTAG)}`;
    $('share-line').href = `https://line.me/R/msg/text/?${enc(`${shareText}\n${SHARE_URL}`)}`;
    $('share-fb').href = `https://www.facebook.com/sharer/sharer.php?u=${enc(SHARE_URL)}`;
    $('share-native').hidden = !navigator.share;
    $('share-toast').textContent = '';
  }

  function toast(msg) {
    const el = $('share-toast');
    el.textContent = msg;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => { el.textContent = ''; }, 2500);
  }

  async function copyShare() {
    const text = `${shareText}\n${SHARE_URL} #${HASHTAG}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // クリップボード API が使えない環境向け
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    toast('コピーしました！');
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: '食べるな危険', text: `${shareText}\n#${HASHTAG}`, url: SHARE_URL });
    } catch { /* キャンセルされたときは何もしない */ }
  }

  ['share-x', 'share-line', 'share-fb'].forEach((id) => $(id).addEventListener('click', () => Sound.play('tap')));
  $('share-copy').addEventListener('click', () => { Sound.play('tap'); copyShare(); });
  $('share-native').addEventListener('click', () => { Sound.play('tap'); nativeShare(); });

  // ---------- ランキング ----------
  const MEDALS = ['🥇', '🥈', '🥉'];
  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  function tabs(boxId, items, current, onPick) {
    const box = $(boxId);
    box.innerHTML = '';
    items.forEach((it) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'genre';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-checked', String(it.id === current));
      btn.setAttribute('aria-selected', String(it.id === current));
      btn.innerHTML = `<span class="icon">${it.icon}</span>${it.label}${it.count != null ? `<small>${it.count}</small>` : ''}`;
      btn.addEventListener('click', () => { Sound.play('tap'); onPick(it.id); });
      box.appendChild(btn);
    });
  }

  function renderRanking(stage = state.rankingStage) {
    state.rankingStage = stage;
    tabs('ranking-tabs', STAGES, stage, renderRanking);
    const rows = Ranking.list(stage);
    $('ranking-list').innerHTML = rows.length
      ? `<ol>${rows.map((r, i) => `
          <li class="${r.id === state.lastRecord ? 'latest' : ''}">
            <span class="pos">${MEDALS[i] || `${i + 1}`}</span>
            <span class="who">${escapeHtml(r.name)}<small>${escapeHtml(r.title)}</small></span>
            <span class="pts">${r.score}<small>点</small></span>
            <span class="time">収穫${r.harvest}${r.win ? ' ✅' : ''}<small>${Ranking.formatDate(r.date)}</small></span>
          </li>`).join('')}</ol>`
      : '<p class="empty">まだ記録がないよ。山へ出発しよう！</p>';
    $('btn-ranking-clear').hidden = !rows.length;
  }

  function showRanking(stage) {
    Sound.play('tap');
    renderRanking(stage);
    show('ranking');
  }

  // ---------- 図鑑 ----------
  function speciesCard(s) {
    const k = KINDS[s.kind];
    const like = likeNames(s);
    return `<article class="pair sp kind-${s.kind}">
      <figure class="sp-art">${Art.render(s)}</figure>
      <div class="sp-body">
        <p class="sp-name"><span class="kind">${k.badge} ${k.label}</span><b>${s.name}</b><span class="lv" data-level="${s.level}">${LEVELS[s.level].stars}</span></p>
        <p class="point">${s.point}</p>
        ${like ? `<p class="like">${s.kind === 'good' ? '⚠️ まちがえやすい' : '🌀 そっくりさん'}：<b>${escapeHtml(like)}</b></p>` : ''}
      </div>
    </article>`;
  }

  const KIND_TABS = [
    { id: 'all', icon: '🗂️', label: 'すべて' },
    { id: 'good', icon: '🍽️', label: '食べられる' },
    { id: 'weed', icon: '🌾', label: '雑草' },
    { id: 'poison', icon: '☠️', label: '毒' },
  ];

  function renderZukan() {
    const stage = state.zukanStage, kind = state.zukanKind;
    tabs('zukan-tabs', STAGES.map((s) => ({ ...s, count: `${poolOf(s.id).length}種` })), stage, (id) => { state.zukanStage = id; state.zukanKind = 'all'; renderZukan(); });
    const pool = poolOf(stage);
    const kinds = KIND_TABS.filter((k) => k.id === 'all' || pool.some((s) => s.kind === k.id))
      .map((k) => ({ ...k, count: k.id === 'all' ? pool.length : pool.filter((s) => s.kind === k.id).length }));
    tabs('zukan-kinds', kinds, kind, (id) => { state.zukanKind = id; renderZukan(); });
    const list = pool.filter((s) => kind === 'all' || s.kind === kind).sort((a, b) => a.level - b.level);
    $('zukan').innerHTML = list.map(speciesCard).join('');
    fitArt($('zukan'));
    $('zukan-count').textContent = `全${SPECIES.length}種`;
  }

  function showZukan() {
    Sound.play('tap');
    renderZukan();
    show('zukan');
  }

  // ---------- 音の切り替え ----------
  function bindToggle(id, getter, setter) {
    const el = $(id);
    const sync = () => el.setAttribute('aria-pressed', String(getter()));
    sync();
    el.addEventListener('click', () => {
      setter(!getter());
      sync();
      Sound.play('tap');
    });
  }
  bindToggle('tg-bgm', () => Sound.bgm, (v) => Sound.setBgm(v));
  bindToggle('tg-se', () => Sound.se, (v) => Sound.setSe(v));
  bindToggle('tg-voice', () => Sound.voice, (v) => Sound.setVoice(v));

  // ---------- イベント ----------
  function home() {
    state.running = false;
    cancelAnimationFrame(state.raf);
    Sound.play('tap');
    renderTitle();
  }
  $('btn-start').addEventListener('click', start);
  $('btn-retry').addEventListener('click', start);
  $('btn-next-stage').addEventListener('click', () => {
    const next = STAGES.find((s) => s.unlock === state.stage);
    if (!next) return;
    state.stage = next.id;
    try { localStorage.setItem(STAGE_KEY, next.id); } catch { /* 保存できなくても遊べる */ }
    start();
  });
  $('btn-home').addEventListener('click', home);
  $('btn-zukan').addEventListener('click', showZukan);
  $('btn-ranking').addEventListener('click', () => showRanking(state.stage));
  $('btn-result-ranking').addEventListener('click', () => showRanking(state.stage));
  $('btn-ranking-back').addEventListener('click', home);
  $('btn-ranking-clear').addEventListener('click', () => {
    const st = stageOf(state.rankingStage);
    if (!confirm(`「${st.label}」のランキングを消しますか？`)) return;
    Ranking.clear(state.rankingStage);
    renderRanking();
  });
  const nameInput = $('player-name');
  nameInput.value = Ranking.getName();
  nameInput.addEventListener('input', () => Ranking.setName(nameInput.value));
  $('btn-zukan-back').addEventListener('click', home);
  $('btn-sound-test').addEventListener('click', async () => {
    $('sound-test-result').textContent = await Sound.test();
    Sound.say('音のテストだ。聞こえるか？');
  });

  renderTitle();
})();
