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
#import "Globals.h"

@interface ViewController () <FTViewProtocolDelegate>

@end

@implementation ViewController


-(void)loadView {
  
  UIActivityIndicatorView *progressView = [[UIActivityIndicatorView alloc]initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
  [progressView startAnimating];
  
  UIView *rootView = [[UIView alloc]initWithFrame:CGRectZero];
  [rootView addSubview:progressView];
  
  // Setup autolayout constraints to fill the parent
  NSDictionary *views = NSDictionaryOfVariableBindings(progressView);
  NSArray *horizontalConstraints = [NSLayoutConstraint constraintsWithVisualFormat:@"H:|-0-[progressView]-0-|" options:0 metrics:nil views:views];
  NSArray *verticalConstraints = [NSLayoutConstraint constraintsWithVisualFormat:@"V:|-0-[progressView]-0-|" options:0 metrics:nil views:views];
  
  [rootView addConstraints:horizontalConstraints];
  [rootView addConstraints:verticalConstraints];
  
  self.view = rootView;
}

-(void)setFunTypeViewWithFunType:(FTFunType *)funType {
  UIView *funTypeView = [[FTService sharedInstance] createFunTypeView:funType
                                                          withMode:kJoin
                                                      engagementId:@"vUSNmnCcQMusV1Y-Wk8Tow"
                                                   funTypeDelegate:self];
  
  funTypeView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  
  // Add as subview
  [self.view addSubview:funTypeView];
  funTypeView.frame = self.view.bounds;
  
  // Setup autolayout constraints to fill the parent
  NSDictionary *views = NSDictionaryOfVariableBindings(funTypeView);
  NSArray *horizontalConstraints = [NSLayoutConstraint constraintsWithVisualFormat:@"H:|-0-[funTypeView]-0-|" options:0 metrics:nil views:views];
  NSArray *verticalConstraints = [NSLayoutConstraint constraintsWithVisualFormat:@"V:|-0-[funTypeView]-0-|" options:0 metrics:nil views:views];
  
  [self.view addConstraints:horizontalConstraints];
  [self.view addConstraints:verticalConstraints];
  
}


- (void)viewDidLoad {
  [super viewDidLoad];
  // Do any additional setup after loading the view, typically from a nib.
  
  
  
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
  
  
  FTService *funTypeService = [FTService sharedInstance];
  
  funTypeService.funTypePath = [[Globals sharedInstance] webRootPath];
  funTypeService.funTypeWebRoot = [[Globals sharedInstance] webRoot];
  
  
  FTFunType *funType = [[FTFunType alloc]init];
  funType.funTypeId = @"1234";
  funType.type = kExternalWebBased;
  //  funType.webUrl = [NSURL URLWithString:@"http://bengga-web-funtypes.s3-website-us-east-1.amazonaws.com/hotstuff/?action=join&id=1234"];
  //  funType.webUrl = [NSURL URLWithString:@"http://bengga-web-funtypes.s3-website-us-east-1.amazonaws.com/hotstuff_pass_the_ball/"];
  funType.name = @"template";
  //  funType.webUrl = [NSURL URLWithString:@"https://s3.amazonaws.com/bengga-web-funtypes/funtype.jsbundle"];
  //  funType.webUrl = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true&minify=false"];
  //  funType.webUrl = [NSURL URLWithString:@"http://localhost:4000/bubble_wrap_1b5a186c0ad70d4efad08719ec94cef67e24fd73/index.html"];
  funType.webUrl = [NSURL URLWithString:@"http://bengga-web-funtypes.s3-website-us-east-1.amazonaws.com/production/horseman/"];
  funType.packageFileUrl = [NSURL URLWithString:@"https://s3.amazonaws.com/bengga-web-funtypes/staging/horseman/horseman.zip"];
  funType.packageFileHash = @"1b5a186c0ad70d4efad08719ec94cef67e24fd73";
  
  
  //
  
  __weak ViewController *weakSelf = self;
  
  switch ([funTypeService isFunTypeDownloaded:funType]) {
    case kOnline:
    case kInAppDownloaded:
      [self setFunTypeViewWithFunType:funType];
      break;
    case kInAppNotDownloaded:
      [funTypeService downloadFunType:funType
                             progress:^(float progress) {
                               NSLog(@"Progress %f", progress);
                             } completion:^(NSError * _Nullable error) {
                               if (error) {
                                 NSLog(@"Unable to download the %@ fun type.", funType.name);
                               }
                               else {
                                 [weakSelf setFunTypeViewWithFunType:funType];
                               }
                             }];
      break;
  }
  
//  FTDownloader *downloader = [[FTDownloader alloc]initWithDelegate:self];
//  NSString *path = [NSString stringWithFormat:@"%@test.zip", NSTemporaryDirectory()];
//  NSLog(@"Path = %@", path);
//  NSString *hash = @"1b5a186c0ad70d4efad08719ec94cef67e24fd73";
//  [downloader downloadFileFromUrl:[NSURL URLWithString:@"https://s3.amazonaws.com/bengga-web-funtypes/staging/horseman/horseman.zip"]
//                           toPath:path
//                    withSHA1Hash:hash];
  
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

//#pragma mark - FTDownloaderDelegate methods 
//
//-(void)downloader:(FTDownloader *)downloader didFinishDownloadingUrlToPath:(NSString *)path {
//  NSLog(@"Successfully downloaded to %@", path);
//  
//  // Unzip 
//  NSString *hash = @"1b5a186c0ad70d4efad08719ec94cef67e24fd73";
//  NSString *webRootPath = [NSString stringWithFormat:@"%@/bubble_wrap_%@", [[Globals sharedInstance]webRoot], hash];
//  [SSZipArchive unzipFileAtPath:path toDestination:webRootPath];
//  
//}
//
//-(void)downloader:(FTDownloader *)downloader didCompleteWithError:(NSError *)error {
//  NSLog(@"Unable to download: %@", [error description]);
//}
//
//-(void)downloader:(FTDownloader *)downloader didDownloadProgress:(float)progress {
//  NSLog(@"Download progress %f", progress);
//}

#pragma mark - FTViewProtocolDelegate methods

-(void)funTypeViewDidLoad:(id<FTViewProtocol> _Nonnull)funTypeView
{
  NSLog(@"funTypeViewDidLoad");
  
  [funTypeView sendResultFromMessage:@"onData" key:@"default" value:@{}];
}


-(void)funTypeView:(id<FTViewProtocol> _Nonnull)funTypeView didFailNavigationWithError:(NSError * _Nonnull)error
{
  NSLog(@"didFailNavigationWithError %@", [error description]);
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


-(void)funTypeViewDidInformReady:(id<FTViewProtocol>)funTypeView {
  NSLog(@"funTypeViewDidInformReady");
}

-(void)funTypeView:(id<FTViewProtocol>)funTypeView didReceiveMessage:(NSString *)message params:(NSDictionary *)params {
  NSLog(@"didReceiveMessage message=%@ params=%@", message, params);
}

-(void)funTypeView:(id<FTViewProtocol>)funTypeView didSetAppData:(NSDictionary *)appData {
  NSLog(@"didSetAppData appData=%@", appData);
}

-(void)funTypeView:(id<FTViewProtocol>)funTypeView loadProgress:(double)progress {
 NSLog(@"loadProgress appData=%f", progress);
}

@end
