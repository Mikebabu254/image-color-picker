// Getting references
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

let offsetX = 0;
let offsetY = 0;

// Draw the image inside canvas with zoom
function drawImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const newWidth = img.width * scale;
    const newHeight = img.height * scale;

    canvas.width = newWidth;
    canvas.height = newHeight;

    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    offsetX = 0;
    offsetY = 0;
}

// Upload image
imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    img.src = URL.createObjectURL(file);

    img.onload = () => {
        scale = 1;
        drawImage();
    };
});

// Click to pick color
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

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

    return { c: Math.round(c), m: Math.round(m), y: Math.round(y), k: Math.round(k) };
}

// Zoom In
document.getElementById("zoomIn").onclick = () => {
    scale += ZOOM_STEP;
    drawImage();
};

// Zoom Out
document.getElementById("zoomOut").onclick = () => {
    if (scale > ZOOM_STEP) scale -= ZOOM_STEP;
    drawImage();
};
