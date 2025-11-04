// CÓNDOR - Heightmap + Sprite Hybrid Rail Shooter
// Combines heightmap terrain (Comanche-style) with pseudo-3D sprites

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
  condor: {
    speed: 10,
    smoothing: 0.35,
    prevX: 400,
    prevY: 300,
    centerY: 300,
    // Hitbox para colisiones (más pequeño que el visual)
    hitboxWidth: 30,   // 1/2 del ancho visual (60)
    hitboxHeight: 20,  // 1/2 del alto visual (40)
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

const FOV = 300;

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

// 4x4 Bayer matrix for ordered dithering
const BAYER_MATRIX = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
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
let waveText;
let condorCellIndicator;
let condorHitboxIndicator;
let debugRailsGraphics = null;

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
  return BAYER_MATRIX[y % 4][x % 4] / 16;
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

function reducePalette(color, levels = 8) {
  const r = (color >> 16) & 0xFF;
  const g = (color >> 8) & 0xFF;
  const b = color & 0xFF;

  const step = 255 / (levels - 1);
  const nr = Math.round(r / step) * step;
  const ng = Math.round(g / step) * step;
  const nb = Math.round(b / step) * step;

  return (nr << 16) | (ng << 8) | nb;
}

function renderHeightmap(gfx, camera) {
  gfx.clear();
  const w = CONFIG.width, h = CONFIG.height;
  const horizon = CONFIG.heightmap.horizon;
  const step = 2;

  // Sky/fog color
  const skyR = 135, skyG = 206, skyB = 235;

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
    const color = Phaser.Math.Between(0, 3) === 0 ? 0xFF6B6B :
                  Phaser.Math.Between(0, 2) === 0 ? 0xFFD93D : 0x6BCF7F;

    // Use Graphics to draw arbitrary quads
    const gfx = scene.add.graphics();
    gfx.setDepth(DEPTH_LAYERS.OBSTACLES_FAR);

    newObstacles.push({
      sprite: gfx,
      railId: data.laneId,
      rail: RAILS[data.laneId],
      z: WAVE_CONFIG.spawnZ,
      color: color,
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

function create() {
  const scene = this;

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

  condor = this.add.rectangle(400, 300, 60, 40, 0x0000ff);
  condor.setDepth(DEPTH_LAYERS.CONDOR);

  // Visual indicator for condor's cell
  condorCellIndicator = this.add.graphics();
  condorCellIndicator.setDepth(DEPTH_LAYERS.CELL_INDICATOR);

  // Visual indicator for condor's hitbox (collision area)
  condorHitboxIndicator = this.add.graphics();
  condorHitboxIndicator.setDepth(DEPTH_LAYERS.UI - 1); // Dibuja encima del condor

  // Configure main camera with zoom and follow
  const mainCamera = this.cameras.main;
  mainCamera.setZoom(CONFIG.camera.zoom);
  mainCamera.startFollow(condor, true, CONFIG.camera.followLerp, CONFIG.camera.followLerp);

  // Initialize new wave system
  waveSystem.activeObstacles = [];
  obstacles = []; // Clear old array

  // Spawn first wave immediately
  const firstWave = spawnWave(this, 0);
  waveSystem.activeObstacles.push(...firstWave);

  // Draw perspective rails for debug visualization
  drawRailsDebug(this);

  cursors = this.input.keyboard.createCursorKeys();
  spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  debugKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

  createDebugUI(this);

  this.add.text(400, 30, 'CÓNDOR', {
    fontSize: '48px',
    fontFamily: 'Arial',
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: 4
  }).setOrigin(0.5).setDepth(DEPTH_LAYERS.UI);

  // Wave UI
  waveText = this.add.text(20, 20, 'Wave: 0', {
    fontSize: '18px',
    fontFamily: 'Arial',
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: 3
  }).setDepth(DEPTH_LAYERS.UI);

  this.add.text(400, 570, 'Arrows: Move | SPACE+Dir: Barrel Roll | D: Debug', {
    fontSize: '14px',
    fontFamily: 'Arial',
    color: '#000000',
    backgroundColor: '#ffffff',
    padding: { x: 5, y: 2 }
  }).setOrigin(0.5).setDepth(DEPTH_LAYERS.UI);
}

function createDebugUI(scene) {
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
function updateDash() {
  if (!isDashing) return;

  dashProgress++;

  // Linear interpolation for position
  const t = dashProgress / CONFIG.condor.dashDuration;
  const easedT = t; // Linear movement (could add easing here)

  condor.x = dashStartX + (dashTargetX - dashStartX) * easedT;
  condor.y = dashStartY + (dashTargetY - dashStartY) * easedT;

  // Barrel roll rotation for horizontal movement
  if (dashDirection.x !== 0) {
    dashRotation = (dashProgress / CONFIG.condor.dashDuration) * Math.PI * 2; // 360 degrees
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

function updateCondor() {
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
    updateDash();

    // Store prev positions for camera
    CONFIG.condor.prevX = condor.x;
    CONFIG.condor.prevY = condor.y;
    return;
  }

  // Normal movement (not dashing)
  let targetX = condor.x;
  let targetY = condor.y;

  if (cursors.left.isDown) targetX -= CONFIG.condor.speed;
  if (cursors.right.isDown) targetX += CONFIG.condor.speed;
  if (cursors.up.isDown) targetY -= CONFIG.condor.speed;
  if (cursors.down.isDown) targetY += CONFIG.condor.speed;

  targetX = Phaser.Math.Clamp(targetX, CONFIG.limits.minX, CONFIG.limits.maxX);
  targetY = Phaser.Math.Clamp(targetY, CONFIG.limits.minY, CONFIG.limits.maxY);

  CONFIG.condor.prevX = condor.x;
  CONFIG.condor.prevY = condor.y;

  condor.x += (targetX - condor.x) * CONFIG.condor.smoothing;
  condor.y += (targetY - condor.y) * CONFIG.condor.smoothing;

  const velX = condor.x - CONFIG.condor.prevX;
  const velY = condor.y - CONFIG.condor.prevY;

  condor.angle = Phaser.Math.Clamp(velX * 2, -15, 15);
  condor.scaleY = Phaser.Math.Clamp(1 + velY * 0.01, 0.9, 1.1);
}

function update(time, delta) {
  const scene = this;

  if (Phaser.Input.Keyboard.JustDown(debugKey)) {
    debugVisible = !debugVisible;
    debugUI.container.setVisible(debugVisible);
  }

  updateCondor();
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

  // Update camera worldZ (forward movement)
  CONFIG.camera.worldZ += CONFIG.obstacles.velocity;

  // Keep camera X centered
  CONFIG.camera.worldX = 256; // Center of 512 heightmap

  // Render heightmap terrain
  renderHeightmap(terrainGraphics, CONFIG.camera);

  // Frame-based wave system
  waveSystem.frameCounter++;

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

    obs.z -= dynamicSpeed;

    // Remove if passed camera
    if (obs.z < CONFIG.render.despawnDistance) {
      obs.sprite.destroy();
      waveSystem.activeObstacles.splice(i, 1);
      continue;
    }

    if (obs.z < closestZ) closestZ = obs.z;

    // Interpolate quad along rail
    const quad = interpolateQuadAlongRail(obs.rail, obs.z);

    // Clear and redraw the quad
    obs.sprite.clear();
    obs.sprite.fillStyle(obs.color);

    // Draw quad with 4 corners
    obs.sprite.beginPath();
    obs.sprite.moveTo(quad.topLeft.x, quad.topLeft.y);
    obs.sprite.lineTo(quad.topRight.x, quad.topRight.y);
    obs.sprite.lineTo(quad.bottomRight.x, quad.bottomRight.y);
    obs.sprite.lineTo(quad.bottomLeft.x, quad.bottomLeft.y);
    obs.sprite.closePath();
    obs.sprite.fillPath();

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
  if (collision) {
    console.log(`COLLISION! Wave ${collision.waveId}, Rail ${collision.railId}`);

    // Visual feedback
    condor.setTint(0xFF0000);
    scene.time.delayedCall(200, () => {
      condor.clearTint();
    });

    // Remove the obstacle
    collision.sprite.destroy();
    const index = waveSystem.activeObstacles.indexOf(collision);
    if (index > -1) {
      waveSystem.activeObstacles.splice(index, 1);
    }

    // TODO: Decrease lives, game over, etc.
  }

  // Update UI text
  waveText.setText(`Wave: ${waveSystem.currentWave}`);

  if (debugVisible) {
    updateSliders(scene);
    const fps = Math.round(1000 / delta);
    const cellInfo = condorCells
      ? `Cells: [${condorCells.map(c => c.id).join(',')}]`
      : 'Out of bounds';

    debugUI.status.setText([
      `FPS: ${fps}`,
      `Wave: ${waveSystem.currentWave}`,
      `Active: ${waveSystem.activeObstacles.length}`,
      `Next: ${WAVE_CONFIG.waveInterval - waveSystem.frameCounter}f`,
      `Closest Z: ${Math.round(closestZ)}`,
      cellInfo,
      `Condor: (${Math.round(condor.x)}, ${Math.round(condor.y)})`
    ].join('\n'));
  }
}
