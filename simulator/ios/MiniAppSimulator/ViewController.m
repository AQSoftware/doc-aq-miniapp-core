//
//  ViewController.m
//  MiniAppSimulator
//
//  Created by Ryan Brozo on 20/06/2017.
//  Copyright © 2017 Bengga. All rights reserved.
//

#import "ViewController.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import <RNMiniAppCore/RNMiniAppCore.h>

@interface ViewController () <FTViewProtocolDelegate>

@end

@implementation ViewController


-(void)loadView {
  
//
////  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
////  NSString *documentsDirectory = [paths objectAtIndex:0];
////  NSString *databasePath = [documentsDirectory stringByAppendingString:@"/funtype.jsbundle"];
////
////
////  [self copyFunTypeBundle:databasePath];
//
////  NSURL *jsCodeLocation = [NSURL URLWithString:@"https://s3.amazonaws.com/bengga-web-funtypes/funtype.jsbundle"];
////  NSURL *jsCodeLocation = [NSURL URLWithString:@"http://localhost:8000/funtype.jsbundle"];
//  NSURL *jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true&minify=false"];
////  NSURL *jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
////  NSURL *jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"funtype" withExtension:@"jsbundle"];
//
//
//  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
//                                                      moduleName:@"FunType"
//                                               initialProperties:nil
//                                                   launchOptions:launchOptions];
  
  
  FTFunType *funType = [[FTFunType alloc]init];
  funType.funTypeId = @"1234";
  funType.type = kExternalNative;
  //  funType.webUrl = [NSURL URLWithString:@"http://bengga-web-funtypes.s3-website-us-east-1.amazonaws.com/hotstuff/?action=join&id=1234"];
  //  funType.webUrl = [NSURL URLWithString:@"http://bengga-web-funtypes.s3-website-us-east-1.amazonaws.com/hotstuff_pass_the_ball/"];
  funType.name = @"template";
  //  funType.webUrl = [NSURL URLWithString:@"https://s3.amazonaws.com/bengga-web-funtypes/funtype.jsbundle"];
  funType.webUrl = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true&minify=false"];
  
  
  UIView *rootView = [[FTService sharedInstance] createFunTypeView:funType
                                                          withMode:kJoin
                                                      engagementId:@"vUSNmnCcQMusV1Y-Wk8Tow"
                                                   funTypeDelegate:self];
  
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  self.view = rootView;
}


- (void)viewDidLoad {
  [super viewDidLoad];
  // Do any additional setup after loading the view, typically from a nib.
}


- (void)didReceiveMemoryWarning {
  [super didReceiveMemoryWarning];
  // Dispose of any resources that can be recreated.
}

- (void)copyFunTypeBundle:(NSString *)databasePath {
  
  
  NSFileManager *fileManager = [NSFileManager defaultManager];
  
  // Get path of database using main bundle
  NSBundle *mainBundle = [NSBundle mainBundle];
  NSString *sourceCleanDbPath = [mainBundle pathForResource:@"funtype" ofType:@"jsbundle"];
  
  [fileManager removeItemAtPath:databasePath error:NULL];
  [fileManager copyItemAtPath:sourceCleanDbPath toPath:databasePath error:NULL];
  
}

#pragma mark - FTViewProtocolDelegate methods

-(void)funTypeViewDidLoad:(id<FTViewProtocol> _Nonnull)funTypeView
{
  NSLog(@"funTypeViewDidLoad");
}

-(void)funTypeView:(id<FTViewProtocol> _Nonnull)funTypeView didFailNavigationWithError:(NSError * _Nonnull)error
{
  NSLog(@"didFailNavigationWithError");
}

-(void)funTypeView:(id<FTViewProtocol> _Nonnull)funTypeView didRequestSelector:(NSString * _Nonnull)selector
           withKey:(NSString * _Nonnull)key
              data:(NSDictionary * _Nullable)data
{
  NSLog(@"funTypeViewDidRequestSelector %@, %@, %@", selector, key, data);
  
  if ([selector isEqualToString:MESSAGE_SHOW_TITLE_INPUT]){
    [funTypeView sendResultFromMessage:selector key:key value:@"Hello From Native"];
  }
  else if ([selector isEqualToString:MESSAGE_SHOW_WEB_IMAGE_SELECTOR]){
    [funTypeView sendResultFromMessage:selector key:key value:data[@"imageUrls"][2]];
  }
  else if ([selector isEqualToString:MESSAGE_SHOW_GALLERY_IMAGE_SELECTOR]){
    [funTypeView sendResultFromMessage:selector key:key value:@"http://www.ucost.in/slider/tiles/pg.jpg"];
  }
  else if ([selector isEqualToString:MESSAGE_SHOW_FRIENDS_SELECTOR]){
    [funTypeView sendResultFromMessage:selector key:key value:@{@"id": @"1234", @"displayName": @"John Smith"}];
  }
}

-(void)funTypeViewDidRequestPreviewData:(id<FTViewProtocol> _Nonnull)funTypeView
{
  NSLog(@"funTypeViewDidRequestPreviewData");
}

-(void)funTypeView:(id<FTViewProtocol> _Nonnull)funTypeView didJoinWithId:(NSString * _Nullable)joinId joinImageUrl:(NSString * _Nonnull)joinImageUrl winCriteriaPassed:(BOOL)winCriteriaPassed notificationItem:(NSDictionary * _Nullable)notificationItem
{
  NSLog(@"funTypeViewDidJoinWithId %@ %@ %@, %@", joinId, joinImageUrl, @(winCriteriaPassed), notificationItem);
}

-(void)funTypeViewDidEnd:(id<FTViewProtocol>)funTypeView {
  NSLog(@"funTypeViewDidEnd");
}

-(void)funTypeView:(id<FTViewProtocol> _Nonnull)funTypeView didRequestShowPreviewWithTitle:(NSString * _Nonnull)title
     coverImageUrl:(NSString * _Nonnull)coverImageUrl data:(NSDictionary *_Nullable)data
{
  NSLog(@"funTypeViewDidRequestShowPreviewWithTitle %@ %@ %@", title, coverImageUrl, data);
}

-(void)funTypeView:(id<FTViewProtocol> _Nonnull)funTypeView didInformPublishStatus:(BOOL)status
{
  NSLog(@"funTypeViewDidInformPublishStatus %@", @(status));
}






@end
