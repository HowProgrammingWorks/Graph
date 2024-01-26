'use strict';

class Vertex {
  constructor(graph, data) {
    this.graph = graph;
    this.data = data;
    this.links = new Map();
  }

  link(...args) {
    const distinct = new Set(args);
    const { links } = this;
    const { keyField } = this.graph;
    for (const item of distinct) {
      const key = item.data[keyField];
      links.set(key, item);
    }
    return this;
  }
}

class Cursor {
  constructor(vertices) {
    this.vertices = vertices;
  }

  linked(...names) {
    const { vertices } = this;
    const result = new Set();
    for (const vertex of vertices) {
      let condition = true;
      for (const name of names) {
        if (!vertex.links.has(name)) {
          condition = false;
          break;
        }
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
    const key = data[this.keyField];
    let vertex = this.vertices.get(key);
    if (!vertex) {
      vertex = new Vertex(this, data);
      this.vertices.set(key, vertex);
    }
    return vertex;
  }

  select(query) {
    const vertices = new Set();
    for (const vertex of this.vertices.values()) {
      let condition = true;
      const { data } = vertex;
      if (data) {
        for (const field in query) {
          if (data[field] !== query[field]) {
            condition = false;
            break;
          }
        }
        if (condition) vertices.add(vertex);
      }
    }
    return new Cursor(vertices);
  }
}

// Usage

const graph = new Graph('name');

const marcus = graph.add({
  name: 'Marcus Aurelius',
  city: 'Rome',
  born: 121,
  dynasty: 'Antonine',
});

const lucius = graph.add({
  name: 'Lucius Verus',
  city: 'Rome',
  born: 130,
  dynasty: 'Antonine',
});

const pius = graph.add({
  name: 'Antoninus Pius',
  city: 'Lanuvium',
  born: 86,
  dynasty: 'Antonine',
});

const hadrian = graph.add({
  name: 'Hadrian',
  city: 'Santiponce',
  born: 76,
  dynasty: 'Nerva–Trajan',
});

const trajan = graph.add({
  name: 'Trajan',
  city: 'Sevilla',
  born: 98,
  dynasty: 'Nerva–Trajan',
});

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
