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
