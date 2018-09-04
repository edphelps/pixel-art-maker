
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
  'brown', 'orange', 'purple']; /* 'pink', */

// the current color selection
let gsCurrColor = 'black';


/* =================================================
*  setPixel()
*
*  @param row - row of pixel to set to sCurrColor
*  @param col - col of pixel to set to sCurrColor
*  @param elem - optional - pixel element to immediately set to sCurrColor
*  ================================================= */
function setPixel(row, col, elem) {
  // set color in data model
  gaCanvas[row][col] = gsCurrColor;

  // set color for the HTML element
  if (elem) {
    const x = elem;
    x.style.backgroundColor = gaCanvas[row][col];
    if (gsCurrColor === DEFAULT_COLOR) {
      x.classList.remove("canvas--pixel--colored");
    } else {
      x.classList.add("canvas--pixel--colored");
    }
  }
}

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

  if (gaCanvas[row][col] !== DEFAULT_COLOR) {
    elemPixel.classList.add("canvas--pixel--colored"); // remove the gray border
  }

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
  // if (!e.target.classList.contains("canvas--pixel")) {
  // clicking on edge will re-render the canvas
  // renderCanvas();
  // return;
  // }
  if (e.target.classList.contains("canvas--pixel")) {
    setPixel(e.target.dataset.row, e.target.dataset.col, e.target);
  }
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
      setPixel(e.target.dataset.row, e.target.dataset.col, e.target);
    }
  }
}

/* =================================================
*  floodFill()
*
*  Applies stadard recursive algorithm to flood flood fill the data model
*
*  @param row - row of cell to try to flood fill
*  @param col - col of cell to try to flood fill
*  @param sColorToReplace - the color being replaced by flood fill
*  ================================================= */
function floodFill(row, col, sColorToReplace) {
  if (row < 0 || SZ_CANVAS <= row
    || col < 0 || SZ_CANVAS <= col) {
    return;
  }
  if (gaCanvas[row][col] !== sColorToReplace) {
    return;
  }
  setPixel(row, col, null);

  floodFill(row, col - 1, sColorToReplace);
  floodFill(row, col + 1, sColorToReplace);
  floodFill(row - 1, col, sColorToReplace);
  floodFill(row + 1, col, sColorToReplace);
}

/* =================================================
*  onmousedownCanvas()
*
*  Catch mouse down over canvas -- flood fill
*  ================================================= */
// let gbInFloodFill = false;
function onmousedownCanvas(e) {
  if (e.metaKey && e.target.classList.contains("canvas--pixel")) {
    // if (gbInFloodFill) {
    //   return;
    // }
    // gbInFloodFill = true;
    const row = parseInt(e.target.dataset.row, 10);
    const col = parseInt(e.target.dataset.col, 10);
    floodFill(row, col, gaCanvas[row][col]);
    renderCanvas(); // floodFill only changes the data model
    // gbInFloodFill = false;
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
  document.addEventListener(
    'keydown', (e) => {
      console.log(e.key);
      if (e.key === 'Backspace') {
        const tempCurrColor = gsCurrColor;
        gsCurrColor = DEFAULT_COLOR;
        for (let row = 0; row < SZ_CANVAS; row++) {
          for (let col = 0; col < SZ_CANVAS; col++) {
            setPixel(row, col);
          }
        }
        gsCurrColor = tempCurrColor;
        renderCanvas();
      }
    },
  );
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
