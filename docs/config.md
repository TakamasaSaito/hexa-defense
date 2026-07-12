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

## 2段階難度カーブ
| キー | 値 | 説明 |
|---|---|---|
| `WAVE_PHASE_BREAK` | 6 | W6以降を加速期とするフェーズ境界 |
| `WAVE_HP_SCALE_EARLY` | 1.0 | イントロ期(W1〜5)のHP増加係数(×ENEMY_RED_HP_WAVE) |
| `WAVE_HP_SCALE_LATE` | 2.2 | 加速期(W6〜)のHP増加係数 |
| `WAVE_SPEED_SCALE_EARLY` | 1.0 | イントロ期の速度増加係数 |
| `WAVE_SPEED_SCALE_LATE` | 1.6 | 加速期の速度増加係数 |
| `WAVE_SPAWN_SCALE_EARLY` | 1.0 | イントロ期の出現数増加係数 |
| `WAVE_SPAWN_SCALE_LATE` | 1.5 | 加速期の出現数増加係数 |

W6以降のHPは「W1〜5で使う線形加算」に乗数を掛けて急加速させる。
各フェーズ係数を変えることで「どこで初見が詰まるか」を細かく制御できる。

目標バランス: 無強化・武器1個でW6〜7敗北(Node.jsシミュレーションで確認)

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
| `SPECIAL_DMG_RATIO` | 1.0 | 与ダメ→ゲージ変換率 |
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

## 倍速設定
| キー | 値 | 説明 |
|---|---|---|
| `SPEED_STEPS` | [1,3,10] | サイクルトグル倍率リスト(デフォルトx3) |
| `SPEED_SUBSTEP_DT` | 0.01667 (1/60s) | 固定サブステップdt |
| `SPEED_BUDGET_MS` | 8 | フレーム内処理時間上限(ms) |
| `SPEED_SUBSTEP_MAX_LAG` | 2 | 持ち越し上限(mult×この値がcap) |
| `SPEED_PARTICLE_THRESH` | 2 | このインデックス以上(x5~)でパーティクル間引き |
| `SPEED_PARTICLE_RATIO` | 0.3 | 間引き時のパーティクル/トレイル生成率 |
| `settings.speedIdx` | 1 | 現在の倍率インデックス(デフォルト1=x3、localStorage保存) |

- 倍速はゲームシミュレーション(update)のみ
- draw・演出タイマー(flashTimer/shakeTimer)・hexRot回転は等倍
- 8ms超過時は残りサブステップを次フレームへ持ち越し(溜まりすぎはcapで抑制)

## 必殺ゲージ充填量の目安
`SPECIAL_MAX / SPECIAL_DMG_RATIO = 満タンまでに必要な与ダメージ量`

| 設定 | 必要与ダメ | W1(9体) | W3(15体) | W5ボス込み |
|---|---|---|---|---|
| ratio=0.5(旧) | 2000 | 0.08本 | 0.23本 | 〜0.5本 |
| ratio=1.0(現在) | 1000 | 0.16本 | 0.45本 | 〜1本 |

W5のミニボス(HP300)が充填の主力。W3〜5で初めて1回撃てる体感が目標。

## W5小型ボス設定
| キー | 値 | 説明 |
|---|---|---|
| `BOSS_MINI_HP` | 300 | HP |
| `BOSS_MINI_SPEED_WANDER` | 0.6 rad/s | 軌道回転速度 |
| `BOSS_MINI_ORBIT_RATIO` | 0.30 | 軌道半径 = min(W,H) × この値 |
| `BOSS_MINI_SPEED_CHARGE` | 280 px/s | 突進速度 |
| `BOSS_MINI_WARN_DUR` | 0.8 s | 予告線表示時間 |
| `BOSS_MINI_CHARGE_DUR` | 0.55 s | 突進持続時間 |
| `BOSS_MINI_REST_DUR` | 2.2 s | 休止時間 |
| `BOSS_MINI_WANDER_DUR` | 3.0 s | 周回時間(次のwarnまで) |

## 特殊武器設定
| キー | 値 | 説明 |
|---|---|---|
| `REWARD_WAVES` | [5,10,20,30,40] | 武器報酬が出るウェーブ |
| `SUB_TURRET_DMG_RATIO` | 0.5 | サブ砲台のダメージ倍率 |
| `SUB_TURRET_FIRE_RATIO` | 0.65 | サブ砲台の発射速度倍率 |
| `PIERCE_LV` | [1,2,3,999] | 貫通弾各レベルの最大ヒット数 |

## 調整指針
1. **初見W6〜7敗北(W5武器獲得後)** が基準。`WAVE_HP_SCALE_LATE` / `WAVE_SPAWN_SCALE_LATE` で調整
2. **W1〜5は緩やかに**: `WAVE_HP_SCALE_EARLY=1.0` を変えず、イントロ期は線形増加のみ
3. **経済目標**: W6〜7敗北で約50〜60コイン獲得 → `COIN_RED` / `WAVE_SPAWN_BASE` で調整
4. 必殺が「本作最大の気持ちいい瞬間」になるよう `SPECIAL_DAMAGE_MULT` と演出時間は慎重に
5. iPhone Safari 60fps 維持が最優先。パーティクル上限 `PARTICLE_MAX=200` を超えたら削除
