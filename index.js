// Getting references to page elements
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

// Offset used for centering zoom
let offsetX = 0;
let offsetY = 0;

// Draw image inside canvas with zoom
function drawImage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  const imgW = img.width * scale;
  const imgH = img.height * scale;

  const drawX = centerX - imgW / 2;
  const drawY = centerY - imgH / 2;

  offsetX = drawX;
  offsetY = drawY;

  ctx.drawImage(img, drawX, drawY, imgW, imgH);
}

// Upload image
imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  img.src = URL.createObjectURL(file);
  img.onload = () => {
    scale = 1; // reset zoom
    drawImage();
  };
});

// Get pixel when clicking
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();

  // Canvas click coordinates
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  // Convert to actual image pixel based on zoom + offset
  const x = (clickX - offsetX) / scale;
  const y = (clickY - offsetY) / scale;

  if (x < 0 || y < 0 || x >= img.width || y >= img.height) return;

  const pixel = ctx.getImageData(clickX, clickY, 1, 1).data;
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
    [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase()
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

// Zoom In
document.getElementById("zoomIn").addEventListener("click", () => {
  scale += ZOOM_STEP;
  drawImage();
});

// Zoom Out
document.getElementById("zoomOut").addEventListener("click", () => {
  if (scale > ZOOM_STEP) scale -= ZOOM_STEP;
  drawImage();
});
