import React from "react";
import Grid from "./grid/Grid.jsx";
import Keyboard from "./keyboard/Keyboard.jsx";
import "./Game.css";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      char_count: 0,
      secret: "",
      guess_count: 0
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    console.log("Game.handleSubmit(", event, ");");
    /*
    this.setState({
      
    });
    */
   event.preventDefault();
  }

  render() {
    return (
      <div className="game-root">
        <Grid></Grid>
        <Keyboard></Keyboard>
      </div>
    )
  }
}

export default Game;