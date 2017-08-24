// @flow
import React, { Component } from 'react';
import {
  CloudStorage,
  MediaStorage,
  defaultLifeCycle
} from 'aq-miniapp-core';
import {
  StaticCanvas
} from '..';
import Create1 from './js/Create1';

type Props = {
  cloudStorageClient: CloudStorage,
  mediaStorageClient: MediaStorage,
  data: Object
};

type Media = {
  mediaUrl: string,
  mediaUrlSmall: string
}

const NUM_PAGES = 2;

export default class Create extends Component {

  state: {
    currentPage: number,
    title: ?string,
    backgroundImageUrl: ?string,
    itemImageUrl: ?string,
    coverImageUrl: ?string,
    uploadedItemImage: ?Media,
    uploadedCoverImage: ?Media
  }

  constructor(props: Props){
    super(props);
    this.state = {
      currentPage: 1,
      title : null,
      backgroundImageUrl: null,
      itemImageUrl: null,
      coverImageUrl: null,
      uploadedItemImage: null,
      uploadedCoverImage: null
    }
  }

  componentWillMount(){
    // Set callback function to be called when AQ app requests to preview the
    // current content of our create screen
    defaultLifeCycle.setRequestPreviewCallback(this._showPreview.bind(this));
    defaultLifeCycle.setPublishCallback(this._publish.bind(this));
  }

  _onNextPage(component: Object) {
    if (this.state.currentPage < NUM_PAGES){
      this.setState({currentPage: this.state.currentPage + 1});
    }
  }

  _onPrevPage(component: Object) {
    if (this.state.currentPage > 1){
      this.setState({currentPage: this.state.currentPage - 1});
    }
  }

  _onChange(title: ?string, backgroundImage: ?string, itemImage: ?string, coverImage: ?string){
    this.setState({
      title: title,
      backgroundImageUrl: backgroundImage,
      itemImageUrl: itemImage,
      coverImageUrl: coverImage
    });
  }

  _showPreview() {
    // At the very least, AQ app requires a title and a cover image,
    // before the preview screen can be shown.

    if (this.state.title &&
        this.state.backgroundImageUrl &&
        this.state.itemImageUrl &&
        this.state.coverImageUrl
    ) {
      let title = this.state.title;
      let backgroundImageUrl = this.state.backgroundImageUrl;
      let itemImageUrl = this.state.itemImageUrl;
      let coverImageUrl = this.state.coverImageUrl;

      defaultLifeCycle.showPreviewWithData(title, coverImageUrl, {
        title: title,
        backgroundImageUrl: backgroundImageUrl,
        itemImageUrl: itemImageUrl,
        coverImageUrl: coverImageUrl
      });
    }
  }

  _isDataUri(url: ?string): boolean {
    if (url) {
      var regex = /data:(.*);base64,(.*)/ig;
      var match = regex.exec(url); // Regex should produce 3 capture groups
      return (match.length === 3)
    }
    else {
      return false;
    }
  }

  _publish(id: string) {
    // Upload data uri items first
    let itemImagePromise: Promise<?Media>
    let coverImagePromise: Promise<?Media>

    if(this._isDataUri(this.state.itemImageUrl)) {
      let itemImageMedia = this.props.mediaStorageClient.base64DataUrlToByteArray(this.state.itemImageUrl);
      itemImagePromise = this.props.mediaStorageClient.upload(itemImageMedia)
        .then((response) => this.props.mediaStorageClient.get(response.id));
    }
    else if(this.state.itemImageUrl){
      itemImagePromise = Promise.resolve({mediaUrl: this.state.itemImageUrl, mediaUrlSmall: this.state.itemImageUrl});
    }
    else {
      itemImagePromise = Promise.resolve(null);
    }

    if(this._isDataUri(this.state.coverImageUrl)) {
      let coverImageMedia = this.props.mediaStorageClient.base64DataUrlToByteArray(this.state.coverImageUrl);
      coverImagePromise = this.props.mediaStorageClient.upload(coverImageMedia)
        .then((response) => this.props.mediaStorageClient.get(response.id));
    }
    else if(this.state.coverImageUrl){
      coverImagePromise = Promise.resolve({mediaUrl: this.state.coverImageUrl, mediaUrlSmall: this.state.coverImageUrl});
    }
    else {
      coverImagePromise = Promise.resolve(null);
    }

    itemImagePromise
    .then((response) => {
      this.setState({uploadedItemImage: response});
      return coverImagePromise;
    })
    .then((response) => {
      this.setState({uploadedCoverImage: response});
      return this.props.cloudStorageClient.insert({
        id: id,
        title: this.state.title,
        backgroundImageUrl: this.state.backgroundImageUrl,
        itemImage: this.state.uploadedItemImage,
        coverImage: this.state.uploadedCoverImage,
        source: this.props.data.source
      })
    })
    .then((response) => {
      defaultLifeCycle.publishSucceded();
    })
    .catch((error) => {
      console.log(`Error occured while sending to cloud storage: ${error}`);
      defaultLifeCycle.publishFailed();
    });
  }

  render() {
    let render = null;
    let {currentPage: _, ...pageState} = this.state;

    switch (this.state.currentPage) {
      case 1:
        render = <Create1
          {...this.props}
          {...pageState}
          onChange={this._onChange.bind(this)}
          showPreview={this._showPreview.bind(this)}
        />
        break;
      default:
    }
    return render;
  }
}
