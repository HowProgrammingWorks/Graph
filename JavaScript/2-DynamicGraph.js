'use strict';

function DirectedGraph() {
  this.edges = [];
  this.vertexes = new Map();
}

DirectedGraph.prototype.addVertex = function(data) {
  if (data === undefined) return false;
  this.vertexes.set(this.vertexes.size + 1, data);
  return true;
};

DirectedGraph.prototype.deleteVertex = function(vertexNum) {
  const data = this.vertexes.get(vertexNum);
  this.vertexes.delete(vertexNum);
  return data;
};

DirectedGraph.prototype.getVertex = function(vertexNum) {
  const data = this.vertexes.get(vertexNum);
  return data;
};

DirectedGraph.prototype.addEdge = function(vertexNum1, vertexNum2) {
  if (this.vertexes.get(vertexNum1) === undefined) return false;
  if (this.vertexes.get(vertexNum2) === undefined) return false;
  this.edges.push([vertexNum1, vertexNum2]);
  return true;
};

DirectedGraph.prototype.deleteEdge = function(edgeNum) {
  if (typeof edgeNum !== 'number') return false;
  if (edgeNum < 1 || edgeNum > this.edges.length) return false;
  this.edges.splice(edgeNum - 1, 1);
  return true;
};

DirectedGraph.prototype.getEdge = function(edgeNum) {
  if (typeof edgeNum !== 'number') return undefined;
  if (edgeNum < 1 || edgeNum > this.edges.length) return undefined;
  return this.edges[edgeNum - 1];
};

DirectedGraph.prototype.outputAll = function() {
  console.dir('Vertexes:');
  for (var [key, value] of this.vertexes) {
    console.dir(key + ' : ' + value);
  }
  console.dir('Edges:');
  for (var i = 0; i < this.edges.length; i++) {
    console.dir(this.edges[i][0] + ' -> ' + this.edges[i][1]);
  }
};

DirectedGraph.prototype.incidence = function() {
  let i;
  let j;
  let matrix = [];
  for (i = 0; i < this.vertexes.size; i++) {
    matrix.push([]);
    for (j = 0; j < this.edges.length; j++) {
      matrix[i].push(0);
    }
  }
  for (j = 0; j < this.edges.length; j++) {
    matrix[this.edges[j][0] - 1][j] = 1;
    matrix[this.edges[j][1] - 1][j] = -1;
    if (this.edges[j][0] === this.edges[j][1]) {
      matrix[this.edges[j][0] - 1][j] = 2;
    }
  }
  return matrix;
};

DirectedGraph.prototype.adjacency = function() {
  let i;
  let j;
  let matrix = [];
  for (i = 0; i < this.vertexes.size; i++) {
    matrix.push([]);
    for (j = 0; j < this.vertexes.size; j++) {
      matrix[i].push(0);
    }
  }
  for (j = 0; j < this.edges.length; j++) {
    matrix[this.edges[j][0] - 1][this.edges[j][1] - 1] = 1;
  }
  return matrix;
};


const graph = new DirectedGraph();

console.dir(graph.addVertex(null));
console.dir(graph.addVertex('111'));
console.dir(graph.addEdge(1, 2));
graph.outputAll();
console.dir(graph.incidence());
console.dir(graph.adjacency());
