import React, { Component } from "react";
import "./Node.css";

export default class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      isWall,
      isFinish,
      isStart,
      row,
      col,
      onMouseDown,
      onMouseDownHover,
      onMouseUp,
    } = this.props;
    return (
      <div
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseDownHover(row, col)}
        onMouseUp={() => onMouseUp(row, col)}
        id={`node-${row}-${col}`}
        className={`node ${isStart ? "startNode" : isFinish ? "finishNode" : ""}
        ${isWall ? "isWall" : ""}`}
      ></div>
    );
  }
}
