//
//  RNFunTypeView.h
//  RNFunType
//
//  Created by Ryan Brozo on 10/03/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTComponent.h>
#import <RNMiniAppCore/RNMiniAppCore.h>

@interface RNFunTypeView : UIView

@property (nonatomic, copy) RCTDirectEventBlock _Nullable onFunTypeViewDidLoad;
@property (nonatomic, copy) RCTDirectEventBlock _Nullable onFunTypeViewError;
@property (nonatomic, copy) RCTDirectEventBlock _Nullable onRequestSelector;
@property (nonatomic, copy) RCTDirectEventBlock _Nullable onRequestPreviewData;
@property (nonatomic, copy) RCTDirectEventBlock _Nullable onJoin;
@property (nonatomic, copy) RCTDirectEventBlock _Nullable onEnd;
@property (nonatomic, copy) RCTDirectEventBlock _Nullable onPublishStatus;
@property (nonatomic, copy) RCTDirectEventBlock _Nullable onSetAppData;
@property (nonatomic, copy) RCTDirectEventBlock _Nullable onReady;
@property (nonatomic, copy) RCTDirectEventBlock _Nullable onRequestShowPreviewWithData;
@property (nonatomic, copy) RCTDirectEventBlock _Nullable onMessage;

@property (nonatomic, weak) UIView * _Nullable subView;

@property (nonatomic, strong) FTFunType*  _Nullable funType;
@property (nonatomic, strong) NSString* _Nullable mode;
@property (nonatomic, strong) Id _Nullable engagementId;

- (void) updateContent;

@end
