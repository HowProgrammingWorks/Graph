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
    for (const vertex of this.vertices.values()) {
      let condition = true;
      const { data } = vertex;
      if (data) {
        for (const field in query) {
          condition = condition && data[field] === query[field];
        }
        if (condition) vertices.add(vertex);
      }
    }
    return new Cursor(vertices);
  }

  link(source) {
    const { vertices } = this;
    const from = vertices.get(source);
    return {
      to(...destinations) {
        if (from) {
          destinations.forEach(destination => {
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

// Usage

const graph = new Graph('name');

graph.insert([
  { name: 'Marcus Aurelius', city: 'Rome', born: 121, dynasty: 'Antonine' },
  { name: 'Lucius Verus', city: 'Rome', born: 130, dynasty: 'Antonine' },
  { name: 'Antoninus Pius', city: 'Lanuvium', born: 86, dynasty: 'Antonine' },
  { name: 'Hadrian', city: 'Santiponce', born: 76, dynasty: 'Nerva–Trajan' },
  { name: 'Trajan', city: 'Sevilla', born: 98, dynasty: 'Nerva–Trajan' },
]);

graph.link('Marcus Aurelius').to('Lucius Verus');
graph.link('Lucius Verus').to('Trajan', 'Marcus Aurelius', 'Marcus Aurelius');
graph.link('Antoninus Pius').to('Marcus Aurelius', 'Lucius Verus');
graph.link('Hadrian').to('Trajan');
graph.link('Trajan').to('Lucius Verus', 'Marcus Aurelius');

console.dir({ graph }, { depth: null });

const res = graph
  .select({ city: 'Rome', dynasty: 'Antonine' })
  .linked('Trajan');

console.log('\nQuery result:\n');
for (const item of res.vertices) {
  console.dir(item.data);
}
