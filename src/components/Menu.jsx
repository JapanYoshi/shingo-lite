import React from "react";
import "./Menu.css";

class Menu extends React.Component {
  STR = {
    CHOOSELEN: ["Choose letter count", "𐑗𐑵𐑟 𐑤𐑧𐑑𐑼 𐑒𐑬𐑯𐑑"],
    LETTERS: ["%s letters", "%s 𐑤𐑧𐑑𐑼𐑟"],
    DX_HEAD: ["Check out Shingo Deluxe!", "𐑗𐑧𐑒 𐑬𐑑 ·𐑖𐑦𐑙𐑜𐑴 𐑛𐑦𐑤𐑳𐑒𐑕!"],
    DX_SOUND: ["Sound effects", "𐑕𐑬𐑯𐑛 𐑦𐑓𐑧𐑒𐑑𐑕"],
    DX_GODOT: ["Powered by Godot Engine", "𐑐𐑬𐑼𐑛 𐑚𐑲 ·𐑜𐑪𐑛𐑴 (Godot) 𐑧𐑯𐑡𐑦𐑯"],
    DX_READ: ["Reads words aloud", "𐑮𐑰𐑛𐑟 𐑢𐑻𐑛𐑟 𐑩𐑤𐑬𐑛"],
    DX_SLOW: ["Longer load time", "𐑤𐑪𐑙𐑜𐑼 𐑤𐑴𐑛 𐑑𐑲𐑥"],
    DX_PLAY: ["Play Shingo Deluxe", "𐑐𐑤𐑱 ·𐑖𐑦𐑙𐑜𐑴 𐑛𐑦𐑤𐑳𐑒𐑕"],
  };

  constructor(props) {
    super(props);
    this.state = {
      parent: props.parent ?? undefined,
      shavianMode: 1,
      charCount: 0,
    };
    this.handleSetShavian = this.handleSetShavian.bind(this);
    this.handleStart = this.handleStart.bind(this);
  }

  handleSetShavian(event) {
    //console.log("Game.handleStart(", event, ");");
    let newMode = +!this.state.shavianMode;
    console.log(newMode);
    this.setState({
      shavianMode: newMode
    });
    // propagate to children who have the shavianMode state
    React.Children.forEach((child) => {
      console.log(child);
      if (child.props.shavianMode !== undefined) {
        child.handleSetShavian();
      }
      return child;
    });
    event.preventDefault();
  }
  
  handleStart(event) {
    //console.log("Game.handleStart(", event, ");");
    let letterCount = event.target.value;
    console.log(letterCount);
    this.state.parent.startGame(letterCount);
    event.preventDefault();
  }

  render() {
    return (
      <div id="menu-root">
        <h3>{this.STR.CHOOSELEN[this.state.shavianMode]}</h3>
        <div className="menu-length">
          <button type="button" onClick={this.handleStart} value="4">
            {this.STR.LETTERS[this.state.shavianMode].replace('%s', 4)}
          </button>
          <button type="button" onClick={this.handleStart} value="5">
            {this.STR.LETTERS[this.state.shavianMode].replace('%s', 5)}
          </button>
          <button type="button" onClick={this.handleStart} value="6">
            {this.STR.LETTERS[this.state.shavianMode].replace('%s', 6)}
          </button>
          <button type="button" onClick={this.handleStart} value="7">
            {this.STR.LETTERS[this.state.shavianMode].replace('%s', 7)}
          </button>
        </div>
        <h3>{this.STR.DX_HEAD[this.state.shavianMode]}</h3>
        <ul className="selling-points">
          <li>{this.STR.DX_GODOT[this.state.shavianMode]}</li>
          <li>☺ {this.STR.DX_SOUND[this.state.shavianMode]}</li>
          <li>☺ {this.STR.DX_READ[this.state.shavianMode]}</li>
          <li>☹ {this.STR.DX_SLOW[this.state.shavianMode]}</li>
        </ul>
        <a href="https://haitouch.ga/me/shingo/index">{this.STR.DX_PLAY[this.state.shavianMode]}</a>
      </div>
    )
  }
}

export default Menu;