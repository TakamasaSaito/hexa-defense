---
name: special-tripleshot
description: 必殺を3種化し共有ゲージ+コスト+個別CDで運用(PULSE/RAILGUN/OVERDRIVE)
metadata:
  type: project
---

# 006: 必殺3種化

日付: 2026-07-30
状態: 採用

## 決定
必殺を単一から3種(PULSE/RAILGUN/OVERDRIVE)に拡張する。
共有ゲージ(0-100%)からコストを支払い、各必殺の個別クールダウンで制御する。

| 必殺 | コスト | CD | 解放 | 役割 |
|------|--------|-----|------|------|
| PULSE | 33% | 3s | 初期 | 近距離全体ノックバック |
| RAILGUN | 50% | 6s | W10 | 射程無制限・貫通ビーム |
| OVERDRIVE | 100% | 15s | W20 | 8秒間タワー大強化 |

## 理由
単一必殺(旧)は使用判断がなく「溜まったら即押し」の連打ゲーになっていた。
射程を0.42→0.30に絞ることで「近くしか届かない主砲＋RAILGUNで遠距離対処」
という射程的役割分担が生まれる。
OVERDRIVEはボス戦専用(100%コスト+15s CD)として温存価値を与える。
ゲージ蓄積係数を半分(DMG_RATIO 1.0→0.5)にして単位時間あたりの使用回数を抑制。

## 影響
- 旧SPECIAL_DAMAGE_MULT/KNOCKBACK/FLASH/SHAKEを各必殺別CONFIGに分解
- UI: 単一ボタン → ゲージバー+3ボタン横並び(画面下部)
- 音: PULSE=旧sndSpecial、RAILGUN=高周波ザップ、OVERDRIVE=上昇コード
- W10/W20の報酬画面: 武器選択ではなく必殺解放通知に変更
