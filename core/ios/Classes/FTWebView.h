//
//  FTWebView.h
//  Pods
//
//  Created by Ryan Brozo on 09/03/2017.
//
//

#import <UIKit/UIKit.h>
#import "FTCommon.h"
#import "FTViewProtocol.h"

@interface FTWebView : UIView<FTViewProtocol>

@property (nonatomic, strong) FTFunType * _Nonnull funType;
@property (nonatomic, strong) id<FTWebFunTypeProtocol> _Nonnull webFunType;


+(instancetype _Nonnull) createInstanceWithFunTypeDelegate:(id<FTViewProtocolDelegate> _Nonnull)funTypeDelegate;
- (void) unSetup;
@end
