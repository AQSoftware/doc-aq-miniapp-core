//
//  RNMiniAppUIBridge.m
//  RNMiniAppBridge
//
//  Created by Ryan Brozo on 21/06/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RNMiniAppUIBridge.h"
#import "FTMessages.h"

@interface RNMiniAppUIBridge()

@property (nonatomic, weak) id<FTViewProtocol> _Nullable funTypeView;
@property (nonatomic, weak) id<FTViewProtocolDelegate> _Nullable funTypeDelegate;

@end


@implementation RNMiniAppUIBridge

NSMutableDictionary *_callbacks;

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

- (instancetype _Nonnull)initWithFunTypeView:(id <FTViewProtocol> _Nonnull)funTypeView
                             funTypeDelegate:(id<FTViewProtocolDelegate> _Nonnull) funTypeDelegate {
  self = [super init];
  if (self){
    self.funTypeView = funTypeView;
    self.funTypeDelegate = funTypeDelegate;
    _callbacks = @{}.mutableCopy;
  }
  return self;
}

-(void)dealloc {
  [_callbacks removeAllObjects];
}

RCT_EXPORT_MODULE()


RCT_EXPORT_METHOD(showTitleInput:(RCTResponseSenderBlock)callback)
{
  if (self.funTypeDelegate){
    [_callbacks setObject:callback forKey:MESSAGE_SHOW_TITLE_INPUT];
    [self.funTypeDelegate funTypeView:self.funTypeView didRequestSelector:MESSAGE_SHOW_TITLE_INPUT withKey:@"default" data:nil];
  }
}

RCT_EXPORT_METHOD(showWebImageSelector:(NSString *_Nonnull)key
                  title:(NSString * _Nullable)title
                  imageUrls:(NSArray * _Nullable)imageUrls
                  callback:(RCTResponseSenderBlock)callback)
{
  if (self.funTypeDelegate){
    [_callbacks setObject:callback forKey:MESSAGE_SHOW_WEB_IMAGE_SELECTOR];
    
    NSDictionary *data = @{
             @"title" : title == nil ? @"" : title,
             @"imageUrls" : imageUrls == nil ? @[] : imageUrls
             };
    
    [self.funTypeDelegate funTypeView:self.funTypeView didRequestSelector:MESSAGE_SHOW_WEB_IMAGE_SELECTOR withKey:key data:data];
  }
}

RCT_EXPORT_METHOD(showGalleryImageSelector:(NSString *_Nonnull)key
                  title:(NSString * _Nullable)title
                  callback:(RCTResponseSenderBlock)callback)
{
  if (self.funTypeDelegate){
    [_callbacks setObject:callback forKey:MESSAGE_SHOW_GALLERY_IMAGE_SELECTOR];
    
    NSDictionary *data = @{
                           @"title" : title == nil ? @"" : title
                           };
    
    [self.funTypeDelegate funTypeView:self.funTypeView didRequestSelector:MESSAGE_SHOW_GALLERY_IMAGE_SELECTOR withKey:key data:data];
  }
}

RCT_EXPORT_METHOD(showFriendsSelector:(NSString *_Nonnull)key
                  callback:(RCTResponseSenderBlock)callback)
{
  if (self.funTypeDelegate){
    [_callbacks setObject:callback forKey:MESSAGE_SHOW_FRIENDS_SELECTOR];
    [self.funTypeDelegate funTypeView:self.funTypeView didRequestSelector:MESSAGE_SHOW_FRIENDS_SELECTOR withKey:key data:nil];
  }
}


-(void)sendResultFromMessage:(NSString * _Nonnull)message
                         key:(NSString *_Nonnull)key
                       value:(id _Nullable)value {
  
  RCTResponseSenderBlock callback = (RCTResponseSenderBlock)[_callbacks valueForKey:message];
  if (callback){
    callback(@[key, value]);
    
    // Remove callback
    [_callbacks removeObjectForKey:message];
  }
  
}


@end
