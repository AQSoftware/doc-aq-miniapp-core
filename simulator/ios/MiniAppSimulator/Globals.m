//
//  Globals.m
//  MiniAppSimulator
//
//  Created by Ryan Brozo on 15/09/2017.
//  Copyright © 2017 Bengga. All rights reserved.
//

#import "Globals.h"

@implementation Globals


+ (instancetype _Nonnull)sharedInstance {
    static Globals *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[self alloc]init];
    });
    return sharedInstance;
}

- (NSString *) webRootPath {
    NSError *error;
    NSFileManager *fileManager = [NSFileManager defaultManager];
    
    NSString *cachePath = [NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) firstObject];
    NSString *webRoot = [NSString stringWithFormat:@"%@/bitapps", cachePath];
    
    if (![fileManager fileExistsAtPath:webRoot]) {
        [fileManager createDirectoryAtPath:webRoot withIntermediateDirectories:YES attributes:nil error:&error];
    }
    
    return webRoot;
}

- (NSURL *) webRoot {
  return [NSURL URLWithString:[NSString stringWithFormat:@"http://localhost:%li", (long)[self port]]];
}

- (NSInteger) port {
  return 4000;
}

@end
