import { toHaveDisplayValue } from "@testing-library/jest-dom/dist/matchers";
import React from "react";
import iconExit from '../../data/icon_exit.svg';
import './Modal.css';

class Key extends React.Component {
  constructor(props) {
    super(props);
    // not sure if i should use props or state
    this.state = {
      visible: props.visible ?? false,
      shavianMode: props.shavianMode ?? 1,
      callback: props.callback ?? (() => {}),
      content: props.content ?? <p>Sample text sample text sample text</p>,
      contentLatin: props.content ?? <p>Sample text sample text sample text</p>,
      yesNo: props.yesNo ?? false,
    };
    this.toggleShavian = this.toggleShavian.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.callback = this.callback.bind(this);
  }

  toggleShavian(){
    this.setState({
      shavianMode: +!(this.state.shavianMode),
    });
  }

  showModal(content, contentLatin, yesNo, callback) {
    this.setState({
      content,
      contentLatin,
      yesNo,
      callback,
      visible: true,
    });
  }

  callback(event) {
    this.state.callback.call(this);
    this.setState({visible: false});
    event.preventDefault();
  }

  closeModal(event) {
    //this.state.callback.call(this);
    this.setState({visible: false});
    event.preventDefault();
  }

  render() {
    console.log("Modal.render()");
    if (!this.state.visible) {
      return <div></div>
    }
    return (
      <div className="modal-bg">
        <div className="modal-box">
          <div className="modal-scroller">
            <button type="button" onClick={this.toggleShavian}className="modal-shavianButton">{
              this.state.shavianMode ? "L" : "𐑖"
            }</button>
            {this.state.yesNo ? '' : <button type="button" className="modal-closeButton"
            onClick={this.closeModal}><img src={iconExit}></img></button>}
            <div className="modal-content">
              {this.state.content}
              {this.state.yesNo ? <div className="modal-yesno-box">
                <button type="button" className="modal-confirmButton"
                onClick={this.callback}>Yes</button>
                <button type="button" className="modal-confirmButton"
                onClick={this.closeModal}>No</button>
              </div> : ''}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
  
export default Key;