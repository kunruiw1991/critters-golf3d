/**
 * ⛳ Critter Mini-Golf 3D: Windmill Wonder Course! 🎡✨
 * Pure Three.js 3D WebGL Mini-Golf Race & Obstacle Course Party Game
 *
 * Round 4 100% Zero-Text Kid-Friendly Visual Cockpit Upgrades:
 * - Zero English text or alphanumeric labels anywhere in the DOM: icon-only dot pips (`•`, `••`, `•••`)
 *   and pure emoji badges across all HUD & menu elements.
 * - Dedicated 4th Giant Quick Putt Launch Pedal (`#pedal-putt`, `🏌️⛳`) + interactive `#aim-hint-pill`
 *   with `⬅️`/`➡️` touch-aim nudge buttons (`>= 44px`), tap-to-putt bar, and live rotating `⬆️` aim arrow.
 * - Clear Visual State Affordances: `.is-ready` / `.on-cooldown` / `.cooldown-shake` on Power Pedals,
 *   `.active-fever` rainbow glow on `#rainbow-gauge-wrap`, `.dragging` highlight on `#aim-hint-pill`,
 *   live `#hud-rank-badge` (`🥇`–`5️⃣`) with Top-3 qualification rim and overtake pop, and Podium
 *   `✅`/`❌` qualification badges + `.cta-pulse` primary action button highlight.
 */

(function () {
  'use strict';

  // --- 8 Playable Smiling Critters (High-chroma colors verified >= 31 CIE76 ΔE from all turf & bridge shades) ---
  const CRITTERS = [
    { id: 'catnap', emoji: '🐱🌙', perk: '🌪️➕', color: 0xc084fc, hex: '#c084fc', accent: 0xe9d5ff, icon: 'icons/catnap.jpg', speedBias: 1.00, aimSkill: 0.95 },
    { id: 'dogday', emoji: '🐶☀️', perk: '⚡➕', color: 0xff9f1c, hex: '#ff9f1c', accent: 0xffbf69, icon: 'icons/dogday.jpg', speedBias: 1.00, aimSkill: 0.94 },
    { id: 'bobby', emoji: '🐻❤️', perk: '💥➕', color: 0xff3366, hex: '#ff3366', accent: 0xff8fa3, icon: 'icons/bobby.jpg', speedBias: 1.00, aimSkill: 0.96 },
    { id: 'craftycorn', emoji: '🦄🎨', perk: '🌈➕', color: 0x00e5ff, hex: '#00e5ff', accent: 0x90e0ef, icon: 'icons/craftycorn.jpg', speedBias: 1.00, aimSkill: 0.97 },
    { id: 'hoppy', emoji: '🐰⚡', perk: '🏌️⚡', color: 0xd9f938, hex: '#a3e635', accent: 0xecfccb, icon: 'icons/hoppy.jpg', speedBias: 1.08, aimSkill: 0.92 },
    { id: 'kickin', emoji: '🐥⭐', perk: '⭐🧲', color: 0xffe600, hex: '#eab308', accent: 0xfff3b0, icon: 'icons/kickin.jpg', speedBias: 1.00, aimSkill: 0.93 },
    { id: 'picky', emoji: '🐷🍎', perk: '🟢🚀', color: 0xff66c4, hex: '#ff66c4', accent: 0xffb3e6, icon: 'icons/picky.jpg', speedBias: 1.00, aimSkill: 0.95 },
    { id: 'bubba', emoji: '🐘💡', perk: '🛡️🪨', color: 0x60a5fa, hex: '#60a5fa', accent: 0xbfdbfe, icon: 'icons/bubba.jpg', speedBias: 1.00, aimSkill: 0.98 }
  ];

  // --- 8 Distinct Stage Themes ---
  const BRIDGE_WOOD_A = 0x5c341d;
  const BRIDGE_WOOD_B = 0x7c4728;

  const STAGES = [
    {
      id: 0, icon: '🎡', sub: '🌸⛳',
      skyTop: 0x38bdf8, skyHorizon: 0xfce7f3,
      turfColor: 0x1b4332, turfAlt: 0x2d6a4f,
      wallColor: 0xff5277, wallAlt: 0xffffff,
      waterColor: 0x48cae4, waterEmissive: 0x000000,
      hemiSky: 0xffe5ec, hemiGround: 0x40916c, sunColor: 0xfff4e0, sunIntensity: 2.5, fogDensity: 0.0038,
      windmillTower: 0xff5277, windmillRoof: 0xffe600, windmillBlade: 0xffffff,
      propKit: 'blossom',
      length: 92, windmills: 1, bumpers: 3, boosts: 3, bridge: false, curveAmp: 3.5
    },
    {
      id: 1, icon: '🌈', sub: '🌉⛳',
      skyTop: 0x0284c7, skyHorizon: 0xe0f2fe,
      turfColor: 0x14532d, turfAlt: 0x166534,
      wallColor: 0xf72585, wallAlt: 0xfef08a,
      waterColor: 0x0077b6, waterEmissive: 0x001d3d,
      hemiSky: 0xdff4ff, hemiGround: 0x52b788, sunColor: 0xfffbeb, sunIntensity: 2.55, fogDensity: 0.0036,
      windmillTower: 0x7209b7, windmillRoof: 0x00f5d4, windmillBlade: 0xfef08a,
      propKit: 'rainbow',
      length: 104, windmills: 2, bumpers: 4, boosts: 4, bridge: true, curveAmp: 5.5
    },
    {
      id: 2, icon: '🍭', sub: '🍬🎡',
      skyTop: 0xdb2777, skyHorizon: 0xfce7f3,
      turfColor: 0x1e3a2f, turfAlt: 0x2d5a47,
      wallColor: 0x9333ea, wallAlt: 0xfbcfe8,
      waterColor: 0xff4d6d, waterEmissive: 0x3b0a18,
      hemiSky: 0xffd6e0, hemiGround: 0x588157, sunColor: 0xfff0f3, sunIntensity: 2.45, fogDensity: 0.0040,
      windmillTower: 0xf72585, windmillRoof: 0xfee440, windmillBlade: 0xffc8dd,
      propKit: 'candy',
      length: 115, windmills: 2, bumpers: 5, boosts: 4, bridge: false, curveAmp: 6.5
    },
    {
      id: 3, icon: '🏰', sub: '👑⛳',
      skyTop: 0x2563eb, skyHorizon: 0xdbeafe,
      turfColor: 0x134e4a, turfAlt: 0x115e59,
      wallColor: 0xd97706, wallAlt: 0xe2e8f0,
      waterColor: 0x1d3557, waterEmissive: 0x000814,
      hemiSky: 0xdbeafe, hemiGround: 0x335c67, sunColor: 0xffedd5, sunIntensity: 2.5, fogDensity: 0.0040,
      windmillTower: 0x64748b, windmillRoof: 0xd97706, windmillBlade: 0xf8fafc,
      propKit: 'castle',
      length: 126, windmills: 2, bumpers: 6, boosts: 5, bridge: true, curveAmp: 7.5
    },
    {
      id: 4, icon: '🌴', sub: '🥥🎡',
      skyTop: 0x0891b2, skyHorizon: 0xfef9c3,
      turfColor: 0x1a2e05, turfAlt: 0x365314,
      wallColor: 0xea580c, wallAlt: 0xfef08a,
      waterColor: 0x0096c7, waterEmissive: 0x002838,
      hemiSky: 0xe0f2fe, hemiGround: 0x6a994e, sunColor: 0xfff3b0, sunIntensity: 2.6, fogDensity: 0.0036,
      windmillTower: 0xb45309, windmillRoof: 0x65a30d, windmillBlade: 0xfef3c7,
      propKit: 'palm',
      length: 136, windmills: 3, bumpers: 6, boosts: 5, bridge: true, curveAmp: 8.0
    },
    {
      id: 5, icon: '🚀', sub: '🪐⛳',
      skyTop: 0x0b1026, skyHorizon: 0x312e81,
      turfColor: 0x0f172a, turfAlt: 0x1e293b,
      wallColor: 0x38bdf8, wallAlt: 0xc084fc,
      waterColor: 0x1e1b4b, waterEmissive: 0x0f172a,
      hemiSky: 0xa5b4fc, hemiGround: 0x1e293b, sunColor: 0xe0e7ff, sunIntensity: 2.4, fogDensity: 0.0032,
      windmillTower: 0x4f46e5, windmillRoof: 0x38bdf8, windmillBlade: 0xe0e7ff,
      propKit: 'space',
      length: 148, windmills: 3, bumpers: 7, boosts: 6, bridge: true, curveAmp: 8.5
    },
    {
      id: 6, icon: '🌋', sub: '🔥🎡',
      skyTop: 0x7c2d12, skyHorizon: 0xfdba74,
      turfColor: 0x18181b, turfAlt: 0x27272a,
      wallColor: 0xdc2626, wallAlt: 0xfbbf24,
      waterColor: 0xea580c, waterEmissive: 0x9a3412,
      hemiSky: 0xfed7aa, hemiGround: 0x3f3f46, sunColor: 0xffb36b, sunIntensity: 2.5, fogDensity: 0.0042,
      windmillTower: 0x991b1b, windmillRoof: 0xf97316, windmillBlade: 0xfef08a,
      propKit: 'volcano',
      length: 158, windmills: 3, bumpers: 8, boosts: 6, bridge: true, curveAmp: 9.0
    },
    {
      id: 7, icon: '👑', sub: '🏆🌈',
      skyTop: 0x4c1d95, skyHorizon: 0xfde68a,
      turfColor: 0x2e1065, turfAlt: 0x4c1d95,
      wallColor: 0xfbbf24, wallAlt: 0xffffff,
      waterColor: 0xb45309, waterEmissive: 0x451a03,
      hemiSky: 0xfef08a, hemiGround: 0x4c1d95, sunColor: 0xfffbeb, sunIntensity: 2.6, fogDensity: 0.0035,
      windmillTower: 0xd97706, windmillRoof: 0xfef08a, windmillBlade: 0xffffff,
      propKit: 'palace',
      length: 170, windmills: 4, bumpers: 9, boosts: 7, bridge: true, curveAmp: 9.5
    }
  ];

  // --- CIE76 ΔE Color Contrast Auditor ---
  function hexToLab(hex) {
    let r = ((hex >> 16) & 255) / 255;
    let g = ((hex >> 8) & 255) / 255;
    let b = (hex & 255) / 255;
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    const y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
    const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
    const f = (t) => (t > 0.008856 ? Math.cbrt(t) : (7.787 * t) + 16 / 116);
    const fx = f(x), fy = f(y), fz = f(z);
    return [(116 * fy) - 16, 500 * (fx - fy), 200 * (fy - fz)];
  }

  function deltaE76(hex1, hex2) {
    const a = hexToLab(hex1);
    const b = hexToLab(hex2);
    return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  }

  function verifyColorContrastDeltaE() {
    let minDE = Infinity;
    let minPair = '';
    CRITTERS.forEach((c) => {
      const b1 = deltaE76(c.color, BRIDGE_WOOD_A);
      const b2 = deltaE76(c.color, BRIDGE_WOOD_B);
      if (b1 < minDE) { minDE = b1; minPair = `${c.id} vs bridgeA`; }
      if (b2 < minDE) { minDE = b2; minPair = `${c.id} vs bridgeB`; }
      STAGES.forEach((s) => {
        const d1 = deltaE76(c.color, s.turfColor);
        const d2 = deltaE76(c.color, s.turfAlt);
        if (d1 < minDE) { minDE = d1; minPair = `${c.id} vs stage${s.id}.turfColor`; }
        if (d2 < minDE) { minDE = d2; minPair = `${c.id} vs stage${s.id}.turfAlt`; }
      });
    });
    const res = { minDeltaE: Math.round(minDE * 10) / 10, minPair, pass: minDE >= 25 };
    if (!res.pass) {
      console.error('Color contrast audit failed:', res);
    }
    return res;
  }
  window.verifyColorContrastDeltaE = verifyColorContrastDeltaE;

  // --- Persistent Progress Storage ---
  const STORAGE_KEY = 'critters_golf3d_save_v1';
  let saveState = {
    unlockedStage: 0,
    stars: [0, 0, 0, 0, 0, 0, 0, 0],
    selectedCritter: 0,
    selectedStage: 0
  };

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.unlockedStage === 'number') saveState.unlockedStage = Math.min(7, Math.max(0, parsed.unlockedStage));
        if (Array.isArray(parsed.stars) && parsed.stars.length === 8) saveState.stars = parsed.stars;
        if (typeof parsed.selectedCritter === 'number') saveState.selectedCritter = parsed.selectedCritter % CRITTERS.length;
        if (typeof parsed.selectedStage === 'number') saveState.selectedStage = Math.min(saveState.unlockedStage, Math.max(0, parsed.selectedStage));
      }
    } catch (e) { /* ignore storage errors */ }
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveState));
    } catch (e) { /* ignore */ }
  }

  // --- Synthesized Web Audio SFX & Melodies ---
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.bgmTimer = null;
      this.bgmStep = 0;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }

    tone(freq, dur, type = 'sine', vol = 0.14, slideTo = null) {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const attack = Math.min(0.005, dur * 0.25);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(Math.max(20, freq), now);
        if (slideTo) {
          osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), now + dur);
        }
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(Math.max(0.001, vol), now + attack);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.onended = () => {
          try {
            gain.disconnect();
            osc.disconnect();
          } catch (e) {}
        };
        osc.start(now);
        osc.stop(now + dur + 0.005);
      } catch (e) {}
    }

    playPutt() {
      this.init();
      this.tone(320, 0.11, 'triangle', 0.18, 620);
      this.tone(180, 0.06, 'sine', 0.10, 95);
    }
    playBumper(volScale = 1.0) {
      this.init();
      this.tone(480, 0.14, 'sine', 0.18 * volScale, 880);
      setTimeout(() => this.tone(720, 0.10, 'triangle', 0.11 * volScale, 1080), 35);
    }
    playClack(volScale = 1.0) {
      this.init();
      this.tone(820, 0.055, 'triangle', 0.16 * volScale, 420);
    }
    playCooldownBoop() {
      this.init();
      this.tone(190, 0.09, 'sine', 0.12, 140);
    }
    playStarCollect() {
      this.init();
      this.tone(987.77, 0.11, 'sine', 0.16, 1318.5);
      setTimeout(() => {
        this.tone(1318.5, 0.16, 'triangle', 0.16, 1975.5);
        this.tone(1975.5, 0.18, 'sine', 0.09, 2637.0);
      }, 55);
    }
    playBoost() {
      this.init();
      this.tone(523, 0.1, 'sawtooth', 0.13, 784);
      setTimeout(() => this.tone(784, 0.14, 'sawtooth', 0.13, 1046), 65);
    }
    playRainbowFever() {
      this.init();
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      notes.forEach((n, i) => {
        setTimeout(() => {
          this.tone(n, 0.16, 'triangle', 0.17, n * 1.12);
          this.tone(n * 1.5, 0.14, 'sine', 0.08, n * 1.65);
        }, i * 55);
      });
    }
    playVortex() {
      this.init();
      this.tone(360, 0.28, 'sine', 0.17, 940);
      setTimeout(() => this.tone(540, 0.22, 'triangle', 0.13, 1220), 60);
    }
    playRocket() {
      this.init();
      this.tone(240, 0.30, 'sawtooth', 0.17, 980);
      this.tone(120, 0.26, 'triangle', 0.14, 490);
      setTimeout(() => this.tone(660, 0.18, 'sawtooth', 0.13, 1320), 75);
    }
    playBumpWave() {
      this.init();
      this.tone(160, 0.26, 'square', 0.16, 440);
      this.tone(110, 0.30, 'sine', 0.18, 65);
      setTimeout(() => this.tone(320, 0.18, 'triangle', 0.12, 640), 50);
    }
    playCupSink() {
      this.init();
      [523, 659, 784, 1046].forEach((n, i) => setTimeout(() => this.tone(n, 0.14, 'triangle', 0.18), i * 65));
    }
    playWinFanfare(qualified) {
      this.init();
      if (qualified) {
        const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
        notes.forEach((n, i) => {
          setTimeout(() => {
            const dur = i === notes.length - 1 ? 0.38 : 0.19;
            this.tone(n, dur, 'triangle', 0.18, n * 1.03);
            this.tone(n * 1.25, dur, 'sine', 0.10);
          }, i * 95);
        });
      } else {
        // Expressive 4-note descending slide-trombone glissando on 4th/5th defeat
        const sadSlides = [
          { from: 392.0, to: 372.0, dur: 0.20, delay: 0 },
          { from: 369.99, to: 351.0, dur: 0.20, delay: 210 },
          { from: 349.23, to: 331.0, dur: 0.20, delay: 420 },
          { from: 329.63, to: 220.0, dur: 0.55, delay: 630 }
        ];
        sadSlides.forEach((s) => {
          setTimeout(() => {
            this.tone(s.from, s.dur, 'sawtooth', 0.15, s.to);
            this.tone(s.from * 0.5, s.dur, 'triangle', 0.11, s.to * 0.5);
          }, s.delay);
        });
      }
    }
    startBGM() {
      this.stopBGM();
      const melody = [523, 659, 784, 659, 587, 698, 880, 698, 523, 784, 1046, 784];
      this.bgmTimer = setInterval(() => {
        if (this.muted || !this.ctx || gameState.mode !== 'playing') return;
        const note = melody[this.bgmStep % melody.length];
        this.bgmStep++;
        const isFever = gameState.rainbowFeverTimer > 0;
        this.tone(isFever ? note * 1.25 : note, 0.16, isFever ? 'triangle' : 'sine', isFever ? 0.055 : 0.042);
        if (isFever) {
          this.tone(note * 2.0, 0.11, 'sine', 0.032, note * 2.15);
        }
      }, 310);
    }
    stopBGM() {
      if (this.bgmTimer) {
        clearInterval(this.bgmTimer);
        this.bgmTimer = null;
      }
    }
  }

  const sfx = new SoundEngine();
  window.addEventListener('pointerdown', () => sfx.init(), { once: true, passive: true });
  window.addEventListener('keydown', () => sfx.init(), { once: true, passive: true });

  // --- Core Game State (Exposed on window.GAME_STATE for Verification) ---
  const gameState = {
    mode: 'menu', // 'menu' | 'playing' | 'result'
    webglReady: false,
    assetsReady: false,
    stageIndex: 0,
    selectedCritterIndex: 0,
    elapsed: 0,
    trauma: 0,
    fovKick: 0,
    fovTarget: 0,
    rainbowCharge: 0,
    rainbowFeverTimer: 0,
    courseLength: 92,
    holePos: { x: 0, y: 0, z: -92 },
    aimAngle: 0,
    aimPower: 0.72,
    manualAimLockTimer: 0,
    isDraggingAim: false,
    lastDisplayedRank: 1,
    racers: [],
    finishOrder: [],
    windmills: [],
    bumpers: [],
    boostPads: [],
    starsCoins: [],
    particles: [],
    shockwaves: [],
    pendingWaveHits: [],
    cooldowns: { putt: 0, vortex: 0, rocket: 0, bump: 0 },
    concludeTimerId: null,
    lastQualification: null
  };
  window.GAME_STATE = gameState;

  function clearConcludeTimer() {
    if (gameState.concludeTimerId) {
      clearTimeout(gameState.concludeTimerId);
      gameState.concludeTimerId = null;
    }
  }

  // --- Trauma Camera Shake Trigger ---
  const camBase = { x: 0, y: 14, z: 18 };
  function addTrauma(amount) {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scale = reduced ? 0.3 : 1.0;
    gameState.trauma = Math.min(1.0, gameState.trauma + amount * scale);
  }
  window.addTrauma = addTrauma;

  function triggerFovKick(deltaDeg = 6.0) {
    gameState.fovTarget = Math.max(gameState.fovTarget, deltaDeg);
  }

  // --- Three.js Scene Globals & Persistent Shared Resources ---
  let scene = null;
  let camera = null;
  let renderer = null;
  let clock = null;
  let dirLight = null;
  let hemiLight = null;
  let waterMesh = null;
  let courseGroup = null;
  let aimGroup = null;
  let holeBeaconMesh = null;
  let flagGroup = null;

  const PERSISTENT_GEOMETRIES = new Set();
  const PERSISTENT_MATERIALS = new Set();
  const PERSISTENT_TEXTURES = new Set();

  const critterTextures = {};
  const critterPlayerTextures = {};
  const critterMedallionDataURLs = {};
  let contactShadowTex = null;
  let sharedParticleGeo = null;
  let particleInstancedMesh = null;
  const MAX_PARTICLES = 64;
  let sharedShockwaveGeo = null;
  const shockwavePool = [];
  let sharedStarGeo = null;
  let sharedStarMat = null;
  let currentSkyTex = null;

  // --- Draw 256x256 Circular Medallion CanvasTexture ---
  function buildMedallionCanvas(critter, imgOrNull, isPlayerVariant = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const cx = 128;
    const cy = 132;

    if (isPlayerVariant) {
      ctx.beginPath();
      ctx.arc(cx, cy, 120, 0, Math.PI * 2);
      ctx.fillStyle = '#facc15';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, 112, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(cx, cy, 116, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, 104, 0, Math.PI * 2);
    ctx.fillStyle = critter.hex;
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, 90, 0, Math.PI * 2);
    ctx.clip();

    if (imgOrNull && imgOrNull.complete && imgOrNull.naturalWidth > 0) {
      const iw = imgOrNull.naturalWidth;
      const ih = imgOrNull.naturalHeight;
      const scale = Math.max(182 / iw, 182 / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.drawImage(imgOrNull, cx - dw / 2, cy - dh / 2, dw, dh);
    } else {
      const grad = ctx.createRadialGradient(cx - 25, cy - 25, 10, cx, cy, 90);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.35, critter.hex);
      grad.addColorStop(1, '#1e293b');
      ctx.fillStyle = grad;
      ctx.fillRect(cx - 90, cy - 90, 180, 180);

      ctx.font = '78px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(critter.emoji, cx, cy + 5);
    }
    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, 96, -Math.PI * 0.8, -Math.PI * 0.2);
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 6;
    ctx.stroke();

    if (isPlayerVariant) {
      ctx.font = '38px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👑', cx, 22);
    }

    return canvas;
  }

  function applyMedallionTexture(critter, imgOrNull) {
    const stdCanvas = buildMedallionCanvas(critter, imgOrNull, false);
    const plrCanvas = buildMedallionCanvas(critter, imgOrNull, true);
    critterMedallionDataURLs[critter.id] = stdCanvas.toDataURL('image/png');

    if (typeof THREE === 'undefined') return;

    if (critterTextures[critter.id]) {
      critterTextures[critter.id].image = stdCanvas;
      critterTextures[critter.id].needsUpdate = true;
    } else {
      const tex = new THREE.CanvasTexture(stdCanvas);
      if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
      PERSISTENT_TEXTURES.add(tex);
      critterTextures[critter.id] = tex;
    }

    if (critterPlayerTextures[critter.id]) {
      critterPlayerTextures[critter.id].image = plrCanvas;
      critterPlayerTextures[critter.id].needsUpdate = true;
    } else {
      const pTex = new THREE.CanvasTexture(plrCanvas);
      if (THREE.SRGBColorSpace) pTex.colorSpace = THREE.SRGBColorSpace;
      PERSISTENT_TEXTURES.add(pTex);
      critterPlayerTextures[critter.id] = pTex;
    }
  }

  function preloadCritterMedallions(onAllReady) {
    const playBtn = document.getElementById('btn-play');
    if (playBtn) {
      playBtn.disabled = true;
      playBtn.innerHTML = '<span>🐾</span><span>⏳</span>';
    }

    CRITTERS.forEach((c) => {
      applyMedallionTexture(c, null);
    });

    let remaining = CRITTERS.length;
    let unlockedGate = false;

    function unlockPlayGate() {
      if (unlockedGate) return;
      unlockedGate = true;
      gameState.assetsReady = true;
      if (playBtn) {
        playBtn.disabled = !gameState.webglReady;
        playBtn.innerHTML = gameState.webglReady ? '<span>▶️</span><span>⛳</span>' : '<span>🖥️</span><span>🙀</span>';
      }
      renderMenuGrids();
      if (onAllReady) onAllReady();
    }

    setTimeout(() => {
      unlockPlayGate();
    }, 2500);

    CRITTERS.forEach((c) => {
      const img = new Image();
      if (window.location.protocol !== 'file:') {
        img.crossOrigin = 'anonymous';
      }
      img.onload = () => {
        applyMedallionTexture(c, img);
        gameState.racers.forEach((r) => {
          if (r.id === c.id && r.pinEl) {
            r.pinEl.style.backgroundImage = `url('${critterMedallionDataURLs[c.id]}')`;
          }
        });
        renderMenuGrids();
        remaining--;
        if (remaining <= 0) unlockPlayGate();
      };
      img.onerror = () => {
        remaining--;
        if (remaining <= 0) unlockPlayGate();
      };
      img.src = c.icon;
    });
  }

  function getContactShadowTexture() {
    if (contactShadowTex) return contactShadowTex;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 8, 64, 64, 60);
    grad.addColorStop(0, 'rgba(10, 25, 15, 0.62)');
    grad.addColorStop(0.55, 'rgba(10, 25, 15, 0.28)');
    grad.addColorStop(1, 'rgba(10, 25, 15, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    contactShadowTex = new THREE.CanvasTexture(canvas);
    PERSISTENT_TEXTURES.add(contactShadowTex);
    return contactShadowTex;
  }

  function createSkyGradientTexture(topHex, horizonHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const topColor = '#' + new THREE.Color(topHex).getHexString();
    const botColor = '#' + new THREE.Color(horizonHex).getHexString();
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0.0, topColor);
    grad.addColorStop(0.62, botColor);
    grad.addColorStop(1.0, botColor);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 256);
    const tex = new THREE.CanvasTexture(canvas);
    if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function disposeTree(root) {
    if (!root) return;
    root.traverse((node) => {
      if (node === root) return;
      if (node.geometry && !PERSISTENT_GEOMETRIES.has(node.geometry)) {
        node.geometry.dispose();
      }
      if (node.material) {
        const mats = Array.isArray(node.material) ? node.material : [node.material];
        mats.forEach((m) => {
          if (!m || PERSISTENT_MATERIALS.has(m)) return;
          if (m.map && !PERSISTENT_TEXTURES.has(m.map)) {
            m.map.dispose();
          }
          m.dispose();
        });
      }
    });
  }
  window.disposeTree = disposeTree;

  function showWebGLFallbackBanner() {
    const container = document.getElementById('webgl-container');
    if (!container) return;
    container.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:56px;color:#fff;">
        🖥️ 🙀 🔄 ⛳
      </div>
    `;
    const playBtn = document.getElementById('btn-play');
    if (playBtn) playBtn.disabled = true;
  }

  function applyCameraFraming() {
    if (!camera) return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    camera.aspect = W / H;

    if (gameState.mode === 'menu' && W > 720) {
      const shiftLeftPx = -Math.round(W * 0.22);
      camera.setViewOffset(W, H, shiftLeftPx, 0, W, H);
    } else if (gameState.mode === 'playing') {
      const shiftDownPx = Math.round(H * 0.14);
      camera.setViewOffset(W, H, 0, shiftDownPx, W, H);
    } else {
      camera.clearViewOffset();
    }
    camera.updateProjectionMatrix();
  }

  // --- Initialize Single-Draw-Call Instanced Particle Pool & Shockwave Ring Pool ---
  function initPersistentVfxPools() {
    sharedParticleGeo = new THREE.SphereGeometry(0.24, 8, 8);
    const partMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
    PERSISTENT_GEOMETRIES.add(sharedParticleGeo);
    PERSISTENT_MATERIALS.add(partMat);

    particleInstancedMesh = new THREE.InstancedMesh(sharedParticleGeo, partMat, MAX_PARTICLES);
    particleInstancedMesh.frustumCulled = false;
    const zeroMat = new THREE.Matrix4().makeScale(0, 0, 0);
    const defaultCol = new THREE.Color(0xffe600);
    for (let i = 0; i < MAX_PARTICLES; i++) {
      particleInstancedMesh.setMatrixAt(i, zeroMat);
      particleInstancedMesh.setColorAt(i, defaultCol);
    }
    particleInstancedMesh.instanceMatrix.needsUpdate = true;
    if (particleInstancedMesh.instanceColor) particleInstancedMesh.instanceColor.needsUpdate = true;
    scene.add(particleInstancedMesh);

    sharedShockwaveGeo = new THREE.RingGeometry(0.84, 1.0, 48);
    PERSISTENT_GEOMETRIES.add(sharedShockwaveGeo);
    for (let i = 0; i < 6; i++) {
      const rMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false
      });
      PERSISTENT_MATERIALS.add(rMat);
      const rMesh = new THREE.Mesh(sharedShockwaveGeo, rMat);
      rMesh.rotation.x = -Math.PI / 2;
      rMesh.visible = false;
      scene.add(rMesh);
      shockwavePool.push({ mesh: rMesh, mat: rMat, active: false, t: 0, duration: 0.45, maxRadius: 4.0 });
    }
    gameState.shockwaves = shockwavePool;
  }

  function spawnShockwaveRing(x, y, z, maxRadius = 4.0, colorHex = 0xffe600, duration = 0.46) {
    if (!gameState.webglReady || shockwavePool.length === 0) return;
    let slot = shockwavePool.find((s) => !s.active);
    if (!slot) {
      slot = shockwavePool.reduce((a, b) => (a.t > b.t ? a : b));
    }
    slot.active = true;
    slot.t = 0;
    slot.duration = duration;
    slot.maxRadius = maxRadius;
    slot.mat.color.setHex(colorHex);
    slot.mat.opacity = 0.92;
    slot.mesh.position.set(x, y + 0.08, z);
    slot.mesh.scale.setScalar(1.0);
    slot.mesh.visible = true;
  }
  window.spawnShockwaveRing = spawnShockwaveRing;

  function updateShockwaveRings(dt) {
    for (let i = 0; i < shockwavePool.length; i++) {
      const s = shockwavePool[i];
      if (!s.active) continue;
      s.t += dt;
      const u = Math.min(1, s.t / s.duration);
      const easeOut = 1 - Math.pow(1 - u, 3);
      const radius = 1.0 + (s.maxRadius - 1.0) * easeOut;
      s.mesh.scale.setScalar(radius);
      s.mat.opacity = 0.92 * (1 - easeOut);
      if (u >= 1) {
        s.active = false;
        s.mesh.visible = false;
      }
    }
  }

  // --- Initialize Three.js WebGL ---
  function initThree() {
    if (typeof THREE === 'undefined') {
      showWebGLFallbackBanner();
      return false;
    }

    try {
      const container = document.getElementById('webgl-container');
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0xbae6fd, 0.0038);

      camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.5, 500);
      camera.position.set(0, 14, 18);

      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
      if (THREE.ACESFilmicToneMapping) {
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
      }

      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      hemiLight = new THREE.HemisphereLight(0xdff4ff, 0x6fbf73, 1.3);
      hemiLight.position.set(0, 50, 0);
      scene.add(hemiLight);

      dirLight = new THREE.DirectionalLight(0xfff4e0, 2.5);
      dirLight.position.set(18, 42, 26);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.set(2048, 2048);
      dirLight.shadow.camera.left = -32;
      dirLight.shadow.camera.right = 32;
      dirLight.shadow.camera.top = 32;
      dirLight.shadow.camera.bottom = -32;
      dirLight.shadow.camera.near = 1;
      dirLight.shadow.camera.far = 150;
      dirLight.shadow.bias = -0.0005;
      dirLight.shadow.normalBias = 0.02;
      scene.add(dirLight);
      scene.add(dirLight.target);

      const waterGeo = new THREE.PlaneGeometry(1400, 1400);
      const waterMat = new THREE.MeshLambertMaterial({ color: 0x48cae4, emissive: 0x000000 });
      PERSISTENT_GEOMETRIES.add(waterGeo);
      PERSISTENT_MATERIALS.add(waterMat);
      waterMesh = new THREE.Mesh(waterGeo, waterMat);
      waterMesh.rotation.x = -Math.PI / 2;
      waterMesh.position.set(0, -1.65, -120);
      waterMesh.receiveShadow = true;
      scene.add(waterMesh);

      sharedStarGeo = new THREE.OctahedronGeometry(0.65, 0);
      sharedStarMat = new THREE.MeshStandardMaterial({
        color: 0xffe600,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.35,
        roughness: 0.25,
        metalness: 0.2
      });
      PERSISTENT_GEOMETRIES.add(sharedStarGeo);
      PERSISTENT_MATERIALS.add(sharedStarMat);

      courseGroup = new THREE.Group();
      scene.add(courseGroup);

      aimGroup = new THREE.Group();
      scene.add(aimGroup);
      buildAimIndicator();

      initPersistentVfxPools();

      clock = new THREE.Clock();
      window.addEventListener('resize', onWindowResize);
      gameState.webglReady = true;
      window.__RENDERER__ = renderer;
      applyCameraFraming();
      return true;
    } catch (err) {
      showWebGLFallbackBanner();
      return false;
    }
  }

  function onWindowResize() {
    if (!camera || !renderer) return;
    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h);
    applyCameraFraming();
  }

  // --- Dotted 3D Aiming Arrow Indicator ---
  let aimDots = [];
  function buildAimIndicator() {
    aimDots = [];
    const dotGeo = new THREE.SphereGeometry(0.28, 12, 12);
    PERSISTENT_GEOMETRIES.add(dotGeo);
    for (let i = 0; i < 10; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: i < 5 ? 0xffe600 : 0xff5277,
        transparent: true,
        opacity: 0.92 - i * 0.06,
        toneMapped: false
      });
      PERSISTENT_MATERIALS.add(mat);
      const dot = new THREE.Mesh(dotGeo, mat);
      aimGroup.add(dot);
      aimDots.push(dot);
    }
  }

  function updateAimIndicator(player, stageCfg) {
    if (!aimGroup) return;
    if (!player || player.finished || gameState.mode !== 'playing') {
      aimGroup.visible = false;
      return;
    }
    aimGroup.visible = true;
    const stepDist = 1.15 + gameState.aimPower * 1.15;
    for (let i = 0; i < aimDots.length; i++) {
      const d = (i + 1) * stepDist;
      const dx = Math.sin(gameState.aimAngle) * d;
      const dz = -Math.cos(gameState.aimAngle) * d;
      const dotZ = player.mesh.position.z + dz;
      const groundY = getCourseElevationY(dotZ, stageCfg);
      aimDots[i].position.set(
        player.mesh.position.x + dx,
        groundY + 0.55 + Math.sin(gameState.elapsed * 7 + i * 0.5) * 0.12,
        dotZ
      );
      const s = (gameState.isDraggingAim ? 1.35 : 1.15) - i * 0.07;
      aimDots[i].scale.setScalar(s);
    }
  }

  function smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  function getCourseCenterX(z, stageCfg) {
    const progress = Math.min(1, Math.max(0, -z / stageCfg.length));
    const envelope = Math.sin(progress * Math.PI);
    return Math.sin(progress * Math.PI * 2.0) * stageCfg.curveAmp * envelope;
  }

  function getCourseTangentNormal(z, stageCfg) {
    const eps = 0.25;
    const x1 = getCourseCenterX(z + eps, stageCfg);
    const x2 = getCourseCenterX(z - eps, stageCfg);
    const dx = x2 - x1;
    const dz = -2 * eps;
    const len = Math.hypot(dx, dz) || 1;
    const tx = dx / len;
    const tz = dz / len;
    return { tx, tz, nx: -tz, nz: tx };
  }

  function getCourseHalfWidth(z, stageCfg) {
    if (!stageCfg.bridge) return 9.2;
    const progress = Math.min(1, Math.max(0, -z / stageCfg.length));
    const enterBridge = smoothstep(0.38, 0.43, progress);
    const exitBridge = smoothstep(0.55, 0.60, progress);
    const bridgeFactor = enterBridge * (1 - exitBridge);
    return 9.2 - bridgeFactor * 2.4;
  }

  function getCourseElevationY(z, stageCfg) {
    if (!stageCfg.bridge) return 0;
    const progress = Math.min(1, Math.max(0, -z / stageCfg.length));
    if (progress <= 0.39 || progress >= 0.59) return 0;
    const bridgePhase = (progress - 0.39) / 0.20;
    return Math.sin(bridgePhase * Math.PI) * 0.65;
  }

  // --- Build Continuous Ribbon Fairway & Rails BufferGeometries ---
  function buildContinuousFairwayAndRails(stageCfg) {
    const zStart = 6.0;
    const zEnd = -stageCfg.length - 7.5;
    const numSamples = Math.ceil(zStart - zEnd);

    const turfPositions = [];
    const turfNormals = [];
    const turfColors = [];
    const turfIndices = [];

    const railPositions = [];
    const railNormals = [];
    const railColors = [];
    const railIndices = [];

    const cTurfA = new THREE.Color(stageCfg.turfColor);
    const cTurfB = new THREE.Color(stageCfg.turfAlt);
    const cBridgeA = new THREE.Color(BRIDGE_WOOD_A);
    const cBridgeB = new THREE.Color(BRIDGE_WOOD_B);
    const cWallA = new THREE.Color(stageCfg.wallColor);
    const cWallB = new THREE.Color(stageCfg.wallAlt || 0xffffff);

    function pushQuad(posArr, normArr, colArr, idxArr, p0, p1, p2, p3, nx, ny, nz, colorObj) {
      const base = posArr.length / 3;
      posArr.push(
        p0[0], p0[1], p0[2],
        p1[0], p1[1], p1[2],
        p2[0], p2[1], p2[2],
        p3[0], p3[1], p3[2]
      );
      for (let k = 0; k < 4; k++) {
        normArr.push(nx, ny, nz);
        colArr.push(colorObj.r, colorObj.g, colorObj.b);
      }
      idxArr.push(base, base + 1, base + 2, base, base + 2, base + 3);
    }

    const samples = [];
    for (let i = 0; i <= numSamples; i++) {
      const z = zStart - (i / numSamples) * (zStart - zEnd);
      const cx = getCourseCenterX(z, stageCfg);
      const halfW = getCourseHalfWidth(z, stageCfg);
      const elevY = getCourseElevationY(z, stageCfg);
      const { nx, nz } = getCourseTangentNormal(z, stageCfg);
      const progress = Math.min(1, Math.max(0, -z / stageCfg.length));
      const inBridge = stageCfg.bridge && progress > 0.40 && progress < 0.58;
      samples.push({ z, cx, halfW, elevY, nx, nz, inBridge });
    }

    for (let i = 0; i < numSamples; i++) {
      const s0 = samples[i];
      const s1 = samples[i + 1];

      const stripeIdx = Math.floor(i / 3);
      const isEvenStripe = stripeIdx % 2 === 0;

      const l0 = [s0.cx - s0.nx * s0.halfW, s0.elevY, s0.z - s0.nz * s0.halfW];
      const m0 = [s0.cx, s0.elevY, s0.z];
      const r0 = [s0.cx + s0.nx * s0.halfW, s0.elevY, s0.z + s0.nz * s0.halfW];

      const l1 = [s1.cx - s1.nx * s1.halfW, s1.elevY, s1.z - s1.nz * s1.halfW];
      const m1 = [s1.cx, s1.elevY, s1.z];
      const r1 = [s1.cx + s1.nx * s1.halfW, s1.elevY, s1.z + s1.nz * s1.halfW];

      const leftCol = s0.inBridge
        ? (i % 2 === 0 ? cBridgeA : cBridgeB)
        : (isEvenStripe ? cTurfA : cTurfB);
      const rightCol = s0.inBridge
        ? (i % 2 === 0 ? cBridgeA : cBridgeB)
        : (isEvenStripe ? cTurfB : cTurfA);

      pushQuad(turfPositions, turfNormals, turfColors, turfIndices, l0, m0, m1, l1, 0, 1, 0, leftCol);
      pushQuad(turfPositions, turfNormals, turfColors, turfIndices, m0, r0, r1, m1, 0, 1, 0, rightCol);

      const railW = 0.85;
      const railH = s0.inBridge ? 1.15 : 0.95;
      const wallCol = s0.inBridge ? (i % 2 === 0 ? cBridgeB : cBridgeA) : (isEvenStripe ? cWallA : cWallB);

      const li0 = [l0[0], s0.elevY, l0[2]];
      const lo0 = [l0[0] - s0.nx * railW, s0.elevY, l0[2] - s0.nz * railW];
      const li1 = [l1[0], s1.elevY, l1[2]];
      const lo1 = [l1[0] - s1.nx * railW, s1.elevY, l1[2] - s1.nz * railW];

      const li0Top = [li0[0], s0.elevY + railH, li0[2]];
      const lo0Top = [lo0[0], s0.elevY + railH, lo0[2]];
      const li1Top = [li1[0], s1.elevY + railH, li1[2]];
      const lo1Top = [lo1[0], s1.elevY + railH, lo1[2]];

      pushQuad(railPositions, railNormals, railColors, railIndices, lo0Top, li0Top, li1Top, lo1Top, 0, 1, 0, wallCol);
      pushQuad(railPositions, railNormals, railColors, railIndices, li0, li0Top, li1Top, li1, s0.nx, 0, s0.nz, wallCol);
      pushQuad(railPositions, railNormals, railColors, railIndices, lo0Top, lo0, lo1, lo1Top, -s0.nx, 0, -s0.nz, wallCol);

      const ri0 = [r0[0], s0.elevY, r0[2]];
      const ro0 = [r0[0] + s0.nx * railW, s0.elevY, r0[2] + s0.nz * railW];
      const ri1 = [r1[0], s1.elevY, r1[2]];
      const ro1 = [r1[0] + s1.nx * railW, s1.elevY, r1[2] + s1.nz * railW];

      const ri0Top = [ri0[0], s0.elevY + railH, ri0[2]];
      const ro0Top = [ro0[0], s0.elevY + railH, ro0[2]];
      const ri1Top = [ri1[0], s1.elevY + railH, ri1[2]];
      const ro1Top = [ro1[0], s1.elevY + railH, ro1[2]];

      pushQuad(railPositions, railNormals, railColors, railIndices, ri0Top, ro0Top, ro1Top, ri1Top, 0, 1, 0, wallCol);
      pushQuad(railPositions, railNormals, railColors, railIndices, ri0Top, ri0, ri1, ri1Top, -s0.nx, 0, -s0.nz, wallCol);
      pushQuad(railPositions, railNormals, railColors, railIndices, ro0, ro0Top, ro1Top, ro1, s0.nx, 0, s0.nz, wallCol);
    }

    const turfGeo = new THREE.BufferGeometry();
    turfGeo.setAttribute('position', new THREE.Float32BufferAttribute(turfPositions, 3));
    turfGeo.setAttribute('normal', new THREE.Float32BufferAttribute(turfNormals, 3));
    turfGeo.setAttribute('color', new THREE.Float32BufferAttribute(turfColors, 3));
    turfGeo.setIndex(turfIndices);

    const turfMat = new THREE.MeshLambertMaterial({ vertexColors: true });
    const turfMesh = new THREE.Mesh(turfGeo, turfMat);
    turfMesh.receiveShadow = true;
    courseGroup.add(turfMesh);

    const railGeo = new THREE.BufferGeometry();
    railGeo.setAttribute('position', new THREE.Float32BufferAttribute(railPositions, 3));
    railGeo.setAttribute('normal', new THREE.Float32BufferAttribute(railNormals, 3));
    railGeo.setAttribute('color', new THREE.Float32BufferAttribute(railColors, 3));
    railGeo.setIndex(railIndices);

    const railMat = new THREE.MeshLambertMaterial({ vertexColors: true });
    const railMesh = new THREE.Mesh(railGeo, railMat);
    railMesh.castShadow = true;
    railMesh.receiveShadow = true;
    courseGroup.add(railMesh);

    const endSample = samples[samples.length - 1];
    const backWallGeo = new THREE.BoxGeometry(endSample.halfW * 2 + 1.8, 1.4, 1.0);
    const backWallMat = new THREE.MeshLambertMaterial({ color: stageCfg.wallColor });
    const backWall = new THREE.Mesh(backWallGeo, backWallMat);
    backWall.position.set(endSample.cx, 0.6, zEnd);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    courseGroup.add(backWall);
  }

  // --- Build 28 Roadside InstancedMesh Props + Stage-Specific Landmarks ---
  function buildStageThemedProps(stageCfg) {
    const count = 28;
    const dummy = new THREE.Object3D();

    let baseGeo, baseMat, topGeo, topMat;
    const kit = stageCfg.propKit;

    if (kit === 'blossom') {
      baseGeo = new THREE.CylinderGeometry(0.35, 0.5, 2.8, 7);
      baseMat = new THREE.MeshLambertMaterial({ color: 0x6b3e26 });
      topGeo = new THREE.DodecahedronGeometry(1.9, 1);
      topMat = new THREE.MeshLambertMaterial({ color: 0xff85a1 });
    } else if (kit === 'rainbow') {
      baseGeo = new THREE.SphereGeometry(1.5, 10, 10);
      baseMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
      topGeo = new THREE.TorusGeometry(2.2, 0.35, 8, 18, Math.PI);
      topMat = new THREE.MeshBasicMaterial({ color: 0xf72585, toneMapped: false });
    } else if (kit === 'candy') {
      baseGeo = new THREE.CylinderGeometry(0.22, 0.22, 3.4, 8);
      baseMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
      topGeo = new THREE.CylinderGeometry(1.65, 1.65, 0.55, 16);
      topMat = new THREE.MeshLambertMaterial({ color: 0xf72585, emissive: 0x7209b7, emissiveIntensity: 0.2 });
    } else if (kit === 'castle') {
      baseGeo = new THREE.CylinderGeometry(1.3, 1.5, 4.5, 8);
      baseMat = new THREE.MeshLambertMaterial({ color: 0x94a3b8 });
      topGeo = new THREE.ConeGeometry(1.7, 2.4, 8);
      topMat = new THREE.MeshLambertMaterial({ color: 0x2563eb });
    } else if (kit === 'palm') {
      baseGeo = new THREE.CylinderGeometry(0.3, 0.55, 4.2, 7);
      baseMat = new THREE.MeshLambertMaterial({ color: 0x8b5a2b });
      topGeo = new THREE.ConeGeometry(2.3, 1.4, 6);
      topMat = new THREE.MeshLambertMaterial({ color: 0x65a30d });
    } else if (kit === 'space') {
      baseGeo = new THREE.SphereGeometry(1.4, 12, 12);
      baseMat = new THREE.MeshLambertMaterial({ color: 0x818cf8, emissive: 0x312e81, emissiveIntensity: 0.4 });
      topGeo = new THREE.TorusGeometry(2.3, 0.22, 8, 24);
      topMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, toneMapped: false });
    } else if (kit === 'volcano') {
      baseGeo = new THREE.ConeGeometry(2.6, 4.6, 8);
      baseMat = new THREE.MeshLambertMaterial({ color: 0x3f3f46 });
      topGeo = new THREE.SphereGeometry(0.95, 10, 10);
      topMat = new THREE.MeshBasicMaterial({ color: 0xff4500, toneMapped: false });
    } else {
      baseGeo = new THREE.CylinderGeometry(0.7, 0.85, 4.6, 10);
      baseMat = new THREE.MeshLambertMaterial({ color: 0xfef08a });
      topGeo = new THREE.OctahedronGeometry(1.35, 0);
      topMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xd97706, emissiveIntensity: 0.35, roughness: 0.2, metalness: 0.6 });
    }

    const baseInst = new THREE.InstancedMesh(baseGeo, baseMat, count);
    const topInst = new THREE.InstancedMesh(topGeo, topMat, count);
    baseInst.castShadow = true;
    topInst.castShadow = true;

    for (let i = 0; i < count; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const frac = (i + 0.5) / count;
      const pz = 2 - frac * (stageCfg.length + 6);
      const cx = getCourseCenterX(pz, stageCfg);
      const halfW = getCourseHalfWidth(pz, stageCfg);
      const px = cx + side * (halfW + 4.8 + (i % 3) * 2.2);
      const py = -1.2;

      dummy.position.set(px, py + 1.8, pz);
      dummy.rotation.set(0, i * 0.7, 0);
      const scale = 0.85 + (i % 4) * 0.14;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      baseInst.setMatrixAt(i, dummy.matrix);

      dummy.position.set(px, py + 4.1 * scale, pz);
      if (kit === 'candy') dummy.rotation.set(Math.PI / 2, i * 0.5, 0);
      else if (kit === 'space') dummy.rotation.set(0.6, i * 0.4, 0.3);
      else dummy.rotation.set(0, i * 0.7, 0);
      dummy.updateMatrix();
      topInst.setMatrixAt(i, dummy.matrix);
    }

    baseInst.instanceMatrix.needsUpdate = true;
    topInst.instanceMatrix.needsUpdate = true;
    courseGroup.add(baseInst);
    courseGroup.add(topInst);

    if (kit === 'rainbow' || kit === 'palace') {
      const archColors = [0xff3b3b, 0xff9f1c, 0xffe600, 0x2ec4b6, 0x38bdf8, 0x9b5de5];
      archColors.forEach((col, idx) => {
        const archGeo = new THREE.TorusGeometry(11.5 + idx * 0.55, 0.28, 8, 28, Math.PI);
        const archMat = new THREE.MeshBasicMaterial({ color: col, toneMapped: false });
        const archMesh = new THREE.Mesh(archGeo, archMat);
        const az = -stageCfg.length * 0.49;
        archMesh.position.set(getCourseCenterX(az, stageCfg), 0, az);
        courseGroup.add(archMesh);
      });
    } else if (kit === 'space') {
      const starPts = [];
      for (let s = 0; s < 180; s++) {
        starPts.push(
          (Math.random() - 0.5) * 140,
          6 + Math.random() * 45,
          20 - Math.random() * (stageCfg.length + 60)
        );
      }
      const ptsGeo = new THREE.BufferGeometry();
      ptsGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPts, 3));
      const ptsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.85, toneMapped: false, fog: false });
      const starField = new THREE.Points(ptsGeo, ptsMat);
      courseGroup.add(starField);
    }
  }

  // --- Build 5-Step 3D Podium Behind the Flag Cup for Sunk Racers ---
  function buildCupPodiumSteps(holeX, holeZ) {
    const podiumColors = [0xfacc15, 0x94a3b8, 0xd97706, 0x64748b, 0x64748b];
    const podiumHeights = [1.2, 0.9, 0.7, 0.45, 0.45];
    const podiumOffsets = [
      { dx: 0, dz: -3.2 },
      { dx: -2.5, dz: -2.7 },
      { dx: 2.5, dz: -2.7 },
      { dx: -4.8, dz: -1.8 },
      { dx: 4.8, dz: -1.8 }
    ];

    gameState.cupPodiumSpots = [];
    podiumOffsets.forEach((off, idx) => {
      const h = podiumHeights[idx];
      const pedGeo = new THREE.CylinderGeometry(0.95, 1.05, h, 16);
      const pedMat = new THREE.MeshLambertMaterial({ color: podiumColors[idx] });
      const ped = new THREE.Mesh(pedGeo, pedMat);
      const px = holeX + off.dx;
      const pz = holeZ + off.dz;
      ped.position.set(px, h / 2, pz);
      ped.castShadow = true;
      ped.receiveShadow = true;
      courseGroup.add(ped);
      gameState.cupPodiumSpots.push({ x: px, y: h + 0.75, z: pz });
    });
  }

  // --- Build 3D Mini-Golf Course for Current Stage ---
  function buildStageCourse(stageIndex) {
    clearConcludeTimer();
    if (!gameState.webglReady || !courseGroup) return;

    disposeTree(courseGroup);
    while (courseGroup.children.length > 0) {
      courseGroup.remove(courseGroup.children[0]);
    }

    gameState.windmills = [];
    gameState.bumpers = [];
    gameState.boostPads = [];
    gameState.starsCoins = [];
    gameState.particles = [];
    gameState.pendingWaveHits = [];
    clearAllParticlesAndRings();

    const stageCfg = STAGES[stageIndex] || STAGES[0];
    gameState.courseLength = stageCfg.length;

    if (currentSkyTex) currentSkyTex.dispose();
    currentSkyTex = createSkyGradientTexture(stageCfg.skyTop, stageCfg.skyHorizon);
    scene.background = currentSkyTex;
    scene.fog.color.setHex(stageCfg.skyHorizon);
    scene.fog.density = stageCfg.fogDensity || 0.0038;

    if (waterMesh && waterMesh.material) {
      waterMesh.material.color.setHex(stageCfg.waterColor);
      waterMesh.material.emissive.setHex(stageCfg.waterEmissive || 0x000000);
    }
    if (hemiLight) {
      hemiLight.color.setHex(stageCfg.hemiSky);
      hemiLight.groundColor.setHex(stageCfg.hemiGround);
    }
    if (dirLight) {
      dirLight.color.setHex(stageCfg.sunColor);
      dirLight.intensity = stageCfg.sunIntensity || 2.5;
    }

    buildContinuousFairwayAndRails(stageCfg);
    buildStageThemedProps(stageCfg);

    const holeZ = -stageCfg.length;
    const holeX = getCourseCenterX(holeZ, stageCfg);
    gameState.holePos = { x: holeX, y: 0, z: holeZ };
    buildCupPodiumSteps(holeX, holeZ);

    const cupRimGeo = new THREE.RingGeometry(1.1, 2.4, 32);
    const cupRimMat = new THREE.MeshBasicMaterial({
      color: 0xffe600,
      side: THREE.DoubleSide,
      fog: false,
      toneMapped: false
    });
    const cupRim = new THREE.Mesh(cupRimGeo, cupRimMat);
    cupRim.rotation.x = -Math.PI / 2;
    cupRim.position.set(holeX, 0.05, holeZ);
    courseGroup.add(cupRim);

    const cupInnerGeo = new THREE.CircleGeometry(1.15, 28);
    const cupInnerMat = new THREE.MeshBasicMaterial({ color: 0x111827, fog: false });
    const cupInner = new THREE.Mesh(cupInnerGeo, cupInnerMat);
    cupInner.rotation.x = -Math.PI / 2;
    cupInner.position.set(holeX, 0.06, holeZ);
    courseGroup.add(cupInner);

    const beaconGeo = new THREE.CylinderGeometry(1.5, 1.5, 13, 24, 1, true);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: 0xffe600,
      transparent: true,
      opacity: 0.24,
      side: THREE.DoubleSide,
      fog: false,
      toneMapped: false
    });
    holeBeaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
    holeBeaconMesh.position.set(holeX, 6.5, holeZ);
    courseGroup.add(holeBeaconMesh);

    flagGroup = new THREE.Group();
    flagGroup.position.set(holeX, 0, holeZ);
    const poleGeo = new THREE.CylinderGeometry(0.14, 0.14, 9.0, 12);
    const poleMat = new THREE.MeshLambertMaterial({ color: 0xffffff, fog: false });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 4.5;
    pole.castShadow = true;
    flagGroup.add(pole);

    const flagGeo = new THREE.ConeGeometry(1.5, 3.0, 3);
    const flagMat = new THREE.MeshBasicMaterial({ color: 0xff2a85, fog: false, toneMapped: false });
    const flagMesh = new THREE.Mesh(flagGeo, flagMat);
    flagMesh.rotation.z = -Math.PI / 2;
    flagMesh.position.set(1.4, 7.8, 0);
    flagMesh.castShadow = true;
    flagGroup.add(flagMesh);
    courseGroup.add(flagGroup);

    for (let w = 0; w < stageCfg.windmills; w++) {
      const frac = (w + 1) / (stageCfg.windmills + 1);
      const wz = -stageCfg.length * (0.20 + frac * 0.60);
      const wx = getCourseCenterX(wz, stageCfg) + (w % 2 === 0 ? -2.2 : 2.2);
      const wy = getCourseElevationY(wz, stageCfg);
      const wm = createWindmillMesh(wx, wy, wz, w, stageCfg);
      courseGroup.add(wm.group);
      gameState.windmills.push(wm);
    }

    for (let b = 0; b < stageCfg.bumpers; b++) {
      const frac = (b + 0.8) / (stageCfg.bumpers + 1);
      const bz = -stageCfg.length * (0.14 + frac * 0.74);
      const offsetSide = ((b % 3) - 1) * 3.1;
      const bx = getCourseCenterX(bz, stageCfg) + offsetSide;
      const by = getCourseElevationY(bz, stageCfg);
      const bumper = createBumperMesh(bx, by, bz, b);
      courseGroup.add(bumper.mesh);
      gameState.bumpers.push(bumper);
    }

    for (let s = 0; s < stageCfg.boosts; s++) {
      const frac = (s + 0.6) / (stageCfg.boosts + 0.8);
      const sz = -stageCfg.length * (0.12 + frac * 0.76);
      const sx = getCourseCenterX(sz, stageCfg) + (s % 2 === 0 ? 2.3 : -2.3);
      const sy = getCourseElevationY(sz, stageCfg);
      const pad = createBoostPadMesh(sx, sy, sz);
      courseGroup.add(pad.mesh);
      gameState.boostPads.push(pad);
    }

    const numStars = 14;
    for (let k = 0; k < numStars; k++) {
      const sz = -10 - (k / numStars) * (stageCfg.length - 16);
      const sx = getCourseCenterX(sz, stageCfg) + Math.sin(k * 1.7) * 3.4;
      const sy = getCourseElevationY(sz, stageCfg);
      const starMesh = new THREE.Mesh(sharedStarGeo, sharedStarMat);
      starMesh.position.set(sx, sy + 0.85, sz);
      starMesh.scale.setScalar(1);
      starMesh.castShadow = true;
      courseGroup.add(starMesh);
      gameState.starsCoins.push({
        mesh: starMesh,
        x: sx,
        y: sy + 0.85,
        z: sz,
        collected: false,
        flying: false,
        flyT: 0,
        startPos: { x: sx, y: sy + 0.85, z: sz }
      });
    }
  }

  function createWindmillMesh(x, y, z, idx, stageCfg) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const towerGeo = new THREE.CylinderGeometry(1.25, 1.75, 6.2, 10);
    const towerMat = new THREE.MeshLambertMaterial({ color: stageCfg.windmillTower || 0xff5277 });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.y = 3.1;
    tower.castShadow = true;
    tower.receiveShadow = true;
    group.add(tower);

    const roofGeo = new THREE.ConeGeometry(1.75, 2.2, 10);
    const roofMat = new THREE.MeshLambertMaterial({ color: stageCfg.windmillRoof || 0xffe600 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 7.2;
    roof.castShadow = true;
    group.add(roof);

    const rotor = new THREE.Group();
    rotor.position.set(0, 3.5, 1.55);
    const bladeGeo = new THREE.BoxGeometry(7.0, 0.82, 0.25);
    const bladeMat = new THREE.MeshLambertMaterial({ color: stageCfg.windmillBlade || 0xffffff });
    const blade1 = new THREE.Mesh(bladeGeo, bladeMat);
    const blade2 = new THREE.Mesh(bladeGeo, bladeMat);
    blade1.castShadow = true;
    blade2.castShadow = true;
    blade2.rotation.z = Math.PI / 2;
    rotor.add(blade1);
    rotor.add(blade2);
    group.add(rotor);

    return {
      group,
      rotor,
      x,
      y,
      z,
      hubY: y + 3.5,
      towerRadius: 1.75,
      bladeZ: z + 1.55,
      bladeSweepRadius: 3.5,
      angle: idx * 0.9,
      speed: (idx % 2 === 0 ? 1 : -1) * (2.2 + idx * 0.25)
    };
  }

  function createBumperMesh(x, y, z, idx) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const baseGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.9, 18);
    const colors = [0xff007f, 0x00f5d4, 0xfee440];
    const cylMat = new THREE.MeshLambertMaterial({
      color: colors[idx % colors.length],
      emissive: colors[idx % colors.length],
      emissiveIntensity: 0.22
    });
    const cyl = new THREE.Mesh(baseGeo, cylMat);
    cyl.position.y = 0.45;
    cyl.castShadow = true;
    cyl.receiveShadow = true;
    group.add(cyl);

    const ringGeo = new THREE.TorusGeometry(1.25, 0.16, 8, 20);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.65;
    group.add(ring);

    return { mesh: group, cylMat, x, y, z, radius: 1.4, pulse: 0 };
  }

  function createBoostPadMesh(x, y, z) {
    const geo = new THREE.BoxGeometry(2.6, 0.14, 4.2);
    const mat = new THREE.MeshLambertMaterial({
      color: 0x00f5d4,
      emissive: 0x00bbf9,
      emissiveIntensity: 0.35
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y + 0.07, z);
    mesh.receiveShadow = true;
    return { mesh, x, y, z, halfW: 1.4, halfL: 2.2 };
  }

  function getStageLineup(playerCritterIdx, stageIdx) {
    const playerCritter = CRITTERS[playerCritterIdx] || CRITTERS[0];
    const otherCritters = CRITTERS.filter((_, idx) => idx !== playerCritterIdx);
    const rivals = [];
    for (let i = 0; i < 4; i++) {
      rivals.push(otherCritters[(stageIdx + i) % otherCritters.length]);
    }
    return [playerCritter, ...rivals];
  }

  function syncRacerGroundShadow(racer, hopHeight) {
    const h = Math.max(0, hopHeight || 0);
    if (racer.shadowDecal) {
      racer.shadowDecal.position.y = -0.71 - h;
      racer.shadowDecal.scale.setScalar(1 / (1 + 0.58 * h));
      if (racer.shadowDecal.material) {
        racer.shadowDecal.material.opacity = 1 - 0.45 * Math.min(1, h);
      }
    }
    if (racer.haloMesh) {
      racer.haloMesh.position.y = -0.68 - h;
    }
  }

  // --- Create 5 Critter Golf Ball Racers ---
  function spawnRacers() {
    if (gameState.racers && gameState.racers.length > 0 && courseGroup) {
      gameState.racers.forEach((oldRacer) => {
        if (oldRacer.mesh) {
          disposeTree(oldRacer.mesh);
          courseGroup.remove(oldRacer.mesh);
        }
      });
    }

    gameState.racers = [];
    gameState.finishOrder = [];

    const lineup = getStageLineup(gameState.selectedCritterIndex, gameState.stageIndex);
    const pinsContainer = document.getElementById('race-pins-container');
    if (pinsContainer) pinsContainer.innerHTML = '';

    lineup.forEach((critter, idx) => {
      const isPlayer = idx === 0;
      const startOffsets = [0, -2.2, 2.2, -4.4, 4.4];
      const startX = startOffsets[idx];
      const startZ = 0;

      const racerGroup = typeof THREE !== 'undefined' ? new THREE.Group() : { position: { x: startX, y: 0.75, z: startZ }, userData: {} };
      let ballMesh = null;
      let sprite = null;
      let shadowDecal = null;
      let haloMesh = null;

      if (gameState.webglReady && courseGroup && typeof THREE !== 'undefined') {
        racerGroup.position.set(startX, 0.75, startZ);

        const shadowPlaneGeo = new THREE.PlaneGeometry(2.1, 2.1);
        const shadowPlaneMat = new THREE.MeshBasicMaterial({
          map: getContactShadowTexture(),
          transparent: true,
          opacity: 1.0,
          depthWrite: false,
          toneMapped: false
        });
        shadowDecal = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
        shadowDecal.rotation.x = -Math.PI / 2;
        shadowDecal.position.y = -0.71;
        racerGroup.add(shadowDecal);

        const ballGeo = new THREE.SphereGeometry(0.75, 24, 24);
        const ballMat = new THREE.MeshStandardMaterial({
          color: critter.color,
          emissive: critter.color,
          emissiveIntensity: 0.16,
          roughness: 0.3,
          metalness: 0.12
        });
        ballMesh = new THREE.Mesh(ballGeo, ballMat);
        ballMesh.castShadow = true;
        ballMesh.receiveShadow = true;
        racerGroup.add(ballMesh);

        const shellGeo = new THREE.SphereGeometry(0.84, 16, 16);
        const shellMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.24,
          wireframe: true
        });
        const shellMesh = new THREE.Mesh(shellGeo, shellMat);
        racerGroup.add(shellMesh);

        const medallionTex = isPlayer
          ? (critterPlayerTextures[critter.id] || critterTextures[critter.id])
          : critterTextures[critter.id];
        const spriteMat = new THREE.SpriteMaterial({
          map: medallionTex,
          color: 0xffffff,
          alphaTest: 0.1,
          toneMapped: false
        });
        sprite = new THREE.Sprite(spriteMat);
        const baseScale = isPlayer ? 2.15 : 1.6;
        sprite.position.set(0, isPlayer ? 1.95 : 1.72, 0);
        sprite.scale.set(baseScale, baseScale, 1);
        sprite.renderOrder = isPlayer ? 10 : (5 - idx);
        racerGroup.add(sprite);

        if (isPlayer) {
          const haloGeo = new THREE.RingGeometry(0.95, 1.35, 32);
          const haloMat = new THREE.MeshBasicMaterial({
            color: 0xffe600,
            side: THREE.DoubleSide,
            toneMapped: false
          });
          haloMesh = new THREE.Mesh(haloGeo, haloMat);
          haloMesh.rotation.x = -Math.PI / 2;
          haloMesh.position.y = -0.68;
          racerGroup.add(haloMesh);

          const funnelGeo = new THREE.RingGeometry(1.15, 1.75, 24);
          const funnelMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.78,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            toneMapped: false
          });
          const vortexFunnel = new THREE.Mesh(funnelGeo, funnelMat);
          vortexFunnel.rotation.x = -Math.PI / 2;
          vortexFunnel.position.y = -0.35;
          vortexFunnel.visible = false;
          racerGroup.add(vortexFunnel);
          haloMesh.userData.vortexFunnel = vortexFunnel;
        }

        courseGroup.add(racerGroup);
      }

      const pin = document.createElement('div');
      pin.className = 'race-pin' + (isPlayer ? ' player-pin' : '');
      const bgUrl = critterMedallionDataURLs[critter.id] || critter.icon;
      pin.style.backgroundImage = `url('${bgUrl}')`;
      pin.style.left = '0%';
      if (pinsContainer) pinsContainer.appendChild(pin);

      const slotPaces = [1.0, 0.96, 0.90, 0.84, 0.77];
      const lanePrefs = [0.0, -2.4, 2.2, -1.2, 1.5];

      gameState.racers.push({
        id: critter.id,
        critter,
        isPlayer,
        slotIdx: idx,
        slotPace: slotPaces[idx] || 0.85,
        lanePref: lanePrefs[idx] || 0.0,
        rubberMult: 1.0,
        cdMult: 1.0,
        mass: critter.id === 'bubba' ? 1.8 : 1.0,
        mesh: racerGroup,
        ballMesh,
        sprite,
        shadowDecal,
        haloMesh,
        haloRing: haloMesh,
        pinEl: pin,
        vx: 0,
        vy: 0,
        vz: 0,
        hopY: 0,
        squashTimer: 0,
        puttCooldown: isPlayer ? 0.38 : (0.62 + idx * 0.22),
        lastHitSfxTime: -1,
        activeBoostPad: -1,
        strokes: 0,
        progress: 0,
        finished: false,
        finishTime: null,
        cupAnim: null,
        rank: idx + 1,
        vortexTimer: 0,
        rocketTimer: 0,
        bumpTimer: 0,
        trailEmitAccum: 0
      });
    });

    camBase.x = 0;
    camBase.y = 11.0;
    camBase.z = 14.8;
  }

  // --- Launch a Putt Impulse for a Racer ---
  function executePutt(racer, angle, powerFrac, isManualOrPedal = false, setPuttCooldown = true) {
    if (!racer || racer.finished || gameState.mode !== 'playing') return;

    const stageDiff = Math.max(0, Math.min(1, (gameState.stageIndex || 0) / 7));
    const slotPace = racer.slotPace || 1.0;
    const rubberMult = racer.rubberMult || 1.0;
    const cdMult = racer.cdMult || 1.0;

    // Stage 1 (stageDiff=0) AI base impulse starts at 14.5 and scales up to 20.6 on Stage 8; player auto-putt is 20.5
    const aiBaseImpulse = (14.5 + 6.1 * stageDiff) * slotPace * rubberMult * racer.critter.speedBias;
    const baseImpulse = racer.isPlayer
      ? (isManualOrPedal ? 26.5 : 20.5) * racer.critter.speedBias
      : aiBaseImpulse;
    const feverMult = (racer.isPlayer && gameState.rainbowFeverTimer > 0) ? 1.38 : 1.0;
    const speed = baseImpulse * (0.55 + 0.55 * powerFrac) * feverMult;

    racer.vx += Math.sin(angle) * speed;
    racer.vz += -Math.cos(angle) * speed;
    racer.strokes++;

    const aiBaseCD = (1.45 - 0.53 * stageDiff) / Math.max(0.75, slotPace);
    racer.puttCooldown = racer.isPlayer
      ? (isManualOrPedal ? 0.65 : 1.18)
      : (aiBaseCD * cdMult + Math.random() * 0.22);

    if (racer.isPlayer) {
      if (isManualOrPedal && setPuttCooldown) {
        gameState.cooldowns.putt = 0.65;
        showVisualCallout('🏌️⛳✨');
      }
      sfx.playPutt();
      addRainbowCharge(isManualOrPedal ? 18 : 8);
      spawnBurstParticles(racer.mesh.position.x, racer.mesh.position.y, racer.mesh.position.z, 0xffe600, 8, Math.sin(angle), 0.3, -Math.cos(angle));
    }

    const isPlayerFever = racer.isPlayer && gameState.rainbowFeverTimer > 0;
    const aiMaxV = (22 + 7 * stageDiff) * slotPace;
    const maxV = isPlayerFever ? 44 : (racer.rocketTimer > 0 ? 42 : (racer.isPlayer ? 35 : aiMaxV));
    const mag = Math.hypot(racer.vx, racer.vz);
    if (mag > maxV) {
      racer.vx = (racer.vx / mag) * maxV;
      racer.vz = (racer.vz / mag) * maxV;
    }
  }

  // --- Nudge Player Aim Left / Right (Touch Buttons or Arrow Keys) ---
  function nudgePlayerAim(deltaRad) {
    if (gameState.mode !== 'playing') return;
    gameState.aimAngle = Math.max(-0.85, Math.min(0.85, gameState.aimAngle + deltaRad));
    gameState.manualAimLockTimer = 2.2;
    const player = gameState.racers[0];
    if (player && !player.finished) {
      player.vx += deltaRad * 18.0;
    }
    sfx.playClack(0.5);
  }
  window.nudgePlayerAim = nudgePlayerAim;

  // --- 4 Giant Cockpit Pedals (`putt`, `vortex`, `rocket`, `bump`) ---
  function triggerPowerPedal(type) {
    if (gameState.mode !== 'playing') return;
    const player = gameState.racers[0];
    if (!player || player.finished) return;

    if (gameState.cooldowns[type] > 0) {
      // Visual shake + audio feedback when tapped while on cooldown
      const btn = document.getElementById(`pedal-${type}`);
      if (btn) {
        btn.classList.remove('cooldown-shake');
        void btn.offsetWidth;
        btn.classList.add('cooldown-shake');
      }
      sfx.playCooldownBoop();
      return;
    }

    const stageCfg = STAGES[gameState.stageIndex] || STAGES[0];
    const critterId = player.critter.id;
    const pos = player.mesh.position;
    const groundY = getCourseElevationY(pos.z, stageCfg);

    if (type === 'putt') {
      executePutt(player, gameState.aimAngle, Math.max(0.85, gameState.aimPower), true, true);
      spawnShockwaveRing(pos.x, groundY, pos.z, 3.2, 0x4ade80, 0.36);
      return;
    }

    if (type === 'vortex') {
      gameState.cooldowns.vortex = 4.0;
      player.vortexTimer = critterId === 'catnap' ? 3.5 : 2.6;
      sfx.playVortex();
      showVisualCallout('🌪️🧲🕳️');
      addRainbowCharge(24);
      spawnShockwaveRing(pos.x, groundY, pos.z, 5.5, 0x38bdf8, 0.48);
      spawnBurstParticles(pos.x, pos.y + 0.3, pos.z, 0x38bdf8, 14);
    } else if (type === 'rocket') {
      gameState.cooldowns.rocket = 3.5;
      player.rocketTimer = critterId === 'dogday' ? 2.75 : 2.2;
      const targetZ = Math.max(-stageCfg.length, pos.z - 18);
      const targetX = getCourseCenterX(targetZ, stageCfg);
      const ang = Math.atan2(targetX - pos.x, -(targetZ - pos.z));
      gameState.aimAngle = ang;
      player.vz -= 11.5;
      // Pass setPuttCooldown = false so Rocket Putt never puts Quick Putt (#pedal-putt) on cooldown
      executePutt(player, ang, 1.0, true, false);
      triggerFovKick(6.5);
      addTrauma(0.25);
      sfx.playRocket();
      showVisualCallout('⚡🚀⛳');
      addRainbowCharge(28);
      spawnShockwaveRing(pos.x, groundY, pos.z, 4.5, 0xfacc15, 0.42);
      spawnBurstParticles(pos.x, pos.y + 0.3, pos.z, 0xfacc15, 16, 0, 0.4, 1);
    } else if (type === 'bump') {
      gameState.cooldowns.bump = 4.5;
      player.bumpTimer = 0.55;
      const bumpRadius = critterId === 'bobby' ? 32 : 24;
      sfx.playBumpWave();
      showVisualCallout('💥🌊🎱');
      addRainbowCharge(24);
      addTrauma(0.45);

      spawnShockwaveRing(pos.x, groundY, pos.z, bumpRadius, 0xf472b6, 0.52);
      spawnBurstParticles(pos.x, pos.y + 0.3, pos.z, 0xf472b6, 16);

      player.vy = Math.max(player.vy, 5.5);
      player.vz -= critterId === 'bobby' ? 11.0 : 8.5;
      const maxV = (gameState.rainbowFeverTimer > 0) ? 44 : (player.rocketTimer > 0 ? 42 : 35);
      const mag = Math.hypot(player.vx, player.vz);
      if (mag > maxV) {
        player.vx = (player.vx / mag) * maxV;
        player.vz = (player.vz / mag) * maxV;
      }

      const waveOriginX = pos.x;
      const waveOriginZ = pos.z;
      gameState.racers.forEach((other, idx) => {
        if (idx === 0 || other.finished) return;
        const dx = other.mesh.position.x - waveOriginX;
        const dz = other.mesh.position.z - waveOriginZ;
        const d = Math.hypot(dx, dz);
        if (d < bumpRadius) {
          const delay = (d / bumpRadius) * 0.32;
          gameState.pendingWaveHits.push({
            racer: other,
            originX: waveOriginX,
            originZ: waveOriginZ,
            radius: bumpRadius,
            timer: delay
          });
        }
      });
    }
  }
  window.triggerPowerPedal = triggerPowerPedal;

  function addRainbowCharge(amount) {
    if (gameState.rainbowFeverTimer > 0) return;
    const player = gameState.racers[0];
    const perkMult = (player && player.critter.id === 'craftycorn') ? 1.35 : 1.0;
    gameState.rainbowCharge = Math.min(100, gameState.rainbowCharge + amount * perkMult);
    if (gameState.rainbowCharge >= 100) {
      gameState.rainbowCharge = 0;
      gameState.rainbowFeverTimer = 5.5;
      addTrauma(0.40);
      triggerFovKick(5.5);
      showVisualCallout('🌈⚡🔥');
      sfx.playRainbowFever();
      if (player && player.mesh) {
        const stageCfg = STAGES[gameState.stageIndex] || STAGES[0];
        const gy = getCourseElevationY(player.mesh.position.z, stageCfg);
        spawnShockwaveRing(player.mesh.position.x, gy, player.mesh.position.z, 6.2, 0xf72585, 0.55);
      }
    }
  }

  function pulseRainbowGaugeDOM() {
    const wrap = document.getElementById('rainbow-gauge-wrap');
    if (!wrap) return;
    wrap.style.transition = 'transform 0.14s ease';
    wrap.style.transform = 'scale(1.18)';
    setTimeout(() => {
      wrap.style.transform = '';
    }, 150);
  }

  function flyStarToRainbowGaugeDOM(worldX, worldY, worldZ) {
    if (!camera) return;
    const gaugeEl = document.getElementById('rainbow-gauge-wrap');
    if (!gaugeEl) return;
    const v = new THREE.Vector3(worldX, worldY, worldZ).project(camera);
    const startX = (v.x * 0.5 + 0.5) * window.innerWidth;
    const startY = (-v.y * 0.5 + 0.5) * window.innerHeight;
    const rect = gaugeEl.getBoundingClientRect();
    const endX = rect.left + rect.width * 0.5;
    const endY = rect.top + rect.height * 0.5;

    const flyer = document.createElement('div');
    flyer.className = 'flying-star-coin';
    flyer.textContent = '⭐';
    flyer.style.cssText = `
      position: fixed;
      left: ${startX}px;
      top: ${startY}px;
      font-size: 28px;
      pointer-events: none;
      z-index: 25;
      transform: translate(-50%, -50%) scale(1.2);
      transition: left 0.42s cubic-bezier(0.2, 0.8, 0.2, 1), top 0.42s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.42s ease;
    `;
    document.body.appendChild(flyer);
    requestAnimationFrame(() => {
      flyer.style.left = `${endX}px`;
      flyer.style.top = `${endY}px`;
      flyer.style.transform = 'translate(-50%, -50%) scale(0.4) rotate(180deg)';
    });
    setTimeout(() => {
      if (flyer.parentNode) flyer.parentNode.removeChild(flyer);
    }, 440);
  }

  let calloutTimeout = null;
  function showVisualCallout(emojis) {
    const el = document.getElementById('visual-callout');
    if (!el) return;
    el.textContent = emojis;
    el.classList.remove('hidden');
    if (calloutTimeout) clearTimeout(calloutTimeout);
    calloutTimeout = setTimeout(() => {
      el.classList.add('hidden');
    }, 900);
  }

  // --- Single-Draw-Call Instanced Particle System ---
  function clearAllParticlesAndRings() {
    gameState.particles = [];
    if (particleInstancedMesh && typeof THREE !== 'undefined') {
      const zeroMat = new THREE.Matrix4().makeScale(0, 0, 0);
      for (let i = 0; i < MAX_PARTICLES; i++) {
        particleInstancedMesh.setMatrixAt(i, zeroMat);
      }
      particleInstancedMesh.instanceMatrix.needsUpdate = true;
    }
    shockwavePool.forEach((s) => {
      s.active = false;
      if (s.mesh) s.mesh.visible = false;
    });
    document.querySelectorAll('.flying-star-coin').forEach((el) => {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
  }

  function spawnBurstParticles(x, y, z, colorHex, count = 10, dirX = 0, dirY = 0, dirZ = 0) {
    if (!gameState.webglReady || !particleInstancedMesh) return;
    const hasDir = Math.hypot(dirX, dirY, dirZ) > 0.05;
    for (let i = 0; i < count; i++) {
      if (gameState.particles.length >= MAX_PARTICLES) {
        gameState.particles.shift();
      }
      let vx, vy, vz;
      if (hasDir) {
        const spread = 0.85;
        vx = dirX * (5 + Math.random() * 6) + (Math.random() - 0.5) * 6 * spread;
        vy = Math.max(2.5, dirY * 5 + 2.5 + Math.random() * 4.5);
        vz = dirZ * (5 + Math.random() * 6) + (Math.random() - 0.5) * 6 * spread;
      } else {
        const ang = (i / count) * Math.PI * 2 + Math.random() * 0.3;
        const spd = 3 + Math.random() * 5.5;
        vx = Math.cos(ang) * spd;
        vy = 3.5 + Math.random() * 5.0;
        vz = Math.sin(ang) * spd;
      }
      gameState.particles.push({
        x, y, z,
        vx, vy, vz,
        color: colorHex,
        life: 0.52,
        maxLife: 0.52
      });
    }
  }

  function updateInstancedParticles(dt) {
    if (!particleInstancedMesh || typeof THREE === 'undefined') return;
    const dummy = new THREE.Object3D();
    const colObj = new THREE.Color();
    const zeroMat = new THREE.Matrix4().makeScale(0, 0, 0);

    for (let i = gameState.particles.length - 1; i >= 0; i--) {
      const p = gameState.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        gameState.particles.splice(i, 1);
      } else {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;
        p.vy -= 14.0 * dt;
      }
    }

    for (let slot = 0; slot < MAX_PARTICLES; slot++) {
      if (slot < gameState.particles.length) {
        const p = gameState.particles[slot];
        dummy.position.set(p.x, p.y, p.z);
        const s = Math.max(0.12, (p.life / p.maxLife) * 1.45);
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        particleInstancedMesh.setMatrixAt(slot, dummy.matrix);
        colObj.setHex(p.color);
        particleInstancedMesh.setColorAt(slot, colObj);
      } else {
        particleInstancedMesh.setMatrixAt(slot, zeroMat);
      }
    }
    particleInstancedMesh.instanceMatrix.needsUpdate = true;
    if (particleInstancedMesh.instanceColor) particleInstancedMesh.instanceColor.needsUpdate = true;
  }

  function distPointToSegment2D(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    if (lenSq < 1e-6) return Math.hypot(px - x1, py - y1);
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }

  // --- Single Physics Substep Integration & Collision Solver ---
  function stepRacersSubstep(subDt, stageCfg) {
    const player = gameState.racers[0];
    const stageDiff = Math.max(0, Math.min(1, (gameState.stageIndex || 0) / 7));

    gameState.racers.forEach((racer) => {
      if (racer.finished) return;

      const pos = racer.mesh.position;
      const isPlayerFever = racer.isPlayer && gameState.rainbowFeverTimer > 0;

      if (racer.vortexTimer > 0) {
        const distToHole = Math.hypot(gameState.holePos.x - pos.x, gameState.holePos.z - pos.z);
        const guideZ = distToHole < 26 ? gameState.holePos.z : Math.max(-stageCfg.length, pos.z - 18);
        const guideX = distToHole < 26 ? gameState.holePos.x : getCourseCenterX(guideZ, stageCfg);
        const pullAngle = Math.atan2(guideX - pos.x, guideZ - pos.z);
        racer.vx += Math.sin(pullAngle) * 28 * subDt;
        racer.vz += Math.cos(pullAngle) * 28 * subDt;
      }

      if (racer.rocketTimer > 0) {
        racer.vz -= 16 * subDt;
      }

      if (isPlayerFever) {
        const feverLookZ = Math.max(-stageCfg.length, pos.z - 16);
        const feverCenterX = getCourseCenterX(feverLookZ, stageCfg);
        racer.vx += (feverCenterX - pos.x) * 3.5 * subDt;
        racer.vz -= 14 * subDt;
      }

      const aiMaxV = (22 + 7 * stageDiff) * (racer.slotPace || 1.0);
      const maxV = isPlayerFever ? 44 : (racer.rocketTimer > 0 ? 42 : (racer.isPlayer ? 35 : aiMaxV));
      const speedMag = Math.hypot(racer.vx, racer.vz);
      if (speedMag > maxV) {
        racer.vx = (racer.vx / speedMag) * maxV;
        racer.vz = (racer.vz / speedMag) * maxV;
      }

      // Kid-friendly green hesitation on early stages so the player can overtake near the cup
      if (!racer.isPlayer && player && !player.finished && racer.progress > 0.76 && racer.progress >= player.progress - 0.03) {
        const greenBrake = gameState.stageIndex === 0 ? 0.12 : (gameState.stageIndex <= 2 ? 0.25 : 0.65);
        racer.vx *= Math.pow(greenBrake, subDt);
        racer.vz *= Math.pow(greenBrake, subDt);
      }

      pos.x += racer.vx * subDt;
      pos.z += racer.vz * subDt;

      const wasAirborne = racer.hopY > 0.04;
      racer.hopY += racer.vy * subDt;
      racer.vy -= 32.0 * subDt;
      const groundY = getCourseElevationY(pos.z, stageCfg);

      if (racer.hopY <= 0) {
        if (wasAirborne && racer.vy < -2.2) {
          racer.squashTimer = 0.14;
          spawnBurstParticles(pos.x, groundY + 0.15, pos.z, 0xffffff, 5, 0, 1, 0);
        }
        racer.hopY = 0;
        racer.vy = 0;
      }
      pos.y = groundY + 0.75 + racer.hopY;
      syncRacerGroundShadow(racer, racer.hopY);

      if (racer.ballMesh) {
        racer.ballMesh.rotation.x += (racer.vz * subDt) * 1.2;
        racer.ballMesh.rotation.z -= (racer.vx * subDt) * 1.2;
      }

      const damping = Math.pow(0.42, subDt);
      racer.vx *= damping;
      racer.vz *= damping;

      const centerX = getCourseCenterX(pos.z, stageCfg);
      const halfW = getCourseHalfWidth(pos.z, stageCfg) - 0.80;
      const offsetX = pos.x - centerX;
      if (offsetX < -halfW) {
        pos.x = centerX - halfW;
        racer.vx = Math.abs(racer.vx) * 0.78 + 2.5;
      } else if (offsetX > halfW) {
        pos.x = centerX + halfW;
        racer.vx = -Math.abs(racer.vx) * 0.78 - 2.5;
      }

      if (pos.z > 4) {
        pos.z = 4;
        racer.vz = -Math.abs(racer.vz);
      }
      const backWallZ = -stageCfg.length - 6.2;
      if (pos.z < backWallZ) {
        pos.z = backWallZ;
        racer.vz = Math.abs(racer.vz) * 0.75 + 3.0;
      }

      // Windmill Tower Reflection & 4-Blade Segment Collision
      gameState.windmills.forEach((wm) => {
        const dx = pos.x - wm.x;
        const dz = pos.z - wm.z;
        const dTower = Math.hypot(dx, dz);
        const minTowerDist = wm.towerRadius + 0.75;

        if (dTower < minTowerDist) {
          const nx = dx / (dTower || 1);
          const nz = dz / (dTower || 1);
          pos.x = wm.x + nx * (minTowerDist + 0.04);
          pos.z = wm.z + nz * (minTowerDist + 0.04);

          const vn = racer.vx * nx + racer.vz * nz;
          if (vn < 0) {
            racer.vx -= 1.65 * vn * nx;
            racer.vz -= 1.65 * vn * nz;
            const pushSide = dx >= 0 ? 1 : -1;
            racer.vx += pushSide * 3.5;
          }

          if (gameState.elapsed - racer.lastHitSfxTime > 0.16) {
            racer.lastHitSfxTime = gameState.elapsed;
            if (racer.isPlayer) {
              sfx.playBumper(1.0);
              addTrauma(0.30);
            } else if (player && Math.abs(pos.z - player.mesh.position.z) < 30) {
              sfx.playBumper(0.35);
            }
            spawnShockwaveRing(wm.x, wm.y, wm.z, 3.5, 0xff5277, 0.40);
            spawnBurstParticles(pos.x, pos.y, pos.z, 0xff5277, 8, nx, 0.5, nz);
          }
        }

        const dzBlade = Math.abs(pos.z - wm.bladeZ);
        if (dzBlade < 0.88 && Math.abs(dx) < wm.bladeSweepRadius + 0.75) {
          let hitBlade = false;
          for (let k = 0; k < 4; k++) {
            const theta = wm.angle + k * (Math.PI / 2);
            const tipX = wm.x + Math.cos(theta) * wm.bladeSweepRadius;
            const tipY = wm.hubY + Math.sin(theta) * wm.bladeSweepRadius;
            const distSeg = distPointToSegment2D(pos.x, pos.y, wm.x, wm.hubY, tipX, tipY);
            if (distSeg < 1.15) {
              hitBlade = true;
              break;
            }
          }
          if (hitBlade && racer.critter.id !== 'bubba' && racer.rocketTimer <= 0 && racer.vortexTimer <= 0 && !isPlayerFever) {
            const sweepDir = wm.speed >= 0 ? 1 : -1;
            racer.vx += sweepDir * 11.5;
            racer.vz = Math.max(5.5, Math.abs(racer.vz) * 0.55);
            racer.vy = Math.max(racer.vy, 5.2);
            pos.z = wm.bladeZ + 0.94;
            if (gameState.elapsed - racer.lastHitSfxTime > 0.16) {
              racer.lastHitSfxTime = gameState.elapsed;
              if (racer.isPlayer) {
                sfx.playBumper(1.0);
                addTrauma(0.30);
              } else if (player && Math.abs(pos.z - player.mesh.position.z) < 30) {
                sfx.playBumper(0.35);
              }
              spawnShockwaveRing(pos.x, wm.y, wm.bladeZ, 3.5, 0xffe600, 0.42);
              spawnBurstParticles(pos.x, pos.y, pos.z, 0xffe600, 10, sweepDir, 0.6, 1);
            }
          }
        }
      });

      // Bouncy Bumper Pads Interaction
      gameState.bumpers.forEach((b) => {
        const dx = pos.x - b.x;
        const dz = pos.z - b.z;
        const d = Math.hypot(dx, dz);
        if (d < b.radius + 0.75) {
          const nx = dx / (d || 1);
          const nz = dz / (d || 1);
          pos.x = b.x + nx * (b.radius + 0.8);
          pos.z = b.z + nz * (b.radius + 0.8);
          const bounceMult = racer.critter.id === 'picky' ? 1.45 : 1.0;
          racer.vx = nx * 13;
          racer.vz = Math.min(-9 * bounceMult, (nz * 14 - 6) * bounceMult);
          racer.vy = Math.max(racer.vy, racer.critter.id === 'picky' ? 8.2 : 6.5);
          b.pulse = 1.0;

          if (gameState.elapsed - racer.lastHitSfxTime > 0.15) {
            racer.lastHitSfxTime = gameState.elapsed;
            spawnShockwaveRing(b.x, b.y, b.z, 3.5, 0x00f5d4, 0.42);
            spawnBurstParticles(pos.x, pos.y, pos.z, 0x00f5d4, 10, nx, 0.5, nz);
            if (racer.isPlayer) {
              sfx.playBumper(1.0);
              addTrauma(0.22);
              addRainbowCharge(racer.critter.id === 'picky' ? 16 : 10);
            } else if (player && Math.abs(pos.z - player.mesh.position.z) < 30) {
              sfx.playBumper(0.35);
            }
          }
        }
      });

      // Frame-Rate Independent Boost Pads
      let currentPadIdx = -1;
      for (let pIdx = 0; pIdx < gameState.boostPads.length; pIdx++) {
        const pad = gameState.boostPads[pIdx];
        if (Math.abs(pos.x - pad.x) < pad.halfW + 0.6 && Math.abs(pos.z - pad.z) < pad.halfL + 0.6) {
          currentPadIdx = pIdx;
          const { tx, tz } = getCourseTangentNormal(pos.z, stageCfg);
          if (racer.activeBoostPad !== pIdx) {
            racer.activeBoostPad = pIdx;
            racer.vx += tx * 10.5;
            racer.vz += tz * 10.5;
            if (racer.isPlayer) {
              sfx.playBoost();
              addRainbowCharge(12);
              triggerFovKick(6.0);
              spawnBurstParticles(pos.x, pos.y, pos.z, 0x00f5d4, 10, -tx, 0.3, -tz);
            }
          }
          racer.vx += tx * 18.0 * subDt;
          racer.vz += tz * 18.0 * subDt;
          break;
        }
      }
      if (currentPadIdx === -1) {
        racer.activeBoostPad = -1;
      }

      // Collectible Star Gems (widened magnet radius during Rainbow Fever or for KickinChicken)
      if (racer.isPlayer) {
        const starRadius = isPlayerFever ? 5.2 : (racer.critter.id === 'kickin' ? 3.8 : 1.75);
        gameState.starsCoins.forEach((st) => {
          if (!st.collected && Math.hypot(pos.x - st.x, pos.z - st.z) < starRadius) {
            st.collected = true;
            st.flying = true;
            st.flyT = 0;
            st.startPos = { x: st.x, y: st.y, z: st.z };
            sfx.playStarCollect();
            spawnBurstParticles(st.x, st.y, st.z, 0xffe600, 8, 0, 1, 0);
            flyStarToRainbowGaugeDOM(st.x, st.y, st.z);
          }
        });
      }

      // Cup Capture Gravity Well Near the Hole (Player gets strong 8u magnet; AI scales with stage & hesitates on Stage 1-2 if player hasn't finished)
      const dxHole = gameState.holePos.x - pos.x;
      const dzHole = gameState.holePos.z - pos.z;
      const distHole = Math.hypot(dxHole, dzHole);

      if (distHole < 8.0) {
        const pullStr = racer.isPlayer ? 36 : (16 + 14 * stageDiff);
        racer.vx += (dxHole / (distHole || 1)) * pullStr * subDt;
        racer.vz += (dzHole / (distHole || 1)) * pullStr * subDt;
      }

      const sinkRadius = racer.isPlayer ? 1.92 : (1.45 + 0.32 * stageDiff);
      const allowAiSink = racer.isPlayer || !player || player.finished || gameState.stageIndex >= 1 || gameState.elapsed > 24.0;
      if (distHole < sinkRadius && racer.hopY < 1.2 && allowAiSink) {
        sinkRacerIntoCup(racer);
      }

      racer.progress = Math.min(1, Math.max(0, -pos.z / stageCfg.length));
    });

    // Racer-to-Racer Elastic Billiard Momentum Exchange
    for (let i = 0; i < gameState.racers.length; i++) {
      for (let j = i + 1; j < gameState.racers.length; j++) {
        const a = gameState.racers[i];
        const b = gameState.racers[j];
        if (a.finished || b.finished) continue;
        const dx = b.mesh.position.x - a.mesh.position.x;
        const dz = b.mesh.position.z - a.mesh.position.z;
        const dist = Math.hypot(dx, dz);
        if (dist > 0.001 && dist < 1.5) {
          const nx = dx / dist;
          const nz = dz / dist;
          const invMa = 1 / (a.mass || 1.0);
          const invMb = 1 / (b.mass || 1.0);
          const invSum = invMa + invMb;

          const overlap = 1.5 - dist;
          a.mesh.position.x -= nx * overlap * (invMa / invSum);
          a.mesh.position.z -= nz * overlap * (invMa / invSum);
          b.mesh.position.x += nx * overlap * (invMb / invSum);
          b.mesh.position.z += nz * overlap * (invMb / invSum);

          const vRel = (b.vx - a.vx) * nx + (b.vz - a.vz) * nz;
          if (vRel < 0) {
            const restitution = 0.82;
            const jImp = -(1 + restitution) * vRel / invSum;
            a.vx -= (jImp * nx) * invMa;
            a.vz -= (jImp * nz) * invMa;
            b.vx += (jImp * nx) * invMb;
            b.vz += (jImp * nz) * invMb;

            const impactSpeed = Math.abs(vRel);
            if (impactSpeed >= 8.0) {
              a.vy = Math.max(a.vy, 2.6 * invMa);
              b.vy = Math.max(b.vy, 2.6 * invMb);
            }
            if (impactSpeed > 4.0) {
              const midX = (a.mesh.position.x + b.mesh.position.x) * 0.5;
              const midY = (a.mesh.position.y + b.mesh.position.y) * 0.5;
              const midZ = (a.mesh.position.z + b.mesh.position.z) * 0.5;
              spawnBurstParticles(midX, midY, midZ, 0xffffff, 7, nx, 0.6, nz);
              if (a.isPlayer || b.isPlayer) {
                sfx.playClack(1.0);
                addTrauma(Math.min(0.35, 0.1 * (impactSpeed / 10)));
              } else if (player && Math.abs(midZ - player.mesh.position.z) < 28) {
                sfx.playClack(0.35);
              }
            }
          }
        }
      }
    }
  }

  // --- Main Physics & Course Update Loop ---
  function updateGamePhysics(dt) {
    gameState.elapsed += dt;
    const stageCfg = STAGES[gameState.stageIndex] || STAGES[0];
    const stageDiff = Math.max(0, Math.min(1, (gameState.stageIndex || 0) / 7));

    if (gameState.trauma > 0) {
      gameState.trauma = Math.max(0, gameState.trauma - 1.5 * dt);
    }
    if (gameState.fovTarget > 0) {
      gameState.fovKick += (gameState.fovTarget - gameState.fovKick) * Math.min(1, dt * 16);
      if (Math.abs(gameState.fovTarget - gameState.fovKick) < 0.25) {
        gameState.fovTarget = 0;
      }
    } else if (gameState.fovKick > 0.01) {
      gameState.fovKick = Math.max(0, gameState.fovKick - 12.0 * dt);
    }
    if (camera) {
      const desiredFov = 52 + gameState.fovKick;
      if (Math.abs(camera.fov - desiredFov) > 0.02) {
        camera.fov = desiredFov;
        camera.updateProjectionMatrix();
      }
    }

    // Power pedal cooldown recovery (2.0x faster during Rainbow Fever!)
    const cdRate = gameState.rainbowFeverTimer > 0 ? 2.0 : 1.0;
    ['putt', 'vortex', 'rocket', 'bump'].forEach((k) => {
      if (gameState.cooldowns[k] > 0) {
        gameState.cooldowns[k] = Math.max(0, gameState.cooldowns[k] - dt * cdRate);
      }
    });
    if (gameState.rainbowFeverTimer > 0) {
      gameState.rainbowFeverTimer = Math.max(0, gameState.rainbowFeverTimer - dt);
    }
    if (gameState.manualAimLockTimer > 0) {
      gameState.manualAimLockTimer = Math.max(0, gameState.manualAimLockTimer - dt);
    }

    // Delayed Radial 💥 Bump Wave Hits — knocks rivals laterally + strictly backward (+Z away from hole)
    for (let i = gameState.pendingWaveHits.length - 1; i >= 0; i--) {
      const hit = gameState.pendingWaveHits[i];
      hit.timer -= dt;
      if (hit.timer <= 0) {
        gameState.pendingWaveHits.splice(i, 1);
        const r = hit.racer;
        if (r && !r.finished) {
          const dx = r.mesh.position.x - hit.originX;
          const dz = r.mesh.position.z - hit.originZ;
          const d = Math.hypot(dx, dz);
          const rx = d > 0.15 ? dx / d : (Math.random() < 0.5 ? -1 : 1);
          const k = Math.max(0.15, 1 - Math.min(1, d / hit.radius));
          const mScale = r.critter.id === 'bubba' ? 0.35 : 1.0;
          r.vx += rx * (6.5 + 12.5 * k) * mScale;
          r.vz = Math.max(r.vz, (5.5 + 8.5 * k) * mScale);
          r.vy = Math.max(r.vy, (4.0 + 4.0 * k) * mScale);
          const rGroundY = getCourseElevationY(r.mesh.position.z, stageCfg);
          spawnShockwaveRing(r.mesh.position.x, rGroundY, r.mesh.position.z, 3.2, 0xf472b6, 0.38);
          spawnBurstParticles(r.mesh.position.x, r.mesh.position.y, r.mesh.position.z, 0xf472b6, 9, rx, 0.6, 1.0);
        }
      }
    }

    gameState.windmills.forEach((wm) => {
      wm.angle += wm.speed * dt;
      wm.rotor.rotation.z = wm.angle;
    });

    gameState.bumpers.forEach((b) => {
      if (b.pulse > 0) {
        b.pulse = Math.max(0, b.pulse - 4.0 * dt);
        const elastic = Math.sin(b.pulse * Math.PI) * (1 + 0.3 * b.pulse);
        b.mesh.scale.setScalar(1 + 0.35 * elastic);
        if (b.cylMat) {
          b.cylMat.emissiveIntensity = 0.22 + 1.2 * b.pulse;
        }
      }
    });

    const player = gameState.racers[0];
    gameState.starsCoins.forEach((st) => {
      if (!st.collected) {
        st.mesh.rotation.y += dt * 3.0;
      } else if (st.flying) {
        st.flyT += dt / 0.45;
        const u = Math.min(1, st.flyT);
        const pPos = player ? player.mesh.position : st.startPos;
        const p0x = st.startPos.x, p0y = st.startPos.y, p0z = st.startPos.z;
        const p2x = pPos.x, p2y = pPos.y + 2.0, p2z = pPos.z;
        const p1x = (p0x + p2x) * 0.5;
        const p1y = Math.max(p0y, p2y) + 3.8;
        const p1z = (p0z + p2z) * 0.5;

        const inv = 1 - u;
        st.mesh.position.set(
          inv * inv * p0x + 2 * inv * u * p1x + u * u * p2x,
          inv * inv * p0y + 2 * inv * u * p1y + u * u * p2y,
          inv * inv * p0z + 2 * inv * u * p1z + u * u * p2z
        );
        st.mesh.rotation.y += dt * 18.0;
        st.mesh.scale.setScalar(Math.max(0.15, 1.15 - 0.9 * u));

        if (u >= 1) {
          st.flying = false;
          st.mesh.visible = false;
          st.mesh.scale.setScalar(1);
          addRainbowCharge(15);
          pulseRainbowGaugeDOM();
        }
      }
    });

    if (holeBeaconMesh) {
      holeBeaconMesh.scale.setScalar(1 + Math.sin(gameState.elapsed * 5) * 0.12);
    }

    if (!gameState.isDraggingAim && player && !player.finished) {
      if (gameState.manualAimLockTimer <= 0) {
        const lookAheadZ = Math.max(-stageCfg.length, player.mesh.position.z - 16);
        const lookAheadX = getCourseCenterX(lookAheadZ, stageCfg);
        const desiredAngle = Math.atan2(lookAheadX - player.mesh.position.x, -(lookAheadZ - player.mesh.position.z));
        gameState.aimAngle += (desiredAngle - gameState.aimAngle) * Math.min(1, dt * 6);
      }
      gameState.aimPower = 0.72 + Math.sin(gameState.elapsed * 3.8) * 0.22;
    }

    let maxSpeed = 10;
    const RAINBOW_COLORS = [0xff3b3b, 0xff9f1c, 0xffe600, 0x2ec4b6, 0xa855f7, 0xf72585];
    gameState.racers.forEach((racer, idx) => {
      if (racer.finished) {
        if (racer.cupAnim && !racer.cupAnim.done) {
          racer.cupAnim.t += dt;
          const t = racer.cupAnim.t;
          const spot = racer.cupAnim.spot;
          if (t < 0.25) {
            const u = t / 0.25;
            racer.mesh.position.set(
              gameState.holePos.x + Math.cos(u * Math.PI * 3) * (1 - u) * 0.7,
              0.75 * (1 - u) - 0.35 * u,
              gameState.holePos.z + Math.sin(u * Math.PI * 3) * (1 - u) * 0.7
            );
            if (racer.ballMesh) racer.ballMesh.scale.setScalar(1 - 0.45 * u);
            syncRacerGroundShadow(racer, 0);
          } else if (t < 0.68) {
            const u = (t - 0.25) / 0.43;
            const arcH = Math.sin(u * Math.PI) * 2.8;
            racer.mesh.position.set(
              gameState.holePos.x + (spot.x - gameState.holePos.x) * u,
              (-0.35 * (1 - u) + spot.y * u) + arcH,
              gameState.holePos.z + (spot.z - gameState.holePos.z) * u
            );
            if (racer.ballMesh) racer.ballMesh.scale.setScalar(0.55 + 0.45 * u);
            syncRacerGroundShadow(racer, arcH);
          } else {
            racer.cupAnim.done = true;
            racer.mesh.position.set(spot.x, spot.y, spot.z);
            if (racer.ballMesh) racer.ballMesh.scale.setScalar(1.0);
            syncRacerGroundShadow(racer, 0);
          }
        }
        return;
      }

      if (racer.vortexTimer > 0) racer.vortexTimer = Math.max(0, racer.vortexTimer - dt);
      if (racer.rocketTimer > 0) racer.rocketTimer = Math.max(0, racer.rocketTimer - dt);
      if (racer.bumpTimer > 0) racer.bumpTimer = Math.max(0, racer.bumpTimer - dt);
      if (racer.puttCooldown > 0) racer.puttCooldown = Math.max(0, racer.puttCooldown - dt);

      // Continuous 3D Halo & Trail Visuals for Active Power Pedals + Rainbow Fever
      if (racer.isPlayer) {
        const pos = racer.mesh.position;
        const halo = racer.haloRing || racer.haloMesh;
        const funnel = halo && halo.userData ? halo.userData.vortexFunnel : null;

        if (funnel) {
          funnel.visible = racer.vortexTimer > 0;
          if (racer.vortexTimer > 0) {
            funnel.rotation.z += dt * 10.0;
            const vs = 1.0 + 0.22 * Math.sin(gameState.elapsed * 14.0);
            funnel.scale.set(vs, vs, 1);
          }
        }

        if (halo && halo.material) {
          if (gameState.rainbowFeverTimer > 0) {
            const cIdx = Math.floor(gameState.elapsed * 12) % RAINBOW_COLORS.length;
            halo.material.color.setHex(RAINBOW_COLORS[cIdx]);
            halo.scale.setScalar(1.22 + 0.14 * Math.sin(gameState.elapsed * 16));
          } else if (racer.rocketTimer > 0) {
            halo.material.color.setHex(0xfacc15);
            halo.scale.setScalar(1.18 + 0.12 * Math.sin(gameState.elapsed * 18));
          } else if (racer.vortexTimer > 0) {
            halo.material.color.setHex(0x38bdf8);
            halo.scale.setScalar(1.15 + 0.1 * Math.cos(gameState.elapsed * 14));
          } else {
            halo.material.color.setHex(0xffe600);
            halo.scale.setScalar(1.0);
          }
        }

        racer.trailEmitAccum = (racer.trailEmitAccum || 0) + dt;
        if (racer.trailEmitAccum >= 0.055) {
          racer.trailEmitAccum = 0;
          if (gameState.rainbowFeverTimer > 0) {
            const rCol = RAINBOW_COLORS[Math.floor(Math.random() * RAINBOW_COLORS.length)];
            spawnBurstParticles(pos.x, pos.y, pos.z + 0.55, rCol, 2, 0, 0.35, 1.0);
          }
          if (racer.rocketTimer > 0) {
            const fCol = Math.random() < 0.5 ? 0xfacc15 : 0xf97316;
            spawnBurstParticles(pos.x, pos.y - 0.1, pos.z + 0.65, fCol, 2, 0, 0.25, 1.2);
          }
          if (racer.vortexTimer > 0) {
            const swirlAng = gameState.elapsed * 12.0;
            spawnBurstParticles(
              pos.x + Math.cos(swirlAng) * 1.1,
              pos.y,
              pos.z + Math.sin(swirlAng) * 1.1,
              0x38bdf8,
              1,
              -Math.cos(swirlAng) * 0.5,
              0.4,
              -0.8
            );
          }
        }
      }

      if (racer.squashTimer > 0) {
        racer.squashTimer = Math.max(0, racer.squashTimer - dt);
        if (racer.ballMesh) {
          const s = Math.sin((racer.squashTimer / 0.14) * Math.PI);
          racer.ballMesh.scale.set(1 + 0.18 * s, 1 - 0.24 * s, 1 + 0.18 * s);
        }
      } else if (racer.ballMesh) {
        racer.ballMesh.scale.set(1, 1, 1);
      }

      const pos = racer.mesh.position;
      const speedMag = Math.hypot(racer.vx, racer.vz);
      if (speedMag > maxSpeed) maxSpeed = speedMag;

      // Anti-stuck watchdog (> 2.2s wedged against tower/rail with low forward progress)
      if (speedMag < 2.2 || racer.vz > -0.5) {
        racer.stuckTimer = (racer.stuckTimer || 0) + dt;
        if (racer.stuckTimer > 2.2) {
          racer.stuckTimer = 0;
          const nudgeZ = Math.max(-stageCfg.length, pos.z - 8);
          const centerTargetX = getCourseCenterX(nudgeZ, stageCfg);
          racer.vx = (centerTargetX - pos.x) * 3.2;
          racer.vz = -13.5;
          racer.vy = Math.max(racer.vy, 5.2);
        }
      } else {
        racer.stuckTimer = 0;
      }

      if (racer.isPlayer) {
        if (speedMag < 5.2 && racer.puttCooldown <= 0) {
          executePutt(racer, gameState.aimAngle, gameState.aimPower, false);
        }
      } else {
        // Kid-Friendly Rubber-Banding & Per-Slot Pacing
        const playerProg = player ? player.progress : 0;
        const leadDelta = racer.progress - playerProg;
        if (leadDelta > 0.03 || (racer.progress > 0.78 && leadDelta > -0.04)) {
          // AI is ahead of player or near the green: ease off pace (especially on Stages 1-3)
          const earlyEase = gameState.stageIndex === 0 ? 0.52 : (gameState.stageIndex <= 2 ? 0.68 : 0.84);
          racer.rubberMult = earlyEase;
          racer.cdMult = gameState.stageIndex <= 2 ? 1.55 : 1.25;
        } else if (leadDelta < -0.22) {
          // AI fell far behind: gentle catch-up boost so the pack stays lively near camera view
          racer.rubberMult = 1.18;
          racer.cdMult = 0.82;
        } else {
          racer.rubberMult = 1.0;
          racer.cdMult = 1.0;
        }

        const aiSpeedThreshold = 4.2 + 1.4 * stageDiff * (racer.slotPace || 1.0);
        if (speedMag < aiSpeedThreshold && racer.puttCooldown <= 0) {
          const lookZ = Math.max(-stageCfg.length, pos.z - 15);
          let targetX = getCourseCenterX(lookZ, stageCfg)
            + (racer.lanePref || 0) * 0.85
            + Math.sin(gameState.elapsed * 1.8 + idx * 1.3) * 1.1;

          // Smarter Boost-Pad Seeking on Stages 2-8
          if (gameState.stageIndex >= 1) {
            for (let pIdx = 0; pIdx < gameState.boostPads.length; pIdx++) {
              const pad = gameState.boostPads[pIdx];
              if (pad.z < pos.z - 2 && pad.z > pos.z - 18 && Math.abs(pad.x - pos.x) < 4.8) {
                const seekWeight = 0.35 + 0.45 * stageDiff;
                targetX = targetX * (1 - seekWeight) + pad.x * seekWeight;
                break;
              }
            }
          }

          // Windmill Tower Obstacle Avoidance (skirts ±3.2u around centerline towers ahead)
          for (let wIdx = 0; wIdx < gameState.windmills.length; wIdx++) {
            const wm = gameState.windmills[wIdx];
            if (wm.z < pos.z + 1.0 && wm.z > pos.z - 16.0) {
              if (Math.abs(targetX - wm.x) < wm.towerRadius + 2.4 || Math.abs(pos.x - wm.x) < wm.towerRadius + 2.2) {
                const side = Math.abs(pos.x - wm.x) > 0.35
                  ? (pos.x >= wm.x ? 1 : -1)
                  : (idx % 2 === 0 ? 1 : -1);
                const avoidOffset = 3.2 + 0.4 * stageDiff;
                const wmCenter = getCourseCenterX(wm.z, stageCfg);
                const wmMaxX = getCourseHalfWidth(wm.z, stageCfg) - 1.25;
                targetX = Math.max(wmCenter - wmMaxX, Math.min(wmCenter + wmMaxX, wm.x + side * avoidOffset));
                break;
              }
            }
          }

          const aiAngle = Math.atan2(targetX - pos.x, -(lookZ - pos.z));
          const baseAiPower = (0.58 + 0.22 * stageDiff) + (racer.critter.aimSkill - 0.9) * 1.8 + Math.random() * 0.14;
          executePutt(racer, aiAngle, Math.min(0.95, Math.max(0.45, baseAiPower)), false);

          // Lively AI Critter Personality Mini-Hop & Colored Spark Burst when racing near player
          if (player && Math.abs(pos.z - player.mesh.position.z) < 12.0 && racer.hopY <= 0.05 && Math.random() < 0.42) {
            racer.vy = Math.max(racer.vy, 4.2);
            spawnBurstParticles(pos.x, pos.y + 0.2, pos.z, racer.critter.colorHex, 5, 0, 0.8, 0);
          }
        }
      }
    });

    const subSteps = Math.max(1, Math.min(6, Math.ceil((maxSpeed * dt) / 0.32)));
    const subDt = dt / subSteps;
    for (let step = 0; step < subSteps; step++) {
      stepRacersSubstep(subDt, stageCfg);
    }

    gameState.racers.forEach((racer) => {
      if (racer.finished || !racer.sprite || !camera) return;
      if (racer.isPlayer) {
        racer.sprite.scale.set(2.15, 2.15, 1);
      } else {
        const camDist = camera.position.distanceTo(racer.mesh.position);
        const dynScale = Math.max(1.6, Math.min(3.8, camDist * 0.095));
        racer.sprite.scale.set(dynScale, dynScale, 1);
        racer.sprite.position.y = 1.1 + dynScale * 0.42;
      }
    });

    updateRaceStandingsAndHUD();
    updateInstancedParticles(dt);
    updateShockwaveRings(dt);

    if (player && camera) {
      updateAimIndicator(player, stageCfg);
      const groundY = getCourseElevationY(player.mesh.position.z, stageCfg);
      const targetCamX = player.mesh.position.x * 0.65;
      const targetCamY = groundY + 10.95;
      const targetCamZ = player.mesh.position.z + 14.8;
      camBase.x += (targetCamX - camBase.x) * Math.min(1, dt * 6);
      camBase.y += (targetCamY - camBase.y) * Math.min(1, dt * 6);
      camBase.z += (targetCamZ - camBase.z) * Math.min(1, dt * 6);

      const shake = gameState.trauma * gameState.trauma;
      const ox = 0.32 * shake * Math.sin(gameState.elapsed * 43.0);
      const oy = 0.32 * shake * Math.cos(gameState.elapsed * 51.0);
      const oz = 0.25 * shake * Math.sin(gameState.elapsed * 37.0 + 1.2);
      const roll = 0.025 * shake * Math.sin(gameState.elapsed * 47.0);

      camera.position.set(camBase.x + ox, camBase.y + oy, camBase.z + oz);
      camera.lookAt(player.mesh.position.x * 0.5, groundY + 1.75, player.mesh.position.z - 6.5);
      if (shake > 0.0001) {
        camera.rotateZ(roll);
      }

      if (dirLight) {
        dirLight.position.set(player.mesh.position.x + 18, 42, player.mesh.position.z + 24);
        dirLight.target.position.set(player.mesh.position.x, 0, player.mesh.position.z - 10);
      }
      if (waterMesh) {
        waterMesh.position.x = camera.position.x;
        waterMesh.position.z = camera.position.z - 140;
      }
    }
  }

  // --- Sink Racer Into Cup with 2-Stage Drop + Parabolic Podium Hop ---
  function sinkRacerIntoCup(racer) {
    if (racer.finished) return;
    racer.finished = true;
    racer.progress = 1;
    racer.finishTime = gameState.elapsed;
    racer.vx = 0;
    racer.vy = 0;
    racer.vz = 0;
    gameState.finishOrder.push(racer);
    racer.rank = gameState.finishOrder.length;

    const spot = (gameState.cupPodiumSpots && gameState.cupPodiumSpots[racer.rank - 1])
      || { x: gameState.holePos.x + (racer.rank - 3) * 2.2, y: 0.75, z: gameState.holePos.z - 2.8 };
    racer.cupAnim = { t: 0, spot, done: false };

    if (racer.sprite) {
      racer.sprite.scale.set(racer.isPlayer ? 2.25 : 1.75, racer.isPlayer ? 2.25 : 1.75, 1);
      racer.sprite.position.y = 1.85;
    }

    spawnShockwaveRing(gameState.holePos.x, 0.05, gameState.holePos.z, 5.2, 0xffe600, 0.55);
    spawnBurstParticles(gameState.holePos.x, 0.8, gameState.holePos.z, 0xffe600, 24, 0, 1, 0);

    const player = gameState.racers[0];

    if (racer.isPlayer) {
      sfx.playCupSink();
      addTrauma(0.30);
      if (racer.rank <= 3) {
        showVisualCallout('🕳️🚩🎉');
      } else {
        showVisualCallout(racer.rank === 4 ? '😿4️⃣🔄' : '😿5️⃣🔄');
      }
      const remaining = gameState.racers
        .filter((r) => !r.finished)
        .sort((a, b) => b.progress - a.progress);
      remaining.forEach((r) => {
        r.finished = true;
        r.finishTime = gameState.elapsed + (1 - r.progress) * 5;
        gameState.finishOrder.push(r);
        r.rank = gameState.finishOrder.length;
        const rSpot = (gameState.cupPodiumSpots && gameState.cupPodiumSpots[r.rank - 1])
          || { x: gameState.holePos.x + (r.rank - 3) * 2.2, y: 0.75, z: gameState.holePos.z - 2.8 };
        r.cupAnim = { t: 0.68, spot: rSpot, done: true };
        r.mesh.position.set(rSpot.x, rSpot.y, rSpot.z);
        syncRacerGroundShadow(r, 0);
        if (r.sprite) {
          r.sprite.scale.set(1.75, 1.75, 1);
          r.sprite.position.y = 1.85;
        }
      });
      clearConcludeTimer();
      gameState.concludeTimerId = setTimeout(() => {
        gameState.concludeTimerId = null;
        concludeStageRace();
      }, 680);
    } else if (gameState.finishOrder.length >= 4 && player && !player.finished) {
      // All 4 AI rivals sank into the cup before the player -> finalize player in 5th place immediately
      player.finished = true;
      player.vx = 0;
      player.vy = 0;
      player.vz = 0;
      player.finishTime = gameState.elapsed + 1.0;
      gameState.finishOrder.push(player);
      player.rank = 5;
      const pSpot = (gameState.cupPodiumSpots && gameState.cupPodiumSpots[4])
        || { x: gameState.holePos.x + 4.4, y: 0.75, z: gameState.holePos.z - 2.8 };
      player.cupAnim = { t: 0.68, spot: pSpot, done: true };
      player.mesh.position.set(pSpot.x, pSpot.y, pSpot.z);
      syncRacerGroundShadow(player, 0);
      if (player.sprite) {
        player.sprite.scale.set(2.25, 2.25, 1);
        player.sprite.position.y = 1.85;
      }
      sfx.playCooldownBoop();
      showVisualCallout('😿5️⃣🔄');
      clearConcludeTimer();
      gameState.concludeTimerId = setTimeout(() => {
        gameState.concludeTimerId = null;
        concludeStageRace();
      }, 680);
    }
  }

  // --- Update Live Standings, HUD Rank Medal, Rainbow Fever Glow, Aim Arrow & Pedal States ---
  function updateRaceStandingsAndHUD() {
    const sorted = [...gameState.racers].sort((a, b) => {
      if (a.finished && b.finished) return a.finishTime - b.finishTime;
      if (a.finished) return -1;
      if (b.finished) return 1;
      return b.progress - a.progress;
    });
    sorted.forEach((r, idx) => {
      r.rank = idx + 1;
      if (r.pinEl) {
        r.pinEl.style.left = `${Math.round(r.progress * 100)}%`;
      }
    });

    // Live HUD Rank Medallion (`🥇`..`5️⃣`) with Top-3 Qualification Rim & Overtake Pop
    const player = gameState.racers[0];
    const rankBadge = document.getElementById('hud-rank-badge');
    if (player && rankBadge) {
      const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
      const curRank = Math.max(1, Math.min(5, player.rank || 1));
      rankBadge.textContent = medals[curRank - 1];
      rankBadge.classList.toggle('qualified-rank', curRank <= 3);
      rankBadge.classList.toggle('danger-rank', curRank > 3);
      if (curRank !== gameState.lastDisplayedRank) {
        if (curRank < gameState.lastDisplayedRank) {
          rankBadge.classList.add('rank-pop');
          setTimeout(() => rankBadge.classList.remove('rank-pop'), 260);
        }
        gameState.lastDisplayedRank = curRank;
      }
    }

    // Rainbow Gauge & `.active-fever` State
    const rainbowWrap = document.getElementById('rainbow-gauge-wrap');
    const rainbowEmoji = document.getElementById('rainbow-gauge-emoji');
    const rainbowFill = document.getElementById('rainbow-gauge-fill');
    const isFever = gameState.rainbowFeverTimer > 0;
    if (rainbowWrap) {
      rainbowWrap.classList.toggle('active-fever', isFever);
    }
    if (rainbowEmoji) {
      rainbowEmoji.textContent = isFever ? '🌈🔥' : '🌈';
    }
    if (rainbowFill) {
      const pct = isFever
        ? (gameState.rainbowFeverTimer / 5.5) * 100
        : gameState.rainbowCharge;
      rainbowFill.style.width = `${Math.round(pct)}%`;
    }

    // Aim Power Fill, Dragging Highlight & Rotating Directional Arrow (`⬆️`)
    const aimPill = document.getElementById('aim-hint-pill');
    if (aimPill) {
      aimPill.classList.toggle('dragging', !!gameState.isDraggingAim);
    }
    const aimArrow = document.getElementById('aim-dir-arrow');
    if (aimArrow) {
      const deg = Math.round((gameState.aimAngle * 180) / Math.PI);
      aimArrow.style.transform = `rotate(${deg}deg)`;
    }
    const aimFill = document.getElementById('aim-power-fill');
    if (aimFill) {
      aimFill.style.width = `${Math.round(gameState.aimPower * 100)}%`;
    }

    // Update All 4 Cockpit Pedals (`putt`, `vortex`, `rocket`, `bump`) `.is-ready` / `.on-cooldown` / `.is-active-power`
    const maxCD = { putt: 0.65, vortex: 4.0, rocket: 3.5, bump: 4.5 };
    const activeMap = {
      putt: false,
      vortex: !!(player && player.vortexTimer > 0),
      rocket: !!(player && player.rocketTimer > 0),
      bump: !!(player && (player.bumpTimer > 0 || gameState.pendingWaveHits.length > 0))
    };
    ['putt', 'vortex', 'rocket', 'bump'].forEach((k) => {
      const btn = document.getElementById(`pedal-${k}`);
      if (!btn) return;
      const cd = gameState.cooldowns[k] || 0;
      const isReady = cd <= 0.01;
      const isActive = activeMap[k];
      btn.classList.toggle('is-ready', isReady && !isActive);
      btn.classList.toggle('is-active-power', isActive);
      btn.classList.toggle('on-cooldown', !isReady && !isActive);
      const cdEl = btn.querySelector('.pedal-cooldown');
      if (cdEl) {
        const pct = Math.min(100, (cd / maxCD[k]) * 100);
        cdEl.style.height = `${pct}%`;
      }
    });
  }

  // --- Evaluate Podium Qualification ---
  function evaluateQualification(playerRank, stageIdx = gameState.stageIndex) {
    const rank = Math.max(1, Math.min(5, Number(playerRank) || 5));
    const qualified = rank <= 3;
    const stars = rank === 1 ? 3 : (rank === 2 ? 2 : (rank === 3 ? 1 : 0));

    if (qualified) {
      saveState.stars[stageIdx] = Math.max(saveState.stars[stageIdx] || 0, stars);
      if (stageIdx + 1 > saveState.unlockedStage && stageIdx + 1 < STAGES.length) {
        saveState.unlockedStage = stageIdx + 1;
      }
      saveProgress();
    }

    const result = {
      rank,
      stars,
      qualified,
      unlockedStage: saveState.unlockedStage,
      nextVisible: qualified && stageIdx < STAGES.length - 1
    };
    gameState.lastQualification = result;
    return result;
  }
  window.evaluateQualification = evaluateQualification;

  function concludeStageRace() {
    clearConcludeTimer();
    if (gameState.mode !== 'playing') return;
    gameState.mode = 'result';
    sfx.stopBGM();
    applyCameraFraming();

    // Ensure all 5 racers are finalized in finishOrder by descending progress before evaluating player.rank
    const unfinished = gameState.racers
      .filter((r) => !r.finished)
      .sort((a, b) => b.progress - a.progress);
    unfinished.forEach((r) => {
      r.finished = true;
      r.vx = 0;
      r.vy = 0;
      r.vz = 0;
      r.finishTime = gameState.elapsed + (1 - r.progress) * 5;
      gameState.finishOrder.push(r);
      r.rank = gameState.finishOrder.length;
      const rSpot = (gameState.cupPodiumSpots && gameState.cupPodiumSpots[r.rank - 1])
        || { x: gameState.holePos.x + (r.rank - 3) * 2.2, y: 0.75, z: gameState.holePos.z - 2.8 };
      r.cupAnim = { t: 0.68, spot: rSpot, done: true };
      r.mesh.position.set(rSpot.x, rSpot.y, rSpot.z);
      syncRacerGroundShadow(r, 0);
    });

    const player = gameState.racers[0];
    const playerRank = player ? player.rank : 1;
    const outcome = evaluateQualification(playerRank, gameState.stageIndex);

    sfx.playWinFanfare(outcome.qualified);
    renderResultModal(outcome);
  }

  function renderResultModal(outcome) {
    const resultScreen = document.getElementById('result-screen');
    const resultCard = resultScreen ? resultScreen.querySelector('.result-card') : null;
    const headerEl = document.getElementById('result-header-emojis');
    const starsRow = document.getElementById('result-stars-row');
    const standingsEl = document.getElementById('podium-standings');
    const retryBtn = document.getElementById('btn-retry');
    const nextBtn = document.getElementById('btn-next');

    if (resultCard) {
      resultCard.classList.toggle('victory-card', !!outcome.qualified);
      resultCard.classList.toggle('defeat-card', !outcome.qualified);
    }

    headerEl.textContent = outcome.qualified ? '🏆 ⛳ 🎉' : '😿 💔 🔄';

    starsRow.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const span = document.createElement('span');
      span.className = i < outcome.stars ? 'earned-star' : 'empty-star';
      span.textContent = i < outcome.stars ? '⭐' : '☆';
      starsRow.appendChild(span);
    }

    const ordered = [...gameState.racers].sort((a, b) => a.rank - b.rank);
    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
    const tierBadges = ['⭐⭐⭐', '⭐⭐', '⭐', '❌', '❌'];
    standingsEl.innerHTML = '';

    ordered.forEach((r, idx) => {
      const rankNum = idx + 1;
      if (rankNum === 4) {
        const divider = document.createElement('div');
        divider.className = 'podium-cutoff-divider';
        divider.textContent = '🚧';
        standingsEl.appendChild(divider);
      }
      const qualBadge = tierBadges[idx] || '❌';
      const slot = document.createElement('div');
      const playerCls = r.isPlayer
        ? (outcome.qualified ? ' is-player' : ' is-player is-player-defeat')
        : '';
      slot.className = `podium-slot rank-${rankNum}${playerCls}`;
      const avatarSrc = critterMedallionDataURLs[r.critter.id] || r.critter.icon;
      slot.innerHTML = `
        <div class="podium-medal">${medals[idx]}</div>
        <img class="podium-avatar" src="${avatarSrc}" alt="" />
        <div>${r.critter.emoji}</div>
        <div class="podium-qual-badge">${qualBadge}</div>
      `;
      standingsEl.appendChild(slot);
    });

    if (outcome.qualified && gameState.stageIndex < STAGES.length - 1) {
      const nextStageIcon = STAGES[gameState.stageIndex + 1].icon;
      nextBtn.textContent = `⏭️${nextStageIcon}`;
      nextBtn.classList.remove('hidden');
      nextBtn.classList.add('cta-pulse');
      retryBtn.classList.remove('cta-pulse');
    } else {
      nextBtn.textContent = '⏭️';
      nextBtn.classList.add('hidden');
      nextBtn.classList.remove('cta-pulse');
      retryBtn.classList.add('cta-pulse');
    }

    resultScreen.classList.remove('hidden');
    renderMenuGrids();
  }

  // --- Start or Restart a Course Stage ---
  function startStage(stageIdx) {
    if (!gameState.webglReady) return;
    clearConcludeTimer();
    sfx.init();
    gameState.stageIndex = Math.min(STAGES.length - 1, Math.max(0, stageIdx));
    saveState.selectedStage = gameState.stageIndex;
    saveProgress();

    gameState.mode = 'playing';
    gameState.elapsed = 0;
    gameState.trauma = 0;
    gameState.fovKick = 0;
    gameState.fovTarget = 0;
    gameState.rainbowCharge = 25;
    gameState.rainbowFeverTimer = 0;
    gameState.aimAngle = 0;
    gameState.aimPower = 0.78;
    gameState.manualAimLockTimer = 0;
    gameState.isDraggingAim = false;
    gameState.lastDisplayedRank = 1;
    gameState.cooldowns = { putt: 0, vortex: 0, rocket: 0, bump: 0 };

    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('hud-layer').classList.remove('hidden');

    const st = STAGES[gameState.stageIndex];
    document.getElementById('hud-stage-icon').textContent = st.icon;
    const dotsEl = document.getElementById('hud-stage-dots');
    dotsEl.innerHTML = STAGES.map((_, i) => (i <= gameState.stageIndex ? '🟢' : '⚪')).join('');

    applyCameraFraming();
    buildStageCourse(gameState.stageIndex);
    spawnRacers();
    updateRaceStandingsAndHUD();
    sfx.startBGM();
  }
  window.startStage = startStage;

  // --- Render Zero-Text Menu Grids + Live 🆚 Matchup Strip + Styled Stage Cards ---
  function renderMenuGrids() {
    const critterGrid = document.getElementById('critter-grid');
    if (critterGrid) {
      critterGrid.innerHTML = '';
      CRITTERS.forEach((c, idx) => {
        const card = document.createElement('div');
        card.className = 'critter-card' + (idx === saveState.selectedCritter ? ' selected' : '');
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        const avatarSrc = critterMedallionDataURLs[c.id] || c.icon;
        card.innerHTML = `
          <img class="critter-avatar" src="${avatarSrc}" alt="" />
          <div class="critter-badge-row">${c.emoji}</div>
          <div class="critter-perk-pill">${c.perk}</div>
        `;
        const selectThisCritter = () => {
          sfx.playPutt();
          saveState.selectedCritter = idx;
          gameState.selectedCritterIndex = idx;
          saveProgress();
          spawnRacers();
          renderMenuGrids();
        };
        card.addEventListener('click', selectThisCritter);
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectThisCritter();
          }
        });
        critterGrid.appendChild(card);
      });
    }

    const stageGrid = document.getElementById('stage-grid');
    if (stageGrid) {
      stageGrid.innerHTML = '';
      STAGES.forEach((st, idx) => {
        const unlocked = idx <= saveState.unlockedStage;
        const starsCount = saveState.stars[idx] || 0;
        const starsStr = unlocked
          ? ('⭐'.repeat(starsCount) + '☆'.repeat(3 - starsCount))
          : '🔒';

        const skyTopCss = '#' + st.skyTop.toString(16).padStart(6, '0');
        const skyHorCss = '#' + st.skyHorizon.toString(16).padStart(6, '0');
        const wallCss = '#' + st.wallColor.toString(16).padStart(6, '0');
        const turfACss = '#' + st.turfColor.toString(16).padStart(6, '0');
        const turfBCss = '#' + st.turfAlt.toString(16).padStart(6, '0');
        const pips = '🎡'.repeat(st.windmills);

        const card = document.createElement('div');
        card.className = 'stage-card' +
          (idx === saveState.selectedStage ? ' selected' : '') +
          (!unlocked ? ' locked' : '');
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', unlocked ? '0' : '-1');
        card.style.background = `linear-gradient(180deg, ${skyTopCss} 0%, ${skyHorCss} 82%)`;
        card.style.borderColor = wallCss;
        card.innerHTML = `
          <div class="stage-emoji">${st.icon} ${st.sub}</div>
          <div class="stage-difficulty-pips">${pips}</div>
          <div class="stage-stars">${starsStr}</div>
          <div class="stage-turf-strip" style="background: repeating-linear-gradient(90deg, ${turfACss} 0 12px, ${turfBCss} 12px 24px);"></div>
        `;
        const selectThisStage = () => {
          if (!unlocked) return;
          sfx.playPutt();
          saveState.selectedStage = idx;
          gameState.stageIndex = idx;
          saveProgress();
          buildStageCourse(idx);
          spawnRacers();
          renderMenuGrids();
        };
        card.addEventListener('click', selectThisStage);
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectThisStage();
          }
        });
        stageGrid.appendChild(card);
      });
    }

    const menuCard = document.querySelector('.menu-card');
    const playBtn = document.getElementById('btn-play');
    if (menuCard && playBtn) {
      let vsRow = document.getElementById('vs-preview-row');
      if (!vsRow) {
        vsRow = document.createElement('div');
        vsRow.id = 'vs-preview-row';
        vsRow.className = 'vs-preview-row';
        menuCard.insertBefore(vsRow, playBtn);
      }
      const lineup = getStageLineup(saveState.selectedCritter, saveState.selectedStage);
      const pCritter = lineup[0];
      const pSrc = critterMedallionDataURLs[pCritter.id] || pCritter.icon;
      const rivalsHtml = lineup.slice(1).map((r) => {
        const rSrc = critterMedallionDataURLs[r.id] || r.icon;
        return `<img class="vs-mini-avatar" src="${rSrc}" alt="" />`;
      }).join('');
      vsRow.innerHTML = `
        <img class="vs-mini-avatar player" src="${pSrc}" alt="" />
        <span class="vs-badge-icon">${pCritter.perk} 🆚</span>
        ${rivalsHtml}
      `;
    }
  }

  // --- Input Listeners ---
  function bindControls() {
    const container = document.getElementById('webgl-container');
    let pointerStartX = 0;
    let pointerStartY = 0;

    if (container) {
      container.addEventListener('pointerdown', (e) => {
        if (gameState.mode !== 'playing') return;
        gameState.isDraggingAim = true;
        pointerStartX = e.clientX;
        pointerStartY = e.clientY;
        updateRaceStandingsAndHUD();
      });
    }

    window.addEventListener('pointermove', (e) => {
      if (!gameState.isDraggingAim || gameState.mode !== 'playing') return;
      const dx = (e.clientX - pointerStartX) / Math.max(180, window.innerWidth * 0.35);
      const dy = (pointerStartY - e.clientY) / Math.max(160, window.innerHeight * 0.35);
      gameState.aimAngle = Math.max(-0.85, Math.min(0.85, dx * 0.9));
      gameState.aimPower = Math.max(0.35, Math.min(1.0, 0.72 + dy * 0.35));
      gameState.manualAimLockTimer = 1.5;
    });

    window.addEventListener('pointerup', () => {
      if (!gameState.isDraggingAim) return;
      gameState.isDraggingAim = false;
      const player = gameState.racers[0];
      if (player && !player.finished && gameState.mode === 'playing') {
        executePutt(player, gameState.aimAngle, gameState.aimPower, true);
      }
      updateRaceStandingsAndHUD();
    });

    const cancelAimDrag = () => {
      if (!gameState.isDraggingAim) return;
      gameState.isDraggingAim = false;
      updateRaceStandingsAndHUD();
    };
    window.addEventListener('pointercancel', cancelAimDrag);
    window.addEventListener('blur', cancelAimDrag);

    // Interactive Aim Hint Pill & Touch Nudge Buttons (`⬅️` / `➡️` / Tap-to-Putt)
    const btnAimLeft = document.getElementById('btn-aim-left');
    const btnAimRight = document.getElementById('btn-aim-right');
    const aimTapZone = document.getElementById('aim-tap-zone');
    if (btnAimLeft) {
      btnAimLeft.addEventListener('click', (e) => {
        e.stopPropagation();
        nudgePlayerAim(-0.18);
      });
    }
    if (btnAimRight) {
      btnAimRight.addEventListener('click', (e) => {
        e.stopPropagation();
        nudgePlayerAim(0.18);
      });
    }
    if (aimTapZone) {
      aimTapZone.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerPowerPedal('putt');
      });
    }

    // 4 Giant Bottom Cockpit Pedals (`putt`, `vortex`, `rocket`, `bump`)
    const pedalPutt = document.getElementById('pedal-putt');
    if (pedalPutt) pedalPutt.addEventListener('click', () => triggerPowerPedal('putt'));
    document.getElementById('pedal-vortex').addEventListener('click', () => triggerPowerPedal('vortex'));
    document.getElementById('pedal-rocket').addEventListener('click', () => triggerPowerPedal('rocket'));
    document.getElementById('pedal-bump').addEventListener('click', () => triggerPowerPedal('bump'));

    document.getElementById('btn-play').addEventListener('click', () => {
      if (!gameState.webglReady) return;
      gameState.selectedCritterIndex = saveState.selectedCritter;
      startStage(saveState.selectedStage);
    });

    document.getElementById('btn-home').addEventListener('click', () => {
      clearConcludeTimer();
      sfx.stopBGM();
      gameState.mode = 'menu';
      gameState.isDraggingAim = false;
      document.getElementById('hud-layer').classList.add('hidden');
      document.getElementById('result-screen').classList.add('hidden');
      document.getElementById('menu-screen').classList.remove('hidden');
      applyCameraFraming();
      buildStageCourse(saveState.selectedStage);
      spawnRacers();
      renderMenuGrids();
    });

    document.getElementById('btn-result-home').addEventListener('click', () => {
      document.getElementById('btn-home').click();
    });

    document.getElementById('btn-retry').addEventListener('click', () => {
      startStage(gameState.stageIndex);
    });

    document.getElementById('btn-next').addEventListener('click', () => {
      const nextIdx = Math.min(STAGES.length - 1, gameState.stageIndex + 1);
      if (nextIdx <= saveState.unlockedStage) {
        startStage(nextIdx);
      }
    });

    document.getElementById('btn-audio').addEventListener('click', (e) => {
      sfx.muted = !sfx.muted;
      e.currentTarget.textContent = sfx.muted ? '🔇' : '🔊';
    });

    window.addEventListener('keydown', (e) => {
      if (gameState.mode === 'menu') {
        if (e.key === 'ArrowRight') {
          saveState.selectedCritter = (saveState.selectedCritter + 1) % CRITTERS.length;
          gameState.selectedCritterIndex = saveState.selectedCritter;
          saveProgress();
          spawnRacers();
          renderMenuGrids();
        } else if (e.key === 'ArrowLeft') {
          saveState.selectedCritter = (saveState.selectedCritter + CRITTERS.length - 1) % CRITTERS.length;
          gameState.selectedCritterIndex = saveState.selectedCritter;
          saveProgress();
          spawnRacers();
          renderMenuGrids();
        } else if (e.key === 'Enter' && gameState.webglReady && gameState.assetsReady) {
          startStage(saveState.selectedStage);
        }
        return;
      }

      if (gameState.mode === 'result') {
        if (e.key === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          const qual = gameState.lastQualification;
          if (qual && qual.qualified && gameState.stageIndex < STAGES.length - 1) {
            document.getElementById('btn-next').click();
          } else {
            document.getElementById('btn-retry').click();
          }
        }
        return;
      }

      if (gameState.mode !== 'playing') return;
      if (e.key === '1') triggerPowerPedal('vortex');
      else if (e.key === '2' || e.code === 'Space') triggerPowerPedal('rocket');
      else if (e.key === '3') triggerPowerPedal('bump');
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        nudgePlayerAim(-0.14);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        nudgePlayerAim(0.14);
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        triggerPowerPedal('putt');
      }
    });
  }

  // --- Main Render Loop ---
  function animate() {
    requestAnimationFrame(animate);
    if (!gameState.webglReady || !renderer || !scene || !camera || !clock) return;

    const dt = Math.min(0.05, clock.getDelta());

    if (gameState.mode === 'playing') {
      updateGamePhysics(dt);
    } else if (gameState.mode === 'result') {
      gameState.elapsed += dt;
      updateInstancedParticles(dt);
      updateShockwaveRings(dt);
      gameState.racers.forEach((r) => {
        if (r.cupAnim) {
          const spot = r.cupAnim.spot;
          if (!r.cupAnim.done) {
            r.cupAnim.t += dt;
            r.cupAnim.done = true;
          }
          if (r.rank <= 3) {
            const bounceH = Math.abs(Math.sin(gameState.elapsed * 4.5 + r.rank)) * 0.45;
            r.mesh.position.set(spot.x, spot.y + bounceH, spot.z);
            syncRacerGroundShadow(r, bounceH);
            if (r.ballMesh) r.ballMesh.rotation.y += dt * 2.2;
          } else {
            r.mesh.position.set(spot.x, spot.y, spot.z);
            syncRacerGroundShadow(r, 0);
          }
        }
      });
      const hx = gameState.holePos.x;
      const hz = gameState.holePos.z - 1.5;
      camera.position.x = hx + Math.sin(gameState.elapsed * 0.55) * 11.5;
      camera.position.y = 9.5;
      camera.position.z = hz + Math.cos(gameState.elapsed * 0.55) * 11.5;
      camera.lookAt(hx, 1.8, hz);
      if (waterMesh) {
        waterMesh.position.x = camera.position.x;
        waterMesh.position.z = camera.position.z - 140;
      }
    } else {
      gameState.elapsed += dt;
      const player = gameState.racers[0];
      if (player && player.mesh) {
        const bounceH = Math.abs(Math.sin(gameState.elapsed * 3.8)) * 0.55;
        player.mesh.position.y = 0.75 + bounceH;
        syncRacerGroundShadow(player, bounceH);
        if (player.ballMesh) player.ballMesh.rotation.y += dt * 1.8;
      }
      camera.position.x = Math.sin(gameState.elapsed * 0.5) * 6.5;
      camera.position.y = 7.2;
      camera.position.z = 11.5 + Math.cos(gameState.elapsed * 0.5) * 2.0;
      camera.lookAt(0, 1.8, -6);

      gameState.windmills.forEach((wm) => {
        wm.angle += wm.speed * dt;
        wm.rotor.rotation.z = wm.angle;
      });
      if (dirLight) {
        dirLight.position.set(18, 42, 24);
        dirLight.target.position.set(0, 0, -8);
      }
      if (waterMesh) {
        waterMesh.position.x = camera.position.x;
        waterMesh.position.z = camera.position.z - 140;
      }
    }

    renderer.render(scene, camera);
  }

  // --- Boot Game ---
  function init() {
    verifyColorContrastDeltaE();
    loadProgress();
    gameState.selectedCritterIndex = saveState.selectedCritter;
    gameState.stageIndex = saveState.selectedStage;

    renderMenuGrids();
    bindControls();
    preloadCritterMedallions();

    if (initThree()) {
      buildStageCourse(saveState.selectedStage);
      spawnRacers();
      animate();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
