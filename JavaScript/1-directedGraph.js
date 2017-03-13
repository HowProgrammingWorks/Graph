'use strict';

class DirectedGraph {
  constructor(vertexN) {
    this._adjacency = []; // _adjacency[v] = adjacency array for vertex v
    this._indegree = [];  // _indegree[v] = indegree of vertex v
    this._weight = [];    // _weight[v][w] = weight of the edge (v; w)
    if (vertexN === undefined) return this;
    let i;
    for (i = 0; i < vertexN; ++i) {
      this.addVertex();
    }
    return this;
  }
  addVertex() {
    this._adjacency.push([]);
    this._weight.push([]);
    const vertexIndex = this._adjacency.length - 1;
    this._indegree[vertexIndex] = 0;
    return this;
  }
  hasVertex(v) {
    if (v < 0 || v >= this.size) {
      return false;
    }
    return true;
  }
  get size() {
    return this._adjacency.length;
  }
  connect(v1, v2, weight) {
    if (!this.hasVertex(v1) || !this.hasVertex(v2)) {
      return false;
    }
    this._adjacency[v1].push(v2);
    this._weight[v1][v2] = weight;
    ++this._indegree[v2];
    return true;
  }
}
