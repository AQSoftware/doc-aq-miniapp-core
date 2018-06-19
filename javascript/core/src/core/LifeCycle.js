// @flow
import Base64JS from 'base64-js';
import uuidv1 from 'uuid/v1';
import { CallbackHelper, defaultCallbackHelper } from './CallbackHelper';

// const MESSAGE_REQUEST_PREVIEW = 'requestPreview';
// const MESSAGE_ON_DATA = 'onData';
// const MESSAGE_INFORM_READY = 'informReady';
// const MESSAGE_SET_APP_DATA = 'setAppData';
// const MESSAGE_SHOW_PREVIEW_WITH_DATA = 'showPreviewWithData';
// const MESSAGE_JOIN = 'join';
// const MESSAGE_PUBLISH = 'publish';
// const MESSAGE_PUBLISH_STATUS = 'publishStatus';
// const MESSAGE_END = 'end';
// const MESSAGE_RESET = 'reset';

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
  MESSAGE_SET_RESULT: 'setResult',
  MESSAGE_START: 'start',
  MESSAGE_END: 'end',
  MESSAGE_RESET: 'reset'
};

type Score = {
  value: number,
  target?: number
}

type NotificationItem = {
  notificationType: number,
  destinationUserIds: Array<string>,
  textFormat: string,
  textValues: Object,
  additionalInfo: ?Object
}

type GameResult = {
  id?: string,
  resultImageUrl: string,
  winCriteriaPassed: boolean,
  notificationItem: NotificationItem,
  score: Score
}

/**
Class that allows a MiniApp to call various functions related to a mini app's life cycle

Copyright (c) 2017 AQ Software Inc.
*/
class LifeCycle {

  _callbackHelper: CallbackHelper;

  constructor(callbackHelper: CallbackHelper){
    this._callbackHelper = callbackHelper;
  }

  _saveCallbackAndProcessMessage(message: string,
                                callback: ?((value: any) => void) = null,
                                param: ?Object = null) {
    if (callback) {
      this._callbackHelper.setCoreCallback(message, callback);
    }
    this._callbackHelper.processMessage(message, null, param);
  }

  /**
  Sets the callback function to be called when the AQ App sets data
  that will be used by the miniapp.

  @param {function(value: Object): void} callback - Callback function to call
    when data is available from the AQ App
  */
  setOnDataCallback(callback: (value: any) => void) {
    this._callbackHelper.setCoreCallback(Messages.MESSAGE_ON_DATA, callback);
  }

  /**
  Sets the callback function to be called when the AQ App requests the miniapp
  to reset itself

  @param {function(value: Object): void} callback - Callback function to call
    when AQ App requests a reset
  */
  setOnResetCallback(callback: (value: any) => void) {
    this._callbackHelper.setCoreCallback(Messages.MESSAGE_RESET, callback);
  }

  /**
  Sets the callback function to be called when the AQ App requests the create screen
  to provide it with the current item data. This data will then be passed by the AQ App
  to the join screen

  @param {function(): void} callback - Callback function to call
    when the AQ App requests the current item data
  */
  setRequestPreviewCallback(callback: () => void) {
    this._callbackHelper.setCoreCallback(Messages.MESSAGE_REQUEST_PREVIEW, callback);
  }

  /**
  Instructs the mini app to save the current data produced by the create screens,
  to some persistent storage, usually a cloud storage. The AQ App provides an ID
  that will be associated with this data, which will be used at a later time when
  this same ID is provided to the join screen.

  Once the AQ App calls this function, you need to inform it whether publishing
  succeeded or not using the

  @param {function(id: string): void} callback - Callback function to call
    when the AQ App requests the the miniapp to publish the data
  */
  setPublishCallback(callback: (string) => void) {
    this._callbackHelper.setCoreCallback(Messages.MESSAGE_PUBLISH, callback);
  }

  /**
  Sends a message to the AQ App with optional parameters. Calling this method is generally
  not recommended and is put here for internal development purposes.

  This function will trigger the AQ App to show the preview dialogue of the mini-app,
  eventually passing the given parameters as data for the preview.

  If any of the parameters, except data, is null, the preview screen will not be shown.

  @param {string} message - Name of message to send.
  @param {string} params - Optional JSON encoded parameters specific to the message.
  */
  sendMessage(message: string, params: ?Object) {
    this._saveCallbackAndProcessMessage(message, null, params);
  }

  /**
  Requests the AQ App to show the preview screen given some data.

  This function will trigger the AQ App to show the preview dialogue of the mini-app,
  eventually passing the given parameters as data for the preview.

  If any of the parameters, except data, is null, the preview screen will not be shown.

  @param {string} title - Title obtained from user through showTitleInput()
  @param {string} coverImageUrl - Cover image obtained from user. This can be a data-uri image,
    or normal web url and must be a 640x1136 JPEG image.
  @param {Object} data - Any mini-app specific data.
  */
  showPreviewWithData(title: String, coverImageUrl: string, data: Object) {
    this._saveCallbackAndProcessMessage(Messages.MESSAGE_SHOW_PREVIEW_WITH_DATA, null, {
      title: title,
      coverImageUrl: coverImageUrl,
      ...data
    });
  }

  /**
  Requests the AQ App to set some app-specific data.

  This function will set app-specific data that may or may not be utilized by the AQ App.

  @param {Object} appData - Any mini-app specific data.
  */
  setAppData(appData: Object) {
    this._saveCallbackAndProcessMessage(Messages.MESSAGE_SET_APP_DATA, null, {
      appData: appData
    });
  }

  /**
  Informs the AQ App that the miniapp has been fully loaded and is ready to be operated upon.
  */
  informReady() {
    this._saveCallbackAndProcessMessage(Messages.MESSAGE_INFORM_READY, null, null);
  }

  /**
  Generates a unique URL-safe Base64-encoded Id
  */
  generateId(): string {
    let arr = new Array(16);
    uuidv1(null, arr, 0);
    return Base64JS.fromByteArray(arr).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
  }

  /**
  Provides the AQ App join data for processing

  @param {string} id - Optional unique URL-safe UUID that will be used by the AQ app
    to reference this a particular join.
  @param {string} joinImageUrl - An image representing the output of the join screen.
    Join output image must a 640x1136 JPEG image and not a data-uri. If image obtained came from
    the phone's gallery, you need to upload it using CloudStorage.uploadMedia() api,
    to produce a valid url for the image.
  @param {string} winCriteriaPassed - Boolean value indicating whether this particular join
    resulted in a win or lose
  @param {Object} notificationItem - Object containing information to create notifications for
    users
  */
  join(id: ?string, joinImageUrl: string, winCriteriaPassed: boolean, notificationItem: ?NotificationItem) {
    this._saveCallbackAndProcessMessage(Messages.MESSAGE_JOIN, null, {
      id: id,
      joinImageUrl: joinImageUrl,
      winCriteriaPassed: winCriteriaPassed,
      notificationItem: notificationItem
    });
  }

  /**
  Informs the AQ App of the result of a particular game play invocation

  @param {GameResult} result - Object representing the result of the gameplay.
  */
  setResult(result: GameResult) {
    this._saveCallbackAndProcessMessage(Messages.MESSAGE_SET_RESULT, null, result);
  }

  /**
  Signals the AQ App that the mini app has started
  */
  start() {
    this._saveCallbackAndProcessMessage(Messages.MESSAGE_START, null, null);
  }

  /**
  Ends the join screen, providing the AQ App with a caption and a join output image.
  */
  end() {
    this._saveCallbackAndProcessMessage(Messages.MESSAGE_END, null, null);
  }

  /**
  Informs the AQ App that publishing succeeded.

  */
  publishSucceded(){
    this._saveCallbackAndProcessMessage(Messages.MESSAGE_PUBLISH_STATUS, null, {
      status: true
    });
  }

  /**
  Informs the AQ App that publishing failed
  */
  publishFailed(){
    this._saveCallbackAndProcessMessage(Messages.MESSAGE_PUBLISH_STATUS, null, {
      status: false
    });
  }
}

const defaultLifeCycle = new LifeCycle(defaultCallbackHelper);
export { defaultLifeCycle };
