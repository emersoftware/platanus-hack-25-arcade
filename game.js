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
    centerY: 300
  },
  camera: {
    worldX: 256,
    worldZ: 256,
    height: 100,
    displacementFactor: 0.8,
    maxDisplacement: 200,
    smoothing: 0.1
  },
  heightmap: {
    size: 512,
    maxHeight: 120,
    renderDist: 300,
    horizon: 350,
    step: 2
  },
  obstacles: {
    velocity: 5
  },
  render: {
    spawnDistance: 1000,
    despawnDistance: -200,
    fadeInStart: 950,
    fadeOutStart: 100
  },
  limits: {
    minX: 150,
    maxX: 650,
    minY: 100,
    maxY: 500
  }
};

const FOV = 300;

// Height lanes for obstacles
const HEIGHT_LANES = [
  { name: 'low', y: 100, color: 0xFF6B6B },
  { name: 'mid', y: 0, color: 0xFFD93D },
  { name: 'high', y: -100, color: 0x6BCF7F },
  { name: 'very_high', y: -180, color: 0x4D96FF }
];

// Terrain colors by height
const TERRAIN_COLORS = [
  { h: 120, c: 0xFFFFFF },
  { h: 90, c: 0xC0C0C0 },
  { h: 60, c: 0xA0826D },
  { h: 30, c: 0x8B7355 },
  { h: 0, c: 0x5D4E37 },
];

// Game state
let worldDisplacementY = 0;
let obstacles = [];
let heightmapData = null;
let terrainGraphics = null;
let condor;
let cursors;
let debugKey;
let debugVisible = false;
let debugUI = {};
let sliders = [];

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

          gfx.fillStyle((r << 16) | (g << 8) | b);
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

// Pseudo-3D projection
function project3D(worldX, worldY, z, cameraOffsetY = 0) {
  const scale = FOV / (FOV + z);
  const screenX = 400 + ((worldX - 400) * scale);
  const screenYBase = 300 + (worldY / (z / FOV));
  return { x: screenX, y: screenYBase + cameraOffsetY, scale: scale };
}

function getColorByHeight(worldY) {
  if (worldY > 50) return 0xFF6B6B;
  if (worldY > -50) return 0xFFD93D;
  if (worldY > -120) return 0x6BCF7F;
  return 0x4D96FF;
}

function getRandomHeight() {
  const lane = Phaser.Utils.Array.GetRandom(HEIGHT_LANES);
  return lane.y + Phaser.Math.Between(-30, 30);
}

function create() {
  const scene = this;

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
  terrainGraphics.setDepth(-1000);

  condor = this.add.rectangle(400, 300, 60, 40, 0x0000ff);
  condor.setDepth(500);

  const obstacleCount = 12;
  for (let i = 0; i < obstacleCount; i++) {
    const worldX = (Math.random() * 800 - 400) + 400;
    const worldY = getRandomHeight();
    const z = 200 + Math.random() * 800;
    const color = getColorByHeight(worldY);
    const sprite = this.add.rectangle(0, 0, 40, 40, color);
    sprite.setVisible(false); // TEMPORALMENTE OCULTOS

    obstacles.push({
      sprite: sprite,
      worldX: worldX,
      worldY: worldY,
      z: z,
      baseSize: 40
    });
  }

  cursors = this.input.keyboard.createCursorKeys();
  debugKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

  createDebugUI(this);

  this.add.text(400, 30, 'CÓNDOR', {
    fontSize: '48px',
    fontFamily: 'Arial',
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: 4
  }).setOrigin(0.5).setDepth(600);

  this.add.text(400, 570, 'Arrows: Move | D: Debug', {
    fontSize: '14px',
    fontFamily: 'Arial',
    color: '#000000',
    backgroundColor: '#ffffff',
    padding: { x: 5, y: 2 }
  }).setOrigin(0.5).setDepth(600);
}

function createDebugUI(scene) {
  debugUI.container = scene.add.container(0, 0).setDepth(700);
  debugUI.bg = scene.add.rectangle(0, 0, 280, 350, 0x000000, 0.85);
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

function updateCondor() {
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

function recycleObstacle(obs) {
  obs.z = CONFIG.render.spawnDistance;
  obs.worldX = (Math.random() * 800 - 400) + 400;
  obs.worldY = getRandomHeight();
  obs.sprite.fillColor = getColorByHeight(obs.worldY);
}

function update(time, delta) {
  const scene = this;

  if (Phaser.Input.Keyboard.JustDown(debugKey)) {
    debugVisible = !debugVisible;
    debugUI.container.setVisible(debugVisible);
  }

  updateCondor();
  // DISABLED: updateRelativeCamera(); // Temporalmente deshabilitado para probar terreno

  // Update camera worldZ (forward movement)
  CONFIG.camera.worldZ += CONFIG.obstacles.velocity;

  // Keep camera X centered for testing
  CONFIG.camera.worldX = 256; // Center of 512 heightmap

  // Render heightmap terrain
  renderHeightmap(terrainGraphics, CONFIG.camera);

  // TEMPORALMENTE DESHABILITADO PARA PROBAR TERRENO
  /*
  let closestZ = 1000;
  obstacles.forEach(obs => {
    obs.z -= CONFIG.obstacles.velocity;

    if (obs.z < CONFIG.render.despawnDistance) {
      recycleObstacle(obs);
    }

    if (obs.z < closestZ) closestZ = obs.z;

    const projected = project3D(obs.worldX, obs.worldY, obs.z, worldDisplacementY);
    obs.sprite.setPosition(projected.x, projected.y);
    obs.sprite.setScale(projected.scale);
    obs.sprite.setDepth(1000 - obs.z);

    let alpha = 1;
    if (obs.z > CONFIG.render.fadeInStart) {
      alpha = (CONFIG.render.spawnDistance - obs.z) / (CONFIG.render.spawnDistance - CONFIG.render.fadeInStart);
    }
    if (obs.z < CONFIG.render.fadeOutStart) {
      alpha = obs.z / CONFIG.render.fadeOutStart;
    }
    obs.sprite.setAlpha(Phaser.Math.Clamp(alpha, 0, 1));
  });
  */
  let closestZ = 0; // Para debug

  if (debugVisible) {
    updateSliders(scene);
    const fps = Math.round(1000 / delta);
    const terrainH = getTerrainHeight(CONFIG.camera.worldX, CONFIG.camera.worldZ);
    debugUI.status.setText([
      `FPS: ${fps}`,
      `Cam: (${Math.round(CONFIG.camera.worldX)}, ${Math.round(CONFIG.camera.worldZ)})`,
      `Height: ${Math.round(CONFIG.camera.height)}`,
      `Terrain: ${Math.round(terrainH)}`,
      `World Disp Y: ${Math.round(worldDisplacementY)}`,
      `Closest Z: ${Math.round(closestZ)}`
    ].join('\n'));
  }
}
