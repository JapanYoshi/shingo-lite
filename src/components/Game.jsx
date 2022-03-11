import React, { createRef } from "react";
import GameLogic from "./GameLogic.jsx";
import Grid from "./grid/Grid.jsx";
import Keyboard from "./keyboard/Keyboard.jsx";
import "./Game.css";

const EMPTY_CELL = "·";

class Game extends React.Component {
  STAT_TEXT = {
    LOADING: ["Loading...", "𐑤𐑴𐑛𐑦𐑙..."],
    GUESS: ["What’s your guess?", "𐑢𐑪𐑑𐑕 𐑘𐑫𐑼 𐑜𐑧𐑕?"],
    CHECK: ["Guessing «{word_shavian}» ({word_latin})...", "𐑜𐑧𐑕𐑦𐑙 «{word_shavian}» ({word_latin})..."],
    TOO_SHORT: ["You need to type {count} more letters.", "𐑿 𐑯𐑰𐑛 𐑑 𐑑𐑲𐑐 {count} 𐑥𐑹 𐑤𐑧𐑑𐑼𐑟."],
    INVALID: ["«{word_shavian}» is not in our dictionary.", "«{word_shavian}» 𐑦𐑟 𐑯𐑪𐑑 𐑦𐑯 𐑬𐑼 𐑛𐑦𐑒𐑖𐑩𐑯𐑼𐑦."],
    HARD_MODE: ["«{word_shavian}» ({word_latin}) doesn’t fulfil earlier clues.", "«{word_shavian}» ({word_latin}) 𐑛𐑳𐑟𐑩𐑯𐑑 𐑓𐑫𐑤𐑓𐑦𐑤 𐑻𐑤𐑦𐑼 𐑒𐑤𐑵𐑟."],
    CORRECT: ["Yes, the word was «{word_shavian}» ({word_latin})!", "𐑘𐑧𐑕, 𐑞 𐑢𐑻𐑛 𐑢𐑪𐑟 «{word_shavian}» ({word_latin})!"],
    GAME_OVER: ["The answer was «{word_shavian}» ({word_latin}).", "𐑞 𐑷𐑯𐑕𐑼 𐑢𐑪𐑟 «{word_shavian}» ({word_latin})."],
  }
  constructor(props) {
    super(props);
    this.state = {
      parent: props.parent ?? undefined,
      charCount: props.charCount ?? 0,
      secret: "",
      guess: "",
      bestGuess: "",
      guessCount: 0,
      shavianMode: 1,
      status: "LOADING",
    };
    this.Grid = createRef();
    this.Status = createRef();
    this.Keeb = createRef();
    /* functions */
    this.startGame = this.startGame.bind(this);
    //this.updateGuess = this.updateGuess.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSetShavian = this.handleSetShavian.bind(this);
    /* end */
  }

  async startGame(letterCount) {
    this.setState({
      status: "LOADING",
      charCount: letterCount,
      guessCount: 0,
    });
    console.log("Game.startGame(", letterCount, ");");
    await GameLogic.loadWords(letterCount);
    console.log("Generate secret");
    let secret = GameLogic.randomSecret(letterCount);
    console.log("Secret is ", secret);
    this.Grid.current.setLetterCount(letterCount);
    this.setState({
      secret: Array.from(secret[0]),
      secretLatin: secret[1],
      guess: "",
      status: "GUESS",
    });
    let bestGuess = Array(this.state.secret.length).fill(EMPTY_CELL);
    bestGuess[0] = this.state.secret[0];
    this.setState({
      bestGuess: bestGuess,
    })
    this.updateGuess("");
  }
  // makes the grid show the current guess as we type
  updateGuess(guess) {
    let guessArr = Array.from(guess);
    let previewArr = [
      ...guessArr,
      ...this.state.bestGuess.slice(guessArr.length)
    ];
    let guessTiles = guessArr.length;
    this.Grid.current.updateGuess(previewArr, guessTiles);
  }

  handleSubmit(event) {
    console.log("Game.handleSubmit(", event, ");");
    /*
    this.setState({
      
    });
    */
   event.preventDefault();
  }

  handleSetShavian(event) {
    // wip
    let newMode = +!this.state.shavianMode;
    console.log(newMode);
    this.setState({
      shavianMode: newMode
    });
  }

  render() {
    let stat_text = this.STAT_TEXT[this.state.status][this.state.shavianMode];
    return (
      <div className="game-root">
        <Grid ref={this.Grid}></Grid>
        <div className="game-status" ref={this.Status}>{stat_text}</div>
        <Keyboard ref={this.Keeb}></Keyboard>
      </div>
    )
  }
}

export default Game;