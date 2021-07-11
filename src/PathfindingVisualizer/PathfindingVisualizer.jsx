import React, { Component } from "react";
import Node from "./Node/Node";
import "./Grid.css";
import { dijkstra, getNodesInShortestPathOrder } from "../Algorithms/Dijkstras";
import { DFS } from "../Algorithms/DepthFirstSearch";
import { BFS } from "../Algorithms/BreadthFirstSearch";

var START_NODE_ROW = 10;
var START_NODE_COL = 5;
var FINISH_NODE_ROW = 10;
var FINISH_NODE_COL = 29;

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mousePressed: false,
      newStartPressed: false,
      newFinishPressed: false,
      initialGrid: [],
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid: grid });
    this.setState({ initialGrid: grid });
  }

  handleMouseDown(row, col) {
    if (row === START_NODE_ROW && col === START_NODE_COL) {
      this.setState({ newStartPressed: true });
      return;
    }
    if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
      this.setState({ newFinishPressed: true });
      return;
    }
    const wallGrid = getGridWithWalls(this.state.grid, row, col);
    this.setState({ grid: wallGrid, mousePressed: true });
  }

  handleMouseDownHover(row, col) {
    if (
      !this.state.mousePressed &&
      !this.state.newStartPressed &&
      !this.state.newFinishPressed
    )
      return;

    if (this.state.newStartPressed) {
      const newStartGrid = getGridWithNewStart(this.state.grid, row, col);
      this.setState({ grid: newStartGrid, newStartPressed: true });
      return;
    }

    if (this.state.newFinishPressed) {
      const newFinishGrid = getGridWithNewFinish(this.state.grid, row, col);
      this.setState({ grid: newFinishGrid, newFinishPressed: true });
      return;
    }

    const wallGrid = getGridWithWalls(this.state.grid, row, col);
    this.setState({ grid: wallGrid, mousePressed: true });
  }

  handleMouseUp() {
    this.setState({ mousePressed: false });
    this.setState({ newStartPressed: false });
    this.setState({ newFinishPressed: false });
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (node.row == START_NODE_ROW && node.col == START_NODE_COL) return;
        if (node.row == FINISH_NODE_ROW && node.col == FINISH_NODE_COL) return;
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node shortestPathNode";
      }, 50 * i);
    }
  }

  animateDijkstras(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (node.row == START_NODE_ROW && node.col == START_NODE_COL) return;
        if (node.row == FINISH_NODE_ROW && node.col == FINISH_NODE_COL) return;
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node visitedNode";
      }, 10 * i);
    }
  }

  animateDFSBFS(visitedNodesInOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(visitedNodesInOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (node.row == START_NODE_ROW && node.col == START_NODE_COL) return;
        if (node.row == FINISH_NODE_ROW && node.col == FINISH_NODE_COL) return;
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node visitedNode";
      }, 10 * i);
    }
  }

  clearGridALL(grid) {
    const createdGrid = grid.slice();
    for (let row = 0; row < 21; row++) {
      for (let col = 0; col < 35; col++) {
        if (row === START_NODE_ROW && col === START_NODE_COL) {
          document.getElementById(`node-${row}-${col}`).className =
            "node startNode";
          createdGrid[row][col].isVisited = false;
        } else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
          document.getElementById(`node-${row}-${col}`).className =
            "node finishNode";
          createdGrid[row][col].isVisited = false;
          createdGrid[row][col].previousNode = null;
          createdGrid[row][col].distance = Infinity;
        } else {
          document.getElementById(`node-${row}-${col}`).className = "node";
          createdGrid[row][col].isVisited = false;
          createdGrid[row][col].distance = Infinity;
          createdGrid[row][col].previousNode = null;
          createdGrid[row][col].isWall = false;
        }
      }
    }
    this.setState({ grid: createdGrid });
  }

  clearGrid(grid) {
    const createdGrid = grid.slice();
    for (let row = 0; row < 21; row++) {
      for (let col = 0; col < 35; col++) {
        if (!grid[row][col].isWall) {
          if (row === START_NODE_ROW && col === START_NODE_COL) {
            document.getElementById(`node-${row}-${col}`).className =
              "node startNode";
            createdGrid[row][col].isVisited = false;
          }
          if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
            document.getElementById(`node-${row}-${col}`).className =
              "node finishNode";
            createdGrid[row][col].isVisited = false;
            createdGrid[row][col].previousNode = null;
            createdGrid[row][col].distance = Infinity;
          }
          if (
            !(row === START_NODE_ROW && col === START_NODE_COL) &&
            !(row === FINISH_NODE_ROW && col === FINISH_NODE_COL)
          ) {
            document.getElementById(`node-${row}-${col}`).className = "node";
            createdGrid[row][col].isVisited = false;
            createdGrid[row][col].distance = Infinity;
            createdGrid[row][col].previousNode = null;
          }
        }
      }
    }
    this.setState({ grid: createdGrid });
  }

  visualizeDijkstra() {
    this.clearGrid(this.state.grid);
    const grid = this.state.grid;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstras(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeDFS() {
    this.clearGrid(this.state.grid);
    const grid = this.state.grid;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = DFS(grid, startNode, finishNode);
    this.animateDFSBFS(visitedNodesInOrder);
  }

  visualizeBFS() {
    this.clearGrid(this.state.grid);
    const grid = this.state.grid;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = BFS(grid, startNode, finishNode);
    this.animateDFSBFS(visitedNodesInOrder);
  }

  render() {
    const grid = this.state.grid;
    return (
      <>
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstras!
        </button>
        <button onClick={() => this.visualizeBFS()}>Visualize BFS!</button>
        <button onClick={() => this.visualizeDFS()}>Visualize DFS!</button>
        <button onClick={() => this.clearGridALL(this.state.grid)}>
          CLEAR
        </button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const col = node.col;
                  const row = node.row;
                  return (
                    <Node
                      isWall={node.isWall}
                      row={row}
                      col={col}
                      key={nodeIdx}
                      isStart={node.isStart}
                      isFinish={node.isFinish}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseDownHover={(row, col) =>
                        this.handleMouseDownHover(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 21; row++) {
    const currentRow = [];
    for (let col = 0; col < 35; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const getGridWithWalls = (grid, row, col) => {
  const createdGrid = grid.slice();
  const node = createdGrid[row][col];
  const createdNode = {
    ...node,
    isWall: !node.isWall,
  };
  createdGrid[row][col] = createdNode;
  return createdGrid;
};

const getGridWithNewStart = (grid, row, col) => {
  const createdGrid = grid.slice();
  document.getElementById(
    `node-${START_NODE_ROW}-${START_NODE_COL}`
  ).className = "node";
  createdGrid[START_NODE_ROW][START_NODE_COL].isStart = false;
  START_NODE_ROW = row;
  START_NODE_COL = col;
  createdGrid[START_NODE_ROW][START_NODE_COL].isStart = true;
  return createdGrid;
};

const getGridWithNewFinish = (grid, row, col) => {
  const createdGrid = grid.slice();
  document.getElementById(
    `node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`
  ).className = "node";
  createdGrid[FINISH_NODE_ROW][FINISH_NODE_COL].isFinish = false;
  FINISH_NODE_ROW = row;
  FINISH_NODE_COL = col;
  createdGrid[FINISH_NODE_ROW][FINISH_NODE_COL].isFinish = true;
  return createdGrid;
};
