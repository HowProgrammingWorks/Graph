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
}

// Usage

const graph = new Graph('name');

const marcus = graph.add(
  { name: 'Marcus Aurelius', city: 'Rome', born: 121, dynasty: 'Antonine' }
);
const lucius = graph.add(
  { name: 'Lucius Verus', city: 'Rome', born: 130, dynasty: 'Antonine' }
);
const pius = graph.add(
  { name: 'Antoninus Pius', city: 'Lanuvium', born: 86, dynasty: 'Antonine' }
);
const hadrian = graph.add(
  { name: 'Hadrian', city: 'Santiponce', born: 76, dynasty: 'Nerva–Trajan' }
);
const trajan = graph.add(
  { name: 'Trajan', city: 'Sevilla', born: 98, dynasty: 'Nerva–Trajan' }
);

marcus.link(lucius);
lucius.link(trajan, marcus, marcus, marcus);
pius.link(marcus, lucius);
hadrian.link(trajan);
trajan.link(lucius, marcus);

console.dir({ graph }, { depth: null });

const res = graph
  .select({ city: 'Rome', dynasty: 'Antonine' })
  .linked('Trajan');

console.log('\nQuery result:\n');
for (const item of res.vertices) {
  console.dir(item.data);
}
