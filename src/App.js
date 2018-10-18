// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Ajv from 'ajv';
import { AqMiniappSdk, Messages, Events } from './polyfill';
import { FunTypeSelector, getFriends } from './selectors/FunTypeSelector';
import type { SelectorMode } from './selectors/FunTypeSelector';
import DismissableAlert from './components/DismissableAlert';
// import { PreviewTable } from './components/PreviewTable';
import {
  Button,
  ControlLabel,
  Form,
  FormControl,
  // Radio,
  Checkbox,
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

const VERSION = '1.0.11';
const ON_DATA_TIMEOUT_MS = 500;
const INFORM_READY_TIMEOUT_MS = 10000;
const ON_READY_DELAY_MS = 600;

const SET_RESULT_SCHEMA = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "id": "1234",
  "definitions": {
    "winCriteria": {
      "type": "integer",
      "minValue": 0,
      "maxValue": 2
    },
    "score": {
      "type": "object",
      "required": [
        "value"
      ],
      "properties": {
        "value": {
          "type": "integer"
        },
        "target": {
          "type": "integer"
        }
      }
    }
  },
  "type": "object",
  "required": [
    "resultImageUrl",
    "winCriteria",
    "score"
  ],
  "properties": {
    "resultImageUrl": {
      "type": "string",
      "format": "uri"
    },
    "winCriteria": {
      "$ref": "#/definitions/winCriteria"
    },
    "score": {
      "$ref": "#/definitions/score"
    }
  }
};

class App extends Component {
  state: {
    tempTargetUrl: string,
    targetUrl : string,
    previewData: ?Object,
    joinOutputData: Array<Object>,
    shouldWin: boolean,
    winImage: ?string,
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
    },
    nonce: string,
    isAlertVisible: boolean,
    alertMessage: string,
    engagementInfoValue: string,
    // This is used to prevent loading of fun type during first loading.
    // We want this so there is a chance for the user to input a custom
    // engagement info before the funtype is loaded
    hasClickedGo: boolean,
    isLandscape: boolean,
    hasEnded: boolean,
    isReady: boolean,
    informReadyDidTimeout: boolean,
    result: ?Object
  }

  joinSdk: AqMiniappSdk;
  source: Object;
  engagementSource: Object;

  createIFrame: HTMLIFrameElement;
  joinIFrame: HTMLIFrameElement;
  shouldWinCheckBox: HTMLCheckBox;
  isLandscapeCheckBox: HTMLCheckBox;
  winImageInput: HTMLInputElement;
  engagementInfoArea: HTMLInputElement;
  setResultTextArea: HTMLInputElement;
  consoleArea: HTMLInputElement;
  id: string;
  informReadyTimeout: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      tempTargetUrl: props.targetUrl,
      targetUrl: props.targetUrl,
      previewData: null,
      joinOutputData: [],
      shouldWin: true,
      winImage: 'https://s3-ap-southeast-1.amazonaws.com/fma-sdk/simulator/static/media/gift.png',
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
      },
      nonce: this._generateNonce(),
      isAlertVisible: false,
      engagementInfoValue: "{}",
      hasClickedGo: false,
      isLandscape: false,
      hasEnded: false,
      isReady: false,
      informReadyDidTimeout: false,
      result: null
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
    this._setupSdk();
  }

  componentWillUnmount() {
    if (this.informReadyTimeout){
      clearTimeout(this.informReadyTimeout);
    }
  }

  _setupSdk() {
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
    joinSdk.addMessageHandler(Messages.MESSAGE_SET_RESULT, this._setResult.bind(this));
    joinSdk.addMessageHandler(Messages.MESSAGE_SET_APP_DATA, this._setAppData.bind(this));
    joinSdk.addMessageHandler(Messages.MESSAGE_INFORM_READY, this._informReady.bind(this));
    joinSdk.addMessageHandler(Messages.MESSAGE_END, this._end.bind(this));
    joinSdk.addMessageHandler(Messages.MESSAGE_CREATE_USER_BET, this._createUserBet.bind(this));
    joinSdk.addMessageHandler(Messages.MESSAGE_CLAIM_USER_BET, this._claimUserBet.bind(this));

    joinSdk.shouldHandleEvent = () => { return true; }
    this.joinSdk = joinSdk;
  }

  _getOrigin(url: string): string {
    var parser = document.createElement('a');
    parser.href = url;
    return `${parser.protocol}//${parser.host}`;
  }

  _currentSdk() {
    return this.joinSdk;
  }

  _currentAppData() {
    return {
      source: this.source,
      engagementSource: this.engagementSource,
      shouldWin: this.state.shouldWin,
      winImage: this.state.shouldWin ? this.state.winImage : undefined,
      engagementInfo: JSON.parse(this.state.engagementInfoValue)
    }
  }

  _generateId(): string {
    let arr = new Array(16);
    uuidv1(null, arr, 0);
    return Base64JS.fromByteArray(arr).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
  }

  _generateNonce() {
    // Random nonce is used to make URL unique so, iFrame can be reloaded
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
  }

  _isEngagementInfoValid() {
    try {
      if (Array.isArray(JSON.parse(this.state.engagementInfoValue))) {
        return false;
      }
    } catch (e) {
      return false;
    }
    return true;
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

  _onAlertDismissed() {
    this._hideAlert();
  }

  _showAlert(alertMessage) {
    this.setState({ isAlertVisible: true, alertMessage });
  }

  _hideAlert() {
    this.setState({ isAlertVisible: false, alertMessage: '' });
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
    this._logFromMiniApp(`join() ${JSON.stringify(param, null, 2)}`);
  }

  _setResult(param: Object) {
    this.setState({ result: param}, () => {
      const message = `setResult() ${JSON.stringify(param, null, 2)}`;
      this._logFromMiniApp(message);
    });
  }

  _end(param: Object) {
    this.setState({
      hasEnded: true
    })
    this._logFromMiniApp(`end()`);
  }

  _setAppData(param: Object){
    this._logFromMiniApp(`setAppData(): ${JSON.stringify(param, null, 2)}`);
  }

  _informReady(param: Object){
    
    if (this.informReadyTimeout) {
      clearTimeout(this.informReadyTimeout);
    }
    this._logFromMiniApp(`informReady()`);    

    setTimeout(() => {
      this.setState({ isReady: true });
    }, ON_READY_DELAY_MS);
  }

  _publishStatus(param: Object){
    this._logConsole(`publishStatus(): id = ${this.id} status = ${param.status.toString()}`);
  }

  _createUserBet(param: Object){
    this._logFromMiniApp(`createUserBet()`);
    const response = {
      id: 'pRkBcBXbEeeNCgJC_fmqfQ',
      displayName: 'Cale Audie',
      avatarBig: 'https://www.bma.org.uk/realdoctors/img/profile_2.jpg',
      avatarSmall: 'https://www.bma.org.uk/realdoctors/img/profile_2.jpg'
    }
    this._currentSdk().sendMessageToFunType(Messages.MESSAGE_CREATE_USER_BET, 'default', response, false);
  }

  _claimUserBet(param: Object) {
    this._logFromMiniApp(`claimUserBet(): ${JSON.stringify(param, null, 2)}`);
    this._currentSdk().sendMessageToFunType(Messages.MESSAGE_CLAIM_USER_BET, 'default', null, false);
  }

  _onJoinIFrameLoaded(){
    this._logFromSimulator(`Mini app loaded`);    
    setTimeout(() => {
      const data = this._currentAppData();
      this._logFromSimulator(`onData(): ${JSON.stringify(data, null, 2)}`);
      this.joinSdk.funTypeWindow = this.joinIFrame.contentWindow;
      this.joinSdk.sendMessageToFunType(Messages.MESSAGE_ON_DATA, 'default', data, false);
    }, ON_DATA_TIMEOUT_MS);
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
    if (this._isEngagementInfoValid()) {
      this._hideAlert();
      this.joinSdk.funTypeOrigin = this._getOrigin(this.state.tempTargetUrl);
      this.setState({
        targetUrl: this.state.tempTargetUrl, 
        nonce: this._generateNonce(), 
        hasClickedGo: true, 
        hasEnded: false, 
        isReady: false,
        informReadyDidTimeout: false
      });
      this.forceUpdate();

      if (this.informReadyTimeout) {
        clearTimeout(this.informReadyTimeout);
      }
      this.informReadyTimeout = setTimeout(() => {
        this.setState({ informReadyDidTimeout: true});
      }, INFORM_READY_TIMEOUT_MS);
    }
    else {
      this._showAlert('Engagement Info is not a valid JSON Object');
    }
  }

  _onClickResetButton(){
    const data = this._currentAppData();
    this._logFromSimulator(`onReset(): ${JSON.stringify(data, null, 2)}`);
    this.joinSdk.sendMessageToFunType(Messages.MESSAGE_RESET, 'default', data, false);
    this.setState({hasEnded: false});
  }

  _onClickClearConsoleButton() {
    this._clear(this.consoleArea);
  }

  _onClickAppBecomesActiveButton() {
    if (this.state.isReady && this.state.hasClickedGo) {
      this._logFromSimulator(`onAppStateChange: active`);
      this.joinSdk.sendMessageToFunType(Events.ON_APP_STATE_CHANGE, 'default', { state: 'active'}, false);
    }
  }

  _onClickAppBecomesInactiveButton() {
    if (this.state.isReady && this.state.hasClickedGo) {
      this._logFromSimulator(`onAppStateChange: inactive`);
      this.joinSdk.sendMessageToFunType(Events.ON_APP_STATE_CHANGE, 'default', { state: 'inactive' }, false);
    }
  }

  _clear(ref: any){
    const textArea = ReactDOM.findDOMNode(ref);
    textArea.value = '';
  }

  _onClickShouldWin(){
    this.setState({ shouldWin: !this.state.shouldWin });
  }

  _onClickLandscape() {
    this.setState({ isLandscape: !this.state.isLandscape });
  }

  _onWinImageInputChange(){
    this.setState({ winImage: this.winImageInput.value });
  }

  _onEngagementInfoInputChange(e) {
    this.setState({ engagementInfoValue: e.target.value });
  }

  _logFromSimulator(text: string) {
    this._logConsole(`simulator: ${text}`);
  }

  _logFromMiniApp(text: string) {
    this._logConsole(`mini-app: ${text}`);
  }

  _logConsole(text: string) {
    const message = `[${moment().format('HH:mm:ss.SSS')}] ${text}`;
    this._log(this.consoleArea, message);
  }

  _log(ref: any, text: string) {
    const textArea = ReactDOM.findDOMNode(ref);
    textArea.value += `${text}\n`;
    textArea.scrollTop = textArea.scrollHeight;    
  }

  render() {
    let selector = null;
    let joinUrl = "about:blank";
    if (this.state.hasClickedGo) {
      joinUrl = `${this.state.targetUrl}?action=preview&nonce=${this.state.nonce}`;
    }
    if (this.state.selectorMode !== 'none'){
      selector = <FunTypeSelector
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
    var iPhoneClass = 'iPhone';
    var contentClass = 'content contentPortrait portrait';
    var navGradientClass = 'navGradient navGradientPortrait';
    var iFrameClass = 'iFrame portrait';
    var loaderClass = 'loader portrait';

    if (this.state.isLandscape) {
      iPhoneClass = 'iPhone iPhoneLandscape';
      contentClass = 'content landscape contentLandscape';
      navGradientClass = 'navGradient navGradientLandscape'
      iFrameClass = 'iFrame landscape';
      loaderClass = 'loader landscape';
    }

    var preloader = null;
    var preloaderText = 'Loading...';
    if (this.state.informReadyDidTimeout) {
      preloaderText = 'Did you forget to call informReady() ?';
    }
    if (!this.state.isReady && this.state.hasClickedGo) {
      preloader = (
        <div className={'preLoader ' + loaderClass}>
          <div>{preloaderText}</div>          
        </div>
      )
    }

    var postloader = null;
    if (this.state.hasEnded) {
      var result = 'seResult not called';
      if (this.state.result){
        result = `result:\n${JSON.stringify(this.state.result, null, 2)}`;
        var ajv = new Ajv();
        var valid = ajv.addSchema(SET_RESULT_SCHEMA, 'setResultSchema')
                      .validate('setResultSchema', this.state.result);
        if (!valid) {
          result = `${result}\n${ajv.errorsText()}`;
        }
        else {
          result = `${result}\nNo errors!`;
        }
      }
      postloader = (
        <div className={'postLoader ' + loaderClass}>
        <div>
            <span>Game Over</span><p/>
            <Button
              onClick={this._onClickResetButton.bind(this)}
            >
              Reset
            </Button><p/>
            <textarea 
              className='setResult'
              ref={(component) => { this.setResultTextArea = component; }}
            >{result}</textarea>
        </div>          
        </div>
      )
    }

    return (
      <div className="sandbox">
        <img className={iPhoneClass} src={iphone} alt="iPhone" />
        <div className={contentClass}>
            <iframe ref={(component) => { this.joinIFrame = component; }} className={iFrameClass} src={joinUrl} onLoad={this._onJoinIFrameLoaded.bind(this)} />
          <div className={navGradientClass} style={{ backgroundImage: `url(${nav_gradient})` }}>Mini App Simulator v{VERSION}</div>
            <div className="navBackButton" style={{backgroundImage: `url(${nav_back_white})`}}/>
            {selector}      
            {preloader}      
            {postloader}
        </div>                
        <Panel className="parametersBox">
          <Checkbox inline onChange={this._onClickLandscape.bind(this)} ref={(item) => { this.isLandscapeCheckBox = item; }} checked={this.state.isLandscape ? 'checked' : ''}>Landscape</Checkbox><p />
          <ControlLabel>Mini App URL</ControlLabel>
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
            <p />
            <DismissableAlert message={this.state.alertMessage} visible={this.state.isAlertVisible} onDismiss={this._onAlertDismissed.bind(this)}/>
            <ControlLabel>Events</ControlLabel><p />
            <Button onClick={this._onClickAppBecomesActiveButton.bind(this)}>App becomes active</Button>
            <Button onClick={this._onClickAppBecomesInactiveButton.bind(this)}>App becomes inactive</Button><p />
            <ControlLabel>Mini App Data</ControlLabel><p />            
            <Checkbox inline onChange={this._onClickShouldWin.bind(this)} ref={(item) => { this.shouldWinCheckBox = item; }} checked={this.state.shouldWin ? 'checked' : ''}>Should Win</Checkbox><p/>            
            <ControlLabel>Win Image</ControlLabel><p />
            <FormControl
              ref={(item) => { this.winImageInput = item; }}
              type="text"              
              style={{ width: 420 }}
              value={this.state.winImage}
              placeholder="Enter valid image URL"
              onChange={() => {}} // onChange is required
              disabled={!this.state.shouldWin}
            />
          </Form><p/>          
          <ControlLabel>Console</ControlLabel>{' '}
          <Button onClick={this._onClickClearConsoleButton.bind(this)}>Clear</Button><p/>          
          <FormControl 
            componentClass="textarea" 
            wrap='off' 
            style={{ padding: '2pt', height: '500px', fontFamily: '"Lucida Console", Monaco, monospace', fontSize: '8pt'}} 
            readOnly 
            ref={(item) => {this.consoleArea = item;}}
          /><p/>
          <ControlLabel>Engagement Info</ControlLabel>{' '}
          <FormControl
            componentClass="textarea"
            wrap='off'
            value={this.state.engagementInfoValue}
            style={{ padding: '2pt', height: '200px', fontFamily: '"Lucida Console", Monaco, monospace', fontSize: '8pt' }}
            ref={(item) => { this.engagementInfoArea = item; }}
            onChange={this._onEngagementInfoInputChange.bind(this)}
          /><p />          
        </Panel>
      </div>
    );
  }
}

export default App;
