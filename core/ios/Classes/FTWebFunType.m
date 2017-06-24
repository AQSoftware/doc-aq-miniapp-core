//
//  FTWebFunType.m
//  FunTypeCore
//
//  Created by Ryan Brozo on 02/03/2017.
//  Copyright © 2017 Bengga. All rights reserved.
//

#import "FTWebFunType.h"

@interface FTWebFunType()

@property (nonatomic, strong) FTWebFunTypeInfo* _Nonnull info;
@end

@implementation FTWebFunType


-(instancetype _Nonnull)initWithId:(NSString * _Nonnull)funTypeId url:(NSURL* _Nonnull)url {
  self = [super init];
  if (self){
    self.info = [[FTWebFunTypeInfo alloc]init];
    self.info.funTypeId = funTypeId;
    self.info.url = url;
    self.info.webKitMessages = @[];
  }
  return self;
}

-(FTWebFunTypeInfo * _Nonnull)ft_webInfo {
  return self.info;
}

-(void)ft_webViewCallbackWithMessage:(NSString* _Nonnull)message data:(NSDictionary* _Nonnull)data {
  
}


@end
