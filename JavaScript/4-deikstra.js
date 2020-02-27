'use strict';

class Vertex {
  constructor(graph, data) {
    this.graph = graph;
    this.data = data;
    this.links = new Map();
  }
  link(...args) {
    const distinct = new Set(args);
    const links = this.links;
    const keyField = this.graph.keyField;
    let item, key;
    for (item of distinct) {
      key = item.data[keyField];
      links.set(key, null);
    }
    return this;
  }
}

class Cursor {
  constructor(vertices) {
    this.vertices = vertices;
  }
  linked(...names) {
    const vertices = this.vertices;
    const result = new Set();
    let vertex, condition, name;
    for (vertex of vertices) {
      condition = true;
      for (name of names) {
        condition = condition && vertex.links.has(name);
      }
      if (condition) result.add(vertex);
    }
    return new Cursor(result);
  }
}

class Graph {
  constructor(keyField) {
    this.keyField = keyField;
    this.vertices = new Map();
  }
  add(data) {
    const vertex = new Vertex(this, data);
    const key = data[this.keyField];
    if (this.vertices.get(key) === undefined) {
      this.vertices.set(key, vertex);
    }
    return vertex;
  }
  select(query) {
    const vertices = new Set();
    let vertex, condition, data, field;
    for (vertex of this.vertices.values()) {
      condition = true;
      data = vertex.data;
      if (data) {
        for (field in query) {
          condition = condition && data[field] === query[field];
        }
        if (condition) vertices.add(vertex);
      }
    }
    return new Cursor(vertices);
  }
  link(source) {
    const vertices = this.vertices;
    return {
      to(...destinations) {
        const from = vertices.get(source);
        if (from) {
          destinations.forEach((destination) => {
            const target = vertices.get(destination);
            if (target) from.link(target);
          });
        }
      }
    };
  }
  insert(records) {
    for (const record of records) {
      this.add(record);
    }
  }
}



const dijkstra = (graph, firstVertex) => {
  const weights = new Map();
  for (const vertex of graph.vertices) {
    weights.set(vertex[0], Infinity);
  }
  weights.set(firstVertex, 0);

  for (const vertex of graph.vertices) {
    for (const linkedVertex of vertex[1].links) {
      if (linkedVertex[0] !== vertex[0]) {
        let newValue = weights.get(vertex[0]) + 1;
        if (newValue <= 0) newValue = Infinity;
        if (weights.get(linkedVertex[0]) > newValue) {
          weights.set(linkedVertex[0], newValue);
        }
      }
    }
  }
  return weights;
};


const graph = new Graph('name');

/*
  graph.insert([
    {name: '1'},
    {name: '2'},
    {name: '3'},
    {name: '4'},
    {name: '5'},
    {name: '6'},
  ]);

  graph.link('1').to('2', '6');
  graph.link('2').to('3', '1');
  graph.link('3').to('4', '2');
  graph.link('4').to('5', '3');
  graph.link('5').to('6', '4');
  graph.link('6').to('1', '5');
*/

graph.insert([
  { name: '1' },
  { name: '2' },
  { name: '3' },
  { name: '4' },
  { name: '5' },
  { name: '6' },
  { name: '7' },
  { name: '8' },
]);

graph.link('1').to('2', '6', '7');
graph.link('2').to('3', '1');
graph.link('3').to('4', '2');
graph.link('4').to('5', '3');
graph.link('5').to('6', '4', '8');
graph.link('6').to('1', '5');
graph.link('7').to('8', '1');
graph.link('8').to('7', '5');


console.log(graph.vertices[0]);

console.log(dijkstra(graph, '1'));


