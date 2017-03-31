// @flow
import { CallbackHelper, defaultCallbackHelper } from './CallbackHelper';

const MESSAGE_REQUEST_PREVIEW = 'requestPreview';
const MESSAGE_ON_PREVIEW = 'onPreview';
const MESSAGE_GET_FRIENDS = 'getFriends';

/**
Core class that allows a MiniApp to send/receive various core messages
to and from the AQ App

Copyright (c) 2017 AQ Software Inc.
*/
class CoreBridge {

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
  Sets the callback function to be called when the AQ App sets the preview data
  that will be used by the join screen.

  @param {function(value: Object): void} callback - Callback function to call
    when preview data is available from the AQ App
  */
  setOnPreviewCallback(callback: (value: any) => void) {
    this._callbackHelper.setCoreCallback(MESSAGE_ON_PREVIEW, callback);
  }

  /**
  Sets the callback function to be called when the AQ App requests the create screen
  to provide it with the current item data. This data will then be passed by the AQ App
  to the join screen

  @param {function(): void} callback - Callback function to call
    when the AQ App requests the current item data
  */
  setRequestPreviewCallback(callback: () => void) {
    this._callbackHelper.setCoreCallback(MESSAGE_REQUEST_PREVIEW, callback);
  }

  /**
  Requests the AQ App to return a list of friends without going through the friends selector UI.

  @param {Core~requestCallback} callback - Callback function to be called when
    with the list of friends as the parameter.
  */
  getFriends(callback: (value: Array<Object>) => void){
    this._saveCallbackAndProcessMessage(MESSAGE_GET_FRIENDS, callback);
  }
}

const defaultCoreBridge = new CoreBridge(defaultCallbackHelper);
export { defaultCoreBridge };
