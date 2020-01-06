import React, { useState } from "react";
import Sketch from "react-p5";
import Node from "./Node";
import ListEntry from "./ListEntry";
import "../css/App.css";

const App = () => {
  const [BEFORE, DURING, AFTER] = [0, 1, 2];
  const [currState, setCurrState] = useState(BEFORE);
  const [nodeCountPerGender, setNodeCountPerGender] = useState(6);
  const [males, setMales] = useState([]);
  const [females, setFemales] = useState([]);

  const setupSketch = (p5, parent) => {
    const width = window.screen.width / 1.1;
    const height = window.screen.height / 1.4;
    p5.createCanvas(width, height).parent(parent);
  };

  const createBasicPrefList = () => {
    return Array.from(new Array(nodeCountPerGender), (x, i) => i).map(
      index => new ListEntry(index)
    );
  };

  const setupStartState = (width, height) => {
    let maleList = [];
    let femaleList = [];
    let currentHeightOfNode = height / nodeCountPerGender;
    const divisionLength = 100;
    const maleXAxis = width / 4;
    const femaleXAxis = (3 * width) / 4;
    for (let i = 0; i < nodeCountPerGender; i++) {
      maleList.push(
        new Node(i, createBasicPrefList(), maleXAxis, currentHeightOfNode)
      );
      femaleList.push(
        new Node(i, createBasicPrefList(), femaleXAxis, currentHeightOfNode)
      );
      currentHeightOfNode += divisionLength;
    }
    setMales(maleList);
    setFemales(femaleList);
  };

  const drawStartState = p5 => {
    if (males.length === 0 && females.length === 0) {
      setupStartState(p5.width, p5.height);
    }
    for (const node of [...males, ...females]) {
      p5.text("Hello", node.getX() - 50, node.getY());
      p5.ellipse(node.getX(), node.getY(), 50);
    }
  };

  const drawSketch = p5 => {
    p5.background(0, 196, 255);
    switch (currState) {
      case BEFORE:
        drawStartState(p5);
      case DURING:
        break;
      case AFTER:
        break;
      default:
        break;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <Sketch
          setup={(p5, parent) => setupSketch(p5, parent)}
          draw={p5 => drawSketch(p5)}
        />
      </header>
    </div>
  );
};

export default App;
