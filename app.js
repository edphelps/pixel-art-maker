
/* =================================================
*  GLOBALS
*  ================================================= */

// canvas will be SZ_CANVAS x SZ_CANVAS "pixels"
const SZ_CANVAS = 25;

// default background color for canvas when initialized
const DEFAULT_COLOR = "white";

// model of the canvas, stores the color for each pixel
const aCanvas = [];

// the palette of colors user can choose from
let aPalette = ['white', 'black', 'grey', 'yellow', 'red', 'blue', 'green',
  'brown', 'pink', 'orange', 'purple'];

// the current color selection
let sCurrColor = 'black';

/* =================================================
*  getCanvasElem()
*  ================================================= */
function getCanvasElem() {
  return document.getElementById('canvas');
}

/* =================================================
*  getPaletteElem()
*  ================================================= */
function getPaletteElem() {
  return document.getElementById('palette');
}

/* =================================================
*  createPixelElem()
*
*  @param row,col--stored in data attributes
*  @return new pixel element
*  ================================================= */
function createPixelElem(row, col) {
  let elemPixel = document.createElement('div');

  elemPixel.classList.add('canvas--pixel');
  elemPixel.style.backgroundColor = aCanvas[row][col];
  elemPixel.dataset.row = row;
  elemPixel.dataset.col = col;

  return elemPixel;
}

/* =================================================
*  createRowElem()
*
*  @param row--row number being created
*  @return new row of pixels element
*  ================================================= */
function createRowElem(row) {
  let elemRow = document.createElement('div');
  elemRow.classList.add("canvas--row");
  for (let col = 0; col < SZ_CANVAS; col++) {
    elemRow.appendChild(createPixelElem(row, col));
  }
  return elemRow;
}

/* =================================================
*  renderCanvas()
*
*  Regenerate the canvas from current state of aCanvas
*  ================================================= */
function renderCanvas() {
  let elemCanvas = getCanvasElem();
  elemCanvas.innerHTML = "";
  for (let row = 0; row < SZ_CANVAS; row++) {
    elemCanvas.appendChild(createRowElem(row));
  }
}

/* =================================================
*  createPaletteColorElem()
*
*  Create a new palette color element to add to palette
*
*  @param sColor--"white", "red", etc
*  @return palette color element
*  ================================================= */
function createPaletteColorElem(sColor) {
  let elemPaletteColor = document.createElement('div');

  elemPaletteColor.classList.add('palette--color');
  elemPaletteColor.style.backgroundColor = sColor;
  elemPaletteColor.dataset.color = sColor;

  return elemPaletteColor;
}

/* =================================================
*  renderPalette()
*
*  Regenerate the palette
*  ================================================= */
function renderPalette() {
  let elemPalette = getPaletteElem();
  elemPalette.innerHTML = "";
  for (let sColor of aPalette) {
    let elemPaletteColor = createPaletteColorElem(sColor);
    if (sColor === sCurrColor) {
      elemPaletteColor.classList.add("palette--color--curr");
    }
    elemPalette.appendChild(elemPaletteColor);
  }
}

/* =================================================
*  onclickCanvas()
*
*  Catch canvas clicks to set pixel to current color
*  ================================================= */
function onclickCanvas(e) {
  // check that canvas click was on a pixel
  if (!e.target.classList.contains("canvas--pixel")) {
    renderCanvas();
    return;
  }

  // get row and column from the data attributes in the pixel
  let { row, col } = e.target.dataset;

  aCanvas[row][col] = sCurrColor;
  e.target.style.backgroundColor = aCanvas[row][col];
}

/* =================================================
*  onclickPalette()
*
*  Catch palette clicks to set current color and re-render palette
*  ================================================= */
function onclickPalette(e) {
  // check that palette click was on a palette color
  if (!e.target.classList.contains("palette--color")) {
    return;
  }

  // get color from the data attribute of the color
  let { color } = e.target.dataset;

  sCurrColor = color;

  renderPalette();
}

/* =================================================
*  init()
*  ================================================= */
function init() {
  // init canvas data
  // --------------------------
  for (let row = 0; row < SZ_CANVAS; row++) {
    aCanvas[row] = [];
    for (let col = 0; col < SZ_CANVAS; col++) {
      aCanvas[row][col] = DEFAULT_COLOR;
    }
  }

  // setup event handlers
  // --------------------------
  getCanvasElem().onclick = onclickCanvas;
  getPaletteElem().onclick = onclickPalette;
}

/* =================================================
*  On DOM loaded
*  ================================================= */
document.addEventListener("DOMContentLoaded", () => {
  init();
  renderCanvas();
  renderPalette()
});
