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
  var queue = [];
  var finished = false;

  queue.push(currentNode);

  function traverse() {
    while (queue.length !== 0 && !finished) {
      if (currentNode.isVisited) {
        currentNode = queue.pop(0);
        continue;
      }

      currentNode.isVisited = true;

      if (
        currentNode.row === finishNode.row &&
        currentNode.col === finishNode.col
      ) {
        finished = true;
        visitedInOrder.push(currentNode);
        return visitedInOrder;
      }

      if (currentNode.isWall) {
        currentNode = queue.pop(0);
        continue;
      }

      visitedInOrder.push(currentNode);

      for (const direction of directions) {
        if (finished === true) return visitedInOrder;
        var nextRow = currentNode.row + direction[0];
        var nextCol = currentNode.col + direction[1];

        if (
          0 <= nextRow &&
          nextRow < rowsLength &&
          0 <= nextCol &&
          nextCol < colsLength
        ) {
          queue.push(grid[nextRow][nextCol]);
        } else {
          continue;
        }
      }
      currentNode = queue.pop(0);
    }
    return visitedInOrder;
  }
  traverse();
  return visitedInOrder;
}
