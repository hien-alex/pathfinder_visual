export function BFS(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) {
    return false;
  }

  const visitedInOrder = [];
  const rowsLength = grid.length;
  const colsLength = grid[0].length;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  var currentNode = startNode;
  const queue = [];

  queue.push(currentNode);

  while (queue.length !== 0) {
    currentNode = queue.shift();
    if (currentNode.isVisited) continue;
    currentNode.isVisited = true;
    if (currentNode.isWall) continue;
    visitedInOrder.push(currentNode);

    if (currentNode === finishNode) {
      return visitedInOrder;
    }

    for (let i = 0; i < 4; i++) {
      var nextRow = currentNode.row + directions[i][0];
      var nextCol = currentNode.col + directions[i][1];

      if (
        0 <= nextRow &&
        nextRow < rowsLength &&
        0 <= nextCol &&
        nextCol < colsLength
      ) {
        if (!grid[nextRow][nextCol].isVisited) {
          grid[nextRow][nextCol].previousNode = currentNode;
          queue.push(grid[nextRow][nextCol]);
        }
      }
    }
  }
  return visitedInOrder;
}
