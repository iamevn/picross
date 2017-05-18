var puzzle = document.getElementById("puzzle");
var which = false;

function toggle(td, fill) {
  if (td.className == "empty") {
    return td.className = fill;
  }
  else {
    return td.className = "empty";
  }
  return false;
}

function set(td, fill) {
  if (fill == "empty") {
    td.className = fill;
  }
  else if (td.className == "empty") {
    td.className = fill;
  }
}

puzzle.addEventListener("mouseover", function(event) {
  event.target.style.borderColor = "red";
  if (event.buttons != 1 && event.buttons != 2) {
    which = false;
  }

  if (which) {
    set(event.target, which);
  }
}, false);

puzzle.addEventListener("mouseout", function(event) {
  event.target.style.borderColor = "";
}, false);

puzzle.addEventListener("mousedown", function(event) {
  if (event.buttons == 1) {
    var type = "fill";
  }
  else if(event.buttons == 2) {
    var type = "mark";
  }
  which = toggle(event.target, type);
}, false);

puzzle.addEventListener("mouseup", function(event) {
  which = false;
}, false);
