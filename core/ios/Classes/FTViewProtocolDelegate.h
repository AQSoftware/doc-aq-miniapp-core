//
//  FTViewProtocolDelegate.h
//  Pods
//
//  Created by Ryan Brozo on 11/03/2017.
//
//

#ifndef FTViewProtocolDelegate_h
#define FTViewProtocolDelegate_h

#import "FTViewProtocol.h"

@protocol FTViewProtocolDelegate <NSObject>

-(void)funTypeViewDidLoad:(id<FTViewProtocol> _Nonnull)funTypeView;
-(void)funTypeView:(id<FTViewProtocol> _Nonnull)funTypeView didFailNavigationWithError:(NSError * _Nonnull)error;
-(void)funTypeView:(id<FTViewProtocol> _Nonnull)funTypeView didRequestSelector:(NSString * _Nonnull)selector
           withKey:(NSString * _Nonnull)key
              data:(NSDictionary * _Nullable)data;
-(void)funTypeViewDidRequestPreviewData:(id<FTViewProtocol> _Nonnull)funTypeView;
-(void)funTypeView:(id<FTViewProtocol> _Nonnull)funTypeView didJoinWithId:(NSString * _Nullable)joinId joinImageUrl:(NSString * _Nonnull)joinImageUrl winCriteriaPassed:(BOOL)winCriteriaPassed notificationItem:(NSDictionary * _Nullable)notificationItem;
-(void)funTypeViewDidEnd:(id<FTViewProtocol> _Nonnull)funTypeView;
-(void)funTypeView:(id<FTViewProtocol> _Nonnull)funTypeView didRequestShowPreviewWithTitle:(NSString * _Nonnull)title
     coverImageUrl:(NSString * _Nonnull)coverImageUrl data:(NSDictionary *_Nullable)data;
-(void)funTypeView:(id<FTViewProtocol> _Nonnull)funTypeView didInformPublishStatus:(BOOL)status;

@end


#endif /* FTViewProtocolDelegate_h */
