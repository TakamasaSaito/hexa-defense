# HEXA DEFENSE — CONFIG パラメータ一覧と調整指針

CONFIGオブジェクトは `index.html` 冒頭にまとめる。マジックナンバー禁止。

## タワー初期値
| パラメータ | キー | 初期値 | 単位 |
|---|---|---|---|
| HP | `TOWER_HP` | 100 | HP |
| ダメージ | `TOWER_DMG` | 10 | /発 |
| 発射間隔 | `TOWER_FIRE_INTERVAL` | 0.45 | 秒 |
| 弾速 | `TOWER_BULLET_SPEED` | 520 | px/s |
| 射程(倍率) | `TOWER_RANGE_RATIO` | **0.30** | ×min(W,H) ※初期値を絞り遠距離はRAILGUNで対処 |
| 射程上限 | `TOWER_RANGE_MAX` | 0.45 | ×min(W,H)、ショップ強化の上限 |
| ショップ射程逓減 | `TOWER_RANGE_SHOP_STEPS` | [0.12,0.09,0.07,0.05] | 購入回数ごとの増加率 |
| タワーY中心 | `TOWER_CENTER_Y` | 0.50 | ×画面高。0.50=中央 |
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

目標バランス(005決定記録): W5ミニボスが初見の壁。恒久強化3〜4回でW5突破。

**改訂後の難度カーブ(W5ボスHP 600・DMG 24)**
- 無強化: W5ミニボスHP 600をDMG10基本射撃のみでは撃破困難 → 敗北
- PULSE(初期所持)を使いながらW1〜4のゲームプレイに慣れる
- 恒久強化DMG/RATE 2〜3段階 + PULSE活用でW5突破可能
- W5突破 → サブ砲台獲得 → W10チャージャー → RAILGUN解放

## XP設計
| キー | 値 | 説明 |
|---|---|---|
| `XP_BASE` | 20 | レベル1必要XP |
| `XP_SCALE` | 1.3 | レベルごと倍率 |
| `XP_CAP` | 500 | 最大必要XP |
| `XP_PER_RED` | 8 | 赤スクエア撃破XP |
| `XP_PER_ORANGE` | 18 | タンク撃破XP |

## 必殺ゲージ(3種)
| キー | 値 | 説明 |
|---|---|---|
| `SPECIAL_MAX` | 1000 | 満タン値(内部)。UI表示は0〜100% |
| `SPECIAL_DMG_RATIO` | **0.5** | 与ダメ→ゲージ変換率(改訂前1.0→半分に抑制) |

### PULSE(初期所持)
| `PULSE_COST` | 330 | コスト(33%) |
| `PULSE_CD` | 3 | クールダウン(秒) |
| `PULSE_DMG_MULT` | 8 | タワーDMGへの倍率 |
| `PULSE_RANGE_MULT` | 1.8 | 爆発半径(射程×1.8) |
| `PULSE_KNOCKBACK` | 200 | ノックバック距離(px) |

### RAILGUN(W10解放)
| `RAILGUN_COST` | 500 | コスト(50%) |
| `RAILGUN_CD` | 6 | クールダウン(秒) |
| `RAILGUN_DMG_MULT` | 20 | 射線上の全敵に適用 |

### OVERDRIVE(W20解放)
| `OVERDRIVE_COST` | 1000 | コスト(100%) |
| `OVERDRIVE_CD` | 15 | クールダウン(秒) |
| `OVERDRIVE_DUR` | 8 | 持続時間(秒) |
| `OVERDRIVE_RATE_MULT` | 3.0 | 発射間隔を1/3に |
| `OVERDRIVE_DMG_MULT` | 2.0 | ダメージ2倍 |
| `OVERDRIVE_RANGE_MULT` | 1.5 | 射程1.5倍 |

## コイン(M2)
| キー | 値 | 説明 |
|---|---|---|
| `COIN_RED` | 1 | 赤スクエア撃破コイン |
| `COIN_ORANGE` | 3 | タンク撃破コイン |
| `COIN_BOSS` | 50 | ボス撃破コイン |

コインはラン内通貨。ラン終了時に `META_COIN_RATE(0.5)` 分がメタコインに変換される。
`gainCoin(amount, x, y)` が獲得・HUD更新・フローター演出をまとめて処理。
コイン実際獲得量 = `ceil(amount × coinGainMult)` (恒久強化coinGainで倍率が上がる)。

## ラン内ショップ(M2)
| キー | 値 | 説明 |
|---|---|---|
| `SHOP_BASE_PRICE` | 10 | 初回価格 |
| `SHOP_PRICE_SCALE` | 1.5 | 購入ごと倍率 |

**価格計算:** `floor(SHOP_BASE_PRICE × SHOP_PRICE_SCALE ^ upgradeCounts[id])`

`upgradeCounts` はレベルアップ3択カードとショップで共有される。カードで「連射」を上げるとショップの「連射」価格も上がる。

**品目(6種):** 連射速度(-20%)/ダメージ(+40%)/射程(+15%)/弾速(+15%)/最大HP+30/HP即時回復+30

**UI:** SHOPボタン=左上WAVEパネル下。STATE='shop'でゲームポーズ。所持コイン不足はグレーアウト。

## 回復アイテムドロップ(M2)
| キー | 値 | 説明 |
|---|---|---|
| `DROP_HEAL_CHANCE` | 0.05 | 通常敵撃破時のドロップ率 |
| `DROP_HEAL_AMOUNT` | 15 | 取得時回復量 |
| `DROP_SPEED` | 40 | タワーへの漂い速度(px/s) |

**挙動:** 敵死亡位置に緑発光クロスがスポーン → タワーへゆっくり漂う → タワー接触か弾ヒットで取得(+15HP)。8秒で消滅。

## 恒久強化(M3実装済)
| キー | 値 | 説明 |
|---|---|---|
| `META_COIN_RATE` | 0.5 | ラン終了コインのメタコイン変換率 |
| `PERM_MAX_LEVEL` | 5 | 各系統の最大レベル |
| `PERM_BASE_PRICE` | 20 | Tier1価格(メタコイン) |
| `PERM_PRICE_SCALE` | 1.8 | レベルごと価格倍率 |
| `PERM_DMG_PER_LV` | 0.15 | ダメージ+15%/LV |
| `PERM_RATE_PER_LV` | 0.12 | 発射間隔-12%/LV |
| `PERM_HP_PER_LV` | 20 | 最大HP+20/LV |
| `PERM_RANGE_PER_LV` | 0.08 | 射程+8%/LV |
| `PERM_COIN_GAIN_PER_LV` | 0.15 | コイン獲得量+15%/LV |

**価格:** `floor(PERM_BASE_PRICE × PERM_PRICE_SCALE ^ currentLv)` → LV0→1: 20, 1→2: 36, 2→3: 65, 3→4: 117, 4→5: 211

**経済目標:** W3-4敗北で約30〜50コイン獲得 → メタコイン15〜25 → Tier1(20)を1個購入できる

5系統の効果は `applyPermanentUpgrades()` がラン開始時に `resetGame()` 経由で適用する。

## チェックポイント制(M3実装済)
| キー | 値 | 説明 |
|---|---|---|
| `CHECKPOINT_WAVES` | [10,20,30,40] | 到達時に解除されるウェーブ番号 |
| `CHECKPOINT_START_COINS` | 80 | CP開始時の補償コイン数 |

解除されたCPはタイトルの「SELECT WAVE」から選択可能。
CP開始時: `coins = CHECKPOINT_START_COINS` + 武器2択(checkpointWeaponMode=true でshowWeaponReward()を流用)。
`docs/decisions/003-checkpoint-compensation.md` 参照。

## 中断セーブ(M3実装済)
`saveData.suspendedRun` に1スロット上書き保存。保存内容:
wave/hp/maxHp/dmg/fireInterval/bulletSpeed/range/level/xp/xpNext/coins/kills/specialGauge/weapons/upgradeCounts

- HUDの「II」(ポーズ)ボタン → SAVE & QUIT で保存
- タイトルの「CONTINUE」ボタン(suspendedRun存在時のみ表示)で復元

## SaveData スキーマ(v1)
```json
{
  "version": 1,
  "metaCoins": 0,
  "bestWave": 0,
  "totalKills": 0,
  "permanentUpgrades": { "dmg":0, "rate":0, "hp":0, "range":0, "coinGain":0 },
  "unlockedCheckpoints": [1],
  "suspendedRun": null,
  "settings": { "mute": false, "speedIdx": 1 }
}
```
localStorageキー: `hd_save`。旧v0キー(`hd_best_wave`/`hd_settings`)からの自動マイグレーション付き。

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

## デバッグ機能

### URLパラメータ: `?wave=N`
任意のウェーブからゲームを開始できる。本番ビルドにも残存(コスト無し)。

```
http://localhost:8000/?wave=5   # W5ミニボス戦を即確認
http://localhost:8000/?wave=6   # 2段階カーブ加速期を確認
http://localhost:8000/?wave=10  # W10予定ボス位置まで確認
```

- 実装: `resetGame()` 内で `getUrlParam('wave')` を読み、`1 ≤ N ≤ MAX_WAVE` なら `wave = N` にセット
- 武器・恒久強化はリセット状態。ウェーブ難度のみスキップ
- 本番URLにパラメータがなければ通常通りW1開始

## 調整指針
1. **初見W6〜7敗北(W5武器獲得後)** が基準。`WAVE_HP_SCALE_LATE` / `WAVE_SPAWN_SCALE_LATE` で調整
2. **W1〜5は緩やかに**: `WAVE_HP_SCALE_EARLY=1.0` を変えず、イントロ期は線形増加のみ
3. **経済目標**: W6〜7敗北で約50〜60コイン獲得 → `COIN_RED` / `WAVE_SPAWN_BASE` で調整
4. 必殺が「本作最大の気持ちいい瞬間」になるよう `SPECIAL_DAMAGE_MULT` と演出時間は慎重に
5. iPhone Safari 60fps 維持が最優先。パーティクル上限 `PARTICLE_MAX=200` を超えたら削除
