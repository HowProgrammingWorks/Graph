'use strict';

const intersection = (s1, s2) => new Set([...s1].filter(v => s2.has(v)));

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
    for (const vertex of vertices.values()) {
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
    this.indices = new Map();
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
    let vertices;
    const keys = Object.keys(query);
    for (const field of keys) {
      const idx = this.indices.get(field);
      if (idx) {
        const value = query[field];
        const records = idx.get(value);
        vertices = vertices ? intersection(vertices, records) : records;
      } else {
        vertices = vertices || new Set(this.vertices.values());
        for (const vertex of vertices) {
          const { data } = vertex;
          if (data[field] !== query[field]) {
            vertices.delete(vertex);
          }
        }
      }
    }
    return new Cursor(vertices);
  }

  link(from) {
    return {
      to(...destinations) {
        destinations.forEach(target => {
          if (target) from.link(target);
        });
      }
    };
  }

  insert(rows) {
    const vertices = [];
    for (const record of rows) {
      const vertex = this.add(record);
      vertices.push(vertex);
      const keys = Object.keys(record);
      for (const [key, idx] of this.indices) {
        if (keys.includes(key)) {
          const value = record[key];
          let records = idx.get(value);
          if (!records) {
            records = new Set();
            idx.set(value, records);
          }
          records.add(vertex);
        }
      }
    }
    return vertices;
  }

  index(key) {
    let idx = this.indices.get(key);
    if (!idx) {
      idx = new Map();
      this.indices.set(key, idx);
    }
    for (const vertex of this.vertices.values()) {
      const value = vertex.data[key];
      let records = idx.get(value);
      if (!records) {
        records = new Set();
        idx.set(value, records);
      }
      records.add(vertex);
    }
    return this;
  }
}

// Usage

const graph = new Graph('name').index('city');

const [marcus, lucius, pius, hadrian, trajan] = graph.insert([
  { name: 'Marcus Aurelius', city: 'Rome', born: 121, dynasty: 'Antonine' },
  { name: 'Lucius Verus', city: 'Rome', born: 130, dynasty: 'Antonine' },
  { name: 'Antoninus Pius', city: 'Lanuvium', born: 86, dynasty: 'Antonine' },
  { name: 'Hadrian', city: 'Santiponce', born: 76, dynasty: 'Nerva–Trajan' },
  { name: 'Trajan', city: 'Sevilla', born: 98, dynasty: 'Nerva–Trajan' },
]);

graph.index('dynasty');

graph.link(marcus).to(lucius);
graph.link(lucius).to(trajan, marcus, marcus);
graph.link(pius).to(marcus, lucius);
graph.link(hadrian).to(trajan);
graph.link(trajan).to(lucius, marcus);

console.dir({ graph }, { depth: null });

const res = graph
  .select({ city: 'Rome', dynasty: 'Antonine' })
  .linked('Trajan');

console.log('\nQuery result:\n');
for (const item of res.vertices) {
  console.dir(item.data);
}
