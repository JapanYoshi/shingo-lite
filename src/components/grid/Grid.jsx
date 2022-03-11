import React from "react";
import GridLetter from "./GridLetter.jsx";
import "./Grid.css";

class Grid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: 0,
      columns: 0,
    };

    this.handleClues = this.handleClues.bind(this);
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
    // const rows = this.LAYOUT.map((row) => {
    //   let keys = row.map((text) => {
    //     if (text == "DELETE") {
    //       return <Key label="⌫"></Key>
    //     } else if (text == "RETURN") {
    //       return <Key label="⏎"></Key>
    //     } else {
    //       return <Key label={text}></Key>
    //     }
    //   });
    //   return <div className="grid-row">
    //     {keys}
    //   </div>;
    // })
    let root = <div className="grid-root"></div>;
    return root;
  }
}

export default Grid;