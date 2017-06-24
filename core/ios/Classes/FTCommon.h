//
//  FTCommon.h
//  FunTypeCore
//
//  Created by Ryan Brozo on 02/03/2017.
//  Copyright © 2017 Bengga. All rights reserved.
//

#ifndef FTCommon_h
#define FTCommon_h

typedef NSString* Id;

typedef enum {
  kInternal,
  kExternalNative,
  kExternalWebBased
} FTFunTypeEnum;

@interface FTFunType : NSObject

@property (nonatomic, strong) Id _Nonnull funTypeId;
@property (nonatomic, strong) NSString * _Nonnull name;
@property (nonatomic) FTFunTypeEnum type;
@property (nonatomic, strong) NSURL* _Nullable webUrl;
@end


@protocol FTNativeFunTypeProtocol
@end

@interface FTWebFunTypeInfo : NSObject

@property (nonatomic, strong) NSString* _Nonnull funTypeId;
@property (nonatomic, strong) NSURL* _Nonnull url;
@property (nonatomic, strong) NSArray* _Nullable webKitMessages;
@end


@protocol FTWebFunTypeProtocol

@property (nonatomic, readonly) FTWebFunTypeInfo* _Nonnull ft_webInfo;

-(void)ft_webViewCallbackWithMessage:(NSString* _Nonnull)message data:(NSDictionary* _Nonnull)data;
@end

typedef enum {
  kCreate,
  kJoin,
  kPreview
} FTFunTypeMode;



#endif /* FTCommon_h */
