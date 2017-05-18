"use strict";

var puzzle = document.getElementById("puzzle");
var which = false; // false, "fill", "mark", or "empty".
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

puzzle.addEventListener("mouseover", function (event) {
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

puzzle.addEventListener("mouseout", function (event) {
  if (event.target.className === "side" || event.target.className === "top") {
    return;
  }
  event.target.style.borderStyle = "";
  event.target.style.borderColor = "";
}, false);

puzzle.addEventListener("mousedown", function (event) {
  if (event.target.className === "side" || event.target.className === "top") {
    return;
  }
  var type;
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

puzzle.addEventListener("mouseup", function (event) {
  which = false;
}, false);

/* fill out table when generate is clicked */
var sizeSelector = document.getElementById("size");
var genBtn = document.getElementById("generate");
var clearBtn = document.getElementById("clear");

/* placeholder puzzles until I can generate or pull puzzles from a big file */
var placeholders = {
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
genBtn.addEventListener("mouseup", function (event) {
  var puzz = placeholders[sizeSelector.value];
  var width = puzz[0][0];
  var height = puzz[0][1];
  var topClues = puzz[1];
  var sideClues = puzz[2];

  puzzle.innerHTML = "";

  // header row
  var row = puzzle.insertRow();
  var headerCell = document.createElement("th");
  row.appendChild(headerCell);
  for (var j = 0; j < width; j++) {
    headerCell = document.createElement("th");
    headerCell.id = "t" + j;
    headerCell.className = "top";
    headerCell.scope = "col";
    // fill in clue
    var s = "";
    topClues[j].forEach(function (clue) {
      if (s !== "") {
        s = s + "</br>";
      }
      s = s + clue;
    });
    headerCell.innerHTML = s;
    row.appendChild(headerCell);
  }

  // main rows
  for (var i = 0; i < height; i++) {
    row = puzzle.insertRow();
    headerCell = document.createElement("th");
    headerCell.id = "s" + i;
    headerCell.className = "side";
    headerCell.scope = "row";
    // fill in clue
    var s = "";
    sideClues[i].forEach(function (clue) {
      if (s !== "") {
        s = s + " ";
      }
      s = s + clue;
    });
    headerCell.innerHTML = s;
    row.appendChild(headerCell);

    for (var j = 0; j < width; j++) {
      var cell = row.insertCell();
      cell.className = "empty";
      cell.id = i + "-" + j;
    }
  }
}, false);

/* clear all cells */
clearBtn.addEventListener("mouseup", function (event) {
  var puzz = placeholders[sizeSelector.value];
  var width = puzz[0][0];
  var height = puzz[0][1];

  var cell;
  for (var i = 0; i < width; i++) {
    for (var j = 0; j < height; j++) {
      cell = document.getElementById(i + "-" + j);
      if (cell) {
        cell.className = "empty";
      }
    }
  }
}, false);
