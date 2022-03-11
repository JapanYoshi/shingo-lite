import React from "react";

class Keyboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: true
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(event) {
    console.log("Keyboard.handleKeyPress(", event, ");");
    /*
    this.setState({
      active: true
    })
    */
   event.preventDefault();
  }

  render() {
    return (
      <div className="kb-root">
        Keyboard
      </div>
    )
  }
}

export default Keyboard;