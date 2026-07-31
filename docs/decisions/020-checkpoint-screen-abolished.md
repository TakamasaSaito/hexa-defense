---
name: checkpoint-screen-abolished
description: チェックポイント選択画面(START FROM CHECKPOINT)を廃止した理由
metadata:
  type: project
---

# 020: チェックポイント選択画面廃止

日付: 2026-08-01
状態: 採用

## 決定
タイトル画面の「SELECT WAVE」ボタンと START FROM CHECKPOINT 画面を削除し、
PLAY を押したら常に W1 から開始する。

## 理由
- SP制移行(#15)とラン内成長設計(#17)により、途中ウェーブから始める意味が薄れた
- チェックポイント開始時の補償(武器付与)は現設計と噛み合わず、意図しない強さ差を生む
- W1からの一本道ラン設計を前提とすることで難度調整の一貫性が保たれる

## 影響
- `scrCheckpoint` div・`checkpointBtn`・関連関数・`checkpointWeaponMode` を削除
- `unlockedCheckpoints` フィールドは save data の互換性のため残存(マイグレーションで使用)
- 既存セーブデータは影響なし
