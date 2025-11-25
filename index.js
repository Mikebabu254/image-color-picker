//getting reference to page elements
const imageInput = document.getElementById("imageInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const hexEl = document.getElementById("hex");
const rgbEl = document.getElementById("rgb");
const cmykEl = document.getElementById("cmyk");
const pickedColor = document.getElementById("pickedColor");

let img = new Image();//this will hold the image uploaded

//triggered when user uploads an image
imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) 
    return;

  img.src = URL.createObjectURL(file);
  img.onload = () => {
    //resize the canvas to match image
    canvas.width = img.width;
    canvas.height = img.height;

    //draw image onto canvas
    ctx.drawImage(img, 0, 0);
  };
});

//when a user clicks a point on the canvas
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();

  //calculate the actual pixel that has been clicked
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  //get pixel data (RGBA)
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  const [r, g, b] = pixel;

  //convert to HEX and CMYK
  const hex = rgbToHex(r, g, b);
  const cmyk = rgbToCmyk(r, g, b);

  //update UI
  pickedColor.style.background = hex;
  hexEl.textContent = hex;
  rgbEl.textContent = `rgb(${r}, ${g}, ${b})`;
  cmykEl.textContent = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
});

//covert RGB to HEX
function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

//covert RGB to CMYK
function rgbToCmyk(r, g, b) {
  let c = 1 - r / 255;
  let m = 1 - g / 255;
  let y = 1 - b / 255;

  //black (K) value
  let k = Math.min(c, m, y);

  //convert to CMYK percentages
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