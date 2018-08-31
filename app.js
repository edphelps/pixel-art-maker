
const SZ_CANVAS = 10;
const COLOR_EMPTY = "white";
let aCanvas = [];
let aPalette = ['white', 'black', 'grey', 'yellow', 'red', 'blue', 'green',
  'brown', 'pink', 'orange', 'purple'];

/* =================================================
*  getElemCanvas()
*  ================================================= */
function getElemCanvas() {
  return document.getElementById('canvas');
}

/* =================================================
*  getElemPalette()
*  ================================================= */
function getElemPalette() {
  return document.getElementById('palette');
}

/* =================================================
*  createElemPixel()
*  ================================================= */
function createElemPixel(row, col) {
  let elemPixel = document.createElement('div');

  elemPixel.classList.add('canvas--pixel');
  elemPixel.style.backgroundColor = aCanvas[row][col];
  elemPixel.dataset.row = row;
  elemPixel.dataset.col = col;
  // elemPixel.innerText = `${row},${col}`;

  return elemPixel;
}

/* =================================================
*  createElemRow()
*  ================================================= */
function createElemRow(row) {
  let elemRow = document.createElement('div');
  elemRow.classList.add("canvas--row");
  for (let col = 0; col < SZ_CANVAS; col++) {
    elemRow.appendChild(createElemPixel(row, col));
  }
  return elemRow;
}

/* =================================================
*  renderCanvas()
*  ================================================= */
function renderCanvas() {
  let elemCanvas = getElemCanvas();
  elemCanvas.innerHTML = "";
  for (let row = 0; row < SZ_CANVAS; row++) {
    elemCanvas.appendChild(createElemRow(row));
  }
}

/* =================================================
*  createElemPaletteColor()
*  ================================================= */
function createElemPaletteColor(sColor) {
  let elemPaletteColor = document.createElement('div');

  elemPaletteColor.classList.add('palette--color');
  elemPaletteColor.style.backgroundColor = aCanvas[row][col];
  elemPaletteColor.dataset.row = row;
  elemPaletteColor.dataset.col = col;

  return elemPaletteColor;
}

/* =================================================
*  renderPalette()
*  ================================================= */
function renderPalette() {
  let elemPalette = getElemPalette();
  elemPalette.innerHTML = "";
  for (let color of aPalette) {
    elemPalette.appendChild(createElemPaletteColor(color));
  }
  // for (let idx = 0;  < SZ_CANVAS; row++) {
  //   elemCanvas.appendChild(createElemRow(row));
  // }
}

/* =================================================
*  onclickCanvas()
*  ================================================= */
let iPal = 0;
function onclickCanvas(e) {
  // console.log(e.target);

  if (!e.target.classList.contains("canvas--pixel")) {
    render();
    return;
  }

  let { row, col } = e.target.dataset;
  // console.log(`row,col: ${row}, ${col}`);

  // aCanvas[row][col] = "red";
  iPal = ((aPalette.length - 1) < ++iPal) ? 0 : iPal;
  // console.log(`setting color:  ${aPalette[iPal]}`);
  aCanvas[row][col] = aPalette[iPal];
  e.target.style.backgroundColor = aCanvas[row][col];

  // elemPixel.style.backgroundColor = aCanvas[row][col];
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
      aCanvas[row][col] = COLOR_EMPTY;
    }
  }

  // setup event handlers
  // --------------------------
  getElemCanvas().onclick = onclickCanvas;
}

/* =================================================
*  On DOM loaded
*  ================================================= */
document.addEventListener("DOMContentLoaded", () => {
  init();
  renderCanvas();
  renderPalette()
});
