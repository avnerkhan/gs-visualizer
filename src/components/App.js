import React, { useState } from "react";
import Sketch from "react-p5";
import Node from "./Node";
import ListEntry from "./ListEntry";
import "../css/App.css";

const App = () => {
  const nodeDiameter = 50;
  const boxWidth = nodeDiameter / 2;
  const boxDivision = boxWidth * 1.2;
  const nodeDivision = nodeDiameter * 2;
  const [BEFORE, DURING, AFTER] = [0, 1, 2];
  const [currState, setCurrState] = useState(BEFORE);
  const [nodeCountPerGender, setNodeCountPerGender] = useState(6);
  const [maleProposalIndex, setMaleProposalIndex] = useState(0);
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
    const maleXAxis = width / 4;
    const femaleXAxis = (3 * width) / 4;
    for (let i = 0; i < nodeCountPerGender; i++) {
      maleList.push(
        new Node(i, createBasicPrefList(), maleXAxis, currentHeightOfNode)
      );
      let reversedPrefList = createBasicPrefList();
      reversedPrefList.reverse();
      femaleList.push(
        new Node(i, reversedPrefList, femaleXAxis, currentHeightOfNode)
      );
      currentHeightOfNode += nodeDivision;
    }
    setMales(maleList);
    setFemales(femaleList);
  };

  const drawAPrefBox = (p5, prefNode, currX, boxY) => {
    if (prefNode.isCrossedOut()) {
      p5.fill(p5.color("red"));
    } else if (prefNode.isPartner()) {
      p5.fill(p5.color("green"));
    } else {
      p5.fill(p5.color("white"));
    }
    p5.rect(currX, boxY, boxWidth, boxWidth);
    const boxMiddleX = currX + boxWidth / 2;
    const boxMiddleY = boxY + boxWidth / 2;
    p5.fill(p5.color("black"));
    p5.text(String(prefNode.getId()), boxMiddleX, boxMiddleY);
  };

  const drawPrefList = (p5, node, leftDraw) => {
    const prefList = node.getPrefList();

    let currBoxX;
    const boxY = node.getY();

    if (leftDraw) {
      currBoxX = node.getX() - boxDivision * 2;
      for (let i = prefList.length - 1; i >= 0; i--) {
        drawAPrefBox(p5, prefList[i], currBoxX, boxY);
        currBoxX -= boxDivision;
      }
    } else {
      currBoxX = node.getX() + boxDivision;
      for (const pref of prefList) {
        drawAPrefBox(p5, pref, currBoxX, boxY);
        currBoxX += boxDivision;
      }
    }
  };

  const drawNode = (p5, node) => {
    p5.fill(p5.color("white"));
    p5.ellipse(node.getX(), node.getY(), nodeDiameter);
    p5.fill(p5.color("black"));
    p5.text(String(node.getId()), node.getX(), node.getY());
  };

  const drawState = p5 => {
    if (males.length === 0 && females.length === 0) {
      setupStartState(p5.width, p5.height);
    }

    for (const maleNode of males) {
      drawPrefList(p5, maleNode, true);
      drawNode(p5, maleNode);
    }

    for (const femaleNode of females) {
      drawPrefList(p5, femaleNode, false);
      drawNode(p5, femaleNode);
    }
  };

  const drawSketch = p5 => {
    p5.background(0, 196, 255);
    drawState(p5);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div
          onClick={() => {
            setCurrState(DURING);
          }}
        >
          {currState === BEFORE ? "Start" : "Next Iteration"}
        </div>
        <Sketch
          setup={(p5, parent) => setupSketch(p5, parent)}
          draw={p5 => drawSketch(p5)}
        />
      </header>
    </div>
  );
};

export default App;
