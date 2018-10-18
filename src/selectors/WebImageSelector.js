// @flow
import React, { Component } from 'react';
import './WebImageSelector.css';

const IMAGE_HEIGHT = 72;
const HEADER_HEIGHT = 22;
const IMAGE_PADDING = 5;
const SCROLL_HEIGHT = 8;
// const SELECTED_BORDER_COLOR = '#c80297';
// const SELECTED_BORDER_WIDTH = 3;

type Props = {
  title: string,
  imageRatio: number,
  onPress?: (string) => void,
  data: Array<any>,
  className?: string
}

export class WebImageSelector extends Component {

  props : Props

  static defaultProps = {
    title: '',
    imageRatio: 1,
    data: []
  }

  _onPress(item: string){
    if (this.props.onPress){
      this.props.onPress(item);
    }
  }

  /**
  Renders a selector item.

  @param {string} item - Image web url
  */
  _renderItem(item: string, index: number) {
    let imageWidth = IMAGE_HEIGHT * this.props.imageRatio;
    return <li className="listItem" key={index} style={{
      width: imageWidth + (IMAGE_PADDING * 2),
      height: IMAGE_HEIGHT + (IMAGE_PADDING * 2)
    }}>
      <a href="#" onClick={this._onPress.bind(this,item)}><div
        className="listItemContent"
        style={{
          backgroundImage: `url(${item})`,
          width: imageWidth,
          height: IMAGE_HEIGHT
        }}
    /></a>
    </li>
  }

  render() {
    const height = IMAGE_HEIGHT + HEADER_HEIGHT + (IMAGE_PADDING * 3) + SCROLL_HEIGHT;
    const style = {
      height: height
    }

    return (
      <div className={`webImageSelector ${this.props.className ? this.props.className : ''}`} style={style}>
        <div className="title" style={{height: HEADER_HEIGHT}}>{this.props.title}</div>
        <ul className="list" style={{
          height: IMAGE_HEIGHT + (IMAGE_PADDING * 2)
        }}>
          {this.props.data.map(this._renderItem.bind(this))}
        </ul>
      </div>
    );
  }
}
