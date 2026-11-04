# iOS 版をビルドして App Store に出す手順（Mac での作業）

食べるな危険の iOS 版は、Android 版と同じ Capacitor で作っています（`ios/` フォルダ）。
コードの準備はできているので、Mac では「ビルドして App Store Connect にアップロードする」作業だけを行います。
（JET STRIKE・首都高グランプリの `docs/IOS_BUILD.md` と同じ構成です）

- Bundle ID：`jp.techgym.taverna`（Android と同じ）
- チーム：Team ID `GNM3VTX9YG`（Xcode の設定に入れてあります）。Apple Developer には**個人で登録**しています（App Store の販売元は個人名になります）
- 対応端末：iPhone（**縦画面固定**）。iPad では iPhone 用の画面で動きます
- ホーム画面の名前：「食べるな危険」（英語の端末では「Don't Eat It!」）
- 広告：AdMob（iOS 用のアプリと広告ユニット）。起動時に「トラッキングの許可」の確認画面が出ます

---

## 0. 先にブラウザでやること（ゲームごとに1回）

1. **Apple Developer**（developer.apple.com）→「Certificates, Identifiers & Profiles」→「Identifiers」→「＋」→「App IDs」→「App」
   - Description：`DONT EAT IT`（英数字だけにする。記号は使えないことがある）
   - Bundle ID：「Explicit」で `jp.techgym.taverna`
   - Capabilities：何もチェックしない
2. **App Store Connect**（appstoreconnect.apple.com）→「マイ App」→「＋」→「新規 App」
   - プラットフォーム：iOS ／ 名前：`食べるな危険 〜毒草・毒きのこ見分けゲーム〜`（Google Play と同じ） ／ プライマリ言語：日本語
   - バンドル ID：`jp.techgym.taverna` ／ SKU：`taverna` ／ ユーザアクセス：アクセス制限なし
3. **AdMob**
   - 「アプリを追加」→ **iOS** →「ストアに掲載されていない」で登録し、バナー・インタースティシャル・リワードの広告ユニットを作る
   - アプリ ID と広告ユニット ID 3 つを Claude Code に渡す（`ios/App/App/Info.plist` の `GADApplicationIdentifier` と `js/ads.js` の `UNITS.ios.production` に入ります）
   - 「プライバシーとメッセージ」→「欧州の規制」のメッセージに iOS アプリも追加する

---

## 1. Mac の準備（最初の1回だけ）

1. **Xcode** を App Store からインストールする（数十 GB あるので時間がかかります）。インストール後に一度起動し、追加コンポーネントのインストールを済ませる
2. Xcode の「Settings…」→「Accounts」→「＋」で、Apple Developer に登録している Apple ID でサインインする（チームが個人名で表示されれば OK）
3. **Node.js**（LTS 版）を https://nodejs.org/ からインストールする
4. ターミナルでリポジトリを取得する
   ```bash
   cd ~/Desktop   # 置きたい場所（どこでもよい）
   git clone https://github.com/techgymjp/taverna.git
   cd taverna
   npm ci
   ```
   `git` がないと言われたら、表示に従って「コマンドライン・デベロッパツール」をインストールしてから、もう一度実行します。

2回目以降は、`cd taverna` のあと `git pull` と `npm ci` で最新にします。

---

## 2. 自分の iPhone で動作確認する（テスト広告）

```bash
npm run ios:sync    # ゲームのファイルを iOS のプロジェクトにコピー（テスト広告）
npm run ios:open    # Xcode で開く
```

1. iPhone を USB ケーブルで Mac につなぎ、iPhone で「このコンピュータを信頼」を許可する
2. iPhone の「設定」→「プライバシーとセキュリティ」→「デベロッパモード」をオンにする（再起動を求められます。項目がない場合は、Xcode で一度 iPhone を選ぶと表示されます）
3. Xcode の上部で、実行先に自分の iPhone を選ぶ
4. 左の「App」→「Signing & Capabilities」で、「Automatically manage signing」がオン、Team に自分（個人名）のチームが選ばれていることを確認する
5. ▶（Run）を押すと、iPhone にアプリが入って起動する

確認すること

- 縦画面の全画面で表示される。左上のバージョンや右上のボタン（言語・BGM・効果音・声）がカメラの切り欠き（Dynamic Island）に隠れない
- 起動時にトラッキングの確認画面が出る
- タイトル画面・一時停止画面・結果画面の下にテスト用のバナーが出る（プレイ中は出ない）
- 「出発する！」「もう一回！」「きのこ編へ進む」「小屋へ戻る（結果・一時停止から）」「一時停止からの再開」で、テスト用の全画面広告が出る
- ライフがなくなると「CONTINUE?」が出て、「📺 広告を見て続ける」でテスト用のリワード広告を最後まで見ると、ライフ1つで続きから遊べる（1ゲーム1回）
- 音（BGM・効果音・ハンターの声）、シェア（結果画面の「📤 その他」で iOS の共有メニュー）、「🌐 English」で英語への切り替え

---

## 3. App Store 用にビルドしてアップロードする（本番広告）

```bash
git pull && npm ci
npm run ios:release   # 本番の広告 ID でコピーする（ここが ios:sync と違う）
npm run ios:open
```

1. Xcode の左で「App」→「General」→「Identity」を開き、**Build の番号を前回より大きくする**（初回は 1。アップロードのたびに 2、3…と上げる。同じ番号は二度アップロードできない）。Version はストアに表示されるバージョン（1.0.0）
2. 上部の実行先を「**Any iOS Device (arm64)**」にする
3. メニューの「Product」→「**Archive**」（「Product」メニューは画面最上部のメニューバー。全画面表示だと隠れるので、マウスを画面の上端に動かす）
4. 終わると Organizer が開くので、「**Distribute App**」→「**App Store Connect**」→「Upload」で進める（途中の確認は既定のまま「Next」でよい。「Xcode Cloud can automate…」は「Remind Me Later」で閉じてよい）
5. 10〜30 分ほどで、App Store Connect の「TestFlight」タブにビルドが表示される

輸出コンプライアンス（暗号化）の質問は、Info.plist で「独自の暗号化は使っていない」と設定済みなので、聞かれません。

**注意**：`ios:release` でビルドしたアプリは本番の広告が出ます。TestFlight で確認するときも、**本番の広告はタップしない**でください（AdMob のアカウント停止の対象）。Xcode から iPhone に直接入れて試すときは、`npm run ios:sync` でテスト広告に戻してから実行します。

---

## 4. TestFlight で確認し、審査用の録画を撮る

1. App Store Connect の「TestFlight」→「内部テスト」でグループを作り、自分を追加する
2. iPhone に「TestFlight」アプリを App Store から入れ、届いた招待から食べるな危険をインストールする
3. **審査用の画面録画を撮る**（新しいアカウントは、最初の審査で実機での操作の録画を求められます。先に用意しておくと早い）
   - iPhone の「設定」→「コントロールセンター」に「画面収録」を追加し、コントロールセンターから録画を始める
   - **アプリの起動から**撮る：起動 → トラッキングの確認 → タイトル → 出発する！ → ハーブ編（数十秒。わざと毒草を採ってハンターが怒るところも）→ 一時停止 → 結果画面 → 図鑑 → シェア
   - 本番広告が出ても**タップしない**。広告が閉じるまで待つ
   - 2〜3 分に収める。大きすぎて送れないときは、Mac の Finder で右クリック →「選択したビデオファイルをエンコード」→ 720p で小さくするか、Google ドライブの共有リンクを使う

---

## 5. App Store Connect で審査に出す

「配信」タブ（iOS App のバージョン 1.0.0。「1.0」になっていたら 1.0.0 に直す）で入力します。

| 項目 | 入力内容 |
| --- | --- |
| スクリーンショット | 「Dynamic Island 搭載 iPhone（中型ディスプレイ）」の欄に、`docs/store/ios/6.3inch/` の **1206 × 2622（縦向き）** を入れる。日本語版（ja-）と英語版（en-）各 4 枚。このゲームは縦画面なので、JET STRIKE などの横向き（2622 × 1206）とは向きが逆 |
| ヘッダ・検索結果 | 「ヘッダと検索結果」タブに `docs/store/ios/appstore-header-3840x1646.png` と `appstore-search-3840x2560.png`（両方入れる。片方だけだと赤枠になる） |
| 名前・サブタイトル・プロモーション用テキスト・概要 | `docs/store/ios/listing.md`（App Store 用の掲載情報。日英） |
| キーワード（100 文字以内） | `docs/store/ios/listing.md` |
| サポート URL | https://techgym.jp/ |
| プライバシーポリシー URL（App 情報） | https://techgym.jp/privacy-policy/ |
| カテゴリ（App 情報） | ゲーム（サブカテゴリ「トリビア」。または「教育」） |
| 著作権 | 2026 TECH GYM K.K. |
| ビルド | TestFlight で確認したビルドを選ぶ |
| 年齢制限 | 質問に答える（暴力・性的表現なし。毒草・毒きのこを「食べてはいけないもの」として扱うが、食べる・中毒になる場面の描写はない） |
| コンテンツの配信権（App 情報） | 第三者のコンテンツを「いいえ」（絵・音・文章はすべてオリジナル） |
| App のプライバシー | AdMob が収集するデータを申告する（下記） |
| App Review に関する情報 | ログイン不要。連絡先を入力。メモに下の「審査へのメモ」を貼る |

**App のプライバシー（AdMob を使うアプリの目安）**
Google の「Apple の App Store のデータ開示要件への準備」（AdMob のヘルプ）に、AdMob が収集するデータの一覧があります。必ずそちらを見て最終確認してください。目安は次のとおりです。

- 収集する：ID（デバイス ID）、使用状況データ（広告データ、製品の操作）、診断（クラッシュデータ、パフォーマンスデータ、その他の診断データ）、位置情報（おおよその場所）
- 目的：サードパーティ広告、アナリティクス
- ユーザーに関連付け：しない
- トラッキングに使用：デバイス ID と広告データは「する」
- アプリ自体は個人情報を集めない（ハンター名・ランキング・クリアの記録は端末の中だけに保存）

**審査へのメモ（App Review に関する情報の「メモ」に貼る。初回に「Guideline 2.1 - Information Needed」が来たら、同じ文を返信し、4 章で撮った録画を添付する）**

```
1. Purpose and audience: Don't Eat It! is a free casual quiz/action game for ages 13+. Herbs, weeds, wild greens and mushrooms keep sprouting in a field, and the player taps only the edible ones within 60 seconds while avoiding poisonous lookalikes. All 200 species are real, and an in-game field guide explains how to tell them apart.

2. How to use: No login or account is needed. Tap "出発する！" (Head out!) on the title screen to start the Herbs stage. Clearing it unlocks the Mushrooms stage. The game is available in Japanese and English (switch with the "🌐 English" button at the top).

3. External services: Google AdMob (banner, interstitial and rewarded ads) with Google's consent form (UMP) and App Tracking Transparency. Rewarded ads are optional: when the player runs out of lives, watching one lets them continue with one life, once per game. No other services or in-app purchases.

4. Regional differences: None, except that the ad consent form appears only where required (e.g. EEA/UK).

5. Regulated content / third-party material: The game is not in a regulated industry. All graphics, sounds and text are original. The game does not encourage eating wild plants; the title screen warns players not to pick or eat anything they cannot identify with certainty.

6. Originality (Guideline 4.3): This is an original game, not a reskin or a template-based variation of our other apps. Its game system was designed and programmed specifically for this title: the real-time field where plants and mushrooms sprout and wither, the lookalike-based spawning and difficulty curve, the hunter's orders, lives and continue system, and the two stages (Herbs and Mushrooms). The 200 species, their identification notes, the procedurally drawn illustrations of each species, the field guide, and the sound effects and music were all created from scratch for this game. It differs from our other apps in genre, gameplay, content and visuals. Only standard technical parts, such as the Capacitor app shell and the AdMob ad integration, are shared across our apps.
```

入力が終わったら「審査用に追加」→「審査へ提出」。

---

## 6. 公開後にやること

- AdMob で iOS アプリを App Store のアプリに紐づける（「アプリ」→ iOS の食べるな危険 →「アプリの設定」）
- App Store からインストールして、起動・同意画面・トラッキングの確認・広告を確認する

---

## 7. 自動化の準備（2回目以降を GitHub Actions に任せる場合）

JET STRIKE の `docs/IOS_BUILD.md` の 7 章と同じです。App Store Connect の API キーと配布用の証明書は Apple Developer のチーム共通なので、ほかのゲームで作ったものを使い回せます。このリポジトリの Secrets（https://github.com/techgymjp/taverna/settings/secrets/actions）に、次の 5 つを登録します。

| 名前 | 内容 |
| --- | --- |
| `IOS_DIST_CERT_P12_BASE64` | 証明書（.p12）を変換した文字列 |
| `IOS_DIST_CERT_PASSWORD` | .p12 を書き出したときのパスワード |
| `ASC_KEY_ID` | API キーのキー ID |
| `ASC_ISSUER_ID` | Issuer ID |
| `ASC_KEY_P8_BASE64` | API キー（.p8）を変換した文字列 |

ファイルを文字列にしてコピーするには、ターミナルで次を実行します（1つずつ実行して、そのつど GitHub に貼り付ける）。

```bash
base64 -i 証明書.p12 | tr -d '\n' | pbcopy
base64 -i AuthKey_XXXXXXXXXX.p8 | tr -d '\n' | pbcopy
```

登録すると、既定のブランチ（`main`）に push するたびに、GitHub Actions の「iOS release (TestFlight)」（`.github/workflows/ios-release.yml`）が、本番広告の設定でビルドして App Store Connect（TestFlight）にアップロードします。Secrets がないあいだは何もしません。

- ビルド番号は **100 + 実行回数**（Mac の Xcode から手でアップロードする 1、2、… と重ならないように）。Version は `package.json` の version
- 署名用のプロファイル（`jp.techgym.taverna AppStore CI`）は、API キーを使って自動で作ります（`scripts/ios_profile.py`）。Bundle ID が Apple Developer に登録済み（0 章の 1）であること
- 手で動かすときは Actions タブ →「iOS release (TestFlight)」→「Run workflow」
- 審査への提出は、これまでどおり App Store Connect で行う

**注意**：証明書（.p12）、そのパスワード、API キー（.p8）は、チャット・AI へのアップロード・リポジトリへのコミットで**絶対に共有しない**でください。Claude Code には「登録した」とだけ伝えます。

---

## つまずきやすいところ

| 症状 | 対処 |
| --- | --- |
| アップロードで「同じビルド番号がすでにある」 | General の Build の番号を上げてから Archive し直す |
| Signing でエラー（チームが選べない、証明書がない） | Xcode の Accounts で Apple ID にサインインし直し、Team を選ぶ。「Automatically manage signing」をオンにする |
| 実行先に iPhone が出ない | ケーブルをつなぎ直し、iPhone で「信頼」を許可。デベロッパモードをオンにする |
| 実行先に「iOS 26.x Not Installed」と出る | 「Get」で iOS の部品をダウンロードする（8 GB ほど。Archive にも必要） |
| ビルドが古いゲームのまま | `npm run ios:sync`（または `ios:release`）を実行し忘れている。`git pull` してから実行し直す |
| ビルドを選ぼうとしても出てこない | App Store Connect のバージョンが「1.0」のまま。1.0.0 に直して保存する |
| スクリーンショットがアップロードできない | 欄が「Dynamic Island 搭載 iPhone（中型ディスプレイ）」か確認する。このゲームは縦向き（1206 × 2622） |
| 「審査用に追加できません」 | 「App 情報」のコンテンツの配信権、「App のプライバシー」のプライバシーポリシー URL が入っているか確認する |
| 本番広告とテスト広告の取り違え | App Store 用は必ず `npm run ios:release`。Xcode から実機で試すときは `npm run ios:sync` に戻す |
| App Store の審査で「Xcode が古い」と言われる | Xcode を最新版に更新してから Archive し直す |
