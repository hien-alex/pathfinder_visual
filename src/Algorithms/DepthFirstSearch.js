export function DFS(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) {
    alert("Start/End node must exist and cannot be the same!");
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

    for (let i = 0; i < 4; i++) {
      if (finished) return visitedInOrder;
      var nextRow = node.row + directions[i][0];
      var nextCol = node.col + directions[i][1];
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
