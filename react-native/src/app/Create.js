// @flow
import React, { Component } from 'react';
import { defaultLifeCycle, CloudStorage, MediaStorage } from '..';
import { Create1 } from './js';

type Props = {
  cloudStorageClient: CloudStorage,
  mediaStorageClient: MediaStorage,
  data: Object
};

type Media = {
  mediaUrl: string,
  mediaUrlSmall: string
}

const NUM_PAGES = 1;

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
      coverImageUrl: null,
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

  _onChange(title: ?string, itemImageUrl: ?string, coverImageUrl: ?string){
    this.setState({
      title: title,
      itemImageUrl: itemImageUrl,
      coverImageUrl: coverImageUrl
    });
  }

  _showPreview() {
    // At the very least, AQ app requires a title and a cover image,
    // before the preview screen can be shown.
    if (this.state.title &&
        this.state.coverImageUrl
    ) {
      let title = this.state.title;
      let backgroundImageUrl = this.state.backgroundImageUrl;
      let coverImageUrl = this.state.coverImageUrl;

      defaultLifeCycle.showPreviewWithData(title, coverImageUrl, {
        title: title,
        backgroundImageUrl: backgroundImageUrl,
        coverImageUrl: coverImageUrl
      });
    }
  }

  _isDataUri(url: ?string): boolean {
    if (url) {
      var regex = /data:(.*);base64,(.*)/ig;
      var match = regex.exec(url); // Regex should produce 3 capture groups
      return (match && match.length === 3)
    }
    else {
      return false;
    }
  }

  _publish(id: string) {
    // Upload data uri items first
    let coverImagePromise: Promise<?Media>

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

    coverImagePromise
    .then((response) => {
      this.setState({uploadedCoverImage: response});
      return this.props.cloudStorageClient.insert({
        id: id,
        title: this.state.title,
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
