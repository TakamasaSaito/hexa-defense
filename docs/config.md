# HEXA DEFENSE — CONFIG パラメータ一覧と調整指針

CONFIGオブジェクトは `index.html` 冒頭にまとめる。マジックナンバー禁止。

## タワー初期値
| パラメータ | キー | 初期値 | 単位 |
|---|---|---|---|
| HP | `TOWER_HP` | 100 | HP |
| ダメージ | `TOWER_DMG` | 10 | /発 |
| 発射間隔 | `TOWER_FIRE_INTERVAL` | 0.45 | 秒 |
| 弾速 | `TOWER_BULLET_SPEED` | 520 | px/s |
| 射程(倍率) | `TOWER_RANGE_RATIO` | 0.42 | ×min(W,H) |
| サブ砲台ダメージ倍率 | `SUB_DMG_RATIO` | 0.5 | |

## 敵パラメータ
| キー | 値 | 説明 |
|---|---|---|
| `ENEMY_RED_HP_BASE` | 12 | 赤スクエア基礎HP |
| `ENEMY_RED_HP_WAVE` | 6 | ウェーブごとHP加算 |
| `ENEMY_RED_SPEED_BASE` | 55 | 基礎速度 px/s |
| `ENEMY_RED_SPEED_WAVE` | 4 | ウェーブごと速度加算 |
| `ENEMY_RED_DMG` | 8 | 接触ダメージ |
| `ENEMY_ORANGE_HP_BASE` | 26 | タンク基礎HP |
| `ENEMY_ORANGE_HP_WAVE` | 10 | ウェーブごとHP加算 |
| `ENEMY_ORANGE_SPEED_BASE` | 34 | タンク基礎速度 |
| `ENEMY_ORANGE_SPEED_WAVE` | 4 | |
| `ENEMY_ORANGE_DMG` | 14 | タンク接触ダメージ |
| `ENEMY_ORANGE_RATIO` | 0.35 | タンク出現率(+wave*0.02上限0.6) |
| `COIN_RED` | 1 | 赤スクエアコイン報酬 |
| `COIN_ORANGE` | 3 | タンクコイン報酬 |
| `COIN_BOSS` | 50 | ボスコイン報酬 |

## ウェーブ設計
| キー | 値 | 説明 |
|---|---|---|
| `MAX_WAVE` | 50 | 総ウェーブ数 |
| `WAVE_SPAWN_BASE` | 6 | 1ウェーブ基礎出現数 |
| `WAVE_SPAWN_WAVE` | 3 | ウェーブごと出現数加算 |
| `WAVE_SPAWN_INTERVAL_BASE` | 1.1 | 最大スポーン間隔(秒) |
| `WAVE_SPAWN_INTERVAL_MIN` | 0.18 | 最小スポーン間隔(秒) |
| `WAVE_HEAL_ON_CLEAR` | 20 | ウェーブクリア回復量 |

## XP設計
| キー | 値 | 説明 |
|---|---|---|
| `XP_BASE` | 20 | レベル1必要XP |
| `XP_SCALE` | 1.3 | レベルごと倍率 |
| `XP_CAP` | 500 | 最大必要XP |
| `XP_PER_RED` | 8 | 赤スクエア撃破XP |
| `XP_PER_ORANGE` | 18 | タンク撃破XP |

## 必殺ゲージ
| キー | 値 | 説明 |
|---|---|---|
| `SPECIAL_MAX` | 1000 | 満タン値 |
| `SPECIAL_DMG_RATIO` | 0.5 | 与ダメ→ゲージ変換率 |
| `SPECIAL_DAMAGE_MULT` | 8 | 必殺ダメージ倍率 |
| `SPECIAL_KNOCKBACK` | 200 | ノックバック距離(px) |

## ドロップアイテム
| キー | 値 | 説明 |
|---|---|---|
| `DROP_HEAL_CHANCE` | 0.05 | 回復アイテムドロップ率 |
| `DROP_HEAL_AMOUNT` | 25 | 回復量 |
| `DROP_SPEED` | 40 | アイテム漂い速度 |

## ショップ
| キー | 値 | 説明 |
|---|---|---|
| `SHOP_BASE_PRICE` | 10 | 初回価格 |
| `SHOP_PRICE_SCALE` | 1.5 | 購入ごと倍率 |
| `SHOP_HEAL_AMOUNT` | 30 | HP回復量 |

## 恒久強化
| キー | 値 | 説明 |
|---|---|---|
| `META_COIN_RATIO` | 0.5 | 獲得コインのメタコイン変換率 |
| `PERM_TIERS` | 5 | 段階数 |
| `PERM_DMG_PER_TIER` | 0.10 | ダメージ+率/段 |
| `PERM_RATE_PER_TIER` | 0.05 | 発射間隔削減率/段 |
| `PERM_HP_PER_TIER` | 20 | HP+/段 |
| `PERM_RANGE_PER_TIER` | 0.05 | 射程+率/段 |
| `PERM_COIN_PER_TIER` | 0.10 | コイン獲得量+率/段 |
| `PERM_BASE_PRICES` | [50,50,40,40,60] | Tier1価格(順: dmg/rate/hp/range/coin) |
| `PERM_PRICE_SCALE` | 1.8 | Tier価格倍率 |

## 調整指針
1. **初見W3〜4敗北** が基準。`ENEMY_*_HP_WAVE` と `WAVE_SPAWN_WAVE` で調整
2. **経済目標**: W3敗北で約50〜60コイン獲得 → `COIN_RED` / `WAVE_SPAWN_BASE` で調整
3. 必殺が「本作最大の気持ちいい瞬間」になるよう `SPECIAL_DAMAGE_MULT` と演出時間は慎重に
4. iPhone Safari 60fps 維持が最優先。パーティクル上限 `PARTICLE_MAX=200` を超えたら削除
