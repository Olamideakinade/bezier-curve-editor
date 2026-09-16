# Interactive Cubic Bezier Curve and CSS Transition Playground

[![Live Demo](https://img.shields.io/badge/🎮_Live_Demo-Play_on_GitHub_Pages-2ea44f?style=for-the-badge)](https://olamideakinade.github.io/bezier-curve-editor/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Olamideakinade/bezier-curve-editor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

![Project Snapshot](preview.svg)

> 🚀 **Live Demo Available:** Test and play this project live right now: **[https://olamideakinade.github.io/bezier-curve-editor/](https://olamideakinade.github.io/bezier-curve-editor/)**

A lightweight, browser-based interactive workspace for designing, testing, and exporting cubic Bezier timing functions for CSS transitions and animations.

## Overview

`bezier-curve-editor` solves the friction of tweaking cubic-bezier values by trial and error in browser developer tools. It provides a high-precision HTML5 Canvas surface for dragging control points, a live physics preview box to test real-world easing feel, and instantaneous CSS code generation.

## Key Capabilities

- **Direct Canvas Manipulation**: Click and drag control points ($P_1$ and $P_2$) with boundary clamping and snap-to-grid capabilities.
- **Live Physics Simulation**: Test the easing curve immediately against standard layout transitions (translate, scale, opacity, rotation).
- **Preset Library**: Quickly load common curves like `ease`, `ease-in`, `ease-out`, `ease-in-out`, and linear.
- **Precision Sliders & Inputs**: Fine-tune coordinate values manually when exact mathematical timing is required.
- **Clipboard Integration**: One-click copying of standard CSS `cubic-bezier()` declarations.
- **State Persistence**: Saves current curve state to `localStorage` to prevent loss on page refresh.

## Demonstration

```text
+-------------------------------------------------------------+
|  Control Points: P1(0.25, 0.1)  P2(0.25, 1.0)               |
+-------------------------------------------------------------+
|  CSS Output:                                                | 
|  transition: transform 300ms cubic-bezier(0.25, 0.1, 0.25, 1);|
+-------------------------------------------------------------+
```

## Quickstart

Clone the repository and serve the directory using any static file server:

```bash
git clone https://github.com/Olamideakinade/bezier-curve-editor.git
cd bezier-curve-editor
python3 -m http.server 8080
```

Open `http://localhost:8080` in your modern browser.

## Architecture & Design

Built entirely with vanilla web standards—zero framework overhead, zero external dependencies.

- `index.html`: Semantic markup containing the layout grid, canvas viewport, and control sidebar.
- `style.css`: Clean, dark-themed interface styled after modern developer tooling (Inter typography, CSS variables for theme consistency).
- `app.js`: Encapsulates math models for cubic Bezier evaluation, canvas rendering loop, mouse event handling for point dragging, and live DOM animation synchronization.

## License

MIT
