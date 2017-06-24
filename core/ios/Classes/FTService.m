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


// UIBridge Messages
NSString *const MESSAGE_SHOW_GALLERY_IMAGE_SELECTOR = @"showGalleryImageSelector";
NSString *const MESSAGE_SHOW_WEB_IMAGE_SELECTOR = @"showWebImageSelector";
NSString *const MESSAGE_SHOW_TITLE_INPUT = @"showTitleInput";
NSString *const MESSAGE_SHOW_FRIENDS_SELECTOR = @"showFriendsSelector";

// CoreBridge Messages
NSString *const MESSAGE_GET_FRIENDS = @"getFriends";

// LifCycle Messages
NSString *const MESSAGE_SHOW_PREVIEW_WITH_DATA = @"showPreviewWithData";
NSString *const MESSAGE_JOIN = @"join";
NSString *const MESSAGE_END = @"end";
NSString *const MESSAGE_PUBLISH_STATUS = @"publishStatus";


@interface FTService() // <FTFunTypeWebControllerDelegate>

@end

@implementation FTService

NSMutableDictionary *_factory, *_createWebFunTypeControllers;


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
  }
  return self;
}


- (void) registerFunTypeWithId:(Id) funTypeId value:(id<FTNativeFunTypeProtocol>)value {
  [_factory setObject:value forKey:funTypeId];
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
          webUrl = [NSURL URLWithString:@"?action=create" relativeToURL:funType.webUrl];
          break;
        case kJoin:
          webUrl = [NSURL URLWithString:[NSString stringWithFormat:@"?action=join&id=%@", engagementId] relativeToURL:funType.webUrl];
          break;
          
        case kPreview:
          webUrl = [NSURL URLWithString:@"?action=preview" relativeToURL:funType.webUrl];
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

//- (void)triggerCallbackForFunTypeId:(NSString * _Nonnull)funTypeId withMessage:(NSString * _Nonnull)message key:(NSString *_Nonnull)key value:(id _Nonnull)value {
//  
//  FTFunTypeWebController *controller = _createWebFunTypeControllers[funTypeId];
//  if (controller != nil) {
//    [controller triggerJsCallbackWithMessage:message key:key value:value];
//  }
//}

//#pragma mark - FTFunTypeWebControllerDelegate methods
//
//-(void)webController:(FTFunTypeWebController *)webController didFailNavigationWithError:(NSError *)error {
//  if (self.delegate != nil){
//    if (_createWebFunTypeControllers[webController.webFunType.ft_webInfo.funTypeId] != nil){
//      [self.delegate funTypeService:self createDidFailWithError:error];
//    }
//  }
//}
//
//-(void)webController:(FTFunTypeWebController *)webController didRequestSelector:(NSString * _Nonnull)selector withKey:(NSString * _Nonnull)key {
//  if (self.delegate != nil){
//    if (_createWebFunTypeControllers[webController.webFunType.ft_webInfo.funTypeId] != nil){
//      [self.delegate funTypeService:self didRequestSelector:selector withKey:key];
//    }
//  }
//}
//
//-(void)webController:(FTFunTypeWebController * _Nonnull)webController didEndOutputWithCaption:(NSString * _Nonnull)caption imageUrl:(NSString * _Nonnull)imageUrl {
//  if (self.delegate != nil){
//    if (_createWebFunTypeControllers[webController.webFunType.ft_webInfo.funTypeId] != nil){
//      [self.delegate funTypeService:self didEndOutputWithCaption:caption imageUrl:imageUrl];
//    }
//  }
//}

@end
