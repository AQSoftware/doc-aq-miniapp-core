// @flow
import { CallbackHelper, defaultCallbackHelper } from './CallbackHelper';

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
