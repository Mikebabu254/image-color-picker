
const imageInput = document.getElementById("imageInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const hexEl = document.getElementById("hex");
const rgbEl = document.getElementById("rgb");
const cmykEl = document.getElementById("cmyk");
const pickedColor = document.getElementById("pickedColor");
let img = new Image();
imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  };
});
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
function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}
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