// CÓNDOR - Heightmap + Sprite Hybrid Rail Shooter
// Combines heightmap terrain (Comanche-style) with pseudo-3D sprites

// Sprite data URIs
const CONDOR_SPRITE_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAUCAYAAABvecQxAAAD1ElEQVR4Ae3BS24bZxCF0a+UDGp+a0FGFh54MRzWndck+MMG2ECDoV42KUuIzyH47bf7C84kLa7YDu5g8W1xFnwP7kDS4ort4MHWH38tzuKfv4MvbPFtcRZ8Dx4oOJC0uMF28AMW3xYHwffgB0ha3GA7+ADrj78WB/HP38EXtPi2OAi+Bw/yp6TFKyQtDmwHDyRp8QaSFhe2gxdIWlyxHTyQpMUV28H/QHAgaXGQmcwML7Ed3LDOuCHOuEHS4gWZycxwZDt4haTFK2wHz1hn3BBnPEPS4hW2gw+0zrghzniAPyUtnjEzZCabmeEWSYsL28E7SFq8IjPZzAzXJC0ubAdvkJlsZoadpMWF7eAHSFrckJlsZob/k+BA0uKsu6kqdpnJbmZ4q8zkaGZ4q8xkNzPsupuqYmM7eANJi4vM5GhmeElmcsvM8JLM5Ghm2NkOHkzS4kpmcjQzXLMd3METZ5KWpMVZd1NVbLqbzcywy0wyk6PMJDPJTDKTzCQzuZaZZCaZSWaSmWQmR5lJZrKbGTbdzaaq6G42kpakxStsBxczw1Fm8pzM5DmZyXMyk6OZYWc7eDBJi4vMJDN5TmaSmewkLe4guCJpcdbd7KqKXWbyEWaGXXezqyo2toN3krQ4yEweaWY4sh18AEmLs8xkZthkJrfMDJvMZGbY2A5+0hMHkhYXVcWmquhudjPDzPAoM8PMsOtuqopNVbGTtHgn22E7uDidTpxOJ+7tdDpxOp3Y2Q7bwQebGXYzw7WZYTcz3FNwg6TFle5mU1V8hO5mU1Vcsx38JEmLi+6mqrglM7llZrilu6kqdraDDyZpdTdVxVFmcjQzHHU3VYXt4Cc9cYPtsB0cVBVVRXfT3ey6m013817dzaa72XU33U1VUVUc2Q7bwR3YDi6qiu5m090czQzXZoaj7mbT3VQVO9vBL9TddDe7mWE3M+y6m+7mnoI3krQ46G42VUV3U1V0N1XFW3Q3VUV3U1V0N5uq4sh28GCSFgfdTVWxy0yOZoZdd1NVHNkOfiFJi7PuZldV3NLd7KqKje3gJwU/QNLigWwHv4ikxZXM5GhmuGY7+EQkLc66m6riJd1NVbGxHdxB8CCSFjfYDr4ISYuzzORoZtjYDj4xSYt3sB3cyRMPIGnxDEmL3z6E7eCNbAd39MSdSVq8QtLik5O0uJgZdjPDTtLii8hMrmUmjxLckaTFO9gOPiFJiyuZyWZmuGY7+MQkLS4yk83MsLMd3NkTd2Q7eCPbwSdlO7gyM8wM12wHv/1H8CCSFjfYDr4QSYsbbAdfiKTFDbaDB/gXg94cRwnDgscAAAAASUVORK5CYII=';

const OBSTACLES_SPRITE_0 = 'data:image/png;base64,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';
const OBSTACLES_SPRITE_1 = 'data:image/png;base64,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';
const OBSTACLES_SPRITE_2 = 'data:image/png;base64,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';

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
  // Speed multiplier: 100Hz monitor / 60Hz baseline = 1.67
  speedMultiplier: 1.67,
  condor: {
    speed: 10,
    smoothing: 0.35,
    prevX: 400,
    prevY: 300,
    centerY: 300,
    // Hitbox para colisiones (más pequeño que el visual 50×20)
    hitboxWidth: 35,   // 70% del ancho visual (50 × 0.7)
    hitboxHeight: 15,  // 75% del alto visual (20 × 0.75)
    // Barrel roll / Dash
    dashDistance: 200, // Doble de una celda (100px por celda)
    dashSpeed: 20,     // Doble de velocidad normal (10 * 2)
    dashDuration: 20   // Frames para completar el dash
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
    perspectiveLerp: 0.1
  },
  heightmap: {
    size: 512,
    maxHeight: 120,
    renderDist: 200,
    horizon: 350,
    step: 3
  },
  obstacles: {
    velocity: 5,
    minSpeedMultiplier: 1.0,
    maxSpeedMultiplier: 3.0
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
  UI: 600,
  DEBUG_UI: 700
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
  waveInterval: 100,      // Frames between waves (~1.67 seconds @ 60fps)
  obstaclesPerWave: 13    // Number of obstacles per wave
};

// Wave system state
let waveSystem = {
  currentWave: 0,
  frameCounter: 0,
  activeObstacles: [],
  nextWavePattern: null  // Stores the pattern for next wave preview
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
let cursors;
let spaceKey;
let debugKey;
let debugVisible = false;
let debugUI = {};
let sliders = [];
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
let musicBPM = 174; // Classic jungle tempo
let beatInterval = (60 / musicBPM) * 1000 / 4; // 16th notes in ms

// Dash / Barrel Roll state
let isDashing = false;
let dashProgress = 0;
let dashDirection = { x: 0, y: 0 };
let dashStartX = 0;
let dashStartY = 0;
let dashTargetX = 0;
let dashTargetY = 0;
let dashRotation = 0;
let spaceKeyPressTime = 0;
let spaceKeyBufferWindow = 150; // ms for input buffer

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
    scale: lerp(0.2, 2.0, clampedT)  // For reference
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

  // Get condor HITBOX bounds (same as used for cell detection)
  const condorHitbox = {
    left: condor.x - CONFIG.condor.hitboxWidth / 2,
    right: condor.x + CONFIG.condor.hitboxWidth / 2,
    top: condor.y - CONFIG.condor.hitboxHeight / 2,
    bottom: condor.y + CONFIG.condor.hitboxHeight / 2
  };

  // Check if any obstacle is in arrival zone and intersects with condor hitbox
  for (let obs of waveSystem.activeObstacles) {
    // Obstacle is in arrival zone (near player)
    if (obs.z < WAVE_CONFIG.arrivalZ + 50 && obs.z > WAVE_CONFIG.arrivalZ - 50) {
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

  // Classic Amen-style pattern over 2 bars (32 sixteenth notes)
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

  // Configure main camera with zoom and follow
  const mainCamera = this.cameras.main;
  mainCamera.setZoom(CONFIG.camera.zoom);
  mainCamera.startFollow(condor, true, CONFIG.camera.followLerp, CONFIG.camera.followLerp);

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
  debugKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

  createDebugUI(this, mainCamera);

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
  mainCamera.ignore([scoreText, scoreBackground, gameOverText, startScreenUI.title, startScreenUI.instruction, debugUI.container]);
}

function createDebugUI(scene, mainCamera) {
  debugUI.container = scene.add.container(0, 0).setDepth(DEPTH_LAYERS.DEBUG_UI);
  debugUI.bg = scene.add.rectangle(0, 0, 280, 640, 0x000000, 0.85);
  debugUI.bg.setOrigin(0, 0);
  debugUI.container.add(debugUI.bg);

  debugUI.title = scene.add.text(10, 10, 'DEBUG (D)', {
    fontSize: '14px',
    fontFamily: 'Arial',
    color: '#00ff00',
    fontStyle: 'bold'
  });
  debugUI.container.add(debugUI.title);

  debugUI.status = scene.add.text(10, 35, '', {
    fontSize: '11px',
    fontFamily: 'Arial',
    color: '#ffffff'
  });
  debugUI.container.add(debugUI.status);

  const y = 130;
  const sliderDefs = [
    { label: 'Condor Speed', prop: ['condor', 'speed'], min: 1, max: 10, step: 0.5 },
    { label: 'Smoothing', prop: ['condor', 'smoothing'], min: 0.05, max: 0.5, step: 0.05 },
    { label: 'Obstacle Vel', prop: ['obstacles', 'velocity'], min: 1, max: 15, step: 0.5 },
    { label: 'Min Speed Mult', prop: ['obstacles', 'minSpeedMultiplier'], min: 0.1, max: 1.0, step: 0.1 },
    { label: 'Max Speed Mult', prop: ['obstacles', 'maxSpeedMultiplier'], min: 1.0, max: 5.0, step: 0.5 },
    { label: 'Cam Zoom', prop: ['camera', 'zoom'], min: 1.0, max: 3.0, step: 0.1 },
    { label: 'Cam Rotation', prop: ['camera', 'rotationSensitivity'], min: 0.0, max: 0.1, step: 0.01 },
    { label: 'Max Rotation', prop: ['camera', 'maxRotation'], min: 0.0, max: 0.3, step: 0.05 },
    { label: 'Perspective Shift', prop: ['camera', 'perspectiveShift'], min: 0.0, max: 1.0, step: 0.1 },
    { label: 'Perspective Lerp', prop: ['camera', 'perspectiveLerp'], min: 0.0, max: 0.5, step: 0.05 },
    { label: 'Cam Factor', prop: ['camera', 'displacementFactor'], min: 0.3, max: 1.5, step: 0.1 },
    { label: 'Cam Height', prop: ['camera', 'height'], min: 50, max: 200, step: 5 },
    { label: 'Max Cam Disp', prop: ['camera', 'maxDisplacement'], min: 100, max: 400, step: 10 }
  ];

  sliderDefs.forEach((def, i) => {
    const slider = createSlider(scene, 10, y + i * 33, 260, def);
    debugUI.container.add(slider.graphics);
    debugUI.container.add(slider.label);
    debugUI.container.add(slider.value);
    sliders.push(slider);
  });

  debugUI.container.setVisible(false);
}

function createSlider(scene, x, y, width, def) {
  const value = CONFIG[def.prop[0]][def.prop[1]];
  const graphics = scene.add.graphics();

  const label = scene.add.text(x, y - 15, def.label, {
    fontSize: '10px',
    fontFamily: 'Arial',
    color: '#ffff00'
  });

  const valueText = scene.add.text(x + width - 40, y - 15, value.toFixed(1), {
    fontSize: '10px',
    fontFamily: 'Arial',
    color: '#00ff00'
  });

  return {
    graphics: graphics,
    label: label,
    value: valueText,
    x: x,
    y: y,
    width: width,
    def: def,
    dragging: false
  };
}

function updateSliders(scene) {
  sliders.forEach(slider => {
    const def = slider.def;
    const currentVal = CONFIG[def.prop[0]][def.prop[1]];
    const percent = (currentVal - def.min) / (def.max - def.min);

    slider.graphics.clear();
    slider.graphics.fillStyle(0x333333);
    slider.graphics.fillRect(slider.x, slider.y, slider.width, 10);
    slider.graphics.fillStyle(0x00ff00);
    slider.graphics.fillRect(slider.x, slider.y, slider.width * percent, 10);
    slider.graphics.lineStyle(1, 0xffffff);
    slider.graphics.strokeRect(slider.x, slider.y, slider.width, 10);

    const pointer = scene.input.activePointer;
    if (pointer.isDown) {
      const sliderBounds = new Phaser.Geom.Rectangle(slider.x, slider.y, slider.width, 10);
      if (Phaser.Geom.Rectangle.Contains(sliderBounds, pointer.x, pointer.y) || slider.dragging) {
        slider.dragging = true;
        const newPercent = Phaser.Math.Clamp((pointer.x - slider.x) / slider.width, 0, 1);
        const newVal = def.min + newPercent * (def.max - def.min);
        CONFIG[def.prop[0]][def.prop[1]] = Math.round(newVal / def.step) * def.step;

        // Apply zoom in real-time
        if (def.prop[0] === 'camera' && def.prop[1] === 'zoom') {
          scene.cameras.main.setZoom(CONFIG.camera.zoom);
        }
      }
    } else {
      slider.dragging = false;
    }

    slider.value.setText(currentVal.toFixed(1));
  });
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

// Start dash/barrel roll
function startDash(dirX, dirY) {
  if (isDashing) return; // Already dashing

  isDashing = true;
  dashProgress = 0;
  dashDirection.x = dirX;
  dashDirection.y = dirY;
  dashStartX = condor.x;
  dashStartY = condor.y;

  // Variable distance: diagonal (2 directions) = 100px, single = 200px
  const isDiagonal = dirX !== 0 && dirY !== 0;
  const distance = isDiagonal ? 100 : CONFIG.condor.dashDistance;

  // Calculate target position
  dashTargetX = condor.x + dirX * distance;
  dashTargetY = condor.y + dirY * distance;

  // Clamp to limits
  dashTargetX = Phaser.Math.Clamp(dashTargetX, CONFIG.limits.minX, CONFIG.limits.maxX);
  dashTargetY = Phaser.Math.Clamp(dashTargetY, CONFIG.limits.minY, CONFIG.limits.maxY);

  dashRotation = 0;
}

// Update dash/barrel roll
function updateDash(delta) {
  if (!isDashing) return;

  const deltaFrames = (delta / 1000) * 60 * CONFIG.speedMultiplier;
  dashProgress += deltaFrames;

  // Linear interpolation for position
  const t = dashProgress / CONFIG.condor.dashDuration;
  const easedT = Phaser.Math.Clamp(t, 0, 1);

  condor.x = dashStartX + (dashTargetX - dashStartX) * easedT;
  condor.y = dashStartY + (dashTargetY - dashStartY) * easedT;

  // Determine movement type
  const hasHorizontal = dashDirection.x !== 0;
  const hasVertical = dashDirection.y !== 0;

  if (hasHorizontal) {
    // HORIZONTAL or DIAGONAL: Rotate with frame 2
    const rotationDirection = dashDirection.x; // -1 or 1
    dashRotation = rotationDirection * easedT * Math.PI * 2;
    condor.rotation = dashRotation;
    condor.setFrame(2); // Frame 3
  } else if (hasVertical) {
    // VERTICAL ONLY: No rotation, freeze frame 0
    condor.rotation = 0;
    condor.setFrame(0); // Frame 1 (frozen)
  }

  // End dash
  if (dashProgress >= CONFIG.condor.dashDuration) {
    isDashing = false;
    dashProgress = 0;
    condor.rotation = 0;
    dashRotation = 0;
    // Return to normal animation
    condor.play('condor_fly');
  }
}

function updateCondor(delta) {
  const deltaFrames = (delta / 1000) * 60 * CONFIG.speedMultiplier;

  // Register SPACE key press for input buffer
  if (Phaser.Input.Keyboard.JustDown(spaceKey) && !isDashing) {
    spaceKeyPressTime = Date.now();
  }

  // Check for dash input (SPACE + direction with buffer)
  const timeSinceSpace = Date.now() - spaceKeyPressTime;
  const withinBuffer = timeSinceSpace < spaceKeyBufferWindow && timeSinceSpace > 0;

  if (withinBuffer && !isDashing) {
    let dirX = 0;
    let dirY = 0;

    // Capture BOTH directions independently (allows diagonals)
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

    // Start dash if direction detected
    if (dirX !== 0 || dirY !== 0) {
      startDash(dirX, dirY);
      spaceKeyPressTime = 0; // Reset buffer
    }
  }

  // If dashing, update dash instead of normal movement
  if (isDashing) {
    updateDash(delta);

    // Store prev positions for camera
    CONFIG.condor.prevX = condor.x;
    CONFIG.condor.prevY = condor.y;
    return;
  }

  // Normal movement (not dashing)
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

  // Smoothing adjusted for deltaFrames
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
  const deltaFrames = (delta / 1000) * 60 * CONFIG.speedMultiplier;

  // Toggle debug UI
  if (Phaser.Input.Keyboard.JustDown(debugKey)) {
    debugVisible = !debugVisible;
    debugUI.container.setVisible(debugVisible);
  }

  // Handle start screen state
  if (isStartScreen) {
    // Keep terrain animating
    CONFIG.camera.worldZ += CONFIG.obstacles.velocity * deltaFrames;
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

  // Increment score (10 points per second at 60fps)
  score += delta / 100;

  updateCondor(delta);
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
    // Draw all rails the condor is currently in (from far to near)
    condorCells.forEach(cell => {
      const rail = cell.rail;

      // Draw connecting lines from far to near (4 corners)
      condorCellIndicator.lineStyle(2, 0x00FFFF, 0.6);

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
      condorCellIndicator.lineStyle(2, 0x00FFFF, 0.8);
      condorCellIndicator.strokeRect(
        rail.far.topLeft.x,
        rail.far.topLeft.y,
        rail.far.topRight.x - rail.far.topLeft.x,
        rail.far.bottomLeft.y - rail.far.topLeft.y
      );

      // Near quad border (thicker)
      condorCellIndicator.lineStyle(3, 0x00FFFF, 0.8);
      condorCellIndicator.strokeRect(
        rail.near.topLeft.x,
        rail.near.topLeft.y,
        rail.near.topRight.x - rail.near.topLeft.x,
        rail.near.bottomLeft.y - rail.near.topLeft.y
      );
    });
  }

  // Draw hitbox indicator (collision area - smaller than visual)
  condorHitboxIndicator.clear();
  if (debugVisible) {
    const hitboxX = condor.x - CONFIG.condor.hitboxWidth / 2;
    const hitboxY = condor.y - CONFIG.condor.hitboxHeight / 2;

    condorHitboxIndicator.lineStyle(2, 0xFF0000, 0.8); // Red border
    condorHitboxIndicator.strokeRect(
      hitboxX,
      hitboxY,
      CONFIG.condor.hitboxWidth,
      CONFIG.condor.hitboxHeight
    );

    condorHitboxIndicator.fillStyle(0xFF0000, 0.2); // Red semi-transparent fill
    condorHitboxIndicator.fillRect(
      hitboxX,
      hitboxY,
      CONFIG.condor.hitboxWidth,
      CONFIG.condor.hitboxHeight
    );
  }

  // Update camera worldZ (forward movement) - adjusted for deltaFrames
  CONFIG.camera.worldZ += CONFIG.obstacles.velocity * deltaFrames;

  // Keep camera X centered
  CONFIG.camera.worldX = 256; // Center of 512 heightmap

  // Render heightmap terrain
  renderHeightmap(terrainGraphics, CONFIG.camera);

  // Frame-based wave system - adjusted for deltaFrames
  waveSystem.frameCounter += deltaFrames;

  // Spawn new wave every X frames
  if (waveSystem.frameCounter >= WAVE_CONFIG.waveInterval) {
    waveSystem.frameCounter = 0;
    waveSystem.currentWave++;

    // Use pre-generated pattern or generate if first wave
    const pattern = waveSystem.nextWavePattern || generateWavePattern(waveSystem.currentWave);
    const newWave = spawnWave(scene, waveSystem.currentWave, pattern);
    waveSystem.activeObstacles.push(...newWave);

    // Generate and store NEXT wave pattern for preview
    waveSystem.nextWavePattern = generateWavePattern(waveSystem.currentWave + 1);
  }

  // Update active obstacles
  let closestZ = 1000;

  // Use reverse iteration to safely remove obstacles with splice
  for (let i = waveSystem.activeObstacles.length - 1; i >= 0; i--) {
    const obs = waveSystem.activeObstacles[i];

    // Velocidad dinámica basada en proximidad
    const proximityFactor = 1 - (obs.z / WAVE_CONFIG.spawnZ);
    const minSpeed = CONFIG.obstacles.velocity * CONFIG.obstacles.minSpeedMultiplier;
    const maxSpeed = CONFIG.obstacles.velocity * CONFIG.obstacles.maxSpeedMultiplier;
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
    // Sprite base size: 50×40
    // Near cell size: 100×80 (requires 2x scale)
    // quad.scale already goes from 0.2 (far) to 2.0 (near)
    // At near: quad.scale=2.0 → 50*2=100, 40*2=80 ✓
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

  // Check for collisions
  const collision = checkCollisions();
  if (collision && !gameOver) {
    console.log(`GAME OVER! Score: ${Math.floor(score)}`);

    // Activate game over state
    gameOver = true;

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

  if (debugVisible) {
    updateSliders(scene);
    const fps = Math.round(1000 / delta);
    const cellInfo = condorCells
      ? `Cells: [${condorCells.map(c => c.id).join(',')}]`
      : 'Out of bounds';

    debugUI.status.setText([
      `FPS: ${fps}`,
      `Score: ${Math.floor(score)}`,
      `Active: ${waveSystem.activeObstacles.length}`,
      `Next: ${WAVE_CONFIG.waveInterval - waveSystem.frameCounter}f`,
      `Closest Z: ${Math.round(closestZ)}`,
      cellInfo,
      `Condor: (${Math.round(condor.x)}, ${Math.round(condor.y)})`
    ].join('\n'));
  }
}
