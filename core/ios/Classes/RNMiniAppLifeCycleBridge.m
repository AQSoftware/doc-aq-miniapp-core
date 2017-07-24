//
//  RNMiniAppLifeCycleBridge.m
//  RNMiniAppBridge
//
//  Created by Ryan Brozo on 21/06/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RNMiniAppLifeCycleBridge.h"

@interface RNMiniAppLifeCycleBridge()

@property (nonatomic, weak) id<FTViewProtocol> _Nullable funTypeView;
@property (nonatomic, weak) id<FTViewProtocolDelegate> _Nullable funTypeDelegate;


@end

@implementation RNMiniAppLifeCycleBridge

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


RCT_EXPORT_METHOD(showPreviewWithData:(NSString *)title
                  coverImageUrl:(NSString *)coverImageUrl
                  data:(id)data)
{
  if (self.funTypeDelegate && [data isKindOfClass:[NSDictionary class]]){
    [self.funTypeDelegate funTypeView:self.funTypeView didRequestShowPreviewWithTitle:title coverImageUrl:coverImageUrl data:data];
  }
}

RCT_EXPORT_METHOD(setAppData:(NSDictionary *)appData){
  if (self.funTypeDelegate && [appData isKindOfClass:[NSDictionary class]]){
    [self.funTypeDelegate funTypeView:self.funTypeView didSetAppData:appData];
  }
}

RCT_EXPORT_METHOD(join:(NSString *)joinId
                  joinImageUrl:(NSString *)joinImageUrl
                  winCriteriaPassed:(BOOL)winCriteriaPassed
                  notificationItem:(NSDictionary *)notificationItem)
{
  if (self.funTypeDelegate){
    [self.funTypeDelegate funTypeView:self.funTypeView
                        didJoinWithId:joinId
                         joinImageUrl:joinImageUrl
                    winCriteriaPassed:winCriteriaPassed
                     notificationItem:notificationItem];
  }
}

RCT_EXPORT_METHOD(end)
{
  if (self.funTypeDelegate) {
    [self.funTypeDelegate funTypeViewDidEnd:self.funTypeView];
  }
}


RCT_EXPORT_METHOD(publishSucceded)
{
  if (self.funTypeDelegate){
    [self.funTypeDelegate funTypeView:self.funTypeView didInformPublishStatus:YES];
  }
}

RCT_EXPORT_METHOD(publishFailed)
{
  if (self.funTypeDelegate){
    [self.funTypeDelegate funTypeView:self.funTypeView didInformPublishStatus:FALSE];
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
