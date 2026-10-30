/*
 * 日本語・英語の切り替え。
 * 言語は ?lang=en / ?lang=ja → 前回選んだ言語 → 端末の言語 の順に決める。
 */
const I18N = (() => {
  const KEY = 'taberuna.lang';

  function detect() {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'ja') {
      try { localStorage.setItem(KEY, q); } catch { /* 保存できなくても動く */ }
      return q;
    }
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === 'en' || saved === 'ja') return saved;
    } catch { /* 保存できなくても動く */ }
    return /^ja/i.test(navigator.language || '') ? 'ja' : 'en';
  }

  const lang = detect();

  const DICT = {
    ja: {
      pageTitle: '食べるな危険',
      logo: { chars: ['食', 'べ', 'る', 'な', '危', '険'], danger: [4, 5] },
      sign: '狩猟小屋',
      introBubble: 'おう、新入り！仲間のハンターたちが<strong>腹ペコ</strong>だ。<br>野山で<strong>食べられるもの</strong>を採ってきてくれ。<br>ただし<strong>毒</strong>を持ってきたら承知しねえぞ！',
      chooseStage: 'ステージをえらぶ',
      stageAria: 'ステージ',
      kindAria: '種類',
      rules: '<li>⏱ <strong>60秒</strong>で、どんどん生えてくる<strong>食べられるもの</strong>だけをタップして収穫</li><li>❤️ ライフは<strong>3つ</strong>。雑草や毒を採るとライフが減って、ハンターが怒る！</li><li>🎯 ノルマを達成して生きのこればクリア。ハーブ編をクリアすると<strong>きのこ編</strong>へ</li>',
      nameLabel: 'ハンター名',
      defaultName: '名無しの新入り',
      start: '出発する！',
      rankingBtn: '🏆 ランキング',
      zukanBtn: '📖 野草・きのこ図鑑',
      soundTest: '🔊 音のテスト',
      soundTestSay: '音のテストだ。聞こえるか？',
      caution: '※ ゲームは見分けの入り口です。野生の植物・きのこは<strong>専門家でも間違える</strong>ことがあります。確実にわからないものは、採らない・食べない・人にあげない！',
      bgm: '♪ BGM',
      se: '🔔 効果音',
      voice: '🗣 声',
      langBtn: '🌐 English',
      versionTitle: 'このバージョンが表示されていれば最新です',
      livesAria: 'ライフ',
      points: '{n}点',
      pointsUnit: '点',
      harvestChip: '収穫 {n} / {q}',
      combo: '🔥 {n}連続',
      resultHeading: '本日の収穫',
      shareTitle: '結果をシェアする',
      shareX: '𝕏 ポスト',
      shareMore: '📤 その他',
      shareCopy: '🔗 コピー',
      copied: 'コピーしました！',
      retry: 'もう一回！',
      home: '小屋へ戻る',
      rankingTitle: '🏆 ランキング',
      rankingNote: 'この端末での記録です（ステージごとに上位10件）',
      clearRanking: '記録を消す',
      clearConfirm: '「{s}」のランキングを消しますか？',
      emptyRanking: 'まだ記録がないよ。山へ出発しよう！',
      zukanTitle: '📖 野草・きのこ図鑑',
      edible: '食べられる',
      poisonous: '毒',
      stageInfo: '{n}種・ノルマ{q}個',
      unlockHint: '{s}をクリアで解放',
      bestLine: '🏆 {s}の1位：{score}点（{name}）',
      plotEmpty: '空いている地面',
      plotGrowing: 'なにか生えている',
      hunter: 'ハンター',
      orders: ['腹ペコだ！{n}を採ってきてくれ！', '{n}が食いてえなあ。たのむぞ！', '今夜の鍋に{n}を入れたい！', 'おい、{n}はあるか？見つけたら頼む！', '{n}で一杯やりたいねえ！'],
      orderNote: '（注文の品は3倍！）',
      praises: ['うまそうだ！', 'いいぞ、その調子！', 'でかした！', 'それそれ、それが食いたかった！'],
      orderDone: ['よし、{n}だ！ありがてえ！', 'これこれ！{n}だよ！'],
      comboLine: '{c}連続！{p}',
      angry: 'こら、それは{w}だ！',
      angryWeed: ['ただの雑草じゃねえか！', 'そんなもん食えるか！', 'よく見て採れ！'],
      angryPoison: ['毒だぞ！食べるな危険！', 'みんなを殺す気か！', 'あぶねえ、そいつは毒だ！'],
      levelUp: { 2: 'だんだん紛らわしいのが生えてきたぞ。', 3: 'ここからは山のプロでも迷う難所だ！' },
      stampPoison: '食べるな危険！',
      stampWeed: 'それは雑草だ！',
      floatWeed: '🌾 {w}',
      floatPoison: '☠ {w}',
      arrive: '{place}に着いたぞ！{desc}',
      go: 'スタート！',
      rankSick: ['🤢 腹をこわした新入り', 'おいおい、毒や雑草ばっかりじゃねえか！図鑑でしっかり勉強してこい！'],
      rankApprentice: ['🌱 見習いハンター', '収穫が足りねえな。ノルマは{q}個だ。もっと手早く見分けろ！'],
      rankLegend: ['👑 伝説の山の達人', 'こいつはたまげた！今夜はごちそうだ。お前こそ山の達人だ！'],
      rankPro: ['🏹 一流ハンター', 'いい目をしてるな！仲間たちも大喜びだ！'],
      rankFull: ['🎒 一人前のハンター', 'よくやった！これでみんな腹いっぱいだ。'],
      resultWin: '🎉 ミッション成功！',
      resultDead: '💀 ミッション失敗…',
      resultShort: '⌛ ノルマ未達成…',
      detail: '収穫 {n}個（ノルマ{q}）・最大{c}連続・ミス{m}回',
      unlocked: '{icon} {s}が解放された！',
      nextStage: '{s}へ進む ▶',
      rankFirst: '🎉 ランキング 1位 更新！',
      rankIn: 'ランキング {n}位 にランクイン！',
      basketTitle: '🧺 収穫したもの',
      reviewTitle: 'まちがえて採ったものをおさらい',
      shareText: '食べるな危険【{s}】で {score}点！収穫{n}個{win}\n称号：{t}',
      shareWin: '（ミッション成功）',
      hashtag: '食べるな危険',
      harvestShort: '収穫{n}',
      likeGood: '⚠️ まちがえやすい',
      likeBad: '🌀 そっくりさん',
      kindAll: 'すべて',
      speciesCount: '{n}種',
      speciesTotal: '全{n}種',
      soundNoAudio: 'このブラウザは効果音（Web Audio）に対応していません',
      soundState: '音の状態：{s}（効果音 {se}・BGM {bgm}）',
      soundStates: { running: '再生できる状態', suspended: 'ブラウザに止められている', interrupted: '他のアプリに止められている', closed: '終了している' },
    },
    en: {
      pageTitle: "Don't Eat It!",
      logo: { chars: ["DON'T", 'EAT', 'IT!'], danger: [2] },
      sign: 'HUNTING LODGE',
      introBubble: "Hey, rookie! The other hunters are <strong>starving</strong>.<br>Go out and forage something <strong>we can eat</strong>.<br>But bring back anything <strong>poisonous</strong> and you'll answer to me!",
      chooseStage: 'Choose a stage',
      stageAria: 'Stage',
      kindAria: 'Type',
      rules: "<li>⏱ You have <strong>60 seconds</strong>. Things keep sprouting — tap only the <strong>edible</strong> ones to pick them</li><li>❤️ You have <strong>3 lives</strong>. Pick a weed or something poisonous and you lose one — and the hunter gets mad!</li><li>🎯 Reach the goal and survive to clear the stage. Clear Herbs to unlock <strong>Mushrooms</strong></li>",
      nameLabel: 'Hunter name',
      defaultName: 'Nameless Rookie',
      start: 'Head out!',
      rankingBtn: '🏆 Rankings',
      zukanBtn: '📖 Field Guide',
      soundTest: '🔊 Sound test',
      soundTestSay: 'Sound check. Can you hear me?',
      caution: "* This game is only a starting point. Even <strong>experts misidentify</strong> wild plants and mushrooms. If you're not 100% sure: don't pick it, don't eat it, don't give it to anyone!",
      bgm: '♪ Music',
      se: '🔔 SFX',
      voice: '🗣 Voice',
      langBtn: '🌐 日本語',
      versionTitle: 'If you see this version, you have the latest',
      livesAria: 'Lives',
      points: '{n} pts',
      pointsUnit: 'pts',
      harvestChip: 'Picked {n} / {q}',
      combo: '🔥 {n} combo',
      resultHeading: "Today's harvest",
      shareTitle: 'Share your result',
      shareX: '𝕏 Post',
      shareMore: '📤 More',
      shareCopy: '🔗 Copy',
      copied: 'Copied!',
      retry: 'Play again!',
      home: 'Back to the lodge',
      rankingTitle: '🏆 Rankings',
      rankingNote: 'Records on this device (top 10 per stage)',
      clearRanking: 'Clear records',
      clearConfirm: 'Clear the rankings for "{s}"?',
      emptyRanking: 'No records yet. Head out into the wild!',
      zukanTitle: '📖 Field Guide',
      edible: 'Edible',
      poisonous: 'Poisonous',
      stageInfo: '{n} species · goal {q}',
      unlockHint: 'Clear {s} to unlock',
      bestLine: '🏆 Top score in {s}: {score} pts ({name})',
      plotEmpty: 'Empty soil',
      plotGrowing: 'Something is growing',
      hunter: 'Hunter',
      orders: ["I'm starving! Go get me some {n}!", 'Man, I could go for some {n}. Help me out!', "I want {n} in tonight's stew!", 'Hey, see any {n}? Grab it if you do!', '{n} would go great with a drink!'],
      orderNote: '(Orders score triple!)',
      praises: ['Looks tasty!', 'Nice, keep it up!', 'Well done!', "That's what I'm talking about!"],
      orderDone: ['Yes, {n}! Thanks a bunch!', "That's the stuff! {n}!"],
      comboLine: '{c} in a row! {p}',
      angry: "Hey! That's {w}!",
      angryWeed: ["It's just a weed!", "Who's gonna eat that?!", 'Look before you pick!'],
      angryPoison: ["It's poison! DON'T EAT IT!", 'Are you trying to kill us all?!', 'Watch it, that stuff is poisonous!'],
      levelUp: { 2: 'Trickier lookalikes are popping up now. ', 3: 'This is where even the pros get fooled! ' },
      stampPoison: "DON'T EAT IT!",
      stampWeed: "That's a weed!",
      floatWeed: '🌾 {w}',
      floatPoison: '☠ {w}',
      arrive: 'We made it to the {place}! {desc}',
      go: 'GO!',
      rankSick: ['🤢 Rookie with a Bellyache', "Come on, that's nothing but poison and weeds! Go study the field guide!"],
      rankApprentice: ['🌱 Apprentice Hunter', 'Not enough food. The goal is {q}. Tell them apart faster!'],
      rankLegend: ['👑 Legendary Mountain Master', "Well, I'll be! It's a feast tonight. You're a true master of the mountains!"],
      rankPro: ['🏹 Expert Hunter', "You've got a sharp eye! The whole crew is thrilled!"],
      rankFull: ['🎒 Full-Fledged Hunter', 'Good job! Now everyone gets a full belly.'],
      resultWin: '🎉 Mission complete!',
      resultDead: '💀 Mission failed…',
      resultShort: '⌛ Goal not reached…',
      detail: 'Picked {n} (goal {q}) · best combo {c} · mistakes {m}',
      unlocked: '{icon} {s} unlocked!',
      nextStage: 'On to {s} ▶',
      rankFirst: '🎉 New #1 on the rankings!',
      rankIn: 'You placed #{n} on the rankings!',
      basketTitle: '🧺 Your harvest',
      reviewTitle: 'Review: what you picked by mistake',
      shareText: "I scored {score} pts in Don't Eat It! [{s}] and picked {n}{win}\nTitle: {t}",
      shareWin: ' (mission complete)',
      hashtag: 'DontEatIt',
      harvestShort: 'Picked {n}',
      likeGood: '⚠️ Easily confused with',
      likeBad: '🌀 Lookalike of',
      kindAll: 'All',
      speciesCount: '{n} species',
      speciesTotal: '{n} species',
      soundNoAudio: "This browser doesn't support sound effects (Web Audio)",
      soundState: 'Sound: {s} (SFX {se} · Music {bgm})',
      soundStates: { running: 'ready to play', suspended: 'blocked by the browser', interrupted: 'interrupted by another app', closed: 'closed' },
    },
  };

  // 文言を取り出す。{name} の部分は vars で置きかえる
  function t(key, vars) {
    let v = DICT[lang][key] ?? DICT.ja[key];
    if (typeof v === 'string' && vars) v = v.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
    return v;
  }

  // 言語を切り替えてページを読み込み直す
  function setLang(next) {
    try { localStorage.setItem(KEY, next); } catch { /* 保存できなくても動く */ }
    const u = new URL(location.href);
    u.searchParams.set('lang', next);
    location.href = u.toString();
  }

  // HTML の data-i18n 属性がついた所を、いまの言語の文言にする
  function apply() {
    document.documentElement.lang = lang;
    document.title = t('pageTitle');
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    document.querySelectorAll('[data-i18n-title]').forEach((el) => { el.title = t(el.dataset.i18nTitle); });
    const logo = document.getElementById('logo');
    if (logo) {
      const { chars, danger } = t('logo');
      logo.innerHTML = chars.map((c, i) => `<span${danger.includes(i) ? ' class="danger"' : ''}>${c}</span>`).join('');
      logo.classList.toggle('words', lang === 'en');
    }
  }

  return { lang, t, setLang, apply };
})();

if (typeof module !== 'undefined') module.exports = I18N;
