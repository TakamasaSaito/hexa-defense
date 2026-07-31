# HEXA DEFENSE — パフォーマンス計測記録

## 計測手段

`?debug=1` をURLに付加するとデバッグオーバーレイが表示される。

```
http://localhost/index.html?debug=1
```

画面左下に以下が表示される:

| 項目 | 内容 |
|------|------|
| FPS | 直前1秒間の平均フレームレート |
| ENEMIES | 通常敵数 (+BOSS: ボス出現中) |
| BULLETS | 自弾 + 敵弾 + ミサイルの合計 |
| PARTICLES | パーティクル数 |
| EFFECTS | オービタル + 衛星 + フィールド + 稲妻 + 爆発の合計 |

デバッグ画面からウェーブをスキップするには `?debug=1&wave=41` のように複数パラメータを組み合わせる。

## 最悪ケース条件

以下をすべて満たす状態が最悪ケース:

- **ウェーブ**: W41〜50 (Band 5: 最大スポーン数帯)
- **サブウェポン**: ORBITAL Lv6 + SATELLITE Lv5 + FIELD Lv5 + SUB_TURRET Lv4 + EXPLOSIVE Lv3
- **属性**: 炎/氷/雷 全属性有効 (Lv3)
- **必殺**: PULSE / RAILGUN / OVERDRIVE / BEAM すべて使用可能
- **ボス**: 出現中 (3フェーズ目)

## 計測結果テンプレート

```
計測日: YYYY-MM-DD
端末: (例: iPhone 14 Pro)
OS/ブラウザ: (例: iOS 17.4 / Safari)
ウェーブ: W__
条件: (最悪ケース条件のうち該当するもの)

結果:
  FPS:        ____ fps
  ENEMIES:    ____
  BULLETS:    ____
  PARTICLES:  ____
  EFFECTS:    ____

所感:
  - 60fps 維持: YES / NO
  - ボトルネック: (特定できた場合)
  - 改善提案: (あれば)
```

## 実測値記録

※ 実機計測後にここに追記する

### 計測1 (未実施)

実機 (iPhone Safari) での計測を待つ。目標: 最悪ケースで 60fps 維持。
