// @flow
import { CallbackHelper, defaultCallbackHelper } from './CallbackHelper';

const MESSAGE_ON_PREVIEW = 'onPreview';

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

  /**
  Sets the callback function to be called when the AQ App sets the preview data
  that will be used by the join screen.

  @param {function(value: Object): void} callback - Callback function to call
    when preview data is available from the AQ App
  */
  setOnPreviewCallback(callback: (value: any) => void) {
    this._callbackHelper.setCoreCallback(MESSAGE_ON_PREVIEW, key, callback);
  }
}

const defaultCoreBridge = new CoreBridge(defaultCallbackHelper);
export { defaultCoreBridge };
