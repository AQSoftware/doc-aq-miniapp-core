//
//  FTService.h
//  FunTypeCore
//
//  Created by Ryan Brozo on 02/03/2017.
//  Copyright © 2017 Bengga. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FTCommon.h"
#import "FTViewProtocolDelegate.h"


@protocol FTServiceDelegate;

@interface FTService : NSObject

@property (nonatomic, weak) id<FTServiceDelegate> _Nullable delegate;


+ (instancetype _Nonnull)sharedInstance;

- (void) registerFunTypeWithId:(Id _Nonnull) funTypeId
                         value:(id<FTNativeFunTypeProtocol> _Nonnull)value;

- (UIView * _Nonnull) createFunTypeView:(FTFunType* _Nonnull)funType
                               withMode:(FTFunTypeMode)mode
                           engagementId:(Id _Nullable)engagementId
                        funTypeDelegate:(id <FTViewProtocolDelegate> _Nonnull)funTypeDelegate;
//- (void)triggerCallbackForFunTypeId:(NSString * _Nonnull)funTypeId withMessage:(NSString * _Nonnull)message key:(NSString *_Nonnull)key value:(id _Nonnull)value;

@end

@protocol FTServiceDelegate <NSObject>

- (void)funTypeService:(FTService * _Nonnull)funTypeService
createDidFailWithError:(NSError * _Nonnull)error;

- (void)funTypeService:(FTService * _Nonnull)funTypeService
    didRequestSelector:(NSString * _Nonnull)selector withKey:(NSString * _Nonnull)key;

- (void)funTypeService:(FTService * _Nonnull)funTypeService
didEndOutputWithCaption:(NSString * _Nonnull)caption imageUrl:(NSString * _Nonnull)imageUrl;
@end
