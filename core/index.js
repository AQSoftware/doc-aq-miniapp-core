//
// import { NativeModules } from 'react-native';
//
// const { RNMiniAppCore } = NativeModules;
//
// export default RNMiniAppCore;


// @flow
import invariant from 'invariant';
import React, {Component} from 'react';
import { findNodeHandle, requireNativeComponent, Event, NativeModules } from 'react-native';

export const MESSAGE_SHOW_TITLE_INPUT = 'showTitleInput';
export const MESSAGE_SHOW_WEB_IMAGE_SELECTOR = 'showWebImageSelector';
export const MESSAGE_SHOW_GALLERY_IMAGE_SELECTOR = 'showGalleryImageSelector';
export const MESSAGE_SHOW_FRIENDS_SELECTOR = 'showFriendsSelector';
export const MESSAGE_SHOW_PREVIEW_WITH_DATA = 'showPreviewWithData';

export const Messages = {
  MESSAGE_SHOW_TITLE_INPUT: 'showTitleInput',
  MESSAGE_SHOW_WEB_IMAGE_SELECTOR: 'showWebImageSelector',
  MESSAGE_SHOW_GALLERY_IMAGE_SELECTOR: 'showGalleryImageSelector',
  MESSAGE_SHOW_FRIENDS_SELECTOR: 'showFriendsSelector',
  MESSAGE_SET_APP_DATA: 'setAppData',
  MESSAGE_INFORM_READY: 'informReady',
  MESSAGE_SHOW_PREVIEW_WITH_DATA: 'showPreviewWithData',
  MESSAGE_REQUEST_PREVIEW: 'requestPreview',
  MESSAGE_ON_DATA: 'onData',
  MESSAGE_GET_FRIENDS: 'getFriends',
  MESSAGE_GET_BM_BALANCE: 'getBmBalance',
  MESSAGE_PUBLISH: 'publish',
  MESSAGE_PUBLISH_STATUS: 'publishStatus',
  MESSAGE_JOIN: 'join',
  MESSAGE_END: 'end'
};

export type NotificationItem = {
  notificationType: number,
  destinationUserIds: Array<string>,
  textFormat: string,
  textValues: Object,
  additionalInfo: ?Object
}

const RNFunTypeView = requireNativeComponent('RNFunTypeView', null);
const RNFunTypeViewManager = NativeModules.RNFunTypeViewManager;
invariant(RNFunTypeViewManager,
`RNFunTypeViewManager: the native module is not available.
Make sure you have properly configured it.

NativeModules.RNFunTypeViewManager is %s`, RNFunTypeViewManager);

type Props = {
  onLoad?: () => void,
  onError?: (string) => void,
  onRequestSelector?: (string, string, Object) => void,
  onRequestPreviewData?: () => void,
  onJoin?: (string, string, bool, Object) => void,
  onEnd?: () => void,
  onRequestShowPreviewWithData?: (string, string, any) => void,
  onSetAppData?: (object) => void,
  onReady?: () => void,
  onPublishStatus?: (boolean) => void
}

export class FunTypeView extends Component {
  _onLoad: (Event) => void;
  _onError: (Event) => void;
  _onRequestSelector: (Event) => void;
  _onRequestPreviewData: (Event) => void;
  _onJoin: (Event) => void;
  _onEnd: (Event) => void;
  _onRequestShowPreviewWithData: (Event) => void;
  _onSetAppData: (Event) => void;
  _onReady: (Event) => void;
  _onEndContentEditorOutput: (Event) => void;
  _onPublishStatus: (Event) => void;

  funTypeView: RNFunTypeView;

  constructor(props: Props){
    super(props);
    this._onLoad = this._onLoad.bind(this);
    this._onError = this._onError.bind(this);
    this._onRequestSelector = this._onRequestSelector.bind(this);
    this._onRequestPreviewData = this._onRequestPreviewData.bind(this);
    this._onJoin = this._onJoin.bind(this);
    this._onEnd = this._onEnd.bind(this);
    this._onRequestShowPreviewWithData = this._onRequestShowPreviewWithData.bind(this);
    this._onSetAppData = this._onSetAppData.bind(this);
    this._onReady = this._onReady.bind(this);
    this._onPublishStatus = this._onPublishStatus.bind(this);
  }

  _onLoad(event: Event){
    if (!this.props.onLoad || !event.nativeEvent){
      return;
    }
    this.props.onLoad();
  }

  _onError(event: Event){
    if (!this.props.onError || !event.nativeEvent){
      return;
    }
    this.props.onError(event.nativeEvent.error);
  }

  _onRequestSelector(event: Event){
    if (!this.props.onRequestSelector || !event.nativeEvent){
      return;
    }
    this.props.onRequestSelector(event.nativeEvent.selector, event.nativeEvent.key, event.nativeEvent.data);
  }

  _onRequestPreviewData(event: Event){
    if (!this.props.onRequestPreviewData){
      return;
    }
    this.props.onRequestPreviewData();
  }

  _onSetAppData(event: Event){
    if (!this.props.onSetAppData){
      return;
    }
    this.props.onSetAppData(event.nativeEvent.appData);
  }

  _onReady(event: Event){
    if (!this.props.onReady || !event.nativeEvent){
      return;
    }
    this.props.onReady();
  }

  _onJoin(event: Event){
    if (!this.props.onJoin || !event.nativeEvent){
      return;
    }
    this.props.onJoin(event.nativeEvent.id, event.nativeEvent.joinImageUrl, event.nativeEvent.winCriteriaPassed, event.nativeEvent.notificationItem);
  }

  _onEnd(event: Event){
    if (!this.props.onEnd || !event.nativeEvent){
      return;
    }
    this.props.onEnd();
  }

  _onRequestShowPreviewWithData(event: Event){
    if (!this.props.onRequestShowPreviewWithData || !event.nativeEvent){
      return;
    }
    this.props.onRequestShowPreviewWithData(event.nativeEvent.title, event.nativeEvent.coverImageUrl, event.nativeEvent.data);
  }

  _onPublishStatus(event: Event){
    if (!this.props.onPublishStatus || !event.nativeEvent){
      return;
    }
    this.props.onPublishStatus(event.nativeEvent.status);
  }

  triggerCallback(message: string, key: string, value: any){
    RNFunTypeViewManager.triggerViewCallbackWithTag(findNodeHandle(this.funTypeView), message, key, value);
  }

  render() {
    return (
      <RNFunTypeView
        {...this.props}
        ref={(component) => this.funTypeView = component}
        onFunTypeViewDidLoad={this._onLoad}
        onFunTypeViewError={this._onError}
        onRequestSelector={this._onRequestSelector}
        onRequestPreviewData={this._onRequestPreviewData}
        onSetAppData={this._onSetAppData}
        onJoin={this._onJoin}
        onEnd={this._onEnd}
        onReady={this._onReady}
        onRequestShowPreviewWithData={this._onRequestShowPreviewWithData}
        onPublishStatus={this._onPublishStatus}
      />
    )
  }
}

RNFunTypeView.propTypes = {
  funType: React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    // type: React.PropTypes.oneOf(['internal', 'webBased']).isRequired,
    type: React.PropTypes.number.isRequired,
    webUrl: React.PropTypes.string
  }).isRequired,
  mode: React.PropTypes.oneOf(['create', 'join', 'preview']).isRequired,
  engagementId: React.PropTypes.string,
  onLoad: React.PropTypes.func,
  onError: React.PropTypes.func,
  onRequestSelector: React.PropTypes.func,
  onRequestPreviewData: React.PropTypes.func,
  onSetAppData: React.PropTypes.func,
  onReady: React.PropTypes.func,
  onJoin: React.PropTypes.func,
  onEnd: React.PropTypes.func,
  onRequestShowPreviewWithData: React.PropTypes.func,
  onPublishStatus: React.PropTypes.func
};
