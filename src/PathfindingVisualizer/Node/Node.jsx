import React, { Component } from "react";
import "./Node.css";

export default class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isFinish, isStart } = this.props;
    return (
      <div
        className={`node ${
          isStart ? "startNode" : isFinish ? "finishNode" : ""
        }`}
      ></div>
    );
  }
}
