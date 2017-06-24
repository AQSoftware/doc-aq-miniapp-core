import React, { Component } from 'react';
import './Panel.css';

export default class Panel extends Component {
  render(){
    var panelStyle = {
      backgroundColor: this.props.backgroundColor,
      width: this.props.width,
      height: this.props.height
    }

    var panelTitleStyle = {
      color: this.props.titleColor
    }
    return (
      <div id={this.props.id} style={panelStyle} className="panel">
        <div id="titleDiv" style={panelTitleStyle} className="panelTitle uppercase lighter">{this.props.title}</div>
        {this.props.children}
      </div>
    );
  }
}
