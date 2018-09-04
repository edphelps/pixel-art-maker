/* Pixel Art Maker

Basic paint program.

User flow:
-- choose color in palette
-- click or drag on canvas
-- Cmd+Click to flood fill a region (can replace a previous color)
-- Backspace to clear the canvas

Deployed to: ephelps-pixel-art-maker.surge.sh

Maintains canvas model and current color selection as globals.

Flexbox used with each pixel as its own div.  Each div has a dataset
with its row and column number that are used to help maintain the data model.
*/



/* *****************************************************************
*  *****************************************************************
*                              GLOBALS
*  *****************************************************************
*  ***************************************************************** */

// Following line prevents linter from flagging localStorage as undefined
/* global localStorage */
/* global alert */

// canvas will be SZ_CANVAS x SZ_CANVAS "pixels"
const SZ_CANVAS = 45;

// Canvas and Palette elements ofr convient access
let gelemCanvas = null;
let gelemPalette = null;

// model of the canvas, stores the color for each pixel at text
let gaCanvas = []; // initialized in init()

// the palette of colors user can choose from
const aPalette = ['white', 'black', 'grey', 'yellow', 'red', 'blue', 'green',
  'brown', 'orange', 'purple'];

// default background color for canvas when initialized
// this color displays the grid (border on .canvas--pixel)
const DEFAULT_COLOR = "white";

// current color selection
let gsCurrColor = 'black';


/* *****************************************************************
*  *****************************************************************
*                       CANVAS MANAGEMENT
*  *****************************************************************
*  ***************************************************************** */

/* =================================================
*  createPixelElem()
*
*  Creates a single pixel
*
*  @param row,col - will be stored in element's dataset
*  @return new pixel element
*  ================================================= */
function createPixelElem(row, col) {
  const elemPixel = document.createElement('div');

  elemPixel.classList.add('canvas--pixel');
  elemPixel.style.backgroundColor = gaCanvas[row][col];
  // store the row and col in a dataset
  elemPixel.dataset.row = row;
  elemPixel.dataset.col = col;

  // remove grid border if pixel is colored
  if (gaCanvas[row][col] !== DEFAULT_COLOR) {
    elemPixel.classList.add("canvas--pixel--colored");
  }

  return elemPixel;
}

/* =================================================
*  createRowElem()
*
*  Creates a row element containing pixel elements
*
*  @param row - row number being created
*  @return new row element of pixel element
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
  gelemCanvas.innerHTML = ""; // delete existing canvas
  for (let row = 0; row < SZ_CANVAS; row++) {
    gelemCanvas.appendChild(createRowElem(row));
  }
}

/* =================================================
*  actionLoad()
*
*  Save the canvas to localStorage
*  ================================================= */
function actionSave() {
  localStorage.setItem("pixel-art--sz-canvas", SZ_CANVAS);
  localStorage.setItem("pixel-art--gaCanvas", JSON.stringify(gaCanvas));
}

/* =================================================
*  actionLoad()
*
*  Load canvas from localStorage and re-render the canvas
*  ================================================= */
function actionLoad() {
  const szLoadedCanvas = parseInt(localStorage.getItem("pixel-art--sz-canvas"), 10);
  if (!szLoadedCanvas) {
    alert("You must save a canvas before trying to reload it");
    return;
  }
  if (szLoadedCanvas !== SZ_CANVAS) {
    alert("Saved canvas is a different format, unable to load");
    return;
  }
  gaCanvas = JSON.parse(localStorage.getItem("pixel-art--gaCanvas"));
  renderCanvas();
}

/* =================================================
*  setPixel()
*
*  Set specific pixel to the current color in data model.
*  Optionally update the pixel in the DOM.
*
*  @param row - row of pixel to set to gsCurrColor
*  @param col - col of pixel to set to gsCurrColor
*  @param elem - optional - pixel element to set to gsCurrColor
*                If DOM not updated here then renderCanvas needs to be called.
*  ================================================= */
function setPixel(row, col, elem) {
  // set color in data model
  gaCanvas[row][col] = gsCurrColor;

  // set color for the HTML element
  if (elem) {
    const x = elem;
    x.style.backgroundColor = gaCanvas[row][col];
    // adjust class list to show or hide the pixel border
    if (gsCurrColor === DEFAULT_COLOR) {
      // show pixel border
      x.classList.remove("canvas--pixel--colored");
    } else {
      // hide pixel border
      x.classList.add("canvas--pixel--colored");
    }
  }
}

/* =================================================
*  onclickCanvas()
*
*  Catch canvas clicks to set pixel to current color
*  ================================================= */
function onclickCanvas(e) {
  // check that canvas click was on a pixel
  if (e.target.classList.contains("canvas--pixel")) {
    setPixel(e.target.dataset.row,
      e.target.dataset.col,
      e.target);
  }
}

/* =================================================
*  onmousemoveCanvas()
*
*  Catch mouse movement over canvas, if mouse button is pressed
*  then paint current color
*  ================================================= */
function onmousemoveCanvas(e) {
  // check that canvas click was on a pixel
  if (e.target.classList.contains("canvas--pixel")) {
    // if a mouse button is down
    if (e.buttons) {
      setPixel(e.target.dataset.row,
        e.target.dataset.col,
        e.target);
    }
  }
}

/* =================================================
*  floodFill()
*
*  Applies standard recursive algorithm to flood flood fill the data model
*
*  @param row - row of cell to start flood fill
*  @param col - col of cell to start flood fill
*  @param sColorToReplace - the color being replaced by flood fill
*  ================================================= */
function floodFill(row, col, sColorToReplace) {

  // nothing to do, clicked on pixel that is already the current color
  if (sColorToReplace === gsCurrColor) {
    return;
  }
  // row or col are outside the canvas
  if (row < 0 || SZ_CANVAS <= row
    || col < 0 || SZ_CANVAS <= col) {
    return;
  }
  // cell is already colored something else, it's a boundary
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
*  Catch mouse down over canvas
*  -- flood fill if Cmd or Ctrl or Option key is pressed
*  ================================================= */
function onmousedownCanvas(e) {
  // Click on a pixel with Cmd. Ctrl, or Opt key pressed
  if ((e.metaKey || e.altKey || e.ctrlKey)
    && e.target.classList.contains("canvas--pixel")) {

    const row = parseInt(e.target.dataset.row, 10);
    const col = parseInt(e.target.dataset.col, 10);
    floodFill(row, col, gaCanvas[row][col]);

    renderCanvas(); // floodFill only changed the data model
  }
}



/* *****************************************************************
*  *****************************************************************
*                      PALETTE MANAGEMENT
*  *****************************************************************
*  ***************************************************************** */

/* =================================================
*  createPaletteColorElem()
*
*  Create a new palette color element
*
*  @param sColor--"white", "red", etc
*  @return palette color element
*  ================================================= */
function createPaletteColorElem(sColor) {
  const elemPaletteColor = document.createElement('div');

  elemPaletteColor.classList.add('palette--color');
  elemPaletteColor.style.backgroundColor = sColor;
  // add the color to the dataset
  elemPaletteColor.dataset.color = sColor;

  return elemPaletteColor;
}

/* =================================================
*  renderPalette()
*
*  Regenerate the palette
*  ================================================= */
function renderPalette() {
  gelemPalette.innerHTML = ""; // delete existing palette

  aPalette.forEach((sColor) => {
    const elemPaletteColor = createPaletteColorElem(sColor);
    // highlight current color
    if (sColor === gsCurrColor) {
      elemPaletteColor.classList.add("palette--color--curr");
    }
    gelemPalette.appendChild(elemPaletteColor);
  });
}

/* =================================================
*  onclickPalette()
*
*  Catch palette clicks to set current color and re-render palette
*  ================================================= */
function onclickPalette(e) {
  // check that palette click was on a palette color
  if (e.target.classList.contains("palette--color")) {
    // get color from the dataset attribute of the palette
    gsCurrColor = e.target.dataset.color;

    renderPalette();
  }
}



/* *****************************************************************
*  *****************************************************************
*                      DOCUMENT MANAGEMENT
*  *****************************************************************
*  ***************************************************************** */

/* =================================================
*  onkeydownDocument()
*
*  Catch mouse down over canvas
*  -- flood fill if Cmd or Ctrl or Option key is pressed
*  ================================================= */
function onkeydownDocument(e) {
  if (e.key === 'Backspace') {
    const tempCurrColor = gsCurrColor; // save current color
    gsCurrColor = DEFAULT_COLOR;
    for (let row = 0; row < SZ_CANVAS; row++) {
      for (let col = 0; col < SZ_CANVAS; col++) {
        setPixel(row, col);
      }
    }
    gsCurrColor = tempCurrColor; // reset the current color
    renderCanvas();
  }
}



/* *****************************************************************
*  *****************************************************************
*                      APP INITIALIZATION
*  *****************************************************************
*  ***************************************************************** */

/* =================================================
*  init()
*
*  Initialize the data model and setup event handlers
*  ================================================= */
function init() {

  // init references to elements (used for convenience)
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
  gelemPalette.onclick = onclickPalette;

  gelemCanvas.onclick = onclickCanvas;
  gelemCanvas.onmousemove = onmousemoveCanvas;
  gelemCanvas.onmousedown = onmousedownCanvas;

  document.onkeydown = onkeydownDocument;

  document.getElementById("btn-save").onclick = actionSave;
  document.getElementById("btn-load").onclick = actionLoad;
}

/* =================================================
*  On DOM loaded, initialize and render canvas and palette
*  ================================================= */
document.addEventListener("DOMContentLoaded", () => {
  init();
  renderCanvas();
  renderPalette();
});
