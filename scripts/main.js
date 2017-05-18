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

function changeBorderColor(td, color = "", style = "solid") {
  if (td.nodeName.toLowerCase() !== "td") {
    return;
  }
  td.style.borderStyle = style;
  td.style.borderColor = color;

  // if there is a square to the left or above, change their right/bottom edge too
  let [y, x] = td.id.split("-");
  if (x > 0) {
    let left = document.getElementById(`${y}-${x-1}`);
    left.style.borderRightStyle = style;
    left.style.borderRightColor = color;
  }
  if (y > 0) {
    let above = document.getElementById(`${y-1}-${x}`);
    above.style.borderBottomStyle = style;
    above.style.borderBottomColor = color;
  }
}

puzzle.addEventListener("mouseover", (event) => {
  changeBorderColor(event.target, "red");

  if (event.buttons !== 1 && event.buttons !== 2) {
    which = false;
  }

  if (which) {
    set(event.target, which);
  }
}, false);

puzzle.addEventListener("mouseout", (event) => {
  changeBorderColor(event.target);
}, false);

puzzle.addEventListener("mousedown", (event) => {
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
  "5x5" : {
    "size" : {"x" : 5, "y" : 5}, // size (width, height)
    "top" : [[1], [2, 1], [1], [2, 1], [1]], // top hints
    "side" : [[1, 1], [1, 1], [0], [1, 1], [3]], //side hints
  },
  "10x10": {
    "size" : {"x" : 10, "y" : 10},
    "top" : [
      [5, 4], [5, 1, 1], [1, 1, 1, 1, 1], [1, 1, 4], [0],
      [3, 4], [2, 2], [2, 2], [2, 2], [3, 4],
    ],
    "side" : [
      [4, 1, 1], [2, 1, 1], [3, 2, 2], [2, 3], [4, 1],
      [0], [4, 2, 1], [1, 1, 3, 1], [4, 1, 3], [1, 1, 1, 2],
    ],
  },
  "15x15": {
    "size" : {"x" : 15, "y" : 15},
    "top" : [
      [0], [4], [6], [8], [9], [10],
      [10], [10], [2, 7], [2, 5],
      [3, 3], [2, 3], [2, 3], [4], [0],
    ],
    "side" : [
      [0], [0], [3, 3], [5, 5], [8, 1, 2],
      [7, 1], [8, 2], [9, 3], [11], [9],
      [7], [5], [3], [1], [0],
    ],
  },
  "xd" : {
    "size" : {"x" : 11, "y" : 11},
    "top" : [
      [1], [1, 4], [5], [1, 4], [1], [11],
      [1], [5, 4], [1, 1], [5, 1], [1, 1]
    ],
    "side" : [
      [1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [11],
      [1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 4],
    ],
  },
};

function loadPuzzle(puzz) {
  const width = puzz["size"]["x"];
  const height = puzz["size"]["y"];
  const topClues = puzz["top"];
  const sideClues = puzz["side"];

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

  // thicker border every 5 TODO: do in css with nth-child?
  for (let i = 0; i < height; i += 1) {
    for (let j = 0; j < width; j += 1) {
      if (i === 0) {
        cell = document.getElementById(`${i}-${j}`);
        cell.style.borderTopWidth = '3px';
      }
      if (j === 0) {
        cell = document.getElementById(`${i}-${j}`);
        cell.style.borderLeftWidth = '3px';
      }
      if (i % 5 === 4) {
        cell = document.getElementById(`${i}-${j}`);
        cell.style.borderBottomWidth = '3px';
      }
      if (j % 5 === 4) {
        cell = document.getElementById(`${i}-${j}`);
        cell.style.borderRightWidth = '3px';
      }
    }
  }
}

genBtn.addEventListener("mouseup", (event) => {
  loadPuzzle(placeholders[sizeSelector.value]);
}, false);

/* clear all cells */
clearBtn.addEventListener("mouseup", (event) => {
  let puzz = placeholders[sizeSelector.value];
  let width = puzz["size"]["x"];
  let height = puzz["size"]["y"];

  let cell;
  for (let i = 0; i < height; i += 1) {
    for (let j = 0; j < width; j += 1) {
      cell = document.getElementById(`${i}-${j}`);
      if (cell) {
        cell.className = "empty";
      }
    }
  }
}, false);

/* generate a sample puzzle on page load */
window.onload = () => {
  const initialPuzzle = {
    "size" : {"x" : 5, "y" : 5},
    "top" : [[5], [5], [1, 1], [1, 1], [3]],
    "side" : [[5], [2, 1], [5], [2], [2]],
  };
  const filled = [
    "0-0", "0-1", "0-2", "0-3", "0-4",
    "1-0", "1-1", "1-4",
    "2-0", "2-1", "2-2", "2-3", "2-4",
    "3-0", "3-1",
    "4-0", "4-1",
  ];
  const marked = [
    "1-2", "1-3",
    "3-2", "3-3", "3-4",
    "4-2", "4-3", "4-4",
  ];
  const empty = [];

  loadPuzzle(initialPuzzle);
  let cell;
  filled.forEach((id) => {
    cell = document.getElementById(id);
    set(cell, "fill");
  });
  marked.forEach((id) => {
    cell = document.getElementById(id);
    set(cell, "mark");
  });
  empty.forEach((id) => {
    cell = document.getElementById(id);
    set(cell, "empty");
  });
};
