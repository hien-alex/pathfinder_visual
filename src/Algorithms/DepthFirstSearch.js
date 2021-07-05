export function DFS(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) {
    return false;
  }

  var currentNode = startNode;

  var finished = false;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const rowsLength = grid.length;
  const colsLength = grid[0].length;
  const visitedInOrder = [];

  function traverse(node) {
    if (node.isVisited) {
      return;
    }
    node.isVisited = true;

    if (currentNode.isWall) return;
    visitedInOrder.push(currentNode);
    if (currentNode === finishNode) {
      finished = true;
      return visitedInOrder;
    }

    for (const direction of directions) {
      if (finished) return visitedInOrder;
      var nextRow = node.row + direction[0];
      var nextCol = node.col + direction[1];
      if (
        0 <= nextRow &&
        nextRow < rowsLength &&
        0 <= nextCol &&
        nextCol < colsLength
      ) {
        currentNode = grid[nextRow][nextCol];
        traverse(grid[nextRow][nextCol]);
      } else {
        continue;
      }
    }
  }
  traverse(startNode);
  return visitedInOrder;
}
