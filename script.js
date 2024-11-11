const canvas = document.getElementById('textureCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let currentColor = document.getElementById('colorPicker').value;

canvas.width = 16 * 16;
canvas.height = 16 * 16;

// Color picker event
document.getElementById('colorPicker').addEventListener('input', (e) => {
    currentColor = e.target.value;
});

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
    ctx.fillRect(Math.floor(x / 16) * 16, Math.floor(y / 16) * 16, 16, 16);
}

function stopDrawing() {
    isDrawing = false;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function loadTexture(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function downloadTexture() {
    const link = document.createElement('a');
    link.download = 'texture.png';
    link.href = canvas.toDataURL();
    link.click();
}
