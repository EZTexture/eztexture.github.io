const canvas = document.getElementById('textureCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let currentColor = document.getElementById('colorPicker').value;
let gridResolution = 16; // Default grid resolution
let scaleFactor = 20; // Scale each "pixel" to be 20x20 on screen

// Initialize canvas size
updateCanvasSize(gridResolution);

// Update current color
document.getElementById('colorPicker').addEventListener('input', (e) => {
    currentColor = e.target.value;
});

// Update canvas size and scale based on selection
document.getElementById('canvasSizeSelector').addEventListener('change', (e) => {
    gridResolution = parseInt(e.target.value);
    updateCanvasSize(gridResolution);
});

// Drawing events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function draw(e) {
    if (!isDrawing) return;
    ctx.fillStyle = currentColor;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / scaleFactor) * scaleFactor;
    const y = Math.floor((e.clientY - rect.top) / scaleFactor) * scaleFactor;
    ctx.fillRect(x, y, scaleFactor, scaleFactor);
}

function stopDrawing() {
    isDrawing = false;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateCanvasSize(resolution) {
    scaleFactor = Math.max(320 / resolution, 10); // Adjust scale to keep pixels visible
    canvas.width = resolution * scaleFactor;
    canvas.height = resolution * scaleFactor;
    clearCanvas();
}

function downloadTexture() {
    const link = document.createElement('a');
    link.download = 'texture.png';
    link.href = canvas.toDataURL();
    link.click();
}
