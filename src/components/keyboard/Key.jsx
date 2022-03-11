import React from "react";

class Key extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      onClickFunc: props.onClickFunc ?? (() => {}),
      label: props.label ?? "A",
      clue: 0,
    };
    this.handlePress = this.handlePress.bind(this);
    this.handleSetClue = this.handleSetClue.bind(this);
  }

  handlePress(event) {
    console.log("Key.handlePress(", event, ");\n", "Key pressed:", this.state.label)
    this.state.onClickFunc.call(this);
    /*
    this.setState({
      active: true
    })
    */
    event.preventDefault();
  }

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
      <button type="button" className={classes} onClick={this.handlePress}>
        {this.state.label}
      </button>
    )
  }
}
  
export default Key;