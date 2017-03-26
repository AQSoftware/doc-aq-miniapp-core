// @flow

function _postToWebKit(message: String, param: Object){
  window.webkit.messageHandlers['message'].postMessage(param);
}

/**
Core class that exposes AQ App functionalities to a Mini App web application

Copyright (c) 2017 AQ Software Inc.
*/
class Core {

  callbacks: {
    showTitleInput?: (string) => void,
    showWebImageSelector: Object,
    showGalleryImageSelector: Object,
    showFriendsSelector: Object,
    getContentEditorOutput?: (any) => void,
    getJoinPreviewData?: (any) => void,
    getFriends?: (Array<Object>) => void,
  };

  /**
  Constructor
  @constructor
  */
  constructor(){
    this.callbacks = {
      'showWebImageSelector': {},
      'showGalleryImageSelector': {},
      'showFriendsSelector': {}
    };
  }

  /**
   This callback is displayed as part of the Core class.
   @callback Core~requestCallback
   @param {string} key
   @param {(Object|Array.<Object>)} value
  */

  /**
  Requests the AQ App to show a selector UI from a list of image web urls

  @param {string} key - Unique key identifying this particular Requests
  @param {string} title - Title to be shown to the selector UI
  @param {Array.<string>} imageUrls - An array of urls pointing to images that will be
    shown by the selector UI
  @param {Core~requestCallback} callback - Callback function to be called when
    an image is selected from imageUrls
  */
  showWebImageSelector(key: string, title: string, imageUrls: Array<string>, callback: (key: string, value: any) => void) {
    let callbacks = this.callbacks['showWebImageSelector'];
    callbacks[key] = callback;
    this.callbacks['showWebImageSelector'] = callbacks;

    if (typeof window.webkit !== "undefined") {
      window.webkit.messageHandlers.showWebImageSelector.postMessage({
        key: key,
        title: title,
        imageUrls: imageUrls,
        callback: callback.name
      });
    }
  }

  /**
  Requests the AQ App to show a selector UI showing a list of available gallery images

  @param {string} key - Unique key identifying this particular Requests
  @param {string} title - Title to be shown to the selector UI
  @param {Core~requestCallback} callback - Callback function to be called when
    an image is selected
  */
  showGalleryImageSelector(key: string, title: string, callback: (key: string, value: any) => void) {
    let callbacks = this.callbacks['showGalleryImageSelector'];
    callbacks[key] = callback;
    this.callbacks['showGalleryImageSelector'] = callbacks;

    if (typeof window.webkit !== "undefined") {
      window.webkit.messageHandlers.showGalleryImageSelector.postMessage({
        key: key,
        title: title,
        callback: callback.name
      });
    }
  }

  /**
  Requests the AQ App to show a text input UI for the user to input a title

  @param {Core~requestCallback} callback - Callback function to be called when
    a title has been inputted
  */
  showTitleInput(callback: (value: string) => void) {
    this.callbacks['showTitleInput'] = callback;

    if (typeof window.webkit !== "undefined") {
      window.webkit.messageHandlers.showTitleInput.postMessage({
        callback: callback.name
      });
    }
  }

  /**
  Requests the AQ App to show a selector UI showing a list of friends

  @param {string} key - Unique key identifying this particular Requests
  @param {Core~requestCallback} callback - Callback function to be called when
    a list of friends has been selected
  */
  showFriendsSelector(key: string, callback: (key: string, value: Array<Object>) => void) {
    let callbacks = this.callbacks['showFriendsSelector'];
    callbacks[key] = callback;
    this.callbacks['showFriendsSelector'] = callbacks;

    if (typeof window.webkit !== "undefined") {
      window.webkit.messageHandlers.showFriendsSelector.postMessage({
        key: key,
        callback: callback.name
      });
    }
  }

  /**
  Requests the AQ App to end the Content Editor screen and show the next screen
  in the content creation dialogue.

  @param {string} title - Title obtained from the user
  @param {string} coverImageUrl - A url of the cover image obtained from the user
  @param {Object} data - Some preview data that will passed to the Join dialogue screens
    when it is called in preview mode
  */
  setContentEditorOutput(title: string, coverImageUrl: string, data: Object){
    if (typeof window.webkit !== "undefined") {
      window.webkit.messageHandlers.setContentEditorOutput.postMessage({
        title: title,
        coverImageUrl: coverImageUrl,
        data: data
      });
    }
  }

  /**
  Sets the callback that the AQ App will call if it needs to request the output of the
  Mini-app's content editor screen. This data is usually passed by the AQ app to the
  Join Preview screens when the user requests to look at how the Join screens will look
  give the current content editor output.

  @param {Core~requestCallback} callback - Callback function to be called when
    with the title, coverImage, and preview data as the parameter.
  */
  setContentEditorOutputCallback(callback: (title: string, coverImage: string, data: Object) => void){
    this.callbacks['getContentEditorOutput'] = callback;

    if (typeof window.webkit !== "undefined") {
      window.webkit.messageHandlers.getJoinPreviewData.postMessage(null);
    }
  }

  /**
  Requests the AQ App to end the Join dialogue screen

  @param {string} caption - Caption obtained from the user
  @param {string} imageUrl - A url of the image obtained from the user
  */
  endWithOutput(caption: string, imageUrl: string){
    if (typeof window.webkit !== "undefined") {
      window.webkit.messageHandlers.endWithOutput.postMessage({
        caption: caption,
        imageUrl: imageUrl
      });
    }
  }

  /**
  Requests the AQ App to return the preview data obtained from the Content Editor dialogue.
  This call is used primarily by the Join dialogue.

  @param {Core~requestCallback} callback - Callback function to be called when
    with the preview data as the parameter.
  */
  getJoinPreviewData(callback: (value: any) => void){
    this.callbacks['getJoinPreviewData'] = callback;

    if (typeof window.webkit !== "undefined") {
      window.webkit.messageHandlers.getJoinPreviewData.postMessage(null);
    }
  }

  /**
  Requests the AQ App to return a list of friends without going through the friends selector UI.

  @param {Core~requestCallback} callback - Callback function to be called when
    with the list of friends as the parameter.
  */
  getFriends(callback: (value: Array<Object>) => void){
    this.callbacks['getFriends'] = callback;

    if (typeof window.webkit !== "undefined") {
      window.webkit.messageHandlers.getFriends.postMessage(null);
    }
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

window.funTypeCallback = function(selector: string, key: ?string, value: any, shouldDecode: boolean) {
  if (miniApp.callbacks[selector] != null) {
    let callback = miniApp.callbacks[selector];
    switch (selector) {
      case 'showTitleInput':
      case 'getJoinPreviewData':
      case 'getFriends':
        callback(sanitize(value, shouldDecode));
        break;
      default:
        if (key != null) {
          let selectorCallbacks = miniApp.callbacks[selector];
          if (selectorCallbacks[key] != null){
            callback = selectorCallbacks[key];
            callback(key, sanitize(value, shouldDecode));
          }
        }
    }
  }
}

const miniApp = new Core();
export { miniApp };
