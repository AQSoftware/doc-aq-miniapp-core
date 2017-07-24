// @flow
import Base64JS from 'base64-js';
import uuidv1 from 'uuid/v1';

type NotificationItem = {
  notificationType: number,
  destinationUserIds: Array<string>,
  textFormat: string,
  textValues: Object,
  additionalInfo: ?Object
}

/**
Stub class that generates stub functionality for AQ MiniApp's LifeCycle API

Copyright (c) 2017 AQ Software Inc.
*/
export class LifeCycle {

  /**
  Sets the callback function to be called when the AQ App sets data
  that will be used by the miniapp.

  @param {function(value: Object): void} callback - Callback function to call
    when data is available from the AQ App
  */
  setOnDataCallback(callback: (value: any) => void) {}

  /**
  Sets the callback function to be called when the AQ App requests the create screen
  to provide it with the current item data. This data will then be passed by the AQ App
  to the join screen

  @param {function(): void} callback - Callback function to call
    when the AQ App requests the current item data
  */
  setRequestPreviewCallback(callback: () => void) {}

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
  setPublishCallback(callback: (string) => void) {}

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
  showPreviewWithData(title: String, coverImageUrl: string, data: Object) {}

  /**
  Requests the AQ App to set some app-specific data.

  This function will set app-specific data that may or may not be utilized by the AQ App.

  @param {Object} appData - Any mini-app specific data.
  */
  setAppData(appData: Object) {}

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
  join(id: ?string, joinImageUrl: string, winCriteriaPassed: boolean, notificationItem: ?NotificationItem) {}

  /**
  Ends the join screen, providing the AQ App with a caption and a join output image.
  */
  end() {}

  /**
  Informs the AQ App that publishing succeeded.

  */
  publishSucceded(){}

  /**
  Informs the AQ App that publishing failed
  */
  publishFailed(){}
}
