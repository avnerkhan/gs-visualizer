import React, { useState } from "react";
import Sketch from "react-p5";
import Node from "./Node";
import ListEntry from "./ListEntry";
import { ListGroup, Row, Col, Button } from "react-bootstrap";
import "../css/App.css";

const App = () => {
  const nodeDiameter = 50;
  const boxWidth = nodeDiameter / 2;
  const boxDivision = boxWidth * 1.2;
  const nodeDivision = nodeDiameter * 2;
  const [MALE, FEMALE] = [0, 1];
  const [MAIN, EDIT] = [0, 1];
  const [BEFORE, DURING, DONE] = [0, 1, 2];
  const [currState, setCurrState] = useState(BEFORE);
  const [currPage, setCurrPage] = useState(MAIN);
  const [nodeCountPerGender, setNodeCountPerGender] = useState(6);
  const [editNodeCount, setEditNodeCount] = useState(nodeCountPerGender);
  const [editMalePrefList, setEditMalePrefList] = useState([]);
  const [editFemalePrefList, setEditFemalePrefList] = useState([]);
  const [finishedPairs, setFinishedPairs] = useState([]);
  const [maleProposalIndex, setMaleProposalIndex] = useState(0);
  const [pastMales, setPastMales] = useState({});
  const [males, setMales] = useState([]);
  const [females, setFemales] = useState([]);
  const [fixedLines, setFixedLines] = useState([]);
  const [selectedMaleEdit, setSelectedMaleEdit] = useState("A");
  const [selectedFemaleEdit, setSelectedFemaleEdit] = useState("A");
  const idBank = ["A", "B", "C", "D", "E", "F"];
  const [timerInterval, setTimerInterval] = useState(null);

  const clickRef = React.useRef(null);

  const setupSketch = (p5, parent) => {
    const width = window.screen.width / 1.1;
    const height = window.screen.height / 1.4;
    p5.createCanvas(width, height).parent(parent);
  };

  const createPrefList = (index, gender) => {
    if (editMalePrefList.length === 0 && editFemalePrefList.length === 0) {
      let defaultPrefList = Array.from(
        new Array(nodeCountPerGender),
        (_, i) => i
      ).map(index => new ListEntry(idBank[index]));
      if (gender === FEMALE) defaultPrefList.reverse();
      return defaultPrefList;
    } else {
      let genderList =
        gender === MALE ? editMalePrefList[index] : editFemalePrefList[index];
      return genderList.getPrefList();
    }
  };

  const setupStartState = (width, height) => {
    let maleList = [];
    let femaleList = [];
    let currentHeightOfNode = height / nodeCountPerGender;
    const maleXAxis = width / 4;
    const femaleXAxis = (3 * width) / 4;
    for (let i = 0; i < nodeCountPerGender; i++) {
      maleList.push(
        new Node(
          idBank[i],
          createPrefList(i, MALE),
          maleXAxis,
          currentHeightOfNode
        )
      );
      femaleList.push(
        new Node(
          idBank[i],
          createPrefList(i, FEMALE),
          femaleXAxis,
          currentHeightOfNode
        )
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

  const findAndSetProposal = (maleProposer, proposalId) => {
    let currentFemales = females;
    for (let female of currentFemales) {
      if (female.getId() === proposalId) {
        if (
          female.getPartner() === null ||
          female.getRankInList(maleProposer) <=
            female.getRankInList(female.getPartner())
        ) {
          female.setPartner(maleProposer);
          female.setAsCurrentPartnerInList(maleProposer.getId());
          setFemales(currentFemales);
          return female;
        }
        return null;
      }
    }
    throw new Error("NO ID FOUND");
  };

  const setProposalStatus = p5 => {
    if (males.length > 0 && females.length > 0) {
      let currentMales = males;
      const proposingMale = currentMales[maleProposalIndex];
      let proposedFemaleId = proposingMale.getFirstAvailablePref();
      let proposedFemale = findAndSetProposal(proposingMale, proposedFemaleId);
      while (proposedFemale === null) {
        proposingMale.crossFromPrefList(proposedFemaleId);
        proposedFemaleId = proposingMale.getFirstAvailablePref();
        proposedFemale = findAndSetProposal(proposingMale, proposedFemaleId);
      }
      proposingMale.setPartner(proposedFemale);
      proposingMale.setAsCurrentPartnerInList(proposedFemaleId, false);
      p5.fill(p5.color("black"));
      p5.line(
        proposingMale.getX(),
        proposingMale.getY(),
        proposedFemale.getX(),
        proposedFemale.getY()
      );

      setMales(currentMales);
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

    if (currState === DURING) setProposalStatus(p5);

    for (const maleNode of males) {
      drawPrefList(p5, maleNode, true);
      drawNode(p5, maleNode);
    }

    for (const femaleNode of females) {
      drawPrefList(p5, femaleNode, false);
      drawNode(p5, femaleNode);
    }

    for (const permaLine of fixedLines) {
      p5.line(permaLine.x1, permaLine.y1, permaLine.x2, permaLine.y2);
    }
  };

  const checkIfAlgorithimDone = () => fixedLines.length === nodeCountPerGender;

  const drawSketch = p5 => {
    p5.background(0, 196, 255);
    drawState(p5);
  };

  const addFixedLineEligible = () => {
    const currentMale = males[maleProposalIndex];
    const pastMalePartner = pastMales[currentMale.getId()];
    let finishedPairsCopy = finishedPairs;
    if (
      pastMalePartner !== undefined &&
      currentMale.getPartner().getId() === pastMalePartner &&
      !finishedPairsCopy.includes(currentMale.getId())
    ) {
      finishedPairsCopy.push(currentMale.getId());
      let currentLines = fixedLines;
      currentLines.push({
        x2: currentMale.getPartner().getX(),
        y2: currentMale.getPartner().getY(),
        x1: currentMale.getX(),
        y1: currentMale.getY()
      });
      setFinishedPairs(finishedPairsCopy);
      setFixedLines(currentLines);
    }
  };

  const getMalePartnerMap = () => {
    let partnerMap = {};
    for (const male of males) {
      partnerMap[male.getId()] = male.getPartner().getId();
    }
    return partnerMap;
  };

  const showMain = () => {
    return (
      <div>
        {currState === DONE ? <div>Finished Algorithim</div> : null}
        {currState === DURING ? <div>Running Algorithim</div> : null}
        {currState !== DONE ? (
          <Button
            style={currState === DURING ? { display: "none" } : {}}
            ref={clickRef}
            onClick={() => {
              if (timerInterval === null) {
                const timer = setInterval(() => clickRef.current.click(), 200);
                setTimerInterval(timer);
              }
              if (currState === BEFORE) setCurrState(DURING);
              else if (currState === DURING) {
                if (checkIfAlgorithimDone()) setCurrState(DONE);
                else {
                  addFixedLineEligible();
                  if (maleProposalIndex >= nodeCountPerGender - 1)
                    setPastMales(getMalePartnerMap());
                  setMaleProposalIndex(
                    (maleProposalIndex + 1) % nodeCountPerGender
                  );
                }
              }
            }}
          >
            {currState === BEFORE ? "Start" : "Next Iteration"}
          </Button>
        ) : (
          clearInterval(timerInterval)
        )}
        {currState === DURING || currState === DONE ? (
          <Button
            onClick={() => {
              setMales([]);
              setFemales([]);
              setEditMalePrefList([]);
              setEditFemalePrefList([]);
              setFixedLines([]);
              setFinishedPairs([]);
              setPastMales({});
              setMaleProposalIndex(0);
              clearInterval(timerInterval);
              setTimerInterval(null);
              setCurrState(BEFORE);
            }}
          >
            Reset
          </Button>
        ) : null}
        {currState === BEFORE ? (
          <Button
            onClick={() => {
              setEditMalePrefList(males);
              setEditFemalePrefList(females);
              setEditNodeCount(nodeCountPerGender);
              setCurrPage(EDIT);
            }}
          >
            To Edit
          </Button>
        ) : null}
        <Sketch
          setup={(p5, parent) => setupSketch(p5, parent)}
          draw={p5 => drawSketch(p5)}
        />
      </div>
    );
  };

  const createDefault = (num, gender) => {
    let idBankCopy = idBank.filter((_, index) => index + 1 <= num);
    return idBankCopy.map(id => {
      let prefList = idBankCopy.map(id => new ListEntry(id));
      if (gender === FEMALE) prefList.reverse();
      return new Node(id, prefList, null, null);
    });
  };

  const showNodeCountSelection = () => {
    return (
      <ListGroup horizontal>
        {[2, 3, 4, 5, 6].map(num => (
          <ListGroup.Item
            onClick={() => {
              setEditMalePrefList(createDefault(num, MALE));
              setEditFemalePrefList(createDefault(num, FEMALE));
              setEditNodeCount(num);
            }}
            style={{ color: "black" }}
            active={editNodeCount === num}
          >
            {num}
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  };

  const swapPrefId = (personIndex, index, indexToSwap, gender) => {
    let peopleList = gender === MALE ? editMalePrefList : editFemalePrefList;
    let prefList = peopleList[personIndex].getPrefList();
    const temp = prefList[index];
    prefList[index] = prefList[indexToSwap];
    prefList[indexToSwap] = temp;
    peopleList[personIndex].setPrefList(prefList);
    if (gender === MALE) {
      setEditMalePrefList(peopleList);
    } else {
      setEditFemalePrefList(peopleList);
    }
    setMales([]);
    setFemales([]);
  };

  const showEditPreferenceLists = (people, gender) => {
    const numArr = Array.from(new Array(editNodeCount), (_, i) => i).map(
      index => index + 1
    );
    const shownId = gender === MALE ? selectedMaleEdit : selectedFemaleEdit;
    return people.map((person, personIndex) => {
      return person.getId() === shownId ? (
        <Col>
          <Col md="auto">
            <Row>
              {person.getPrefList().map((pref, index) => {
                return (
                  <div>
                    <div>{pref.getId()}</div>
                    <ListGroup>
                      {numArr.map(numIndex => {
                        return (
                          <ListGroup.Item
                            active={
                              person.getPrefList()[numIndex - 1].getId() ===
                              pref.getId()
                            }
                            onClick={() =>
                              swapPrefId(
                                personIndex,
                                index,
                                numIndex - 1,
                                gender
                              )
                            }
                            style={{ color: "black" }}
                          >
                            {numIndex}
                          </ListGroup.Item>
                        );
                      })}
                    </ListGroup>
                  </div>
                );
              })}
            </Row>
          </Col>
        </Col>
      ) : null;
    });
  };

  const showSelectable = gender => {
    return (
      <select
        value={gender === MALE ? selectedMaleEdit : selectedFemaleEdit}
        onChange={e =>
          gender === MALE
            ? setSelectedMaleEdit(e.target.value)
            : setSelectedFemaleEdit(e.target.value)
        }
      >
        {idBank
          .filter((_, index) => index + 1 <= editNodeCount)
          .map(value => (
            <option value={value}>{value}</option>
          ))}
      </select>
    );
  };

  const showEdit = () => {
    return (
      <div>
        <Button
          onClick={() => {
            setMales([]);
            setFemales([]);
            setFixedLines([]);
            setPastMales({});
            setFinishedPairs([]);
            setMaleProposalIndex(0);
            setNodeCountPerGender(editNodeCount);
            setCurrPage(MAIN);
          }}
        >
          Back to main page
        </Button>
        <div>Select Node Count Per Gender</div>
        {showNodeCountSelection()}
        <div>Edit Male Preference Lists</div>
        {showSelectable(MALE)}
        {showEditPreferenceLists(editMalePrefList, MALE)}
        <div>Edit Female Preference Lists</div>
        {showSelectable(FEMALE)}
        {showEditPreferenceLists(editFemalePrefList, FEMALE)}
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        {currPage === MAIN ? showMain() : showEdit()}
      </header>
    </div>
  );
};

export default App;
