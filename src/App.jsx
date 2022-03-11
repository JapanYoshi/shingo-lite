import logo from './logo.svg';
import './App.css';
import React from 'react';
import Menu from './components/Menu';
import Game from './components/Game';

class App extends React.Component {
  STR = {
    ABOUT: ["About", "𐑩𐑚𐑬𐑑"],
    SWITCH: ["𐑖𐑱𐑝𐑾𐑯", "Latin"],
    CRED_BY: ["Coded by hai!touch Studios", "𐑒𐑴𐑛𐑩𐑛 𐑚𐑲 ·𐑣𐑲!𐑑𐑳𐑗 𐑕𐑑𐑿𐑛𐑦𐑴𐑟"],
    CRED_REACT: ["Powered by React.js.", "𐑐𐑬𐑼𐑛 𐑚𐑲 React.js"],
    CRED_BASED: ["Based on the TV show Lingo, and its webapp clone Wordle.", "𐑚𐑱𐑕𐑑 𐑪𐑯 𐑞 ⸰𐑑𐑝 𐑖𐑴 ·𐑤𐑦𐑙𐑜𐑴, 𐑨𐑯𐑛 𐑦𐑑𐑕 𐑢𐑧𐑚𐑨𐑐 𐑒𐑤𐑴𐑯 ·𐑢𐑻𐑛𐑩𐑤."],
    CRED_WORDS: ["Word list compiled from the Kingsley Read Lexicon.", "𐑢𐑻𐑛 𐑤𐑦𐑕𐑑 𐑒𐑩𐑥𐑐𐑲𐑤𐑛 𐑓𐑮𐑪𐑥 𐑞 ·𐑒𐑦𐑙𐑜𐑟𐑤𐑦 𐑮𐑰𐑛 𐑤𐑧𐑒𐑕𐑦𐑒𐑪𐑯."],
    CRED_FONT: ["Mikado font by HVD Fonts (Hannes Van Döhren). Shavian extension by Haley Halcyon.", "·𐑥𐑦𐑒𐑭𐑛𐑴 (Mikado) 𐑓𐑪𐑯𐑑 𐑚𐑲 ·HVD 𐑓𐑪𐑯𐑑𐑕 (Hannes Van Döhren). 𐑖𐑱𐑝𐑾𐑯 𐑦𐑒𐑕𐑑𐑧𐑯𐑖𐑩𐑯 𐑚𐑲 ·𐑣𐑱𐑤𐑰 𐑣𐑨𐑤𐑕𐑾𐑯."],
    CRED_SHAWDLE: ["For a once-a-day experience, try Shawdle by Shavian School.", "𐑓 𐑩 𐑢𐑳𐑯𐑕-𐑩-𐑛𐑱 𐑦𐑒𐑕𐑐𐑽𐑾𐑯𐑕, 𐑑𐑮𐑲 ·𐑖𐑬𐑛𐑩𐑤 𐑚𐑲 ·𐑖𐑱𐑝𐑾𐑯 𐑕𐑒𐑵𐑤."],
  }
  constructor(props) {
    super(props);
    this.state = {
      shavianMode: 1,
    };
    this.menu = React.createRef();
    this.game = React.createRef();
    this.handleAbout = this.handleAbout.bind(this);
    this.handleSetShavian = this.handleSetShavian.bind(this);
  }

  handleAbout(event) {
    console.log("TODO");
  }

  handleSetShavian(event) {
    //console.log("Game.handleStart(", event, ");");
    let newMode = +!this.state.shavianMode;
    console.log(newMode);
    this.setState({
      shavianMode: newMode
    });
    // propagate to children who have the shavianMode state
    this.menu.current.handleSetShavian(event);
    this.game.current.handleSetShavian(event);
    event.preventDefault();
  }

  render() {
    return (
      <div id="App" className="App">
        <header className="App-header">
          <button className="App-about" type="button" onClick={this.handleAbout}>
            {this.STR.ABOUT[this.state.shavianMode]}
          </button>
          <img className="App-logo" src={logo} alt="𐑖𐑦𐑙𐑜𐑴 𐑤𐑲𐑑 Shingo Lite"></img>
          <button className="App-mode" type="button" onClick={this.handleSetShavian}>
            {this.STR.SWITCH[this.state.shavianMode]}
          </button>
        </header>
        <Menu ref={this.menu}></Menu>
        <Game ref={this.game}></Game>
      </div>
    );
  }
}

export default App;
