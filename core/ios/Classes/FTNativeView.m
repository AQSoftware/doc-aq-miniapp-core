//
//  FTNativeView.m
//  Pods
//
//  Created by Ryan Brozo on 14/06/2017.
//
//

#import "FTNativeView.h"
#import <React/RCTRootView.h>
#import <React/RCTBridge.h>
#import <React/RCTBridgeDelegate.h>
#import "RNMiniAppBridge.h"


@interface FTNativeView() <RCTBridgeDelegate>

@property (weak, nonatomic) IBOutlet UIImageView *splashImageView;
@property (weak, nonatomic) IBOutlet UIProgressView *progressView;
@property (nonatomic, strong) UINib *nib;
@property (nonatomic, strong) RCTRootView *reactRootView;
@property (nonatomic, strong) RNMiniAppBridge *miniAppBridge;
@property (nonatomic, weak) id<FTViewProtocolDelegate> _Nullable funTypeDelegate;

@end

@implementation FTNativeView


+(instancetype _Nonnull) createInstanceWithFunType:(FTFunType * _Nonnull)funType
                                              mode:(FTFunTypeMode)mode
                                      engagementId:(Id _Nullable)engagementId
                                   funTypeDelegate:(id<FTViewProtocolDelegate> _Nonnull)funTypeDelegate {
  static UINib *nib;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
//    nib = [UINib nibWithNibName:@"FTNativeView" bundle:[NSBundle bundleWithIdentifier:@"com.bengga.funtype.core"]];
    nib = [UINib nibWithNibName:@"FTNativeView" bundle:nil];
  });
  FTNativeView *nativeView = [nib instantiateWithOwner:nil options:nil][0];
  [nativeView setupWithFunType:funType mode:mode engagementId:engagementId funTypeDelegate:funTypeDelegate];
  return nativeView;
}


-(void)setupWithFunType:(FTFunType * _Nonnull)funType
                   mode:(FTFunTypeMode)mode
           engagementId:(Id _Nullable)engagementId
        funTypeDelegate:(id<FTViewProtocolDelegate> _Nonnull)funTypeDelegate{
  
  self.funType = funType;
  self.funTypeDelegate = funTypeDelegate;
  
  NSDictionary *initialProps;
  switch (mode) {
    case kCreate:
      initialProps = @{@"action": @(mode)};
      break;
    case kJoin:
      initialProps = @{@"action": @(mode), @"id": engagementId};
      break;
    case kPreview:
      initialProps = @{@"action": @(mode)};
      break;
  }
  
  void (^showNativeBundleWithURL)(NSURL *) = ^(NSURL *_Nonnull bundleUrl){
    
    RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:nil];
    RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                     moduleName:funType.name
                                              initialProperties:initialProps];
    
    
//    RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:bundleUrl
//                                                        moduleName:funType.name
//                                                 initialProperties:initialProps
//                                                     launchOptions:nil];
    self.reactRootView = rootView;
    
    // Setup webview layout and properties
    [rootView setTranslatesAutoresizingMaskIntoConstraints:NO];
    [self insertSubview:rootView belowSubview:self.splashImageView];
    
    NSDictionary *views = NSDictionaryOfVariableBindings(rootView);
    NSArray *horizontalConstraints = [NSLayoutConstraint constraintsWithVisualFormat:@"H:|-0-[rootView]-0-|" options:0 metrics:nil views:views];
    NSArray *verticalConstraints = [NSLayoutConstraint constraintsWithVisualFormat:@"V:|-0-[rootView]-0-|" options:0 metrics:nil views:views];
    
    [self addConstraints:horizontalConstraints];
    [self addConstraints:verticalConstraints];
    
    [rootView setHidden:NO];
    [self.splashImageView setHidden:YES];
    [self.progressView setHidden:YES];

  };
  
  
  // Check first if we have a valid cached bundle before downloading a new one
  NSURL *bundleURL = [self getCachedBundleForFunType:funType];
  
  if (bundleURL) {
    showNativeBundleWithURL(bundleURL);
  }
  else {
    [self downloadNativeFunType:funType completion:showNativeBundleWithURL];
  }
  
}

-(NSURL * _Nullable)getCachedBundleForFunType: (FTFunType *)funType {
  return funType.webUrl;
}

-(void)downloadNativeFunType:(FTFunType *)funType completion:(void (^ _Nonnull)(NSURL * _Nonnull))completion {
  
}


#pragma mark - FTViewProtocol methods

-(void)sendResultFromMessage:(NSString * _Nonnull)message key:(NSString *_Nonnull)key value:(id _Nullable)value {
  [self.miniAppBridge sendResultFromMessage:message
                                        key:key
                                      value:value];
}

#pragma mark - RCTBridgeDelegate methods

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
  return [self getCachedBundleForFunType:self.funType];
}

- (NSArray<id<RCTBridgeModule>> *)extraModulesForBridge:(RCTBridge *)bridge {
  
  self.miniAppBridge = [[RNMiniAppBridge alloc]init];
  return [self.miniAppBridge bridgeModulesWithFunTypeView:self funTypeDelegate:self.funTypeDelegate];
//  return @[];
}

@end
