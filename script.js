// Track if the background image is visible or hidden
let isBackgroundVisible = true;
const originalBackgroundImage = "url('Untitled_75.png')"; // Original background image URL
const backgroundColor = '#2c3e50'; // Default dark mode color

// Global variables
const canvas = document.getElementById('textureCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let currentColor = document.getElementById('colorPicker').value;
let gridResolution = 16; // Default grid resolution
let scaleFactor = 20; // Each "pixel" size on the screen
let layers = [{ id: 0, name: "Layer 1", content: [] }];

// Initialize UI and canvas
window.onload = function () {
    initializeCanvas();
    initializeUI();
};

// Save the canvas as an image with a specific resolution
function saveCanvasAsImage(resolution) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    tempCanvas.width = resolution;
    tempCanvas.height = resolution;

    tempCtx.imageSmoothingEnabled = false;
    tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, resolution, resolution);

    const link = document.createElement('a');
    link.download = `texture_${resolution}x${resolution}.png`;
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
}

// Initialize the canvas with default settings
function initializeCanvas() {
    canvas.style.backgroundImage = originalBackgroundImage;
    canvas.style.backgroundSize = '320px 320px';
    canvas.style.backgroundPosition = 'center';

    // Attach event listeners for drawing
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
}

// Initialize UI elements
function initializeUI() {
    const toggleButton = document.getElementById('toggleCanvasBackground');
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleBackground);
    } else {
        console.error('Toggle button not found!');
    }

    document.getElementById('colorPicker').addEventListener('input', (e) => {
        currentColor = e.target.value;
    });

    document.getElementById('save16x16').addEventListener('click', () => saveCanvasAsImage(16));
}

// Toggle canvas background visibility
function toggleBackground() {
    const button = document.getElementById('toggleCanvasBackground');
    if (isBackgroundVisible) {
        canvas.style.backgroundImage = '';
        canvas.style.backgroundColor = backgroundColor;
        button.innerText = 'Show Canvas Background';
    } else {
        canvas.style.backgroundImage = originalBackgroundImage;
        canvas.style.backgroundColor = '';
        button.innerText = 'Hide Canvas Background';
    }
    isBackgroundVisible = !isBackgroundVisible;
}

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

    const currentLayer = layers.find(layer => layer.id === 0);
    currentLayer.content.push({ x, y, color: currentColor });
}

function stopDrawing() {
    isDrawing = false;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    layers.forEach(layer => layer.content = []);
    if (isBackgroundVisible) {
        canvas.style.backgroundImage = originalBackgroundImage;
    } else {
        canvas.style.backgroundImage = '';
    }
}

document.getElementById('exportPack').addEventListener('click', async () => {
    const packName = document.getElementById('packName').value || 'My Resource Pack';
    const logoFile = document.getElementById('packLogo').files[0];

    // Grab user inputs for folder path and texture name
    const folderPath = document.getElementById('folderSelector').value; // Selected folder path
    const overrideName = document.getElementById('overrideName').value.trim(); // Block/item to override
    const textureFilename = document.getElementById('textureFilename').value.trim(); // Texture name

    // Validate inputs
    if (!folderPath || !overrideName || !textureFilename) {
        alert("Please specify the folder, the override name, and the texture filename.");
        return;
    }

    const zip = new JSZip();

    // Define the folder path dynamically
    const textureFolder = zip.folder(`assets/minecraft/${folderPath}`);

    // Draw canvas content to a texture file
    const canvasData = canvas.toDataURL('image/png');
    const textureBlob = await (await fetch(canvasData)).blob();
    textureFolder.file(textureFilename, textureBlob); // Use the specified texture name

    // Add pack metadata
    const packMeta = {
        pack: {
            pack_format: 42,
            description: packName,
        },
    };
    zip.file('pack.mcmeta', JSON.stringify(packMeta, null, 2));

    // Optionally include the logo file if uploaded
    if (logoFile) {
        const logoBlob = await logoFile.arrayBuffer();
        zip.file('pack.png', logoBlob);
    }

    // Generate the zip file
    zip.generateAsync({ type: 'blob' }).then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${packName}.zip`;
        link.click();
    });
});
