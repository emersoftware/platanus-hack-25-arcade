// CÓNDOR - Pseudo-3D Rail Shooter
// A Space Harrier-inspired rail shooter set in the Andes

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

// Game configuration (adjustable via debug sliders)
let CONFIG = {
  condor: {
    speed: 4,
    smoothing: 0.15,
    prevX: 400,
    prevY: 300,
    centerY: 300
  },
  camera: {
    displacementFactor: 0.8,
    maxDisplacement: 200,
    smoothing: 0.1
  },
  obstacles: {
    velocity: 5
  },
  ground: {
    scrollMultiplier: 1.0,
    baseY: 250,
    lineCount: 15,
    spacing: 80
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

// Game state
let worldDisplacementY = 0;
let obstacles = [];
let groundLines = [];
let groundOffsetZ = 0;
let condor;
let cursors;
let debugKey;
let debugVisible = false;
let debugUI = {};
let sliders = [];

// Pseudo-3D projection with camera offset
function project3D(worldX, worldY, z, cameraOffsetY = 0) {
  const scale = FOV / (FOV + z);
  const screenX = 400 + ((worldX - 400) * scale);
  const screenYBase = 300 + (worldY / (z / FOV));
  const screenY = screenYBase + cameraOffsetY;
  return { x: screenX, y: screenY, scale: scale };
}

// Get color based on height
function getColorByHeight(worldY) {
  if (worldY > 50) return 0xFF6B6B;
  if (worldY > -50) return 0xFFD93D;
  if (worldY > -120) return 0x6BCF7F;
  return 0x4D96FF;
}

// Random height from lanes
function getRandomHeight() {
  const lane = Phaser.Utils.Array.GetRandom(HEIGHT_LANES);
  return lane.y + Phaser.Math.Between(-30, 30);
}

function create() {
  const scene = this;

  // Create condor sprite
  condor = this.add.rectangle(400, 300, 60, 40, 0x0000ff);
  condor.setDepth(500);

  // Create obstacles with heights
  const obstacleCount = 12;
  for (let i = 0; i < obstacleCount; i++) {
    const worldX = (Math.random() * 800 - 400) + 400;
    const worldY = getRandomHeight();
    const z = 200 + Math.random() * 800;
    const color = getColorByHeight(worldY);
    const sprite = this.add.rectangle(0, 0, 40, 40, color);

    obstacles.push({
      sprite: sprite,
      worldX: worldX,
      worldY: worldY,
      z: z,
      baseSize: 40
    });
  }

  // Create ground lines
  for (let i = 0; i < CONFIG.ground.lineCount; i++) {
    const worldZ = i * CONFIG.ground.spacing;
    const thickness = 2 + (i % 3);
    const colorShade = i % 2 === 0 ? 0x8B7355 : 0x9B8365;

    const line = this.add.line(400, 0, 0, 0, 800, 0, colorShade, 1);
    line.setLineWidth(thickness);
    line.setDepth(-1000);

    groundLines.push({
      sprite: line,
      worldZ: worldZ,
      baseThickness: thickness
    });
  }

  // Input
  cursors = this.input.keyboard.createCursorKeys();
  debugKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

  // Debug UI setup
  createDebugUI(this);

  // Title
  this.add.text(400, 30, 'CÓNDOR', {
    fontSize: '48px',
    fontFamily: 'Arial',
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: 4
  }).setOrigin(0.5).setDepth(600);

  // Controls hint
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

  // Background panel
  debugUI.bg = scene.add.rectangle(0, 0, 280, 350, 0x000000, 0.85);
  debugUI.bg.setOrigin(0, 0);
  debugUI.container.add(debugUI.bg);

  // Title
  debugUI.title = scene.add.text(10, 10, 'DEBUG PANEL (D to toggle)', {
    fontSize: '14px',
    fontFamily: 'Arial',
    color: '#00ff00',
    fontStyle: 'bold'
  });
  debugUI.container.add(debugUI.title);

  // Status text
  debugUI.status = scene.add.text(10, 35, '', {
    fontSize: '11px',
    fontFamily: 'Arial',
    color: '#ffffff'
  });
  debugUI.container.add(debugUI.status);

  // Sliders
  const y = 120;
  const sliderDefs = [
    { label: 'Condor Speed', prop: ['condor', 'speed'], min: 1, max: 10, step: 0.5 },
    { label: 'Smoothing', prop: ['condor', 'smoothing'], min: 0.05, max: 0.5, step: 0.05 },
    { label: 'Obstacle Vel', prop: ['obstacles', 'velocity'], min: 1, max: 15, step: 0.5 },
    { label: 'Cam Factor', prop: ['camera', 'displacementFactor'], min: 0.3, max: 1.5, step: 0.1 },
    { label: 'Ground Scroll', prop: ['ground', 'scrollMultiplier'], min: 0.5, max: 2, step: 0.1 },
    { label: 'Max Cam Disp', prop: ['camera', 'maxDisplacement'], min: 100, max: 400, step: 10 }
  ];

  sliderDefs.forEach((def, i) => {
    const slider = createSlider(scene, 10, y + i * 35, 260, def);
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
    fontSize: '11px',
    fontFamily: 'Arial',
    color: '#ffff00'
  });

  const valueText = scene.add.text(x + width - 40, y - 15, value.toFixed(2), {
    fontSize: '11px',
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

    slider.value.setText(currentVal.toFixed(2));
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
  const scaleY = 1 + (velY * 0.01);
  condor.scaleY = Phaser.Math.Clamp(scaleY, 0.9, 1.1);
}

function updateGround(velocity) {
  groundOffsetZ += velocity * CONFIG.ground.scrollMultiplier;

  groundLines.forEach(line => {
    const z = line.worldZ - groundOffsetZ;

    if (z < -CONFIG.ground.spacing) {
      line.worldZ += CONFIG.ground.lineCount * CONFIG.ground.spacing;
    }

    const zActual = line.worldZ - groundOffsetZ;
    if (zActual > 0 && zActual < 1000) {
      const scale = FOV / (FOV + zActual);
      const screenY = 300 + (CONFIG.ground.baseY * scale);
      line.sprite.y = screenY + worldDisplacementY;
      line.sprite.setAlpha(1 - (zActual / 1000));
      line.sprite.setLineWidth(line.baseThickness * scale);
      line.sprite.setDepth(-zActual - 1000);
      line.sprite.setVisible(true);
    } else {
      line.sprite.setVisible(false);
    }
  });
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
  updateRelativeCamera();
  updateGround(CONFIG.obstacles.velocity);

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
      const range = CONFIG.render.spawnDistance - CONFIG.render.fadeInStart;
      alpha = (CONFIG.render.spawnDistance - obs.z) / range;
    }
    if (obs.z < CONFIG.render.fadeOutStart) {
      alpha = obs.z / CONFIG.render.fadeOutStart;
    }
    obs.sprite.setAlpha(Phaser.Math.Clamp(alpha, 0, 1));
  });

  if (debugVisible) {
    updateSliders(scene);
    const fps = Math.round(1000 / delta);
    debugUI.status.setText([
      `FPS: ${fps}`,
      `Condor Y: ${Math.round(condor.y)}`,
      `World Disp Y: ${Math.round(worldDisplacementY)}`,
      `Velocity: ${CONFIG.obstacles.velocity.toFixed(1)}`,
      `Closest Z: ${Math.round(closestZ)}`,
      `Obstacles: ${obstacles.length}`
    ].join('\n'));
  }
}
