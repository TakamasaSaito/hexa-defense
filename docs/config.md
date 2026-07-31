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

## 5帯難度スケール係数 (#18更新)
| キー | 値 | 説明 |
|---|---|---|
| `WAVE_HP_SCALES` | **[1.0, 1.5, 3.2, 8.0, 5.5]** | W31-40が最高HP(明確な壁)、W41-50はやや低め(爽快感) |
| `WAVE_SPEED_SCALES` | **[1.0, 1.2, 2.0, 4.0, 3.0]** | W31-40が最速、W41-50はやや緩和 |
| `WAVE_SPAWN_SCALES` | **[1.0, 1.4, 2.2, 3.6, 5.5]** | W41-50が最大スポーン(大群一掃の爽快感) |

旧係数(#16): HP=[1.0,1.3,2.5,6.0,4.5], 速度=[1.0,1.1,1.6,3.2,2.6], 出現=[1.0,1.3,2.0,3.2,5.0]
旧係数(#15): HP=[1.0,1.35,2.4,4.0,6.0], 速度=[1.0,1.15,1.7,2.4,3.2], 出現=[1.0,1.2,1.8,2.4,3.1]
旧係数(#12): HP=[1.0,1.8,3.0,4.5,6.5], 速度=[1.0,1.4,2.0,2.7,3.5]
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
| `OVERDRIVE_COST` | **700** | コスト(**70%**, 旧100%, #18引下げ) |
| `OVERDRIVE_CD` | 15 | クールダウン(秒) |
| `OVERDRIVE_DUR` | 8 | 持続時間(秒) |
| `OVERDRIVE_RATE_MULT` | 3.0 | 発射間隔を1/3に |
| `OVERDRIVE_DMG_MULT` | 2.0 | ダメージ2倍 |
| `OVERDRIVE_RANGE_MULT` | 1.5 | 射程1.5倍 |

### BEAM(W15解放, #15新規) — 操作型ビーム
| キー | 値 | 説明 |
|---|---|---|
| `BEAM_COST` | **700** | コスト(**70%**, 旧100%, #18引下げ) |
| `BEAM_CD` | 20 | クールダウン(秒) |
| `BEAM_DUR` | 10 | 持続時間(秒) |
| `BEAM_WIDTH` | 26 | 当たり判定半幅(px) |
| `BEAM_DMG_PER_SEC` | 200 | 1秒あたりダメージ |

**操作:** タッチドラッグ/マウスドラッグでビーム方向をリアルタイム更新。設置型フィールドとタップ競合しない(BEAM中はtouchstartが方向更新に切替)。属性効果も適用。

## ミサイル
| キー | 値 | 説明 |
|---|---|---|
| `MISSILE_DMG_MULT` | **2.5** | タワーDMGへの倍率(旧4.0→弱体化) |
| `MISSILE_INTERVAL` | **5.0** | 発射間隔(秒)(旧3.0→弱体化) |

## ボス設定

### チャージャー系 (W5/10/25/45) — #18大幅強化
| キー | 値 | 説明 |
|---|---|---|
| `BOSS_MINI_HP` | **1000** | W5ミニボスHP (旧700) |
| `BOSS_CHARGER_HP` | **3500** | W10ノーマルHP (旧2200) |
| `BOSS_CHARGER_HP_HARD` | **8500** | W25(hard)HP (旧4200) |
| `BOSS_CHARGER_HP_ULTRA` | **20000** | W45(ultra)HP (旧9500) |
| `BOSS_CHARGER_DMG` | **52** | 突進接触ダメージ (旧38) |
| `BOSS_CHARGER_DMG_HARD` | **85** | hard突進ダメージ (旧58) |
| `BOSS_CHARGER_DMG_ULTRA` | **130** | ultra突進ダメージ (旧80) |
| `BOSS_CHARGER_SPEED_CHARGE` | 430 | 突進速度(px/s) |
| `BOSS_CHARGER_SHOCKWAVE_DMG` | **85** | 着地衝撃波ダメージ (旧55) |
| `BOSS_PHASE2_HP_RATIO` | 0.60 | フェーズ2移行HP割合 |
| `BOSS_PHASE3_HP_RATIO` | 0.30 | フェーズ3移行HP割合(W25以降) |
| `BOSS_CHARGER_WANDER_DUR_P3` | **0.7** | フェーズ3周回時間(秒) (旧0.9) |
| `BOSS_CHARGER_REST_DUR_P3` | **0.3** | フェーズ3休止時間(秒) (旧0.4) |

### バラージ系(W15/35) — #18大幅強化
| キー | 値 | 説明 |
|---|---|---|
| `BOSS_BARRAGE_HP` | **2800** | W15HP (旧1600) |
| `BOSS_BARRAGE_HP_HARD` | **14000** | W35HP (旧5500) |
| `BOSS_BARRAGE_BULLET_INTERVAL_HARD` | **1.0** | W35初期弾幕間隔(秒) (旧1.7) |
| `BOSS_BARRAGE_BULLET_INTERVAL` | **1.8** | 通常弾幕間隔(秒) (旧2.2) |
| `BOSS_BARRAGE_ORBIT_SPEED` | 0.5 | 軌道回転速度(rad/s) |
| `BOSS_BARRAGE_COUNT_P1` | **12** | フェーズ1弾数(円形) (旧8) |
| `BOSS_BARRAGE_COUNT_P2` | **16** | フェーズ2弾数(螺旋) (旧12) |
| `BOSS_BARRAGE_COUNT_P3` | **24** | フェーズ3弾数(高密度螺旋) (旧18) |
| `BOSS_BARRAGE_BULLET_SPEED` | 170 | 弾速(px/s) |
| `BOSS_BARRAGE_BULLET_DMG` | **30** | 弾ダメージ (旧22) |

### ディバイダー(W30) — #18大幅強化
| キー | 値 | 説明 |
|---|---|---|
| `BOSS_DIVIDER_HP` | **9500** | 親HP (旧4200) |
| `BOSS_DIVIDER_DMG` | **50** | 突進ダメージ (旧32) |
| `BOSS_DIVIDER_CHILD_DMG` | **35** | 子突進ダメージ (旧22) |
| `BOSS_DIVIDER_ORBIT_SPEED` | 0.6 | 軌道速度(rad/s) |
| `BOSS_DIVIDER_CHARGE_SPEED` | 360 | 突進速度(px/s) |
| `BOSS_DIVIDER_CHILD_HP_RATIO` | 0.4 | 子のHP比(親最大HPの40%) |
| `BOSS_DIVIDER_WANDER_DUR_P2` | **1.2** | フェーズ2周回時間(秒) (旧1.6) |
| `BOSS_DIVIDER_REST_DUR_P2` | **0.6** | フェーズ2休止時間(秒) (旧0.9) |

### サモナー系 (W20/40/50) — #18大幅強化・フェーズ移行攻撃密度増加
| キー | 値 | 説明 |
|---|---|---|
| `BOSS_SUMMONER_HP` | **5500** | W20HP (旧3000) |
| `BOSS_SUMMONER_HP_HARD` | **22000** | W40HP (旧8000) |
| `BOSS_SUMMONER_HP_ULTRA` | **35000** | W50 FINAL BOSS HP (旧12000) |
| `BOSS_SUMMONER_BULLET_INTERVAL` | **1.8** | P1弾幕間隔(秒) (旧2.2) |
| `BOSS_SUMMONER_BULLET_COUNT` | **3** | P1弾数 (旧2) |
| `BOSS_SUMMONER_BULLET_COUNT_HARD` | **6** | P1 hard弾数 (旧4) |
| `BOSS_SUMMONER_BULLET_DMG` | **30** | 弾ダメージ (旧22) |
| `BOSS_SUMMONER_SUMMON_INTERVAL_P2` | **2.0** | P2召喚間隔(秒) (旧2.8) |
| `BOSS_SUMMONER_SUMMON_COUNT_P2` | **7** | P2召喚数 (旧5) |
| `BOSS_SUMMONER_BULLET_INTERVAL_P2` | **1.0** | P2弾幕間隔(秒) (旧1.5) |
| `BOSS_SUMMONER_BULLET_COUNT_P2` | **8** | P2弾数 (旧5) |
| `BOSS_SUMMONER_SUMMON_INTERVAL_P3` | **1.2** | P3召喚間隔(秒) (旧1.8) |
| `BOSS_SUMMONER_SUMMON_COUNT_P3` | **12** | P3召喚数 (旧8) |
| `BOSS_SUMMONER_BULLET_INTERVAL_P3` | **0.55** | P3弾幕間隔(秒) (旧1.0) |
| `BOSS_SUMMONER_BULLET_COUNT_P3` | **13** | P3弾数 (旧8) |

## SP制 (#19でコイン経済から移行)

ラン内コイン・ショップを廃止。SPを唯一の恒久強化リソースとして一本化。

| キー | 値 | 説明 |
|---|---|---|
| `SP_WAVE_RATE` | 0.06 | floor(wave × rate) = ベースSP/ラン |
| `SP_BOSS_BONUS` | 1 | ボス1体撃破あたりボーナスSP |
| `SP_MIGRATE_RATE` | 80 | v1→v2マイグレーション: 旧コスト÷この値=SP |
| `SP_ATK_RATE` | 0.10 | ATK: 各ポイントの初期乗数 |
| `SP_ATK_DECAY` | 0.04 | ATK: 乗数の逓減率(n番目 = rate/(1+decay*n)) |
| `SP_DEF_SCALE` | 20 | DEF: アーマー公式 20/(20+n) の分子 |
| `SP_SPD_RATE` | 0.08 | SPD: 各ポイントの初期間隔短縮率 |
| `SP_SPD_DECAY` | 0.035 | SPD: 短縮率の逓減率 |
| `SP_SUB_MAX_TURRET` | 4 | サブ砲台最大Lv |
| `SP_SUB_MAX_ORBITAL` | 6 | オービタル最大Lv |
| `SP_SUB_MAX_SATELLITE` | 5 | 衛星砲台最大Lv |
| `SP_SUB_MAX_FIELD` | 5 | 設置フィールド最大Lv |
| `SP_SUB_MAX_BLAST` | 3 | 範囲爆発最大Lv |

**SP効果式:**
- ATK Lv.n: `∏(1 + 0.10/(1+0.04*i))` for i=0..n-1 (逓減乗算)
- DEF Lv.n: 被ダメ = `20/(20+n)` 倍 (DEF10で33%軽減, DEF20で50%軽減)
- SPD Lv.n: `∏(1 - 0.08/(1+0.035*i))` for i=0..n-1 (発射間隔短縮)

**HP回復ドロップ (#19上方修正):**
| キー | 値 | 説明 |
|---|---|---|
| `DROP_HEAL_CHANCE` | **0.09** | HP回復ドロップ出現率 (旧0.05) |
| `DROP_HEAL_AMOUNT` | **20** | HP回復量 (旧15) |

**廃止キー (#19):** `META_COIN_RATE`, `PERM_*` (全系統), `COIN_RED`, `COIN_ORANGE`, `COIN_BOSS`,
`SHOP_BASE_PRICE`, `SHOP_PRICE_SCALE`, `CHECKPOINT_START_COINS`

残存キー (ゲージ効率・属性初期値は仕様継続): `PERM_GAUGE_RATE_PER_LV`, `PERM_ELEM_START_MAX`, `ELEM_CHOICE_PRIORITY`

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

## レアドロップ(金色六角形, #15新規)
| キー | 値 | 説明 |
|---|---|---|
| `DROP_RARE_CHANCE` | 0.05 | 通常敵撃破時のドロップ率(1ランで数個) |
| `DROP_RARE_LIFE` | 10.0 | アイテム消滅までの秒数 |
| `DROP_RARE_SIZE` | 11 | 六角形半径(px) |
| `DROP_RARE_SPEED` | 38 | タワーへの漂い速度(px/s) |

**効果プール:** attrPower(属性威力+)/attrRange(属性範囲+)/orbital+1/field+1/satellite+1/barrier+1
**ボス撃破時は必ず1個ドロップ(guaranteed)**
**回復アイテムとは別枠。取得時即効果適用(ポーズなし)**

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

## 設置型フィールド (#13追加, #18大幅再設計 — 切り札型)
| キー | 値 | 説明 |
|---|---|---|
| `FIELD_DMG_PER_SEC` | **[15,20,28,36,45]** | Lv1〜5の継続ダメージ(/秒) (旧[6,10,15]) |
| `FIELD_SLOW_MULT` | **0.45** | 敵速度倍率(減速) (旧0.55) |
| `FIELD_DURATION` | 8.0 | フィールド持続時間(秒) |
| `FIELD_COOLDOWN` | 0 | 廃止 (使用回数制に移行) |
| `FIELD_RADIUS` | **[200,220,240,260,280]** | Lv1〜5の効果半径(px) (旧[65,80,95]) |
| `FIELD_BASE_USES` | **3** | 初回取得時の使用回数(新規) |
| `FIELD_EXTRA_USES` | **2** | 2回目以降取得・レアドロップ時の追加回数(新規) |

**再設計(#18)**: CDシステムを廃止し使用回数制に変更。`fieldUsesLeft`変数で今ランの残回数を管理。
- 初回カード取得: fieldUsesLeft += 3、2回目以降・レアドロップ: fieldUsesLeft += 2
- 同時設置は1枚まで(範囲が広大なため)
- HUD表示: 「FIELD x{残回数}」(残0なら薄色表示)
- save/restoreRunにfieldUsesLeftを追加

## サブウェポン上限 (#16で拡張)
| 種別 | 旧上限 | 新上限 | 解放条件 |
|---|---|---|---|
| orbital(公転球) | 3 | **6** | 武器報酬 or XPカード(W11〜) |
| satellite(衛星砲台) | 3 | **5** | 武器報酬 or XPカード(W11〜) |
| field(設置型フィールド) | 3 | **5** | 武器報酬 or XPカード(W11〜) |
| subTurret(サブ砲台) | 2 | **4** | 武器報酬 or XPカード(W11〜) |

`CARD_SUB_WAVE=11`: W11以降のXPレベルアップカードにサブウェポン強化が追加。
`CARD_SUB_WEIGHT=2`: CARD_POOL_SUBの各カードを2回プールに追加(出現確率2倍)。
`SUB_TURRET_OFFSETS`: 4エントリに拡張(4基目: dx=±52, dy=+36)。

## デバッグ: URLパラメータ `?wave=N`

任意のウェーブからゲームを開始。`?wave=5` でW5ボス即確認など。

## 調整指針
1. **設計目標:** 恒久強化ゼロで初見W5ボス敗北。フルコンプ+武器/必殺全解放でW50クリア可(余裕なし)
2. **5帯係数:** `WAVE_HP_SCALES` の各値を変えることで帯境界の急加速タイミングを制御
3. **バリア入手難度:** ショップ/カードでのみ入手。BARRIER_MAX=3を超えない(希少資源)
4. **PULSE弾幕:** PULSE_BULLET_COUNT(20)とPULSE_BULLET_DMG_MULT(1.5)のバランスで面処理力を調整
5. **iPhone Safari 60fps 維持が最優先:** PARTICLE_MAX=200を超えたら削除
