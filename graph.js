'use strict';
function Rib(vertex1, vertex2, length) {
  this.begin = vertex1;
  this.end = vertex2;
  this.len = length;
}


function Graph() {
  this.ribs = new Array();
}

Graph.prototype.add = function(vertex1, vertex2, length) {
  if (!this.find(vertex1, vertex2, length)) {
    const rib1 = new Rib(vertex1, vertex2, length);
    this.ribs.push(rib1);
  } else console.log('Rib is here!');
};

Graph.prototype.remove = function(vertex1, vertex2, length) {
  let i;
  for (i = 0; i < this.ribs.length; i++) {
    if (this.ribs[i].begin === vertex1) {
      if (this.ribs[i].end === vertex2) {
        if (this.ribs[i].len === length) this.ribs.splice(i, 1);
      }
    }
  }
};

Graph.prototype.find = function(vertex1, vertex2, length) {
  let i;
  for (i = 0; i < this.ribs.length; i++) {
    if (this.ribs[i].begin === vertex1) {
      if (this.ribs[i].end === vertex2) {
        if (this.ribs[i].len === length) return true;
      }
    }
    return false;
  }
};

Graph.prototype.paint = function() {
  let i;
  for (i = 0; i < this.ribs.length; i++) {
    console.log(this.ribs[i]);
  }
};

const Ass = new Graph();
Ass.add(1, 2, 3);
Ass.add(2, 4, 5);
Ass.remove(2, 4, 5);
Ass.paint();
