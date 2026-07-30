# HEXA DEFENSE — CONFIG パラメータ一覧と調整指針

CONFIGオブジェクトは `index.html` 冒頭にまとめる。マジックナンバー禁止。

## タワー初期値
| パラメータ | キー | 初期値 | 単位 |
|---|---|---|---|
| HP | `TOWER_HP` | 100 | HP |
| ダメージ | `TOWER_DMG` | **7** | /発 (旧10→難度強化で弱体化) |
| 発射間隔 | `TOWER_FIRE_INTERVAL` | **0.55** | 秒 (旧0.45→弱体化) |
| 弾速 | `TOWER_BULLET_SPEED` | 520 | px/s |
| 射程(倍率) | `TOWER_RANGE_RATIO` | 0.30 | ×min(W,H) |
| 射程上限 | `TOWER_RANGE_MAX` | 0.45 | ×min(W,H) |
| ショップ射程逓減 | `TOWER_RANGE_SHOP_STEPS` | [0.12,0.09,0.07,0.05] | 購入回数ごとの増加率 |
| タワーY中心 | `TOWER_CENTER_Y` | 0.50 | ×画面高 |
| サブ砲台ダメージ倍率 | `SUB_DMG_RATIO` | 0.5 | |

**基礎DPS:** 7 / 0.55 ≈ 12.7/秒

## 敵パラメータ
| キー | 値 | 説明 |
|---|---|---|
| `ENEMY_RED_HP_BASE` | 12 | 赤スクエア基礎HP |
| `ENEMY_RED_HP_WAVE` | 6 | ウェーブごとHP加算(帯係数で乗算) |
| `ENEMY_RED_SPEED_BASE` | 55 | 基礎速度 px/s |
| `ENEMY_RED_SPEED_WAVE` | 4 | ウェーブごと速度加算(帯係数で乗算) |
| `ENEMY_RED_DMG` | 8 | 接触ダメージ |
| `ENEMY_ORANGE_HP_BASE` | 26 | タンク基礎HP |
| `ENEMY_ORANGE_HP_WAVE` | 10 | ウェーブごとHP加算(帯係数で乗算) |
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

## 5帯難度スケール係数 (#12でHP/速度係数を15〜20%削減)
| キー | 値 | 説明 |
|---|---|---|
| `WAVE_HP_SCALES` | [1.0, 1.8, 3.0, 4.5, 6.5] | 各帯(W1-10/11-20/21-30/31-40/41-50)のHP増加係数 |
| `WAVE_SPEED_SCALES` | [1.0, 1.4, 2.0, 2.7, 3.5] | 各帯の速度増加係数 |
| `WAVE_SPAWN_SCALES` | [1.0, 1.4, 1.9, 2.5, 3.2] | 各帯の出現数増加係数 |

旧係数(#11): HP=[1.0,2.0,3.5,5.5,8.0], 速度=[1.0,1.5,2.2,3.0,4.0]

**waveAccum(w, perWave, scales):** W1からウェーブwまでの累積増加量を5帯合計で返す。
各帯は10ウェーブ幅。帯ごとに独立した係数を掛けることで帯境界で急加速する。

**廃止:** `WAVE_PHASE_BREAK` / `WAVE_HP_SCALE_EARLY` / `WAVE_HP_SCALE_LATE` など旧2段階キー (#11で削除)

## バリアシステム (#11で最大HP強化に置き換え)
| キー | 値 | 説明 |
|---|---|---|
| `BARRIER_MAX` | 3 | バリア最大所持数 |
| `BARRIER_BREAK_FLASH_DUR` | 0.3 | バリア破壊フラッシュ持続時間(秒) |

バリアは枚数制。1枚でダメージを1回完全無効化(量に依らない)。
視覚: タワー周囲に六角形殻をバリア枚数分表示。破壊時: シアンパーティクルリング+フラッシュ+音。
ウェーブクリア時に回復しない(希少資源)。

## XP設計
| キー | 値 | 説明 |
|---|---|---|
| `XP_BASE` | 50 | レベル1必要XP |
| `XP_SCALE` | 1.3 | レベルごと倍率 |
| `XP_CAP` | 600 | 最大必要XP |
| `XP_PER_RED` | 8 | 赤スクエア撃破XP |
| `XP_PER_ORANGE` | 18 | タンク撃破XP |

## 必殺ゲージ(3種)
| キー | 値 | 説明 |
|---|---|---|
| `SPECIAL_MAX` | 1000 | 満タン値(内部) |
| `SPECIAL_DMG_RATIO` | 0.25 | 与ダメ→ゲージ変換率 |

### PULSE(初期所持) — 全方位弾幕 (#11でスタンから変更)
| キー | 値 | 説明 |
|---|---|---|
| `PULSE_COST` | 330 | コスト(33%) |
| `PULSE_CD` | 3 | クールダウン(秒) |
| `PULSE_BULLET_COUNT` | 20 | 発射弾数(全方位均等) |
| `PULSE_BULLET_SPEED` | 380 | 弾速(px/s) |
| `PULSE_BULLET_DMG_MULT` | 1.5 | タワーDMGへの倍率 |

**廃止:** `PULSE_DMG_MULT` / `PULSE_RANGE_MULT` / `PULSE_KNOCKBACK` / `PULSE_STUN_DUR` / `PULSE_STUN_DUR_BOSS` (#11で削除)

### RAILGUN(W10解放)
| キー | 値 | 説明 |
|---|---|---|
| `RAILGUN_COST` | 500 | コスト(50%) |
| `RAILGUN_CD` | 6 | クールダウン(秒) |
| `RAILGUN_DMG_MULT` | 20 | 射線上の全敵に適用 |

### OVERDRIVE(W20解放)
| キー | 値 | 説明 |
|---|---|---|
| `OVERDRIVE_COST` | 1000 | コスト(100%) |
| `OVERDRIVE_CD` | 15 | クールダウン(秒) |
| `OVERDRIVE_DUR` | 8 | 持続時間(秒) |
| `OVERDRIVE_RATE_MULT` | 3.0 | 発射間隔を1/3に |
| `OVERDRIVE_DMG_MULT` | 2.0 | ダメージ2倍 |
| `OVERDRIVE_RANGE_MULT` | 1.5 | 射程1.5倍 |

## ミサイル
| キー | 値 | 説明 |
|---|---|---|
| `MISSILE_DMG_MULT` | **2.5** | タワーDMGへの倍率(旧4.0→弱体化) |
| `MISSILE_INTERVAL` | **5.0** | 発射間隔(秒)(旧3.0→弱体化) |

## ボス設定

### チャージャー系 (W5/10/25/45)
| キー | 値 | 説明 |
|---|---|---|
| `BOSS_MINI_HP` | 300 | W5ミニボスHP |
| `BOSS_CHARGER_HP` | 600 | W10ノーマルHP |
| `BOSS_CHARGER_HP_HARD` | 1400 | W25(hard)HP |
| `BOSS_CHARGER_HP_ULTRA` | 3000 | W45(ultra)HP |
| `BOSS_CHARGER_DMG` | 24 | 突進接触ダメージ |
| `BOSS_CHARGER_DMG_HARD` | 36 | hard突進ダメージ |
| `BOSS_CHARGER_DMG_ULTRA` | 50 | ultra突進ダメージ |
| `BOSS_CHARGER_SPEED_CHARGE` | 420 | 突進速度(px/s) |
| `BOSS_PHASE2_HP_RATIO` | 0.60 | フェーズ2移行HP割合 |
| `BOSS_PHASE3_HP_RATIO` | 0.30 | フェーズ3移行HP割合(W25以降) |
| `BOSS_CHARGER_WANDER_DUR_P3` | 1.0 | フェーズ3周回時間(秒) |
| `BOSS_CHARGER_REST_DUR_P3` | 0.6 | フェーズ3休止時間(秒) |

### バラージ系(W15/35) — 新規 (#11)
| キー | 値 | 説明 |
|---|---|---|
| `BOSS_BARRAGE_HP` | 800 | W15HP |
| `BOSS_BARRAGE_HP_HARD` | 2000 | W35HP |
| `BOSS_BARRAGE_ORBIT_SPEED` | 0.5 | 軌道回転速度(rad/s) |
| `BOSS_BARRAGE_INTERVAL_P1` | 1.5 | フェーズ1弾幕間隔(秒) |
| `BOSS_BARRAGE_INTERVAL_P2` | 0.9 | フェーズ2弾幕間隔(秒) |
| `BOSS_BARRAGE_INTERVAL_P3` | 0.6 | フェーズ3弾幕間隔(秒、W35のみ) |
| `BOSS_BARRAGE_COUNT_P1` | 8 | フェーズ1弾数(円形) |
| `BOSS_BARRAGE_COUNT_P2` | 12 | フェーズ2弾数(螺旋) |
| `BOSS_BARRAGE_COUNT_P3` | 18 | フェーズ3弾数(高密度螺旋) |
| `BOSS_BARRAGE_BULLET_SPEED` | 160 | 弾速(px/s) |
| `BOSS_BARRAGE_DMG` | 12 | 弾ダメージ |

### ディバイダー(W30) — 新規 (#11)
| キー | 値 | 説明 |
|---|---|---|
| `BOSS_DIVIDER_HP` | 1200 | 親HP |
| `BOSS_DIVIDER_ORBIT_SPEED` | 0.6 | 軌道速度(rad/s) |
| `BOSS_DIVIDER_CHARGE_SPEED` | 350 | 突進速度(px/s) |
| `BOSS_DIVIDER_CHILD_HP_RATIO` | 0.4 | 子のHP比(親最大HPの40%) |
| `BOSS_DIVIDER_CHILD_COIN` | 25 | 子撃破コイン |
| `BOSS_DIVIDER_DMG` | 20 | 突進ダメージ |

### サモナー系 (W20/40/50)
| キー | 値 | 説明 |
|---|---|---|
| `BOSS_SUMMONER_HP` | 700 | W20HP |
| `BOSS_SUMMONER_HP_HARD` | 1800 | W40HP |
| `BOSS_SUMMONER_HP_ULTRA` | 4000 | W50HP |
| `BOSS_SUMMONER_P3_SUMMON_INTERVAL` | 1.5 | フェーズ3召喚間隔(秒) |
| `BOSS_SUMMONER_P3_BULLET_COUNT` | 16 | フェーズ3弾数 |

## コイン経済
| キー | 値 | 説明 |
|---|---|---|
| `META_COIN_RATE` | **0.6** | ラン終了コインのメタコイン変換率(旧0.5) |
| `PERM_MAX_LEVEL` | 5 | 各系統の最大レベル |
| `PERM_BASE_PRICE` | **25** | Tier1価格(メタコイン)(旧20) |
| `PERM_PRICE_SCALE` | 1.8 | レベルごと価格倍率 |
| `PERM_DMG_PER_LV` | **0.20** | ダメージ+20%/LV(旧0.15) |
| `PERM_RATE_PER_LV` | **0.15** | 発射間隔-15%/LV(旧0.12) |
| `PERM_HP_PER_LV` | **25** | 最大HP+25/LV(旧20) |
| `PERM_RANGE_PER_LV` | **0.10** | 射程+10%/LV(旧0.08) |
| `PERM_COIN_GAIN_PER_LV` | **0.18** | コイン獲得量+18%/LV(旧0.15) |

**価格:** Tier1: 25, T2: 45, T3: 81, T4: 146, T5: 263 (×1.8倍逓増)

**経済目標:** W5前後敗北ランで60〜80コイン → メタコイン36〜48 → 2ランに1個ペースでTier1購入

## ラン内ショップ
| キー | 値 | 説明 |
|---|---|---|
| `SHOP_BASE_PRICE` | 10 | 初回価格 |
| `SHOP_PRICE_SCALE` | 1.5 | 購入ごと倍率 |

**品目(バリア追加):** 連射速度/ダメージ/射程/弾速/バリア+1/HP即時回復
(旧「最大HP+30」をバリア+1に置き換え: #11)

## 回復アイテムドロップ
| キー | 値 | 説明 |
|---|---|---|
| `DROP_HEAL_CHANCE` | 0.05 | 通常敵撃破時のドロップ率 |
| `DROP_HEAL_AMOUNT` | 15 | 取得時回復量 |
| `DROP_SPEED` | 40 | タワーへの漂い速度(px/s) |

## チェックポイント制
| キー | 値 | 説明 |
|---|---|---|
| `CHECKPOINT_WAVES` | [10,20,30,40] | 到達時に解除されるウェーブ番号 |
| `CHECKPOINT_START_COINS` | 80 | CP開始時の補償コイン数 |

## 中断セーブ

`saveData.suspendedRun` に1スロット上書き保存。保存内容:
wave/hp/maxHp/dmg/fireInterval/bulletSpeed/range/level/xp/xpNext/coins/kills/specialGauge/weapons/upgradeCounts/**barrierCount**

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
localStorageキー: `hd_save`。

## 倍速設定
| キー | 値 | 説明 |
|---|---|---|
| `SPEED_STEPS` | [1,3,10] | サイクルトグル倍率リスト |
| `SPEED_SUBSTEP_DT` | 0.01667 | 固定サブステップdt(秒) |
| `SPEED_BUDGET_MS` | 8 | フレーム内処理時間上限(ms) |
| `SPEED_PARTICLE_THRESH` | 2 | このインデックス以上でパーティクル間引き |
| `SPEED_PARTICLE_RATIO` | 0.3 | 間引き時の生成率 |

## 特殊武器設定
| キー | 値 | 説明 |
|---|---|---|
| `REWARD_WAVES` | [5,10,15,20,25,30,35,40,45] | 武器報酬が出るウェーブ(#12で拡張) |
| `SUB_TURRET_DMG_RATIO` | 0.5 | サブ砲台のダメージ倍率 |
| `SUB_TURRET_FIRE_RATIO` | 0.65 | サブ砲台の発射速度倍率 |
| `PIERCE_LV` | [1,2,3,999] | 貫通弾各レベルの最大ヒット数 |

## 属性システム (#12で追加)
| キー | 値 | 説明 |
|---|---|---|
| `ATTR_FIRE_DOT_DUR` | 3.0 | 炎DoT持続時間(秒) |
| `ATTR_FIRE_DOT_MULTS` | [0.25,0.45,0.70] | 炎Lv1〜3のdmgPerSec倍率(÷s) |
| `ATTR_ICE_SLOW_DUR` | 2.5 | 氷減速持続時間(秒) |
| `ATTR_ICE_SLOW_MULTS` | [0.65,0.50,0.35] | 氷Lv1〜3の速度倍率(低いほど遅い) |
| `ATTR_LIGHTNING_RANGE` | 130 | 雷連鎖の最大距離(px) |
| `ATTR_LIGHTNING_CHAINS` | [1,2,3] | 雷Lv1〜3の連鎖数 |
| `ATTR_LIGHTNING_FRAC` | 0.55 | 連鎖ダメージ(元弾ダメの55%) |

## オービタル (#12で追加)
| キー | 値 | 説明 |
|---|---|---|
| `ORBITAL_RADIUS` | 88 | 公転半径(px) |
| `ORBITAL_SPEED` | 2.2 | 公転角速度(rad/s) |
| `ORBITAL_DMG_MULT` | 1.2 | タワーDMGへのダメージ倍率 |
| `ORBITAL_BALL_SIZE` | 7 | 球の半径(px) |
| `ORBITAL_HIT_CD` | 0.65 | 同一敵への再ヒット間隔(秒) |

## 範囲爆発弾 (#12で追加)
| キー | 値 | 説明 |
|---|---|---|
| `EXPLOSION_RADII` | [55,80,115] | Lv1〜3の爆発半径(px) |
| `EXPLOSION_DMG_MULTS` | [0.45,0.65,0.90] | Lv1〜3の爆発ダメージ倍率 |

## 衛星砲台 (#13で追加)
| キー | 値 | 説明 |
|---|---|---|
| `SATELLITE_DMG_MULT` | 0.40 | タワーDMGへのダメージ倍率 |
| `SATELLITE_RANGE_RATIO` | 0.60 | 射程(×min(W,H)) |
| `SATELLITE_FIRE_INTERVAL` | 1.8 | 発射間隔(秒) |
| `SATELLITE_BULLET_SPEED` | 460 | 弾速(px/s) |

配置位置は `tower.range + 24`px の円周上に等間隔。属性効果適用。

## 設置型フィールド (#13で追加)
| キー | 値 | 説明 |
|---|---|---|
| `FIELD_DMG_PER_SEC` | [6,10,15] | Lv1〜3の継続ダメージ(/秒) |
| `FIELD_SLOW_MULT` | 0.55 | 敵速度倍率(減速) |
| `FIELD_DURATION` | 10.0 | フィールド持続時間(秒) |
| `FIELD_COOLDOWN` | 15.0 | 設置クールダウン(秒) |
| `FIELD_RADIUS` | [65,80,95] | Lv1〜3の効果半径(px) |

タップ位置に設置。Lvで同時設置数(1/2/3)が増加。
スポーン時に `fieldCooldown = FIELD_COOLDOWN` をセット。残時間は `fields[].timer`で管理。

## デバッグ: URLパラメータ `?wave=N`

任意のウェーブからゲームを開始。`?wave=5` でW5ボス即確認など。

## 調整指針
1. **設計目標:** 恒久強化ゼロで初見W5ボス敗北。フルコンプ+武器/必殺全解放でW50クリア可(余裕なし)
2. **5帯係数:** `WAVE_HP_SCALES` の各値を変えることで帯境界の急加速タイミングを制御
3. **バリア入手難度:** ショップ/カードでのみ入手。BARRIER_MAX=3を超えない(希少資源)
4. **PULSE弾幕:** PULSE_BULLET_COUNT(20)とPULSE_BULLET_DMG_MULT(1.5)のバランスで面処理力を調整
5. **iPhone Safari 60fps 維持が最優先:** PARTICLE_MAX=200を超えたら削除
