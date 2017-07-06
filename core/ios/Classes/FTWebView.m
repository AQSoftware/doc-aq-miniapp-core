//
//  FTWebView.m
//  Pods
//
//  Created by Ryan Brozo on 09/03/2017.
//
//

#import "FTWebView.h"
#import "FTViewProtocolDelegate.h"
#import "FTMessages.h"
#import <WebKit/WebKit.h>

@interface FTWebView() <WKScriptMessageHandler, WKNavigationDelegate, UIScrollViewDelegate>

@property (nonatomic, weak) IBOutlet UIActivityIndicatorView *activityIndicatorView;
@property (nonatomic, strong) UINib *nib;
@property (nonatomic, strong) WKWebView *webView;
@property (nonatomic, weak) id<FTViewProtocolDelegate> _Nullable funTypeDelegate;

@end

@implementation FTWebView

id<FTWebFunTypeProtocol> _webFunType;

+(instancetype _Nonnull) createInstanceWithFunTypeDelegate:(id<FTViewProtocolDelegate> _Nonnull)funTypeDelegate {
  static UINib *nib;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    nib = [UINib nibWithNibName:@"FTWebView" bundle:[NSBundle bundleWithIdentifier:@"com.bengga.funtype.core"]];
  });
  FTWebView *webView = [nib instantiateWithOwner:nil options:nil][0];
  [webView setupWithFunTypeDelegate:funTypeDelegate];
  return webView;
}

-(void)setupWithFunTypeDelegate:(id<FTViewProtocolDelegate> _Nonnull)funTypeDelegate {
  NSArray *const STANDARD_MESSAGES = @[
                                       MESSAGE_SHOW_GALLERY_IMAGE_SELECTOR,
                                       MESSAGE_SHOW_WEB_IMAGE_SELECTOR,
                                       MESSAGE_SHOW_TITLE_INPUT,
                                       MESSAGE_SHOW_FRIENDS_SELECTOR,
                                       MESSAGE_SHOW_PREVIEW_WITH_DATA,
                                       MESSAGE_JOIN,
                                       MESSAGE_END,
                                       MESSAGE_GET_FRIENDS,
                                       MESSAGE_PUBLISH_STATUS
                                       ];

  self.funTypeDelegate = funTypeDelegate;
  
  if (self.webView == nil){
    
    WKUserContentController *contentController = [[WKUserContentController alloc]init];
    
    // Add standard messages
    for (int i=0; i < [STANDARD_MESSAGES count]; i++){
      NSString *message = [STANDARD_MESSAGES objectAtIndex:i];
      [contentController addScriptMessageHandler:self name:message];
    }
    
    // Add messages to be handled
    for (int i=0; i < [self.webFunType.ft_webInfo.webKitMessages count]; i++){
      NSString *message = [STANDARD_MESSAGES objectAtIndex:i];
      [contentController addScriptMessageHandler:self name:message];
    }
    
    WKWebViewConfiguration *config = [[WKWebViewConfiguration alloc]init];
    config.userContentController = contentController;
    
    WKWebView *webView = [[WKWebView alloc]initWithFrame:CGRectZero configuration:config];
    
    // Setup webview layout and properties
    webView.navigationDelegate = self;
    [webView.scrollView setScrollEnabled:NO];
    webView.scrollView.delegate = self;
    
    [webView setTranslatesAutoresizingMaskIntoConstraints:NO];
    [self insertSubview:webView belowSubview:self.activityIndicatorView];
    
    NSDictionary *views = NSDictionaryOfVariableBindings(webView);
    NSArray *horizontalConstraints = [NSLayoutConstraint constraintsWithVisualFormat:@"H:|-0-[webView]-0-|" options:0 metrics:nil views:views];
    NSArray *verticalConstraints = [NSLayoutConstraint constraintsWithVisualFormat:@"V:|-0-[webView]-0-|" options:0 metrics:nil views:views];
    
    [self addConstraints:horizontalConstraints];
    [self addConstraints:verticalConstraints];
    
    // Initially hide the webview until content loads
    [webView setHidden:YES];
    
    self.webView = webView;
  }

}

-(void)setWebFunType:(id<FTWebFunTypeProtocol>)webFunType {
  _webFunType = webFunType;
  NSURLRequest *request = [NSURLRequest requestWithURL:webFunType.ft_webInfo.url];
  [self.webView loadRequest:request];
}

- (id<FTWebFunTypeProtocol>)webFunType {
  return _webFunType;
}


#pragma mark - FTViewProtocol methods
-(void)sendResultFromMessage:(NSString * _Nonnull)message key:(NSString *_Nonnull)key value:(id _Nullable)value {
  
  NSString *sanitizedValue = nil;
  BOOL shouldDecode = NO;
  if ([value isKindOfClass:[NSArray class]] || [value isKindOfClass:[NSDictionary class]]){
    
    NSError *error = nil;
    
    id result = [NSJSONSerialization dataWithJSONObject:value
                                                options:kNilOptions error:&error];
    if (error != nil) {
      NSLog(@"An error occurred while converting value to a valid json: %@", [error description]);
    }
    
    sanitizedValue = [NSString stringWithFormat:@"'%@'", [result base64EncodedStringWithOptions:0]];
    shouldDecode = YES;
    
  }
  else if ([value isKindOfClass:[NSString class]]){
    sanitizedValue = [NSString stringWithFormat:@"'%@'", value];
  }
  else if ([value isKindOfClass:[NSNumber class]]){
    sanitizedValue = [value stringValue];
  }
  else if (value == nil){
    sanitizedValue = @"null";
  }
  if (sanitizedValue){
    NSString *js = [NSString stringWithFormat:@"window.funTypeCallback('%@', '%@', %@, %@);", message, key, sanitizedValue, shouldDecode? @"true" : @"false"];
    [self.webView evaluateJavaScript:js completionHandler:^(id _Nullable obj, NSError * _Nullable error) {
      if (error != nil) {
        NSLog(@"An error occurred while calling callback: %@", [error description]);
      }
    }];
  }
}

#pragma mark - WKScriptMessageHandler methods

-(void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
  NSDictionary *dictionary = (NSDictionary *) message.body;
  
  if (self.funTypeDelegate != nil) {
    NSString *messageName = message.name;
    if ([messageName isEqualToString:MESSAGE_JOIN]){
      NSString *joinId = dictionary[@"id"];
      NSString *joinImageUrl = dictionary[@"joinImageUrl"];
      BOOL winCriteriaPassed = [dictionary[@"winCriteriaPassed"] boolValue];
      NSDictionary *notificationItem = dictionary[@"notificationItem"];

      [self.funTypeDelegate funTypeView:self didJoinWithId:joinId joinImageUrl:joinImageUrl winCriteriaPassed:winCriteriaPassed notificationItem:notificationItem];
    }
    else if ([messageName isEqualToString:MESSAGE_END]){
      [self.funTypeDelegate funTypeViewDidEnd:self];
    }
    else if ([messageName isEqualToString:MESSAGE_SHOW_PREVIEW_WITH_DATA]){
      NSString *title = dictionary[@"title"];
      NSString *coverImageUrl = dictionary[@"coverImageUrl"];
      [self.funTypeDelegate funTypeView:self didRequestShowPreviewWithTitle:title coverImageUrl:coverImageUrl data:dictionary];
    }
    else if ([messageName isEqualToString:MESSAGE_PUBLISH_STATUS]){
      BOOL status = [dictionary[@"status"] boolValue];
      [self.funTypeDelegate funTypeView:self didInformPublishStatus:status];
    }
    else if ([messageName isEqualToString:MESSAGE_GET_FRIENDS]){
      [self.funTypeDelegate funTypeView:self didRequestSelector:messageName withKey:MESSAGE_GET_FRIENDS data:nil];
    }
    else {
      NSString *key = dictionary[@"key"];
      NSDictionary *data = nil;

      if ([messageName isEqualToString:MESSAGE_SHOW_GALLERY_IMAGE_SELECTOR]){
        data = @{ @"title" : dictionary[@"title"] == nil ? @"" : dictionary[@"title"] };
      }
      else if ([messageName isEqualToString:MESSAGE_SHOW_WEB_IMAGE_SELECTOR]){
        data = @{
                 @"title" : dictionary[@"title"] == nil ? @"" : dictionary[@"title"],
                 @"imageUrls" : dictionary[@"imageUrls"] == nil ? @[] : dictionary[@"imageUrls"]
                 };
      }
      if (key != nil && messageName != nil) {
        [self.funTypeDelegate funTypeView:self didRequestSelector:messageName withKey:key data:data];
      }
    }
  }
}


#pragma mark - WKNavigationDelegate methods
-(void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation {
  // Unhide the webview upon loading
  [self.activityIndicatorView stopAnimating];
  [self.webView setHidden:NO];
  
  [self.webView evaluateJavaScript:@"document.body.style.webkitTouchCallout='none';" completionHandler:nil];
  [self.funTypeDelegate funTypeViewDidLoad:self];
}

-(void)webView:(WKWebView *)webView didFailNavigation:(WKNavigation *)navigation withError:(NSError *)error{
  if (self.funTypeDelegate != nil){
    [self.funTypeDelegate funTypeView:self didFailNavigationWithError:error];
  }
}

-(void)webView:(WKWebView *)webView didFailProvisionalNavigation:(WKNavigation *)navigation withError:(NSError *)error{
  if (self.funTypeDelegate != nil){
    [self.funTypeDelegate funTypeView:self didFailNavigationWithError:error];
  }
}

#pragma mark - UIScrollViewDelegate methods
-(UIView *) viewForZoomingInScrollView:(UIScrollView *)scrollView {
  return nil;
}


@end