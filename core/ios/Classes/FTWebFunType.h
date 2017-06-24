//
//  FTWebFunType.h
//  FunTypeCore
//
//  Created by Ryan Brozo on 02/03/2017.
//  Copyright © 2017 Bengga. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "FTCommon.h"

FOUNDATION_EXPORT NSString* _Nonnull const MESSAGE_REQUEST_IMAGE;
FOUNDATION_EXPORT NSString* _Nonnull const MESSAGE_REQUEST_TEXT;
FOUNDATION_EXPORT NSString* _Nonnull const MESSAGE_REQUEST_FRIENDS;
FOUNDATION_EXPORT NSString* _Nonnull const MESSAGE_END_WITH_OUTPUT;


@interface FTWebFunType : NSObject <FTWebFunTypeProtocol>

@property (nonatomic, readonly) FTWebFunTypeInfo* _Nonnull ft_webInfo;

-(instancetype _Nonnull)initWithId:(NSString * _Nonnull)funTypeId url:(NSURL* _Nonnull)url;
-(void)ft_webViewCallbackWithMessage:(NSString* _Nonnull)message data:(NSDictionary* _Nonnull)data;


@end
