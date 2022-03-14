import React from "react";

const CLUE_LABELS = {
  0: "",
  1: "×",
  2: "!",
  3: "√",
  4: ""
};

class Key extends React.Component {
  constructor(props) {
    super(props);
    // not sure if i should use props or state
    this.state = {
      onClickFunc: props.onClickFunc ?? (() => {}),
      label: props.label ?? "",
      clue: props.clue ?? "",
    };
    this.handlePress = this.handlePress.bind(this);
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

  render() {
    let classes = "kb-key clue" + this.props.clue;
    return (
      <button type="button" className={classes} onClick={this.handlePress}>
        <div className="kb-label">
          {this.props.label}
        </div>
        <div className="kb-clue-label">
          {CLUE_LABELS[this.props.clue]}
        </div>
      </button>
    )
  }
}
  
export default Key;