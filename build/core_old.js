'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _postToWebKit(message, param) {
  window.webkit.messageHandlers['message'].postMessage(param);
}

/**
Core class that exposes AQ App functionalities to a Mini App web application

Copyright (c) 2017 AQ Software Inc.
*/

var Core = function () {

  /**
  Constructor
  @constructor
  */
  function Core() {
    _classCallCheck(this, Core);

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


  _createClass(Core, [{
    key: 'showWebImageSelector',
    value: function showWebImageSelector(key, title, imageUrls, callback) {
      var callbacks = this.callbacks['showWebImageSelector'];
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

  }, {
    key: 'showGalleryImageSelector',
    value: function showGalleryImageSelector(key, title, callback) {
      var callbacks = this.callbacks['showGalleryImageSelector'];
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

  }, {
    key: 'showTitleInput',
    value: function showTitleInput(callback) {
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

  }, {
    key: 'showFriendsSelector',
    value: function showFriendsSelector(key, callback) {
      var callbacks = this.callbacks['showFriendsSelector'];
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

  }, {
    key: 'setContentEditorOutput',
    value: function setContentEditorOutput(title, coverImageUrl, data) {
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

  }, {
    key: 'setContentEditorOutputCallback',
    value: function setContentEditorOutputCallback(callback) {
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

  }, {
    key: 'endWithOutput',
    value: function endWithOutput(caption, imageUrl) {
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

  }, {
    key: 'getJoinPreviewData',
    value: function getJoinPreviewData(callback) {
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

  }, {
    key: 'getFriends',
    value: function getFriends(callback) {
      this.callbacks['getFriends'] = callback;

      if (typeof window.webkit !== "undefined") {
        window.webkit.messageHandlers.getFriends.postMessage(null);
      }
    }
  }]);

  return Core;
}();

function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

function sanitize(value, shouldDecode) {
  var sanitized = value;
  if (shouldDecode) {
    var jsonString = b64DecodeUnicode(value);
    sanitized = JSON.parse(jsonString);
  }
  return sanitized;
}

window.funTypeCallback = function (selector, key, value, shouldDecode) {
  if (miniApp.callbacks[selector] != null) {
    var callback = miniApp.callbacks[selector];
    switch (selector) {
      case 'showTitleInput':
      case 'getJoinPreviewData':
      case 'getFriends':
        callback(sanitize(value, shouldDecode));
        break;
      default:
        if (key != null) {
          var selectorCallbacks = miniApp.callbacks[selector];
          if (selectorCallbacks[key] != null) {
            callback = selectorCallbacks[key];
            callback(key, sanitize(value, shouldDecode));
          }
        }
    }
  }
};

var miniApp = new Core();
exports.miniApp = miniApp;