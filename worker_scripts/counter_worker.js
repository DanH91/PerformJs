
var i = 0;

/** */
function timedCount() {
  i++;
  self.postMessage(i);
  self.setTimeout("timedCount()", 10);
}

timedCount();
