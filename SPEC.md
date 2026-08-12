# hexa-defense 個別仕様書（SPEC.md）

> 共通標準（dev-standards/STANDARDS.md）との差分のみを記録する。
> 標準どおりの部分は書かない。「なぜ逸脱するか」を必ず書く。

## 基本情報

- 用途: ヘックスグリッドタワーディフェンスゲーム（公開）
- type: static-app, pwa, game
- 現行マイルストーン: M8 以降は #28（第三者プレイテスト）のみが残タスク

## 標準からの逸脱

| 標準ID | 逸脱内容 | 理由 | 昇格候補? |
|--------|----------|------|-----------|
| ARCH-04 | GitHub Actions なし。`deploy.sh`（scp）で手動デプロイ | 静的サイトのため push + CI より `./deploy.sh` の方がシンプル。index.html へのビルド日時埋め込みも deploy.sh で行う | ×（静的ゲームの標準デプロイパターン） |
| ARCH-05 | 静的サイトだが Netlify / GitHub Pages でなく ConoHa VPS に配置 | ea-journey.com サブドメインで URL 統一・nginx/Let's Encrypt の既存設定を流用できるため（`docs/decisions/004-deploy-vps.md`） | × |
| ARCH-06 | VPS 配置パスが `/var/www/hexa-defense`（`/opt/{app-name}` ではない） | 静的ファイルは nginx の document root として `/var/www/` 配下に配置するのが自然。systemd は不要 | × |
| AUTH-01 | 認証なし（公開ゲーム） | 不特定多数がプレイ可能な公開コンテンツのため認証は不要かつ有害 | × |
| DEV-04 | `tests/run.js` で Node.js 単体テストを実装（最終的に 299 ケース） | 単一 HTML ゲームのロジックが複雑化したため自動テストが必要と判断。ビルドツール不使用・単一 HTML 維持のため vm.runInNewContext() 方式を採用（`docs/decisions/018-automated-testing-approach.md`） | ○（ゲーム系の DEV-04 実践例として標準化済み） |
| UI-02 | OG meta 未整備 | 現状は口コミ・直リンク共有のみを想定。SNS カード最適化は対象外 | —（対応検討余地あり） |
| UI-03 | 英語フォント（Rajdhani / Chakra Petch）を主体に使用。Google Fonts CDN 経由 | SF/サイバー系ゲーム UI のため英語フォントが世界観に合致。日本語テキストはシステムフォントフォールバック（`-apple-system, sans-serif`） | × |
| MOB-07 | `apple-mobile-web-app-status-bar-style: black-translucent` を使用（独自指定） | iOS でゲームがフルスクリーン表示になるよう明示的に設定。ステータスバーをゲーム背景色に重ねる必要がある | —（ゲーム向けの一般例として参考可） |

## アプリ固有機能

- **Canvas 2D ゲームエンジン**: 全コードを `index.html` 単一ファイルに収録（約5,000行以上）。IIFE パターン
- **CONFIG オブジェクト集約**: バランス数値・ウェーブ設定など全パラメータを `CONFIG` に集約（`docs/config.md` 参照）。マジックナンバー禁止
- **deploy.sh**: scp で `index.html`（ビルド日時埋め込み）+ アセット（manifest.json / アイコン類）を VPS に転送。ビルド日時は `<!-- BUILD_DATE -->` コメントを置換して index.html に埋め込む。元ファイルは書き換えない
- **Web Audio API**: BGM・SE を外部ライブラリなしで実装
- **SaveData マイグレーション**: v1→v2→v3→v4 のセーブデータ自動マイグレーション（テストケース E）
- **Node.js 単体テスト**: `tests/loader.js` が `vm.runInNewContext()` で index.html のゲームロジックを評価。`node tests/run.js` で実行
- **nginx キャッシュ制御**: `deploy/nginx-hexa-defense.conf` で index.html と manifest.json は `no-cache`、画像は `immutable` 長期キャッシュ
- **viewport-fit=cover**: iOS Safe Area 対応（ゲームが画面端まで描画するため）

## 意図的に「やらない」こと

- サーバーサイド処理（スコアランキングなし。セーブデータはすべて localStorage）
- ユーザー認証・アカウント管理（公開ゲームのため不要）
- ビルドツール（esbuild / webpack 等）の導入（単一 HTML 維持が設計方針）
- 外部 JS ライブラリ（Canvas 2D のみで実装、CDN 依存なし）
- 自動デプロイ CI（手動 `./deploy.sh` で十分）

## 運用上の注意

- デプロイ前に `node tests/run.js` を実行し全テストパスを確認すること（CLAUDE.md に記載）
- iOS Safari 実機確認が最終品質基準（テストはロジック検証のみ。canvas描画・タッチイベントはスタブ迂回）
- `docs/decisions/` が 21 件あり、設計判断の根拠が詳細に記録されている。変更前に関連する決定を確認すること
- キャッシュ問題が発生した場合: nginx conf の no-cache 設定と deploy.sh のビルド日時埋め込みで対応済み（`docs/decisions/033`）
