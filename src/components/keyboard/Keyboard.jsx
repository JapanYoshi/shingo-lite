import React from "react";
import Key from "./Key.jsx";
import "./Keyboard.css";

class Keyboard extends React.Component {
  LAYOUT = [
    [     "𐑐", "𐑑", "𐑒", "𐑓", "𐑔", "𐑕", "𐑖", "𐑗", "𐑘", "𐑙"],
    [     "𐑚", "𐑛", "𐑜", "𐑝", "𐑞", "𐑟", "𐑠", "𐑡", "𐑢", "𐑣"],
    [     "𐑤", "𐑥", "𐑦", "𐑧", "𐑨", "𐑩", "𐑪", "𐑫", "𐑬", "𐑭"],
    [     "𐑮", "𐑯", "𐑰", "𐑱", "𐑲", "𐑳", "𐑴", "𐑵", "𐑶", "𐑷"],
    ["DELETE", "𐑸", "𐑹", "𐑺", "𐑻", "𐑼", "𐑽", "𐑾", "𐑿", "RETURN"],
  ];

  constructor(props) {
    super(props);

    this.state = {
      active: true
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(event) {
    console.log("Keyboard.handleKeyPress(", event, ");");
    /*
    this.setState({
      active: true
    })
    */
   event.preventDefault();
  }

  render() {
    const rows = this.LAYOUT.map((row) => {
      let keys = row.map((text) => {
        if (text == "DELETE") {
          return <Key label="⌫" onClick={this.handleKeyPress}></Key>
        } else if (text == "RETURN") {
          return <Key label="⏎" onClick={this.handleKeyPress}></Key>
        } else {
          return <Key label={text} onClick={this.handleKeyPress}></Key>
        }
      });
      return <div className="kb-row">
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