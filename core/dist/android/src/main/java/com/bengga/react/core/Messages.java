package com.bengga.react.core;

/**
 * Created by ryanbrozo on 06/10/2017.
 */

public enum Messages {
  // UIBridge Messages
  MESSAGE_SHOW_GALLERY_IMAGE_SELECTOR("showGalleryImageSelector"),
  MESSAGE_SHOW_WEB_IMAGE_SELECTOR("showWebImageSelector"),
  MESSAGE_SHOW_TITLE_INPUT("showTitleInput"),
  MESSAGE_SHOW_FRIENDS_SELECTOR("showFriendsSelector"),
  MESSAGE_SHOW_FRIENDS_SELECTOR_PROMISE("showFriendsSelectorPromise"),
  MESSAGE_SHOW_ALERT("showAlert"),

  // CoreBridge Messages
  MESSAGE_GET_FRIENDS("getFriends"),
  MESSAGE_GET_BM_BALANCE("getBmBalance"),
  MESSAGE_CREATE_BET("createBet"),
  MESSAGE_CLAIM_BET("claimBet"),
  MESSAGE_PAY("pay"),

  // LifCycle Messages
  MESSAGE_SET_APP_DATA("setAppData"),
  MESSAGE_INFORM_READY("informReady"),
  MESSAGE_SHOW_PREVIEW_WITH_DATA("showPreviewWithData"),
  MESSAGE_JOIN("join"),
  MESSAGE_START("start"),
  MESSAGE_SET_RESULT("setResult"),
  MESSAGE_END("end"),
  MESSAGE_PUBLISH_STATUS("publishStatus");

  public String message;

  Messages(String value){
    this.message = value;
  }

  public static boolean isValid(String message) {
    boolean retVal = false;
    for(Messages m: Messages.values()){
      if(m.message.equals(message)) {
        retVal = true;
        break;
      }
    }
    return retVal;
  }

  public static Messages valueFor(String value) throws IllegalArgumentException {
    Messages retVal = null;
    for(Messages m: Messages.values()){
      if(m.message.equals(value)) {
        retVal = m;
        break;
      }
    }
    if (retVal == null) {
      throw new IllegalArgumentException("Message '" + value + "' is invalid");
    }
    return retVal;
  }
}
