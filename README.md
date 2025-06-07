html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #000;
    cursor: crosshair;
}

body.pointer-locked {
    cursor: none;
}

#scene {
    position: relative;
    width: 100%;
    height: 100%;
    perspective: 800px;
    perspective-origin: center;
    overflow: hidden;
    transition: perspective 0.5s ease-in-out;
    /* For FOV punch */
}

/* --- UI FEEDBACK (Updated) --- */
#scene::after {
    content: 'Click to Look Around';
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(255, 255, 255, 0.3);
    font-family: monospace;
    font-size: 14px;
    pointer-events: none;
    opacity: 1;
    transition: opacity 0.5s;
}

body.pointer-locked #scene::after {
    opacity: 0;
}

/* --- NEW: Performance Mode Indicator --- */
#mode-indicator {
    position: absolute;
    top: 10px;
    left: 10px;
    color: rgba(255, 255, 255, 0.5);
    font-family: monospace;
    font-size: 14px;
    z-index: 100;
    pointer-events: none;
}


/* --- VOLUMETRIC NEBULA (SKYBOX) --- */
#skybox-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    will-change: transform;
}

.skybox-face {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 3000px;
    height: 3000px;
    margin-left: -1500px;
    margin-top: -1500px;

    /* Common background properties are set here */
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    /* Make the nebula a bit more visible */
    opacity: 0.61;
    background-blend-mode: screen;
    will-change: transform;
}

/* --- NEW: Apply specific textures to each face --- */
.skybox-face-front {
    background-image: url('pz.png');
}

.skybox-face-back {
    background-image: url('nz.png');
}

.skybox-face-left {
    background-image: url('nx.png');
}

.skybox-face-right {
    background-image: url('px.png');
}

.skybox-face-top {
    background-image: url('ny.png');
}

.skybox-face-bottom {
    background-image: url('py.png');
}


/* Position each face to form a cube */
.skybox-face-front {
    transform: translateZ(1500px);
}

.skybox-face-back {
    transform: rotateY(180deg) translateZ(1500px);
}

.skybox-face-left {
    transform: rotateY(-90deg) translateZ(1500px);
}

.skybox-face-right {
    transform: rotateY(90deg) translateZ(1500px);
}

.skybox-face-top {
    transform: rotateX(90deg) translateZ(1500px);
}

.skybox-face-bottom {
    transform: rotateX(-90deg) translateZ(1500px);
}


#starfield-container,
#dust-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    will-change: transform;
}

.particle {
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    will-change: transform, opacity, filter, box-shadow;
    background-color: var(--particle-color, #fff);

    /* --- OPTIMIZATION: Use CSS variables for transform (Removed streak scale) --- */
    transform:
        translate3d(var(--x, 0px), var(--y, 0px), var(--z, 0px)) rotateZ(var(--rot-z, 0deg)) rotateY(var(--rot-y, 0deg)) rotateX(var(--rot-x, 0deg));
}

.star {
    width: var(--star-size, 3px);
    height: var(--star-size, 3px);
    /* --- OPTIMIZATION: Opacity controlled by a variable --- */
    opacity: var(--star-computed-opacity, 1);
    filter: blur(0.5px);
}

.dust {
    width: var(--dust-size, 1px);
    height: var(--dust-size, 1px);
    opacity: 0.7;
    filter: blur(0.2px);
}


/* --- ADVANCED STAR STYLES --- */
.star.bright {
    box-shadow: 0 0 8px 2px var(--particle-color);
    filter: blur(1px);
    z-index: 10;
}

.star.bright::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -400%;
    width: 900%;
    height: 50%;
    margin-top: -25%;
    background: var(--particle-color);
    border-radius: 50%;
    opacity: 0.15;
    filter: blur(5px);
    transform: scaleX(1.2);
}

/* --- NEAR CAMERA EFFECTS (Replaces Hyperspace) --- */
.star.near-camera {
    /* Apply chromatic aberration and enhanced glow when a star is close */
    box-shadow:
        0 0 8px 2px var(--particle-color),
        1px 0 1px 0px rgba(255, 0, 0, 0.8),
        -1px 0 1px 0px rgba(0, 255, 255, 0.8);
    filter: blur(0.5px);
    z-index: 20;
    /* Ensure it's on top */
}

/* --- NEW: BASIC PERFORMANCE MODE OVERRIDES --- */
/* This class is toggled on the body via JavaScript */
body.basic-effects .star.bright {
    box-shadow: none;
    filter: blur(0.5px);
    /* Reset to basic star blur */
}

body.basic-effects .star.bright::before {
    display: none;
    /* Completely remove the expensive pseudo-element */
}

body.basic-effects .star.near-camera {
    box-shadow: none;
    /* Remove expensive chromatic aberration shadow */
}

body.basic-effects #skybox-container {
    display: none;
    /* Hide the entire skybox */
}

body.basic-effects #dust-container {
    display: none;
    /* Hide all dust particles */
}
