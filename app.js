document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bezierCanvas');
    const ctx = canvas.getContext('2d');
    
    const rangeP1X = document.getElementById('rangeP1X');
    const rangeP1Y = document.getElementById('rangeP1Y');
    const rangeP2X = document.getElementById('rangeP2X');
    const rangeP2Y = document.getElementById('rangeP2Y');

    const valP1X = document.getElementById('valP1X');
    const valP1Y = document.getElementById('valP1Y');
    const valP2X = document.getElementById('valP2X');
    const valP2Y = document.getElementById('valP2Y');

    const btnPlay = document.getElementById('btnPlay');
    const btnReset = document.getElementById('btnReset');
    const btnCopy = document.getElementById('btnCopy');
    const cssOutput = document.getElementById('cssOutput');
    const previewBox = document.getElementById('previewBox');

    const PADDING = 40;
    const SIZE = canvas.width - (PADDING * 2);

    let state = {
        p1: { x: 0.25, y: 0.1 },
        p2: { x: 0.25, y: 1.0 }
    };

    let draggingPoint = null;

    function loadState() {
        const saved = localStorage.getItem('bezier_state');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                state = parsed;
            } catch (e) {
                console.error('Failed to load state', e);
            }
        }
        updateControlsFromState();
    }

    function saveState() {
        localStorage.setItem('bezier_state', JSON.stringify(state));
    }

    function updateControlsFromState() {
        rangeP1X.value = state.p1.x;
        rangeP1Y.value = state.p1.y;
        rangeP2X.value = state.p2.x;
        rangeP2Y.value = state.p2.y;
        
        valP1X.textContent = state.p1.x.toFixed(2);
        valP1Y.textContent = state.p1.y.toFixed(2);
        valP2X.textContent = state.p2.x.toFixed(2);
        valP2Y.textContent = state.p2.y.toFixed(2);

        updateCSSOutput();
        draw();
    }

    function updateCSSOutput() {
        const css = `transition: transform 600ms cubic-bezier(${state.p1.x.toFixed(2)}, ${state.p1.y.toFixed(2)}, ${state.p2.x.toFixed(2)}, ${state.p2.y.toFixed(2)});`;
        cssOutput.textContent = css;
    }

    function toCanvasCoords(nx, ny) {
        return {
            x: PADDING + (nx * SIZE),
            y: PADDING + SIZE - (ny * SIZE)
        };
    }

    function toNormalizedCoords(cx, cy) {
        return {
            x: (cx - PADDING) / SIZE,
            y: (PADDING + SIZE - cy) / SIZE
        };
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Grid
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 1;

        for (let i = 0; i <= 4; i++) {
            let pos = PADDING + (i * (SIZE / 4));
            ctx.beginPath();
            ctx.moveTo(pos, PADDING);
            ctx.lineTo(pos, PADDING + SIZE);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(PADDING, pos);
            ctx.lineTo(PADDING + SIZE, pos);
            ctx.stroke();
        }

        // Draw Axes bounds
        ctx.strokeStyle = '#3f3f46';
        ctx.lineWidth = 2;
        ctx.strokeRect(PADDING, PADDING, SIZE, SIZE);

        const p0 = toCanvasCoords(0, 0);
        const p1 = toCanvasCoords(state.p1.x, state.p1.y);
        const p2 = toCanvasCoords(state.p2.x, state.p2.y);
        const p3 = toCanvasCoords(1, 1);

        // Draw Control Lines
        ctx.strokeStyle = '#52525b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Draw Bezier Curve
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        ctx.stroke();

        // Draw Handles
        drawHandle(p1.x, p1.y, '#f4f4f5');
        drawHandle(p2.x, p2.y, '#f4f4f5');
        drawHandle(p0.x, p0.y, '#71717a');
        drawHandle(p3.x, p3.y, '#71717a');
    }

    function drawHandle(x, y, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#09090b';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    canvas.addEventListener('mousedown', (e) => {
        const pos = getMousePos(e);
        const p1Coord = toCanvasCoords(state.p1.x, state.p1.y);
        const p2Coord = toCanvasCoords(state.p2.x, state.p2.y);

        if (Math.hypot(pos.x - p1Coord.x, pos.y - p1Coord.y) < 15) {
            draggingPoint = 'p1';
        } else if (Math.hypot(pos.x - p2Coord.x, pos.y - p2Coord.y) < 15) {
            draggingPoint = 'p2';
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (!draggingPoint) return;
        const pos = getMousePos(e);
        const norm = toNormalizedCoords(pos.x, pos.y);

        if (draggingPoint === 'p1') {
            state.p1.x = Math.max(-0.5, Math.min(1.5, norm.x));
            state.p1.y = Math.max(-1.0, Math.min(2.0, norm.y));
        } else if (draggingPoint === 'p2') {
            state.p2.x = Math.max(-0.5, Math.min(1.5, norm.x));
            state.p2.y = Math.max(-1.0, Math.min(2.0, norm.y));
        }

        updateControlsFromState();
        saveState();
    });

    window.addEventListener('mouseup', () => {
        draggingPoint = null;
    });

    [rangeP1X, rangeP1Y, rangeP2X, rangeP2Y].forEach(input => {
        input.addEventListener('input', () => {
            state.p1.x = parseFloat(rangeP1X.value);
            state.p1.y = parseFloat(rangeP1Y.value);
            state.p2.x = parseFloat(rangeP2X.value);
            state.p2.y = parseFloat(rangeP2Y.value);
            updateControlsFromState();
            saveState();
        });
    });

    document.querySelectorAll('.preset').forEach(btn => {
        btn.addEventListener('click', () => {
            state.p1.x = parseFloat(btn.dataset.p1x);
            state.p1.y = parseFloat(btn.dataset.p1y);
            state.p2.x = parseFloat(btn.dataset.p2x);
            state.p2.y = parseFloat(btn.dataset.p2y);
            updateControlsFromState();
            saveState();
        });
    });

    btnPlay.addEventListener('click', () => {
        previewBox.classList.remove('animate');
        previewBox.style.transition = 'none';
        void previewBox.offsetWidth;
        
        const bezierStr = `cubic-bezier(${state.p1.x}, ${state.p1.y}, ${state.p2.x}, ${state.p2.y})`;
        previewBox.style.transition = `transform 600ms ${bezierStr}`;
        previewBox.classList.add('animate');
    });

    btnReset.addEventListener('click', () => {
        state = {
            p1: { x: 0.25, y: 0.1 },
            p2: { x: 0.25, y: 1.0 }
        };
        updateControlsFromState();
        saveState();
    });

    btnCopy.addEventListener('click', () => {
        const css = cssOutput.textContent;
        navigator.clipboard.writeText(css).then(() => {
            const originalText = btnCopy.textContent;
            btnCopy.textContent = 'Copied!';
            setTimeout(() => {
                btnCopy.textContent = originalText;
            }, 1500);
        });
    });

    loadState();
});
