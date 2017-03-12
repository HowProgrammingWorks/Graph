'use strict'
function rib(vertex1, vertex2, length) {
	this.begin = vertex1;
	this.end = vertex2;
	this.len = length;
}


function graph() {
	this.ribs = new Array();
}	

graph.prototype.add = function(vertex1, vertex2, length) {
	if(!this.find(vertex1, vertex2, length)) {
		let rib1 = new rib(vertex1, vertex2, length);
		this.ribs.push(rib1);
	}
	else console.log('Rib is here!');
}

graph.prototype.remove = function(vertex1, vertex2, length) {
	let i;
	for(i=0; i<this.ribs.length; i++) {
		if ((this.ribs[i].begin == vertex1)&&(this.ribs[i].end == vertex2)&&(this.ribs[i].len == length)) this.ribs.splice(i, 1);
	}
}

graph.prototype.find = function(vertex1, vertex2, length) {
	let i;
	for(i=0; i<this.ribs.length; i++) {
		if ((this.ribs[i].begin == vertex1)&&(this.ribs[i].end == vertex2)&&(this.ribs[i].len == length)) return true;
	return false;
	}
}

graph.prototype.paint = function() {
	let i;
	for(i=0; i<this.ribs.length; i++){
		console.log(this.ribs[i]);
	}
}

let Ass = new graph();
Ass.add(1, 2, 3);
Ass.add(2, 4, 5);
Ass.remove(2, 4, 5);
Ass.paint();
