//
//  FTNativeView.h
//  Pods
//
//  Created by Ryan Brozo on 14/06/2017.
//
//

#import <UIKit/UIKit.h>
#import "FTCommon.h"
#import "FTViewProtocol.h"


@interface FTNativeView : UIView<FTViewProtocol>

@property (nonatomic, strong) FTFunType * _Nonnull funType;


+(instancetype _Nonnull) createInstanceWithFunType:(FTFunType * _Nonnull)funType
                                              mode:(FTFunTypeMode)mode
                                      engagementId:(Id _Nullable)engagementId
                                   funTypeDelegate:(id<FTViewProtocolDelegate> _Nonnull)funTypeDelegate;

@end
