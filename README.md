# HEXA DEFENSE

**本体ファイル: `index.html`**（単一HTMLで完結、ビルド不要）

ネオン風ヘクサゴンタワーディフェンス。50ウェーブを生き残れ。

---

## 遊び方

1. `index.html` をブラウザで開く（iPhone Safari 推奨）
2. **PLAY NOW** でゲーム開始
3. タワー周囲に迫る敵を自動砲台が迎撃
4. XPでレベルアップ → 3択カードで強化(サブウェポンもカードで育てる)
5. 必殺ゲージが満タンになったら **SPECIAL** を発動(4種: PULSE/RAILGUN/OVERDRIVE/BEAM)
6. W5ボスを倒して属性を選択し、以降のボスからも武器/属性を獲得
7. 50ウェーブ制覇で **VICTORY**

### チェックポイント
W10 / W20 / W30 / W40 到達時にセーブ。次ランはそこから再開可能。

### SP（スキルポイント）
ランで到達ウェーブ数×0.5 + ボス撃破数×3 のSPを獲得。
タイトル画面 **SP** で ATK / DEF / SPD / BARRIER / LUCK の5系統に振り分ける。

---

## テスト

Node.js がインストールされていれば、ブラウザなしで自動テストを実行できる。

```bash
node tests/run.js
```

テスト区分(85件): SP価格カーブ / SP効果関数(ATK/DEF/SPD/BARRIER/LUCK) / DPS計算 /
waveAccum帯別スケール / SaveDataマイグレーション(v1〜v4) / 属性効果 /
レアドロップ全キル経路コードパターン検査。

実装方式: `tests/loader.js` が `<script>` を Node.js `vm` で評価。
index.html は一切書き換えない（詳細は `docs/decisions/018-automated-testing-approach.md`）。

---

## デバッグ

URLに `?wave=N` を付けるとウェーブNからスタート（例: `?wave=20`）。

---

## 技術構成

| 項目 | 内容 |
|---|---|
| ファイル構成 | `index.html` 1ファイル（HTML/CSS/JS 完結） |
| 描画 | Canvas 2D API |
| 言語 | Vanilla JavaScript（ライブラリ・ビルドツールなし） |
| サウンド | Web Audio API（外部ファイルなし、オシレーター合成） |
| 永続化 | localStorage（saveData / settings） |
| 対象環境 | iOS Safari 16+ / Chrome / Firefox |

---

## ファイル構成

```
index.html          ← ゲーム本体
tests/
  loader.js         ← Node.js vm でゲームロジックを評価するローダー
  run.js            ← テストスクリプト (node tests/run.js)
manifest.json       ← PWAマニフェスト
hexa-favicon.svg    ← ファビコン用アイコン素材（小サイズ向け）
favicon-32.png      ← ファビコン 32×32
hexa-icon.svg       ← アプリアイコン素材（フル版）
apple-touch-icon.png ← iOS ホーム画面アイコン 180×180
icon-192.png        ← PWAアイコン 192×192
icon-512.png        ← PWAアイコン 512×512
README.md
STATUS.md           ← 開発進捗
docs/
  DESIGN.md         ← ゲームデザイン・バランス設計
  config.md         ← CONFIGパラメータ一覧
  decisions/        ← アーキテクチャ決定記録
hexa-defense-requirements.md  ← 要件書（開発参照用）
hexa-defense-mockup.html      ← モックアップ（参照用）
hexa-defense.html             ← プロトタイプ（参照用）
```

> `hexa-defense-requirements.md` / `hexa-defense-mockup.html` / `hexa-defense.html` は開発参照用。デプロイ時も同梱するが、ゲームとして動作するのは `index.html` のみ。

---

## デプロイ

公開URL: **https://hexa.ea-journey.com/**

ConoHa VPS(`160.251.252.203`) の `/var/www/hexa-defense` へ配信。
公開鍵認証を設定済みの状態で以下を実行:

```bash
./deploy.sh
```

`index.html`・`manifest.json`・アイコン類を scp で転送し、完了メッセージを表示して終了。
