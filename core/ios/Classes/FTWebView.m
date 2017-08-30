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
#import "FTMacros.h"
#import <WebKit/WebKit.h>


@interface FTWebView() <WKScriptMessageHandler, WKNavigationDelegate, UIScrollViewDelegate>

@property (nonatomic, weak) IBOutlet UIActivityIndicatorView *activityIndicatorView;
@property (nonatomic, strong) UINib *nib;
@property (nonatomic, strong) WKWebView *webView;
@property (nonatomic, weak) id<FTViewProtocolDelegate> _Nullable funTypeDelegate;

@end

@implementation FTWebView

id<FTWebFunTypeProtocol> _webFunType;

NSArray *STANDARD_MESSAGES;


+(instancetype _Nonnull) createInstanceWithFunTypeDelegate:(id<FTViewProtocolDelegate> _Nonnull)funTypeDelegate {
    static UINib *nib;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        nib = [UINib nibWithNibName:@"FTWebView" bundle:[NSBundle bundleWithIdentifier:@"com.bengga.funtype.core"]];
    });
    NSArray *rootObjects = [nib instantiateWithOwner:nil options:nil];
    FTWebView *webView = rootObjects[0];
    rootObjects = nil;
    [webView setupWithFunTypeDelegate:funTypeDelegate];
    return webView;
}

-(void)dealloc {
    // Remove KVO Observer
    @try {
        [self.webView removeObserver:self forKeyPath:NSStringFromSelector(@selector(estimatedProgress))];
    }
    @catch (NSException * __unused exception) {}
}

-(WKWebViewConfiguration* _Nonnull)webConfigurationWithContenController:(WKUserContentController *)contentController {
    WKWebViewConfiguration *config = [[WKWebViewConfiguration alloc]init];
    
    config.applicationNameForUserAgent = @"Bengga";
    config.suppressesIncrementalRendering = YES;
    config.userContentController = contentController;
    config.allowsInlineMediaPlayback = YES;
    
    if(SYSTEM_VERSION_LESS_THAN(@"10.0")){
        config.requiresUserActionForMediaPlayback = NO;
    }
    else {
        config.mediaTypesRequiringUserActionForPlayback = WKAudiovisualMediaTypeNone;
    }
    
    
    return config;
}

- (void) unSetup
{
    // remove standard messages
    for (int i=0; i < [STANDARD_MESSAGES count]; i++){
        NSString *message = [STANDARD_MESSAGES objectAtIndex:i];
        [self.webView.configuration.userContentController removeScriptMessageHandlerForName:message];
    }
    
    // remove messages to be handled
    for (int i=0; i < [self.webFunType.ft_webInfo.webKitMessages count]; i++){
        NSString *message = [STANDARD_MESSAGES objectAtIndex:i];
        [self.webView.configuration.userContentController removeScriptMessageHandlerForName:message];
    }
}



-(void)setupWithFunTypeDelegate:(id<FTViewProtocolDelegate> _Nonnull)funTypeDelegate {
    
    STANDARD_MESSAGES = @[
                          MESSAGE_SHOW_GALLERY_IMAGE_SELECTOR,
                          MESSAGE_SHOW_WEB_IMAGE_SELECTOR,
                          MESSAGE_SHOW_TITLE_INPUT,
                          MESSAGE_SHOW_FRIENDS_SELECTOR,
                          MESSAGE_SET_APP_DATA,
                          MESSAGE_INFORM_READY,
                          MESSAGE_SHOW_PREVIEW_WITH_DATA,
                          MESSAGE_JOIN,
                          MESSAGE_START,
                          MESSAGE_END,
                          MESSAGE_GET_FRIENDS,
                          MESSAGE_GET_BM_BALANCE,
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
        
        WKWebView *webView = [[WKWebView alloc]initWithFrame:CGRectZero configuration:[self webConfigurationWithContenController:contentController]];
        
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
        
        // Add KVO Observer for estimatedProgress
        [webView addObserver:self
                  forKeyPath:NSStringFromSelector(@selector(estimatedProgress))
                     options:NSKeyValueObservingOptionNew
                     context:NULL];
        
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
        else if ([messageName isEqualToString:MESSAGE_GET_BM_BALANCE]){
            [self.funTypeDelegate funTypeView:self didRequestSelector:messageName withKey:MESSAGE_GET_BM_BALANCE data:nil];
        }
        else if ([messageName isEqualToString:MESSAGE_SET_APP_DATA]){
            id appData = dictionary[@"appData"];
            if (appData && [appData isKindOfClass:[NSDictionary class]]) {
                [self.funTypeDelegate funTypeView:self didSetAppData:appData];
            }
        }
        else if ([messageName isEqualToString:MESSAGE_INFORM_READY]){
            [self.funTypeDelegate funTypeViewDidInformReady:self];
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
            else {
                [self.funTypeDelegate funTypeView:self didReceiveMessage:messageName params:dictionary];
            }
            
        }
    }
}


#pragma mark - WKNavigationDelegate methods
-(void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation {
    // Unhide the webview upon loading
    NSLog(@"loaded %f", self.webView.estimatedProgress);
    [self.activityIndicatorView stopAnimating];
    [self.webView setHidden:NO];
    
    [self.webView evaluateJavaScript:@"document.body.style.webkitTouchCallout='none';" completionHandler:nil];
    [self.webView evaluateJavaScript:@"document.body.style.webkitUserSelect='none';" completionHandler:nil];
    [self.webView evaluateJavaScript:@"document.body.style.webkitTapHighlightColor='rgba(0,0,0,0)';" completionHandler:nil];
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

-(void)webViewWebContentProcessDidTerminate:(WKWebView *)webView {
    NSLog(@"Web view process terminated");
}

#pragma mark - UIScrollViewDelegate methods
-(UIView *) viewForZoomingInScrollView:(UIScrollView *)scrollView {
    return nil;
}

#pragma mark - Key Value Observing

-(void)observeValueForKeyPath:(NSString *)keyPath
                     ofObject:(id)object
                       change:(NSDictionary<NSKeyValueChangeKey,id> *)change
                      context:(void *)context {
    
    if ([keyPath isEqualToString:NSStringFromSelector(@selector(estimatedProgress))] && object == self.webView) {
        NSLog(@"progress %f", self.webView.estimatedProgress);
        // estimatedProgress is a value from 0.0 to 1.0
        // Update your UI here accordingly
    }
    else {
        // Make sure to call the superclass's implementation in the else block in case it is also implementing KVO
        [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
    }
    
}
@end
