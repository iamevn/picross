function lclick(cb) {
  // alert("clicked");
  if (cb.readOnly){// | cb.checked) {
    cb.checked = false;
    cb.readOnly = cb.indeterminate = false;
  }
  else {
    // cb.checked = true;
    cb.readOnly = cb.indeterminate = false;
  }
}

function rclick(cb) {
  if (cb.checked || cb.readOnly) {
    cb.checked = false;
    cb.readOnly = cb.indeterminate = false;
  }
  else {
    cb.checked = false;
    cb.readOnly = cb.indeterminate = true;
  }
}
