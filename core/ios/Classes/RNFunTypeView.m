//
//  RNFunTypeView.m
//  RNFunType
//
//  Created by Ryan Brozo on 10/03/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RNFunTypeView.h"
#import <RNMiniAppCore/RNMiniAppCore.h>

@interface RNFunTypeView() <FTViewProtocolDelegate>

@end
@implementation RNFunTypeView

__strong UIView *_subView;

-(void)setSubView:(UIView *)subView {
  if (![subView conformsToProtocol:@protocol(FTViewProtocol)]) {
    NSException* exception = [NSException
                              exceptionWithName:@"ViewDoesNotConformToProtocol"
                              reason:@"Supplied subview does not conform to FTViewProtocol."
                              userInfo:nil];
    @throw exception;
    
  }
  else {
//    // Add self as funTypeDelegate of this subView
//    [(id<FTViewProtocol>)subView setFunTypeDelegate:self];
    
    // Remove all subviews first
    for (int i=0; i<[[self subviews]count]; i++){
      UIView *view = self.subviews[i];
      [view removeFromSuperview];
    }
    
    // Add as subview
    [self addSubview:subView];
    subView.frame = self.bounds;
    
    // Setup autolayout constraints to fill the parent
    NSDictionary *views = NSDictionaryOfVariableBindings(subView);
    NSArray *horizontalConstraints = [NSLayoutConstraint constraintsWithVisualFormat:@"H:|-0-[subView]-0-|" options:0 metrics:nil views:views];
    NSArray *verticalConstraints = [NSLayoutConstraint constraintsWithVisualFormat:@"V:|-0-[subView]-0-|" options:0 metrics:nil views:views];
    
    [self addConstraints:horizontalConstraints];
    [self addConstraints:verticalConstraints];
    
    //    _subView = subView;
  }
}

- (UIView *)subView {
  
  if ([self.subviews count] > 0) {
    return self.subviews[0];
  }
  else return nil;
}

- (void)updateContent {
  
  if (self.funType != nil && self.mode != nil) {
    
    FTFunTypeMode mode;
    if ([self.mode isEqualToString:@"join"]) {
      mode = kJoin;
    }
    else if ([self.mode isEqualToString:@"preview"]) {
      mode = kPreview;
    }
    else {
      mode = kCreate;
    }
    
    UIView *subView = [[FTService sharedInstance] createFunTypeView:self.funType
                                                           withMode:mode
                                                       engagementId:self.engagementId
                       funTypeDelegate:self];
    [self setSubView:subView];
    
  }
  
}

- (UIView *)view {
  return [[RNFunTypeView alloc]init];
}

#pragma mark - FTViewProtocolDelegate methods

- (void)funTypeViewDidLoad:(id<FTViewProtocol> _Nonnull)funTypeView {
  self.onFunTypeViewDidLoad(nil);
}

- (void)funTypeView:(id<FTViewProtocol>)funTypeView didFailNavigationWithError:(NSError *)error {
  
  if (error.code  == -1001) { // Time out
    self.onFunTypeViewError(@{@"error": [NSString stringWithFormat:@"Timeout while accessing the %@ fun type.", funTypeView.funType.name]});
  }
  else if (error.code  == -1003) { // Server cannot be found
    self.onFunTypeViewError(@{@"error": [NSString stringWithFormat:@"Server associated with the %@ fun type cannot be accessed.", funTypeView.funType.name]});
  }
  else if (error.code  == -1100) { // URL not found on server (404)
    self.onFunTypeViewError(@{@"error": [NSString stringWithFormat:@"URL associated with the %@ fun type was not found.", funTypeView.funType.name]});
  }
  else {
    self.onFunTypeViewError(@{@"error": [NSString stringWithFormat:@"Unable to load the %@ fun type.", funTypeView.funType.name]});
  }
}

- (void)funTypeView:(id<FTViewProtocol>)funTypeView didRequestSelector:(NSString *)selector withKey:(NSString *)key data:(NSDictionary *)data {
  NSMutableDictionary *params = @{
                                  @"selector": selector,
                                  @"key" : key
                                  }.mutableCopy;
  if (data){
    [params setObject:data forKey:@"data"];
  }
  self.onRequestSelector(params);
}

- (void)funTypeView:(id<FTViewProtocol>)funTypeView didRequestShowPreviewWithTitle:(NSString *)title coverImageUrl:(NSString *)coverImageUrl data:(NSDictionary *)data {
  self.onRequestShowPreviewWithData(@{
                                  @"title" : title,
                                  @"coverImageUrl": coverImageUrl,
                                  @"data": data
                                  });
}

- (void)funTypeViewDidRequestPreviewData:(id<FTViewProtocol>)funTypeView {
  self.onRequestPreviewData(nil);
}

-(void)funTypeView:(id<FTViewProtocol> _Nonnull)funTypeView didInformPublishStatus:(BOOL)status {
  self.onPublishStatus(@{
                         @"status": @(status)
                         });
}

-(void)funTypeView:(id<FTViewProtocol>)funTypeView didSetAppData:(NSDictionary * _Nonnull)appData {
    self.onSetAppData(@{
                        @"appData": appData
                        });
}

-(void)funTypeView:(id<FTViewProtocol> _Nonnull)funTypeView didJoinWithId:(NSString * _Nullable)joinId joinImageUrl:(NSString * _Nonnull)joinImageUrl winCriteriaPassed:(BOOL)winCriteriaPassed notificationItem:(NSDictionary * _Nullable)notificationItem {
  NSMutableDictionary *params = @{
                                  @"joinImageUrl": joinImageUrl,
                                  @"winCriteriaPassed": @(winCriteriaPassed)
                                  }.mutableCopy;
  if (joinId) {
    [params setObject:joinId forKey:@"id"];
  }
  if (notificationItem) {
    [params setObject:notificationItem forKey:@"notificationItem"];
  }
  self.onJoin(params);
  
}

-(void)funTypeViewDidEnd:(id<FTViewProtocol>)funTypeView {
  self.onEnd(nil);
}



@end
