const puzzle = document.getElementById("puzzle");
let which = false; // false, "fill", "mark", or "empty".
// false when not painting spaces, other values indicate what type of painting is happening

/* 
 * given a td and a fill type ("fill" or "mark"),
 * change td's className and return what it was changed to.
 * a td that's already marked or filled will become empty.
 * a td that's empty will become become the provided fill type.
 * intended use with for first space clicked on to figure out what
 * to do to spaces mouseovered
 */
function toggle(td, fill) {
  if (td.className === "empty") {
    td.className = fill;
  }
  else {
    td.className = "empty";
  }
  return td.className;
}

/*
 * given a td and a fill type ("fill", "mark", or "empty"),
 * change td to that fill type if fill type is empty or td is empty
 * intended for use with spaces dragged over after clicking so that
 * already marked/filled spaces won't be refilled/marked but anything
 * can be erased.
 */
function set(td, fill) {
  if (fill === "empty" || td.className === "empty") {
    td.className = fill;
  }
}

puzzle.addEventListener("mouseover", (event) => {
  if (event.target.className === "side" || event.target.className === "top") {
    return;
  }
  event.target.style.borderStyle = "solid";
  event.target.style.borderColor = "red";

  if (event.buttons !== 1 && event.buttons !== 2) {
    which = false;
  }

  if (which) {
    set(event.target, which);
  }
}, false);

puzzle.addEventListener("mouseout", (event) => {
  if (event.target.className === "side" || event.target.className === "top") {
    return;
  }
  event.target.style.borderStyle = "";
  event.target.style.borderColor = "";
}, false);

puzzle.addEventListener("mousedown", (event) => {
  if (event.target.className === "side" || event.target.className === "top") {
    return;
  }
  let type;
  if (event.buttons === 1) {
    type = "fill";
  }
  else if(event.buttons === 2) {
    type = "mark";
  }
  which = toggle(event.target, type);
  // try to avoid selecting any text while moving mouse
  event.preventDefault();
}, false);

puzzle.addEventListener("mouseup", (event) => {
  which = false;
}, false);

/* fill out table when generate is clicked */
const sizeSelector = document.getElementById("size");
const genBtn = document.getElementById("generate");
const clearBtn = document.getElementById("clear");

/* placeholder puzzles until I can generate or pull puzzles from a big file */
const placeholders = {
  "5x5" : [
    [5, 5], // size (width, height)
    [[1], [2, 1], [1], [2, 1], [1]], // top hints
    [[1, 1], [1, 1], [0], [1, 1], [3]] //side hints
  ],
  "10x10": [
    [10, 10],
    [[5, 4], [5, 1, 1], [1, 1, 1, 1, 1], [1, 1, 4], [0],
     [3, 4], [2, 2], [2, 2], [2, 2], [3, 4]],
    [[4, 1, 1], [2, 1, 1], [3, 2, 2], [2, 3], [4, 1],
     [0], [4, 2, 1], [1, 1, 3, 1], [4, 1, 3], [1, 1, 1, 2]]
  ],
  "15x15": [
    [15, 15],
    [[0], [4], [6], [8], [9], [10],
     [10], [10], [2, 7], [2, 5],
     [3, 3], [2, 3], [2, 3], [4], [0]],
    [[0], [0], [3, 3], [5, 5], [8, 1, 2],
     [7, 1], [8, 2], [9, 3], [11], [9],
     [7], [5], [3], [1], [0]]
  ],
  "xd" : [
    [11, 11],
    [[1], [1, 4], [5], [1, 4], [1], [11],
      [1], [5, 4], [1, 1], [5, 1], [1, 1]],
    [[1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [11],
      [1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 4]]
  ]
};
genBtn.addEventListener("mouseup", (event) => {
  const puzz = placeholders[sizeSelector.value];
  const width = puzz[0][0];
  const height = puzz[0][1];
  const topClues = puzz[1];
  const sideClues = puzz[2];

  puzzle.innerHTML = "";

  // header row
  let row = puzzle.insertRow();
  let headerCell = document.createElement("th");
  row.appendChild(headerCell);
  for (let j = 0; j < width; j += 1) {
    headerCell = document.createElement("th");
    headerCell.id = `t${j}`;
    headerCell.className = "top";
    headerCell.scope = "col";
    // fill in clue
    let s = "";
    topClues[j].forEach((clue) => {
      if (s !== "") {
        s = `${s}</br>`;
      }
      s = `${s}${clue}`
    });
    headerCell.innerHTML = s;
    row.appendChild(headerCell);
  }

  // main rows
  for (let i = 0; i < height; i += 1) {
    row = puzzle.insertRow();
    headerCell = document.createElement("th");
    headerCell.id = `s${i}`;
    headerCell.className = "side";
    headerCell.scope = "row";
    // fill in clue
    let s = "";
    sideClues[i].forEach((clue) => {
      if (s !== "") {
        s = `${s} `;
      }
      s = `${s}${clue}`
    });
    headerCell.innerHTML = s;
    row.appendChild(headerCell);

    for (let j = 0; j < width; j += 1) {
      let cell = row.insertCell();
      cell.className = "empty";
      cell.id = `${i}-${j}`
    }
  }
}, false);

/* clear all cells */
clearBtn.addEventListener("mouseup", (event) => {
  let puzz = placeholders[sizeSelector.value];
  let width = puzz[0][0];
  let height = puzz[0][1];

  let cell;
  for (let i = 0; i < width; i += 1) {
    for (let j = 0; j < height; j += 1) {
      cell = document.getElementById(`${i}-${j}`);
      if (cell) {
        cell.className = "empty";
      }
    }
  }
}, false);
