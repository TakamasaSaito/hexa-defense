# 018: 自動テストの導入方式

日付: 2026-07-31
状態: 採用

## 決定

単一HTML方針を崩さず、`tests/loader.js` が index.html の `<script>` ブロックを
Node.js `vm.runInNewContext()` で評価する方式を採用する。
IIFE 末尾に `_hdExports` への書き出しコードを動的に注入し、
内部関数を tests/run.js からテストする。

## 理由

- **単一HTML維持**: index.html を分割しない。ビルドツール・外部ライブラリも不要。
- **素の Node.js**: 外部テストフレームワーク(Jest/Mocha等)を導入しない。
  `node tests/run.js` だけで動く。
- **ブラウザAPIスタブ**: document/canvas/localStorage を最小限のスタブで置き換え。
  iOS Safari 固有の挙動は実機検証で引き続き確認する。
- **代替案と不採用理由**:
  - ロジックを別ファイルに抽出 → 単一HTML方針に違反
  - コードコピー方式 → ソースと乖離するリスクがある
  - ブラウザ内テスト → CI での自動実行が困難

## 影響

- `tests/` ディレクトリに loader.js / run.js を追加。
- `node tests/run.js` でカバー範囲: SP価格カーブ / SP効果関数 /
  DPS計算 / waveAccum / SaveDataマイグレーション / 属性効果 /
  LUCK・DEF・BARRIERのSP反映 / レアドロップ全キル経路コードパターン。
- iOS Safari 特有の挙動(canvas描画・タッチイベント)はスタブで迂回されるため、
  機能確認は引き続き実機で行う。
