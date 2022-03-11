import React from "react";

class Key extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      label: props.label ?? "A",
      clue: 0,
    };
    //this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSetClue = this.handleSetClue.bind(this);
  }

  // handleKeyPress(event) {
  //   console.log("Key.handleKeyPress(", event, ");\n", "Key pressed:", this.state.label)
  //   /*
  //   this.setState({
  //     active: true
  //   })
  //   */
  //   event.preventDefault();
  // }

  handleSetClue(id) {
    console.log("Key.handleSetClue(", id, ");\nKey styled:", this.state.label);
    this.setState({
      clue: id
    });
  }

  render() {
    let classes = "kb-key";
    if (this.state.clue > 0) {
      classes += " kb-clue-" + this.state.clue;
    }
    return (
      <button type="button" className={classes}>
        {this.state.label}
      </button>
    )
  }
}
  
export default Key;