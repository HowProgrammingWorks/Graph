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
  disconnect(v1, v2) {
    if (!this.hasVertex(v1) || !this.hasVertex(v2)) {
      return false;
    }
    const vertexIndex = this._adjacency[v1].indexOf(v2);
    if (vertexIndex < 0) return false;
    this._adjacency[v1].splice(vertexIndex, 1);
    this._weight[v1][v2] = undefined;
    --this._indegree[v2];
    return true;
  }
  isConnected(v1, v2) {
    if (!this.hasVertex(v1) || !this.hasVertex(v2)) {
      return false;
    }
    const vertexIndex = this._adjacency[v1].indexOf(v2);
    if (vertexIndex < 0) return false;
    return true;
  }
  getWeight(v1, v2) {
    return this._weight[v1][v2];
  }
  transpose() {
    const size = this.size;
    const transposedGraph = new DirectedGraph(size);
    let v, w, weight;
    for (v = 0; v < size; ++v) {
      for (w of this._adjacency[v]) {
        weight = this.getWeight(v, w);
        transposedGraph.connect(w, v, weight);
      }
    }
    return transposedGraph;
  }
  /**
   * Computes shortest paths from a single source vertex
   * to all of the other vertices (Bellman-Ford inplementation).
   *
   * @param  from = the vertex
   * @return distanceArr[v] = minimum distance to v
   *         parentArr[v] = parent vertex for v in the shortest path
   */
  minimunDistance(from) {
    if (!this.hasVertex(from)) {
      return null;
    }
    const distance = new Array(this.size);
    const parent = new Array(this.size);
    let i;
    for (i = 0; i < this.size; ++i) {
      distance[i] = Infinity;
      parent[i] = -1;
    }
    distance[from] = 0;
    for (i = 0; i < this.size - 1; ++i) {
      this._adjacency.forEach((adj, v) => { // for each vertex in the graph
        adj.forEach(w => { // for each adjacent vertex w to v
          if (distance[w] > distance[v] + this.getWeight(v, w)) {
            distance[w] = distance[v] + this.getWeight(v, w);
            parent[w] = v;
          }
        });
      });
    }
    // if any distance[i] changes, the graph has negative cycles
    this._adjacency.forEach((adj, v) => {
      adj.forEach(w => {
        if (distance[w] > distance[v] + this.getWeight(v, w)) {
          return null;
        }
      });
    });
    return { distanceArr: distance, parentArr: parent };
  }
}

const myGraph = new DirectedGraph(4);
myGraph.connect(0, 1, 2);
myGraph.connect(0, 2, 3);
myGraph.connect(1, 2, -2);
myGraph.connect(1, 3, 2);
myGraph.connect(2, 3, 3);

const checkVertex = 0;
const checkEdge = [2, 3];
if (myGraph.hasVertex(checkVertex)) {
  console.log('I have vertex ' + checkVertex);
} else {
  console.log('I do not have a vertex ' + checkVertex + ' :(');
}
if (myGraph.isConnected(...checkEdge)) {
  console.log(checkEdge[0] + ' is connected with ' + checkEdge[1]);
  console.log('It has weight ' + myGraph.getWeight(...checkEdge));
}
console.log('Lets find the shortest paths for checkVertex!');
console.time('Belman-Ford');
const result = myGraph.minimunDistance(checkVertex);
console.timeEnd('Belman-Ford');
console.dir(result);
