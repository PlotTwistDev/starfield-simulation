# 3D Starfield Simulation

An immersive, GPU-accelerated 3D starfield animation rendered in pure HTML/CSS/JavaScript.  
Click to engage pointer lock and fly through a dynamic field of stars and dust.

---

## 🚀 Demo

![Starfield Screenshot](docs/screenshot.png)

---

## ✨ Features

- **Smooth, time-based animation**: Eliminates frame-rate “throbbing” by driving rotation and translation from elapsed time.  
- **Configurable speeds**: Adjust static speeds in `config`, or dial up a dynamic `SPEED_MULTIPLIER` at runtime for “warp-drive.”  
- **Pointer-locked look-around**: Click the scene to lock the pointer and swivel your view.  
- **Detail toggle**: Press **D** to switch between full and basic visual detail.  
- **GPU-hinted transforms**: Uses `will-change: transform;` for silky-smooth performance.

---

## 📁 Repository Structure

## 📁 Repository Structure

```
starfield-simulation/
├── index.html
├── style.css
├── script.js
├── README.md
└── docs/
    └── screenshot.png   # optional demo image
```


## 🛠️ Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- (Optional) A local HTTP server for pointer-lock to work consistently

### Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your-username/starfield-simulation.git
   cd starfield-simulation
   ```
2. **Open in browser**  
   - Double-click `index.html`, **or**  
   - Serve via a local server, e.g.:  
     ```bash
     npx http-server .
     ```
3. **Click the scene** to start the animation and lock your cursor.

---

## ⚙️ Configuration

All animation parameters live in the top of **`script.js`**:

```js
const config = {
  STAR_COUNT:        800,
  DUST_COUNT:        100,
  STAR_DISTRIBUTION: 1500,
  DUST_DISTRIBUTION: 1500,

  // Movement speeds in units-per-second
  BASE_STAR_SPEED:   0.2,
  BASE_DUST_SPEED:   0.5,

  // Rotation speeds in degrees-per-second
  ANGULAR_SPEED_X:   0.15,
  ANGULAR_SPEED_Y:   0.40,
  ANGULAR_SPEED_Z:   0.25,

  // Distance at which stars “pop” brighter
  PROXIMITY_THRESHOLD: 150,

  // Global runtime speed multiplier (1.0 = normal)
  SPEED_MULTIPLIER:    1.0,
};
```

- **Static speed**: Raise `BASE_*` and `ANGULAR_SPEED_*` for a constant speed increase.  
- **Runtime warp**:  
  ```js
  // 2× speed:
  starfield.config.SPEED_MULTIPLIER = 2.0;
  // back to normal:
  starfield.config.SPEED_MULTIPLIER = 1.0;
  ```

---

## 🎮 Controls

- **Click** the scene to engage pointer-lock.  
- **Move mouse** (while locked) to yaw/pitch the view.  
- **D** key: Toggle between **FULL** and **BASIC** visual detail.

---

## ✍️ Customization

- Swap in your own skybox textures by replacing the `.skybox-face-*` CSS backgrounds in **`style.css`**.  
- Change particle counts, colors, and sizes in the `_createParticleSet` method.  
- Add FOV effects by uncommenting and adjusting the “Smooth FOV punch” snippet in `animate()`.

---

## 🤝 Contributing

1. Fork the repo  
2. Create a feature branch (`git checkout -b feature/foo`)  
3. Commit your changes (`git commit -am "Add foo"`)  
4. Push to the branch (`git push origin feature/foo`)  
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

> Built with ♥︎ for cosmic exploration. Enjoy the flight!
