//
//  RNMiniAppBridge.h
//  RNMiniAppBridge
//
//  Created by Ryan Brozo on 20/06/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <RNMiniAppCore/RNMiniAppCore.h>

@interface RNMiniAppBridge : NSObject


- (NSArray * _Nullable) bridgeModulesWithFunTypeView:(id <FTViewProtocol> _Nonnull)funTypeView
                                     funTypeDelegate:(id<FTViewProtocolDelegate> _Nonnull) funTypeDelegate;

- (void)sendResultFromMessage:(NSString * _Nonnull)message
                          key:(NSString *_Nonnull)key
                        value:(id _Nullable)value;

@end
  
