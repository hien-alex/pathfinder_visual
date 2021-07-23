// We will use Manhattan Distance to find Heuristics of each node
// h = abs (current_cell.x – goal.x) +
// abs (current_cell.y – goal.y)
// G is the distance between current and start node
// H is estimation of current and end node
// F is the total cost of node -> g + h

// const queue = [];

export function AStar(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) {
    alert("Start/End node must exist and cannot be the same!");
  }
  const allNodes = getAllNodes(grid);
  const visitedNodesInOrder = [];
  startNode.gValue = 0;
  startNode.hValue = getCurrentNodeHeuristic(startNode, finishNode);
  startNode.fValue = startNode.gValue + startNode.hValue;
  const queue = [startNode];

  while (!!queue.length) {
    sortNodesByFValue(queue);
    const lowestFValueNode = queue.shift();
    if (lowestFValueNode.isWall) continue;
    if (lowestFValueNode.fValue === Infinity) return visitedNodesInOrder;
    lowestFValueNode.isVisited = true;
    visitedNodesInOrder.push(lowestFValueNode);
    if (lowestFValueNode === finishNode) return visitedNodesInOrder;
    updateNeighbours(lowestFValueNode, grid, queue, finishNode);
  }
}

function getNeighbours(node, grid) {
  const neighbours = [];
  const row = node.row;
  const col = node.col;

  if (row > 0) {
    neighbours.push(grid[row - 1][col]);
  }
  if (row < grid.length - 1) {
    neighbours.push(grid[row + 1][col]);
  }
  if (col > 0) {
    neighbours.push(grid[row][col - 1]);
  }
  if (col < grid[0].length - 1) {
    neighbours.push(grid[row][col + 1]);
  }
  return neighbours;
}

function updateNeighbours(node, grid, queue, finishNode) {
  const nodeNeighbours = getNeighbours(node, grid);
  for (const neighbour of nodeNeighbours) {
    if (neighbour !== null) {
      var newGValue = node.gValue + 1;
      var newHValue = getCurrentNodeHeuristic(neighbour, finishNode);
      var newFValue = newGValue + newHValue;

      if (newFValue < neighbour.fValue) {
        neighbour.fValue = newFValue;
        neighbour.gValue = newGValue;
        neighbour.hValue = newHValue;
        neighbour.previousNode = node;
        queue.push(neighbour);
      }
    }
  }
}

function getCurrentNodeHeuristic(currentNode, finishNode) {
  return (
    Math.abs(currentNode.col - finishNode.col) +
    Math.abs(currentNode.row - finishNode.row)
  );
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

function sortNodesByFValue(queue) {
  queue.sort((nodeA, nodeB) => nodeA.fValue - nodeB.fValue);
}
