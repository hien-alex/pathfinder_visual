import React, { Component } from "react";
import Node from "./Node/Node";
import "./Grid.css";
import { dijkstra, getNodesInShortestPathOrder } from "../Algorithms/Dijkstras";

const START_NODE_ROW = 10;
const START_NODE_COL = 5;
const FINISH_NODE_ROW = 15;
const FINISH_NODE_COL = 24;

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mousePressed: false,
      initialGrid: [],
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid: grid });
    this.setState({ initialGrid: grid });
  }

  handleMouseDown(row, col) {
    const wallGrid = getGridWithWalls(this.state.grid, row, col);
    this.setState({ grid: wallGrid, mousePressed: true });
  }

  handleMouseDownHover(row, col) {
    if (!this.state.mousePressed) return;
    const wallGrid = getGridWithWalls(this.state.grid, row, col);
    this.setState({ grid: wallGrid, mousePressed: true });
  }

  handleMouseUp() {
    this.setState({ mousePressed: false });
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
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
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node visitedNode";
      }, 10 * i);
    }
  }

  clearGrid(grid) {
    const createdGrid = grid.slice();
    for (let row = 0; row < 21; row++) {
      for (let col = 0; col < 35; col++) {
        if (row == START_NODE_ROW && col == START_NODE_COL) {
          document.getElementById(`node-${row}-${col}`).className =
            "node startNode";
        }
        if (row == FINISH_NODE_ROW && col == FINISH_NODE_COL) {
          document.getElementById(`node-${row}-${col}`).className =
            "node finishNode";
        }
        if (
          !(row == START_NODE_ROW && col == START_NODE_COL) &&
          !(row == FINISH_NODE_ROW && col == FINISH_NODE_COL)
        )
          document.getElementById(`node-${row}-${col}`).className = "node";
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

  render() {
    const grid = this.state.grid;
    return (
      <>
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Algorithm
        </button>
        <button onClick={() => this.clearGrid(this.state.grid)}>fds</button>
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
