//
//  RNFunTypeViewManager.m
//  RNFunType
//
//  Created by Ryan Brozo on 10/03/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RNFunTypeViewManager.h"
#import "RNFunTypeView.h"
#import <React/RCTUIManager.h>
#import <RNMiniAppCore/RNMiniAppCore.h>


@interface RNFunTypeViewManager()

@property (nonatomic, strong) FTFunType *funType;
@property (nonatomic, strong) NSString* mode;

@end

@implementation RNFunTypeViewManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(onFunTypeViewDidLoad, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onFunTypeViewError, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRequestSelector, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRequestPreviewData, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onJoin, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onEnd, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPublishStatus, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onSetAppData, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onReady, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRequestShowPreviewWithData, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMessage, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoadProgress, RCTDirectEventBlock)


RCT_CUSTOM_VIEW_PROPERTY(mode, NSString*, UIView){
  
  if (![view isKindOfClass:[RNFunTypeView class]]){
    RCTLog(@"Expecting RNFunTypeView, got: %@", view);
  }
  else {
    RNFunTypeView* funTypeView = (RNFunTypeView *)view;
    funTypeView.mode = [json lowercaseString];
    [funTypeView updateContent];
  }
}

RCT_CUSTOM_VIEW_PROPERTY(engagementId, NSString*, UIView){
  
  if (![view isKindOfClass:[RNFunTypeView class]]){
    RCTLog(@"Expecting RNFunTypeView, got: %@", view);
  }
  else {
    RNFunTypeView* funTypeView = (RNFunTypeView *)view;
    funTypeView.clipsToBounds = YES;
    funTypeView.engagementId = json;
    [funTypeView updateContent];
  }
}

RCT_CUSTOM_VIEW_PROPERTY(funType, NSString*, UIView){
  
  if (![view isKindOfClass:[RNFunTypeView class]]){
    RCTLog(@"Expecting RNFunTypeView, got: %@", view);
  }
  else {
    RNFunTypeView* funTypeView = (RNFunTypeView *)view;
    
    FTFunType *funType = [[FTFunType alloc]init];
    funType.funTypeId = json[@"id"];
    funType.name = json[@"name"];
    
//    NSString *type = json[@"type"];
//    if ([[type lowercaseString] isEqualToString:@"internal"]){
//      funType.type = kInternal;
//    }
//    else if ([[type lowercaseString] isEqualToString:@"webbased"]){
//      funType.type = kWebBased;
//    }
//    else {
//      funType.type = kInternal;
//    }
    NSInteger type = [json[@"type"] integerValue];
    funType.type = (FTFunTypeEnum)type;
    if (json[@"webUrl"]) {
      funType.webUrl = [NSURL URLWithString:json[@"webUrl"]];
    }
    funTypeView.funType = funType;
    [funTypeView updateContent];
  }
}

RCT_EXPORT_METHOD(triggerViewCallbackWithTag:(NSNumber * _Nonnull)reactTag
                  message:(NSString *)message
                  key:(NSString *)key
                  value:(id)value)
{
  [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
    UIView *view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RNFunTypeView class]]) {
      RCTLog(@"Expecting RNFunTypeView, got: %@", view);
    }
    else {
      RNFunTypeView *funTypeView = (RNFunTypeView *)view;
      if ([funTypeView.subView conformsToProtocol:@protocol(FTViewProtocol)]){
        [((id<FTViewProtocol>)funTypeView.subView) sendResultFromMessage:message key:key value:value];
      }
    }
  }];
}


- (UIView *)view {
  return [[RNFunTypeView alloc]init];
}

@end
