export function dijkstra(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) {
    return false;
  }
  const visitedNodesInOrder = [];
  const unvisitedNodes = getAllNodes(grid);
  startNode[0].distance = 0;
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    if (closestNode[0].isWall) continue;
    if (closestNode[0].distance === Infinity) return visitedNodesInOrder;
    closestNode[0].isVisited = true;
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
  unvisitedNodes.sort((nodeA, nodeB) => nodeA[0].distance - nodeB[0].distance);
}

function getUnvisitedNeighbours(node, grid) {
  const neighbours = [];
  const row = node[0].row;
  const col = node[0].col;

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
  return neighbours.filter((neighbour) => !neighbour[0].isVisited);
}

function updateUnvisitedNeighbours(node, grid) {
  const unvisitedNeighbours = getUnvisitedNeighbours(node, grid);
  for (const neighbour of unvisitedNeighbours) {
    if (neighbour !== null) {
      neighbour[0].distance = node[0].distance + 1;
      neighbour[0].previousNode = node;
    }
  }
}

export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode[0].previousNode;
  }
  return nodesInShortestPathOrder;
}
