import React from "react";
import GridLetter from "./GridLetter.jsx";
import "./Grid.css";

class Grid extends React.Component {
  chars = undefined;
  clues = undefined;
  constructor(props) {
    super(props);
    this.state = {
      tableIsValid: false,
      columns: props.columns ?? 1,
      rows: 7,
    };
    this.setLetterCount(props.columns);
    this.handleClues = this.handleClues.bind(this);
    this.updateGuess = this.updateGuess.bind(this);
    this.reset = this.reset.bind(this);
  }

  reset(){
    this.setState({
      tableIsValid: false,
      columns: 1,
    });
    this.chars = undefined;
    this.clues = undefined;
  }

  setLetterCount(letterCount) {
    if (letterCount == undefined || letterCount < 0) {
      return;
    }
    this.setState({
      tableIsValid: false,
      columns: letterCount,
    });
    console.log("setLetterCount(", letterCount, ")");
    let chars = [];
    let clues = [];
    for (let i = 0; i < this.state.rows; i++) {
      chars.push(new Array(letterCount).fill(" ", 0, letterCount));
      clues.push(new Array(letterCount).fill(4, 0, letterCount));
    }
    this.chars = chars;
    this.clues = clues;
    console.log("setLetterCount");
    //console.table(this.chars);
    //console.table(this.clues);
    if (this.chars.length < this.state.columns) {
      console.log("validation 0 failed");
    } else
    if (this.chars[0].length < letterCount) {
      console.log("validation 1 failed");
    } else {
      console.log("validation passed");
    }
  }

  updateGuess(row, guessArr, typedLetters) {
    if (this.chars[0].length < guessArr.length) {
      this.setLetterCount(guessArr.length);
    }
    //console.log("updateGuess");
    //console.table(this.chars);
    //console.table(this.clues);
    for (let i = 0; i < this.state.columns; i++) {
      this.chars[row][i] = guessArr[i];
      this.clues[row][i] = (i < typedLetters) ? 0 : 4;
    }
    //console.log("Grid.updateGuess(", guessArr, typedLetters, ")\n", this.chars, this.clues);
    //console.table(this.chars);
    //console.table(this.clues);
    // force a render update
    this.setState({
      tableIsValid: true,
    })
    // this.render();
  }

  handleClues(event) {
    console.log("Grid.handleClues(", event, ");");
    /*
    this.setState({
      active: true
    })
    */
   event.preventDefault();
  }

  render() {
    if (this.state.tableIsValid) {
      console.log("Grid.render()");
      //console.table(this.chars);
      //console.table(this.clues);
      const rows = [];
      for (let row = 0; row < this.state.rows; row++) {
        let thisRow = [];
        let clueRow = this.clues[row];
        let charRow = this.chars[row];
        for (let column = 0; column < this.state.columns; column++) {
          let clue = clueRow[column];
          let char = charRow[column];
          //console.log(row, column, char);
          let letter = (
            <GridLetter
              key={`GridLetter${row * this.state.columns + column}`}
              label={char} clue={clue}></GridLetter>
          );
          thisRow.push(letter);
        }
        rows.push(<div key={`GridRow${row}`} className="grid-row">{thisRow}</div>);
      }
      let root = <div className="grid-root">
        {rows}
      </div>;
      return root;
    }
    return <div className="grid-root"></div>;
  }
}

export default Grid;