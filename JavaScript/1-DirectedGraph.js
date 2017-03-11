/*
  Graph in constructor is represented like an array:
  [[n, m],
   [a, b],
   [c, d],
     ... ]
  where n - number of vertexes, m - number of edges
  pairs [a, b], [c, d] - edges (a, b, c, d, ... - numbers of each vertex)
*/

'use strict';

class DirectedGraph {
	constructor(graph) {
		if (!checkGraphForm(graph)) throw new Error('Not a graph!');
    this.vertexNum = graph[0][0];
    this.edgesNum = graph[0][1];
    this.edges = [];
    for (var i = 1; i <= this.edgesNum; i++) {
      this.edges.push(graph[i]);
    }
	}
  Output() {
    console.dir('Number of vertexes: ' + this.vertexNum);
    console.dir('Number of edges: ' + this.edgesNum);
    for (var i = 0; i < this.edgesNum; i++) {
      console.dir('Edge ' + (i+1) + ': ' + this.edges[i][0] + ' -> ' + this.edges[i][1]);
    }
  }
  Incidence() {
    let matrix = [];
    for (var i = 0; i < this.vertexNum; i++) {
      matrix.push([]);
      for (var j = 0; j < this.edgesNum; j++) {
        matrix[i].push(0);
      }
    }
    for (var j = 0; j < this.edgesNum; j++) {
      matrix[this.edges[j][0] - 1][j] = 1;
      matrix[this.edges[j][1] - 1][j] = -1;
      if (this.edges[j][0] === this.edges[j][1]) matrix[this.edges[j][0] - 1][j] = 2;
    }
    return matrix;
  }
  Adjacency() {
    let matrix = [];
    for (var i = 0; i < this.vertexNum; i++) {
      matrix.push([]);
      for (var j = 0; j < this.vertexNum; j++) {
        matrix[i].push(0);
      }
    }
    for (var j = 0; j < this.edgesNum; j++) {
      matrix[this.edges[j][0] - 1][this.edges[j][1] - 1] = 1;
    }
    return matrix;
  }
}

function checkGraphForm(graph) {
    if (graph instanceof Array && graph.length > 0) {
      for (var i = 0; i < graph.length; i++) {
        if (graph[i].length != 2 || !graph[i] instanceof Array) return false;
      }
    }
    else {
      return false;
    }
    for (var i = 1; i < graph.length; i++) {
      if (graph[i][0] > graph[0][0] || graph[i][1] > graph[0][0]) return false;
      if (graph[i][0] < 1 || graph[i][1] < 1) return false;
      if (graph.length != graph[0][1] + 1) return false;
    }
    return true;
}

try {
  const graph = new DirectedGraph([[5,7],[2,1],[5,2],[4,1],[1,3],[5,1],[3,4],[3,3]]);
  graph.Output();
  console.dir(graph.Incidence());
  console.dir(graph.Adjacency());
} catch (E) {
  console.dir(E.message);
}