//
//  RNMiniAppUIBridge.h
//  RNMiniAppBridge
//
//  Created by Ryan Brozo on 21/06/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <RNMiniAppCore/RNMiniAppCore.h>


@interface RNMiniAppUIBridge : NSObject <RCTBridgeModule>

- (instancetype _Nonnull)initWithFunTypeView:(id <FTViewProtocol> _Nonnull)funTypeView
                             funTypeDelegate:(id<FTViewProtocolDelegate> _Nonnull) funTypeDelegate;
- (void)sendResultFromMessage:(NSString * _Nonnull)message
                          key:(NSString *_Nonnull)key
                        value:(id _Nullable)value;

@end
