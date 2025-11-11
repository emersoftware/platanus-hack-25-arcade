// CÓNDOR - Heightmap + Sprite Hybrid Rail Shooter
// Combines heightmap terrain (Comanche-style) with pseudo-3D sprites

// Sprite data URIs
const CONDOR_SPRITE_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAATCAYAAAByfPSJAAACtklEQVR4Ae3Bi20bCRBEwTeyI7iegAQHbiig7hCMuV2APBC6tfjRUqJgV1UB/0jDK0mKHQzPw6J4KXYgaXglSXFn8+3HsKhfP4svbHgeFsVLcUfFCUnDhiTFDYbn4UTxUtxA0rAhSfEB5tuP4UT9+ll8QcPzcKJ4Ke7ku6ThDEnDiSTFHUkaLiBpOEhSvEHS8EqS4o4kDa8kKf4AxQlJw5WSFBtmwYZasEHScKUkxRmShjOSFL8xCzbUgt+QNJyRpPhAs2BDLbiD75KGd5A0HCQpriBpeAdJw0GS4kaShoMkxQ0kDX/9pzghaVjYprt5RLbpblZJigtIGh5IkuLOJA03SFLs4ImFpJE0LGzT3axs8yhss+pubLOSNJKGM5IUDyJJcWeShhtJGnZQvCJpWNjmqLv5TLY56m5WSYorSRo+UZLiA0ga3iFJ8U5PnJA0HHQ3q+7GNp/FNt3Nqrs5kjRcKUklKQ5sY5u92cY2R0kqSfEHKTZIGl6xzaq7+Qi2WXU3ryUp3knScGCb7mYPtulujpIUH0zS2Ka7uYZtupskxTs9sSFJJSlOdDfdjW1sc2SblW2uZZuVbY5sY5vuprs5laSSFDtIUhx0N7ZZ2eZatlnZprs5SlJ8ItvY5hzb2GZPxYUkDSdss+pubNPd2Ka7uYRtuhvbdDe2WXU3p5IUdyZpOGGb7uYStuluTiUpPpGkYWGbo+5mi22OuptVkuKdihtIGu4oSfFJJA03SFI8EEnDwjbdzVts092skhQ7KO5E0rAhSfFFSBrekKR4YJKGKyQpdvLEHUgafkPS8NeHSFJcKEmxoyd2Jmk4Q9Lw4CQNZ0ga/tpU7EjScIUkxQOSNFwhSfHAJA1vSFLs7IkdJSkulKR4UEmKCyUp/vqf4k4kDRuSFF+IpGFDkuILkTRsSFLcwb+bhJIfhLXp/QAAAABJRU5ErkJggg==';

const OBSTACLES_SPRITE_0 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAmCAYAAACCjRgBAAABzklEQVR42tVZCY7DIAz06/ri/VB/0B9km2qJEPExY5tKG8lSCgF8e3BF/p7j9Tr+E8n8zBPPx+Owfo/39RuN1m+tNdr+0Rlj7mL+HPAYRxhkCWXcUsQlBLsgyzAjEOIJgyTDVKcwiMt6c4JqnDW5JaAnvDVmrflYIGIsE4xVS6JnXQKg0d/hIpU9VAtEGkDSWSZ7VYS/WaBLWzsyVBQzcAxkma4IhaR4QXIwWym7cj8yLjuCdqWfd8HfEdgpAVActNKOWFLTaLXwsJmskqFcKFHRGoufsvO0C7Fwt1q9ozNUAVhY3QX2shYX1EcrF48s4It4gOpARouVOwRzdjoGGLSIVngGc8FYqPu6mIUMrgtlLugoImW13QIlOorOzo6E6UKdxYy1gHbOiZ9OGlhKgyeqANrHA4wxJkYyENp5sHCV6UIRGOsIbhRDRUoTtGR/q+czu5BnTdOF2CrZETuRC3nf0G2Vb3YsEN4kE2w7GGb6oxAaXcfn7LSmt4w7ISkSupExrpM9CLl2ZjrTJReaNZcRQFvPxhvlQpamsriGyWahBSxNdgY2CwTRQvf5l8Zr8KLYfg1KJkg161pjN+bH42GPdTOPLCwVvTP7zcz/AsaYiQoyUMmDAAAAAElFTkSuQmCC';
const OBSTACLES_SPRITE_1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAmCAYAAACCjRgBAAAB2ElEQVR42tVZW27DMAzT6XriXWg36A26tWgKzxEtknI+FsDYEudBiRRloxHv43G/P/7TiPEYJ75vt/QBdB2N+f7q3HnmA/45gW5WX9o9Z585rsU4iUDvGNU72UAP8Mc4MZAF1AHTkR7K/Ig1ZuBqphSgDrNZ5sfzNAAmqK7MUKaREjLwSwauBs2yjYCfihhlvkO7IrlVDWbALQlVhe7UAWJ6BfokoRVQth+oYJm5DPw8H0ym2UBWQSlSUkZcIZ3KkiunYXFQLsSwsLNTtxhgipmRgsoUsky5kTkS2uk8CgMtCbn+v0oAY5lWJ0YfUGXDBs8EATvxjuJlWVglKBtfv1sXuhOzizonu8p9tgtVXVEBoNxXZb4sYkdOO7M/vh8Bl/qAuszuZN6xULuImayy9YO+ITFQdV3G2o4PPv+O/2dz83VlyKtRl+bOyBig9wOrILKMXR1UtU4Kt6073RNJywmkdKFKNq6LzKBXQTDby1CX0aOckGtk3j7OZwwwgWTqiApkx+KYroqCYJmBEjpewPQCBfgOJqi1kNvgmIJVmLA2NM4ewZXTVgk5Ptxxm0pO8lJCDcLRPmujrIxev9JU1pUVtOM47Dwrqz+/k+1o9Si7nQ4MpfM+fgCI3WJhOLzt4AAAAABJRU5ErkJggg==';
const OBSTACLES_SPRITE_2 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAmCAYAAACCjRgBAAAB7klEQVR42sVZW24DMQjkdDlxL9Qb5AZp++GVFwEzA06z0mpfMWZ4Q8yK4/V8vj51mnJ8ktExqGrB1+/n/2Qw2u/78agBIaJ/BHYiFUHmOwNg0ciuNxARs9HCCeMMKC99BGJdjZVyBqIj8WgNI30v4BsAz2TEMKMJxGjGfMZDtGZ/b5nKqncTO48Eokjf82PVAtWckMOhIKFeSwAI0AlN7KbTAXCZUAf5emZzRcQoGzahBk6AWKd/Xu+isxs6bwA66Kt7JpJV9+pVikLVb5DJVLF/7AMMANWxUQiOkpIixLSUYOogJF1Fc10Aa19jzEBxKnXNbkZHotBEKshZUS7pCMQ68TuSYkcLKCAwgIxZqH5XzOxtGug4ZkcDWRcm5wE2zqNKkdVAVE50zNCm9s/adQVkEsWMKYWV8qKTD7plxC0TM3U923Aoku8kQrqcPlGpvjuZ2Un7970tqzkP4EgxNymzlVwQgVaEYFPbrzIyC7jqzOi50IkGo3LmTg6hq9FTU4K9fVRMKWps5Mmc2swwLSWSaBSFxmF06syRFrI5U9bgt+dC0xkRauyR5jqBxJjJNGtKlRll0W4fxSAfiO4t27xrTohWNp1Tw+8Cff1Ts0sCMcKcnt5O1+8R7VnNUa8QGh2IkWxDlkFEB9H1/P4Ak9SSnnd6rbYAAAAASUVORK5CYII=';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#648CBE',
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: {
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

// Game configuration
let CONFIG = {
  width: 800,
  height: 600,
  condor: {
    speed: 13.36,
    smoothing: 0.35,
    prevX: 400,
    prevY: 300,
    centerY: 300,
    // Hitbox para colisiones (más pequeño que el visual 50×20)
    hitboxWidth: 35,   // 70% del ancho visual (50 × 0.7)
    hitboxHeight: 15,  // 75% del alto visual (20 × 0.75)
    dashDistanceH: 100,
    dashDistanceV: 80,
    dashDurationH: 10.7,
    dashDurationV: 8.6,
    dashDurationDiag: 13.7
  },
  camera: {
    worldX: 256,
    worldZ: 256,
    height: 100,
    displacementFactor: 0.8,
    maxDisplacement: 200,
    smoothing: 0.1,
    zoom: 1.5,
    followLerp: 0.1,
    rotationSensitivity: 0.02,
    maxRotation: 0.1,
    perspectiveShift: 0.4,
    perspectiveLerp: 0.1,
    centerPullFactor: 0.30
  },
  heightmap: {
    size: 512,
    maxHeight: 120,
    renderDist: 200,
    horizon: 350,
    step: 3
  },
  obstacles: {
    baseVelocity: 6.0,         // Starting velocity (slower)
    currentVelocity: 6.0,      // Will increase over time
    targetVelocity: 11.5,      // Sweet spot - comfortable but challenging
    growthRate: 8,             // How fast it reaches target (lower = faster)
    minSpeedMultiplier: 1.0,
    maxSpeedMultiplier: 3.0
  },
  rhythm: {
    bpm: 120,                  // Future: base BPM for music sync
    beatsPerWave: 4,           // Future: waves arrive every 4 beats
    syncEnabled: false         // Future: toggle music sync
  },
  render: {
    spawnDistance: 1000,
    despawnDistance: -200,
    fadeInStart: 950,
    fadeOutStart: 100
  },
  // ÁREA DE JUEGO (jugador y llegada de rieles)
  playArea: {
    x: 150,
    y: 100,
    width: 500,  // 650 - 150
    height: 400  // 500 - 100
  },
  limits: {
    minX: 150,
    maxX: 650,
    minY: 100,
    maxY: 500
  }
};

// Depth layers (render order)
const DEPTH_LAYERS = {
  TERRAIN: -1000,
  DEBUG_RAILS: -50,
  OBSTACLES_FAR: 0,      // Obstacles when far
  OBSTACLES_NEAR: 300,   // Obstacles when approaching
  CELL_INDICATOR: 450,
  CONDOR: 500,
  UI: 600
};

// Perspective rail system
const PERSPECTIVE_SYSTEM = {
  vanishingPoint: { x: 400, y: 200 },  // Punto de fuga

  // Grid lejano (donde spawenean, cerca del punto de fuga)
  farGrid: {
    centerX: 400,
    centerY: 300,
    width: 200,   // Ancho total del grid
    height: 160,  // Alto total del grid (5 filas)
    columns: 5,
    rows: 5
  },

  // Grid cercano - COINCIDE CON EL ÁREA DE JUEGO
  nearGrid: {
    x: 150,        // Mismo que playArea.x
    y: 100,        // Mismo que playArea.y
    width: 500,    // Mismo que playArea.width
    height: 400,   // Mismo que playArea.height
    columns: 5,
    rows: 5
  }
};

// Wave configuration
const WAVE_CONFIG = {
  spawnZ: 1200,           // Distance where obstacles appear
  arrivalZ: 100,          // Distance where they reach player
  obstaclesPerWave: 13    // Number of obstacles per wave
};

// Calculate velocity using logarithmic growth curve
function calculateVelocity(waveNumber) {
  // Exponential saturation curve: v = base + (target - base) * (1 - e^(-wave/growth))
  // This creates fast initial growth that gradually slows down approaching target
  const base = CONFIG.obstacles.baseVelocity;
  const target = CONFIG.obstacles.targetVelocity;
  const growth = CONFIG.obstacles.growthRate;

  const velocity = base + (target - base) * (1 - Math.exp(-waveNumber / growth));
  return velocity;
}

// Calculate BPM based on current velocity (100 BPM → 170 BPM)
function calculateBPM() {
  const minBPM = 100;
  const maxBPM = 170;
  const minVel = CONFIG.obstacles.baseVelocity;      // 6.0
  const maxVel = CONFIG.obstacles.targetVelocity;    // 11.5

  // Linear interpolation: velocity → BPM
  const progress = (CONFIG.obstacles.currentVelocity - minVel) / (maxVel - minVel);
  const clampedProgress = Math.max(0, Math.min(1, progress)); // Clamp to [0, 1]
  return minBPM + (maxBPM - minBPM) * clampedProgress;
}

// Calculate dynamic wave interval based on current velocity
function calculateWaveInterval() {
  // Calculate average speed (considering acceleration)
  const avgSpeed = CONFIG.obstacles.currentVelocity *
    ((CONFIG.obstacles.minSpeedMultiplier + CONFIG.obstacles.maxSpeedMultiplier) / 2);

  // Distance to travel
  const distance = WAVE_CONFIG.spawnZ - WAVE_CONFIG.arrivalZ;

  // Time in frames for a wave to complete (~frames)
  const travelTime = distance / avgSpeed;

  // Add 15% buffer to prevent overlap
  const buffer = 1.15;

  // If rhythm sync is enabled (future feature)
  if (CONFIG.rhythm.syncEnabled && CONFIG.rhythm.bpm > 0) {
    // Frames per beat at 60fps
    const framesPerBeat = (60 * 60) / CONFIG.rhythm.bpm;
    // Round to nearest beat multiple
    const beatsNeeded = Math.ceil(travelTime * buffer / framesPerBeat);
    return beatsNeeded * framesPerBeat;
  }

  return Math.ceil(travelTime * buffer);
}

// Wave system state
let waveSystem = {
  currentWave: 0,
  frameCounter: 0,
  activeObstacles: [],
  nextWavePattern: null,  // Stores the pattern for next wave preview
  currentWaveInterval: 100,  // Dynamic interval calculated based on velocity

  // Matrix-based collision detection (5x5 grid = 25 cells)
  arrivalMatrix: Array(25).fill(0),  // 0=safe, 1=obstacle
  arrivalWaveId: null  // Track which wave is currently in arrival zone
};

// Terrain colors by height (blue theme)
const TERRAIN_COLORS = [
  { h: 120, c: 0xE0F0FF },  // Very light blue (snow/ice)
  { h: 90, c: 0xA8C8E0 },   // Light blue-gray
  { h: 60, c: 0x7095B8 },   // Medium blue
  { h: 30, c: 0x4A6F90 },   // Deep blue
  { h: 0, c: 0x2A4560 },    // Dark blue (deep water)
];

// 2x2 Bayer matrix for ordered dithering (lighter)
const BAYER_MATRIX = [
  [0, 2],
  [3, 1]
];

// Game state
let worldDisplacementY = 0;
let currentPerspectiveShift = 0;
let baseFarGridCenterY = 160; // Store initial farGrid centerY
let obstacles = [];
let heightmapData = null;
let terrainGraphics = null;
let backgroundGradientCache = null;
let condor;
let cameraTarget;
let cursors;
let spaceKey;
let scoreText;
let scoreBackground;
let gameOverText;
let condorCellIndicator;
let condorHitboxIndicator;
let nextWavePreview;
let debugRailsGraphics = null;
let uiCameraRef = null;

// Game logic
let score = 0;
let gameOver = false;
let gameOverTimer = 0;
let isStartScreen = true;
let startScreenUI = {};
let sceneRef = null;

// Audio system
let audioCtx = null;
let masterGain = null;
let musicBeat = 0;
let musicBPM = 100; // Dynamic BPM: starts at 100, goes up to 170
let beatInterval = (60 / musicBPM) * 1000 / 4; // 16th notes in ms

// Dash / Barrel Roll state
let isDashing = false;
let dashProgress = 0;
let currentDashDuration = 7.5; // Set dynamically based on dash direction
let dashDirection = { x: 0, y: 0 };
let dashStartX = 0;
let dashStartY = 0;
let dashTargetX = 0;
let dashTargetY = 0;
let dashRotation = 0;
let spaceKeyPressTime = 0;
let spaceKeyBufferWindow = 150;
let allowDoubleDash = false;
let isDoubleDash = false;
let dashInitialX = 0;
let dashInitialY = 0;
let dashExtendPressTime = 0;

// Heightmap generation (simplified Perlin-like noise)
function noise2D(x, z) {
  const hash = (n) => {
    n = Math.sin(n) * 43758.5453;
    return n - Math.floor(n);
  };
  const ix = Math.floor(x), iz = Math.floor(z);
  const fx = x - ix, fz = z - iz;
  const u = fx * fx * (3 - 2 * fx);
  const v = fz * fz * (3 - 2 * fz);
  const a = hash(ix + hash(iz));
  const b = hash(ix + 1 + hash(iz));
  const c = hash(ix + hash(iz + 1));
  const d = hash(ix + 1 + hash(iz + 1));
  return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v;
}

function generateHeightmap(size) {
  const map = [];
  for (let x = 0; x < size; x++) {
    map[x] = [];
    for (let z = 0; z < size; z++) {
      let h = 0;
      h += noise2D(x / 64, z / 64) * 50;
      h += noise2D(x / 32, z / 32) * 25;
      h += noise2D(x / 16, z / 16) * 12;
      h = Math.max(0, h + 15);
      map[x][z] = Math.min(CONFIG.heightmap.maxHeight, h);
    }
  }
  return map;
}

function getTerrainHeight(x, z) {
  const size = CONFIG.heightmap.size;
  x = ((x % size) + size) % size;
  z = ((z % size) + size) % size;
  const ix = Math.floor(x) % size;
  const iz = Math.floor(z) % size;
  const fx = x - Math.floor(x);
  const fz = z - Math.floor(z);
  const h00 = heightmapData[ix][iz];
  const h10 = heightmapData[(ix + 1) % size][iz];
  const h01 = heightmapData[ix][(iz + 1) % size];
  const h11 = heightmapData[(ix + 1) % size][(iz + 1) % size];
  return (h00 * (1 - fx) + h10 * fx) * (1 - fz) + (h01 * (1 - fx) + h11 * fx) * fz;
}

function lerpColor(c1, c2, t) {
  const r1 = (c1 >> 16) & 0xFF, g1 = (c1 >> 8) & 0xFF, b1 = c1 & 0xFF;
  const r2 = (c2 >> 16) & 0xFF, g2 = (c2 >> 8) & 0xFF, b2 = c2 & 0xFF;
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return (r << 16) | (g << 8) | b;
}

function getTerrainColor(h) {
  for (let i = 0; i < TERRAIN_COLORS.length - 1; i++) {
    if (h <= TERRAIN_COLORS[i + 1].h) {
      const t = (h - TERRAIN_COLORS[i].h) / (TERRAIN_COLORS[i + 1].h - TERRAIN_COLORS[i].h);
      return lerpColor(TERRAIN_COLORS[i].c, TERRAIN_COLORS[i + 1].c, t);
    }
  }
  return TERRAIN_COLORS[TERRAIN_COLORS.length - 1].c;
}

function getBayerThreshold(x, y) {
  return BAYER_MATRIX[y % 2][x % 2] / 4;
}

function applyDithering(color, x, y, intensity = 32) {
  const threshold = getBayerThreshold(x, y);

  const r = (color >> 16) & 0xFF;
  const g = (color >> 8) & 0xFF;
  const b = color & 0xFF;

  // Quantize colors with dithering
  const quantize = (channel) => {
    const normalized = channel / 255;
    const stepped = Math.floor(normalized * intensity) / intensity;
    const error = normalized - stepped;

    // Apply threshold of Bayer
    if (error > threshold) {
      return Math.min(255, Math.floor((stepped + 1/intensity) * 255));
    }
    return Math.floor(stepped * 255);
  };

  return (quantize(r) << 16) | (quantize(g) << 8) | quantize(b);
}

function renderHeightmap(gfx, camera) {
  gfx.clear();
  const w = CONFIG.width, h = CONFIG.height;
  const horizon = CONFIG.heightmap.horizon;
  const step = CONFIG.heightmap.step;
  const renderDist = CONFIG.heightmap.renderDist;

  // Draw cached gradient background (only once at startup)
  if (!backgroundGradientCache) {
    backgroundGradientCache = [];
    const sunsetColors = [
      { pos: 0, r: 100, g: 140, b: 190 },
      { pos: 0.3, r: 135, g: 170, b: 210 },
      { pos: 0.5, r: 165, g: 195, b: 225 },
      { pos: 0.7, r: 190, g: 215, b: 235 },
      { pos: 0.85, r: 210, g: 230, b: 245 },
      { pos: 1, r: 225, g: 240, b: 250 }
    ];
    const gradientSteps = 30;
    for (let i = 0; i < gradientSteps; i++) {
      const y = (h / gradientSteps) * i;
      const nextY = (h / gradientSteps) * (i + 1);
      const t = i / (gradientSteps - 1);
      let colorA = sunsetColors[0];
      let colorB = sunsetColors[1];
      for (let j = 0; j < sunsetColors.length - 1; j++) {
        if (t >= sunsetColors[j].pos && t <= sunsetColors[j + 1].pos) {
          colorA = sunsetColors[j];
          colorB = sunsetColors[j + 1];
          break;
        }
      }
      const localT = (t - colorA.pos) / (colorB.pos - colorA.pos);
      const r = Math.floor(colorA.r + (colorB.r - colorA.r) * localT);
      const g = Math.floor(colorA.g + (colorB.g - colorA.g) * localT);
      const b = Math.floor(colorA.b + (colorB.b - colorA.b) * localT);
      backgroundGradientCache.push({ y, nextY, color: (r << 16) | (g << 8) | b });
    }
  }

  // Draw from cache
  for (let i = 0; i < backgroundGradientCache.length; i++) {
    const grad = backgroundGradientCache[i];
    gfx.fillStyle(grad.color);
    gfx.fillRect(0, grad.y, w, grad.nextY - grad.y);
  }

  const skyR = 225, skyG = 240, skyB = 250;
  const camX = camera.worldX, camZ = camera.worldZ, camH = camera.height;
  const wHalf = w / 2;

  // Voxel space rendering optimized with local vars
  for (let screenX = 0; screenX < w; screenX += step) {
    let yBuffer = h;
    const rayAngle = (screenX - wHalf) / w;

    for (let dist = 10; dist < renderDist; dist += 2) {
      const sampleX = camX + rayAngle * dist * 0.5;
      const sampleZ = camZ + dist;
      const terrainHeight = getTerrainHeight(sampleX, sampleZ);
      const heightAboveTerrain = camH - terrainHeight;
      const projectedY = horizon + (heightAboveTerrain * 300) / dist;

      if (projectedY >= horizon && projectedY < yBuffer) {
        const screenY = Math.floor(projectedY);
        if (yBuffer > screenY) {
          const baseColor = getTerrainColor(terrainHeight);
          const fog = Math.pow(dist / renderDist, 1.5);
          const r = Math.floor(((baseColor >> 16) & 0xFF) * (1 - fog) + skyR * fog);
          const g = Math.floor(((baseColor >> 8) & 0xFF) * (1 - fog) + skyG * fog);
          const b = Math.floor((baseColor & 0xFF) * (1 - fog) + skyB * fog);
          let finalColor = (r << 16) | (g << 8) | b;
          finalColor = applyDithering(finalColor, screenX, screenY, 16);
          gfx.fillStyle(finalColor);
          gfx.fillRect(screenX, screenY, step, yBuffer - screenY);
          yBuffer = screenY;
        }
      }
      if (yBuffer <= horizon) break;
    }
  }
}

// Generate perspective rails - MATRIX STYLE (no gaps)
function generatePerspectiveRails() {
  const rails = [];
  const { farGrid, nearGrid } = PERSPECTIVE_SYSTEM;

  const cols = nearGrid.columns;
  const rows = nearGrid.rows;

  // Tamaño de cada celda en el grid cercano (pegados)
  const cellWidth = nearGrid.width / cols;
  const cellHeight = nearGrid.height / rows;

  // Tamaño de cada celda en el grid lejano
  const farCellWidth = farGrid.width / cols;
  const farCellHeight = farGrid.height / rows;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const id = row * cols + col;

      // FAR GRID (cerca del punto de fuga)
      const farCenterX = farGrid.centerX - (farGrid.width / 2) + (col + 0.5) * farCellWidth;
      const farCenterY = farGrid.centerY - (farGrid.height / 2) + (row + 0.5) * farCellHeight;

      // NEAR GRID (área de juego del jugador) - PEGADOS
      const nearLeft = nearGrid.x + col * cellWidth;
      const nearTop = nearGrid.y + row * cellHeight;
      const nearRight = nearLeft + cellWidth;
      const nearBottom = nearTop + cellHeight;

      rails.push({
        id: id,
        col: col,
        row: row,
        // Far corners (pequeños, cerca del punto de fuga)
        far: {
          topLeft: {
            x: farCenterX - farCellWidth / 2,
            y: farCenterY - farCellHeight / 2
          },
          topRight: {
            x: farCenterX + farCellWidth / 2,
            y: farCenterY - farCellHeight / 2
          },
          bottomLeft: {
            x: farCenterX - farCellWidth / 2,
            y: farCenterY + farCellHeight / 2
          },
          bottomRight: {
            x: farCenterX + farCellWidth / 2,
            y: farCenterY + farCellHeight / 2
          }
        },
        // Near corners (grandes, área de juego) - SIN GAPS
        near: {
          topLeft: { x: nearLeft, y: nearTop },
          topRight: { x: nearRight, y: nearTop },
          bottomLeft: { x: nearLeft, y: nearBottom },
          bottomRight: { x: nearRight, y: nearBottom }
        }
      });
    }
  }

  return rails;
}

const RAILS = generatePerspectiveRails();

// Interpolate quad corners along the rail
function interpolateQuadAlongRail(rail, z) {
  const maxZ = WAVE_CONFIG.spawnZ;
  const minZ = WAVE_CONFIG.arrivalZ;

  // t = 0 when far, t = 1 when near
  const t = 1 - ((z - minZ) / (maxZ - minZ));
  const clampedT = Phaser.Math.Clamp(t, 0, 1);

  // Interpolate each corner
  const lerp = (a, b, t) => a + (b - a) * t;

  return {
    topLeft: {
      x: lerp(rail.far.topLeft.x, rail.near.topLeft.x, clampedT),
      y: lerp(rail.far.topLeft.y, rail.near.topLeft.y, clampedT)
    },
    topRight: {
      x: lerp(rail.far.topRight.x, rail.near.topRight.x, clampedT),
      y: lerp(rail.far.topRight.y, rail.near.topRight.y, clampedT)
    },
    bottomLeft: {
      x: lerp(rail.far.bottomLeft.x, rail.near.bottomLeft.x, clampedT),
      y: lerp(rail.far.bottomLeft.y, rail.near.bottomLeft.y, clampedT)
    },
    bottomRight: {
      x: lerp(rail.far.bottomRight.x, rail.near.bottomRight.x, clampedT),
      y: lerp(rail.far.bottomRight.y, rail.near.bottomRight.y, clampedT)
    },
    center: {
      x: lerp(
        (rail.far.topLeft.x + rail.far.bottomRight.x) / 2,
        (rail.near.topLeft.x + rail.near.bottomRight.x) / 2,
        clampedT
      ),
      y: lerp(
        (rail.far.topLeft.y + rail.far.bottomRight.y) / 2,
        (rail.near.topLeft.y + rail.near.bottomRight.y) / 2,
        clampedT
      )
    },
    // Sprites are 48x38px
    // Near grid: 100x80px cells, scale 2.0 → 96x76px sprite (2px margin)
    // Far grid: 40x32px cells, scale 0.8 → 38.4x30.4px sprite (0.8px margin, same 2% ratio)
    scale: lerp(0.8, 2.0, clampedT)
  };
}

// Get all rail cells that the condor HITBOX occupies (same as collision)
function getCondorCells() {
  const { x, y, width, height, columns, rows } = PERSPECTIVE_SYSTEM.nearGrid;

  // Get condor HITBOX bounds (same as collision detection - 30×20)
  const condorBounds = {
    left: condor.x - CONFIG.condor.hitboxWidth / 2,
    right: condor.x + CONFIG.condor.hitboxWidth / 2,
    top: condor.y - CONFIG.condor.hitboxHeight / 2,
    bottom: condor.y + CONFIG.condor.hitboxHeight / 2
  };

  const cellWidth = width / columns;
  const cellHeight = height / rows;

  const cells = [];

  // Find which columns the condor hitbox spans
  const startCol = Math.floor((condorBounds.left - x) / cellWidth);
  const endCol = Math.floor((condorBounds.right - x) / cellWidth);

  // Find which rows the condor hitbox spans
  const startRow = Math.floor((condorBounds.top - y) / cellHeight);
  const endRow = Math.floor((condorBounds.bottom - y) / cellHeight);

  // Iterate through all cells the condor hitbox touches
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      // Clamp to valid range
      const clampedCol = Phaser.Math.Clamp(col, 0, columns - 1);
      const clampedRow = Phaser.Math.Clamp(row, 0, rows - 1);

      const cellId = clampedRow * columns + clampedCol;

      // Avoid duplicate cells if clamping caused overlap
      if (!cells.find(c => c.id === cellId)) {
        cells.push({
          col: clampedCol,
          row: clampedRow,
          id: cellId,
          rail: RAILS[cellId]
        });
      }
    }
  }

  return cells.length > 0 ? cells : null;
}

// Check collision between condor and obstacles
function checkCollisions() {
  // Get all cells the condor HITBOX occupies (30×20 red box)
  const condorCells = getCondorCells();
  if (!condorCells) return false; // Condor out of bounds

  // FAST CHECK: Use matrix for O(1) cell lookup
  const hasObstacleInCell = condorCells.some(cell =>
    waveSystem.arrivalMatrix[cell.id] === 1
  );

  // Early exit if no obstacles in condor's cells
  if (!hasObstacleInCell) {
    return false; // No collision possible
  }

  // Get condor HITBOX bounds (same as used for cell detection)
  const condorHitbox = {
    left: condor.x - CONFIG.condor.hitboxWidth / 2,
    right: condor.x + CONFIG.condor.hitboxWidth / 2,
    top: condor.y - CONFIG.condor.hitboxHeight / 2,
    bottom: condor.y + CONFIG.condor.hitboxHeight / 2
  };

  // PRECISE CHECK: Only check obstacles that are in arrival zone and match the wave
  for (let obs of waveSystem.activeObstacles) {
    // Only check obstacles from the wave currently in arrival zone
    if (obs.waveId === waveSystem.arrivalWaveId &&
        obs.z <= WAVE_CONFIG.arrivalZ + 100 &&
        obs.z >= WAVE_CONFIG.arrivalZ - 50) {
      // Check if obstacle is in any of the cells the condor occupies
      const obstacleInCondorCell = condorCells.some(cell => cell.id === obs.railId);

      if (obstacleInCondorCell) {
        // Get obstacle quad at current Z position
        const quad = interpolateQuadAlongRail(obs.rail, obs.z);

        // Calculate obstacle bounds from quad corners
        const obsBounds = {
          left: Math.min(quad.topLeft.x, quad.bottomLeft.x),
          right: Math.max(quad.topRight.x, quad.bottomRight.x),
          top: Math.min(quad.topLeft.y, quad.topRight.y),
          bottom: Math.max(quad.bottomLeft.y, quad.bottomRight.y)
        };

        // Check rectangle intersection (AABB collision) with HITBOX
        const intersects = !(
          condorHitbox.right < obsBounds.left ||
          condorHitbox.left > obsBounds.right ||
          condorHitbox.bottom < obsBounds.top ||
          condorHitbox.top > obsBounds.bottom
        );

        if (intersects) {
          return obs; // Collision detected!
        }
      }
    }
  }

  return false;
}

// Generate wave pattern
function generateWavePattern(waveNumber) {
  const pattern = [];
  const availableLanes = [...RAILS];

  // Shuffle available lanes
  Phaser.Utils.Array.Shuffle(availableLanes);

  // Select random lanes for this wave
  const count = Math.min(WAVE_CONFIG.obstaclesPerWave, availableLanes.length);

  for (let i = 0; i < count; i++) {
    const rail = availableLanes[i];
    pattern.push({
      laneId: rail.id,
      type: Phaser.Math.Between(0, 2)
    });
  }

  return pattern;
}

// Build a matrix representation of a wave pattern for fast collision detection
function buildMatrixFromPattern(pattern) {
  const matrix = Array(25).fill(0);
  pattern.forEach(obstacle => {
    matrix[obstacle.laneId] = 1;  // Mark cell as having obstacle
  });
  return matrix;
}

// Create wave
function spawnWave(scene, waveNumber, preGeneratedPattern = null) {
  const pattern = preGeneratedPattern || generateWavePattern(waveNumber);
  const newObstacles = [];

  pattern.forEach(data => {
    // Pick random obstacle type (0, 1, or 2)
    const obstacleType = Phaser.Math.Between(0, 2);

    // Create sprite with independent texture
    const obstacleSprite = scene.add.sprite(0, 0, 'obstacle' + obstacleType);
    obstacleSprite.setDepth(DEPTH_LAYERS.OBSTACLES_FAR);
    obstacleSprite.setOrigin(0.5, 0.5); // Center origin
    obstacleSprite.setTint(0xFFFFFF); // Ensure white tint (no color modification)

    // Make UI camera ignore obstacles
    if (uiCameraRef) {
      uiCameraRef.ignore(obstacleSprite);
    }

    newObstacles.push({
      sprite: obstacleSprite,
      railId: data.laneId,
      rail: RAILS[data.laneId],
      z: WAVE_CONFIG.spawnZ,
      obstacleType: obstacleType, // Store which obstacle type
      type: data.type,
      waveId: waveNumber
    });
  });

  console.log(`Wave ${waveNumber}: spawned ${newObstacles.length} obstacles`);
  return newObstacles;
}

// Update debug rails visualization dynamically
function updateDebugRailsGraphics() {
  if (!debugRailsGraphics) return;

  debugRailsGraphics.clear();

  RAILS.forEach(rail => {
    // Draw far quad (spawn) - RED
    debugRailsGraphics.lineStyle(1, 0xFF0000, 0.5);
    debugRailsGraphics.strokeRect(
      rail.far.topLeft.x,
      rail.far.topLeft.y,
      rail.far.topRight.x - rail.far.topLeft.x,
      rail.far.bottomLeft.y - rail.far.topLeft.y
    );

    // Draw near quad (arrival) - GREEN
    debugRailsGraphics.lineStyle(1, 0x00FF00, 0.5);
    debugRailsGraphics.strokeRect(
      rail.near.topLeft.x,
      rail.near.topLeft.y,
      rail.near.topRight.x - rail.near.topLeft.x,
      rail.near.bottomLeft.y - rail.near.topLeft.y
    );

    // Connect corners to show rails - YELLOW
    debugRailsGraphics.lineStyle(1, 0xFFFF00, 0.3);
    debugRailsGraphics.lineBetween(rail.far.topLeft.x, rail.far.topLeft.y, rail.near.topLeft.x, rail.near.topLeft.y);
    debugRailsGraphics.lineBetween(rail.far.topRight.x, rail.far.topRight.y, rail.near.topRight.x, rail.near.topRight.y);
    debugRailsGraphics.lineBetween(rail.far.bottomLeft.x, rail.far.bottomLeft.y, rail.near.bottomLeft.x, rail.near.bottomLeft.y);
    debugRailsGraphics.lineBetween(rail.far.bottomRight.x, rail.far.bottomRight.y, rail.near.bottomRight.x, rail.near.bottomRight.y);
  });
}

// Update preview of next wave in far grid
function updateNextWavePreview(previewGraphics, nextPattern) {
  if (!previewGraphics || !nextPattern) return;
  previewGraphics.clear();

  nextPattern.forEach(data => {
    const rail = RAILS.find(r => r.id === data.laneId);
    if (!rail) return;

    previewGraphics.fillStyle(0xFF6666, 0.25);
    // Light red, 25% opacity
    previewGraphics.fillRect(
      rail.far.topLeft.x,
      rail.far.topLeft.y,
      rail.far.topRight.x - rail.far.topLeft.x,
      rail.far.bottomLeft.y - rail.far.topLeft.y
    );

    // Optional: Add a slightly darker border
    previewGraphics.lineStyle(1, 0xFF0000, 0.3);
    previewGraphics.strokeRect(
      rail.far.topLeft.x,
      rail.far.topLeft.y,
      rail.far.topRight.x - rail.far.topLeft.x,
      rail.far.bottomLeft.y - rail.far.topLeft.y
    );
  });
}

// Debug: Visualizar los rieles en perspectiva
function drawRailsDebug(scene) {
  debugRailsGraphics = scene.add.graphics();
  debugRailsGraphics.setDepth(DEPTH_LAYERS.DEBUG_RAILS);
  updateDebugRailsGraphics();
}

// Audio generation functions
function playKick(time) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(50, time + 0.05);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(200, time);

  gain.gain.setValueAtTime(0.8, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  osc.start(time);
  osc.stop(time + 0.3);
}

function playSnare(time, accent = 1) {
  const noise = audioCtx.createBufferSource();
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.1, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  noise.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(1500, time);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.3 * accent, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  noise.start(time);
  noise.stop(time + 0.1);
}

function playHiHat(time, accent = 0.15) {
  const noise = audioCtx.createBufferSource();
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.03, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  noise.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(7000, time);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(accent, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.03);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  noise.start(time);
  noise.stop(time + 0.03);
}

function playCrash(time) {
  // Create metallic crash cymbal sound using filtered noise
  const noise = audioCtx.createBufferSource();
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.8, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  noise.buffer = buffer;

  // Bandpass filter for metallic cymbal character
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(8000, time);
  filter.Q.value = 0.5;

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.5, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.8);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  noise.start(time);
  noise.stop(time + 0.8);
}

function playDashWhoosh(t, p = 0) {
  const n = audioCtx.createBufferSource();
  const b = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.15, audioCtx.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  n.buffer = b;
  const f = audioCtx.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.setValueAtTime(2000 + p, t);
  f.Q.value = 1.5;
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0.25, t);
  g.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
  n.connect(f);
  f.connect(g);
  g.connect(masterGain);
  n.start(t);
  n.stop(t + 0.15);
}

function playBass(time, note = 0) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  const baseFreq = 65.41; // C2
  const freq = baseFreq * Math.pow(2, note / 12);

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(freq, time);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(400, time);
  filter.Q.setValueAtTime(5, time);

  gain.gain.setValueAtTime(0.25, time);
  gain.gain.setValueAtTime(0.25, time + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  osc.start(time);
  osc.stop(time + 0.2);
}

// Jungle breakbeat pattern (Amen break inspired)
function scheduleBreak(startTime) {
  const sixteenth = beatInterval / 1000;

  // Classic Amen-style pattern 
  const pattern = [
    // "Boom - - Bap"
    { t: 0, k: 1, h: 0.2 },        // 1 - KICK (boom)
    { t: 1, h: 0.05 },             // 2 - soft hat
    { t: 2, h: 0.1, k: 1 },              // 3 - hat
    { t: 3, h: 0.05 },             // 4 - soft hat
    { t: 4, s: 1 },                // 5 - SNARE (bap)
    { t: 5, h: 0.05 },             // 6 - soft hat
    { t: 6, s: 0.3 },              // 7 - ghost snare
    { t: 7, h: 0.1 },              // 8 - hat
    
    // "Ba-boom Bap"  
    { t: 8, k: 0.7, h: 0.1 },      // 9 - soft kick + hat
    { t: 9, k: 1 },                // 10 - KICK (boom)
    { t: 10, h: 0.1 },             // 11 - hat
    { t: 11, s: 0.4 },             // 12 - ghost snare
    { t: 12, s: 1, h: 0.2 },       // 13 - SNARE (bap) + ride
    { t: 13, h: 0.05 },            // 14 - soft hat
    { t: 14, h: 0.1 },             // 15 - hat
    { t: 15, s: 0.5 }              // 16 - closing snare
  ];

  pattern.forEach(hit => {
    const time = startTime + (hit.t * sixteenth);
    if (hit.k) playKick(time);
    if (hit.s) playSnare(time, hit.s);
    if (hit.h) playHiHat(time, hit.h);
  });
}

// Bassline pattern
function scheduleBass(startTime) {
  const sixteenth = beatInterval / 1000;
  const bassPattern = [
    {t:0, n:0}, {t:4, n:7}, {t:8, n:0}, {t:12, n:5},
    {t:16, n:0}, {t:20, n:3}, {t:24, n:0}, {t:28, n:10}
  ];

  // bassPattern.forEach(note => {
  //   playBass(startTime + (note.t * sixteenth), note.n);
  // });
}

// Main music loop
function startMusic() {
  const scheduleAhead = 0.5; // Schedule 500ms ahead
  let lastScheduleTime = audioCtx.currentTime;

  setInterval(() => {
    const currentTime = audioCtx.currentTime;

    while (lastScheduleTime < currentTime + scheduleAhead) {
      scheduleBreak(lastScheduleTime);
      scheduleBass(lastScheduleTime);
      lastScheduleTime += (16 * beatInterval) / 1000; // 2 bars
    }
  }, 100);
}

// Start game (from start screen)
function startGame() {
  if (!sceneRef) return;

  isStartScreen = false;
  gameOver = false;
  score = 0;

  // Hide start screen UI
  startScreenUI.title.setVisible(false);
  startScreenUI.instruction.setVisible(false);

  // Show game UI
  scoreText.setVisible(true);
  debugRailsGraphics.setVisible(true);
  condorCellIndicator.setVisible(true);
  nextWavePreview.setVisible(true);

  // Initialize audio on first start
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().then(() => {
      startMusic();
      console.log('Jungle beats started! 🎵');
    });
  } else if (audioCtx && audioCtx.state !== 'running') {
    startMusic();
    console.log('Jungle beats started! 🎵');
  }

  // Reset condor
  condor.x = 400;
  condor.y = 300;
  condor.rotation = 0;
  condor.setAlpha(1);
  condor.clearTint();

  // Reset dash
  isDashing = false;
  dashProgress = 0;

  // Clear obstacles
  waveSystem.activeObstacles.forEach(obs => obs.sprite.destroy());
  waveSystem.activeObstacles = [];

  // Reset wave system
  waveSystem.currentWave = 0;
  waveSystem.frameCounter = 0;
  waveSystem.nextWavePattern = null;

  // Reset velocity to base (for progressive difficulty)
  CONFIG.obstacles.currentVelocity = CONFIG.obstacles.baseVelocity;
  waveSystem.currentWaveInterval = calculateWaveInterval();

  // Reset BPM to initial (100 BPM)
  musicBPM = 100;
  beatInterval = (60 / musicBPM) * 1000 / 4;

  // Spawn first wave
  const firstWave = spawnWave(sceneRef, 0);
  waveSystem.activeObstacles.push(...firstWave);

  // Generate pattern for wave 1 (next wave) for preview
  waveSystem.nextWavePattern = generateWavePattern(1);

  // Update score
  scoreText.setText(formatScoreFullwidth(0));
}

// Return to start screen (from game over)
function returnToStartScreen() {
  if (!sceneRef) return;

  isStartScreen = true;
  gameOver = false;
  gameOverTimer = 0;

  // Hide game over UI
  gameOverText.setVisible(false);
  scoreBackground.setVisible(false);
  scoreText.setVisible(false);

  // Show start screen UI
  startScreenUI.title.setVisible(true);
  startScreenUI.instruction.setVisible(true);

  // Clear obstacles
  waveSystem.activeObstacles.forEach(obs => obs.sprite.destroy());
  waveSystem.activeObstacles = [];

  // Reset velocity and wave system
  CONFIG.obstacles.currentVelocity = CONFIG.obstacles.baseVelocity;
  waveSystem.currentWaveInterval = calculateWaveInterval();
  waveSystem.frameCounter = 0;

  // Hide grid/rails
  debugRailsGraphics.clear();
  debugRailsGraphics.setVisible(false);
  condorCellIndicator.clear();
  condorCellIndicator.setVisible(false);
  nextWavePreview.clear();
  nextWavePreview.setVisible(false);

  // Reset condor visual
  condor.x = 400;
  condor.y = 300;
  condor.rotation = 0;
  condor.setAlpha(1);
  condor.clearTint();
}

// Restart game (when pressing space in game over)
function restartGame() {
  gameOverTimer = 0;
  gameOverText.setVisible(false);
  scoreBackground.setVisible(false);
  startGame();
}

// Format score to fullwidth Unicode numbers with 9-digit padding
function formatScoreFullwidth(score) {
  const paddedScore = Math.floor(score).toString().padStart(9, '0');
  const fullwidthMap = {
    '0': '０', '1': '１', '2': '２', '3': '３', '4': '４',
    '5': '５', '6': '６', '7': '７', '8': '８', '9': '９'
  };
  return paddedScore.split('').map(d => fullwidthMap[d]).join('');
}

function create() {
  const scene = this;
  sceneRef = this; // Store reference for restart

  // Initialize audio system (music starts when game starts, not immediately)
  if (!audioCtx) {
    audioCtx = this.sound.context;
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  }

  // Store initial farGrid centerY as the base for dynamic perspective
  baseFarGridCenterY = PERSPECTIVE_SYSTEM.farGrid.centerY;

  console.log('Generating heightmap...');
  heightmapData = generateHeightmap(CONFIG.heightmap.size);
  console.log('Heightmap ready!');

  // Debug: verificar algunos valores del heightmap
  console.log('Sample heights:', {
    center: getTerrainHeight(256, 256),
    near: getTerrainHeight(256, 300),
    far: getTerrainHeight(256, 500)
  });

  terrainGraphics = this.add.graphics();
  terrainGraphics.setDepth(DEPTH_LAYERS.TERRAIN);
  terrainGraphics.setScrollFactor(0);

  // Load condor spritesheet from base64 (150×20px, 3 frames of 50×20 each)
  const condorTex = this.textures.addBase64('condor', CONDOR_SPRITE_DATA);
  condorTex.once('onload', () => {
    // Get texture and define frames manually
    const texture = this.textures.get('condor');

    // Add individual frames with string names (source index 0, x, y, width, height)
    texture.add('frame0', 0, 0, 0, 50, 20);
    texture.add('frame1', 0, 50, 0, 50, 20);
    texture.add('frame2', 0, 100, 0, 50, 20);

    // Also add numeric frames for compatibility
    texture.add(0, 0, 0, 0, 50, 20);
    texture.add(1, 0, 50, 0, 50, 20);
    texture.add(2, 0, 100, 0, 50, 20);

    // Create flying animation
    if (!this.anims.exists('condor_fly')) {
      this.anims.create({
        key: 'condor_fly',
        frames: this.anims.generateFrameNumbers('condor', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
      });
    }

    // Start animation if condor exists
    if (condor) {
      condor.play('condor_fly');
    }
  });

  // Create condor sprite (will use frame 0 initially)
  condor = this.add.sprite(400, 300, 'condor', 0);
  condor.setDepth(DEPTH_LAYERS.CONDOR);

  // Load 3 independent obstacle textures (each 50×40px)
  let obstaclesLoaded = 0;
  const checkAllObstaclesLoaded = () => {
    obstaclesLoaded++;
    if (obstaclesLoaded === 3) {
      // All obstacles loaded
      console.log('All obstacle textures loaded');
      // DON'T spawn first wave - it will be spawned when game starts
    }
  };

  // Load each obstacle texture independently
  this.textures.addBase64('obstacle0', OBSTACLES_SPRITE_0).once('onload', checkAllObstaclesLoaded);
  this.textures.addBase64('obstacle1', OBSTACLES_SPRITE_1).once('onload', checkAllObstaclesLoaded);
  this.textures.addBase64('obstacle2', OBSTACLES_SPRITE_2).once('onload', checkAllObstaclesLoaded);

  // Visual indicator for condor's cell (hidden in start screen)
  condorCellIndicator = this.add.graphics();
  condorCellIndicator.setDepth(DEPTH_LAYERS.CELL_INDICATOR);
  condorCellIndicator.setVisible(false);

  // Preview indicator for next wave cells
  nextWavePreview = this.add.graphics();
  nextWavePreview.setDepth(DEPTH_LAYERS.DEBUG_RAILS - 10); // Behind debug rails
  nextWavePreview.setVisible(false); // Hidden in start screen

  // Visual indicator for condor's hitbox (collision area)
  condorHitboxIndicator = this.add.graphics();
  condorHitboxIndicator.setDepth(DEPTH_LAYERS.UI - 1); // Dibuja encima del condor

  // Create virtual camera target (invisible point between condor and grid center)
  cameraTarget = this.add.container(CONFIG.width / 2, CONFIG.height / 2);

  // Configure main camera with zoom and follow
  const mainCamera = this.cameras.main;
  mainCamera.setZoom(CONFIG.camera.zoom);
  mainCamera.startFollow(cameraTarget, true, CONFIG.camera.followLerp, CONFIG.camera.followLerp);

  // Create separate UI camera (no zoom, no rotation, no scroll)
  const uiCamera = this.cameras.add(0, 0, CONFIG.width, CONFIG.height);
  uiCamera.setName('UI Camera');
  uiCameraRef = uiCamera; // Store reference for other functions

  // Make UI camera ignore game objects
  uiCamera.ignore([terrainGraphics, condor, condorCellIndicator, condorHitboxIndicator, nextWavePreview]);

  // Initialize new wave system
  waveSystem.activeObstacles = [];
  obstacles = []; // Clear old array

  // First wave will be spawned in obstaclesTex.onload callback

  // Draw perspective rails for debug visualization (hidden in start screen)
  drawRailsDebug(this);
  debugRailsGraphics.setVisible(false);
  uiCamera.ignore(debugRailsGraphics);

  cursors = this.input.keyboard.createCursorKeys();
  spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  const handleSpaceDown = () => {
    const now = Date.now();
    if (isDashing) {
      dashExtendPressTime = now;
    } else {
      spaceKeyPressTime = now;
    }
  };
  this.input.keyboard.on('keydown-SPACE', handleSpaceDown);

  // Semi-transparent red background for score (covers entire screen)
  scoreBackground = this.add.graphics();
  scoreBackground.fillStyle(0xFF0000, 0.75);  // Red with 75% transparency
  scoreBackground.fillRect(0, 0, 800, 600);  // Cover entire screen
  scoreBackground.setDepth(DEPTH_LAYERS.UI - 1).setVisible(false);  // Behind score text, hidden initially

  // Score UI (hidden initially - only shown when game starts)
  scoreText = this.add.text(20, 20, '０００００００００', {
    fontSize: '24px',
    fontFamily: 'Courier New, monospace',
    color: '#ffffff',
    stroke: '#ffffff',
    center: true,
    strokeThickness: 0
  }).setDepth(DEPTH_LAYERS.UI).setVisible(false);

  // Game Over UI (hidden initially)
  gameOverText = this.add.text(400, 300, '', {
    fontSize: '20px',
    fontFamily: 'Courier New, monospace',
    color: '#ffffff',
    stroke: '#ffffff',
    strokeThickness: 0,
    align: 'center'
  }).setOrigin(0.5).setDepth(DEPTH_LAYERS.UI).setVisible(false);

  // Start Screen UI
  const asciiArt = `
 ▄████████  ▄██████▄  ███▄▄▄▄   ████████▄   ▄██████▄  ▀███████████
███    ███ ███    ███ ███▀▀▀██▄ ███   ▀███ ███    ███   ███    ███
███    █▀  ███    ███ ███   ███ ███    ███ ███    ███   ███    ███
███        ███    ███ ███   ███ ███    ███ ███    ███  ▄███▄▄▄▄██▀
███        ███    ███ ███   ███ ███    ███ ███    ███ ▀███████████
███    █▄  ███    ███ ███   ███ ███    ███ ███    ███   ███    ███
███    ███ ███    ███ ███   ███ ███   ▄███ ███    ███   ███    ███
████████▀   ▀██████▀  ███   ███ ████████▀   ▀██████▀    ███    ███`;

  startScreenUI.title = this.add.text(400, 220, asciiArt, {
    fontSize: '14px',
    fontFamily: 'Courier New, monospace',
    color: '#ffffff',
    stroke: '#ffffff',
    strokeThickness: 2,
    align: 'left'
  }).setOrigin(0.5).setDepth(DEPTH_LAYERS.UI);

  startScreenUI.instruction = this.add.text(400, 380, 'Press any button to start', {
    fontSize: '24px',
    fontFamily: 'Arial',
    color: '#ffff00',
    stroke: '#000000',
    strokeThickness: 4
  }).setOrigin(0.5).setDepth(DEPTH_LAYERS.UI);

  // Make main camera ignore UI elements
  mainCamera.ignore([scoreText, scoreBackground, gameOverText, startScreenUI.title, startScreenUI.instruction]);
}

function updateRelativeCamera() {
  const deviation = condor.y - CONFIG.condor.centerY;
  const targetDisplacement = -deviation * CONFIG.camera.displacementFactor;
  worldDisplacementY += (targetDisplacement - worldDisplacementY) * CONFIG.camera.smoothing;
  worldDisplacementY = Phaser.Math.Clamp(
    worldDisplacementY,
    -CONFIG.camera.maxDisplacement,
    CONFIG.camera.maxDisplacement
  );
}

function updateRailsFarPositions() {
  const { farGrid } = PERSPECTIVE_SYSTEM;
  const cols = farGrid.columns;
  const rows = farGrid.rows;
  const farCellWidth = farGrid.width / cols;
  const farCellHeight = farGrid.height / rows;

  RAILS.forEach(rail => {
    const farCenterX = farGrid.centerX - (farGrid.width / 2) + (rail.col + 0.5) * farCellWidth;
    const farCenterY = farGrid.centerY - (farGrid.height / 2) + (rail.row + 0.5) * farCellHeight;

    rail.far.topLeft.y = farCenterY - farCellHeight / 2;
    rail.far.topRight.y = farCenterY - farCellHeight / 2;
    rail.far.bottomLeft.y = farCenterY + farCellHeight / 2;
    rail.far.bottomRight.y = farCenterY + farCellHeight / 2;
  });
}

function updateDynamicPerspective() {
  const deviation = condor.y - CONFIG.condor.centerY;
  const targetShift = -deviation * CONFIG.camera.perspectiveShift;

  currentPerspectiveShift += (targetShift - currentPerspectiveShift) * CONFIG.camera.perspectiveLerp;

  PERSPECTIVE_SYSTEM.farGrid.centerY = baseFarGridCenterY + currentPerspectiveShift;

  updateRailsFarPositions();
  updateDebugRailsGraphics();
  updateNextWavePreview(nextWavePreview, waveSystem.nextWavePattern);
}

function startDash(dirX, dirY) {
  if (isDashing) return;
  isDashing = true;
  dashProgress = 0;
  dashDirection.x = dirX;
  dashDirection.y = dirY;
  dashStartX = condor.x;
  dashStartY = condor.y;
  dashInitialX = condor.x;
  dashInitialY = condor.y;
  allowDoubleDash = true;
  isDoubleDash = false;
  playDashWhoosh(audioCtx.currentTime, 0);
  const isDiagonal = dirX !== 0 && dirY !== 0;
  if (isDiagonal) {
    currentDashDuration = CONFIG.condor.dashDurationDiag;
  } else if (dirX !== 0) {
    currentDashDuration = CONFIG.condor.dashDurationH;
  } else {
    currentDashDuration = CONFIG.condor.dashDurationV;
  }
  const horizontalDist = isDiagonal ? 100 : CONFIG.condor.dashDistanceH;
  const verticalDist = isDiagonal ? 80 : CONFIG.condor.dashDistanceV;
  dashTargetX = condor.x + dirX * horizontalDist;
  dashTargetY = condor.y + dirY * verticalDist;
  dashTargetX = Phaser.Math.Clamp(dashTargetX, CONFIG.limits.minX, CONFIG.limits.maxX);
  dashTargetY = Phaser.Math.Clamp(dashTargetY, CONFIG.limits.minY, CONFIG.limits.maxY);
  dashRotation = 0;
}

function extendDash() {
  if (!allowDoubleDash || isDoubleDash) return;
  isDoubleDash = true;
  allowDoubleDash = false;
  playDashWhoosh(audioCtx.currentTime, 500);
  dashTargetX = Phaser.Math.Clamp(dashInitialX + dashDirection.x * 200, CONFIG.limits.minX, CONFIG.limits.maxX);
  dashTargetY = Phaser.Math.Clamp(dashInitialY + dashDirection.y * 160, CONFIG.limits.minY, CONFIG.limits.maxY);
  currentDashDuration *= 2;
}

function updateDash(delta) {
  if (!isDashing) return;

  const deltaFrames = (delta / 1000) * 60;
  dashProgress += deltaFrames;
  const t = dashProgress / currentDashDuration;
  const easedT = Phaser.Math.Clamp(t, 0, 1);
  condor.x = dashStartX + (dashTargetX - dashStartX) * easedT;
  condor.y = dashStartY + (dashTargetY - dashStartY) * easedT;
  const hasHorizontal = dashDirection.x !== 0;
  const hasVertical = dashDirection.y !== 0;
  if (hasHorizontal) {
    const rotationDirection = dashDirection.x;
    dashRotation = rotationDirection * easedT * Math.PI * 2;
    condor.rotation = dashRotation;
    condor.setFrame(2);
  } else if (hasVertical) {
    condor.rotation = 0;
    condor.setFrame(0);
  }
  if (dashProgress >= currentDashDuration) {
    isDashing = false;
    dashProgress = 0;
    condor.rotation = 0;
    dashRotation = 0;
    allowDoubleDash = false;
    isDoubleDash = false;
    dashExtendPressTime = 0;
    condor.play('condor_fly');
  }
}

function updateCondor(delta) {
  const deltaFrames = (delta / 1000) * 60;
  if (Phaser.Input.Keyboard.JustDown(spaceKey) && !isDashing) {
    spaceKeyPressTime = Date.now();
  }
  const timeSinceSpace = Date.now() - spaceKeyPressTime;
  const withinBuffer = timeSinceSpace < spaceKeyBufferWindow && timeSinceSpace > 0;

  if (withinBuffer && !isDashing) {
    let dirX = 0;
    let dirY = 0;
    if (cursors.left.isDown || Phaser.Input.Keyboard.JustDown(cursors.left)) {
      dirX = -1;
    } else if (cursors.right.isDown || Phaser.Input.Keyboard.JustDown(cursors.right)) {
      dirX = 1;
    }

    if (cursors.up.isDown || Phaser.Input.Keyboard.JustDown(cursors.up)) {
      dirY = -1;
    } else if (cursors.down.isDown || Phaser.Input.Keyboard.JustDown(cursors.down)) {
      dirY = 1;
    }

    if (dirX !== 0 || dirY !== 0) {
      startDash(dirX, dirY);
      spaceKeyPressTime = 0;
    }
  }

  if (isDashing) {
    if (Phaser.Input.Keyboard.JustDown(spaceKey)) dashExtendPressTime = Date.now();
    if (Date.now() - dashExtendPressTime < 100 && dashExtendPressTime && allowDoubleDash && !isDoubleDash) extendDash(), dashExtendPressTime = 0;
    updateDash(delta);
    CONFIG.condor.prevX = condor.x;
    CONFIG.condor.prevY = condor.y;
    return;
  }
  let targetX = condor.x;
  let targetY = condor.y;

  const speed = CONFIG.condor.speed * deltaFrames;

  if (cursors.left.isDown) targetX -= speed;
  if (cursors.right.isDown) targetX += speed;
  if (cursors.up.isDown) targetY -= speed;
  if (cursors.down.isDown) targetY += speed;

  targetX = Phaser.Math.Clamp(targetX, CONFIG.limits.minX, CONFIG.limits.maxX);
  targetY = Phaser.Math.Clamp(targetY, CONFIG.limits.minY, CONFIG.limits.maxY);

  CONFIG.condor.prevX = condor.x;
  CONFIG.condor.prevY = condor.y;
  const smoothingAdjusted = 1 - Math.pow(1 - CONFIG.condor.smoothing, deltaFrames);
  condor.x += (targetX - condor.x) * smoothingAdjusted;
  condor.y += (targetY - condor.y) * smoothingAdjusted;

  const velX = condor.x - CONFIG.condor.prevX;
  const velY = condor.y - CONFIG.condor.prevY;

  condor.angle = Phaser.Math.Clamp(velX * 2, -15, 15);
  condor.scaleY = Phaser.Math.Clamp(1 + velY * 0.01, 0.9, 1.1);
}

function update(time, delta) {
  const scene = this;
  const deltaFrames = (delta / 1000) * 60;

  // Handle start screen state
  if (isStartScreen) {
    // Keep terrain animating
    CONFIG.camera.worldZ += CONFIG.obstacles.currentVelocity * deltaFrames;
    renderHeightmap(terrainGraphics, CONFIG.camera);

    // Detect any input to start game
    const anyKeyPressed = scene.input.keyboard.checkDown(scene.input.keyboard.addKey(''), 1);
    const arrowPressed = cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown;
    const mouseClicked = scene.input.activePointer.isDown;

    if (Phaser.Input.Keyboard.JustDown(spaceKey) || arrowPressed || mouseClicked ||
        scene.input.keyboard.keys && Object.values(scene.input.keyboard.keys).some(key => Phaser.Input.Keyboard.JustDown(key))) {
      startGame();
    }

    // Don't update game logic in start screen
    return;
  }

  // Handle game over state
  if (gameOver) {
    // Increment game over timer
    gameOverTimer += delta;

    // After 10 seconds, return to start screen
    if (gameOverTimer >= 10000) {
      returnToStartScreen();
      return;
    }

    // Check for restart input
    if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
      restartGame();
    }
    // Don't update game logic when game is over
    return;
  }

  // Increment score (20 points per second at 60fps)
  score += delta / 50;

  updateCondor(delta);

  // Update virtual camera target position (interpolate between condor and grid center)
  const gridCenterX = CONFIG.width / 2; // 400
  const gridCenterY = CONFIG.height / 2; // 300
  const pullFactor = CONFIG.camera.centerPullFactor; // 0.5 by default
  const virtualX = condor.x + (gridCenterX - condor.x) * pullFactor;
  const virtualY = condor.y + (gridCenterY - condor.y) * pullFactor;
  cameraTarget.setPosition(virtualX, virtualY);

  updateDynamicPerspective();

  // Apply camera rotation based on condor movement
  const velX = condor.x - CONFIG.condor.prevX;
  const targetRotation = velX * CONFIG.camera.rotationSensitivity;
  const clampedRotation = Phaser.Math.Clamp(targetRotation, -CONFIG.camera.maxRotation, CONFIG.camera.maxRotation);
  const currentRotation = scene.cameras.main.rotation;
  const newRotation = currentRotation + (clampedRotation - currentRotation) * 0.1;
  scene.cameras.main.setRotation(newRotation);

  updateRelativeCamera();

  // Update condor cell indicator - draw ALL rails the condor occupies (far to near)
  const condorCells = getCondorCells();
  condorCellIndicator.clear();

  if (condorCells) {
    // FAST matrix check instead of looping through all obstacles
    const hasObstacleInCell = condorCells.some(cell =>
      waveSystem.arrivalMatrix[cell.id] === 1
    );

    // Choose color based on obstacle presence
    // Red (0xFF4444) when over obstacle, light mint green (0xAAFFAA) when safe
    const indicatorColor = hasObstacleInCell ? 0xFF4444 : 0xAAFFAA;

    // Draw all rails the condor is currently in (from far to near)
    condorCells.forEach(cell => {
      const rail = cell.rail;

      // Draw connecting lines from far to near (4 corners)
      condorCellIndicator.lineStyle(2, indicatorColor, 0.6);

      // Top-left corner line
      condorCellIndicator.lineBetween(
        rail.far.topLeft.x, rail.far.topLeft.y,
        rail.near.topLeft.x, rail.near.topLeft.y
      );

      // Top-right corner line
      condorCellIndicator.lineBetween(
        rail.far.topRight.x, rail.far.topRight.y,
        rail.near.topRight.x, rail.near.topRight.y
      );

      // Bottom-left corner line
      condorCellIndicator.lineBetween(
        rail.far.bottomLeft.x, rail.far.bottomLeft.y,
        rail.near.bottomLeft.x, rail.near.bottomLeft.y
      );

      // Bottom-right corner line
      condorCellIndicator.lineBetween(
        rail.far.bottomRight.x, rail.far.bottomRight.y,
        rail.near.bottomRight.x, rail.near.bottomRight.y
      );

      // Far quad border (recuadro)
      condorCellIndicator.lineStyle(2, indicatorColor, 0.8);
      condorCellIndicator.strokeRect(
        rail.far.topLeft.x,
        rail.far.topLeft.y,
        rail.far.topRight.x - rail.far.topLeft.x,
        rail.far.bottomLeft.y - rail.far.topLeft.y
      );

      // Near quad border (thicker)
      condorCellIndicator.lineStyle(3, indicatorColor, 0.8);
      condorCellIndicator.strokeRect(
        rail.near.topLeft.x,
        rail.near.topLeft.y,
        rail.near.topRight.x - rail.near.topLeft.x,
        rail.near.bottomLeft.y - rail.near.topLeft.y
      );
    });
  }

  // Update camera worldZ (forward movement) - adjusted for deltaFrames
  CONFIG.camera.worldZ += CONFIG.obstacles.currentVelocity * deltaFrames;

  // Keep camera X centered
  CONFIG.camera.worldX = 256; // Center of 512 heightmap

  // Render heightmap terrain
  renderHeightmap(terrainGraphics, CONFIG.camera);

  // Frame-based wave system - adjusted for deltaFrames
  waveSystem.frameCounter += deltaFrames;

  // Spawn new wave based on dynamic interval
  if (waveSystem.frameCounter >= waveSystem.currentWaveInterval) {
    waveSystem.frameCounter = 0;
    waveSystem.currentWave++;

    // Update velocity using logarithmic growth curve
    CONFIG.obstacles.currentVelocity = calculateVelocity(waveSystem.currentWave);

    // Update BPM based on new velocity (100 → 170 BPM)
    musicBPM = calculateBPM();
    beatInterval = (60 / musicBPM) * 1000 / 4;

    // Use pre-generated pattern or generate if first wave
    const pattern = waveSystem.nextWavePattern || generateWavePattern(waveSystem.currentWave);
    const newWave = spawnWave(scene, waveSystem.currentWave, pattern);
    waveSystem.activeObstacles.push(...newWave);

    // Generate and store NEXT wave pattern for preview
    waveSystem.nextWavePattern = generateWavePattern(waveSystem.currentWave + 1);

    // Calculate interval for next wave based on new velocity
    waveSystem.currentWaveInterval = calculateWaveInterval();

    // Debug log (future: trigger beat/sound here)
    console.log(`Wave ${waveSystem.currentWave}: v=${CONFIG.obstacles.currentVelocity.toFixed(2)}, interval=${Math.round(waveSystem.currentWaveInterval)}f`);
  }

  // Update active obstacles
  let closestZ = 1000;

  // Use reverse iteration to safely remove obstacles with splice
  for (let i = waveSystem.activeObstacles.length - 1; i >= 0; i--) {
    const obs = waveSystem.activeObstacles[i];

    // Velocidad dinámica basada en proximidad
    const proximityFactor = 1 - (obs.z / WAVE_CONFIG.spawnZ);
    const minSpeed = CONFIG.obstacles.currentVelocity * CONFIG.obstacles.minSpeedMultiplier;
    const maxSpeed = CONFIG.obstacles.currentVelocity * CONFIG.obstacles.maxSpeedMultiplier;
    const dynamicSpeed = minSpeed + (maxSpeed - minSpeed) * proximityFactor;

    obs.z -= dynamicSpeed * deltaFrames;

    // Remove if passed camera
    if (obs.z < CONFIG.render.despawnDistance) {
      obs.sprite.destroy();
      waveSystem.activeObstacles.splice(i, 1);
      continue;
    }

    if (obs.z < closestZ) closestZ = obs.z;

    // Interpolate quad along rail to get position and scale
    const quad = interpolateQuadAlongRail(obs.rail, obs.z);

    // Position sprite at center of quad
    obs.sprite.setPosition(quad.center.x, quad.center.y);

    // Scale sprite based on Z distance
    // Sprite size: 48×38px
    // Near: 100×80px cells, scale 2.0 → 96×76px (2px margin)
    // Far: 40×32px cells, scale 0.8 → 38.4×30.4px (0.8px margin, same 2% ratio)
    // quad.scale goes from 0.8 (far) to 2.0 (near)
    obs.sprite.setScale(quad.scale, quad.scale);

    // Mapear Z a un rango que NUNCA supere al condor
    const depthRange = DEPTH_LAYERS.OBSTACLES_NEAR - DEPTH_LAYERS.OBSTACLES_FAR;
    const normalizedZ = (obs.z - WAVE_CONFIG.arrivalZ) / (WAVE_CONFIG.spawnZ - WAVE_CONFIG.arrivalZ);
    const obstacleDepth = DEPTH_LAYERS.OBSTACLES_FAR + (depthRange * normalizedZ);
    obs.sprite.setDepth(Math.floor(obstacleDepth));

    // Fade in/out
    let alpha = 1;
    if (obs.z > WAVE_CONFIG.spawnZ - 200) {
      alpha = (WAVE_CONFIG.spawnZ - obs.z) / 200;
    }
    if (obs.z < CONFIG.render.fadeOutStart) {
      alpha = obs.z / CONFIG.render.fadeOutStart;
    }
    obs.sprite.setAlpha(Phaser.Math.Clamp(alpha, 0, 1));
  }

  // Update arrival matrix EVERY FRAME to track obstacle movement
  // ZONA MUY AMPLIADA: z de -50 a 1200 = TODA la distancia desde spawn!
  // El indicador se pone rojo DESDE QUE SE VEN los obstáculos
  let waveInArrival = null;
  for (let obs of waveSystem.activeObstacles) {
    // Check if obstacle is in warning zone (covers ENTIRE distance from spawn to player)
    if (obs.z <= WAVE_CONFIG.spawnZ && obs.z >= WAVE_CONFIG.arrivalZ - 50) {
      waveInArrival = obs.waveId;
      break;  // Found wave in warning zone
    }
  }

  // Update arrival matrix EVERY FRAME (not just when wave changes)
  waveSystem.arrivalWaveId = waveInArrival;

  if (waveInArrival !== null) {
    // Build matrix from obstacles of this wave that are currently in warning zone
    waveSystem.arrivalMatrix.fill(0);
    waveSystem.activeObstacles.forEach(obs => {
      // Only add to matrix if obstacle is IN the warning zone right now
      if (obs.waveId === waveInArrival &&
          obs.z <= WAVE_CONFIG.spawnZ &&
          obs.z >= WAVE_CONFIG.arrivalZ - 50) {
        waveSystem.arrivalMatrix[obs.railId] = 1;
      }
    });
  } else {
    // No wave in warning zone - clear matrix
    waveSystem.arrivalMatrix.fill(0);
  }

  // DEBUG: Always log when wave is in arrival zone
  if (!gameOver && waveInArrival !== null && waveSystem.frameCounter % 60 === 0) {
    const condorCells = getCondorCells();
    const matrixOccupied = [];
    const obstaclesInZone = [];

    waveSystem.arrivalMatrix.forEach((val, idx) => {
      if (val === 1) {
        const col = idx % 5;
        const row = Math.floor(idx / 5);
        matrixOccupied.push(`${idx}:(${col},${row})`);
      }
    });

    waveSystem.activeObstacles.forEach(obs => {
      if (obs.waveId === waveInArrival &&
          obs.z <= WAVE_CONFIG.spawnZ &&
          obs.z >= WAVE_CONFIG.arrivalZ - 50) {
        const col = obs.railId % 5;
        const row = Math.floor(obs.railId / 5);
        obstaclesInZone.push(`rail=${obs.railId}:(${col},${row}) z=${obs.z.toFixed(0)}`);
      }
    });

    if (condorCells) {
      const condorPositions = condorCells.map(c => {
        const col = c.id % 5;
        const row = Math.floor(c.id / 5);
        return `${c.id}:(${col},${row})`;
      });

      console.log(`[Matrix Debug] Wave ${waveInArrival} in arrival zone`);
      console.log(`  Condor at cells: ${condorPositions.join(', ')}`);
      console.log(`  Matrix has obstacles at: ${matrixOccupied.length > 0 ? matrixOccupied.join(', ') : 'NONE'}`);
      console.log(`  Actual obstacles in zone: ${obstaclesInZone.length > 0 ? obstaclesInZone.join(' | ') : 'NONE'}`);

      const hasCollisionPotential = condorCells.some(cell => waveSystem.arrivalMatrix[cell.id] === 1);
      console.log(`  Indicator should be: ${hasCollisionPotential ? 'RED ⚠️' : 'GREEN ✓'}`);
    }
  }

  // Check for collisions
  const collision = checkCollisions();
  if (collision && !gameOver) {
    console.log(`GAME OVER! Score: ${Math.floor(score)}`);

    // Activate game over state
    gameOver = true;

    // Play crash cymbal sound
    if (audioCtx) {
      playCrash(audioCtx.currentTime);
    }

    // Reduce BPM to 100 for game over
    musicBPM = 100;
    beatInterval = (60 / musicBPM) * 1000 / 4;

    // Visual feedback
    condor.setTint(0xFF0000);
    condor.setAlpha(0.5);

    // Show game over message
    const gameOverAscii = `
█▀▀ █▀█ █▄█ █▀▀   █▀█ █ █ █▀▀ █▀▄
█ █ █▀█ █ █ █▀▀   █ █ ▀▄▀ █▀▀ █▀▄
▀▀▀ ▀ ▀ ▀ ▀ ▀▀▀   ▀▀▀  ▀  ▀▀▀ ▀ ▀

${formatScoreFullwidth(score)}

Press SPACE to restart`;
    gameOverText.setText(gameOverAscii);
    gameOverText.setVisible(true);
    scoreBackground.setVisible(true);
  }

  // Update UI text
  scoreText.setText(formatScoreFullwidth(score));
}
