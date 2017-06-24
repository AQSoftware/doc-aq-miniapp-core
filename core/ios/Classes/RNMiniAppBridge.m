//
//  RNMiniAppBridge.m
//  RNMiniAppBridge
//
//  Created by Ryan Brozo on 20/06/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RNMiniAppBridge.h"
#import "FTMessages.h"
#import "RNMiniAppLifeCycleBridge.h"
#import "RNMiniAppUIBridge.h"

@interface RNMiniAppBridge()

@property (nonatomic, strong) RNMiniAppLifeCycleBridge * lifeCycleBridge;
@property (nonatomic, strong) RNMiniAppUIBridge * uiBridge;

@end

@implementation RNMiniAppBridge

- (NSArray * _Nullable) bridgeModulesWithFunTypeView:(id <FTViewProtocol> _Nonnull)funTypeView
                                     funTypeDelegate:(id<FTViewProtocolDelegate> _Nonnull) funTypeDelegate {
  
  self.lifeCycleBridge = [[RNMiniAppLifeCycleBridge alloc]initWithFunTypeView:funTypeView
                                                              funTypeDelegate:funTypeDelegate];
  self.uiBridge = [[RNMiniAppUIBridge alloc]initWithFunTypeView:funTypeView
                                                funTypeDelegate:funTypeDelegate];
  
  return @[self.lifeCycleBridge, self.uiBridge];
  
}

- (void)sendResultFromMessage:(NSString * _Nonnull)message
                         key:(NSString *_Nonnull)key
                       value:(id _Nullable)value {
  
  if([message isEqualToString:MESSAGE_SHOW_GALLERY_IMAGE_SELECTOR] ||
     [message isEqualToString:MESSAGE_SHOW_WEB_IMAGE_SELECTOR] ||
     [message isEqualToString:MESSAGE_SHOW_TITLE_INPUT] ||
     [message isEqualToString:MESSAGE_SHOW_FRIENDS_SELECTOR]){
    
    [self.uiBridge sendResultFromMessage:message key:key value:value];
  }
  else if([message isEqualToString:MESSAGE_GET_FRIENDS]){
    
  }
  else if([message isEqualToString:MESSAGE_SHOW_PREVIEW_WITH_DATA] ||
          [message isEqualToString:MESSAGE_JOIN] ||
          [message isEqualToString:MESSAGE_END] ||
          [message isEqualToString:MESSAGE_PUBLISH_STATUS]) {
    [self.lifeCycleBridge sendResultFromMessage:message key:key value:value];
  }
}

@end
  
