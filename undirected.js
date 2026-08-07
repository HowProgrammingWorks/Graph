'use strict';

class Graph {

    constructor() {
        this.vertex = [];
        this.edge = [];
        this.edgeCounter = 0;
    }

    addVert(vertex) {
        this.vertex.push(vertex);
        this.edge[vertex] = []; //all edges
    }

    addEdge(nodeFrom, nodeTo) {
        this.edgeCounter++;
        this.edge[nodeFrom].push(nodeTo);
        this.edge[nodeTo].push(nodeFrom); //undirected!
    }

	//returns size of graph
    vertexNumber() {
        return this.vertex.length;
    }

    edgeNumber() {
        return this.edgeCounter;
    }

    rmVert(vert) {
        const pos = this.vertex.indexOf(vert);
        if(pos !== -1) {
            this.vertex.splice(pos, 1);
        }
        while (this.edge[vert].length) {
            const second = this.edge[vert].pop();
            this.rmEdge(second, vert);
        }
    }

    rmEdge(nodeFrom, nodeTo) {
        const pos1 = this.edge[nodeFrom] ? this.edge[nodeFrom].indexOf(nodeTo) : -1;
        const pos2 = this.edge[nodeTo] ? this.edge[nodeTo].indexOf(nodeFrom) : -1;
        if(pos1 !== -1) {
            this.edge[nodeFrom].splice(pos1, 1);
            this.edgeCounter--;
        }
        if(pos2 !== -1) {
            this.edge[nodeTo].splice(pos2, 1);
        }
    }

    output() {
        let i;
        for(i of this.vertex) {
            console.dir('Vertex: ' + i);
            let j;
            for (j of this.edge[i]) {
                console.dir('Edge: ' + j);
            }
        }

        console.dir('Graph has ' + this.vertexNumber() + ' nodes');
        console.dir('Graph has ' + this.edgeNumber() + ' edges');
    }

}

const graph = new Graph();
graph.addVert('first');
graph.addVert('second');
graph.addVert('third');
graph.addVert('fourth');
graph.addVert('fifth');
graph.addVert('sixth');
graph.output();
graph.addEdge('first', 'second');
graph.addEdge('first', 'fifth');
graph.addEdge('fourth', 'fifth');
graph.addEdge('fifth', 'second');
graph.addEdge('third', 'fourth');
graph.addEdge('second', 'third');
graph.addEdge('fourth', 'sixth');
graph.output();
graph.rmEdge('first', 'second');
graph.rmEdge('fourth', 'fifth');
graph.rmEdge('something', '????');
graph.rmVert('fifth');
graph.output();