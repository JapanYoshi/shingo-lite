import React, { createRef } from "react";
import GameLogic from "./GameLogic.jsx";
import Grid from "./grid/Grid.jsx";
import Keyboard from "./keyboard/Keyboard.jsx";
import iconExit from "../data/icon_exit.svg";
import iconGiveUp from "../data/icon_giveup.svg";
import iconRematch from "../data/icon_rematch.svg";
import iconSettings from "../data/icon_settings.svg";
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
      gameInProgress: false,
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
    //this.submitGuess = this.submitGuess.bind(this);
    this.handleSetShavian = this.handleSetShavian.bind(this);
    /* end */
  }

  async startGame(letterCount) {
    this.setState({
      status: "LOADING",
      gameInProgress: true,
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
      guess: [],
      status: "GUESS",
      statText: this.STAT_TEXT.GUESS[this.state.shavianMode],
    });
    let bestGuess = Array(this.state.secret.length).fill(EMPTY_CELL);
    bestGuess[0] = this.state.secret[0];
    this.setState({
      bestGuess: bestGuess,
    })
    this.updateGuess(this.state.guess);
  }

  handleKeyPress(label) {
    console.log("Game.handleKeyPress(", label, ")");
    switch(label) {
      case "DELETE":
        if (this.state.guess.length > 0) {
          let newGuess = this.state.guess.subarray(0, this.state.guess.length - 1);
          this.setState({
            guess: newGuess,
          });
          this.updateGuess(newGuess);
        }
        break;
      case "RETURN":
        if (this.state.guess.length == this.state.charCount) {
          this.submitGuess()
        } else {
          this.setState({
            status: "TOO_SHORT",
            statText: this.STAT_TEXT.TOO_SHORT.replace(
              '{count}',
              `${this.state.charCount - this.state.guess.length}`
            ),
          })
        }
        break;
      default:
        if (this.state.guess.length < this.state.charCount) {
          let newGuess = [...this.state.guess, label];
          this.setState({
            guess: newGuess
          });
          this.updateGuess(newGuess);
        }
        break;
    }
  }

  // makes the grid show the current guess as we type
  updateGuess(guessArr) {
    let previewArr = [
      ...guessArr,
      ...this.state.bestGuess.slice(guessArr.length)
    ];
    let guessTiles = guessArr.length;
    this.Grid.current.updateGuess(previewArr, guessTiles);
  }

  submitGuess() {
    console.log("Game.submitGuess(", this.state.guess, ");");
    // is this guess valid?
    let validation = GameLogic.isGuessable(
      this.state.guess.join(""),
      this.state.charCount
    );
    console.log("validation:", validation);
    if (validation[0] != -1) {
      this.setState({
        status: 'CHECK',
        statText: (this.STAT_TEXT.CHECK[this.state.shavianMode])
        .replace('{word_shavian}', this.state.guess.join(""))
        .replace('{word_latin}', validation[1]),
      });
      let clues = GameLogic.getClues(this.state.guess, this.state.secret);
      console.log("clues:", clues);
    } else {
      this.setState({
        status: 'INVALID',
        statText: (this.STAT_TEXT.INVALID[this.state.shavianMode])
        .replace('{word_shavian}', this.state.guess.join("")),
      });
    }
    //event.preventDefault();
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
    return (
      <div className="game-root">
        <Grid ref={this.Grid} parent={this}></Grid>
        <div className="game-toolbar">
          <button className="game-button btnExit"><img src={iconExit}></img></button>
          <button className="game-button btnGiveUp"><img src={this.state.gameInProgress ? iconGiveUp : iconRematch}></img></button>
          <button className="game-button btnSettings"><img src={iconSettings}></img></button>
        </div>
        <div className="game-status" ref={this.Status}>{this.state.statText}</div>
        <Keyboard ref={this.Keeb} parent={this}></Keyboard>
      </div>
    )
  }
}

export default Game;