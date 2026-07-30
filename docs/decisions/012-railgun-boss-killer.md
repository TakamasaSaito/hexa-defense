# 012: RAILGUNを遠距離対処からボスキラーに再設計

日付: 2026-07-31
状態: 採用

## 決定

RAILGUNの役割を「射程外到達」から「ボスキラー」に転換する。

- **ターゲット選択**: 最遠敵 → ボス優先(常に画面内), ボス不在時は最HP敵
- **ダメージ**: 通常敵倍率(RAILGUN_DMG_MULT)とボス専用倍率(RAILGUN_BOSS_DMG_MULT)を分離
- **CD**: 6s → 12s (高火力単発に見合う長さ)
- **演出**: チャージ予兆0.28s → 極太3層ビーム → 大爆発/大floater(ボス命中時) + 重低音

## 理由

衛星砲台(#13)の追加により「射程外の敵を処理する」役割が常時カバーされるようになった。
コスト50%に対してPULSE(33%・全方位面制圧)より使用価値が低い状態が継続していた。
ボスHP高騰(最大12000, #16)により単体特化の必殺に需要が生まれた。

必殺4種の役割:
- PULSE(33%): 面制圧。囲まれた時に捌く
- RAILGUN(50%): ボスキラー。単体を一気に削る
- OVERDRIVE(100%): 自己バフ。総合火力を一時的に引き上げる
- BEAM(100%): 操作型の薙ぎ払い。手動で狙って焼く

## 影響

- floater関数にsizeオプション引数を追加(ボス命中の大ダメージ表示に使用)
- CFG追加: RAILGUN_BOSS_DMG_MULT / RAILGUN_CHARGE_DUR / RAILGUN_BEAM_DUR /
  RAILGUN_FLASH_DUR / RAILGUN_SHAKE_DUR / RAILGUN_SHAKE_MAG / RAILGUN_BOSS_FLOATER_SZ
- CFG変更: RAILGUN_CD 6→12, RAILGUN_DMG_MULT 20→16
- sndRailgun: 高周波スイープ → 重低音(sawtooth低域+ノイズ)
- チャージ中(0.28s)はbeamが出ない。角度はチャージ開始時に決定(ターゲット位置がずれても角度は固定)
