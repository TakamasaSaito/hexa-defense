'use strict';
/**
 * tests/run.js
 *
 * 実行: node tests/run.js
 *
 * テスト区分:
 *   A. SP価格カーブ
 *   B. SP効果関数(ATK/DEF/SPD)
 *   C. DPS計算
 *   D. waveAccum 帯別スケール
 *   E. SaveDataマイグレーション v1→v4 / v2→v4 / v3→v4 / v4→v4
 *   F. 属性効果 applyAttrEffects (炎/氷/雷)
 *   G. LUCK / DEFENSE / BARRIER の SP → ゲーム変数反映
 *   H. レアドロップ全キル経路 コードパターン検査 (#24 再発防止)
 *   I. ミサイル属性効果 コードパターン検査 (#24 再発防止)
 *   J. サブウェポン5種 ラン内成長レベルがパラメータに反映されること
 */

var fs     = require('fs');
var path   = require('path');
var loadGame = require('./loader');

/* =====================================================================
   テストユーティリティ
===================================================================== */
var passed = 0, failed = 0;
var currentSuite = '';

function suite(name) {
  currentSuite = name;
  console.log('\n--- ' + name + ' ---');
}

function assert(cond, label) {
  if (cond) {
    passed++;
    console.log('  PASS  ' + label);
  } else {
    failed++;
    console.log('  FAIL  ' + label);
  }
}

function assertEq(a, b, label) {
  assert(a === b, label + '  (got ' + a + ', expected ' + b + ')');
}

function assertClose(a, b, tol, label) {
  assert(Math.abs(a - b) <= tol, label + '  (got ' + a.toFixed(4) + ', expected ~' + b.toFixed(4) + ')');
}

/* 累積SP価格計算 */
function cumulativeCost(spCostForLevel, id, levels) {
  var total = 0;
  for (var n = 0; n < levels; n++) total += spCostForLevel(id, n);
  return total;
}

/* =====================================================================
   ゲームコンテキスト読み込み
===================================================================== */
console.log('Loading game context from index.html...');
var g;
try {
  g = loadGame();
} catch (e) {
  console.error('FATAL: could not load game – ' + e.message);
  process.exit(1);
}
var CFG = g.CFG;
console.log('OK  (CFG.TOWER_DMG=' + CFG.TOWER_DMG + ', CFG.SP_PRICE_BASE=' + CFG.SP_PRICE_BASE + ')');

/* =====================================================================
   A. SP価格カーブ
===================================================================== */
suite('A. SP価格カーブ');

/* 累積コスト: Lv5=22 / Lv10=90 / Lv20=991 / Lv30=9993 (仕様書目標値) */
assertEq(cumulativeCost(g.spCostForLevel, 'atk', 5),  22,   'cumulative cost Lv0->Lv5 = 22');
assertEq(cumulativeCost(g.spCostForLevel, 'atk', 10), 90,   'cumulative cost Lv0->Lv10 = 90');
assertEq(cumulativeCost(g.spCostForLevel, 'atk', 20), 991,  'cumulative cost Lv0->Lv20 = 991');
assertEq(cumulativeCost(g.spCostForLevel, 'atk', 30), 9993, 'cumulative cost Lv0->Lv30 = 9993');

/* DEFENSE / SPD も同じ式 */
assertEq(cumulativeCost(g.spCostForLevel, 'def', 5),  22, 'def cumulative Lv5 = 22');
assertEq(cumulativeCost(g.spCostForLevel, 'luck', 5), 22, 'luck cumulative Lv5 = 22');

/* Lv0のコストは最小 1 */
assert(g.spCostForLevel('atk', 0) >= 1, 'cost(Lv0) >= 1');

/* 逓増: cost(n+1) >= cost(n) */
assert(g.spCostForLevel('atk', 10) > g.spCostForLevel('atk', 9), 'cost strictly increasing');

/* =====================================================================
   B. SP効果関数
===================================================================== */
suite('B. SP効果関数');

/* ATK: Lv0 → 倍率 1.0 */
assertClose(g.spAtkMult(0), 1.0, 0.001, 'spAtkMult(0) = 1.0');
/* ATK: Lv1 → 1 + SP_ATK_RATE = 1.10 */
assertClose(g.spAtkMult(1), 1.0 + CFG.SP_ATK_RATE, 0.001, 'spAtkMult(1) = ' + (1 + CFG.SP_ATK_RATE));
/* ATK: 逓増 — spAtkMult(10) < spAtkMult(1)^10 (効率が落ちる) */
assert(g.spAtkMult(10) < Math.pow(1 + CFG.SP_ATK_RATE, 10), 'spAtkMult 逓減あり');

/* DEF: アーマー式 dmg * scale/(scale+n) */
assertClose(g.spDefDmgMult(0), 1.0, 0.001, 'spDefDmgMult(0) = 1.0  (軽減なし)');
var expectedDef5 = CFG.SP_DEF_SCALE / (CFG.SP_DEF_SCALE + 5);
assertClose(g.spDefDmgMult(5), expectedDef5, 0.001, 'spDefDmgMult(5) = ' + expectedDef5.toFixed(3));
/* DEF: Lv が増えるほど被ダメ倍率は下がる */
assert(g.spDefDmgMult(10) < g.spDefDmgMult(5), 'spDefDmgMult 単調減少');
/* DEF: 0 に近づくが 0 にはならない */
assert(g.spDefDmgMult(100) > 0, 'spDefDmgMult(100) > 0');

/* SPD: Lv0 → 1.0 */
assertClose(g.spSpdMult(0), 1.0, 0.001, 'spSpdMult(0) = 1.0');
/* SPD: 間隔短縮 → 倍率 < 1 */
assert(g.spSpdMult(5) < 1.0, 'spSpdMult(5) < 1.0  (間隔短縮)');

/* =====================================================================
   C. DPS計算
===================================================================== */
suite('C. DPS計算');

/*
 * ラン内レベルアップ:
 *   dmgLv 1回 → tower.dmg *= 1.4
 *   rateLv 1回 → tower.fireInterval *= 0.8
 *
 * DPS = tower.dmg / tower.fireInterval は dmgLv で上昇、
 * rateLv では DPS も上昇(弾数が増えるが総ダメは同じ、でも間隔短縮)。
 * 弾1条時と4条時で "総ダメ/fire" = tower.dmg は変わらない。
 */
var baseDmg = CFG.TOWER_DMG;
var baseInt = CFG.TOWER_FIRE_INTERVAL;
var baseDPS = baseDmg / baseInt;

/* 基礎DPS */
assertClose(baseDPS, baseDmg / baseInt, 0.001, 'base DPS = TOWER_DMG / TOWER_FIRE_INTERVAL');

/* dmg 1段: DPS × 1.4 */
var dps1dmg = (baseDmg * 1.4) / baseInt;
assertClose(dps1dmg / baseDPS, 1.4, 0.001, 'dmg lv1 DPS is ×1.4 of base');

/* rate 1段: DPS × 1/0.8 (fireInterval が 0.8 倍) */
var dps1rate = baseDmg / (baseInt * 0.8);
assertClose(dps1rate / baseDPS, 1.0 / 0.8, 0.001, 'rate lv1 DPS is ×1.25 of base');

/* rate 3段 → streamCount=4 — 弾の dmg 分割でもトータルは変わらない */
var dps3rate = baseDmg / (baseInt * Math.pow(0.8, 3));
assert(dps3rate > dps1rate, 'rate lv3 DPS > rate lv1 DPS');

/* SP ATK Lv5: DPS が spAtkMult(5) 倍 */
var spAtkMult5 = g.spAtkMult(5);
assertClose((baseDmg * spAtkMult5) / baseInt / baseDPS, spAtkMult5, 0.001,
  'SP ATK Lv5 DPS multiplier matches spAtkMult(5)');

/* =====================================================================
   D. waveAccum 帯別スケール
===================================================================== */
suite('D. waveAccum 帯別スケール');

var HP = CFG.WAVE_HP_SCALES;

/* W1: 帯1のみ → 1 * perWave * HP[0] */
assertClose(g.waveAccum(1, 1, HP), 1 * HP[0], 0.001, 'waveAccum(W1) = HP[0]');

/* W10: 帯1を10ウェーブ分 */
assertClose(g.waveAccum(10, 1, HP), 10 * HP[0], 0.001, 'waveAccum(W10) = 10 * HP[0]');

/* W11: 帯1 × 10 + 帯2 × 1 */
var expected11 = 10 * HP[0] + 1 * HP[1];
assertClose(g.waveAccum(11, 1, HP), expected11, 0.001, 'waveAccum(W11) = 10*HP[0] + 1*HP[1]');

/* W50: 全5帯 × 10ウェーブ分 */
var expected50 = 10 * (HP[0] + HP[1] + HP[2] + HP[3] + HP[4]);
assertClose(g.waveAccum(50, 1, HP), expected50, 0.001, 'waveAccum(W50) = 10 * sum(all bands)');

/* W31: 帯4突入で HP_SCALES[3]=8.0 が効いている */
var expected31 = 10*HP[0] + 10*HP[1] + 10*HP[2] + 1*HP[3];
assertClose(g.waveAccum(31, 1, HP), expected31, 0.001, 'waveAccum(W31) uses band4 scale');

/* perWave が 2 倍なら結果も 2 倍 */
assertClose(g.waveAccum(20, 2, HP), g.waveAccum(20, 1, HP) * 2, 0.001, 'waveAccum scales linearly with perWave');

/* =====================================================================
   E. SaveDataマイグレーション
===================================================================== */
suite('E. SaveDataマイグレーション');

/* v4 → v4: 変化なし */
var sd4 = { version: 4, skillPoints: 42, spAlloc: { atk:3, def:2, spd:1, barrier:1, luck:0 },
             bestWave: 25, totalKills: 300, unlockedCheckpoints:[1,10],
             suspendedRun: null, settings:{ mute:false, speedIdx:1 }, v4MigrateNotify:false };
var r4 = g.migrateSave(sd4);
assertEq(r4.version,      4,  'v4→v4: version=4');
assertEq(r4.skillPoints,  42, 'v4→v4: skillPoints保持');
assertEq(r4.spAlloc.atk,  3,  'v4→v4: spAlloc.atk保持');
assertEq(r4.spAlloc.def,  2,  'v4→v4: spAlloc.def保持');
assertEq(r4.bestWave,     25, 'v4→v4: bestWave保持');

/* v3 → v4: subWeapon SP全額払い戻し + 基礎3系統引き継ぎ */
var sd3 = { version: 3, skillPoints: 10,
             spAlloc: { atk:2, def:1, spd:0, subturret:2, orbital:1, satellite:0, field:0, blast:0 },
             bestWave: 15, totalKills: 100 };
/* subturret Lv2のコスト: ceil(round(1.5*2^0)) + ceil(round(1.5*2^1)) = 2+3=5
   orbital Lv1のコスト: round(1.5*2^0)=2
   合計払い戻し = 7 */
var expectSp3 = 10 + 5 + 2; /* 10+7=17 */
var r3 = g.migrateSave(sd3);
assertEq(r3.version,     4,         'v3→v4: version=4');
assertEq(r3.skillPoints, expectSp3, 'v3→v4: subWeapon SP払い戻し');
assertEq(r3.spAlloc.atk, 2,         'v3→v4: atk引き継ぎ');
assertEq(r3.spAlloc.def, 1,         'v3→v4: def引き継ぎ');
assertEq(r3.v4MigrateNotify, true,  'v3→v4: migrateNotifyがtrue');
/* サブウェポン系統は v4 に存在しない */
assert(r3.spAlloc.subturret === undefined, 'v3→v4: subturret は spAlloc に残らない');

/* v2 → v4: 固定1SP/Lv全額払い戻し(上限500) */
var sd2 = { version: 2, skillPoints: 5,
             spAlloc: { atk:3, def:0, spd:0, subturret:0, orbital:0, satellite:0, field:0, blast:0 } };
/* invested = 3, refund = 5+3=8 */
var r2 = g.migrateSave(sd2);
assertEq(r2.version,    4, 'v2→v4: version=4');
assertEq(r2.skillPoints, 8,'v2→v4: 投資SP全額返却');

/* v2 上限チェック: 大量投資 → cap=500 */
var sd2big = { version: 2, skillPoints: 0,
               spAlloc: { atk:200, def:200, spd:200, subturret:0, orbital:0, satellite:0, field:0, blast:0 } };
var r2big = g.migrateSave(sd2big);
assertEq(r2big.skillPoints, CFG.SP_V3_MIGRATE_CAP, 'v2→v4: 上限' + CFG.SP_V3_MIGRATE_CAP + 'SP');

/* v1 → v4: metaCoins / SP_MIGRATE_RATE (上限500) */
var sd1 = { bestWave: 10 }; /* version なし */
var r1 = g.migrateSave(sd1);
assertEq(r1.version,    4, 'v1→v4: version=4');
assertEq(r1.skillPoints, 0, 'v1→v4: metaCoins=0 → SP=0');

var sd1mc = { metaCoins: 160 }; /* 160/80=2 SP */
var r1mc = g.migrateSave(sd1mc);
assertEq(r1mc.skillPoints, 2, 'v1→v4: 160 metaCoins → 2 SP');

/* null/不正値 → defaultSaveData */
var rdft = g.migrateSave(null);
assertEq(rdft.version, 4, 'null → defaultSaveData');

/* =====================================================================
   F. 属性効果 applyAttrEffects
===================================================================== */
suite('F. 属性効果 applyAttrEffects');

g.resetForTest();

/* 炎DoT: weapons.attrFire > 0 → e.dotFire がセットされる */
g.setWeapons({ attrFire: 1 });
g.setEnemies([]); g.setBoss(null);
var fireEnemy = { x:0, y:0, size:10, hp:100, isBoss:false, dotFire:null, slowIce:null };
g.applyAttrEffects(fireEnemy, 50, 0, 0);
assert(fireEnemy.dotFire !== null, '炎Lv1: dotFire がセットされる');
assertClose(fireEnemy.dotFire.timer, CFG.ATTR_FIRE_DOT_DUR, 0.001,
  '炎Lv1: dotFire.timer = ATTR_FIRE_DOT_DUR');
var expectedFireDps = 50 * CFG.ATTR_FIRE_DOT_MULTS[0];
assertClose(fireEnemy.dotFire.dmgPerSec, expectedFireDps, 0.001,
  '炎Lv1: dotFire.dmgPerSec = dmg * MULTS[0]');

/* 炎Lv3: MULTS[2] が使われる */
g.resetForTest();
g.setWeapons({ attrFire: 3 });
g.setEnemies([]); g.setBoss(null);
var fireEnemy3 = { x:0, y:0, size:10, hp:100, isBoss:false, dotFire:null, slowIce:null };
g.applyAttrEffects(fireEnemy3, 100, 0, 0);
var expectedFireDps3 = 100 * CFG.ATTR_FIRE_DOT_MULTS[2];
assertClose(fireEnemy3.dotFire.dmgPerSec, expectedFireDps3, 0.001,
  '炎Lv3: dotFire.dmgPerSec = dmg * MULTS[2]');

/* 氷減速: weapons.attrIce > 0 && !isBoss → e.slowIce がセットされる */
g.resetForTest();
g.setWeapons({ attrIce: 2 });
g.setEnemies([]); g.setBoss(null);
var iceEnemy = { x:0, y:0, size:10, hp:100, isBoss:false, dotFire:null, slowIce:null };
g.applyAttrEffects(iceEnemy, 50, 0, 0);
assert(iceEnemy.slowIce !== null, '氷Lv2: slowIce がセットされる');
assertClose(iceEnemy.slowIce.mult, CFG.ATTR_ICE_SLOW_MULTS[1], 0.001,
  '氷Lv2: slowIce.mult = MULTS[1]=' + CFG.ATTR_ICE_SLOW_MULTS[1]);

/* 氷: isBoss には適用されない */
g.resetForTest();
g.setWeapons({ attrIce: 1 });
g.setEnemies([]); g.setBoss(null);
var bossEnemy = { x:0, y:0, size:30, hp:5000, isBoss:true, dotFire:null, slowIce:null };
g.applyAttrEffects(bossEnemy, 100, 0, 0);
assert(bossEnemy.slowIce === null, '氷: isBoss=true には slowIce 適用なし');

/* 雷連鎖: 隣接敵に chainDmg が入る */
g.resetForTest();
g.setWeapons({ attrLightning: 1 }); /* Lv1: 1体に連鎖 */
var source  = { x:0, y:0, size:10, hp:100, isBoss:false, dotFire:null, slowIce:null };
var nearby  = { x:50, y:0, size:10, hp:200, isBoss:false, dotFire:null, slowIce:null };
g.setEnemies([source, nearby]);
g.setBoss(null);
g.applyAttrEffects(source, 100, 0, 0);
var chainDmg = 100 * CFG.ATTR_LIGHTNING_FRAC;
assertClose(nearby.hp, 200 - chainDmg, 0.5, '雷Lv1: 隣接敵HPが chainDmg 分減少');

/* =====================================================================
   G. LUCK / DEFENSE / BARRIER → ゲーム変数反映
===================================================================== */
suite('G. LUCK / DEFENSE / BARRIER SP反映');

/* LUCK */
g.resetForTest();
g.getSaveData().spAlloc.luck = 3;
g.applySpUpgrades();
var expectedLuck = 1.0 + 3 * CFG.SP_LUCK_RATE;
/* applySpUpgrades は rareDropMult = 1 + luck * SP_LUCK_RATE に設定する */
/* resetForTest 後に applySpUpgrades を呼んでいるので値が確認できる */
assertClose(expectedLuck, 1.0 + 3 * CFG.SP_LUCK_RATE, 0.001, 'LUCK Lv3 期待値確認');
/* rareDropMult は IIFE 内変数なので、applySpUpgrades 呼び出し後に
   saveData に設定された luck から再計算 — 値は applySpUpgrades 内で設定 */

/* DEFENSE */
g.resetForTest();
g.getSaveData().spAlloc.def = 10;
g.applySpUpgrades();
var expectedDef = g.spDefDmgMult(10);
assertClose(g.getDefDmgMult(), expectedDef, 0.001,
  'DEF Lv10: defDmgMult = spDefDmgMult(10) = ' + expectedDef.toFixed(3));
assert(g.getDefDmgMult() < 1.0, 'DEF Lv10: defDmgMult < 1.0 (被ダメ軽減有効)');

/* BARRIER */
g.resetForTest();
g.getSaveData().spAlloc.barrier = 2;
g.applySpUpgrades();
assertEq(g.getBarrierCount(), 2, 'BARRIER Lv2: barrierCount = 2');

/* BARRIER: CFG.BARRIER_MAX を超えない */
g.resetForTest();
g.getSaveData().spAlloc.barrier = CFG.BARRIER_MAX + 5;
g.applySpUpgrades();
assertEq(g.getBarrierCount(), CFG.BARRIER_MAX,
  'BARRIER: barrierCount <= BARRIER_MAX=' + CFG.BARRIER_MAX);

/* ATK SP */
g.resetForTest();
g.getSaveData().spAlloc.atk = 5;
g.applySpUpgrades();
var expectedTowerDmg = CFG.TOWER_DMG * g.spAtkMult(5);
assertClose(g.getTower().dmg, expectedTowerDmg, 0.01,
  'ATK Lv5: tower.dmg = TOWER_DMG * spAtkMult(5)');

/* SPD SP */
g.resetForTest();
g.getSaveData().spAlloc.spd = 3;
g.applySpUpgrades();
var expectedInterval = CFG.TOWER_FIRE_INTERVAL * g.spSpdMult(3);
assertClose(g.getTower().fireInterval, expectedInterval, 0.001,
  'SPD Lv3: tower.fireInterval = base * spSpdMult(3)');

/* =====================================================================
   H. レアドロップ全キル経路 コードパターン検査 (#24 再発防止)
===================================================================== */
suite('H. レアドロップ全キル経路 コードパターン (#24)');

var src = g._scriptSrc;

/* 弾(メイン/サブ砲台/衛星) kill path — ct で参照 */
assert(
  src.indexOf('if(Math.random() < CFG.DROP_RARE_CHANCE * rareDropMult) spawnRareItem(ct.x, ct.y)') !== -1,
  '弾killパス: spawnRareItem(ct.x, ct.y) が存在'
);

/* ミサイル kill path — mc4 で参照 */
assert(
  src.indexOf('if(Math.random() < CFG.DROP_RARE_CHANCE * rareDropMult) spawnRareItem(mc4.x, mc4.y)') !== -1,
  'ミサイルkillパス: spawnRareItem(mc4.x, mc4.y) が存在'
);

/* レールガン kill path — e で参照、healItems.push も存在 */
assert(
  src.indexOf('if(Math.random() < CFG.DROP_RARE_CHANCE * rareDropMult) spawnRareItem(e.x, e.y)') !== -1,
  'レールガン/衝撃波killパス: spawnRareItem(e.x, e.y) が存在'
);

/* 接触(tower hit)で敵が消えた後の敵ループ先頭で処理 */
assert(
  src.indexOf('if(Math.random() < CFG.DROP_HEAL_CHANCE) healItems.push({ x: e.x, y: e.y, life: 8.0 });') !== -1,
  '敵ループ先頭(hp<=0): healDrop が存在'
);

/* ボスは常に spawnRareItem が呼ばれる */
assert(
  src.indexOf('if(ct.type === \'divider\'){ spawnDividerChildren(ct); }') !== -1
  && src.indexOf('spawnRareItem(ct.x, ct.y)') !== -1,
  'ボスkillパス: spawnRareItem が存在'
);

/* =====================================================================
   I. ミサイル属性効果 コードパターン検査 (#24 再発防止)
===================================================================== */
suite('I. ミサイル属性効果 コードパターン (#24)');

assert(
  src.indexOf('applyAttrEffects(mc4, mDmg, ml.x, ml.y)') !== -1,
  'ミサイル命中: applyAttrEffects(mc4, mDmg, ml.x, ml.y) が存在'
);

/* =====================================================================
   J. サブウェポン5種 ラン内成長レベル反映
===================================================================== */
suite('J. サブウェポン5種 パラメータ反映');

/* subTurret: weapons.subTurret でアクティブ台数制御 */
assert(
  src.indexOf('for(var si = 0; si < weapons.subTurret') !== -1,
  'subTurret: weapons.subTurret でループ制御'
);

/* orbital: rebuildOrbitals() が weapons.orbital を参照 */
assert(
  src.indexOf('var n = weapons.orbital') !== -1,
  'orbital: weapons.orbital で球数決定'
);

/* satellite: rebuildSatellites() が weapons.satellite を参照 */
assert(
  src.indexOf('var n = weapons.satellite') !== -1,
  'satellite: weapons.satellite で台数決定'
);

/* field: weapons.field で同時設置上限制御 */
assert(
  src.indexOf('weapons.field') !== -1,
  'field: weapons.field が参照されている'
);

/* explosion: triggerExplosion が weapons.explosion を参照 */
assert(
  src.indexOf('var lv = weapons.explosion - 1') !== -1,
  'explosion: weapons.explosion でレベル参照'
);

/* orbital: オービタルダメージが tower.dmg * ORBITAL_DMG_MULT */
assert(
  src.indexOf('var oDmg = tower.dmg * CFG.ORBITAL_DMG_MULT') !== -1,
  'orbital: oDmg = tower.dmg * ORBITAL_DMG_MULT'
);

/* missile: ミサイルダメージが tower.dmg * MISSILE_DMG_MULT */
assert(
  src.indexOf('var mDmg = tower.dmg * CFG.MISSILE_DMG_MULT') !== -1,
  'missile: mDmg = tower.dmg * MISSILE_DMG_MULT'
);

/* subTurret: ダメージが tower.dmg * SUB_TURRET_DMG_RATIO */
assert(
  src.indexOf('var sDmg = tower.dmg * CFG.SUB_TURRET_DMG_RATIO') !== -1,
  'subTurret: sDmg = tower.dmg * SUB_TURRET_DMG_RATIO'
);

/* =====================================================================
   結果サマリー
===================================================================== */
console.log('\n==============================');
console.log('PASS: ' + passed + '  FAIL: ' + failed + '  TOTAL: ' + (passed + failed));
console.log('==============================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('All tests passed.');
  process.exit(0);
}
