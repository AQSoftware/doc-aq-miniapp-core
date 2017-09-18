//
//  FTDownloader.h
//  RNMiniAppCore
//
//  Created by Ryan Brozo on 15/09/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#ifndef FTDownloaderDelegate_h
#define FTDownloaderDelegate_h


#define FILE_LENGTH_UNKNOWN -1

extern NSString *const FTDownloaderErrorDomain;

@protocol FTDownloaderDelegate;

@interface FTDownloader : NSObject

@property (nonatomic, weak) id<FTDownloaderDelegate> delegate;

- (instancetype)initWithDelegate:(id<FTDownloaderDelegate>)delegate;

- (void) downloadFileFromUrl:(NSURL *)url toPath:(NSString *) path withSHA1Hash:(NSString *)hash;

@end


@protocol FTDownloaderDelegate <NSObject>

- (void)downloader:(FTDownloader *)downloader didFinishDownloadingUrlToPath:(NSString *)path;

- (void)downloader:(FTDownloader *)downloader didDownloadProgress:(float)progress;

- (void)downloader:(FTDownloader *)downloader didCompleteWithError:(NSError *)error;

@end

#endif
