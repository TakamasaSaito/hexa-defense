---
name: combatants-unification
description: enemies/boss個別分岐をcombatants配列に統一した理由
metadata:
  type: project
---

# 002: combatants統合(enemies/boss個別分岐廃止)

日付: 2026-07-25
状態: 採用

## 決定
戦闘対象を `enemies[]` と `boss` に分けて個別分岐するのをやめ、
`combatants[]` 1本に統合し、ターゲット選択・弾当たり判定を一元化した。

## 理由
enemies/boss個別分岐のまま機能追加を続けた結果、
ターゲット選択やスポーン位置などで「enemiesには処理したがbossに漏れる」バグが繰り返し発生した。
combatants統合により分岐漏れ自体を構造的に起こせなくなる。

## 影響
- boss を combatants に push するだけで弾当たり・ターゲット選択が自動適用される
- ボス個別の描画・HP表示など「ボス特有の処理」は type フィールドで判別する
- 将来のサモナー召喚物なども同配列に追加可能
