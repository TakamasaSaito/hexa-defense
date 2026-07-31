'use strict';
/**
 * tests/loader.js
 *
 * index.html の <script> ブロックを Node.js vm で実行し、
 * テストに必要な内部関数をエクスポートする。
 *
 * 方式: IIFE 末尾に _hdExports への書き出しコードを注入し、
 * ブラウザ API をスタブで差し替えて vm.runInNewContext() で評価する。
 * index.html 本体は一切書き換えない。
 */

var vm   = require('vm');
var fs   = require('fs');
var path = require('path');

function makeStubCtx() {
  return {
    clearRect: function(){}, fillRect: function(){}, strokeRect: function(){},
    beginPath: function(){}, arc: function(){}, moveTo: function(){},
    lineTo: function(){}, closePath: function(){},
    fill: function(){}, stroke: function(){},
    save: function(){}, restore: function(){},
    translate: function(){}, rotate: function(){}, scale: function(){},
    setTransform: function(){},
    drawImage: function(){}, clip: function(){},
    createLinearGradient: function(){ return { addColorStop: function(){} }; },
    createRadialGradient: function(){ return { addColorStop: function(){} }; },
    measureText: function(){ return { width: 50 }; },
    fillText: function(){}, strokeText: function(){},
    canvas: { width: 400, height: 600 },
    shadowBlur: 0, shadowColor: '',
    globalAlpha: 1, globalCompositeOperation: '',
    fillStyle: '', strokeStyle: '',
    lineWidth: 1, font: '', textAlign: '', textBaseline: ''
  };
}

function makeStubEl() {
  var el = {
    style: { display: '', width: '', height: '' },
    textContent: '',
    innerHTML: '',
    className: '',
    disabled: false,
    classList: { add: function(){}, remove: function(){}, contains: function(){ return false; }, toggle: function(){} },
    addEventListener: function(){},
    removeEventListener: function(){},
    appendChild: function(){},
    removeChild: function(){},
    setAttribute: function(){},
    getAttribute: function(){ return null; },
    getBoundingClientRect: function(){ return { left:0, top:0, width:400, height:600 }; },
    getContext: function(){ return makeStubCtx(); },
    children: [],
    childNodes: []
  };
  return el;
}

function loadGame() {
  var htmlPath = path.join(__dirname, '..', 'index.html');
  var html     = fs.readFileSync(htmlPath, 'utf8');

  /* <script> ブロックを抽出 */
  var m = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('No <script> block found in index.html');
  var script = m[1];

  /* IIFE 末尾の直前にエクスポートコードを注入する。
     lastIndexOf で最後の })(); を特定する。 */
  var exportCode = [
    '',
    '/* === TEST EXPORTS (注入 by tests/loader.js) === */',
    'if(typeof _hdExports !== "undefined"){',
    '  _hdExports.CFG              = CFG;',
    '  _hdExports.migrateSave      = migrateSave;',
    '  _hdExports.defaultSaveData  = defaultSaveData;',
    '  _hdExports.calcLegacyPermCost = calcLegacyPermCost;',
    '  _hdExports.spCostForLevel   = spCostForLevel;',
    '  _hdExports.spAtkMult        = spAtkMult;',
    '  _hdExports.spDefDmgMult     = spDefDmgMult;',
    '  _hdExports.spSpdMult        = spSpdMult;',
    '  _hdExports.waveAccum        = waveAccum;',
    '  _hdExports.applyAttrEffects = applyAttrEffects;',
    '  _hdExports.applySpUpgrades  = applySpUpgrades;',
    '  _hdExports.setWeapons = function(w){',
    '    var keys = ["attrFire","attrIce","attrLightning","subTurret","orbital","satellite","field","explosion","pierce"];',
    '    for(var ki = 0; ki < keys.length; ki++) weapons[keys[ki]] = (w[keys[ki]] || 0);',
    '  };',
    '  _hdExports.setEnemies = function(arr){ enemies = arr; };',
    '  _hdExports.setBoss    = function(b)  { boss = b; };',
    '  _hdExports.setRareDropMult = function(m){ rareDropMult = m; };',
    '  _hdExports.getDefDmgMult   = function(){ return defDmgMult; };',
    '  _hdExports.getBarrierCount = function(){ return barrierCount; };',
    '  _hdExports.getTower        = function(){ return { dmg: tower.dmg, fireInterval: tower.fireInterval, hp: tower.hp }; };',
    '  _hdExports.getSaveData          = function(){ return saveData; };',
    '  _hdExports.exportSaveToString   = exportSaveToString;',
    '  _hdExports.importSaveFromString = importSaveFromString;',
    '  _hdExports.pickLvCards         = pickLvCards;',
    '  _hdExports.resetForTest    = function(){',
    '    tower.dmg          = CFG.TOWER_DMG;',
    '    tower.fireInterval = CFG.TOWER_FIRE_INTERVAL;',
    '    tower.hp           = CFG.TOWER_HP;',
    '    defDmgMult    = 1.0;',
    '    barrierCount  = 0;',
    '    rareDropMult  = 1.0;',
    '    weapons.attrFire = 0; weapons.attrIce = 0; weapons.attrLightning = 0;',
    '    weapons.subTurret = 0; weapons.orbital = 0; weapons.satellite = 0;',
    '    weapons.field = 0; weapons.explosion = 0;',
    '    enemies = []; boss = null;',
    '    saveData.spAlloc = { atk: 0, def: 0, spd: 0, barrier: 0, luck: 0 };',
    '  };',
    '}'
  ].join('\n');

  var insertAt = script.lastIndexOf('})();');
  if (insertAt === -1) throw new Error('IIFE closing not found in script');
  script = script.slice(0, insertAt) + exportCode + '\n' + script.slice(insertAt);

  /* サンドボックス: ブラウザ API スタブ */
  var _hdExports = {};

  var sandbox = {
    _hdExports: _hdExports,
    document: {
      getElementById:    function(){ return makeStubEl(); },
      querySelector:     function(){ return makeStubEl(); },
      querySelectorAll:  function(){ return []; },
      addEventListener:  function(){},
      createElement:     function(){ return makeStubEl(); },
      body:              makeStubEl()
    },
    navigator: { maxTouchPoints: 0, userAgent: '' },
    devicePixelRatio: 2,
    innerWidth:  400,
    innerHeight: 600,
    localStorage: {
      getItem:    function(){ return null; },
      setItem:    function(){},
      removeItem: function(){}
    },
    AudioContext:       function(){ return null; },
    webkitAudioContext: undefined,
    requestAnimationFrame: function(){ return 0; },
    cancelAnimationFrame:  function(){},
    addEventListener:   function(){},
    removeEventListener: function(){},
    performance: { now: function(){ return Date.now(); } },
    /* JS builtins — vm は自動で多くを引き継ぐが明示しておく */
    Math: Math, JSON: JSON, Date: Date,
    parseInt: parseInt, parseFloat: parseFloat,
    isNaN: isNaN, isFinite: isFinite,
    String: String, Number: Number, Array: Array, Object: Object,
    Boolean: Boolean, Error: Error, TypeError: TypeError,
    console: console,
    setTimeout: setTimeout, clearTimeout: clearTimeout,
    setInterval: setInterval, clearInterval: clearInterval,
    btoa: function(s){ return Buffer.from(s, 'binary').toString('base64'); },
    atob: function(s){ return Buffer.from(s, 'base64').toString('binary'); }
  };
  /* window 自己参照 */
  sandbox.window = sandbox;

  try {
    vm.runInNewContext(script, sandbox);
  } catch (e) {
    console.error('Game script load error: ' + e.message);
    throw e;
  }

  /* エクスポートにスクリプト本文も付ける(コードパターン検査用) */
  _hdExports._scriptSrc = script;
  return _hdExports;
}

module.exports = loadGame;
