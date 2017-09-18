//
//  FTService.m
//  FunTypeCore
//
//  Created by Ryan Brozo on 02/03/2017.
//  Copyright © 2017 Bengga. All rights reserved.
//

#import "FTService.h"
#import "FTWebFunType.h"
#import "FTWebView.h"
#import "FTNativeView.h"
#import "FTDownloader.h"
#import "ZipArchive.h"


// UIBridge Messages
NSString *const MESSAGE_SHOW_GALLERY_IMAGE_SELECTOR = @"showGalleryImageSelector";
NSString *const MESSAGE_SHOW_WEB_IMAGE_SELECTOR = @"showWebImageSelector";
NSString *const MESSAGE_SHOW_TITLE_INPUT = @"showTitleInput";
NSString *const MESSAGE_SHOW_FRIENDS_SELECTOR = @"showFriendsSelector";

// CoreBridge Messages
NSString *const MESSAGE_GET_FRIENDS = @"getFriends";
NSString *const MESSAGE_GET_BM_BALANCE = @"getBmBalance";

// LifCycle Messages
NSString *const MESSAGE_SET_APP_DATA = @"setAppData";
NSString *const MESSAGE_INFORM_READY = @"informReady";
NSString *const MESSAGE_SHOW_PREVIEW_WITH_DATA = @"showPreviewWithData";
NSString *const MESSAGE_JOIN = @"join";
NSString *const MESSAGE_START = @"start";
NSString *const MESSAGE_END = @"end";
NSString *const MESSAGE_PUBLISH_STATUS = @"publishStatus";


@interface FTService()<FTDownloaderDelegate> // <FTFunTypeWebControllerDelegate>

@end

@implementation FTService

NSMutableDictionary *_factory, *_createWebFunTypeControllers;
FTDownloader *_downloader;
FTFunType *_currentlyDownloadingFunType;
void (^_downloadCompletion)(NSError * _Nullable);
void (^_downloadProgress)(float);

+ (instancetype _Nonnull)sharedInstance {
  static FTService *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [[self alloc]init];
  });
  return sharedInstance;
}

-(instancetype) init {
  self = [super init];
  if (self){
    _factory = [[NSMutableDictionary alloc]initWithCapacity:10];
    _createWebFunTypeControllers = [[NSMutableDictionary alloc]initWithCapacity:10];
    _downloader = [[FTDownloader alloc]initWithDelegate:self];
  }
  return self;
}


- (void) registerFunTypeWithId:(Id) funTypeId value:(id<FTNativeFunTypeProtocol>)value {
  [_factory setObject:value forKey:funTypeId];
}

- (NSURL *)resolvedUrlForFunType:(FTFunType *)funType {
  if (funType.packageFileUrl) {
    NSString *urlString = [NSString stringWithFormat:@"%@/%@_%@/index.html", self.funTypeWebRoot, funType.funTypeId, funType.packageFileHash];
    NSLog(@"resolvedUrlForFunType = %@", urlString);
    return [NSURL URLWithString:urlString];
  }
  else {
    NSLog(@"resolvedUrlForFunType = %@", funType.webUrl.absoluteString);
    return funType.webUrl;
  }
}

- (UIView * _Nonnull) createFunTypeView:(FTFunType* _Nonnull)funType
                               withMode:(FTFunTypeMode)mode
                           engagementId:(Id _Nullable)engagementId
                        funTypeDelegate:(id <FTViewProtocolDelegate> _Nonnull) funTypeDelegate {
  switch (funType.type) {
    case kExternalNative: {
      FTNativeView *nativeView = [FTNativeView createInstanceWithFunType:funType
                                                                    mode:mode
                                                            engagementId:engagementId
                                                         funTypeDelegate:funTypeDelegate];
      nativeView.funType = funType;
      
      return nativeView;
    }
      break;
    case kExternalWebBased: {
      NSURL *webUrl;
      switch (mode) {
        case kCreate:
          webUrl = [NSURL URLWithString:@"?action=create" relativeToURL:[self resolvedUrlForFunType:funType]];
          break;
        case kJoin:
          webUrl = [NSURL URLWithString:[NSString stringWithFormat:@"?action=join&id=%@", engagementId] relativeToURL:[self resolvedUrlForFunType:funType]];
          break;
          
        case kPreview:
          webUrl = [NSURL URLWithString:@"?action=preview" relativeToURL:[self resolvedUrlForFunType:funType]];
          break;
      }
      FTWebFunType *webFunType = [[FTWebFunType alloc]initWithId:funType.funTypeId url:webUrl];
      FTWebView *webView = [FTWebView createInstanceWithFunTypeDelegate:funTypeDelegate];
      webView.funType = funType;
      webView.webFunType = webFunType;
      
      return webView;
      //      FTWebFunType *webFunType = [[FTWebFunType alloc]initWithId:funType.funTypeId url:funType.webUrl];
      //      FTFunTypeWebController *controller = [[FTFunTypeWebController alloc]init:webFunType];
      //      controller.delegate = self;
      //      [_createWebFunTypeControllers setObject:controller forKey:funType.funTypeId];
      
      
      //      return controller.view;
    }
      break;
    default:
      
      return [[UIView alloc]init];
      
      break;
      
  }
}

- (FTFunTypeDownloadEnum) isFunTypeDownloaded:(FTFunType* _Nonnull)funType {
  NSFileManager *fileManager = [NSFileManager defaultManager];
  
  if (self.funTypePath == nil) {
    NSException *exception = [NSException exceptionWithName:@"FunTypePathNotSetException"
                                                     reason:@"funTypePath is not set"
                                                   userInfo:nil];
    @throw exception;
  }
  
  if (!funType.packageFileUrl) {
    return kOnline;
  }
  else {
    NSString *funTypePath = [NSString stringWithFormat:@"%@/%@_%@", self.funTypePath, funType.funTypeId, funType.packageFileHash];
    return [fileManager fileExistsAtPath:funTypePath] ? kInAppDownloaded : kInAppNotDownloaded;
  }
  
}

- (void) downloadFunType:(FTFunType* _Nonnull)funType
                progress:(void(^ _Nullable)(float))progress
              completion:(void(^ _Nullable)(NSError * _Nullable))completion {
  
  
  if ([_currentlyDownloadingFunType.funTypeId isEqualToString:funType.funTypeId]) {
    // FunType is currently downloading. Do nothing
    return;
  }
  
  _currentlyDownloadingFunType = funType;
  _downloadCompletion = completion;
  _downloadProgress = progress;
  
  
  NSString *path = [NSString stringWithFormat:@"%@%@_%@_tmp.zip", NSTemporaryDirectory(), funType.funTypeId, funType.packageFileHash];
  NSLog(@"Path = %@", path);
  [_downloader downloadFileFromUrl:[NSURL URLWithString:funType.packageFileUrl.absoluteString]
                            toPath:path
                      withSHA1Hash:funType.packageFileHash];
  
}

#pragma mark - FTDownloaderDelegate methods

-(void)downloader:(FTDownloader *)downloader didFinishDownloadingUrlToPath:(NSString *)path {
  NSLog(@"Successfully downloaded to %@", path);
  
  // Unzip
  NSString *webRootPath = [NSString stringWithFormat:@"%@/%@_%@", self.funTypePath, _currentlyDownloadingFunType.funTypeId, _currentlyDownloadingFunType.packageFileHash];
  [SSZipArchive unzipFileAtPath:path toDestination:webRootPath];
  
  _currentlyDownloadingFunType = nil;
  
  if (_downloadCompletion) {
    _downloadCompletion(nil);
  }
  
}

-(void)downloader:(FTDownloader *)downloader didCompleteWithError:(NSError *)error {
  NSLog(@"Unable to download: %@", [error description]);
  
  if (_downloadCompletion) {
    _downloadCompletion(error);
  }
}

-(void)downloader:(FTDownloader *)downloader didDownloadProgress:(float)progress {
  NSLog(@"Download progress %f", progress);
  
  if (_downloadProgress) {
    _downloadProgress(progress);
  }
}



@end
