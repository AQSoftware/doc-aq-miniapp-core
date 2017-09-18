//
//  main.m
//  MiniAppSimulator
//
//  Created by Ryan Brozo on 20/06/2017.
//  Copyright © 2017 Bengga. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "AppDelegate.h"
#import "GCDWebServer.h"
#import "Globals.h"

int main(int argc, char * argv[]) {
  @autoreleasepool {
      NSError *error;
      
      // Start a webserver to serve large JS libraries and other large common assets
      GCDWebServer* webServer = [[GCDWebServer alloc] init];
      
      [webServer addGETHandlerForBasePath:@"/" directoryPath:[Globals sharedInstance].webRootPath indexFilename:nil cacheAge:3600 allowRangeRequests:YES];
      [webServer startWithOptions:@{@"BindToLocalhost": @YES, @"Port": @4000, @"AutomaticallySuspendInBackground": @YES} error:&error];

      
      return UIApplicationMain(argc, argv, nil, NSStringFromClass([AppDelegate class]));
  }
}
