// CÓNDOR - Heightmap + Sprite Hybrid Rail Shooter
// Combines heightmap terrain (Comanche-style) with pseudo-3D sprites

// Sprite data URIs
const CONDOR_SPRITE_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAUCAYAAABvecQxAAAD1ElEQVR4Ae3BS24bZxCF0a+UDGp+a0FGFh54MRzWndck+MMG2ECDoV42KUuIzyH47bf7C84kLa7YDu5g8W1xFnwP7kDS4ort4MHWH38tzuKfv4MvbPFtcRZ8Dx4oOJC0uMF28AMW3xYHwffgB0ha3GA7+ADrj78WB/HP38EXtPi2OAi+Bw/yp6TFKyQtDmwHDyRp8QaSFhe2gxdIWlyxHTyQpMUV28H/QHAgaXGQmcwML7Ed3LDOuCHOuEHS4gWZycxwZDt4haTFK2wHz1hn3BBnPEPS4hW2gw+0zrghzniAPyUtnjEzZCabmeEWSYsL28E7SFq8IjPZzAzXJC0ubAdvkJlsZoadpMWF7eAHSFrckJlsZob/k+BA0uKsu6kqdpnJbmZ4q8zkaGZ4q8xkNzPsupuqYmM7eANJi4vM5GhmeElmcsvM8JLM5Ghm2NkOHkzS4kpmcjQzXLMd3METZ5KWpMVZd1NVbLqbzcywy0wyk6PMJDPJTDKTzCQzuZaZZCaZSWaSmWQmR5lJZrKbGTbdzaaq6G42kpakxStsBxczw1Fm8pzM5DmZyXMyk6OZYWc7eDBJi4vMJDN5TmaSmewkLe4guCJpcdbd7KqKXWbyEWaGXXezqyo2toN3krQ4yEweaWY4sh18AEmLs8xkZthkJrfMDJvMZGbY2A5+0hMHkhYXVcWmquhudjPDzPAoM8PMsOtuqopNVbGTtHgn22E7uDidTpxOJ+7tdDpxOp3Y2Q7bwQebGXYzw7WZYTcz3FNwg6TFle5mU1V8hO5mU1Vcsx38JEmLi+6mqrglM7llZrilu6kqdraDDyZpdTdVxVFmcjQzHHU3VYXt4Cc9cYPtsB0cVBVVRXfT3ey6m013817dzaa72XU33U1VUVUc2Q7bwR3YDi6qiu5m090czQzXZoaj7mbT3VQVO9vBL9TddDe7mWE3M+y6m+7mnoI3krQ46G42VUV3U1V0N1XFW3Q3VUV3U1V0N5uq4sh28GCSFgfdTVWxy0yOZoZdd1NVHNkOfiFJi7PuZldV3NLd7KqKje3gJwU/QNLigWwHv4ikxZXM5GhmuGY7+EQkLc66m6riJd1NVbGxHdxB8CCSFjfYDr4ISYuzzORoZtjYDj4xSYt3sB3cyRMPIGnxDEmL3z6E7eCNbAd39MSdSVq8QtLik5O0uJgZdjPDTtLii8hMrmUmjxLckaTFO9gOPiFJiyuZyWZmuGY7+MQkLS4yk83MsLMd3NkTd2Q7eCPbwSdlO7gyM8wM12wHv/1H8CCSFjfYDr4QSYsbbAdfiKTFDbaDB/gXg94cRwnDgscAAAAASUVORK5CYII=';

const OBSTACLES_SPRITE_0 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAoCAYAAAC8cqlMAAAHtUlEQVR4Ad3BrY4dyRmA4fdYw6cuoT8pqEkXisKa1y0UygBTFzZemWRBGSzxRmNUi4ILLTksMuoijSx9dQmVKzjpGrlXJ2eP52fXGyl5Hp7j7z/fnnjEjz/fnj59/njiGX78+fbEFT/+fHvidzhw5tPnjyf+h/z5T3898MWBLz59/ng6LoGdMdAaGAPTEDkugc4YaA2M4RfTECk1cKk1MAZaA2P4D62BMTxoDWYbOS4BY3jQGhgDrYEx0BoYA62BMdAazDby5z/99cDmFZtPnz+eXr97T8rCrjV+cVwC3WwjrcFsI900RKYhUmpgGiLTEJmGyM4YmIaIMTyYhshutpHWYBoiXamBrjVojQet8aA1HrQGxkBrkLLw+t17Pn3+eGLzis1xCXTeKbvZRoyBaYh0s42UGphtpNTANERKDZQamIZIqYFSA7tpiHSlBrppiByXQDcNkVIDs42UGjAGpiFiDMw2YgzMNmIMzDbSzTZiDA9SFnav372nO7Cxd/bknZKysPNO2c02cqnUwDREHlNqYBoixyVgDLQGs4085rgEjIHW+BVj4IefhEvL/XK4YeOdkrLgnXJutpFSA6UGpiFSauBSqYHdNERKDeymIVJqYLaRUgOzjZQamIZIqYHdNERKDXSzjZQamG2k1EA3DZHjEvjhJ+FrDmzsnT1xhXfKudlGSg2cm4bIc5Ua6FqD2UZKDXTTENkdl8A1KQtfs9wvhxs23ikpC94p51IWvFNmG+lKDUxDpNTANERKDXSlBi5NQ6TUwLlpiJQamG2k1MA0REoNlBqYhkipAWN4MA2RUgPTEHn97j1PObCxd/bEE7xTjIHWwBiYhshjSg100xC5VGqgaw1mG+lKDbTGr6QsPGW5Xw43bLxTupQF75RrUhY+vH1DqYFpiJQa2E1DpNRANw2RUgPdNERKDUxDpNTAuWmIlBooNbCbbaTUwDRESg388JPwXAc29s6eeCbvlHPGQGsw28ilUgNdazDbSFdqoDW+yhhoDVIWnmu5Xw43bLxTUha8Ux6TstDNNlJqYBoipQaMgVIDl6YhUmpgtpFSA7vZRkoNTEOk1MA0REoNTEPkuARSFl7qwMbe2RMv5J2yM4ZfaY0HxkBrYAy0BsbwoDWuSll4qeV+Odyw8U5JWfBOeUrKgndKN9vIt/T63Xuu8U5JWXjMDZuUhS5l4SneKSkLH96+4bgEutlGjkvgtzCGX3gHKQuXUhaecsPGOyVlwTvlKSkL3imdMTANkVIDxsA0REoNTEOk1MA0REoNdNMQKTXQTUOk1EA3DZHjEjCGZ9FVkVG4dGBj7+zJOyVl4bk+vH3DcQnsZhs5LoHdbCPHJfASKQuP0VXpZBTOLffL4YaNd0rKgnfKY1IWOu+UzhiYhkhXasAYmIZIqYFSA7ONlBropiFSamAaIsclMNtIqYFpiByXwGwjEEhZuEZX5TEHNvbOnngm75SUhQ9v33BcArvZRo5L4PdIWbhGV2Uno3BpuV8Or/jCO8U7xTvFO8U7xTvFO8U7xTtl553SzTZiDMw2UmpgthFjYLYRY2C2kW62EWNgtpFuthFjYLaRbrYRY8A75TEyCroquiqXDmz+9o/bU8rCU7xTUha6D2/fcFwC3WwjpQa61vjNUhYu6apcklG4dMMmZcE75SkpC513SmcMTEPkuASMgWmIlBqYhkhXamAaIsclMNvIcQnMNlJqYBoixyUw20ipgWmIQCBl4WtkFHRVLi33y+HAxt7ZE8/knZKy8OHtG45L4FtKWTinq7KTUdBV6WQUzi33y+EVG++UzjvFO8U7xTvFO8U7xTul+/D2DSkL3inHJdDNNmIMzDbSzTZiDBgDs410s40Yw4PZRjpjYLaRbraRa2QUOhmFnYzCNQc29s6eeCbvlJSFa3RVZBR0VV5KRuGSrkono/CY5X45vOIL7xTvlM47pfvw9g3eKTvvlK/RVZFR0FWRUZBR6GQUOhmFTkZhJ6PQySjoqnS6KjsZBRmF5ziw+ds/bk8pC4/xTklZuKSrIqNwSVdFRkFX5SVkFF5quV8Or9ikLHindN4p3imdd0rnnfI1MgreKZdkFHRVZBSeS0ZBV0VX5aVu2HinpCx4p6QsdN4pKQveKSkL53RVOhmFLmXBOyVlodNV6WQUdFVkFHRVnqKrstNV6WQUnuOGTcqCd0rKgndKl7LgnXKNjMLOO6VLWTgno+CdkhB0VX4LGQVdFRmFp9yw8U5JWfBOSVnovFNSFi55p6Qs7FIWzumqyCh4p3z3PcjIb6arIqOgqyKj8JhXbFIWvFNSFrxTvFMueafsvFM675RLMgrdd9/zQFfl99BV6XRVHnPDxjslZcE7JWXhmpQF75SUhc47JWXhGl2Vb0VGQVdFRkFXRUbhmhs2KQveKSkL3ikpCzvvlF3KgndKl7LgndKlLJyTUdBV+RZ0VTpdFRkFXRUZhUs3bLxTUha8U1IWzqUsnEtZ6LxTUhZ2uip/NF0VGYVrXrH57nvwTklZOKersvNOOZey4J2yk1HoZBT+CDIKMgq6Kp2uyrkDX9z+5fbEFzIKuioyCk/RVflvk1HYLffLgc2BM7d/uT3JKOiqyCi8lK7KtyCjoKtyjYyCrkr3r3/+68D/m38Di23MMl3mKdUAAAAASUVORK5CYII=';
const OBSTACLES_SPRITE_1 = 'data:image/png;base64,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';
const OBSTACLES_SPRITE_2 = 'data:image/png;base64,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';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#87CEEB',
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
    renderDist: 300,
    horizon: 350,
    step: 2
  },
  obstacles: {
    velocity: 5,
    minSpeedMultiplier: 0.5,
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
  waveInterval: 180,      // Frames between waves (3 seconds @ 60fps)
  obstaclesPerWave: 8     // Number of obstacles per wave
};

// Wave system state
let waveSystem = {
  currentWave: 0,
  frameCounter: 0,
  activeObstacles: []
};

// Terrain colors by height
const TERRAIN_COLORS = [
  { h: 120, c: 0xFFFFFF },
  { h: 90, c: 0xC0C0C0 },
  { h: 60, c: 0xA0826D },
  { h: 30, c: 0x8B7355 },
  { h: 0, c: 0x5D4E37 },
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
let condor;
let cursors;
let spaceKey;
let debugKey;
let debugVisible = false;
let debugUI = {};
let sliders = [];
let scoreText;
let gameOverText;
let condorCellIndicator;
let condorHitboxIndicator;
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
  const step = 2;

  // Sky/fog color
  const skyR = 135, skyG = 206, skyB = 235;

  // Fill entire screen with sky color to ensure background always covers viewport
  gfx.fillStyle(0x87CEEB);
  gfx.fillRect(0, 0, w, h);

  // Classic voxel space rendering - simple and direct
  for (let screenX = 0; screenX < w; screenX += step) {
    // Y-buffer: track the highest point we've drawn to
    let yBuffer = h; // Start from bottom of screen

    // Calculate ray direction for this column
    const rayAngle = (screenX - w / 2) / w;

    // Cast ray from near to far
    for (let dist = 10; dist < CONFIG.heightmap.renderDist; dist += 2) {
      // Sample terrain at this distance
      const sampleX = camera.worldX + rayAngle * dist * 0.5;
      const sampleZ = camera.worldZ + dist;

      // Get height at this point
      const terrainHeight = getTerrainHeight(sampleX, sampleZ);

      // Simple projection: when camera is ABOVE terrain
      // The terrain should appear BELOW the horizon
      const heightAboveTerrain = camera.height - terrainHeight;

      // Project to screen (inverse of what was "working" when inverted)
      // If it worked at top when formula was: horizon - (height * scale)
      // Then for bottom it should be: horizon + (height * scale)
      const projectedY = horizon + (heightAboveTerrain * 300) / dist;

      // Draw if this creates a visible column
      if (projectedY >= horizon && projectedY < yBuffer) {
        const screenY = Math.floor(projectedY);

        // Only draw if we have something to draw
        if (yBuffer > screenY) {
          // Get color with distance fog
          const baseColor = getTerrainColor(terrainHeight);
          const fog = Math.pow(dist / CONFIG.heightmap.renderDist, 1.5);

          const r = Math.floor(((baseColor >> 16) & 0xFF) * (1 - fog) + skyR * fog);
          const g = Math.floor(((baseColor >> 8) & 0xFF) * (1 - fog) + skyG * fog);
          const b = Math.floor((baseColor & 0xFF) * (1 - fog) + skyB * fog);

          let finalColor = (r << 16) | (g << 8) | b;
          // Apply dithering for retro effect
          finalColor = applyDithering(finalColor, screenX, screenY, 16); // Adjust 16 for more/less dithering

          gfx.fillStyle(finalColor);
          gfx.fillRect(screenX, screenY, step, yBuffer - screenY);

          // Update y-buffer
          yBuffer = screenY;
        }
      }

      // Stop if we've filled to horizon
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
function spawnWave(scene, waveNumber) {
  const pattern = generateWavePattern(waveNumber);
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

  // Spawn first wave
  const firstWave = spawnWave(sceneRef, 0);
  waveSystem.activeObstacles.push(...firstWave);

  // Update score
  scoreText.setText('Score: 0');
}

// Return to start screen (from game over)
function returnToStartScreen() {
  if (!sceneRef) return;

  isStartScreen = true;
  gameOver = false;
  gameOverTimer = 0;

  // Hide game over UI
  gameOverText.setVisible(false);
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
  startGame();
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
  uiCamera.ignore([terrainGraphics, condor, condorCellIndicator, condorHitboxIndicator]);

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

  // Score UI (hidden initially - only shown when game starts)
  scoreText = this.add.text(20, 20, 'Score: 0', {
    fontSize: '24px',
    fontFamily: 'Arial',
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: 4
  }).setDepth(DEPTH_LAYERS.UI).setVisible(false);

  // Game Over UI (hidden initially)
  gameOverText = this.add.text(400, 300, '', {
    fontSize: '48px',
    fontFamily: 'Arial',
    color: '#ff0000',
    stroke: '#000000',
    strokeThickness: 6,
    align: 'center'
  }).setOrigin(0.5).setDepth(DEPTH_LAYERS.UI).setVisible(false);

  // Start Screen UI
  const asciiArt = `
 ▄████████  ▄██████▄  ███▄▄▄▄   ████████▄   ▄██████▄     ▄████████
███    ███ ███    ███ ███▀▀▀██▄ ███   ▀███ ███    ███   ███    ███
███    █▀  ███    ███ ███   ███ ███    ███ ███    ███   ███    ███
███        ███    ███ ███   ███ ███    ███ ███    ███  ▄███▄▄▄▄██▀
███        ███    ███ ███   ███ ███    ███ ███    ███ ▀▀███▀▀▀▀▀  
███    █▄  ███    ███ ███   ███ ███    ███ ███    ███ ▀███████████
███    ███ ███    ███ ███   ███ ███   ▄███ ███    ███   ███    ███
████████▀   ▀██████▀   ▀█   █▀  ████████▀   ▀██████▀    ███    ███
                                                        ███    ███`;

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
  mainCamera.ignore([scoreText, gameOverText, startScreenUI.title, startScreenUI.instruction, debugUI.container]);
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

  // Calculate target position (double of a cell = 200px)
  dashTargetX = condor.x + dirX * CONFIG.condor.dashDistance;
  dashTargetY = condor.y + dirY * CONFIG.condor.dashDistance;

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

  // Barrel roll rotation for horizontal movement
  if (dashDirection.x !== 0) {
    dashRotation = easedT * Math.PI * 2; // 360 degrees
    condor.rotation = dashRotation;
  }

  // End dash
  if (dashProgress >= CONFIG.condor.dashDuration) {
    isDashing = false;
    dashProgress = 0;
    condor.rotation = 0;
    dashRotation = 0;
  }
}

function updateCondor(delta) {
  const deltaFrames = (delta / 1000) * 60 * CONFIG.speedMultiplier;

  // Check for dash input (SPACE + direction)
  if (Phaser.Input.Keyboard.JustDown(spaceKey) && !isDashing) {
    let dirX = 0;
    let dirY = 0;

    if (cursors.left.isDown) dirX = -1;
    else if (cursors.right.isDown) dirX = 1;

    if (cursors.up.isDown) dirY = -1;
    else if (cursors.down.isDown) dirY = 1;

    // Start dash if a direction is pressed
    if (dirX !== 0 || dirY !== 0) {
      startDash(dirX, dirY);
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
    const newWave = spawnWave(scene, waveSystem.currentWave);
    waveSystem.activeObstacles.push(...newWave);
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
    gameOverText.setText(`GAME OVER\nScore: ${Math.floor(score)}\n\nPress SPACE to restart`);
    gameOverText.setVisible(true);
  }

  // Update UI text
  scoreText.setText(`Score: ${Math.floor(score)}`);

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
