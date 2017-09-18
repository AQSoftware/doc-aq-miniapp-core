//
//  Globals.h
//  MiniAppSimulator
//
//  Created by Ryan Brozo on 15/09/2017.
//  Copyright © 2017 Bengga. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Globals : NSObject

+ (instancetype _Nonnull)sharedInstance;

@property (nonatomic) NSInteger port;
@property (nonatomic, readonly) NSURL* _Nonnull webRoot;
@property (nonatomic, readonly) NSString* _Nonnull webRootPath;

@end
