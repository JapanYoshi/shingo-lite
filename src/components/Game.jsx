import React, { createRef } from "react";
import GameLogic from "./GameLogic.jsx";
import Grid from "./grid/Grid.jsx";
import Keyboard from "./keyboard/Keyboard.jsx";
import Modal from "./ui/Modal.jsx";
import iconExit from "../data/icon_exit.svg";
import iconGiveUp from "../data/icon_giveup.svg";
import iconRematch from "../data/icon_rematch.svg";
import iconSettings from "../data/icon_settings.svg";
import "./Game.css";

const EMPTY_CELL = "·";
const CLUE_DELAY_MS = 125; // ms

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
  letterClues = [];
  constructor(props) {
    super(props);
    this.state = {
      gameInProgress: false,
      parent: props.parent ?? undefined,
      charCount: props.charCount ?? 0,
      secret: [],
      guess: [],
      bestGuess: [],
      guessCount: 0,
      shavianMode: 1,
      status: "LOADING",
      canType: false,
    };
    this.Grid = createRef();
    this.Status = createRef();
    this.Keeb = createRef();
    this.Modal = createRef();
    /* functions */
    this.startGame = this.startGame.bind(this);
    this.handleExit = this.handleExit.bind(this);
    this.handleGiveUp = this.handleGiveUp.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.handleSetShavian = this.handleSetShavian.bind(this);
    /* end */
  }

  startGame(letterCount) {
    this.setState({
      status: "LOADING",
      gameInProgress: true,
      charCount: letterCount,
      guessCount: 0,
      canType: false,
    });
    console.log("Game.startGame(", letterCount, ");");
    GameLogic.loadWords(letterCount).then(
      () => {
        setTimeout(()=>{
          console.log("Generate secret");
          let secret = GameLogic.randomSecret(letterCount);
          console.log("Secret is ", secret);
          this.Grid.current.setLetterCount(letterCount);
          this.Keeb.current.resetClues();
          this.setState({
            secret: Array.from(secret[0]),
            secretLatin: secret[1],
            guess: [],
            status: "GUESS",
            statText: this.STAT_TEXT.GUESS[this.state.shavianMode],
            canType: true,
          });
          let bestGuess = Array(this.state.secret.length).fill(EMPTY_CELL);
          bestGuess[0] = this.state.secret[0];
          this.setState({
            bestGuess: bestGuess,
          })
          this.updateGuess(this.state.guess);
        }, 500);
      }
    );
  }
  // The keyboard calls this when a button gets pressed
  handleKeyPress(label) {
    if (!this.state.canType) {return;}
    console.log("Game.handleKeyPress(", label, ")");
    switch(label) {
      case "DELETE":
        if (this.state.guess.length > 0) {
          let newGuess = this.state.guess.slice(0, this.state.guess.length - 1);
          this.updateGuess(newGuess);
        }
        break;
      case "RETURN":
        if (this.state.guess.length == this.state.charCount) {
          this.submitGuess()
        } else {
          this.setState({
            status: "TOO_SHORT",
            statText: (this.STAT_TEXT.TOO_SHORT[this.status.shavianMode]).replace(
              '{count}',
              `${this.state.charCount - this.state.guess.length}`
            ),
          })
        }
        break;
      default:
        if (this.state.guess.length < this.state.charCount) {
          let newGuess = [...this.state.guess, label];
          this.updateGuess(newGuess);
        }
        break;
    }
  }

  // makes the grid show the current guess as we type
  updateGuess(guessArr) {
    this.setState({
      guess: guessArr
    });
    let previewArr = [
      ...guessArr,
      ...this.state.bestGuess.slice(guessArr.length)
    ];
    let guessTiles = guessArr.length;
    this.Grid.current.updateGuess(this.state.guessCount, previewArr, guessTiles);
  }

  // checks the guess. if a valid word, then deactivates the keyboard and shows the guess.
  async submitGuess() {
    console.log("Game.submitGuess(", this.state.guess, ");");
    // is this guess valid?
    let validation = GameLogic.isGuessable(
      this.state.guess.join(""),
      this.state.charCount
    );
    console.log("validation:", validation);
    if (validation[0] != -1) {
      this.Grid.current.chars[this.state.guessCount] = this.state.guess;
      this.setState({
        status: 'CHECK',
        statText: (this.STAT_TEXT.CHECK[this.state.shavianMode])
        .replace('{word_shavian}', this.state.guess.join(""))
        .replace('{word_latin}', validation[1]),
        canType: false,
      });
      let clues = GameLogic.getClues(this.state.guess, this.state.secret);
      console.log("clues:", clues);
      // update best guess if clue is 3 (hit)
      for (let i = 0; i < this.state.charCount; i++) {
        if (clues[i] == 3) {
          this.state.bestGuess[i] = this.state.secret[i];
        }
      }
      // show clues by changing the grid's state
      // use multiple Promises to animate the clue changes
      let promises = [];
      for (let i = 0; i < this.state.charCount; i++) {
        let thisPromise = new Promise((resolve) => {
          setTimeout(() => {
            this.Grid.current.clues[this.state.guessCount][i] = clues[i];
            // implicitly force an update on the grid by updating its state
            this.Grid.current.setState({
              tableIsValid: true,
            });
            // update clues on keyboard
            this.Keeb.current.updateClue(this.state.guess[i], clues[i]);
            console.log("promise resolved", i, (new Date).getTime());
            resolve(null);
          }, CLUE_DELAY_MS * (i + 1));
        });
        promises.push(thisPromise);
      }
      // then do the win/loss condition
      Promise.all(promises).then(() => {
        setTimeout(() => {
          console.log("promise resolved", "last", (new Date).getTime());
        }, CLUE_DELAY_MS);
      }).then(() => {
        // correct guess
        let correct = true
        for (let char = 0; char < this.state.charCount; char++) {
          if (clues[char] !== 3) {
            correct = false; break;
          }
        }
        if (correct) {
          this.setState({
            status: 'CORRECT',
            gameInProgress: false,
          });
          this.setState({
            statText: (this.STAT_TEXT[this.state.status][this.state.shavianMode]).replace(
              "{word_shavian}", this.state.secret.join("")
            ).replace(
              "{word_latin}", this.state.secretLatin
            ),
          });
        }
        // out of guesses
        else if (this.state.guessCount + 1 == this.Grid.current.state.rows) {
          this.gameOver();
        }
        else {
          this.setState({
            guessCount: this.state.guessCount + 1,
            status: 'GUESS',
            canType: true,
          });
          this.setState({
            statText: this.STAT_TEXT[this.state.status][this.state.shavianMode],
          });
          this.updateGuess([]);
        }
      });
    } else {
      this.setState({
        status: 'INVALID',
        statText: (this.STAT_TEXT.INVALID[this.state.shavianMode])
        .replace('{word_shavian}', this.state.guess.join("")),
      });
    }
    //event.preventDefault();
  }

  gameOver() {
    console.log("Game.gameOver()");
    this.setState({
      status: 'GAME_OVER',
      gameInProgress: false,
    });
    this.setState({
      statText: (this.STAT_TEXT[this.state.status][this.state.shavianMode]).replace(
        "{word_shavian}", this.state.secret.join("")
      ).replace(
        "{word_latin}", this.state.secretLatin
      ),
    });
  }

  handleSetShavian(event) {
    // wip
    let newMode = +!this.state.shavianMode;
    console.log(newMode);
    this.setState({
      shavianMode: newMode
    });
    event.preventDefault();
  }

  // show the confirmation for the "exit" modal
  handleExit(event) {
    this.Modal.current.showModal(
      <div>
        <p>Are you sure you want to exit back to the menu?</p>
      </div>,
      <div>
        <p>𐑸 𐑿 𐑖𐑫𐑼 𐑿 𐑢𐑪𐑯𐑑 𐑑 𐑧𐑜𐑟𐑦𐑑 𐑚𐑨𐑒 𐑑 𐑞 𐑥𐑧𐑯𐑿?</p>
      </div>,
      true,
      (event) => {this.confirmExit()},
    )
    event.preventDefault();
  }
  confirmExit(){
    this.Grid.current.reset();
    this.props.parent.exitGame();
  }

  // show the confirmation for the "restart" or "give up" modal
  handleGiveUp(event) {
    if (this.state.gameInProgress) {
      this.Modal.current.showModal(
        <div>
          <p>Are you sure you want to give up?</p>
        </div>,
        <div>
          <p>𐑸 𐑿 𐑖𐑫𐑼 𐑿 𐑢𐑪𐑯𐑑 𐑑 𐑜𐑦𐑝 𐑳𐑐?</p>
        </div>,
        true,
        (event) => {this.confirmGiveUp()},
      )
    } else {
      this.showNextWordModal(0);
    }
    event.preventDefault();
  }
  confirmGiveUp(){
    console.log("Game.confirmGiveUp()");
    this.gameOver();
  }

  showNextWordModal(diff) {
    this.Modal.current.showModal(
      <div>
        <p>Are you sure you want to play the next word? Your progress will be lost.</p>
      </div>,
      <div>
        <p>𐑸 𐑿 𐑖𐑫𐑼 𐑿 𐑢𐑪𐑯𐑑 𐑑 𐑐𐑤𐑱 𐑞 𐑯𐑧𐑒𐑕𐑑 𐑢𐑻𐑛? 𐑘𐑹 𐑐𐑮𐑴𐑜𐑮𐑧𐑕 𐑢𐑦𐑤 𐑚𐑰 𐑤𐑪𐑕𐑑.</p>
      </div>,
      true,
      (event) => {this.confirmNextWord(diff)},
    )
  }
  confirmNextWord(diff){
    console.log("Game.confirmNextWord(", diff, ")");
    this.startGame(this.state.secret.length + diff);
  }

  render() {
    let classes = 'game-root ' + (this.state.canType ? "keebActive" : "keebInactive");
    return (
      <div className={classes}>
        <Grid ref={this.Grid} parent={this}></Grid>
        <div className="game-toolbar">
          <button className="game-button btnExit" onClick={this.handleExit}><img src={iconExit}></img></button>
          <button className="game-button btnGiveUp" onClick={this.handleGiveUp}><img src={this.state.gameInProgress ? iconGiveUp : iconRematch}></img></button>
          <button className="game-button btnSettings" onClick={this.handleSettings}><img src={iconSettings}></img></button>
        </div>
        <div className="game-status" ref={this.Status}>{this.state.statText}</div>
        <Keyboard ref={this.Keeb} parent={this}></Keyboard>
        <Modal
          ref={this.Modal}
          shavianMode={this.state.shavianMode}>
        </Modal>
      </div>
    )
  }
}

export default Game;