import React from "react";
import Key from "./Key.jsx";
import "./Keyboard.css";

class Keyboard extends React.Component {
  LAYOUT = [
    [     "𐑐", "𐑑", "𐑒", "𐑓", "𐑔", "𐑕", "𐑖", "𐑗", "𐑘", "𐑙"     ],
    [     "𐑚", "𐑛", "𐑜", "𐑝", "𐑞", "𐑟", "𐑠", "𐑡", "𐑢", "𐑣"     ],
    [     "𐑤", "𐑥", "𐑦", "𐑧", "𐑨", "𐑩", "𐑪", "𐑫", "𐑬", "𐑭"     ],
    [     "𐑮", "𐑯", "𐑰", "𐑱", "𐑲", "𐑳", "𐑴", "𐑵", "𐑶", "𐑷"     ],
    ["DELETE", "𐑸", "𐑹", "𐑺", "𐑻", "𐑼", "𐑽", "𐑾", "𐑿", "RETURN"],
  ];

  constructor(props) {
    super(props);

    this.state = {
      active: true,
      parent: props.parent,
      clues: [],
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  resetClues() {
    this.setState({clues: []});
  }

  updateClue(key, value) {
    if ((this.state.clues[key] ?? 0) < value) {
      let clues = this.state.clues;
      clues[key] = value;
      this.setState({
        clues
      });
      console.log("clues updated:",key, value, this.state.clues);
    }
  }

  handleKeyPress(label) {
    console.log("Keyboard.handleKeyPress(", label, ");");
    this.state.parent.handleKeyPress(label);
  }

  render() {
    console.log("Keyboard.render()");
    let i = 0;
    const rows = this.LAYOUT.map((row) => {
      let keys = row.map((text) => {
        return (
          <Key
            key={"kb_key_" + text}
            label={(
              (text === "DELETE") ? "⌫" : (
                (text === "RETURN") ? "⏎" : text
              )
            )}
            clue={this.state.clues[text] ?? 0}
            onClickFunc={() => {this.handleKeyPress(text)}}>
          </Key>
        )
      });
      i += 1;
      return <div key={`kb_row_${i}`} className="kb-row">
        {keys}
      </div>;
    })
    let root = <div className="kb-root">
      {rows}
    </div>;
    return root;
  }
}

export default Keyboard;