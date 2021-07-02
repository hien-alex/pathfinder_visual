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
    };
  }

  componentDidMount() {
    const grid = [];
    for (let row = 0; row < 21; row++) {
      const currentRow = [];
      for (let col = 0; col < 35; col++) {
        const currentNode = {
          col,
          row,
          isStart: row === START_NODE_ROW && col === START_NODE_COL,
          isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
          distance: Infinity,
          isVisited: false,
          isWall: false,
          previousNode: null,
        };
        currentRow.push([currentNode]);
      }
      grid.push(currentRow);
    }
    this.setState({ grid });
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i][0];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node shortest-path-node";
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
        const node = visitedNodesInOrder[i][0];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node visited-node";
      }, 10 * i);
    }
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstras(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    const { grid } = this.state;
    return (
      <>
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Algorithm
        </button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  return (
                    <Node
                      row={node[0].row}
                      col={node[0].col}
                      key={nodeIdx}
                      isStart={node[0].isStart}
                      isFinish={node[0].isFinish}
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
