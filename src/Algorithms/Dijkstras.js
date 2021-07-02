export function dijkstra(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) {
    return false;
  }
  const visitedNodesInOrder = [];
  const unvisitedNodes = getAllNodes(grid);
  startNode.distance = 0;
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    if (closestNode.isWall) continue;
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbours(closestNode, grid);
  }
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

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function getUnvisitedNeighbours(node, grid) {
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
  return neighbours.filter((neighbour) => !neighbour.isVisited);
}

function updateUnvisitedNeighbours(node, grid) {
  const unvisitedNeighbours = getUnvisitedNeighbours(node, grid);
  for (const neighbour of unvisitedNeighbours) {
    if (neighbour !== null) {
      neighbour.distance = node.distance + 1;
      neighbour.previousNode = node;
    }
  }
}

export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
