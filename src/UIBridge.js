// @flow
import { CallbackHelper, defaultCallbackHelper } from './CallbackHelper';

const MESSAGE_SHOW_TITLE_INPUT = 'showTitleInput';
const MESSAGE_SHOW_WEB_IMAGE_SELECTOR = 'showWebImageSelector';
const MESSAGE_SHOW_GALLERY_IMAGE_SELECTOR = 'showGalleryImageSelector';
const MESSAGE_SHOW_FRIENDS_SELECTOR = 'showFriendsSelector';
const MESSAGE_SHOW_PREVIEW_WITH_DATA = 'showPreviewWithData';

export type Friend = {
  id: string,
  displayName: string,
  avatarBig: ?string,
  avatarSmall: ?string
}

/**
Core class that allows a MiniApp to request various UI selectors available
in the AQ App

Copyright (c) 2017 AQ Software Inc.
*/

class UIBridge {

  _callbackHelper: CallbackHelper;

  constructor(callbackHelper: CallbackHelper){
    this._callbackHelper = callbackHelper;
  }

  _saveCallbackAndProcessMessage(message: string, key: ?string = null,
                                callback: ?((key: string, value: any) => void) = null,
                                param: ?Object = null) {
    if (key && callback) {
      this._callbackHelper.setUiCallback(message, key, callback);
    }
    this._callbackHelper.processMessage(message, key, param);
  }

  /**
  Requests the AQ App to show a text input UI for the user to input a title

  @param {function(value: string): void} callback - Callback function to be called when
    a title has been input by the user
  */
  showTitleInput(callback: (value: string) => void) {
    this._saveCallbackAndProcessMessage(MESSAGE_SHOW_TITLE_INPUT, 'default', (k, v) => {callback(v);});
  }

  /**
  Requests the AQ App to show a selector UI from a list of image web urls

  @param {string} key - Unique key identifying this particular Requests
  @param {string} title - Title to be shown to the selector UI
  @param {string[]} imageUrls - An array of urls pointing to images that will be
    shown by the selector UI
  @param {function(key: string, value: Object): void} callback - Callback function to be called when
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
  @param {function(key: string, value: Object): void} callback - Callback function to be called when
    an image is selected
  */
  showGalleryImageSelector(key: string, title: string, callback: (key: string, value: any) => void) {
    this._saveCallbackAndProcessMessage(MESSAGE_SHOW_GALLERY_IMAGE_SELECTOR, key, callback, {
      title: title
    });
  }

  /**
  Requests the AQ App to show a selector UI showing a list of friends

  @param {string} key - Unique key identifying this particular Requests
  @param {function(key: string, value: Object[]): void} callback - Callback function to be called when
    a list of friends has been selected
  */
  showFriendsSelector(key: string, callback: (key: string, value: Array<Object>) => void) {
    this._saveCallbackAndProcessMessage(MESSAGE_SHOW_FRIENDS_SELECTOR, key, callback);
  }

  /**
  Requests the AQ App to show the preivew screen given some data.

  This function will trigger the AQ App to show the preview dialogue of the mini-app,
  eventually passing the given parameters as data for the preview.

  If any of the parameters, except data, is null, the preview screen will not be shown.

  @param {string} title - Title obtained from user through showTitleInput()
  @param {string} coverImageUrl - Cover image obtained from user. This can be a data-uri image,
    or normal web url.
  @param {Object} data - Any mini-app specific data.
  */
  showPreviewWithData(title: String, coverImageUrl: string, data: Object) {
    this._saveCallbackAndProcessMessage(MESSAGE_SHOW_PREVIEW_WITH_DATA, null, null, {
      title: title,
      coverImageUrl: coverImageUrl,
      data: data
    });
  }
}

const defaultUIBridge = new UIBridge(defaultCallbackHelper);
export { defaultUIBridge };
