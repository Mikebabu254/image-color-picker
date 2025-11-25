// Getting references to elements
const imageInput = document.getElementById("imageInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const hexEl = document.getElementById("hex");
const rgbEl = document.getElementById("rgb");
const cmykEl = document.getElementById("cmyk");
const pickedColor = document.getElementById("pickedColor");

let img = new Image();
let scale = 1; 
const ZOOM_STEP = 0.1;

// Load image when user selects a file
imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Ensure only images are accepted
    if (!file.type.startsWith("image/")) {
        alert("Please upload an image file only!");
        imageInput.value = ""; // reset input
        return;
    }

    img.src = URL.createObjectURL(file);

    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        drawImage();
    };
});

// Draw image with current zoom scale
function drawImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);

    ctx.restore();
}

// Canvas click → pick pixel color
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();

    // Adjust click position based on zoom scale
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const [r, g, b] = pixel;

    const hex = rgbToHex(r, g, b);
    const cmyk = rgbToCmyk(r, g, b);

    pickedColor.style.background = hex;
    hexEl.textContent = hex;
    rgbEl.textContent = `rgb(${r}, ${g}, ${b})`;
    cmykEl.textContent = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
});

// RGB → HEX
function rgbToHex(r, g, b) {
    return (
        "#" +
        [r, g, b]
            .map((x) => x.toString(16).padStart(2, "0"))
            .join("")
            .toUpperCase()
    );
}

// RGB → CMYK
function rgbToCmyk(r, g, b) {
    let c = 1 - r / 255;
    let m = 1 - g / 255;
    let y = 1 - b / 255;

    let k = Math.min(c, m, y);

    c = ((c - k) / (1 - k)) * 100 || 0;
    m = ((m - k) / (1 - k)) * 100 || 0;
    y = ((y - k) / (1 - k)) * 100 || 0;
    k = k * 100;

    return {
        c: Math.round(c),
        m: Math.round(m),
        y: Math.round(y),
        k: Math.round(k),
    };
}

// Zoom in
document.getElementById("zoomIn").addEventListener("click", () => {
    scale += ZOOM_STEP;
    drawImage();
});

// Zoom out
document.getElementById("zoomOut").addEventListener("click", () => {
    if (scale > 0.2) {
        scale -= ZOOM_STEP;
        drawImage();
    }
});
