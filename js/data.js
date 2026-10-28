/*
 * 出てくる植物・きのこのデータ（すべて実在の種）。
 *   kind: good（食べられる）/ weed（雑草）/ poison（毒）
 *   level: 1 やさしい 〜 3 むずかしい（時間がたつほど難しい種が出る）
 *   like: そっくりで間違えやすい種（id の配列、または文字列）
 *   look: イラストの設定（js/art.js）
 *   point: 見分けポイント・豆知識
 */
const STAGES = [
  { id: 'herb', label: 'ハーブ編', icon: '🌿', quota: 20, place: '野原', desc: 'ハーブ・山菜を摘め！雑草と毒草はさわるな！' },
  { id: 'kinoko', label: 'きのこ編', icon: '🍄', quota: 18, place: '森', desc: '食べられるきのこを採れ！毒きのこに気をつけろ！', unlock: 'herb' },
];

const KINDS = {
  good: { label: '食べられる', badge: '🍽️' },
  weed: { label: '雑草', badge: '🌾' },
  poison: { label: '毒', badge: '☠️' },
};

const LEVELS = {
  1: { label: 'やさしい', stars: '★' },
  2: { label: 'ふつう', stars: '★★' },
  3: { label: 'むずかしい', stars: '★★★' },
};

const SPECIES = [];
function sp(stage, kind, id, name, level, look, point, like) {
  SPECIES.push({ stage, kind, id, name, level, look, point, like });
}
const herb = (...a) => sp('herb', 'good', ...a);
const weed = (...a) => sp('herb', 'weed', ...a);
const poisonPlant = (...a) => sp('herb', 'poison', ...a);
const eat = (...a) => sp('kinoko', 'good', ...a);
const dokuKinoko = (...a) => sp('kinoko', 'poison', ...a);

// よく使う葉の形
const lf = (shape, len, wid, color, more = {}) => ({ shape, len, wid, color, ...more });

// =====================================================================
// ハーブ・山菜（食べられる）
// =====================================================================
herb('basil', 'バジル', 1,
  { habit: 'stem', stems: 2, nodes: 4, leaf: lf('oval', 14, 6.5, '#4cb04a', { gloss: true, vein: 'net' }), flower: { type: 'spike', color: '#fbfbf2', h: 12, n: 5, w: 1.6 } },
  'つやのある<strong>丸っこい葉が向かい合って</strong>つき、さわると甘くさわやかな香り。トマト料理の名脇役です。');
herb('spearmint', 'スペアミント', 1,
  { habit: 'stem', stems: 3, nodes: 5, leaf: lf('lance', 12, 5, '#6cc04a', { edge: 'serrate', teeth: 9, wrinkle: true }), flower: { type: 'spike', color: '#e6c8f0', h: 12, n: 6, w: 1.6 } },
  '細かいぎざぎざの葉に<strong>しわ（葉脈のへこみ）</strong>が目立ち、もむと<strong>すっとする香り</strong>。茎の断面は四角形です。');
herb('peppermint', 'ペパーミント', 2,
  { habit: 'stem', stems: 3, nodes: 5, stemColor: '#7a4a6a', leaf: lf('lance', 13, 5, '#4f9a45', { edge: 'serrate', teeth: 9, vein: 'net' }), flower: { type: 'spike', color: '#c89ad8', h: 12, n: 6, w: 1.6 } },
  'スペアミントより葉の色が濃く、<strong>茎が紫がかる</strong>ことが多い。メントールが多く、<strong>鼻に抜ける強い清涼感</strong>があります。', ['spearmint']);
herb('rosemary', 'ローズマリー', 1,
  { habit: 'shrub', stems: 3, nodes: 6, arrange: 'many', leafAngle: 50, stemColor: '#7a6a4a', leaf: lf('needle', 8, 1.3, '#4f7f5a', { under: '#c9d8c6', vein: 'none' }), flower: { type: 'star', color: '#a8c4f0', size: 0.6 } },
  '木の枝に<strong>針のように細い葉</strong>がびっしり。葉の裏は白っぽく、肉料理に合う<strong>松のような強い香り</strong>がします。');
herb('thyme', 'タイム', 2,
  { habit: 'shrub', stems: 5, height: 40, nodes: 6, arrange: 'many', leafAngle: 60, shrink: 0.2, stemColor: '#8a6a4a', leaf: lf('oval', 4, 2, '#6a8f5a', { vein: 'none' }), flower: { type: 'ball', color: '#f0c0dc', n: 8, size: 0.7 } },
  '細い木の枝に<strong>米つぶほどの小さな葉</strong>がたくさん。地面をはうように広がり、ピンクの小花が咲きます。');
herb('sage', 'セージ', 2,
  { habit: 'stem', stems: 2, nodes: 4, leaf: lf('lance', 16, 6, '#9bb39a', { edge: 'crenate', teeth: 10, wrinkle: true }), stemColor: '#8a9a7a', flower: { type: 'spike', color: '#9a7ad8', h: 14, n: 5 } },
  '<strong>白っぽい灰緑色</strong>で、表面が<strong>ちりめんのように細かくしわしわ</strong>した葉。ソーセージの香りづけに使われます。');
herb('oregano', 'オレガノ', 2,
  { habit: 'stem', stems: 3, height: 52, nodes: 5, leaf: lf('oval', 7, 4.5, '#6aa04a', { vein: 'none' }), flower: { type: 'ball', color: '#f0a8d0', n: 10, size: 0.8 } },
  '小さな卵形の葉が向かい合ってつき、先にピンクの小花が<strong>かたまって</strong>咲きます。ピザに欠かせない香り。');
herb('marjoram', 'マジョラム', 3,
  { habit: 'stem', stems: 3, height: 46, nodes: 5, leaf: lf('oval', 6, 4, '#8fb27a', { vein: 'none' }), flower: { type: 'ball', color: '#f4f0e8', n: 10, size: 0.8 } },
  'オレガノの仲間で、葉は<strong>やわらかく灰色がかった緑</strong>。花のつぼみが<strong>小さな結び目のような玉</strong>になり、白い花が咲きます。', ['oregano']);
herb('italianparsley', 'イタリアンパセリ', 2,
  { habit: 'stalks', count: 6, height: 44, leaf: lf('tri', 9, 5, '#3f9a3a', { compound: 'tri', edge: 'coarse', teeth: 4, spread: 45 }) },
  '平らな葉が<strong>3つに分かれ、ふちに大きなぎざぎざ</strong>。縮れたパセリより香りがやさしい。白い花のセリ科の毒草と間違えないよう注意。');
herb('parsley', 'パセリ', 1,
  { habit: 'stalks', count: 6, height: 40, leaf: lf('round', 7, 5, '#2f8f2f', { compound: 'palm', n: 7, spread: 80, edge: 'deep', teeth: 10, taper: 0.1 }) },
  '葉が<strong>こまかく縮れてもこもこ</strong>しています。料理の飾りでおなじみ。ビタミンたっぷりで、残さず食べたい野菜です。');
herb('dill', 'ディル', 2,
  { habit: 'stalks', count: 5, height: 46, scape: 72, leaf: lf('lance', 6, 2, '#5aa64a', { compound: 'fine', rachis: 22, n: 6 }), flower: { type: 'umbel', color: '#f2d84a', n: 9 } },
  '<strong>糸のように細かく分かれた葉</strong>。黄色い小花が<strong>傘のように</strong>広がって咲きます。魚料理に合うさわやかな香り。');
herb('fennel', 'フェンネル', 3,
  { habit: 'stalks', count: 5, height: 50, base: 'bulb', bulbR: 10, bulbColor: '#eef3d6', leaf: lf('lance', 6, 2, '#7ab060', { compound: 'fine', rachis: 24, n: 6, feather: 1.2 }) },
  'ディルに似た糸状の葉ですが、根元の<strong>白くふくらんだ株（バルブ）</strong>も食べられます。<strong>甘いアニスの香り</strong>。', ['dill']);
herb('chervil', 'チャービル', 3,
  { habit: 'stalks', count: 6, height: 40, scape: 50, leaf: lf('oval', 4, 2.6, '#7cc35a', { compound: 'bipinnate', rachis: 14, n: 3, edge: 'deep', teeth: 5 }), flower: { type: 'umbel', color: '#fbfbf4', n: 6, size: 0.7 } },
  'パセリを<strong>やわらかく繊細</strong>にしたような葉で、ほのかに甘い香り。<strong>似た葉の毒草（ドクニンジン）</strong>があるので、野生のものは採らないのが安全です。');
herb('coriander', 'パクチー', 1,
  { habit: 'stalks', count: 6, height: 40, scape: 56, leaf: lf('round', 7, 6, '#4caf50', { compound: 'tri', edge: 'lobed', teeth: 6, spread: 50 }), flower: { type: 'umbel', color: '#f8e2ee', n: 7, size: 0.8 } },
  '丸くて<strong>浅く切れ込んだ葉</strong>。ちぎると<strong>独特の強い香り</strong>で、好き嫌いが分かれます。エスニック料理の定番。');
herb('chive', 'チャイブ', 1,
  { habit: 'clump', count: 9, height: 56, spread: 16, droop: 3, leaf: lf('linear', 0, 2, '#3f9a3a'), scape: 62, flower: { type: 'ball', color: '#c88ad8', n: 16, size: 0.9 } },
  '<strong>細い筒状の葉</strong>で、ネギのような香り。<strong>うす紫のぼんぼりのような花</strong>が咲きます。');
herb('lemonbalm', 'レモンバーム', 2,
  { habit: 'stem', stems: 2, nodes: 4, leaf: lf('oval', 12, 8, '#8fd05a', { edge: 'crenate', teeth: 10, wrinkle: true }) },
  'ミントに似た<strong>明るい黄緑の葉</strong>で、さわると<strong>レモンの香り</strong>。ハーブティーにぴったりです。', ['spearmint']);
herb('lavender', 'ラベンダー', 1,
  { habit: 'shrub', stems: 4, height: 54, nodes: 3, leafAngle: 40, stemColor: '#8a9a7a', leaf: lf('linear', 10, 1.5, '#9fb2a0', { vein: 'none' }), flower: { type: 'spike', color: '#9a6ad8', h: 14, n: 7, w: 1.8 } },
  '<strong>細長い灰緑色の葉</strong>と、<strong>紫色の穂</strong>のような花。リラックスできる香りで、お菓子やお茶にも使われます。');
herb('chamomile', 'カモミール', 1,
  { habit: 'stem', stems: 3, height: 52, nodes: 3, arrange: 'alt', leaf: lf('lance', 4, 1.5, '#7ab54a', { compound: 'fine', rachis: 10, n: 4 }), flower: { type: 'daisy', color: '#ffffff', center: '#ffd23f', size: 0.8 } },
  '<strong>白い花びらと黄色いまんなか</strong>の小さな花。花をお茶にすると、<strong>りんごのような甘い香り</strong>がします。');
herb('arugula', 'ルッコラ', 2,
  { habit: 'rosette', count: 7, leaf: lf('lance', 28, 7, '#4a9a3a', { edge: 'lobed', teeth: 6, vein: 'mid' }) },
  '大根の葉を小さくしたような<strong>切れ込みのある葉</strong>。<strong>ごまのような香りとピリッとした辛み</strong>がサラダに合います。');
herb('nasturtium', 'ナスタチウム', 1,
  { habit: 'stalks', count: 5, height: 36, leaf: lf('round', 14, 9, '#7cbf4a', { vein: 'net' }), flower: { type: 'cup', color: '#f2862a', size: 1.2 }, scape: 40 },
  '<strong>ハスの葉のような丸い葉</strong>と、オレンジ色の花。花も葉も<strong>クレソンのようなピリッとした辛み</strong>で食べられます。');
herb('borage', 'ボリジ', 2,
  { habit: 'stem', stems: 2, height: 56, nodes: 3, arrange: 'alt', leaf: lf('oval', 16, 7, '#7a9a5a', { wrinkle: true }), flower: { type: 'star', color: '#4a7ad8', center: '#2a2a3a', size: 1.1 } },
  '全体に<strong>ちくちくした毛</strong>が生え、<strong>青い星形の花</strong>が下向きに咲きます。花はサラダの彩りに。');
herb('tarragon', 'タラゴン', 3,
  { habit: 'stem', stems: 3, height: 58, nodes: 6, arrange: 'alt', leafAngle: 35, leaf: lf('linear', 12, 1.6, '#5aa04a', { vein: 'none' }) },
  '<strong>細長くてつるっとした葉</strong>が茎に互い違いにつきます。フランス料理で使われる、<strong>甘くほろ苦い香り</strong>。');
herb('stevia', 'ステビア', 3,
  { habit: 'stem', stems: 2, nodes: 5, leaf: lf('lance', 10, 4, '#6ab04a', { edge: 'serrate', teeth: 6 }), flower: { type: 'ball', color: '#ffffff', n: 8, size: 0.7 } },
  '先の方だけぎざぎざのある葉。葉をかむと<strong>砂糖よりずっと甘い</strong>！甘味料の原料になる植物です。');
herb('lemongrass', 'レモングラス', 2,
  { habit: 'clump', count: 9, height: 72, spread: 30, droop: 14, leaf: lf('linear', 0, 3.5, '#9ac46a', { color2: '#7fb055' }) },
  'ススキのような<strong>細長い葉が株になって</strong>生えます。葉をちぎると<strong>レモンの香り</strong>。タイ料理のトムヤムクンに使われます。');
herb('laurel', 'ローリエ', 2,
  { habit: 'shrub', stems: 2, nodes: 5, arrange: 'alt', leafAngle: 48, stemColor: '#6a5a3a', leaf: lf('lance', 16, 5, '#2f6a3a', { gloss: true, vein: 'net', edge: 'wavy', teeth: 6 }) },
  '月桂樹（ゲッケイジュ）の葉。<strong>かたくてつやのある葉のふちが少し波打ち</strong>、ちぎると<strong>すがすがしい香り</strong>。カレーやシチューに。');
herb('sorrel', 'ソレル', 3,
  { habit: 'rosette', count: 6, petiole: 10, leaf: lf('arrow', 22, 7, '#5fae45', { vein: 'mid' }) },
  '<strong>矢じりのような形の葉</strong>。かむと<strong>レモンのようなすっぱさ</strong>があり、スープやソースに使います。');
herb('watercress', 'クレソン', 2,
  { habit: 'stem', stems: 3, height: 44, nodes: 4, arrange: 'alt', leaf: lf('round', 6, 4.5, '#3f8f3a', { compound: 'pinnate', rachis: 10, n: 2, gloss: true }) },
  'きれいな水辺に生え、<strong>丸い小さな葉が羽のように</strong>並びます。<strong>ピリッとした辛み</strong>でステーキの付け合わせに。');
herb('egoma', 'エゴマ', 3,
  { habit: 'stem', stems: 1, nodes: 4, leaf: lf('oval', 15, 9, '#6aa84a', { edge: 'serrate', teeth: 12, wrinkle: true }) },
  'シソの仲間で、葉は<strong>シソより丸く大きく、毛が多い</strong>。韓国料理では葉で焼き肉を包みます。種からエゴマ油がとれます。', ['aojiso']);
herb('lemonverbena', 'レモンバーベナ', 3,
  { habit: 'shrub', stems: 2, nodes: 4, arrange: 'whorl', whorl: 3, stemColor: '#8a7a5a', leaf: lf('lance', 14, 3.5, '#7ec04a', { vein: 'mid' }) },
  '細長い葉が<strong>1か所から3枚ずつ輪のように</strong>つきます。葉をさわると<strong>レモンよりもレモンらしい</strong>強い香り。');
herb('aojiso', '大葉（青ジソ）', 1,
  { habit: 'stem', stems: 1, nodes: 4, leaf: lf('oval', 16, 10, '#5fbf45', { edge: 'coarse', teeth: 10, wrinkle: true }) },
  '葉のふちに<strong>はっきりしたぎざぎざ</strong>、表面は<strong>やわらかくしわしわ</strong>。もむと<strong>シソの香り</strong>。つやのあるアジサイの葉と間違えないで！');
herb('akajiso', '赤ジソ', 1,
  { habit: 'stem', stems: 1, nodes: 4, stemColor: '#6a2a4a', leaf: lf('oval', 16, 10, '#8a3a5a', { edge: 'coarse', teeth: 10, wrinkle: true }) },
  '<strong>赤むらさき色</strong>のシソ。梅干しの色づけや、しそジュースになります。');
herb('mitsuba', 'ミツバ', 1,
  { habit: 'stalks', count: 6, height: 46, spread: 30, leaf: lf('oval', 10, 6, '#5cb348', { compound: 'tri', edge: 'serrate', teeth: 7, spread: 50 }) },
  '細い茎の先に<strong>3枚の葉</strong>がつくので「三つ葉」。さわやかな香りで、お吸い物や茶わん蒸しに。');
herb('nira', 'ニラ', 1,
  { habit: 'clump', count: 10, height: 56, spread: 20, droop: 6, leaf: lf('linear', 0, 2.6, '#4caf3a') },
  '<strong>平たく細い葉</strong>が束になって生え、ちぎると<strong>ニラ特有の強いにおい</strong>。においがしなければ、それはスイセンかも！');
herb('myoga', 'ミョウガ', 2,
  { habit: 'stem', stems: 2, height: 60, nodes: 4, arrange: 'alt', leafAngle: 50, special: 'myoga', leaf: lf('lance', 18, 4, '#5aa548') },
  'ショウガの仲間。食べるのは、<strong>根元の地面から顔を出すピンク色の花のつぼみ</strong>。夏のそうめんの薬味に。');
herb('sansho', 'サンショウ', 2,
  { habit: 'shrub', stems: 2, nodes: 4, arrange: 'alt', stemColor: '#7a6a4a', leaf: lf('oval', 5, 2.6, '#4f9a3a', { compound: 'pinnate', rachis: 16, n: 4, edge: 'crenate', teeth: 4, angle: 70 }), fruit: { type: 'cluster', color: '#c8302a', n: 6 } },
  '小さな葉が<strong>羽のように並び</strong>、枝に<strong>トゲが対になって</strong>つきます。新芽は「木の芽」、実はうなぎのさんしょうに。');
herb('yomogi', 'ヨモギ', 1,
  { habit: 'stem', stems: 2, nodes: 5, arrange: 'alt', leaf: lf('oval', 16, 8, '#7a9f5a', { edge: 'deep', teeth: 6, under: '#e6ece0' }) },
  '切れ込んだ葉の<strong>裏が白い綿毛でおおわれる</strong>のが目印。<strong>草もちの香り</strong>がします。つやつやで裏が白くない葉はトリカブトかも。');
herb('seri', 'セリ', 2,
  { habit: 'stalks', count: 6, height: 40, base: 'runner', leaf: lf('oval', 6, 4, '#4fae45', { compound: 'bipinnate', rachis: 14, n: 2, edge: 'coarse', teeth: 4 }) },
  '春の七草のひとつ。水辺に生え、根元から<strong>白いひげ根と、横にはう茎</strong>が伸びます。<strong>セリ独特の香り</strong>。');
herb('gyoja', 'ギョウジャニンニク', 2,
  { habit: 'broad', count: 2, base: 'redbase', neck: 14, neckColor: '#a8466a', leaf: lf('oval', 34, 10, '#5aad4a', { vein: 'parallel' }) },
  '幅の広い葉が2〜3枚。<strong>根元が赤紫色</strong>で、ちぎると<strong>強いニンニクのにおい</strong>がします。においがしない似た葉は猛毒！');
herb('nobiru', 'ノビル', 2,
  { habit: 'clump', count: 6, height: 50, droop: 16, spread: 22, base: 'bulb', bulbR: 4, bulbColor: '#f6f2e6', leaf: lf('linear', 0, 1.6, '#5f9f4a') },
  '細い<strong>筒状の葉</strong>で、根元に<strong>白く小さな丸い球根</strong>。<strong>ネギのにおい</strong>がします。みそをつけて食べるとおいしい。');
herb('fukinotou', 'フキノトウ', 1,
  { habit: 'none', special: 'fukinotou' },
  'フキの花のつぼみ。<strong>うすい黄緑色の苞（ほう）に包まれた丸いつぼみ</strong>で、天ぷらにするとほろ苦い春の味。');
herb('taranome', 'タラノメ', 1,
  { habit: 'none', special: 'taranome' },
  '<strong>トゲだらけの木の枝先</strong>に出る新芽。「山菜の王様」と呼ばれ、天ぷらにすると絶品です。');
herb('koshiabura', 'コシアブラ', 3,
  { habit: 'stalks', count: 3, height: 44, spread: 30, stemColor: '#8a7a5a', leaf: lf('oval', 14, 5, '#a3d65a', { compound: 'palm', n: 5, spread: 70, edge: 'serrate', teeth: 8 }) },
  '<strong>5枚の葉が手のひらのように</strong>広がる木の新芽。タラノメに並ぶ人気の山菜で「山菜の女王」とも。');
herb('udo', 'ウド', 2,
  { habit: 'stem', stems: 1, height: 58, nodes: 3, arrange: 'alt', stemW: 4, stemColor: '#c8d8a8', leaf: lf('oval', 8, 4.5, '#8fc55a', { compound: 'pinnate', rachis: 18, n: 2, edge: 'serrate', teeth: 6 }) },
  '<strong>太くてうぶ毛のある茎</strong>が特徴の山菜。若い茎をきんぴらや酢みそあえにします。');
herb('wasabi', 'ワサビ', 2,
  { habit: 'stalks', count: 5, height: 40, special: 'wasabi', leaf: lf('heart', 18, 12, '#4f9f45', { edge: 'crenate', teeth: 8, vein: 'net' }) },
  '清流に育ち、<strong>ハート形の丸い葉</strong>。すりおろす<strong>ごつごつした根茎</strong>はツンとした辛さ。葉や茎も食べられます。');
herb('urui', 'ウルイ', 2,
  { habit: 'stalks', count: 4, height: 24, spread: 30, leaf: lf('oval', 26, 13, '#6aa858', { vein: 'parallel' }) },
  'オオバギボウシの若葉。<strong>葉に長い柄（え）があり</strong>、根元から1枚ずつ出ます。葉の筋は弓なり。猛毒のバイケイソウとよく間違えられます。');
herb('nirinsou', 'ニリンソウ', 3,
  { habit: 'stalks', count: 4, height: 30, scape: 44, leaf: lf('lance', 12, 5, '#5fa84a', { compound: 'palm', n: 3, spread: 50, edge: 'deep', teeth: 4, spots: '#d8e8c8' }), flower: { type: 'star', color: '#ffffff', center: '#f2e06a', size: 1 } },
  '1本の茎から<strong>白い花が2輪</strong>咲くので「二輪草」。葉に<strong>柄がなく</strong>茎を取り巻くようにつきます。トリカブトと一緒に生えるので<strong>花を確認してから</strong>採るのが鉄則。');
herb('ashitaba', 'アシタバ', 2,
  { habit: 'stalks', count: 5, height: 46, stemColor: '#7aa84a', leaf: lf('oval', 8, 5, '#3f9a3a', { compound: 'bipinnate', rachis: 16, n: 2, edge: 'serrate', teeth: 6, gloss: true }) },
  '「今日摘んでも明日には芽が出る」ほど育つのが名前の由来。茎を切ると<strong>黄色い汁</strong>が出ます。伊豆諸島の名物。');
herb('nazuna', 'ナズナ', 1,
  { habit: 'rosette', count: 7, scape: 50, leaf: lf('lance', 18, 4, '#5a9a45', { edge: 'lobed', teeth: 7 }), flower: { type: 'ball', color: '#ffffff', n: 8, size: 0.7 } },
  '春の七草のひとつ「ぺんぺん草」。<strong>三味線のばちのような三角の実</strong>がつきます。七草がゆに入れます。');
herb('hakobe', 'ハコベ', 1,
  { habit: 'stem', stems: 4, height: 32, nodes: 4, leaf: lf('oval', 5, 3.5, '#7cc44a', { vein: 'none' }), flower: { type: 'star', color: '#ffffff', n: 10, size: 0.6 } },
  '春の七草「はこべら」。<strong>小さな卵形の葉</strong>が向かい合い、<strong>白い星のような小花</strong>。ひよこの好物でもあります。');
herb('tsuwabuki', 'ツワブキ', 2,
  { habit: 'stalks', count: 5, height: 36, leaf: lf('round', 20, 14, '#2f7f3a', { gloss: true, vein: 'net' }), scape: 52, flower: { type: 'daisy', color: '#f6d23a', center: '#e8a020', size: 0.9 } },
  '<strong>フキに似た丸い葉にこってりしたつや</strong>。若い葉柄を佃煮（きゃらぶき）にします。秋に黄色い花。');
herb('kogomi', 'コゴミ', 1,
  { habit: 'none', special: 'kogomi', leaf: lf('oval', 1, 1, '#8fcc5a') },
  'クサソテツの若芽。<strong>くるっと巻いた新芽</strong>で、アクが少なくゆでるだけで食べられる人気の山菜です。');
herb('mizu', 'ミズ', 3,
  { habit: 'stem', stems: 3, height: 48, nodes: 4, arrange: 'alt', stemColor: '#c86a7a', leaf: lf('lance', 10, 4, '#6abf4a', { edge: 'coarse', teeth: 6, asym: 0.6 }) },
  'ウワバミソウのこと。沢沿いに生え、<strong>みずみずしい茎の根元が赤い</strong>。<strong>左右非対称のゆがんだ葉</strong>が目印です。');
herb('yukinoshita', 'ユキノシタ', 3,
  { habit: 'rosette', count: 6, petiole: 6, leaf: lf('round', 12, 10, '#4a7a45', { edge: 'crenate', teeth: 10, vein: 'net', veinColor: '#e8f0e0' }) },
  '<strong>丸い葉に白いすじ</strong>が入り、裏は赤紫色。毛がふさふさ。天ぷらにするとおいしい、日陰の山菜です。');

// =====================================================================
// 雑草（食料にはならない）
// =====================================================================
weed('sugina', 'スギナ', 1, { habit: 'none', special: 'sugina' },
  '<strong>小さな杉の木</strong>のような姿。節ごとに細い枝が輪になって出ます。春のツクシはこのスギナの胞子茎です。');
weed('oobako', 'オオバコ', 1,
  { habit: 'rosette', count: 7, petiole: 8, scape: 46, leaf: lf('oval', 18, 9, '#4f8f45', { vein: 'parallel' }), flower: { type: 'spike', color: '#a8a87a', h: 26, n: 9, w: 1.4 } },
  '踏まれても平気な道ばたの草。<strong>縦にすじの通った広い葉</strong>が地面に広がり、細長い穂が立ちます。');
weed('enokorogusa', 'エノコログサ', 1,
  { habit: 'clump', count: 6, height: 44, droop: 12, leaf: lf('linear', 0, 2.6, '#6aa84a'), scape: 64, flower: { type: 'foxtail', color: '#b8b07a' } },
  '「ねこじゃらし」。<strong>ふさふさの毛の穂</strong>がたれ下がります。食料にはなりません。');
weed('katabami', 'カタバミ', 1,
  { habit: 'stalks', count: 6, height: 24, spread: 50, leaf: lf('obcordate', 7, 6, '#6ab84a', { compound: 'tri', spread: 60, taper: 0, vein: 'none' }), scape: 30, flower: { type: 'star', color: '#f6d23a', center: '#e8a020', size: 0.8 } },
  '<strong>ハートを3つ合わせた形の葉</strong>と小さな黄色い花。ミツバと間違えないで。家紋のデザインにもなっています。', ['mitsuba']);
weed('himejoon', 'ヒメジョオン', 1,
  { habit: 'stem', stems: 2, height: 70, nodes: 5, arrange: 'alt', leaf: lf('lance', 12, 3, '#6aa04a'), flower: { type: 'daisy', color: '#ffffff', center: '#f6d23a', size: 0.6 } },
  '空き地に生える背の高い草。<strong>白い小さな花</strong>が茎の先にたくさん咲きます。');
weed('harujion', 'ハルジオン', 2,
  { habit: 'stem', stems: 2, height: 56, nodes: 4, arrange: 'alt', leaf: lf('spoon', 12, 4, '#7aa85a'), flower: { type: 'daisy', color: '#f7d6e4', center: '#f6d23a', size: 0.7 } },
  'ヒメジョオンに似ていますが、<strong>つぼみが下を向き</strong>、花びらが細くうすいピンク色。茎の中は空洞です。', ['himejoon']);
weed('seitaka', 'セイタカアワダチソウ', 1,
  { habit: 'stem', stems: 1, height: 82, nodes: 7, arrange: 'alt', leafAngle: 50, leaf: lf('lance', 14, 3, '#5a9040'), flower: { type: 'spike', color: '#f2d23a', h: 18, n: 7, w: 2.2 } },
  '人の背より高くなる外来種。秋に<strong>黄色い花の穂</strong>がびっしり。周りの植物の成長をじゃまします。');
weed('mehishiba', 'メヒシバ', 2,
  { habit: 'clump', count: 8, height: 40, droop: 14, spread: 34, leaf: lf('linear', 0, 2, '#6aa84a'), scape: 52, flower: { type: 'plume', color: '#8a7a5a', size: 0.8 } },
  '畑のやっかい者。茎の先から<strong>細い穂が傘の骨のように</strong>何本も広がります。');
weed('ohishiba', 'オヒシバ', 2,
  { habit: 'clump', count: 8, height: 36, droop: 10, spread: 30, leaf: lf('linear', 0, 2.4, '#4a8040'), scape: 42, flower: { type: 'plume', color: '#5a6a3a', size: 0.6 } },
  'メヒシバより<strong>がっしりして抜きにくい</strong>草。穂は太く、引っぱってもなかなか抜けません。', ['mehishiba']);
weed('suzumenokatabira', 'スズメノカタビラ', 2,
  { habit: 'clump', count: 12, height: 28, droop: 8, spread: 36, leaf: lf('linear', 0, 1.8, '#7ab85a'), scape: 34, flower: { type: 'ball', color: '#cfdc9a', n: 10, size: 0.7 } },
  '道ばたや芝生に生える<strong>小さなイネ科の草</strong>。やわらかい葉で、ほぼ一年中見られます。');
weed('shirotsumekusa', 'シロツメクサ', 1,
  { habit: 'stalks', count: 6, height: 24, spread: 55, leaf: lf('round', 7, 6, '#5fa84a', { compound: 'tri', spread: 60, taper: 0, vein: 'none', mark: '#eef5e0' }), scape: 34, flower: { type: 'ball', color: '#ffffff', n: 18, size: 0.9 } },
  'クローバー。<strong>丸い3枚の葉に白い模様</strong>、白いぼんぼりの花。四つ葉を見つけたらラッキー！');
weed('yabugarashi', 'ヤブガラシ', 2,
  { habit: 'vine', leaf: lf('oval', 10, 4, '#4f8f3a', { compound: 'palm', n: 5, spread: 70, edge: 'serrate', teeth: 6 }) },
  'やぶを枯らすほど茂る<strong>つる草</strong>。<strong>5枚の葉が鳥の足のように</strong>広がり、巻きひげで絡みつきます。');
weed('hekusokazura', 'ヘクソカズラ', 2,
  { habit: 'vine', leaf: lf('lance', 12, 5, '#5a9a45'), flower: { type: 'star', color: '#f8f2f2', center: '#c8344a', size: 0.9 } },
  'ひどい名前ですが、葉や茎をもむと<strong>いやなにおい</strong>がするから。花は白く、まんなかが赤いかわいい形。');
weed('inutade', 'イヌタデ', 2,
  { habit: 'stem', stems: 3, height: 46, nodes: 4, arrange: 'alt', stemColor: '#b0485a', leaf: lf('lance', 12, 3, '#5f9a45'), flower: { type: 'spike', color: '#e87a9a', h: 12, n: 6, w: 1.6 } },
  '「あかまんま」。<strong>赤いつぶつぶの花穂</strong>をお赤飯に見立ててままごとに。辛みのある「ヤナギタデ（薬味）」とは別物です。');
weed('hirugao', 'ヒルガオ', 2,
  { habit: 'vine', leaf: lf('arrow', 12, 5, '#5aa045'), flower: { type: 'cup', color: '#f7b6d2', size: 1.3 } },
  'アサガオに似た<strong>うすいピンクの花</strong>が昼間に咲くつる草。<strong>葉は矢じりの形</strong>です。');
weed('hotokenoza', 'ホトケノザ', 1,
  { habit: 'stem', stems: 3, height: 34, nodes: 3, leaf: lf('round', 7, 6, '#5f9f45', { edge: 'crenate', teeth: 7 }), flower: { type: 'ball', color: '#d04a9a', n: 8, size: 1.1 } },
  '<strong>仏さまの台座のような丸い葉</strong>と赤紫の花。春の七草の「ほとけのざ」は<strong>別の植物（コオニタビラコ）</strong>で、こちらは食べません。');
weed('ooinunofuguri', 'オオイヌノフグリ', 1,
  { habit: 'stem', stems: 4, height: 24, nodes: 3, arrange: 'alt', leaf: lf('round', 5, 4, '#6aa84a', { edge: 'coarse', teeth: 5 }), flower: { type: 'star', color: '#4a7ad8', center: '#ffffff', n: 4, size: 0.8 } },
  '早春の道ばたに咲く<strong>小さな青い花</strong>（花びら4枚）。地面をはうように広がります。');
weed('inubiyu', 'イヌビユ', 2,
  { habit: 'stem', stems: 2, height: 50, nodes: 4, arrange: 'alt', leaf: lf('oval', 12, 7, '#5f9a45'), flower: { type: 'spike', color: '#8ab05a', h: 14, n: 7 } },
  '畑に生える草。<strong>先が少しへこんだ卵形の葉</strong>と、緑色のつぶつぶの穂。');
weed('chigaya', 'チガヤ', 2,
  { habit: 'clump', count: 8, height: 46, droop: 6, spread: 18, leaf: lf('linear', 0, 2.2, '#6a9a4a'), scape: 60, flower: { type: 'plume', color: '#f4f4f0', size: 0.7 } },
  '細い葉がまっすぐ立ち、初夏に<strong>白い綿毛の穂</strong>。土手や空き地で一面に生えます。');
weed('susuki', 'ススキ', 1,
  { habit: 'clump', count: 9, height: 70, droop: 20, spread: 34, leaf: lf('linear', 0, 2.4, '#7aa05a', { midline: '#e8f0d8' }), scape: 80, flower: { type: 'plume', color: '#d8c8a8' } },
  'お月見のススキ。<strong>葉のまんなかに白いすじ</strong>があり、ふちは<strong>ざらざらで手を切りやすい</strong>ので注意。');
weed('hamasuge', 'ハマスゲ', 3,
  { habit: 'clump', count: 7, height: 38, droop: 10, leaf: lf('linear', 0, 2, '#3f8a3a'), scape: 46, flower: { type: 'spider', color: '#7a4a2a', center: '#7a4a2a', size: 0.6 } },
  'つやのある細い葉と、<strong>赤茶色の穂</strong>。地下に小さな塊茎をつくり、抜いても抜いても生えてくる強い雑草。');
weed('butakusa', 'ブタクサ', 2,
  { habit: 'stem', stems: 1, height: 64, nodes: 4, leaf: lf('lance', 5, 2, '#6a9a4a', { compound: 'fine', rachis: 14, n: 4, thick: 1.4 }), flower: { type: 'spike', color: '#b8c86a', h: 18, n: 8, w: 1.6 } },
  '<strong>細かく切れ込んだ葉</strong>の外来種。秋の<strong>花粉症の原因</strong>になります。');
weed('konishikisou', 'コニシキソウ', 3,
  { habit: 'stem', stems: 5, height: 20, nodes: 4, stemColor: '#a0485a', leaf: lf('oval', 4, 2.5, '#6a8a4a', { vein: 'none', spots: '#7a3a5a' }) },
  '地面にぺったりはう小さな草。<strong>葉のまんなかに赤紫の斑点</strong>。茎を切ると白い汁が出て、肌がかぶれることも。');
weed('arechinogiku', 'アレチノギク', 3,
  { habit: 'stem', stems: 2, height: 62, nodes: 5, arrange: 'alt', leaf: lf('linear', 12, 2, '#8a9a7a'), flower: { type: 'ball', color: '#efe8c8', n: 8, size: 0.7 } },
  '空き地の<strong>灰色がかった細い葉</strong>の草。花は小さく目立たず、すぐに綿毛になります。');

// =====================================================================
// 毒草
// =====================================================================
poisonPlant('suisen', 'スイセン', 1,
  { habit: 'clump', count: 6, height: 56, spread: 14, droop: 3, leaf: lf('linear', 0, 4.6, '#6f9e86', { color2: '#7aab90' }), scape: 64, flower: { type: 'narcissus', color: '#ffffff', center: '#f6d23a' } },
  '<strong>ニラより葉が厚く幅広で、ちぎってもニラのにおいがしない</strong>。地下に球根があります。食べると30分ほどで<strong>はき気・おう吐</strong>。', ['nira', 'nobiru']);
poisonPlant('ajisai', 'アジサイ（葉）', 2,
  { habit: 'stem', stems: 1, nodes: 4, leaf: lf('oval', 18, 9, '#3f7f45', { edge: 'serrate', teeth: 12, gloss: true, vein: 'net' }) },
  '大葉に似ていますが、<strong>葉が厚くつやつや</strong>で、<strong>もんでもシソの香りがしない</strong>。料理の飾りの葉を食べて中毒した例があります。', ['aojiso']);
poisonPlant('torikabuto', 'トリカブト', 2,
  { habit: 'stem', stems: 1, nodes: 4, arrange: 'alt', leaf: lf('lance', 14, 5, '#2f7a3a', { compound: 'palm', n: 5, spread: 70, edge: 'deep', teeth: 4, gloss: true }) },
  '日本でいちばん危ない毒草のひとつ。<strong>手のひらのように深く切れ込んだ、つやのある葉</strong>。<strong>葉に長い柄がある</strong>のがニリンソウとの違い。少量でも命にかかわります。', ['nirinsou', 'yomogi']);
poisonPlant('dokuzeri', 'ドクゼリ', 2,
  { habit: 'stalks', count: 6, height: 56, special: 'dokuzeri', leaf: lf('lance', 9, 3, '#3f8a45', { compound: 'bipinnate', rachis: 16, n: 2, edge: 'serrate', teeth: 6 }) },
  'セリより<strong>ずっと大きく</strong>、葉は細長い。根元に<strong>緑色で太い、タケノコのような節のある地下茎</strong>があります。食べるとけいれんを起こす猛毒。', ['seri']);
poisonPlant('dokuninjin', 'ドクニンジン', 3,
  { habit: 'stalks', count: 5, height: 46, scape: 72, stemSpots: '#7a2a4a', leaf: lf('lance', 4, 2, '#4f9a45', { compound: 'bipinnate', rachis: 16, n: 3, edge: 'deep', teeth: 5 }), flower: { type: 'umbel', color: '#ffffff', n: 9 } },
  'パセリやチャービルに似た細かい葉ですが、<strong>茎に赤紫の斑点</strong>があり、<strong>ネズミの尿のようないやなにおい</strong>。古代ギリシャで毒殺に使われたほどの猛毒。', ['italianparsley', 'chervil']);
poisonPlant('inusafuran', 'イヌサフラン', 3,
  { habit: 'broad', count: 4, spread: 24, neckColor: '#4f8a45', leaf: lf('lance', 30, 8, '#3f8a45', { gloss: true, vein: 'parallel' }) },
  'ギョウジャニンニクに似ていますが、<strong>においがなく、根元が赤くない</strong>。葉は厚く、つやつや。コルヒチンという毒で<strong>死亡例も多い</strong>危険な植物。', ['gyoja']);
poisonPlant('suzuran', 'スズラン', 2,
  { habit: 'broad', count: 2, neck: 12, neckColor: '#6a9a4a', leaf: lf('oval', 30, 11, '#4f9a4a', { gloss: true, vein: 'parallel' }), scape: 40, flower: { type: 'bells', color: '#ffffff', n: 5, side: true } },
  '<strong>白い鈴の形の花</strong>がかわいいけれど猛毒。若葉がギョウジャニンニクに似ますが、<strong>においがしない</strong>。花を生けた水を飲んでも危険です。', ['gyoja']);
poisonPlant('baikeisou', 'バイケイソウ', 2,
  { habit: 'stem', stems: 1, height: 54, nodes: 4, arrange: 'alt', leafAngle: 40, stemW: 3, stemColor: '#7fae5a', leaf: lf('oval', 24, 10, '#7fae5a', { vein: 'parallel', wrinkle: true }) },
  'ウルイに似ていますが、<strong>葉に柄がなく、茎を包むように互い違いにつく</strong>。葉には<strong>たてのすじ（ひだ）がくっきり</strong>。食べると血圧低下・おう吐。', ['urui']);
poisonPlant('kobaikeisou', 'コバイケイソウ', 3,
  { habit: 'stem', stems: 1, height: 46, nodes: 4, arrange: 'alt', leafAngle: 40, stemW: 2.6, stemColor: '#7fae5a', leaf: lf('oval', 20, 9, '#86b862', { vein: 'parallel', wrinkle: true }), flower: { type: 'spike', color: '#fbfbf2', h: 18, n: 8 } },
  'バイケイソウより小さく、夏に<strong>白い花の穂</strong>。若葉はウルイとそっくりなので、<strong>茎を包む葉のつき方</strong>で見分けます。', ['urui']);
poisonPlant('hashiridokoro', 'ハシリドコロ', 3,
  { habit: 'none', special: 'hashiri' },
  '新芽がフキノトウに似ていますが、<strong>紫がかった色で、苦みもフキの香りもない</strong>。食べると幻覚を見て走り回ることが名前の由来という猛毒。', ['fukinotou']);
poisonPlant('chousenasagao', 'チョウセンアサガオ', 1,
  { habit: 'stem', stems: 1, height: 58, nodes: 3, arrange: 'alt', leaf: lf('oval', 16, 9, '#3f7f3a', { edge: 'coarse', teeth: 5 }), flower: { type: 'trumpet', color: '#fbfbf4', size: 1.1 }, fruit: { type: 'spiny', color: '#7aa84a', at: 'side' } },
  '<strong>白いラッパ形の花</strong>と<strong>トゲだらけの実</strong>。根をゴボウ、つぼみをオクラ、葉をモロヘイヤと間違えた中毒例があります。', 'ゴボウ・オクラ・モロヘイヤ');
poisonPlant('higanbana', 'ヒガンバナ（葉）', 2,
  { habit: 'clump', count: 7, height: 38, droop: 18, spread: 30, base: 'bulb', bulbR: 7, bulbColor: '#5a4a3a', leaf: lf('linear', 0, 3, '#2f6a3a', { midline: '#a8c8a8' }) },
  '秋の赤い花のあと、冬に葉が出ます。<strong>濃い緑の葉のまんなかに白っぽいすじ</strong>。<strong>ネギのにおいがせず</strong>、球根は<strong>黒っぽい皮</strong>。ノビルと間違えないで。', ['nobiru']);
poisonPlant('jigitarisu', 'ジギタリス', 2,
  { habit: 'broad', count: 4, spread: 50, neck: 4, leaf: lf('lance', 22, 7, '#5f8a4a', { edge: 'crenate', teeth: 10, wrinkle: true }), scape: 70, flower: { type: 'bells', color: '#e88ac8', spots: '#7a2a5a', n: 7, size: 0.9 } },
  '<strong>つりがね形の花がずらっと並ぶ</strong>園芸植物。花が咲く前の葉が<strong>コンフリー</strong>に似ていて、間違えて食べた中毒例があります。心臓に作用する猛毒。', ['borage']);
poisonPlant('youshuyamagobou', 'ヨウシュヤマゴボウ', 1,
  { habit: 'stem', stems: 1, height: 56, nodes: 3, arrange: 'alt', stemW: 2.6, stemColor: '#b0306a', leaf: lf('oval', 16, 7, '#4f8a3a'), fruit: { type: 'cluster', color: '#3a1a4a', n: 12, stem: '#b0306a', at: 'side' } },
  '<strong>真っ赤な茎</strong>に<strong>黒むらさきのブドウのような実の房</strong>。実も根も有毒です。「山ごぼう」の漬物は別の植物（モリアザミ）の根。', 'ブルーベリー・山ごぼう');
poisonPlant('dokuutsugi', 'ドクウツギ', 2,
  { habit: 'shrub', stems: 3, nodes: 4, leafAngle: 70, stemColor: '#8a5a4a', leaf: lf('lance', 10, 3.5, '#5a9a45', { vein: 'parallel' }), fruit: { type: 'star', color: '#7a1a3a' } },
  '日本三大有毒植物のひとつ。<strong>赤から黒むらさきに熟す実</strong>は甘く、キイチゴと間違えやすい。葉には<strong>3本のたてすじ</strong>。', 'キイチゴ');
poisonPlant('kyouchikutou', 'キョウチクトウ', 2,
  { habit: 'shrub', stems: 2, nodes: 4, arrange: 'whorl', whorl: 3, stemColor: '#6a8a4a', leaf: lf('lance', 18, 3, '#2f6a3a', { gloss: true }), flower: { type: 'star', color: '#f08aa8', center: '#f8d0dc', size: 1.1 } },
  '公園や道路わきに植えられる木。<strong>細長くかたい葉が3枚ずつ輪生</strong>し、ピンクの花。<strong>枝をバーベキューの串に使うのも危険</strong>なほどの猛毒。', ['laurel']);
poisonPlant('kuwazuimo', 'クワズイモ', 2,
  { habit: 'stalks', count: 3, height: 26, spread: 40, special: 'taro', leaf: lf('arrow', 30, 16, '#3f8a3a', { gloss: true, vein: 'net' }) },
  '名前の通り「食わず芋」。サトイモに似ていますが、<strong>葉につやがあり</strong>、<strong>地上に太い茎が立ち上がる</strong>。食べると口の中が激しく痛みます。', 'サトイモ');
poisonPlant('shikimi', 'シキミ', 2,
  { habit: 'shrub', stems: 2, nodes: 4, arrange: 'alt', stemColor: '#6a6a4a', leaf: lf('lance', 12, 4, '#3f7a45', { gloss: true }), fruit: { type: 'star', color: '#a07a4a' } },
  'お墓やお寺に植えられる木。<strong>実が中華料理の八角（スターアニス）にそっくり</strong>で、間違えて使った中毒例があります。植物で唯一「劇物」に指定された猛毒。', '八角（スターアニス）');
poisonPlant('takenigusa', 'タケニグサ', 1,
  { habit: 'stem', stems: 1, height: 70, nodes: 3, arrange: 'alt', stemColor: '#9ab0a0', leaf: lf('round', 22, 14, '#8aa890', { edge: 'deep', teeth: 6, under: '#e8ece8' }), flower: { type: 'spike', color: '#f2ead6', h: 20, n: 7 } },
  '空き地に生える大きな草。<strong>菊のように切れ込んだ白っぽい葉</strong>。茎を切ると<strong>オレンジ色の汁</strong>が出ます。全草が有毒。');
poisonPlant('kitsunenobotan', 'キツネノボタン', 3,
  { habit: 'stalks', count: 5, height: 38, scape: 46, leaf: lf('oval', 8, 5, '#4f9a45', { compound: 'tri', edge: 'deep', teeth: 4, spread: 45 }), flower: { type: 'star', color: '#f6e03a', center: '#c8a020', size: 0.9 } },
  'セリと同じ水辺に生え、若葉が似ています。<strong>つやつやの黄色い花</strong>と<strong>金平糖のような実</strong>が目印。<strong>セリの香りがしない</strong>。', ['seri', 'mitsuba']);
poisonPlant('kidachichousen', 'エンジェルトランペット', 1,
  { habit: 'shrub', stems: 1, height: 60, nodes: 3, arrange: 'alt', stemColor: '#7a8a5a', leaf: lf('oval', 18, 8, '#4f8a3a'), flower: { type: 'trumpet', color: '#f8f0c8', size: 1.4, droop: true } },
  'キダチチョウセンアサガオ。<strong>大きなラッパ形の花が下向き</strong>にたれる園芸植物。チョウセンアサガオの仲間で、葉や花を食べると幻覚などの中毒を起こします。', ['chousenasagao']);
poisonPlant('gloriosa', 'グロリオサ', 2,
  { habit: 'vine', leaf: lf('lance', 14, 4, '#4f9a3a', { gloss: true }), flower: { type: 'spider', color: '#d8344a', center: '#f6d23a', size: 0.9 } },
  '<strong>炎のように反り返った赤と黄の花</strong>。球根（塊茎）が<strong>ヤマイモ（ナガイモ）に似ていて</strong>、すりおろして食べた死亡例があります。', 'ヤマイモ');
poisonPlant('rengetsutsuji', 'レンゲツツジ', 2,
  { habit: 'shrub', stems: 2, nodes: 3, arrange: 'whorl', whorl: 4, stemColor: '#7a5a3a', leaf: lf('spoon', 12, 5, '#5a9a45'), flower: { type: 'cup', color: '#f08a3a', size: 1.3 } },
  '高原に咲く<strong>オレンジ色のツツジ</strong>。花・葉・<strong>蜜</strong>まで有毒なので、ツツジの<strong>蜜を吸う遊びも危険</strong>です。');

// =====================================================================
// 食べられるきのこ
// =====================================================================
eat('shiitake', 'シイタケ', 1,
  { on: 'log', count: 2, shape: 'convex', cap: '#8a5a3a', pattern: 'flecks', patternColor: '#f4ecd8', gills: '#f4ecd8', stemColor: '#efe6d4', stemH: 14, stemW: 6, capW: 34, capH: 13 },
  '茶色いかさに<strong>白いひび・ささくれ</strong>。ひだは白く、柄の根元を裂いても<strong>黒いしみはない</strong>。ツキヨタケとの見分けが大切。');
eat('hiratake', 'ヒラタケ', 2,
  { form: 'shelf', cap: '#8a8a90', cap2: '#6f7078', gills: '#f2eee2', count: 3 },
  '<strong>灰色のかさが棚のように重なって</strong>木に生えます。ひだは白。スーパーの「しめじ」として売られていたことも。');
eat('eringi', 'エリンギ', 1,
  { count: 1, shape: 'flat', cap: '#b8a07a', capW: 26, capH: 6, stemH: 40, stemW: 12, taper: 0.5, stemColor: '#f2ecdc', gills: '#efe6d2' },
  '<strong>太くて白い柄</strong>に小さな茶色のかさ。コリコリした食感。もとは地中海地方のきのこです。');
eat('enoki', 'エノキタケ', 1,
  { count: 9, tuft: true, shape: 'convex', cap: '#f4efd8', capW: 7, capH: 3, stemH: 50, stemW: 2, stemColor: '#f4efe0', gills: '#f4efe0' },
  'お店の白いエノキは光を当てずに育てたもの。<strong>野生のエノキは茶色いかさでぬるぬる</strong>、冬に木の切り株に生えます。');
eat('bunashimeji', 'ブナシメジ', 1,
  { count: 7, tuft: true, shape: 'convex', cap: '#a89070', pattern: 'dapple', patternColor: '#6a5a4a', capW: 14, capH: 6, stemH: 26, stemW: 4, stemColor: '#f2ecdc' },
  'スーパーでおなじみの「しめじ」。かさに<strong>大理石のようなまだら模様</strong>があり、株になって生えます。');
eat('honshimeji', 'ホンシメジ', 2,
  { count: 3, tuft: true, shape: 'convex', cap: '#7a6a5a', capW: 22, capH: 9, stemH: 22, stemW: 8, bulb: true, stemColor: '#f4f0e6', gills: '#f6f2e6' },
  '「香りマツタケ、味シメジ」のシメジ。<strong>柄が太く、根元がぷっくりふくらむ</strong>。クサウラベニタケとの見分けに注意。');
eat('hatakeshimeji', 'ハタケシメジ', 3,
  { count: 5, tuft: true, shape: 'convex', cap: '#6a5a4a', capW: 20, capH: 7, stemH: 22, stemW: 5, stemColor: '#f0eadc', gills: '#f2ece0' },
  '畑や道ばたの土から<strong>株になって生える</strong>シメジ。かさは<strong>暗い灰茶色</strong>で、ひだは白っぽい。');
eat('maitake', 'マイタケ', 1,
  { form: 'fronds', cap: '#6a5a4a', cap2: '#8a7a66', wavy: true },
  '<strong>へら形のかさが何重にも重なり</strong>大きな株に。見つけた人が舞い上がって喜ぶから「舞茸」という説も。');
eat('nameko', 'ナメコ', 1,
  { on: 'log', count: 5, tuft: true, shape: 'convex', cap: '#c8642a', slimy: true, capW: 14, capH: 6, stemH: 14, stemW: 3.5, stemColor: '#e8c88a', gills: '#e8c88a' },
  '<strong>オレンジ茶色のかさがぬるぬるのゼリー</strong>におおわれています。おみそ汁の具の定番。');
eat('mushroom', 'マッシュルーム', 1,
  { count: 2, shape: 'convex', cap: '#f6f2ea', capW: 28, capH: 13, stemH: 14, stemW: 9, gills: '#b07a6a', ring: '#f6f2ea', ringAt: 0.8 },
  '白くて丸いかさ。<strong>ひだはピンクからチョコレート色</strong>に変わり、<strong>根元に袋（つぼ）はありません</strong>。白いきのこはドクツルタケに要注意。');
eat('matsutake', 'マツタケ', 2,
  { count: 1, shape: 'convex', cap: '#7a4a2a', pattern: 'fibers', patternColor: '#4a2a1a', capW: 28, capH: 10, stemH: 40, stemW: 10, stemColor: '#efe4cc', stemPattern: 'scaly', stemPatternColor: '#8a6a4a', gills: '#f4eee0' },
  'アカマツの林に生える高級きのこ。<strong>太い柄に茶色いささくれ</strong>、独特の<strong>いい香り</strong>。');
eat('tamagotake', 'タマゴタケ', 2,
  { count: 1, shape: 'convex', cap: '#e8442a', pattern: 'striate', patternColor: '#b8301a', capW: 30, capH: 13, stemH: 36, stemW: 5, stemColor: '#f6d23a', stemPattern: 'zigzag', gills: '#f6d86a', ring: '#f6d23a', volva: 'sack' },
  '真っ赤なかさですが食べられます。<strong>かさに白いイボがなく</strong>、<strong>柄とひだが黄色</strong>、柄に<strong>だんだら模様</strong>。根元に白い卵のような袋。');
eat('hanaiguchi', 'ハナイグチ', 2,
  { count: 1, shape: 'convex', cap: '#b8642a', slimy: true, under: 'pores', gills: '#e8d06a', stemColor: '#e8c86a', ring: '#f0e0a0', capW: 28, capH: 11, stemH: 22, stemW: 6 },
  'カラマツ林に生える「ジコボウ」。<strong>ぬめりのある赤茶色のかさ</strong>で、裏は<strong>ひだではなくスポンジ状</strong>（黄色）。');
eat('amigasa', 'アミガサタケ', 2,
  { form: 'morel', cap: '#b89a6a', cap2: '#6a5030', stemColor: '#f2e6cc' },
  'かさが<strong>はちの巣のような網目</strong>。春に生え、フランス料理の高級食材「モリーユ」。<strong>生食は中毒</strong>するのでよく加熱を。');
eat('kikurage', 'キクラゲ', 1,
  { form: 'ear', on: 'trunk', cap: '#5a3a2a', cap2: '#7a5a4a', count: 3 },
  '枯れ木に生える<strong>人の耳のような形</strong>のきのこ。コリコリした食感で、中華料理によく使います。');
eat('shirokikurage', 'シロキクラゲ', 2,
  { form: 'ear', on: 'trunk', cap: '#f6f4ee', cap2: '#e6e2d6', jelly: true, count: 3 },
  '<strong>白く半透明のゼリー</strong>が花びらのように集まったきのこ。デザートのシロップ煮に。');
eat('yamabushitake', 'ヤマブシタケ', 2,
  { form: 'pompom', on: 'trunk', cap: '#f6f0e0' },
  '山伏の衣装の飾りに似ていることから。<strong>白いはりがたくさん垂れ下がる</strong>、ぬいぐるみのようなきのこ。');
eat('hanabiratake', 'ハナビラタケ', 3,
  { form: 'fronds', cap: '#f4eedc', cap2: '#e8dcc4', wavy: true, count: 14 },
  '<strong>白い花びらやキャベツ</strong>のような姿。高い山の針葉樹の根元に生える珍しいきのこ。');
eat('mukitake', 'ムキタケ', 3,
  { form: 'shelf', cap: '#b89a6a', cap2: '#8a7a4a', pattern: 'fuzz', gills: '#efe6c0' },
  'かさの<strong>表皮がつるりとむける</strong>のが名前の由来。表面に<strong>細かい毛</strong>。ツキヨタケと同じブナの木に生えるので要注意。', ['tsukiyotake']);
eat('kuritake', 'クリタケ', 2,
  { on: 'log', count: 5, tuft: true, shape: 'convex', cap: '#b0502a', cap2: '#d07a4a', capW: 18, capH: 7, stemH: 18, stemW: 4, stemColor: '#e8d8b8', gills: '#c8b090' },
  '<strong>栗のような赤茶色のかさ</strong>が株になって切り株に生えます。<strong>苦くない</strong>のがニガクリタケとの違い。');
eat('naratake', 'ナラタケ', 2,
  { on: 'log', count: 5, tuft: true, shape: 'convex', cap: '#c89a5a', cap2: '#8a6a3a', pattern: 'scales', patternColor: '#6a4a2a', capW: 18, capH: 7, stemH: 26, stemW: 3.5, ring: '#f0e6c8', stemColor: '#d8c49a', gills: '#f0e6cc' },
  '「ボリボリ」とも呼ばれる人気のきのこ。かさの中心に<strong>黒っぽい小さなささくれ</strong>、柄に<strong>つば</strong>。<strong>加熱が不十分だと中毒</strong>します。');
eat('urabenihotei', 'ウラベニホテイシメジ', 3,
  { count: 1, shape: 'convex', cap: '#9a8a7a', pattern: 'dapple', patternColor: '#e8e0d4', capW: 32, capH: 12, stemH: 26, stemW: 9, gills: '#e8b8a8', stemColor: '#f2eee6' },
  'かさに<strong>指で押したようなかすり模様</strong>、柄は<strong>太くて中までつまっている</strong>。ひだは成熟するとピンク色。猛毒のクサウラベニタケにそっくり。');
eat('shougenji', 'ショウゲンジ', 3,
  { count: 1, shape: 'convex', cap: '#c8a060', pattern: 'fibers', patternColor: '#a07a40', capW: 28, capH: 12, stemH: 30, stemW: 6, ring: '#f2ead6', stemColor: '#f0e6d0', stemPattern: 'fibrils', gills: '#d8c08a' },
  '黄土色のかさで、若いときはかさに<strong>白い粉</strong>。柄に<strong>つば</strong>があります。歯切れがよく、だしがよく出るきのこ。');
eat('akayamadori', 'アカヤマドリ', 2,
  { count: 1, shape: 'convex', cap: '#c8642a', pattern: 'cracked', patternColor: '#e8b06a', capW: 36, capH: 16, under: 'pores', gills: '#f0d86a', stemH: 30, stemW: 10, stemColor: '#f2d870', bulb: true, stemPattern: 'scaly' },
  '<strong>オレンジ色の大きなかさがひび割れて</strong>います。裏はスポンジ状。大きくて食べごたえのあるイグチの仲間。');
eat('yamadoritakemodoki', 'ヤマドリタケモドキ', 3,
  { count: 1, shape: 'convex', cap: '#9a6a3a', capW: 34, capH: 15, under: 'pores', gills: '#f0eac8', stemH: 26, stemW: 11, stemColor: '#d8c49a', bulb: true, stemPattern: 'net' },
  'ポルチーニの仲間。<strong>柄全体に網目模様</strong>があり、かさの裏はスポンジ状。似たドクヤマドリは柄が黄色く網目がありません。');
eat('porcini', 'ポルチーニ', 2,
  { count: 1, shape: 'convex', cap: '#7a4a2a', capW: 34, capH: 15, under: 'pores', gills: '#f4eedc', stemH: 24, stemW: 13, stemColor: '#efe6d0', bulb: true, stemPattern: 'net' },
  '和名ヤマドリタケ。<strong>太くてずんぐりした柄に白い網目</strong>、かさは焼いたパンのような色。イタリア料理の高級食材。');
eat('anzutake', 'アンズタケ', 2,
  { count: 1, shape: 'funnel', cap: '#f2b030', cap2: '#f6c650', under: 'ridges', gills: '#e8a020', capW: 26, capH: 12, stemH: 18, stemW: 5, stemColor: '#f2b030', taper: 0.8 },
  '<strong>あんず色のラッパ形</strong>で、ひだは<strong>低いしわのように柄まで流れる</strong>。ほんのりあんずの香り。西洋では「ジロール」。');
eat('truffle', 'トリュフ', 3,
  { form: 'ball', cap: '#3a2a22', pattern: 'bumps', patternColor: '#000', cut: '#6a5040', sunk: true, count: 2, capW: 14 },
  '<strong>地面の中にできる黒いごつごつの玉</strong>。断面に大理石模様。豚や犬がにおいで探す、世界三大珍味のひとつ。');
eat('hatsutake', 'ハツタケ', 2,
  { count: 1, shape: 'funnel', cap: '#c88a5a', cap2: '#b07a4a', pattern: 'zones', patternColor: '#9a5a3a', capW: 28, capH: 10, stemH: 16, stemW: 6, stemColor: '#e8c8a0', milk: '#c8501a' },
  '<strong>年輪のような輪の模様</strong>があるかさ。傷つけると<strong>赤茶色の乳液</strong>が出て、やがて<strong>青緑色のしみ</strong>になります。', ['karahatsu']);
eat('aitake', 'アイタケ', 3,
  { count: 1, shape: 'flat', cap: '#7aa070', pattern: 'cracked', patternColor: '#c8d8b8', capW: 30, capH: 9, stemH: 22, stemW: 7, stemColor: '#f6f2ea', gills: '#f6f2ea' },
  '<strong>くすんだ緑色のかさが、細かくひび割れ</strong>ています。ひだと柄は真っ白。ベニタケの仲間で数少ない食用種。');
eat('chichitake', 'チチタケ', 3,
  { count: 1, shape: 'funnel', cap: '#b8642a', capW: 28, capH: 9, stemH: 18, stemW: 6, stemColor: '#c8803a', milk: '#ffffff' },
  '傷つけると<strong>白い乳液がたっぷり</strong>あふれ出ます。栃木県では「ちたけそば」にして食べる人気のきのこ。');
eat('tamogitake', 'タモギタケ', 2,
  { on: 'log', count: 6, tuft: true, shape: 'convex', cap: '#f6d22a', capW: 16, capH: 6, stemH: 18, stemW: 3, stemColor: '#f4eedc', gills: '#f6f0d6' },
  '<strong>鮮やかな黄色のかさ</strong>が株になって木に生えます。北海道では「タモキノコ」。ひだは白く、苦みもありません。');
eat('bunaharitake', 'ブナハリタケ', 3,
  { form: 'shelf', cap: '#f2ead6', cap2: '#e6dcc4', gills: '#f2e6c0', count: 4 },
  'ブナの枯れ木に白いかさが重なって生え、<strong>裏がひだではなく細かいはり</strong>。甘い香りがあります。');
eat('masutake', 'マスタケ', 2,
  { form: 'bracket', cap: '#f08a3a', gills: '#f8e08a', count: 2 },
  '<strong>鱒（マス）の身のようなオレンジ色</strong>の、木に生える大きなきのこ。若くやわらかいうちが食べごろ。');
eat('kanzoutake', 'カンゾウタケ', 3,
  { form: 'bracket', cap: '#b0303a', gills: '#f0d8c8', count: 1, pattern: 'dots' },
  '<strong>牛のレバーのような赤い色</strong>と形。切ると赤い汁がにじみます。フランスでは「牛の舌」と呼ばれ、生でも食べられる珍しいきのこ。');
eat('hokoritake', 'ホコリタケ', 2,
  { form: 'ball', cap: '#efe6d0', pattern: 'warts', patternColor: '#c8b89a', count: 3, capW: 12 },
  '<strong>白くて丸いきのこ</strong>。<strong>若くて中が真っ白なうち</strong>は食べられ、古くなると中が粉になって、押すと<strong>ほこりのように胞子</strong>が出ます。');
eat('sasakurehitoyo', 'ササクレヒトヨタケ', 2,
  { count: 1, shape: 'shaggy', cap: '#f6f2ea', cap2: '#c8a888', pattern: 'shaggy', patternColor: '#b89a7a', capW: 18, capH: 22, stemH: 18, stemW: 4, ring: '#f6f2ea', ringAt: 0.3, under: 'none' },
  '<strong>白く背の高い筒形のかさ</strong>に<strong>ささくれ</strong>。すぐに黒く溶けてしまうので、採ったらすぐ料理します。');
eat('murasakishimeji', 'ムラサキシメジ', 2,
  { count: 1, shape: 'convex', cap: '#8a6aa8', capW: 30, capH: 12, stemH: 18, stemW: 8, stemColor: '#a890c0', gills: '#9a80b8', bulb: true },
  '全体が<strong>きれいな紫色</strong>のきのこ。落ち葉の上に生えます。<strong>生では中毒</strong>するので必ず加熱を。');
eat('shakashimeji', 'シャカシメジ', 3,
  { count: 9, tuft: true, shape: 'convex', cap: '#9a8a7a', capW: 12, capH: 5, stemH: 18, stemW: 3, stemColor: '#f0ece2', gills: '#f2eee6' },
  'お釈迦さまの頭のように、<strong>小さなかさがぎっしり集まって</strong>大きな株になります。「センボンシメジ」とも。');
eat('ooichoutake', 'オオイチョウタケ', 3,
  { count: 1, shape: 'convex', cap: '#f2ece0', capW: 40, capH: 15, stemH: 30, stemW: 10, gills: '#f6f2e8', stemColor: '#f2ece0' },
  '竹やぶや杉林に<strong>輪になって生える大型の白いきのこ</strong>。かさは直径20cmにもなります。');
eat('koutake', 'コウタケ', 3,
  { count: 1, shape: 'funnel', cap: '#7a5a3a', pattern: 'scales', patternColor: '#3a2a1a', capW: 32, capH: 12, stemH: 14, stemW: 7, stemColor: '#8a6a4a' },
  'かさに<strong>反り返った黒いうろこ</strong>、裏は<strong>ひだではなくはり</strong>。乾かすと強い香りが出る、幻のきのこ。');
eat('houkitake', 'ホウキタケ', 3,
  { form: 'coral', cap: '#f4dcc4', cap2: '#f0a8a8', stemColor: '#f6f0e6' },
  '<strong>ほうきやサンゴのように枝分かれ</strong>したきのこ。枝先が<strong>うすいピンク〜紫</strong>。そっくりなハナホウキタケは毒。', ['hanahouki']);
eat('karakasatake', 'カラカサタケ', 2,
  { count: 1, shape: 'flat', cap: '#e8d8c0', cap2: '#8a6a4a', pattern: 'scales', patternColor: '#8a6a4a', capW: 40, capH: 10, stemH: 50, stemW: 4, stemColor: '#c8b090', stemPattern: 'scaly', ring: '#f2ead6', bulb: true, gills: '#f6f2e8' },
  '<strong>開いた唐傘のような大きなかさ</strong>と、<strong>ひょろ長い柄にだんだら模様</strong>。つばは柄にそって動かせます。ひだは白いまま。');
eat('yanagimatsutake', 'ヤナギマツタケ', 3,
  { on: 'log', count: 3, tuft: true, shape: 'convex', cap: '#b89a7a', cap2: '#8a6a4a', capW: 20, capH: 8, stemH: 24, stemW: 4, ring: '#efe6d4', gills: '#a08a70' },
  'ヤナギなど広葉樹の幹に株で生え、柄に<strong>白い膜のつば</strong>。シャキシャキした歯ごたえ。');
eat('shouro', 'ショウロ', 3,
  { form: 'ball', cap: '#e8d8a8', count: 3, capW: 10, sunk: true, cut: '#f6f2e6' },
  '海岸の松林の砂の中にできる<strong>丸いきのこ</strong>。<strong>切った中身が白い</strong>若いものがおいしい。中が黒むらさきならニセショウロ（毒）。', ['niseshouro']);
eat('amitake', 'アミタケ', 3,
  { count: 2, shape: 'convex', cap: '#b8904a', slimy: true, under: 'pores', gills: '#c8a85a', capW: 26, capH: 8, stemH: 16, stemW: 5, stemColor: '#c8a86a' },
  '松林に生え、かさの裏が<strong>網の目のような大きめの穴</strong>。ゆでると<strong>赤むらさき色</strong>に変わります。');
eat('numeriiguchi', 'ヌメリイグチ', 3,
  { count: 1, shape: 'convex', cap: '#8a4a2a', slimy: true, under: 'pores', gills: '#e8d070', ring: '#f0e8e0', stemColor: '#f0e0a0', stemPattern: 'dots', capW: 28, capH: 11, stemH: 22, stemW: 6 },
  '松林に生える<strong>ぬるぬるの茶色いかさ</strong>。裏はスポンジ状、柄に<strong>白っぽいつば</strong>と小さな粒。');
eat('kinugasatake', 'キヌガサタケ', 2,
  { count: 1, shape: 'bell', cap: '#6a6a3a', pattern: 'cracked', patternColor: '#3a3a1a', capW: 18, capH: 14, stemH: 40, stemW: 6, stemColor: '#f6f2ea', ring: '#fbf8f0', ringType: 'net', ringAt: 0.98, volva: 'sack', under: 'none' },
  '<strong>白いレースのスカート</strong>を広げる「きのこの女王」。かさの粘液はくさいので洗い流し、スカートと柄を中華スープに。');
eat('himematsutake', 'ヒメマツタケ', 3,
  { count: 1, shape: 'convex', cap: '#b89a7a', pattern: 'fibers', patternColor: '#7a5a3a', capW: 28, capH: 12, stemH: 22, stemW: 8, ring: '#f2ead6', gills: '#8a5a4a', stemColor: '#f2ece0' },
  '「アガリクス」の名で知られるマッシュルームの仲間。<strong>アーモンドのような甘い香り</strong>。ひだは茶色になります。');
eat('sakatsubatake', 'サケツバタケ', 3,
  { count: 1, shape: 'convex', cap: '#9a5a3a', capW: 32, capH: 13, stemH: 28, stemW: 8, ring: '#f2ead6', gills: '#5a4a5a', stemColor: '#f2ece0', bulb: true },
  'つばが<strong>星形に裂ける</strong>のが名前の由来（裂け鍔）。わらや畑に生え、ひだは紫がかった黒。');

// =====================================================================
// 毒きのこ
// =====================================================================
dokuKinoko('tsukiyotake', 'ツキヨタケ', 2,
  { form: 'shelf', cap: '#b0703a', cap2: '#6a4a5a', gills: '#f0e2c8', stain: '#4a2a3a', glow: true, count: 3 },
  '日本で<strong>いちばん中毒が多い</strong>毒きのこ。シイタケやムキタケに似ますが、<strong>柄の付け根を裂くと黒紫色のしみ</strong>。暗い所で<strong>ひだが青白く光る</strong>。', ['shiitake', 'hiratake', 'mukitake']);
dokuKinoko('kusaurabeni', 'クサウラベニタケ', 3,
  { count: 1, shape: 'convex', cap: '#a09a8a', slimy: true, capW: 30, capH: 11, stemH: 26, stemW: 5, stemColor: '#f2eee6', gills: '#e8b8a8' },
  'ウラベニホテイシメジやホンシメジに似ますが、<strong>かさにかすり模様がなく</strong>、<strong>柄が細くてもろく中が空洞</strong>。中毒件数の多い毒きのこ。', ['urabenihotei', 'honshimeji']);
dokuKinoko('ipponshimeji', 'イッポンシメジ', 3,
  { count: 1, shape: 'umbo', cap: '#8a7a6a', capW: 32, capH: 12, stemH: 30, stemW: 6, gills: '#e8c0b0', stemColor: '#e8e2d6' },
  '灰茶色のかさで、ひだは成熟すると<strong>ピンク色</strong>。食べるとはげしい腹痛・下痢。食用のシメジ類と間違えやすい。', ['hatakeshimeji']);
dokuKinoko('kakishimeji', 'カキシメジ', 2,
  { count: 2, shape: 'convex', cap: '#9a4a2a', cap2: '#6a2a1a', slimy: true, capW: 30, capH: 11, stemH: 20, stemW: 7, gills: '#f2eee2', stains: '#a0502a', stemColor: '#f0e6d6' },
  '<strong>栗色でぬめりのあるかさ</strong>。白いひだに<strong>赤茶色のしみ</strong>が出ます。地味な見た目で食用と間違えやすく、中毒件数が多いきのこ。', ['shiitake', 'kuritake']);
dokuKinoko('tengutake', 'テングタケ', 2,
  { count: 1, shape: 'flat', cap: '#7a5a3a', pattern: 'warts', capW: 32, capH: 10, stemH: 32, stemW: 5, ring: '#ffffff', volva: 'rings', bulb: true, gills: '#ffffff', stemColor: '#fbf8f0' },
  '<strong>茶色いかさに白いイボ</strong>が散らばります。根元はふくらんで<strong>輪のようなつぼ</strong>。食べると神経症状や幻覚。');
dokuKinoko('benitengu', 'ベニテングタケ', 1,
  { count: 1, shape: 'convex', cap: '#e0302a', pattern: 'warts', capW: 34, capH: 13, stemH: 36, stemW: 6, ring: '#ffffff', bulb: true, volva: 'rings', stemColor: '#ffffff', gills: '#ffffff' },
  '絵本でおなじみの<strong>赤いかさに白いイボ</strong>。<strong>柄とひだが白い</strong>のがタマゴタケとの違い。食べるとおう吐や幻覚。', ['tamagotake']);
dokuKinoko('ibotengu', 'イボテングタケ', 2,
  { count: 1, shape: 'flat', cap: '#6a4a2a', pattern: 'warts', patternN: 22, capW: 36, capH: 10, stemH: 30, stemW: 6, ring: '#f6f2ea', volva: 'rings', bulb: true, gills: '#ffffff', stemColor: '#fbf8f0' },
  'テングタケに似た<strong>こげ茶のかさに、とがった白いイボがびっしり</strong>。神経系の中毒を起こします。', ['tengutake']);
dokuKinoko('tamagotengu', 'タマゴテングタケ', 2,
  { count: 1, shape: 'convex', cap: '#b8b86a', cap2: '#8a8a4a', pattern: 'fibers', patternColor: '#8a8a4a', capW: 32, capH: 12, stemH: 34, stemW: 6, ring: '#f6f6e8', volva: 'sack', gills: '#ffffff', stemColor: '#fbf8f0' },
  '<strong>オリーブ色のかさ</strong>、白いひだ、つば、<strong>袋状のつぼ</strong>。<strong>世界のきのこ中毒死の大半</strong>を占める猛毒。1本で命を落とすことも。');
dokuKinoko('dokutsurutake', 'ドクツルタケ', 1,
  { count: 1, shape: 'convex', cap: '#fbfaf6', capW: 28, capH: 14, stemH: 40, stemW: 5, ring: '#ffffff', volva: 'sack', gills: '#ffffff', stemColor: '#ffffff', stemPattern: 'scaly', stemPatternColor: '#e0dcd0' },
  '「死の天使」と呼ばれる<strong>真っ白な猛毒きのこ</strong>。<strong>ひだも白く、柄につば、根元に袋状のつぼ</strong>。マッシュルームはひだがピンク〜茶色でつぼがありません。', ['mushroom']);
dokuKinoko('shirotamagotengu', 'シロタマゴテングタケ', 3,
  { count: 2, shape: 'convex', cap: '#fbfaf6', capW: 22, capH: 10, stemH: 32, stemW: 4, ring: '#ffffff', volva: 'sack', gills: '#ffffff', stemColor: '#ffffff' },
  'ドクツルタケより小型の<strong>白い猛毒きのこ</strong>。同じく<strong>つばと袋状のつぼ</strong>があり、肝臓や腎臓をこわします。', ['mushroom']);
dokuKinoko('tamashirooni', 'タマシロオニタケ', 3,
  { count: 1, shape: 'convex', cap: '#f6f2ea', pattern: 'warts', patternColor: '#e6e0d0', capW: 26, capH: 11, stemH: 30, stemW: 5, bulb: true, ring: '#f6f2ea', stemColor: '#fbf8f0', stemPattern: 'scaly', stemPatternColor: '#e0dcd0', gills: '#ffffff' },
  '白いかさに<strong>とがった小さなイボ</strong>、根元が<strong>球のようにふくらむ</strong>。腎臓をこわす猛毒。');
dokuKinoko('kotamagotengu', 'コタマゴテングタケ', 3,
  { count: 1, shape: 'convex', cap: '#e8e0b8', pattern: 'patches', patternColor: '#ffffff', capW: 26, capH: 10, stemH: 30, stemW: 4, ring: '#ffffff', bulb: true, gills: '#ffffff', stemColor: '#fbf8f0' },
  '<strong>うすい黄色のかさに白い膜のかけら</strong>。根元は<strong>かぶらのようにふくらむ</strong>。じゃがいものようなにおい。');
dokuKinoko('fukurotsuru', 'フクロツルタケ', 3,
  { count: 1, shape: 'convex', cap: '#c8b8a0', pattern: 'patches', patternColor: '#8a7a6a', capW: 30, capH: 12, stemH: 32, stemW: 5, volva: 'sack', stemColor: '#e8e0d0', stemPattern: 'scaly', stemPatternColor: '#a89a88', gills: '#ffffff' },
  '<strong>大きな袋状のつぼ</strong>が特徴。かさに茶色い綿くず状のかけら、柄にもささくれ。<strong>つばはありません</strong>。肝臓をこわす毒。');
dokuKinoko('hebikinokomodoki', 'ヘビキノコモドキ', 3,
  { count: 1, shape: 'flat', cap: '#8a7a6a', pattern: 'patches', patternColor: '#e8e2d8', capW: 32, capH: 9, stemH: 30, stemW: 5, ring: '#efe8dc', volva: 'sack', stemColor: '#e8e2d6', stemPattern: 'scaly', stemPatternColor: '#8a7a6a', gills: '#ffffff' },
  '<strong>灰茶色のかさに白いかけら</strong>、柄に<strong>ヘビのうろこのような模様</strong>。テングタケの仲間の毒きのこ。');
dokuKinoko('kotengumodoki', 'コテングタケモドキ', 3,
  { count: 1, shape: 'convex', cap: '#9a7a5a', pattern: 'patches', patternColor: '#e8e0d0', capW: 28, capH: 10, stemH: 30, stemW: 5, ring: '#f2ece0', bulb: true, gills: '#ffffff', stemColor: '#f6f2ea' },
  'くすんだ茶色のかさで、白いひだ、つば、根元に<strong>白い膜のつぼ</strong>。腎臓に障害を起こす毒。');
dokuKinoko('nigakuritake', 'ニガクリタケ', 2,
  { on: 'log', count: 6, tuft: true, shape: 'convex', cap: '#e8c03a', cap2: '#c8902a', capW: 16, capH: 6, stemH: 18, stemW: 3, stemColor: '#f2e2a0', gills: '#b8b84a' },
  'クリタケに似ますが、かさが<strong>硫黄のような黄色</strong>で、ひだが<strong>緑がかった黄色</strong>。かじると<strong>とても苦い</strong>（試すのは厳禁）。死亡例もある猛毒。', ['kuritake', 'tamogitake']);
dokuKinoko('nisekurohatsu', 'ニセクロハツ', 3,
  { count: 1, shape: 'flat', cap: '#4a443e', capW: 34, capH: 10, stemH: 14, stemW: 8, gills: '#f0ece4', stemColor: '#6a625a' },
  '<strong>黒っぽいかさ</strong>のきのこ。傷つけると<strong>赤くなるが黒くはならない</strong>（クロハツは赤→黒）。筋肉がとける症状を起こす<strong>猛毒</strong>。');
dokuKinoko('dokusasako', 'ドクササコ', 3,
  { count: 2, shape: 'funnel', cap: '#c8a070', capW: 30, capH: 12, stemH: 16, stemW: 5, stemColor: '#c8a070' },
  '地味な茶色の<strong>じょうご形</strong>。食べて数日後から<strong>手足の先が焼けるように痛み、1か月以上続く</strong>恐ろしい毒。', ['chichitake']);
dokuKinoko('kaentake', 'カエンタケ', 1,
  { form: 'fingers', cap: '#e8402a' },
  '<strong>炎のような赤い指</strong>が地面から生えたような姿。<strong>さわるだけでも皮ふがただれ</strong>、食べると死亡することもある猛毒。見つけても絶対にさわらないで！');
dokuKinoko('oowaraitake', 'オオワライタケ', 2,
  { on: 'log', count: 3, tuft: true, shape: 'convex', cap: '#e8a030', capW: 30, capH: 12, stemH: 26, stemW: 7, ring: '#e8b050', stemColor: '#e8b050', gills: '#e0a040' },
  '<strong>金色に近い黄色の大きなきのこ</strong>が株で木に生えます。とても苦く、食べると幻覚や興奮などの神経症状。', ['tamogitake']);
dokuKinoko('waraitake', 'ワライタケ', 3,
  { count: 2, shape: 'bell', cap: '#b8aa98', capW: 16, capH: 10, stemH: 40, stemW: 2.6, stemColor: '#8a7a6a', gills: '#4a4040' },
  '牧場などのフンに生える<strong>つりがね形のかさ</strong>のきのこ。ひだは黒っぽい。食べると幻覚を起こし、<strong>法律で所持も禁止</strong>されています。');
dokuKinoko('hikageshibire', 'ヒカゲシビレタケ', 3,
  { count: 2, shape: 'conical', cap: '#c8a070', capW: 16, capH: 10, stemH: 34, stemW: 2.4, stemColor: '#e8dcc8', gills: '#6a5a4a' },
  '細い柄に<strong>とがった小さなかさ</strong>。傷つくと<strong>青く変色</strong>します。幻覚を起こすため、<strong>法律で規制</strong>されたきのこ。');
dokuKinoko('ooshibire', 'オオシビレタケ', 3,
  { count: 2, shape: 'umbo', cap: '#b08a5a', capW: 20, capH: 8, stemH: 30, stemW: 3, stemColor: '#e8dcc8', gills: '#5a4a3a' },
  'ヒカゲシビレタケの仲間。<strong>中央が少し出っぱった茶色のかさ</strong>で、傷つくと<strong>青くなる</strong>。幻覚を起こし法律で規制されています。');
dokuKinoko('shaguma', 'シャグマアミガサタケ', 2,
  { form: 'brain', cap: '#7a3a2a', stemColor: '#e8e0d0' },
  'アミガサタケに似ますが、かさが<strong>脳みそのようにぐにゃぐにゃ</strong>で赤茶色。<strong>煮たときの湯気を吸うだけでも中毒</strong>する猛毒。', ['amigasa']);
dokuKinoko('haiiroshimeji', 'ハイイロシメジ', 3,
  { count: 1, shape: 'convex', cap: '#8a8a8a', capW: 34, capH: 12, stemH: 22, stemW: 9, gills: '#e8e2c8', stemColor: '#e6e2da' },
  '<strong>灰色の大きなかさ</strong>。昔は食べられていましたが、<strong>おう吐・下痢の中毒例</strong>が多く、毒きのことされています。', ['honshimeji']);
dokuKinoko('hoteishimeji', 'ホテイシメジ', 3,
  { count: 2, shape: 'funnel', cap: '#8a7a6a', capW: 30, capH: 10, stemH: 22, stemW: 6, bulb: true, stemColor: '#e8e0d4' },
  '<strong>じょうご形のかさ</strong>と、<strong>根元がとっくりのようにふくらむ</strong>柄。食べる前後に<strong>お酒を飲むと悪酔い</strong>のような中毒を起こします。');
dokuKinoko('hitoyotake', 'ヒトヨタケ', 2,
  { count: 3, tuft: true, shape: 'bell', cap: '#b8b0a8', pattern: 'striate', patternColor: '#8a8078', capW: 20, capH: 16, stemH: 30, stemW: 4, under: 'none', stemColor: '#f6f2ea' },
  '<strong>灰色のつりがね形</strong>のかさで、一晩で黒く溶けるので「一夜茸」。<strong>お酒といっしょに食べると</strong>顔が赤くなり動悸がする中毒に。', ['sasakurehitoyo']);
dokuKinoko('sugihiratake', 'スギヒラタケ', 2,
  { form: 'shelf', cap: '#fbfaf6', cap2: '#f0ede4', gills: '#f6f2ea', count: 4 },
  '杉の切り株に生える<strong>白い耳たぶのようなきのこ</strong>。昔は食べられていましたが、<strong>急性脳症による死亡例</strong>が出てから、食べないよう呼びかけられています。', ['hiratake']);
dokuKinoko('dokuyamadori', 'ドクヤマドリ', 3,
  { count: 1, shape: 'convex', cap: '#c8a060', capW: 38, capH: 16, under: 'pores', gills: '#f0d860', stemH: 26, stemW: 12, bulb: true, stemColor: '#f0d860' },
  'ヤマドリタケモドキに似ますが、<strong>柄が黄色く網目模様がない</strong>。傷つくと青く変わります。はげしいおう吐・下痢。', ['yamadoritakemodoki', 'porcini']);
dokuKinoko('nezumishimeji', 'ネズミシメジ', 3,
  { count: 1, shape: 'conical', cap: '#7a7a80', pattern: 'fibers', patternColor: '#4a4a50', capW: 26, capH: 10, stemH: 28, stemW: 5, stemColor: '#f2f2ee', gills: '#f0f0ea' },
  '<strong>ねずみ色のとがったかさ</strong>に、<strong>黒っぽい放射状のすじ</strong>。苦みと辛みがあり、胃腸の中毒を起こします。');
dokuKinoko('ooshirokarakasa', 'オオシロカラカサタケ', 2,
  { count: 1, shape: 'flat', cap: '#f2ece0', cap2: '#b89a7a', pattern: 'scales', patternColor: '#b89a7a', capW: 40, capH: 10, stemH: 40, stemW: 5, ring: '#ffffff', gills: '#b8d0a0', stemColor: '#f6f2ea' },
  '芝生や公園に生える<strong>白い大きなかさ</strong>。カラカサタケに似ますが、<strong>成熟するとひだが緑色</strong>になります。はげしいおう吐・下痢。', ['karakasatake']);
dokuKinoko('dokukarakasa', 'ドクカラカサタケ', 3,
  { count: 1, shape: 'flat', cap: '#b89a7a', cap2: '#6a4a3a', pattern: 'scales', patternColor: '#6a4a3a', capW: 36, capH: 12, stemH: 34, stemW: 6, bulb: true, ring: '#f2ead6', stemColor: '#e8dcc8', gills: '#f6f2e8' },
  'カラカサタケに似ますが、<strong>傷つけると赤く変色</strong>し、柄の根元が<strong>かぶらのようにふくらむ</strong>。だんだら模様はありません。', ['karakasatake']);
dokuKinoko('koreratake', 'コレラタケ', 3,
  { on: 'log', count: 4, tuft: true, shape: 'convex', cap: '#b8803a', capW: 16, capH: 6, stemH: 22, stemW: 2.6, ring: '#c8a070', stemColor: '#a08060', gills: '#b8803a' },
  'ナラタケなどに似た<strong>小さな茶色のきのこ</strong>。食べると<strong>コレラのような激しい下痢</strong>のあと、肝臓がこわれる猛毒。', ['naratake']);
dokuKinoko('ookinuhada', 'オオキヌハダトマヤタケ', 3,
  { count: 1, shape: 'conical', cap: '#e8dcb8', pattern: 'fibers', patternColor: '#b8a880', capW: 22, capH: 10, stemH: 22, stemW: 3.5, stemColor: '#f2ece0', gills: '#c8b8a0' },
  '<strong>とがったかさに絹のような繊維</strong>。食べると<strong>汗やよだれが止まらなくなる</strong>ムスカリン中毒を起こします。');
dokuKinoko('shirotomaya', 'シロトマヤタケ', 3,
  { count: 2, shape: 'conical', cap: '#f6f2ea', pattern: 'fibers', patternColor: '#d8d0c4', capW: 18, capH: 8, stemH: 22, stemW: 3, bulb: true, stemColor: '#fbf8f0', gills: '#d8ccb8' },
  '<strong>白くてとがったかさ</strong>の小さなきのこ。根元が少しふくらみます。汗・よだれなどのムスカリン中毒。');
dokuKinoko('dokubenitake', 'ドクベニタケ', 2,
  { count: 1, shape: 'convex', cap: '#e83a4a', capW: 30, capH: 10, stemH: 20, stemW: 7, stemColor: '#fbf8f4', gills: '#fbf8f4' },
  '<strong>赤いかさに真っ白な柄とひだ</strong>。イボもつぼもありません。とても<strong>辛く</strong>、食べるとおう吐・下痢。', ['tamagotake']);
dokuKinoko('hanahouki', 'ハナホウキタケ', 3,
  { form: 'coral', cap: '#f2b080', cap2: '#f6d0a0', stemColor: '#f6efe2' },
  'ホウキタケそっくりの<strong>ほうき形</strong>ですが、全体が<strong>サーモンピンク〜オレンジ色</strong>。食べると腹痛・下痢。', ['houkitake']);
dokuKinoko('usutake', 'ウスタケ', 2,
  { count: 1, shape: 'trumpet', cap: '#e88a3a', cap2: '#f2b060', pattern: 'scales', patternColor: '#b8501a', capW: 30, capH: 18, stemH: 10, stemW: 6, stemColor: '#e8c8a0' },
  '<strong>大きなラッパ（臼）の形</strong>で、内側に<strong>オレンジのうろこ</strong>。アンズタケと違い大型で、中に雨水がたまるほど深い。胃腸の中毒。', ['anzutake']);
dokuKinoko('kiibokasa', 'キイボカサタケ', 3,
  { count: 2, shape: 'conical', cap: '#f2d23a', cap2: '#e8b020', capW: 18, capH: 10, stemH: 30, stemW: 3, stemColor: '#f2d23a', gills: '#f6e8c0' },
  '<strong>先が乳首のようにとがった黄色いかさ</strong>。全体が黄色くかわいいですが、胃腸の中毒を起こします。');
dokuKinoko('niseshouro', 'ニセショウロ', 2,
  { form: 'ball', cap: '#d8b880', pattern: 'cracked', patternColor: '#8a6a3a', cut: '#3a2a3a', count: 2, capW: 14 },
  'ショウロに似た<strong>丸いきのこ</strong>ですが、皮が厚くかたく、<strong>切ると中が黒むらさき色</strong>。おう吐・腹痛。', ['shouro', 'hokoritake']);
dokuKinoko('tsuchisugitake', 'ツチスギタケ', 3,
  { count: 2, shape: 'convex', cap: '#c8a070', pattern: 'scales', patternColor: '#8a5a2a', capW: 28, capH: 10, stemH: 22, stemW: 6, stemPattern: 'scaly', stemPatternColor: '#8a5a2a', ring: '#e8d8b8', stemColor: '#e8d8b8', gills: '#b89a6a' },
  '道ばたの地面に株で生え、<strong>かさと柄に茶色いささくれ</strong>。食べると胃腸の中毒。');
dokuKinoko('miinomomi', 'ミイノモミウラモドキ', 3,
  { count: 1, shape: 'convex', cap: '#c8a890', capW: 22, capH: 9, stemH: 24, stemW: 4, gills: '#e8b8a8', stemColor: '#e8e0d4' },
  '<strong>うす茶色のかさにピンクのひだ</strong>の地味なきのこ。イッポンシメジの仲間で胃腸の中毒を起こします。');
dokuKinoko('hirohaanzu', 'ヒロハアンズタケ', 3,
  { count: 1, shape: 'funnel', cap: '#e8902a', cap2: '#f2a83a', under: 'ridges', gills: '#e8701a', capW: 24, capH: 10, stemH: 16, stemW: 4, stemColor: '#d8802a' },
  'アンズタケに似ますが、<strong>オレンジ色が濃く</strong>、<strong>本物のひだが密に並び二またに分かれる</strong>。胃腸の中毒を起こすことがあります。', ['anzutake']);
dokuKinoko('karahatsu', 'カラハツタケ', 3,
  { count: 1, shape: 'funnel', cap: '#c8905a', pattern: 'zones', patternColor: '#a06a3a', capW: 30, capH: 10, stemH: 16, stemW: 6, stemColor: '#e8d0b0', milk: '#ffffff' },
  'ハツタケに似た輪の模様ですが、傷つけると出る乳液が<strong>白くてとても辛い</strong>（ハツタケは赤茶色→青緑）。胃腸の中毒。', ['hatsutake']);
dokuKinoko('midorisugitake', 'ミドリスギタケ', 3,
  { on: 'log', count: 4, tuft: true, shape: 'convex', cap: '#4a8a7a', capW: 16, capH: 6, stemH: 18, stemW: 3, stemColor: '#c89a5a', gills: '#c89a3a' },
  '<strong>青緑色のかさ</strong>が木から株で生える、ふしぎな色のきのこ。食べると幻覚などの神経症状。');
dokuKinoko('himebenitengu', 'ヒメベニテングタケ', 3,
  { count: 1, shape: 'convex', cap: '#e0502a', pattern: 'warts', patternColor: '#f0c0a8', capW: 24, capH: 10, stemH: 28, stemW: 4, ring: '#f6e6e0', bulb: true, volva: 'rings', volvaColor: '#e8604a', stemColor: '#fbf2ec', gills: '#ffffff' },
  'ベニテングタケより小さく、<strong>根元のつぼが赤っぽい</strong>のが特徴。オレンジ赤のかさに<strong>赤みのあるイボ</strong>。神経系の毒。', ['tamagotake']);
dokuKinoko('kaburatengu', 'カブラテングタケ', 3,
  { count: 1, shape: 'flat', cap: '#e8dcc0', pattern: 'patches', patternColor: '#c8b090', capW: 30, capH: 10, stemH: 30, stemW: 5, bulb: true, ring: '#f2ead6', stemColor: '#f2ead6', gills: '#f6f2e8' },
  'うすい黄土色のかさで、根元が<strong>かぶらのように大きくふくらむ</strong>テングタケの仲間。毒きのこです。');
dokuKinoko('kusahatsu', 'クサハツ', 3,
  { count: 1, shape: 'convex', cap: '#c89a4a', slimy: true, pattern: 'striate', patternColor: '#8a6a2a', capW: 30, capH: 11, stemH: 18, stemW: 7, stemColor: '#f2ead6', gills: '#f0e6cc' },
  'かさのふちに<strong>くし目のような溝</strong>、ぬめりのある黄土色。<strong>油くさいいやなにおい</strong>で、食べると胃腸の中毒。');
dokuKinoko('koganekinukarakasa', 'コガネキヌカラカサタケ', 2,
  { count: 3, tuft: true, shape: 'bell', cap: '#f6dc3a', pattern: 'scales', patternColor: '#d8b020', capW: 16, capH: 12, stemH: 30, stemW: 3, stemColor: '#f6dc3a', ring: '#f6dc3a', gills: '#f6e8a0' },
  '全体が<strong>あざやかなレモン色</strong>。<strong>観葉植物の鉢植えの土</strong>からよく生えてきます。食べると胃腸の中毒。');
dokuKinoko('nakaguro', 'ナカグロモリノカサ', 3,
  { count: 1, shape: 'convex', cap: '#f2ece4', cap2: '#4a3a3a', pattern: 'fibers', patternColor: '#6a5a50', capW: 30, capH: 11, stemH: 22, stemW: 6, ring: '#ffffff', gills: '#8a5a5a', stemColor: '#f6f2ea' },
  'マッシュルームの仲間ですが、<strong>かさの中心が黒っぽく</strong>、傷つけると<strong>黄色に変わり薬品のようなにおい</strong>。胃腸の中毒。', ['mushroom', 'himematsutake']);

// 同じ id がないか・ステージごとの数を確認しやすくする
const SPECIES_BY_ID = Object.fromEntries(SPECIES.map((s) => [s.id, s]));

// そっくりな種の名前（表示用）
function likeNames(s) {
  if (!s.like) return '';
  if (typeof s.like === 'string') return s.like;
  return s.like.map((id) => SPECIES_BY_ID[id]?.name).filter(Boolean).join('・');
}

if (typeof module !== 'undefined') module.exports = { STAGES, KINDS, LEVELS, SPECIES, SPECIES_BY_ID, likeNames };
