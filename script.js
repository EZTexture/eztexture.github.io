const canvas = document.getElementById('textureCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let currentColor = document.getElementById('colorPicker').value;
let showGrid = true;

// Create an off-screen canvas for exporting the final image
const exportCanvas = document.createElement('canvas');
const exportCtx = exportCanvas.getContext('2d');
exportCanvas.width = canvas.width;
exportCanvas.height = canvas.height;

// Color picker event
document.getElementById('colorPicker').addEventListener('input', (e) => {
    currentColor = e.target.value;
});

// Toggle drawing on canvas
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
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.fillRect(Math.floor(x / 16) * 16, Math.floor(y / 16) * 16, 16, 16); // 16x16 pixel blocks
    if (showGrid) drawGrid();
}

function stopDrawing() {
    isDrawing = false;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (showGrid) drawGrid();
}

// Load and display uploaded texture
function loadTexture(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                if (showGrid) drawGrid();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Download the edited texture without the grid
function downloadTexture() {
    // Clear the export canvas
    exportCtx.clearRect(0, 0, exportCanvas.width, exportCanvas.height);
    
    // Copy user drawing from the main canvas to export canvas without the grid
    exportCtx.drawImage(canvas, 0, 0);
    
    // Create a link and set it to download the image
    const link = document.createElement('a');
    link.download = 'texture.png';
    link.href = exportCanvas.toDataURL();
    link.click();
}

// Toggle grid overlay
function toggleGrid() {
    showGrid = !showGrid;
    drawGrid();
}

function drawGrid() {
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x += 16) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }
    for (let y = 0; y < canvas.height; y += 16) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.stroke();
    ctx.closePath();
}

// Initialize the grid on page load
drawGrid();
