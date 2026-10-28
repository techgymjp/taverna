/*
 * 効果音と BGM（Web Audio API で合成。音声ファイル不要）
 */
const Sound = (() => {
  const KEY = 'taberuna.sound';
  let ctx = null, master = null, bgmGain = null, seGain = null;
  let settings = { bgm: true, se: true, voice: true };
  try { Object.assign(settings, JSON.parse(localStorage.getItem(KEY)) || {}); } catch { /* 既定値で動く */ }

  const BGM_VOL = 0.16, SE_VOL = 0.5;

  // iPhone のマナーモード中でも効果音・BGM を鳴らす（Safari 16.4 以降）
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch { /* 対応していない端末はそのまま */ }

  function init() {
    if (ctx) {
      // 'suspended'（自動再生の制限）や 'interrupted'（iPhone で音声読み上げや着信のあと）から戻す
      if (ctx.state !== 'running') ctx.resume().catch(() => {});
      return true;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
    bgmGain = ctx.createGain();
    bgmGain.gain.value = settings.bgm ? BGM_VOL : 0;
    bgmGain.connect(master);
    seGain = ctx.createGain();
    seGain.gain.value = SE_VOL;
    seGain.connect(master);
    if (ctx.state !== 'running') ctx.resume().catch(() => {});
    return true;
  }

  // 画面に触れるたびに、止まっている音を再開する（ブラウザは「操作のあと」でないと音を出せない）
  ['pointerdown', 'touchend', 'click', 'keydown'].forEach((ev) => {
    document.addEventListener(ev, () => {
      if (settings.se || settings.bgm) init();
    }, { capture: true, passive: true });
  });

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch { /* 保存できなくても動く */ }
  }

  const NOTES = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };
  function freq(note) {
    const m = /^([A-G]#?)(\d)$/.exec(note);
    const midi = 12 * (Number(m[2]) + 1) + NOTES[m[1]];
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // 1音鳴らす
  function tone(out, f, t, dur, { type = 'square', vol = 0.3, attack = 0.005, slide = 0 } = {}) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f * slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(out);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  // 濁った音（ブザー用）：わずかにずらした2つの音を重ねてうなりを出し、ローパスでこもらせる
  function buzz(out, f, t, dur, { type = 'sawtooth', vol = 0.2, detune = 1.06, cutoff = 1400, slide = 1, wobble = 0 } = {}) {
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = cutoff;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.setValueAtTime(vol, t + dur * 0.75);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    filter.connect(g).connect(out);
    [1, detune].forEach((m) => {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.setValueAtTime(f * m, t);
      if (slide !== 1) o.frequency.exponentialRampToValueAtTime(f * m * slide, t + dur);
      if (wobble) {
        // 気持ち悪いゆらぎ
        const lfo = ctx.createOscillator();
        const depth = ctx.createGain();
        lfo.frequency.value = wobble;
        depth.gain.value = f * 0.08;
        lfo.connect(depth).connect(o.frequency);
        lfo.start(t);
        lfo.stop(t + dur + 0.02);
      }
      o.connect(filter);
      o.start(t);
      o.stop(t + dur + 0.02);
    });
  }

  // 鈴の音：基音に倍音を重ね、余韻を長めに
  function bell(out, f, t, vol = 0.18, dur = 0.6) {
    tone(out, f, t, dur, { type: 'sine', vol, attack: 0.004 });
    tone(out, f * 2, t, dur * 0.5, { type: 'sine', vol: vol * 0.35, attack: 0.004 });
    tone(out, f * 3, t, dur * 0.25, { type: 'sine', vol: vol * 0.12, attack: 0.004 });
  }

  let noiseBuf = null;
  function noise(out, t, dur, vol, hp = 6000, type = 'highpass') {
    if (!noiseBuf) {
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const s = ctx.createBufferSource();
    s.buffer = noiseBuf;
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = hp;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(filter).connect(g).connect(out);
    s.start(t);
    s.stop(t + dur + 0.02);
  }

  // ---------- 効果音 ----------
  const SE = {
    tap(t) {
      tone(seGain, 880, t, 0.06, { type: 'triangle', vol: 0.35, slide: 1.6 });
    },
    start(t) {
      ['C5', 'E5', 'G5', 'C6'].forEach((n, i) => tone(seGain, freq(n), t + i * 0.07, 0.16, { vol: 0.22 }));
    },
    // 出発：狩りの角笛「パッパラパーン！」＋太鼓
    depart(t) {
      const horn = [['G4', 0, 0.12], ['G4', 0.14, 0.12], ['C5', 0.28, 0.12], ['E5', 0.42, 0.12], ['G5', 0.56, 0.5]];
      horn.forEach(([n, d, len]) => {
        buzz(seGain, freq(n), t + d, len, { vol: 0.2, detune: 1.004, cutoff: 2600 });
        tone(seGain, freq(n) * 2, t + d, len, { type: 'triangle', vol: 0.08 });
      });
      [0, 0.28, 0.56].forEach((d) => tone(seGain, 110, t + d, 0.18, { type: 'sine', vol: 0.6, slide: 0.45 }));
      noise(seGain, t + 0.56, 0.4, 0.15, 5000); // シンバル
    },
    // 収穫：「ぽんっ」と抜ける音＋葉っぱのこすれる音＋きらりと鈴の音
    // 連続で収穫するほど、鈴がドレミソラの音階で上がっていく
    harvest(t, combo = 1, special = false) {
      tone(seGain, 900, t, 0.07, { type: 'sine', vol: 0.4, attack: 0.002, slide: 0.35 });
      noise(seGain, t, 0.06, 0.12, 2500, 'bandpass');
      const scale = ['C6', 'D6', 'E6', 'G6', 'A6', 'C7', 'D7', 'E7'];
      const n = freq(scale[Math.min(combo - 1, scale.length - 1)]);
      bell(seGain, n, t + 0.04, 0.16, 0.5);
      bell(seGain, n * 1.5, t + 0.1, 0.1, 0.6);
      if (special) {
        // 注文の品：キラキラ〜ン
        ['C6', 'E6', 'G6', 'C7', 'E7'].forEach((m, i) => bell(seGain, freq(m), t + 0.16 + i * 0.06, 0.1, 0.7));
      }
    },
    // 雑草を採ったとき：濁ったブザーで「ブブーッ」
    miss(t) {
      buzz(seGain, 98, t, 0.18, { vol: 0.28, detune: 1.06 });
      buzz(seGain, 92, t + 0.22, 0.42, { vol: 0.28, detune: 1.06, slide: 0.8 });
      noise(seGain, t, 0.12, 0.12, 400, 'lowpass');
    },
    // 毒を採ったとき：耳ざわりな不協和音の警報＋気持ち悪い「おえ〜」
    poison(t) {
      for (let i = 0; i < 3; i++) {
        const u = t + i * 0.16;
        tone(seGain, freq('A5'), u, 0.12, { type: 'square', vol: 0.12 });
        tone(seGain, freq('A#5'), u, 0.12, { type: 'square', vol: 0.12 }); // 半音ぶつけて不快に
      }
      buzz(seGain, 140, t + 0.48, 0.7, { vol: 0.3, detune: 1.03, cutoff: 900, slide: 0.45, wobble: 9 });
      noise(seGain, t + 0.48, 0.3, 0.1, 300, 'lowpass');
    },
    order(t) {
      tone(seGain, freq('E6'), t, 0.1, { type: 'sine', vol: 0.3 });
      tone(seGain, freq('A6'), t + 0.1, 0.18, { type: 'sine', vol: 0.3 });
    },
    tick(t) {
      tone(seGain, 1200, t, 0.05, { type: 'square', vol: 0.12 });
    },
    // 3・2・1：はっきりした「ピッ」（数字が減るほど少し高く）
    count(t, n = 3) {
      const f = freq(['A5', 'A5', 'B5', 'C#6'][n] || 'A5');
      tone(seGain, f, t, 0.22, { type: 'square', vol: 0.22, attack: 0.003 });
      tone(seGain, f * 2, t, 0.12, { type: 'sine', vol: 0.18, attack: 0.003 });
      tone(seGain, 1800, t, 0.03, { type: 'triangle', vol: 0.25 }); // カチッ
    },
    // スタート：「ポーン！」と高く響く和音＋太鼓
    go(t) {
      ['A5', 'C#6', 'E6', 'A6'].forEach((n, i) => {
        tone(seGain, freq(n), t + i * 0.015, 0.7, { type: 'square', vol: 0.12, attack: 0.003 });
        tone(seGain, freq(n) * 2, t + i * 0.015, 0.5, { type: 'sine', vol: 0.06 });
      });
      tone(seGain, 120, t, 0.25, { type: 'sine', vol: 0.7, slide: 0.4 });
      noise(seGain, t, 0.35, 0.15, 5000);
    },
    fanfare(t, good = true) {
      const seq = good
        ? [['C5', 0], ['C5', 0.12], ['C5', 0.24], ['C5', 0.36], ['G#4', 0.6], ['A#4', 0.84], ['C5', 1.08], ['A#4', 1.32], ['C5', 1.44]]
        : [['G4', 0], ['F#4', 0.25], ['F4', 0.5], ['E4', 0.75]];
      seq.forEach(([n, d], i) => {
        const last = i === seq.length - 1;
        tone(seGain, freq(n), t + d, last ? 0.9 : 0.14, { vol: 0.22 });
        if (good) tone(seGain, freq(n) * 2, t + d, last ? 0.9 : 0.14, { type: 'triangle', vol: 0.1 });
      });
    },
  };

  function play(name, ...args) {
    if (!settings.se || !init()) return;
    SE[name](ctx.currentTime + 0.01, ...args);
  }

  // ---------- BGM ----------
  const TEMPO = 150;
  const STEP = 60 / TEMPO / 2; // 8分音符
  // 8小節 × 8分音符8つ（'-' は休符）
  const MELODY = (
    'E5 - G5 E5 C5 - D5 E5 ' +
    '- C5 A4 - C5 E5 D5 - ' +
    'F5 - A5 F5 C5 - F5 E5 ' +
    'D5 - B4 G4 - B4 D5 - ' +
    'G5 - E5 G5 C6 - B5 A5 ' +
    'G5 - E5 - C5 D5 E5 - ' +
    'F5 E5 D5 C5 A4 - C5 D5 ' +
    'G4 - B4 D5 G5 - - -'
  ).split(' ');
  const CHORDS = [['C3', 'G3'], ['A2', 'E3'], ['F2', 'C3'], ['G2', 'D3'], ['C3', 'G3'], ['A2', 'E3'], ['F2', 'C3'], ['G2', 'D3']];
  const ARP = [['C4', 'E4', 'G4'], ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'], ['C4', 'E4', 'G4'], ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4']];

  let timer = null, step = 0, nextTime = 0;

  function scheduleStep(i, t) {
    const bar = Math.floor(i / 8) % 8, beat = i % 8;
    const m = MELODY[i % MELODY.length];
    if (m !== '-') tone(bgmGain, freq(m), t, STEP * 0.9, { vol: 0.22 });
    // ベース：オクターブで跳ねる
    const [root, fifth] = CHORDS[bar];
    const bass = beat % 2 === 0 ? root : (beat % 4 === 1 ? fifth : root.replace(/\d/, (d) => Number(d) + 1));
    tone(bgmGain, freq(bass), t, STEP * 0.8, { type: 'triangle', vol: 0.5 });
    // 裏拍のコード
    if (beat % 2 === 1) ARP[bar].forEach((n) => tone(bgmGain, freq(n), t, STEP * 0.5, { type: 'square', vol: 0.05 }));
    // リズム
    if (beat % 4 === 0) tone(bgmGain, 120, t, 0.12, { type: 'sine', vol: 0.7, slide: 0.4 });
    if (beat % 4 === 2) noise(bgmGain, t, 0.1, 0.25, 2000);
    noise(bgmGain, t, 0.03, 0.12);
  }

  function tick() {
    while (nextTime < ctx.currentTime + 0.15) {
      scheduleStep(step, nextTime);
      step = (step + 1) % 64;
      nextTime += STEP;
    }
  }

  function startBgm() {
    if (!settings.bgm || timer || !init()) return;
    step = 0;
    nextTime = ctx.currentTime + 0.1;
    timer = setInterval(tick, 30);
  }

  function stopBgm() {
    clearInterval(timer);
    timer = null;
  }

  // 結果発表のファンファーレ中は BGM を小さくする
  function duck(seconds) {
    if (!ctx || !settings.bgm) return;
    const t = ctx.currentTime;
    bgmGain.gain.cancelScheduledValues(t);
    bgmGain.gain.setValueAtTime(bgmGain.gain.value, t);
    bgmGain.gain.linearRampToValueAtTime(0.02, t + 0.1);
    bgmGain.gain.setValueAtTime(0.02, t + seconds);
    bgmGain.gain.linearRampToValueAtTime(BGM_VOL, t + seconds + 0.8);
  }

  function setBgm(on) {
    settings.bgm = on;
    save();
    if (on) {
      if (init()) bgmGain.gain.value = BGM_VOL;
      startBgm();
    } else {
      stopBgm();
    }
  }

  function setSe(on) {
    settings.se = on;
    save();
  }

  // ---------- ハンターの声（ブラウザの音声合成） ----------
  const synth = window.speechSynthesis;
  let jaVoice = null;
  function pickVoice() {
    if (!synth) return;
    const voices = synth.getVoices().filter((v) => /^ja/i.test(v.lang));
    // 男性っぽい声があれば優先
    jaVoice = voices.find((v) => /otoya|ichiro|keita|male|男性/i.test(v.name)) || voices[0] || null;
  }
  if (synth) {
    pickVoice();
    synth.addEventListener?.('voiceschanged', pickVoice);
  }

  function say(text) {
    if (!settings.voice || !synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[「」…]/g, ''));
    u.lang = 'ja-JP';
    if (jaVoice) u.voice = jaVoice;
    u.rate = 1.2;
    u.pitch = 0.6;
    u.volume = 1;
    synth.speak(u);
  }

  function setVoice(on) {
    settings.voice = on;
    save();
    if (!on && synth) synth.cancel();
  }

  return {
    play, startBgm, stopBgm, duck, setBgm, setSe, say, setVoice,
    get voice() { return settings.voice; },
    get bgm() { return settings.bgm; },
    get se() { return settings.se; },
  };
})();
