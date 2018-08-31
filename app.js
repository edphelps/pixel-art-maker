
const SZ_CANVAS = 5;
const COLOR_EMPTY = "white";
let aCanvas = [];

// Initialize the application
// ==========================
function init() {
  for (let row = 0; row < SZ_CANVAS; row++) {
    aCanvas[row] = [];
    for (let col = 0; col < SZ_CANVAS; col++) {
      aCanvas[row][col] = COLOR_EMPTY;
    }
  }
}

// Create pixel cell
// =================
function getElemPixel(row, col) {
  let elemPixel = document.createElement('div');
  elemPixel.classList.add('pixel');
  elemPixel.style.backgroundColor = aCanvas[row][col];
  // elemPixel.setAttribute("float","left")
  elemPixel.innerText = col + "," + row;
  return elemPixel;
}

// Render the canvas
// =================
function render() {
  let elemCanvas = document.getElementById('canvas');
  elemCanvas.innerHTML = "";

  for (let row = 0; row < SZ_CANVAS; row++) {
    for (let col = 0; col < SZ_CANVAS; col++) {
      elemCanvas.appendChild(getElemPixel(row,col));
    }
  }
}


// On DOM load
// ===========
document.addEventListener("DOMContentLoaded", () => {
  init();
  render();
});
