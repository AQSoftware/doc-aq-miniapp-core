// @flow

/**
Core class that allows a MiniApp to request various UI selectors available
in the AQ App

Copyright (c) 2017 AQ Software Inc.
*/

const MESSAGE_SHOW_TITLE_INPUT = 'showTitleInput';
const MESSAGE_SHOW_WEB_IMAGE_SELECTOR = 'showWebImageSelector';
const MESSAGE_SHOW_GALLERY_IMAGE_SELECTOR = 'showGalleryImageSelector';

type UICallbacks = {
  // Callback selectors will be a dictionary containing
  // keys and corresponding callbacks
  showTitleInput: Object,
  showWebImageSelector: Object,
  showGalleryImageSelector: Object,
  showFriendsSelector: Object
};

class CallbackHelper {
  callbacks: UICallbacks;

  /**
  Constructor
  @constructor
  */
  constructor(){
    this.callbacks = {
      showTitleInput: {},
      showWebImageSelector: {},
      showGalleryImageSelector: {},
      showFriendsSelector: {}
    };
  }

  postToWebKit(message: string, param: ?Object){
    window.webkit.messageHandlers[message].postMessage(param);
  }

  saveCallback(message: string, key: string, callback: (key: string, value: any) => void){
    let callbacks = this.callbacks[message];
    callbacks[key] = callback;
    this.callbacks[message] = callbacks;
  }

  processMessage(message: string, key: string, param: ?Object) {
    let parameters = {...param};
    parameters.key = key;

    if (typeof window.webkit !== "undefined") {
      this.postToWebKit(message, parameters);
    }
  }
}


class UI {

  _callbackHelper: CallbackHelper;

  constructor(callbackHelper: CallbackHelper){
    this._callbackHelper = callbackHelper;
  }

  _saveCallbackAndProcessMessage(message: string, key: string, callback: (key: string, value: any) => void, param: ?Object) {
    this._callbackHelper.saveCallback(message, key, callback);
    this._callbackHelper.processMessage(message, key, param);
  }

  /**
  Requests the AQ App to show a text input UI for the user to input a title

  @param {function(value: string): void} callback - Callback function to be called when
    a title has been input by the user
  */
  showTitleInput(callback: (value: string) => void) {
    this._saveCallbackAndProcessMessage(MESSAGE_SHOW_TITLE_INPUT, 'default', (k, v) => {callback(v);}, null);
  }

  /**
  Requests the AQ App to show a selector UI from a list of image web urls

  @param {string} key - Unique key identifying this particular Requests
  @param {string} title - Title to be shown to the selector UI
  @param {string[]} imageUrls - An array of urls pointing to images that will be
    shown by the selector UI
  @param {function(key: string, value: string): void} callback - Callback function to be called when
    an image is selected from imageUrls
  */
  showWebImageSelector(key: string, title: string, imageUrls: Array<string>, callback: (key: string, value: any) => void) {
    this._saveCallbackAndProcessMessage(MESSAGE_SHOW_WEB_IMAGE_SELECTOR, key, callback, {
      title: title,
      imageUrls: imageUrls
    });
  }

  /**
  Requests the AQ App to show a selector UI showing a list of available gallery images

  @param {string} key - Unique key identifying this particular Requests
  @param {string} title - Title to be shown to the selector UI
  @param {function(key: string, value: string): void} callback - Callback function to be called when
    an image is selected
  */
  showGalleryImageSelector(key: string, title: string, callback: (key: string, value: any) => void) {

    this._saveCallbackAndProcessMessage(MESSAGE_SHOW_GALLERY_IMAGE_SELECTOR, key, callback, {
      title: title
    });
  }
}

function b64DecodeUnicode(str: string) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function sanitize(value: any, shouldDecode: boolean): any {
  let sanitized = value;
  if (shouldDecode) {
    let jsonString = b64DecodeUnicode(value);
    sanitized = JSON.parse(jsonString);
  }
  return sanitized;
}

window.funTypeCallback = function(selector: string, key: string, value: any, shouldDecode: boolean) {
  if (callbackHelper.callbacks[selector] != null) {
    let callback = callbackHelper.callbacks[selector];
    let selectorCallbacks = callbackHelper.callbacks[selector];
    if (selectorCallbacks[key] != null){
      callback = selectorCallbacks[key];
      callback(key, sanitize(value, shouldDecode));
    }
  }
}

const callbackHelper = new CallbackHelper();
const ui = new UI(callbackHelper);
export { ui };
