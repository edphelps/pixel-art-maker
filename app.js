
/* =================================================
*  GLOBALS
*  ================================================= */

// canvas will be SZ_CANVAS x SZ_CANVAS "pixels"
const SZ_CANVAS = 25;

// default background color for canvas when initialized
const DEFAULT_COLOR = "white";

// model of the canvas, stores the color for each pixel
const gaCanvas = []; // initialized in init()

// Canvas and Palette elements
let gelemCanvas = null;
let gelemPalette = null;

// canvas mouse status
// let gbCanvasMouseDown = false;

// the palette of colors user can choose from
const aPalette = ['white', 'black', 'grey', 'yellow', 'red', 'blue', 'green',
  'brown', 'pink', 'orange', 'purple'];

// the current color selection
let gsCurrColor = 'black';

/* =================================================
*  getCanvasElem()
*  ================================================= */
// function getCanvasElem() {
//   return document.getElementById('canvas');
// }

/* =================================================
*  getPaletteElem()
*  ================================================= */
// function getPaletteElem() {
//   return document.getElementById('palette');
// }

/* =================================================
*  createPixelElem()
*
*  @param row,col--stored in data attributes
*  @return new pixel element
*  ================================================= */
function createPixelElem(row, col) {
  const elemPixel = document.createElement('div');

  elemPixel.classList.add('canvas--pixel');
  elemPixel.style.backgroundColor = gaCanvas[row][col];
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
  const elemRow = document.createElement('div');
  elemRow.classList.add("canvas--row");
  for (let col = 0; col < SZ_CANVAS; col++) {
    elemRow.appendChild(createPixelElem(row, col));
  }
  return elemRow;
}

/* =================================================
*  renderCanvas()
*
*  Regenerate the canvas from current state of gaCanvas
*  ================================================= */
function renderCanvas() {
  gelemCanvas.innerHTML = "";
  for (let row = 0; row < SZ_CANVAS; row++) {
    gelemCanvas.appendChild(createRowElem(row));
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
  const elemPaletteColor = document.createElement('div');

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
  gelemPalette.innerHTML = "";
  // for (const sColor of aPalette) {
  aPalette.forEach((sColor) => {
    const elemPaletteColor = createPaletteColorElem(sColor);
    if (sColor === gsCurrColor) {
      elemPaletteColor.classList.add("palette--color--curr");
    }
    gelemPalette.appendChild(elemPaletteColor);
  });
}

/* =================================================
*  onclickCanvas()
*
*  Catch canvas clicks to set pixel to current color
*  ================================================= */
function onclickCanvas(e) {
  // check that canvas click was on a pixel
  if (!e.target.classList.contains("canvas--pixel")) {
    // clicking on edge will re-render the canvas
    renderCanvas();
    return;
  }

  // get row and column from the data attributes in the pixel
  const { row, col } = e.target.dataset;

  gaCanvas[row][col] = gsCurrColor;
  e.target.style.backgroundColor = gaCanvas[row][col];
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
  const { color } = e.target.dataset;

  gsCurrColor = color;

  renderPalette();
}

/* =================================================
*  onmousemoveCanvas()
*
*  Catch mouse movement over canvas
*  ================================================= */
function onmousemoveCanvas(e) {
  // console.log(e.buttons);
  // check that canvas click was on a pixel
  if (e.target.classList.contains("canvas--pixel")) {
    if (e.buttons) {
      // get row and column from the data attributes in the pixel
      const { row, col } = e.target.dataset;
      gaCanvas[row][col] = gsCurrColor;
      e.target.style.backgroundColor = gaCanvas[row][col];
    }
  }
}

function wait(ms) {
  const d = new Date();
  let d2 = null;
  do {
    d2 = new Date();
  } while ((d2 - d) < ms);
}

/* =================================================
*  floodFill()
*
*  @param row - row of cell to try to flood fill
*  @param col - col of cell to try to flood fill
*  ================================================= */
function floodFill(row, col, sReplaceColor) {
  // console.log("FF: "+row+", "+col+"  change to: "+sReplaceColor);
  if (row < 0 || SZ_CANVAS <= row
    || col < 0 || SZ_CANVAS <= col) {
    // console.log("-- oob");
    return;
  }
  // console.log("-- curr color: "+gaCanvas[row][col]);
  if (gaCanvas[row][col] !== sReplaceColor) {
    // console.log("-- not repl color");
    return;
  }
  gaCanvas[row][col] = gsCurrColor;
  // setTimeout(renderCanvas(), 5);
  // setTimeout(floodFill(row, col - 1), 20);
  // setTimeout(floodFill(row, col + 1), 20);
  // setTimeout(floodFill(row - 1, col, 20));
  // setTimeout(floodFill(row + 1, col, 20));
  floodFill(row, col - 1, sReplaceColor);
  floodFill(row, col + 1, sReplaceColor);
  floodFill(row - 1, col, sReplaceColor);
  floodFill(row + 1, col, sReplaceColor);
}

/* =================================================
*  onmousedownCanvas()
*
*  Catch mouse down over canvas -- flood fill
*  ================================================= */
function onmousedownCanvas(e) {
  console.log("down");
  if (e.metaKey && e.target.classList.contains("canvas--pixel")) {
    const row = parseInt(e.target.dataset.row, 10);
    const col = parseInt(e.target.dataset.col, 10);
    floodFill(row, col, gaCanvas[row][col]);
    renderCanvas();
  }
}

// /* =================================================
// *  onmouseupCanvas()
// *
// *  Catch mouse up over canvas
// *  ================================================= */
// function onmouseupCanvas(e) {
//   console.log("--up");
//   gbCanvasMouseDown = false;
// }
// /* =================================================
// *  onmouseleaveCanvas()
// *
// *  Catch mouse leaving  canvas
// *  ================================================= */
// function onmouseleaveCanvas(e) {
//   console.log("--leaving");
//   gbCanvasMouseDown = false;
// }

/* =================================================
*  init()
*  ================================================= */
function init() {

  // init references to elements
  // --------------------------
  gelemCanvas = document.getElementById('canvas');
  gelemPalette = document.getElementById('palette');

  // init canvas data model
  // --------------------------
  for (let row = 0; row < SZ_CANVAS; row++) {
    gaCanvas[row] = [];
    for (let col = 0; col < SZ_CANVAS; col++) {
      gaCanvas[row][col] = DEFAULT_COLOR;
    }
  }

  // setup event handlers
  // --------------------------
  gelemCanvas.onclick = onclickCanvas;
  gelemPalette.onclick = onclickPalette;
  gelemCanvas.onmousemove = onmousemoveCanvas;
  gelemCanvas.onmousedown = onmousedownCanvas;
  // gelemCanvas.onmouseup = onmouseupCanvas;
  // gelemCanvas.onmouseleave = onmouseleaveCanvas;
}

/* =================================================
*  On DOM loaded
*  ================================================= */
document.addEventListener("DOMContentLoaded", () => {
  init();
  renderCanvas();
  renderPalette();
});
