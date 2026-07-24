# HEXA DEFENSE — 開発ルール

## 方針
- 単一 HTML (`index.html`) を維持。ライブラリ・ビルドツール追加禁止
- Canvas 2D + Vanilla JS のみ

## iOS Safari ルール（全コード必須遵守）
- テンプレートリテラル不使用 → 文字列連結
- `alert` / `confirm` 不使用
- 8桁 hex 不使用 → `rgba()` で透明度を表現
- `Math.max(...array)` スプレッド不使用 → ループで最大値取得
- `devicePixelRatio` 上限 2

## バランス数値
- `CONFIG` オブジェクト1箇所に集約。マジックナンバー禁止
- 詳細は `docs/config.md` 参照

## Git
- commit は機能単位・日本語メッセージ
- push はしない（手動で節目に実施）
- 動作確認の最終基準は iPhone Safari 実機

## ドキュメント
- 機能変更時は `docs/` を必ず同時更新

## 要件書セクション7（CLAUDE.md 策定元）
要件書 `hexa-defense-requirements.md` セクション7を転記・整備したものが本ファイル。

## プロジェクト管理方針
本リポジトリは TakamasaSaito/portfolio-dashboard の MANAGEMENT.md に従う。
作業開始前に次で取得して読むこと:
gh api repos/TakamasaSaito/portfolio-dashboard/contents/MANAGEMENT.md --jq .content | base64 -d
