# 食べるな危険

狩猟小屋のハンターに頼まれて、仲間のハンターたちのために野山で **食べられるもの** を収穫するゲームです。
畑にはハーブ・山菜と、雑草・そっくりな毒草がどんどん生えてきます。食べられるものだけを素早くタップしよう！

## 遊び方

▶ **https://techgymjp.github.io/taverna/** で遊べます。

`index.html` をブラウザで開くだけでも遊べます（ビルド不要・外部ライブラリなし）。

🌐 **English** — 右上の「🌐 English」ボタンで英語に切り替えられます（**https://techgymjp.github.io/taverna/?lang=en** で英語版を直接開けます）。最初は端末の言語に合わせ、選んだ言語は次回も使われます。

- 制限時間は **60秒**。生えてきた植物（きのこ）をタップすると収穫。しばらくすると枯れて消えます
- ライフは **3つ**。雑草や毒を採るとライフが減り、ハンターが「こら、それは○○だ！」と怒ります
- ハンターの **注文の品** を採ると3倍の点数。連続で正しく採るとボーナス
- 時間がたつほど早く生え、まぎらわしい種（★★〜★★★）が出てきます
- ライフを残して **ノルマ** を達成するとクリア。**ハーブ編** をクリアすると **きのこ編** が解放されます
- 結果画面では、収穫したものの名前と、まちがえて採ったものの見分けポイントをおさらい
- 「野草・きのこ図鑑」で全200種の特徴とそっくりさんを確認できます
- ステージごとのランキング（この端末のブラウザに保存）、SNS シェア、BGM・効果音・ハンターの声（音声読み上げ）の ON/OFF

## 収録種（すべて実在の種・200種）

| ステージ | 内訳 | 例 |
| --- | --- | --- |
| 🌿 ハーブ編（100種） | 食べられる 53・雑草 24・毒草 23 | ニラ ⇔ スイセン、大葉 ⇔ アジサイの葉、ギョウジャニンニク ⇔ イヌサフラン・スズラン、セリ ⇔ ドクゼリ、ニリンソウ ⇔ トリカブト、ウルイ ⇔ バイケイソウ、フキノトウ ⇔ ハシリドコロ など |
| 🍄 きのこ編（100種） | 食べられる 50・毒 50 | シイタケ ⇔ ツキヨタケ、タマゴタケ ⇔ ベニテングタケ、マッシュルーム ⇔ ドクツルタケ、クリタケ ⇔ ニガクリタケ、ウラベニホテイシメジ ⇔ クサウラベニタケ、アミガサタケ ⇔ シャグマアミガサタケ など |

> ⚠️ このゲームは見分けの入り口です。野生の植物・きのこは専門家でも間違えることがあります。確実にわからないものは、採らない・食べない・人にあげないでください。

## ファイル構成

- `index.html` … 画面
- `css/style.css` … スタイル
- `js/data.js` … ステージと200種のデータ（種類・難易度・見分けポイント・イラスト設定）
- `js/data-en.js` … 200種の英語名と英語の見分けポイント
- `js/i18n.js` … 日本語・英語の画面の文言とハンターのセリフ、言語の切り替え
- `js/art.js` … 植物・きのこのイラスト（`data.js` の `look` から SVG をコードで生成）
- `js/sound.js` … 効果音・BGM（Web Audio で合成）とハンターの声（音声合成）
- `js/ranking.js` … ランキングの保存と並べ替え
- `js/game.js` … ゲーム進行・ハンターのセリフ
- `img/ogp.png` … SNS でリンクを貼ったときに表示される画像
- `js/ads.js` … 広告（Android アプリのときだけ動く。Web 版では何もしない）
- `js/ads-config.js` / `js/build-info.js` … 広告のモードとバージョン（アプリのビルド時に書き換える）
- `android/` … Android アプリのプロジェクト（Capacitor）
- `ios/` … iOS アプリのプロジェクト（Capacitor）
- `scripts/build-web.js` … アプリに入れるファイルを `www/` にコピーする
- `assets/` … アプリのアイコンと起動画面の元画像
- `docs/store/` … Google Play 用のスクリーンショット・フィーチャーグラフィック・アイコンと、紹介文の下書き（`listing.md`、英語は `listing-en.txt`）

## 種の追加方法

`js/data.js` に `herb()`（食べられる草）・`weed()`（雑草）・`poisonPlant()`（毒草）・`eat()`（食用きのこ）・`dokuKinoko()`（毒きのこ）の1行を追加します。
`look` に葉の形・つき方・花・かさの形・ひだの色・つば・つぼなどを書くと、`js/art.js` がイラストを組み立てます。

## Android アプリ

[Capacitor](https://capacitorjs.com/) でゲームのファイルをアプリに同梱し、Android アプリにしています（オフラインで遊べます）。
構成は techgymjp/jet-fighter の `docs/ANDROID_PORTING.md`、techgymjp/jackal と同じです。

- パッケージ名: `jp.techgym.taverna`（縦画面固定・全画面・プレイ中は画面を消さない）
- アプリ名はホーム画面で「食べるな危険」（英語の端末では Don't Eat It!）
- 戻るボタン: プレイ中は一時停止（一時停止中なら再開）、タイトル・結果画面ではアプリを閉じる。別のアプリに切り替えると一時停止して音を止める
- シェアは Android の共有メニュー（結果画面の「📤 その他」）
- 広告（AdMob）
  - バナー: タイトル画面・一時停止画面・結果画面の下中央（プレイ中は畑と重なるので出さない）
  - 全画面広告: 「出発する」「もう一回」「次のステージへ」「小屋へ戻る（結果・一時停止から）」「一時停止からの再開」のたびに出す
  - リワード: ライフがなくなったときの「CONTINUE?」で、広告を最後まで見るとライフ1つで続きから（1ゲーム1回。結果画面とシェア文に「コンティニュー1回」と出る）
  - 起動時に Google の同意確認（EU など）。必要な地域ではタイトル画面に「広告の設定」が出る
  - 動作確認用 APK はテスト広告、Google Play 用の AAB だけ本番広告（`ADMOB_MODE=production`）
- タイトル画面の左上にバージョン（`v1.0.0 (build 12)` など）、下にプライバシーポリシーへのリンク

GitHub Actions（`.github/workflows/android.yml`）が push のたびに次を行います。

1. `npm ci` → `npm run build`（`www/` にゲームをコピー）→ `npx cap sync android` → デバッグ APK をビルド
2. 既定ブランチなら、Release `android-latest` の `taverna.apk` を差し替え（動作確認用・テスト広告）
   - リリース画面: https://github.com/techgymjp/taverna/releases/tag/android-latest（QR コード: `docs/apk-qr.png`）
   - APK 直接: https://github.com/techgymjp/taverna/releases/latest/download/taverna.apk
3. GitHub Secrets に署名鍵（`ANDROID_KEYSTORE_BASE64` / `ANDROID_KEYSTORE_PASSWORD` / `ANDROID_KEY_ALIAS` / `ANDROID_KEY_PASSWORD`）があれば、本番広告で署名付き AAB を作り Artifact に上げる

![動作確認用 APK のリリース画面の QR コード](docs/apk-qr.png)

手元で試すとき: `npm install` → `npm run android:sync` → `npm run android:open`（Android Studio が必要）。
アイコンと起動画面は `assets/` の元画像から `npx @capacitor/assets generate --android` で生成しています。

## iOS アプリ

Android 版と同じ Capacitor のプロジェクトに `ios/` を足して作っています。構成は techgymjp/jet-fighter（JET STRIKE）の `docs/ANDROID_PORTING.md` の 7 章と同じです。Mac での作業手順は `docs/IOS_BUILD.md` にあります。

- Bundle ID: `jp.techgym.taverna`（Android と同じ）、iPhone 専用・縦画面固定・全画面・プレイ中は画面を消さない
- アプリ名はホーム画面で「食べるな危険」（英語の端末では Don't Eat It!）
- 広告は Android と同じルール。起動時に App Tracking Transparency の確認を出す
- AdMob の iOS 用の ID は `ios/App/App/Info.plist`（アプリ ID）と `js/ads.js` の `UNITS.ios.production`（広告ユニット）
- iPhone のノッチ・ホームバーに重ならないよう、画面の上下を `env(safe-area-inset-*)` であける
- GitHub Actions: `.github/workflows/ios.yml` で push のたびに Xcode でビルドできるかを確認（署名なし）、`.github/workflows/ios-release.yml` で本番広告の設定でビルドして TestFlight にアップロード（Secrets があるとき。ビルド番号は実行回数 + 100）
- App Store 用の画像と掲載情報は `docs/store/ios/`（スクリーンショットは縦向き 1206 × 2622）

## ライセンス

著作権はテックジム株式会社に帰属します（All rights reserved）。許可なく複製・改変・再配布すること、Web サイトやアプリとして公開・販売すること、名前・ロゴ・アイコン・画像を使うことを禁止します。
テックジムの受講生が学習目的で複製・改変することは許可します（アプリストアでの公開・広告の掲載・販売などの商用利用は禁止）。詳しくは `LICENSE` をご覧ください。

## 公開（GitHub Pages）

`.github/workflows/pages.yml` が push のたびにサイトをデプロイします。
初回のみ、リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定してください。
