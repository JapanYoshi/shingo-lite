import React from "react";

const CLUE_LABELS = {
  0: "",
  1: "×",
  2: "!",
  3: "√",
  4: ""
};
class GridLetter extends React.Component {
  constructor(props) {
    //console.log("GridLetter.constructor(", props, ")");
    super(props);
    this.state = {
      label: "",
      clue: 0,
      clueLabel: CLUE_LABELS[props.clue],
    };
  }
  static getDerivedStateFromProps(props, state) {
    //console.log("GridLetter.getDerivedStateFromProps(", props, state, ")");
    state.label = props.label;
    state.clue = props.clue;
    state.clueLabel = CLUE_LABELS[props.clue];
    return state;
  }

  render() {
    let classes = `grid-letter clue${this.state.clue} codepoint${this.state.label.codePointAt(0)}`;
    return (
      <div className={classes}>
        <div className="grid-letter-label">
          {this.state.label}
        </div>
        <div className="grid-clue-label">
          {this.state.clueLabel}
        </div>
      </div>
    );
  }
}

export default GridLetter;