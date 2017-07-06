// @flow
import React, { Component } from 'react';
import {
  StaticCanvas,
  Panel,
  Button,
  defaultUIBridge
} from '../..';
import '../css/Create1.css';

const ITEM_WIDTH_PERCENTAGE = 0.65;

type Props = {
  onChange?: (string, string, string, string) => void,
  showPreview?: () => void
}

const Buttons = {
  BACKGROUND: 0,
  ITEM: 1,
  COVER: 2
}

export default class Create1 extends Component {
  state : {
    selectedIndex: number,
    backgroundImg: ?string,
    itemImg: ?string,
    coverImg: ?string,
    title: ?string
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      selectedIndex: -1,
      backgroundImg: null,
      itemImg: null,
      coverImg: null,
      title: null
    }
  }

  _onChange() {
    if (this.props.onChange) {
      let {title, backgroundImg, itemImg, coverImg} = this.state;
      this.props.onChange(title, backgroundImg, itemImg, coverImg);
    }
  }

  _onButtonClick(index: number){
    this.setState({selectedIndex: index});
    switch (index) {
      case Buttons.BACKGROUND:
        defaultUIBridge.showWebImageSelector(
          'background',
          'Select a background template',
          [
            'https://s3-ap-southeast-1.amazonaws.com/funminiapps/create/bg/bg1.jpg',
            'https://s3-ap-southeast-1.amazonaws.com/funminiapps/create/bg/bg2.jpg',
            'https://s3-ap-southeast-1.amazonaws.com/funminiapps/create/bg/bg3.jpg',
            'https://s3-ap-southeast-1.amazonaws.com/funminiapps/create/bg/bg4.jpg',
            'https://s3-ap-southeast-1.amazonaws.com/funminiapps/create/bg/bg5.jpg',
            'https://s3-ap-southeast-1.amazonaws.com/funminiapps/create/bg/bg6.jpg'
          ],
          this._onRequestBackgroundImage.bind(this)
        );
        break;
      case Buttons.ITEM:
        defaultUIBridge.showGalleryImageSelector('item', 'Select an item to pass', this._onRequestItemImage.bind(this));
        // defaultUIBridge.showWebImageSelector(
        //   'item',
        //   'Select a background template',
        //   [
        //     'https://images3.pixlis.com/background-image-stripes-and-lines-seamless-tileable-232nm5.png',
        //     'https://images3.pixlis.com/background-image-dual-two-line-striped-seamless-tileable-beaver-victoria-234s89.png',
        //     'https://images1.pixlis.com/background-image-stripes-and-lines-seamless-tileable-232h4x.png',
        //     'https://images2.pixlis.com/background-image-dual-two-line-striped-seamless-tileable-234g7q.png'
        //   ],
        //   this._onRequestItemImage.bind(this)
        // );
        break;
      case Buttons.COVER:
        defaultUIBridge.showGalleryImageSelector('cover', 'Select a cover photo', this._onRequestCoverImage.bind(this));
        // defaultUIBridge.showWebImageSelector(
        //   'cover',
        //   'Select a background template',
        //   [
        //     'https://images3.pixlis.com/background-image-stripes-and-lines-seamless-tileable-232nm5.png',
        //     'https://images3.pixlis.com/background-image-dual-two-line-striped-seamless-tileable-beaver-victoria-234s89.png',
        //     'https://images1.pixlis.com/background-image-stripes-and-lines-seamless-tileable-232h4x.png',
        //     'https://images2.pixlis.com/background-image-dual-two-line-striped-seamless-tileable-234g7q.png'
        //   ],
        //   this._onRequestCoverImage.bind(this)
        // );
        break;
      default:

    }
  }

  _onRequestBackgroundImage(key: string, backgroundImg: string) {
    this.setState({backgroundImg: backgroundImg});
    this._onChange();
  }

  _onRequestItemImage(key: string, itemImg: string) {
    this.setState({itemImg: itemImg});
    this._onChange();
  }

  _onRequestCoverImage(key: string, coverImg: string) {
    this.setState({coverImg: coverImg});
    this._onChange();
    defaultUIBridge.showTitleInput(this._onRequestTitle.bind(this));
  }

  _onRequestTitle(title: string) {
    this.setState({title: title});
    this._onChange();

    if (this.props.showPreview) {
      this.props.showPreview();
    }
  }

  render() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    let background = null;
    let itemImage = null;
    let cover = null;


    if (this.state.selectedIndex !== Buttons.COVER){
      if (this.state.backgroundImg != null){
        background = <img src={this.state.backgroundImg} className='create-background' alt='background'/>
      }
      else {
        background = <StaticCanvas width={width} height={height}/>;
      }
      if (this.state.itemImg != null){
        itemImage = <img src={this.state.itemImg} className='create-item' width={width * ITEM_WIDTH_PERCENTAGE} height={width * ITEM_WIDTH_PERCENTAGE} alt='item'/>;
      }
    }
    else {
      if (this.state.coverImg == null){
        if (this.state.backgroundImg != null){
          background = <img src={this.state.backgroundImg} className='create-background' alt='background'/>
        }
        else {
          background = <StaticCanvas width={width} height={height}/>;
        }
        if (this.state.itemImg != null){
          itemImage = <img src={this.state.itemImg} className='create-item' width={width * ITEM_WIDTH_PERCENTAGE} height={width * ITEM_WIDTH_PERCENTAGE} alt='item'/>;
        }
      }
      else {
        cover = <img src={this.state.coverImg} className='create-background' alt='background'/>
      }
    }
    return (
      <div className='create-container'>
        {background}
        {cover}
        {itemImage}
        <Panel id="content" title="Content" backgroundColor="rgba(38, 38, 38, 0.8)" width="200px" titleColor="White" className="uppercase lighter">
          <Button title="Background" isActive={ this.state.selectedIndex === 0 } onClick={() => { this._onButtonClick(0); }}/>
          <Button title="Item" isActive={ this.state.selectedIndex === 1 } onClick={() => { this._onButtonClick(1); }}/>
          <Button title="Cover" isActive={ this.state.selectedIndex === 2 } onClick={() => { this._onButtonClick(2); }}/>
        </Panel>
      </div>
    );
  }
}
