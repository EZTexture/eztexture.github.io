let isBackgroundVisible = true;  // Track if the background image is visible or hidden
let originalBackgroundImage = "url('Untitled_75.png')";  // Store the original background image URL
let backgroundColor = '#2c3e50';  // Color to set when the background is hidden (dark mode color, for example)

// Set the default background image when the page loads
window.onload = function() {
    const canvas = document.getElementById('textureCanvas');
    canvas.style.backgroundImage = originalBackgroundImage;  // Set the background image
    canvas.style.backgroundSize = '324px 324px';  // Ensure the background size is correct
    canvas.style.backgroundPosition = 'center';  // Center the background image
};

// Function to toggle the canvas background
document.getElementById('toggleCanvasBackground').addEventListener('click', function() {
    const canvas = document.getElementById('textureCanvas');
    const button = document.getElementById('toggleCanvasBackground');
    
    if (isBackgroundVisible) {
        // Hide the background (set to solid color)
        canvas.style.backgroundImage = '';  // Remove the background image
        canvas.style.backgroundColor = backgroundColor;  // Set the background to the solid color

        button.innerText = 'Show Canvas Background';  // Change button text to "Show"
    } else {
        // Show the background image again
        canvas.style.backgroundImage = originalBackgroundImage;  // Set the background image
        canvas.style.backgroundSize = '324px 324px';  // Ensure the background size is correct
        canvas.style.backgroundPosition = 'center';  // Center the background image

        button.innerText = 'Hide Canvas Background';  // Change button text to "Hide"
    }

    // Toggle the visibility state
    isBackgroundVisible = !isBackgroundVisible;
});

// Rest of the code remains unchanged
const canvas = document.getElementById('textureCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let currentColor = document.getElementById('colorPicker').value;
let gridResolution = 16; // Default grid resolution
let scaleFactor = 20; // Scale each "pixel" to be 20x20 on screen

let layers = [
    { id: 0, name: "Layer 1", content: [] },
];

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

    const newWidth = resolution * scaleFactor;
    const newHeight = newWidth / aspectRatio;

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

    // Update the layer content when drawing
    const currentLayer = layers.find(layer => layer.id === 0); // Assuming 0 is the active layer
    currentLayer.content.push({ x, y, color: currentColor });
}

// Stop drawing
function stopDrawing() {
    isDrawing = false;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Redraw all layers
    layers.forEach(layer => drawLayer(layer));
}

// Update canvas size
function updateCanvasSize(resolution) {
    scaleFactor = Math.max(320 / resolution, 10); // Adjust scale to keep pixels visible
    canvas.width = resolution * scaleFactor;
    canvas.height = resolution * scaleFactor;
    clearCanvas();
}

// Layer Support - Add new layer
function addLayer() {
    const newLayer = { id: layers.length, name: `Layer ${layers.length + 1}`, content: [] };
    layers.push(newLayer);
    updateLayerUI();
}

// Remove Layer
function removeLayer(layerId) {
    layers = layers.filter(layer => layer.id !== layerId);
    updateLayerUI();
}

// Draw layer content on canvas
function drawLayer(layer) {
    layer.content.forEach(item => {
        ctx.fillStyle = item.color;
        ctx.fillRect(item.x, item.y, scaleFactor, scaleFactor);
    });
}

function updateLayerUI() {
    const layerList = document.getElementById('layerList');
    layerList.innerHTML = '';
    layers.forEach(layer => {
        const layerElement = document.createElement('div');
        layerElement.textContent = layer.name;
        layerElement.onclick = () => toggleLayer(layer.id);
        layerList.appendChild(layerElement);
    });
}

// Toggle Layer visibility or editability
function toggleLayer(layerId) {
    const layer = layers.find(layer => layer.id === layerId);
    if (layer) {
        console.log(`Toggled layer ${layerId}`);
        // You can add logic to toggle layer visibility here
    }
}

// Set Dark Mode by default
let isDarkMode = true;
document.body.classList.add('dark-mode'); // Add dark mode class by default

// Toggle Dark Mode
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('modeToggle').innerHTML = '<button onclick="toggleDarkMode()">Switch to Light Mode</button>';
    } else {
        document.body.classList.remove('dark-mode');
        document.getElementById('modeToggle').innerHTML = '<button onclick="toggleDarkMode()">Switch to Dark Mode</button>';
    }
}

// Dark Mode Button in the UI
document.getElementById('modeToggle').innerHTML = '<button onclick="toggleDarkMode()">Switch to Light Mode</button>';


// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'z': // Undo
            if (e.ctrlKey) {
                undoAction();
            }
            break;
        case 'y': // Redo
            if (e.ctrlKey) {
                redoAction();
            }
            break;
        case 'c': // Clear Canvas
            if (e.ctrlKey) {
                clearCanvas();
            }
            break;
        case 's': // Save Canvas
            if (e.ctrlKey) {
                saveCanvas();
            }
            break;
        default:
            break;
    }
});

// Undo/Redo actions
let actionHistory = [];
let currentActionIndex = -1;

function undoAction() {
    if (currentActionIndex > 0) {
        currentActionIndex--;
        loadCanvasFromHistory();
    }
}

function redoAction() {
    if (currentActionIndex < actionHistory.length - 1) {
        currentActionIndex++;
        loadCanvasFromHistory();
    }
}

function loadCanvasFromHistory() {
    const canvas = document.getElementById('textureCanvas');
    const ctx = canvas.getContext('2d');
    const action = actionHistory[currentActionIndex];
    ctx.putImageData(action, 0, 0);
}

// Save canvas state for undo functionality
function saveCanvasState() {
    const canvas = document.getElementById('textureCanvas');
    const ctx = canvas.getContext('2d');
    actionHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    currentActionIndex = actionHistory.length - 1;
}

// Call this function whenever an edit happens
function onCanvasEdit() {
    saveCanvasState();
}
