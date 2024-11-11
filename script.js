const canvas = document.getElementById('textureCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let currentColor = document.getElementById('colorPicker').value;
let cellSize = 16; // Default to 16x16 grid

// Initialize canvas size
updateCanvasSize(cellSize);

// Update current color
document.getElementById('colorPicker').addEventListener('input', (e) => {
    currentColor = e.target.value;
});

// Update canvas size based on selection
document.getElementById('canvasSizeSelector').addEventListener('change', (e) => {
    cellSize = parseInt(e.target.value);
    updateCanvasSize(cellSize);
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
    const x = Math.floor((e.clientX - rect.left) / (canvas.width / cellSize)) * (canvas.width / cellSize);
    const y = Math.floor((e.clientY - rect.top) / (canvas.height / cellSize)) * (canvas.height / cellSize);
    ctx.fillRect(x, y, canvas.width / cellSize, canvas.height / cellSize);
}

function stopDrawing() {
    isDrawing = false;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateCanvasSize(size) {
    canvas.width = size;
    canvas.height = size;
    clearCanvas(); // Clear canvas when resizing
}

function downloadTexture() {
    const link = document.createElement('a');
    link.download = 'texture.png';
    link.href = canvas.toDataURL();
    link.click();
}
