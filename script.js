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

// Image upload functionality
document.getElementById("imageUpload").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                clearCanvas();
                const aspectRatio = img.width / img.height;
                const width = canvas.width;
                const height = width / aspectRatio; // Maintain aspect ratio
                ctx.drawImage(img, 0, 0, width, height);
                // Resize image to fit within the canvas resolution
                scaleImageToGrid(img, gridResolution);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Save functionality for 16x16 or 32x32
document.getElementById("save16x16").addEventListener("click", function() {
    saveCanvasAsImage(16);
});

document.getElementById("save32x32").addEventListener("click", function() {
    saveCanvasAsImage(32);
});

// Helper function to save canvas as an image
function saveCanvasAsImage(resolution) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    // Set temp canvas size based on resolution
    tempCanvas.width = resolution * scaleFactor;
    tempCanvas.height = resolution * scaleFactor;

    // Draw the image from the main canvas to the temp canvas
    tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, tempCanvas.width, tempCanvas.height);

    // Create a link to download the image
    const link = document.createElement('a');
    link.download = `texture_${resolution}x${resolution}.png`;
    link.href = tempCanvas.toDataURL();
    link.click();
}

// Resize the uploaded image to fit the grid resolution (e.g., 16x16, 32x32)
function scaleImageToGrid(img, resolution) {
    const imageWidth = img.width;
    const imageHeight = img.height;
    const aspectRatio = imageWidth / imageHeight;

    // Resize to fit within the grid
    const newWidth = resolution * scaleFactor;
    const newHeight = newWidth / aspectRatio;

    // Resize image and draw on canvas
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
}

// Drawing functions
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

// Check resolution before allowing selection
document.getElementById("canvasSizeSelector").addEventListener("change", function() {
    var selectedValue = this.value;

    if (selectedValue === "64" || selectedValue === "128" || selectedValue === "32") {
        alert("Download EZTexture for Windows to access high resolutions.");
        this.value = "16";  // Reset to 16x16 or your preferred default
        gridResolution = 16;
        updateCanvasSize(gridResolution);
    } else {
        gridResolution = parseInt(selectedValue);
        updateCanvasSize(gridResolution);
    }
});
