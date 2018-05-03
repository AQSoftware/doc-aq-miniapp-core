// @flow
import React, { Component } from 'react';
import './TitleTextInput.css';
import kb from './kb.png';

const KB_HEIGHT = 253;
const COMPONENT_HEIGHT = 45;

type Props = {
  onEndEditing?: (string) => void,
  className? : string
}

export class TitleTextInput extends Component {
  props: Props;

  render(){
    const height = KB_HEIGHT + COMPONENT_HEIGHT;
    const style = {
      height: height
    }

    return(
      <div className={`titleTextInput ${this.props.className ? this.props.className : ''}`} style={style}>
        <input type="text" autoFocus onKeyUp={(e) => {
          if (this.props.onEndEditing && e.keyCode === 13) {
            this.props.onEndEditing(e.target.value);
          }
        }}/>
        <img className="kb" src={kb} alt="kb"/>
      </div>
    )
  }
}
