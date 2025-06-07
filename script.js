// A class to encapsulate the entire starfield simulation
class Starfield {
  constructor(config) {
    this.config = config;
    this.state = {
      angleX: 0, angleY: 0, angleZ: 0,
      // camX and camY are no longer needed for camera position
      yawDelta: 0, pitchDelta: 0,
      currentSpeedMultiplier: 1.0, // Kept for potential future use, but not changed
      pointerLocked: false,
      audioStarted: false,
      fullDetail: true // State for effect toggling
    };

    this.lastTime = performance.now();

    this.elements = {
      scene: document.getElementById('scene'),
      skyboxContainer: null,
      starContainer: null,
      dustContainer: null,
      audio: new Audio('ambient-space.mp3'),
      uiModeIndicator: null // UI element for feedback
    };

    this.particles = {
      stars: [],
      dusts: []
    };

    // Pre-bind 'this' for the animation loop and event handlers
    this.animate = this.animate.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this); // Bind keydown handler
  }

  // --- INITIALIZATION ---
  init() {
    this.createContainers();
    this.createAllParticles();
    this.setupAudio();
    this.setupEventListeners();
    this.updateEffectDetail(); // Set initial UI state
    this.animate();
  }

  createContainers() {
    // Skybox
    this.elements.skyboxContainer = document.createElement('div');
    this.elements.skyboxContainer.id = 'skybox-container';
    const skyboxFaces = ['front', 'back', 'left', 'right', 'top', 'bottom'];
    skyboxFaces.forEach(faceName => {
      const faceEl = document.createElement('div');
      faceEl.classList.add('skybox-face', `skybox-face-${faceName}`);
      this.elements.skyboxContainer.appendChild(faceEl);
    });
    this.elements.scene.appendChild(this.elements.skyboxContainer);

    // Particles
    this.elements.starContainer = document.createElement('div');
    this.elements.starContainer.id = 'starfield-container';
    this.elements.scene.appendChild(this.elements.starContainer);

    this.elements.dustContainer = document.createElement('div');
    this.elements.dustContainer.id = 'dust-container';
    this.elements.scene.appendChild(this.elements.dustContainer);

    // Performance Mode Indicator
    this.elements.uiModeIndicator = document.createElement('div');
    this.elements.uiModeIndicator.id = 'mode-indicator';
    document.body.appendChild(this.elements.uiModeIndicator);
  }

  createAllParticles() {
    const { STAR_COUNT, DUST_COUNT, STAR_DISTRIBUTION, DUST_DISTRIBUTION, STAR_SPREAD_X, STAR_SPREAD_Y } = this.config;
    this._createParticleSet(STAR_COUNT, STAR_DISTRIBUTION, STAR_SPREAD_X, STAR_SPREAD_Y, 1, 5, 'star', this.elements.starContainer, this.particles.stars);
    this._createParticleSet(DUST_COUNT, DUST_DISTRIBUTION, STAR_SPREAD_X, STAR_SPREAD_Y, 0.5, 2, 'dust', this.elements.dustContainer, this.particles.dusts);
  }

  _createParticleSet(count, distribution, spreadX, spreadY, baseSize, sizeRange, className, container, particleArray) {
    for (let i = 0; i < count; i++) {
      const particleEl = document.createElement('div');
      particleEl.classList.add('particle', className);

      const size = baseSize + Math.random() * sizeRange;
      particleEl.style.setProperty(`--${className}-size`, `${size}px`);

      if (className === 'star') {
        const colorChoices = ['#FFFFFF', '#FFE484', '#B3DFFF', '#FFD1A1', '#CAD8FF'];
        const color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
        particleEl.style.setProperty('--particle-color', color);
        const op = 0.6 + Math.random() * 0.4;
        particleEl.style.setProperty('--star-opacity', op); // Base opacity
        if (size > 2.8 && Math.random() > 0.5) particleEl.classList.add('bright');
      }

      const x = (Math.random() - 0.5) * spreadX;
      const y = (Math.random() - 0.5) * spreadY;
      const z = (Math.random() - 0.5) * distribution;

      particleEl.style.setProperty('--x', `${x}px`);
      particleEl.style.setProperty('--y', `${y}px`);
      particleEl.style.setProperty('--z', `${z}px`);

      container.appendChild(particleEl);
      particleArray.push({ el: particleEl, x, y, z });
    }
  }

  setupAudio() {
    this.elements.audio.loop = true;
    this.elements.audio.volume = 0.3;
  }

  playAudio() {
    if (this.state.audioStarted) return;
    this.elements.audio.play().catch(e => console.error("Audio playback failed:", e));
    this.state.audioStarted = true;
  }

  // --- EVENT HANDLING ---
  setupEventListeners() {
    this.elements.scene.addEventListener('click', () => {
      this.playAudio();
      if (!this.state.pointerLocked) {
        this.elements.scene.requestPointerLock().catch(e => console.error("Pointer lock failed:", e));
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.state.pointerLocked = (document.pointerLockElement === this.elements.scene);
      document.body.classList.toggle('pointer-locked', this.state.pointerLocked);
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.state.pointerLocked) return;
      this.state.yawDelta += e.movementX * 0.1;
      this.state.pitchDelta += e.movementY * 0.1;
    });

    document.addEventListener('keydown', this.handleKeydown);
  }

  handleKeydown(e) {
    if (e.key.toLowerCase() === 'd') {
      this.state.fullDetail = !this.state.fullDetail;
      this.updateEffectDetail();
    }
  }

  updateEffectDetail() {
    const isFull = this.state.fullDetail;
    document.body.classList.toggle('basic-effects', !isFull);
    if (this.elements.uiModeIndicator) {
      this.elements.uiModeIndicator.textContent = `Details: ${isFull ? 'FULL' : 'BASIC'} (Press 'D' to toggle)`;
    }
  }

  // --- ANIMATION & UPDATES ---
  updateParticles(particleArray, baseSpeed, distribution, dt) {
    const halfDist = distribution / 2;
    // speed is now in px/sec, scaled by dt
    const speed = baseSpeed * dt * this.state.currentSpeedMultiplier;
    const isStar = (particleArray === this.particles.stars);

    for (const p of particleArray) {
      p.z -= speed;
      if (p.z < -halfDist) {
        p.z += distribution;
      }

      // update CSS vars for perspective and rotation
      p.el.style.setProperty('--z', `${p.z}px`);
      p.el.style.setProperty('--rot-x', `${-this.state.angleX}deg`);
      p.el.style.setProperty('--rot-y', `${-this.state.angleY}deg`);
      p.el.style.setProperty('--rot-z', `${-this.state.angleZ}deg`);

      if (isStar) {
        const normZ = (p.z + halfDist) / distribution;
        const opacity = 0.2 + normZ * 0.8;
        const baseOp = parseFloat(p.el.style.getPropertyValue('--star-opacity')) || 1;
        p.el.style.setProperty('--star-computed-opacity', Math.min(1, opacity * baseOp));

        const isNear = p.z < (-halfDist + this.config.PROXIMITY_THRESHOLD);
        p.el.classList.toggle('near-camera', isNear);
      }
    }
  }

  animate(now = performance.now()) {
    // 1) Compute time delta in seconds
    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;

    const s = this.state;
    const c = this.config;

    // 2) Update rotation angles based on per‐second speeds
    s.angleY += (c.ANGULAR_SPEED_Y + s.yawDelta) * dt;
    s.angleX += (c.ANGULAR_SPEED_X + s.pitchDelta) * dt;
    s.angleZ += c.ANGULAR_SPEED_Z * dt;

    // 3) Decay any pointer‐driven deltas (frame‐rate–independent)
    const decay = Math.pow(0.92, dt * 60);
    s.yawDelta *= decay;
    s.pitchDelta *= decay;

    // 4) (Optional) Smooth FOV “punch” if you’re doing perspective jumps
    // this.currentFOV += (this.targetFOV - this.currentFOV) * 0.1 * dt * 60;
    // this.elements.scene.style.perspective = `${this.currentFOV}px`;

    // 5) Apply a single CSS transform to each layer
    const containerTransform = `
      rotateX(${s.angleX}deg)
      rotateY(${s.angleY}deg)
      rotateZ(${s.angleZ}deg)
    `;
    this.elements.starContainer.style.transform = containerTransform;
    this.elements.dustContainer.style.transform = containerTransform;
    this.elements.skyboxContainer.style.transform = containerTransform;

    // 6) Move your particles using the same dt
    this.updateParticles(this.particles.stars, c.BASE_STAR_SPEED, c.STAR_DISTRIBUTION, dt);
    this.updateParticles(this.particles.dusts, c.BASE_DUST_SPEED, c.DUST_DISTRIBUTION, dt);

    // 7) Loop
    requestAnimationFrame(this.animate);
  }

}



// --- CONFIGURATION & LAUNCH ---
const config = {
  STAR_COUNT: 800,
  DUST_COUNT: 100,
  STAR_DISTRIBUTION: 1500,
  DUST_DISTRIBUTION: 1500,
  BASE_STAR_SPEED: 0.2,
  BASE_DUST_SPEED: 0.5,
  ANGULAR_SPEED_X: 1.2,
  ANGULAR_SPEED_Y: 3.2,
  ANGULAR_SPEED_Z: 2,
  PROXIMITY_THRESHOLD: 150,
};

// We don't need CAM_RADIUS anymore, but we still need to spread the stars
// out a bit wider than their Z distribution to avoid seeing the edges.
config.STAR_SPREAD_X = config.STAR_DISTRIBUTION + 500;
config.STAR_SPREAD_Y = config.STAR_DISTRIBUTION + 500;
config.HALF_Z = config.STAR_DISTRIBUTION / 2;

// Create and initialize the starfield.
const starfield = new Starfield(config);
starfield.init();      // your existing init
requestAnimationFrame(starfield.animate);