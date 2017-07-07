// @flow

export type Friend = {
  id: string,
  displayName: string,
  avatarBig: ?string,
  avatarSmall: ?string
}

/**
Stub class that emulates AQ MiniApp UIBridge API

Copyright (c) 2017 AQ Software Inc.
*/

export class UIBridge {

  /**
  Requests the AQ App to show a text input UI for the user to input a title

  @param {function(value: string): void} callback - Callback function to be called when
    a title has been input by the user
  */
  showTitleInput(callback: (value: string) => void) {
    callback('Lorem Ipsum');
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
    callback(key, 'http://lorempixel.com/320/568/');
  }

  /**
  Requests the AQ App to show a selector UI showing a list of available gallery images

  @param {string} key - Unique key identifying this particular Requests
  @param {string} title - Title to be shown to the selector UI
  @param {function(key: string, value: Object): void} callback - Callback function to be called when
    an image is selected
  */
  showGalleryImageSelector(key: string, title: string, callback: (key: string, value: any) => void) {
    callback(key, 'http://lorempixel.com/320/568/');
  }

  /**
  Requests the AQ App to show a selector UI showing a list of friends

  @param {string} key - Unique key identifying this particular Requests
  @param {function(key: string, value: Object[]): void} callback - Callback function to be called when
    a list of friends has been selected
  */
  showFriendsSelector(key: string, callback: (key: string, value: Array<Object>) => void) {
    callback(key, [
      {
        id: '7ywNEFe4EeeVakrmJEcW4w',
        displayName: 'John Doe',
        avatarBig: 'http://lorempixel.com/120/120/',
        avatarSmall: 'http://lorempixel.com/48/48/'
      },
      {
        id: '86U5IFe4EeeVakrmJEcW4w',
        displayName: 'John Smith',
        avatarBig: 'http://lorempixel.com/120/120/',
        avatarSmall: 'http://lorempixel.com/48/48/'
      }
    ]);
  }
}
