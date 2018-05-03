// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { AqMiniappSdk, Messages } from './polyfill';
import { FunTypeSelector, getFriends } from './selectors/FunTypeSelector';
import type { SelectorMode } from './selectors/FunTypeSelector';
import { PreviewTable } from './components/PreviewTable';
import {
  Button,
  ControlLabel,
  Form,
  FormControl,
  // Radio,
  Panel
} from 'react-bootstrap';
import uuidv1 from 'uuid/v1';
import Base64JS from 'base64-js';
import iphone from './img/iphone.png';
import nav_gradient from './img/nav_gradient.png';
import nav_back_white from './img/nav_back_white.png';
import './App.css';

type Props = {
  targetUrl: string
}

class App extends Component {
  state: {
    tempTargetUrl: string,
    targetUrl : string,
    mode: 'create' | 'preview',
    previewData: ?Object,
    createOutputData: Array<Object>,
    joinOutputData: Array<Object>,
    selectorMode: SelectorMode,
    webImageSelectorData: {
      key: string,
      title: string,
      data: Array<string>
    },
    galleryImageSelectorData: {
      key: string,
      title: string
    },
    friendSelectorData: {
      key: string
    }
  }

  // createSdk: AqMiniappSdk;
  joinSdk: AqMiniappSdk;
  source: Object;
  engagementSource: Object;

  createIFrame: HTMLIFrameElement;
  joinIFrame: HTMLIFrameElement;
  id: string;

  constructor(props: Props) {
    super(props);
    this.state = {
      tempTargetUrl: props.targetUrl,
      targetUrl: props.targetUrl,
      mode: 'preview',
      previewData: null,
      createOutputData: [],
      selectorMode: 'none',
      webImageSelectorData: {
        key : '',
        title: '',
        data: []
      },
      galleryImageSelectorData : {
        key : '',
        title: ''
      },
      friendSelectorData : {
        key : ''
      }
    }
    this.id = this._generateId();
    this.source = {
      id: 'RVO_YE8EEeikXwq8J4CZ6g',
      displayName: 'Anna Smith',
      avatarBig: 'https://getfyt.s3.amazonaws.com/users_avatar/10454/2016-09-21t193052883525-yourtrainer.com-profiles-california-santa-barbara-36205ec-lydia-kitahara-photos_resize.jpg',
      avatarSmall: 'https://getfyt.s3.amazonaws.com/users_avatar/10454/2016-09-21t193052883525-yourtrainer.com-profiles-california-santa-barbara-36205ec-lydia-kitahara-photos_resize.jpg'
    }

    this.engagementSource = {
      id: 'SZppwE8EEeikXwq8J4CZ6g',
      displayName: 'Join Smith',
      avatarBig: 'https://daks2k3a4ib2z.cloudfront.net/55d62f32fa59c51977889877/561d4d3b8cf0398714ac71b5_MM-092714_Avatar.jpg',
      avatarSmall: 'https://daks2k3a4ib2z.cloudfront.net/55d62f32fa59c51977889877/561d4d3b8cf0398714ac71b5_MM-092714_Avatar.jpg'
    }
  }

  componentDidMount(){
    // let createSdk = new AqMiniappSdk(this._getOrigin(this.props.targetUrl), this.createIFrame.contentWindow);
    // createSdk.addMessageHandler(Messages.MESSAGE_SHOW_WEB_IMAGE_SELECTOR, this._showWebImageSelector.bind(this));
    // createSdk.addMessageHandler(Messages.MESSAGE_SHOW_GALLERY_IMAGE_SELECTOR, this._showGalleryImageSelector.bind(this));
    // createSdk.addMessageHandler(Messages.MESSAGE_SHOW_TITLE_INPUT, this._showTitleInput.bind(this));
    // createSdk.addMessageHandler(Messages.MESSAGE_SHOW_FRIENDS_SELECTOR, this._showFriendsSelector.bind(this));
    // createSdk.addMessageHandler(Messages.MESSAGE_SHOW_FRIENDS_SELECTOR_PROMISE, this._showFriendsSelectorPromise.bind(this));    
    // createSdk.addMessageHandler(Messages.MESSAGE_GET_FRIENDS, this._getFriends.bind(this));
    // createSdk.addMessageHandler(Messages.MESSAGE_SHOW_PREVIEW_WITH_DATA, this._showPreviewWithData.bind(this));
    // createSdk.addMessageHandler(Messages.MESSAGE_PUBLISH_STATUS, this._publishStatus.bind(this));
    // createSdk.addMessageHandler(Messages.MESSAGE_JOIN, this._join.bind(this));
    // createSdk.addMessageHandler(Messages.MESSAGE_END, this._end.bind(this));
    // createSdk.shouldHandleEvent = () => {return this._shouldHandleEvent('create');}
    // this.createSdk = createSdk;

    let joinSdk = new AqMiniappSdk(this._getOrigin(this.props.targetUrl), this.joinIFrame.contentWindow);
    joinSdk.addMessageHandler(Messages.MESSAGE_SHOW_WEB_IMAGE_SELECTOR, this._showWebImageSelector.bind(this));
    joinSdk.addMessageHandler(Messages.MESSAGE_SHOW_GALLERY_IMAGE_SELECTOR, this._showGalleryImageSelector.bind(this));
    joinSdk.addMessageHandler(Messages.MESSAGE_SHOW_TITLE_INPUT, this._showTitleInput.bind(this));
    joinSdk.addMessageHandler(Messages.MESSAGE_SHOW_FRIENDS_SELECTOR, this._showFriendsSelector.bind(this));
    joinSdk.addMessageHandler(Messages.MESSAGE_SHOW_FRIENDS_SELECTOR_PROMISE, this._showFriendsSelectorPromise.bind(this));    
    joinSdk.addMessageHandler(Messages.MESSAGE_GET_FRIENDS, this._getFriends.bind(this));
    joinSdk.addMessageHandler(Messages.MESSAGE_SHOW_PREVIEW_WITH_DATA, this._showPreviewWithData.bind(this));
    joinSdk.addMessageHandler(Messages.MESSAGE_PUBLISH_STATUS, this._publishStatus.bind(this));
    joinSdk.addMessageHandler(Messages.MESSAGE_JOIN, this._join.bind(this));
    joinSdk.addMessageHandler(Messages.MESSAGE_SET_APP_DATA, this._setAppData.bind(this));
    joinSdk.addMessageHandler(Messages.MESSAGE_INFORM_READY, this._informReady.bind(this));
    joinSdk.addMessageHandler(Messages.MESSAGE_END, this._end.bind(this));
    joinSdk.shouldHandleEvent = () => {return this._shouldHandleEvent('preview');}
    this.joinSdk = joinSdk;
  }

  _getOrigin(url: string): string {
    var parser = document.createElement('a');
    parser.href = url;
    return `${parser.protocol}//${parser.host}`;
  }

  _shouldHandleEvent(mode: string): boolean {
    return this.state.mode === mode;
  }

  _currentSdk() {
    // return (this.state.mode === 'create' ? this.createSdk : this.joinSdk);
    return this.joinSdk;
  }

  _generateId(): string {
    let arr = new Array(16);
    uuidv1(null, arr, 0);
    return Base64JS.fromByteArray(arr).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
  }

  _showWebImageSelector(param: Object) {
    let {key, title, imageUrls} = param;
    if (key) {
      this.setState({
        webImageSelectorData: {
          'key': key,
          'title' : title ? title : 'Select an Item',
          'data' : imageUrls ? imageUrls : []
        },
        selectorMode: 'webImage'
      });
    }
  }

  _onWebImageSelected(item: string) {
    this.setState({selectorMode: 'none'});
    this._currentSdk().sendMessageToFunType(Messages.MESSAGE_SHOW_WEB_IMAGE_SELECTOR, this.state.webImageSelectorData.key, item, false);
  }

  _showGalleryImageSelector(param: Object) {
    let {key, title} = param;
    if (key) {
      this.setState({
        galleryImageSelectorData: {
          'key': key,
          'title' : title ? title : 'Select an Item',
        },
        selectorMode: 'gallery'
      });
    }
  }

  _onGalleryImageSelected(item: string) {
    this.setState({selectorMode: 'none'});
    this._currentSdk().sendMessageToFunType(Messages.MESSAGE_SHOW_GALLERY_IMAGE_SELECTOR, this.state.galleryImageSelectorData.key, item, false);
  }

  _showTitleInput(param: Object) {
    this.setState({
      selectorMode: 'title'
    });
  }

  _onTitleInputResult(text: string){
    this.setState({selectorMode: 'none'});
    this._currentSdk().sendMessageToFunType(Messages.MESSAGE_SHOW_TITLE_INPUT, 'default', text, false);
  }

  _showFriendsSelector(param: Object) {
    let {key} = param;
    if (key) {
      this.setState({
        friendSelectorData: {
          'key': key,
          message: Messages.MESSAGE_SHOW_FRIENDS_SELECTOR
        },
        selectorMode: 'friend'
      });
    }
  }

  _showFriendsSelectorPromise(param: Object) {
    this.setState({
      friendSelectorData: {
        'key': '',
        message: Messages.MESSAGE_SHOW_FRIENDS_SELECTOR_PROMISE
      },
      selectorMode: 'friend'
    });
  }

  _onFriendsSelected(friends: Array<Object>){
    this.setState({selectorMode: 'none'});
    this._currentSdk().sendMessageToFunType(this.state.friendSelectorData.message, this.state.friendSelectorData.key, friends, false);
  }

  _getFriends() {
    this._currentSdk().sendMessageToFunType(Messages.MESSAGE_GET_FRIENDS, 'default', getFriends(), false);
  }

  _createTableJoinData(param: Object, shouldTruncate: boolean = true): Array<any> {
    let tablePreviewData = [];
    for (let k in param){
      let sanitized = param[k];
      if (typeof sanitized === 'object') {
        sanitized = JSON.stringify(sanitized, null, 2);
      }
      else if (typeof sanitized === 'string' && sanitized.length > 100 && shouldTruncate) {
        sanitized = `${sanitized.substring(0, 100)}...`;
      }
      if (sanitized) {
        tablePreviewData.push({key: k, value: sanitized});
      }
    }
    return tablePreviewData;
  }

  _showPreviewWithData(param: Object){
    // Inject current user as source
    param.source = this.source;
    param.engagementSource = this.engagementSource
    this.id = this._generateId();
    this.setState({ mode: 'preview', previewData: param, createOutputData: this._createTableJoinData(param) });
    this.joinSdk.sendMessageToFunType(Messages.MESSAGE_ON_DATA, 'default', param, false);
  }

  _join(param: Object) {
    this.setState({ joinOutputData: this._createTableJoinData(param, false) });
    // // if(confirm('Do you want to publish this?')) {
    // this.createSdk.sendMessageToFunType(Messages.MESSAGE_PUBLISH, 'default', this.id, false);
    // // }
    this._logConsole(`join() {winCriteriaPassed: ${param.winCriteriaPassed}}`);
  }

  _end(param: Object) {
    // this.createSdk.sendMessageToFunType(Messages.MESSAGE_END, 'default', this.id, false);
    this._logConsole(`end()`);
  }

  _setAppData(param: Object){
    this._logFromMiniApp(`setAppData(): ${JSON.stringify(param, null, 2)}`);
  }

  _informReady(param: Object){
    this._logFromMiniApp(`informReady()`);
  }

  _publishStatus(param: Object){
    this._logConsole(`publishStatus(): id = ${this.id} status = ${param.status.toString()}`);
  }

  _onCreateIFrameLoaded(){
    // this.createSdk.funTypeWindow = this.createIFrame.contentWindow;
    // this.createSdk.sendMessageToFunType(Messages.MESSAGE_ON_DATA, 'default', {source: this.source}, false);
  }

  _onJoinIFrameLoaded(){
    const data = {
      source: this.source,
      engagemenSource: this.engagementSource
    }
    this._logFromSimulator(`Mini app loaded: ${JSON.stringify(data, null, 2)}`);    
    this.joinSdk.sendMessageToFunType(Messages.MESSAGE_ON_DATA, 'default', data, false);
    this.joinSdk.funTypeWindow = this.joinIFrame.contentWindow;
  }

  // $FlowFixMe
  _onMiniAppUrlChange(e) {
    this.setState({ tempTargetUrl: e.target.value });
  }

  // $FlowFixMe
  _onMiniAppUrlKeyDown(e) {
    if(e.keyCode === 13) {
      e.preventDefault();
    }
  }

  _onClickGoButton(){
    // let createSdk = this._currentSdk();
    // if (createSdk) {
      // if (this.createSdk) {
      //   this.createSdk.funTypeOrigin = this._getOrigin(this.state.tempTargetUrl);
      // }
      this.joinSdk.funTypeOrigin = this._getOrigin(this.state.tempTargetUrl);
      this.setState({targetUrl: this.state.tempTargetUrl});
      this.forceUpdate();
    // }
  }

  _onClickResetButton(){
    this._logFromSimulator(`onReset(): ${JSON.stringify(this.state.previewData, null, 2)}`);
    this.joinSdk.sendMessageToFunType(Messages.MESSAGE_RESET, 'default', this.state.previewData, false);
  }

  _onClickClearConsoleButton() {
    const textArea = ReactDOM.findDOMNode(this.consoleArea);
    textArea.value = '';
  }

  _logFromSimulator(text: string) {
    this._logConsole(`simulator: ${text}`);
  }

  _logFromMiniApp(text: string) {
    this._logConsole(`mini-app: ${text}`);
  }

  _logConsole(text: string) {
    const textArea = ReactDOM.findDOMNode(this.consoleArea);
    textArea.value += `${text}\n`;
  }

  // $FlowFixMe
  _onClickModeRadioButton(e){
    let mode: ?('create' | 'preview') = null;
    switch (e.target.id) {
      case 'preview':
        mode = 'preview';
        break;
      case 'create':
        mode = 'create';
        break;
      default:
    }
    if (mode) this.setState({mode: mode, selectorMode: 'none'});
    if (mode === 'preview' && this.state.previewData) {
      this.joinSdk.sendMessageToFunType(Messages.MESSAGE_ON_DATA, 'default', this.state.previewData, false);
    }
  }

  render() {
    let selector = null;
    let nonce = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    // let createUrl = `${this.state.targetUrl}?action=create`;
    let joinUrl = `${this.state.targetUrl}?action=preview&nonce=${nonce}`;


    if (this.state.selectorMode !== 'none'){
      selector = <FunTypeSelector
        // sdk={this._currentSdk()}
        className="selector"
        style={{
          position: 'absolute',
          bottom: 0
        }}
        mode={this.state.selectorMode}
        gallerySelector={{
          title: this.state.galleryImageSelectorData.title,
          imageRatio: 1,
          assetType: 'Photos',
          onPress: this._onGalleryImageSelected.bind(this)
        }}
        webImageSelector={{
          title: this.state.webImageSelectorData.title,
          imageRatio: 320. / 578.0,
          data: this.state.webImageSelectorData.data,
          onPress: this._onWebImageSelected.bind(this)
        }}
        titleInput={{
          onEndEditing: this._onTitleInputResult.bind(this)
        }}
        // prizeSelector={{
        //   title: `SELECT GIFT FOR ${this.state.promoEditor.prizes[this.state.promoEditor.currentButtonIndex].title}`,
        //   loaders: this.props.loaders,
        //   onPress: this._onPrizeSelected.bind(this)
        // }}
        // prizeMethodSelector={{
        //   title: `SELECT METHOD FOR THIS ${this.state.promoEditor.prizes[this.state.promoEditor.currentButtonIndex].title}`,
        //   loaders: this.props.loaders,
        //   onPress: this._onMethodSelected.bind(this)
        // }}
        friendSelector={{
          onSelectFriends: this._onFriendsSelected.bind(this)
        }}
      />
    }
    // let createVisibility = this.state.mode === 'create' ? 'visible' : 'hidden';
    let joinVisibility = this.state.mode === 'preview' ? 'visible' : 'hidden';
    // let createOpacity = this.state.mode === 'create' ? '1' : '0';
    let joinOpacity = this.state.mode === 'preview' ? '1' : '0';
    return (
      <div className="sandbox">
        <img className="iPhone" src={iphone} alt="iPhone" />
        <div className="content">
            <iframe ref={(component) => {this.joinIFrame = component;}} className="iFrame" src={joinUrl} onLoad={this._onJoinIFrameLoaded.bind(this)} style={{visibility: joinVisibility, opacity: joinOpacity}}/>
            {/* <iframe ref={(component) => {this.createIFrame = component;}} className="iFrame" src={createUrl} onLoad={this._onCreateIFrameLoaded.bind(this)} style={{visibility: createVisibility, opacity: createOpacity}}/> */}
            <div className="navGradient" style={{backgroundImage: `url(${nav_gradient})`}}>Mini App</div>
            <div className="navBackButton" style={{backgroundImage: `url(${nav_back_white})`}}/>
            {selector}
        </div>
        <Panel className="parametersBox">
          <ControlLabel>Mini-app URL</ControlLabel>
          <Form inline>
            <FormControl
              style={{width: 300}}
              type="text"
              value={this.state.tempTargetUrl}
              placeholder="Enter your mini-app URL (ex. http://localhost:8081/)"
              onChange={this._onMiniAppUrlChange.bind(this)}
              onKeyDown={this._onMiniAppUrlKeyDown.bind(this)}
            />{' '}
            <Button
              bsStyle="primary"
              onClick={this._onClickGoButton.bind(this)}
            >
              Go
            </Button>{' '}
            {this.state.mode === 'preview' ? <Button
              onClick={this._onClickResetButton.bind(this)}
            >
              Reset
            </Button> : null}
          </Form><p/>
          {/* <Form inline style={{ visibility: 'hidden' }}> */}
            {/* <Radio id="preview" onClick={(e) => this._onClickModeRadioButton(e)} checked={this.state.mode === 'preview'} readOnly>Join (Preview)</Radio>&nbsp;&nbsp;&nbsp; */}
            {/* <Radio id="create" onClick={(e) => this._onClickModeRadioButton(e)} checked={this.state.mode === 'create'} readOnly width="120px">Create</Radio> */}
          {/* </Form><br/> */}
          {this.state.mode === 'preview' ? <ControlLabel>Input Data</ControlLabel> : null}
          {this.state.mode === 'preview' ? <PreviewTable height='300px' editable={true} data={this.state.createOutputData}/> : null}
          {this.state.mode === 'preview' && this.state.joinOutputData && this.state.joinOutputData.length > 0 ? <ControlLabel>Preview Output Data</ControlLabel> : null}
          {this.state.mode === 'preview' && this.state.joinOutputData && this.state.joinOutputData.length > 0 ? <PreviewTable height='300px' data={this.state.joinOutputData}/> : null}
          {this.state.mode === 'preview' ? <ControlLabel>Console</ControlLabel> : null}{' '}
          {this.state.mode === 'preview' ? <Button onClick={this._onClickClearConsoleButton.bind(this)}>Clear</Button> : null}<p/>          
          {this.state.mode === 'preview' ? <FormControl componentClass="textarea" wrap='off' style={{ height: '300px', fontFamily: '"Lucida Console", Monaco, monospace', fontSize: '8pt'}} readOnly ref={(item) => {this.consoleArea = item;}}/> : null}
        </Panel>
      </div>
    );
  }
}

export default App;
