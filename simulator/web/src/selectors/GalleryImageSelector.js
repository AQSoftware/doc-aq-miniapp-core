// @flow
import React, { Component } from 'react';
import './WebImageSelector.css';
import image1 from './gallery/1.jpg';
import image2 from './gallery/2.jpg';
import image3 from './gallery/3.jpg';
import image4 from './gallery/4.jpg';
import image5 from './gallery/5.jpg';
import image6 from './gallery/6.jpg';
import image7 from './gallery/7.jpg';
import image8 from './gallery/8.jpg';
import image9 from './gallery/9.jpg';


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
  className?: string
}

export class GalleryImageSelector extends Component {

  props : Props
  data : Array<string>

  static defaultProps = {
    title: '',
    imageRatio: 1
  }

  constructor(props: Props) {
    super(props);
    this.data = [
      image1,
      image2,
      image3,
      image4,
      image5,
      image6,
      image7,
      image8,
      image9
    ]
  }

  _onPress(item: string){
    this._getDataUri(item, (dataUri) => {
      if (this.props.onPress){
        this.props.onPress(dataUri);
      }
    });
  }

  _getDataUri(url: string, callback: (string) => void) {
    let image = new Image();

    image.onload = () => {
        let canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = image.naturalHeight; // or 'height' if you want a special/scaled size

        // $FlowFixMe
        canvas.getContext('2d').drawImage(image, 0, 0);

        callback(canvas.toDataURL('image/jpeg'));
    };

    image.src = url;
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
          {this.data.map(this._renderItem.bind(this))}
        </ul>
      </div>
    );
  }
}
