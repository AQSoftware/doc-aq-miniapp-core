//
//  FTMessages.h
//  RNMiniAppCore
//
//  Created by Ryan Brozo on 22/06/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

#ifndef FTMessages_h
#define FTMessages_h

extern NSString *const MESSAGE_SHOW_GALLERY_IMAGE_SELECTOR;
extern NSString *const MESSAGE_SHOW_WEB_IMAGE_SELECTOR;
extern NSString *const MESSAGE_SHOW_TITLE_INPUT;
extern NSString *const MESSAGE_SHOW_FRIENDS_SELECTOR;
extern NSString *const MESSAGE_SHOW_FRIENDS_SELECTOR_PROMISE;
extern NSString *const MESSAGE_SHOW_ALERT;

// CoreBridge Messages
extern NSString *const MESSAGE_GET_FRIENDS;
extern NSString *const MESSAGE_GET_BM_BALANCE;
extern NSString *const MESSAGE_CREATE_BET;
extern NSString *const MESSAGE_CLAIM_BET;
extern NSString *const MESSAGE_PAY;

// LifCycle Messages
extern NSString *const MESSAGE_SET_APP_DATA;
extern NSString *const MESSAGE_INFORM_READY;
extern NSString *const MESSAGE_SHOW_PREVIEW_WITH_DATA;
extern NSString *const MESSAGE_JOIN;
extern NSString *const MESSAGE_START;
extern NSString *const MESSAGE_SET_RESULT;
extern NSString *const MESSAGE_END;
extern NSString *const MESSAGE_PUBLISH_STATUS;


#endif /* FTMessages_h */
