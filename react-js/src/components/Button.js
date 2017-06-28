import React, { Component } from 'react';
import '../css/Button.css';

export class Button extends Component {
  render(){
    let className = 'button uppercase bold';
    if (this.props.isActive){
      className += ' buttonActive';
    }
    return (
      <a className={className} href="#" onClick={this.props.onClick}>{this.props.title}</a>
    );
  }
}
