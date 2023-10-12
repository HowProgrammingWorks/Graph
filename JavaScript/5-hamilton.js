'use strict';

const isPareInArray = (pare, array) => {
  for (const k of array) {
    if ((k[0] === pare[0] && k[1] === pare[1]) ||
        (k[0] === pare[1] && k[1] === pare[0])) return true;
  }
  return false;
};

const swapArray = (array, begin, end) => {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (i >= begin && i <= end) result[i] = array[end - i + 1];
    else result[i] = array[i];
  }
  return result;
};

const findHamiltonianCycle = (vertices, links) => {
  let queue = vertices;
  const n = queue.length * (queue.length - 1);
  for (let j = 0; j < n; j++) {
    if (!isPareInArray([queue[0], queue[1]], links)) {
      let i = 2;
      while (!(isPareInArray([queue[0], queue[i]], links) || isPareInArray([queue[1], queue[i + 1]], links))) {
        i++;
      }
      queue = swapArray(queue, 1, i);
    }
    queue.push(queue[0]);
    queue.shift();
  }
  return queue
};


const vertices = [1, 2, 3, 4, 5];
const links = [[1, 3], [3, 5], [5, 2], [2, 4], [4, 1]];
// [[1, 4], [4, 2], [2, 3], [3, 1]];
// [[1, 2], [2, 3], [3, 4], [4, 5], [5, 1]]
// [[1, 3], [3, 5], [5, 2], [2, 4], [4, 1]]

console.log(findHamiltonianCycle(vertices, links));
