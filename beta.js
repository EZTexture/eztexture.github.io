let isBackgroundVisible = true;
let originalBackgroundImage = "url('Untitled_75.png')";
let backgroundColor = '#2E2E2E';
let currentProfile = {};

// Default settings for canvas and buttons
let defaultSettings = {
    canvasBorderColor: "#000000",
    fontSize: "16px",
    buttonFontSize: "14px",
    backgroundPattern: "solid",
    canvasBackgroundColor: "#ffffff"
};

// Update UI based on selected settings
function applySettings(settings) {
    document.body.style.fontSize = settings.fontSize;
    document.querySelectorAll('button').forEach(btn => {
        btn.style.fontSize = settings.buttonFontSize;
    });
    document.getElementById('textureCanvas').style.borderColor = settings.canvasBorderColor;
    document.body.style.background = settings.backgroundPattern === 'gradient' ? 'linear-gradient(to right, #ff7e5f, #feb47b)' : settings.canvasBackgroundColor;
}

// Function to handle canvas border color change
document.getElementById('borderColor').addEventListener('input', function(event) {
    const canvas = document.getElementById('textureCanvas');
    canvas.style.border = `5px solid ${event.target.value}`;
});

// Function to toggle background visibility
document.getElementById('toggleCanvasBackground').addEventListener('click', function() {
    const canvas = document.getElementById('textureCanvas');
    if (isBackgroundVisible) {
        canvas.style.backgroundImage = '';
        canvas.style.backgroundColor = backgroundColor;
    } else {
        canvas.style.backgroundImage = originalBackgroundImage;
        canvas.style.backgroundColor = '';
    }
    isBackgroundVisible = !isBackgroundVisible;
});

// Save current settings to an .eztp profile
function saveProfile() {
    const settings = {
        canvasBorderColor: document.getElementById('borderColor').value,
        fontSize: document.getElementById('fontSize').value + 'px',
        buttonFontSize: document.getElementById('buttonFontSize').value + 'px',
        backgroundPattern: document.getElementById('backgroundPattern').value,
        canvasBackgroundColor: document.getElementById('canvasBackgroundColor').value
    };

    const profileData = JSON.stringify(settings);
    const blob = new Blob([profileData], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'profile.eztp';
    link.click();
}

// Load saved profile
function loadProfile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const settings = JSON.parse(e.target.result);
            applySettings(settings);
        };
        reader.readAsText(file);
    }
}

// Initialize with default settings
applySettings(defaultSettings);

// Canvas and drawing setup remains the same (from previous code)...
