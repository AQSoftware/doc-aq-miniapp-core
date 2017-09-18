//
//  FTDownloader.m
//  RNMiniAppCore
//
//  Created by Ryan Brozo on 15/09/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "FTDownloader.h"
#include <CoreFoundation/CoreFoundation.h>
#include <CommonCrypto/CommonDigest.h>

#define FileHashDefaultChunkSizeForReadingData 4096

NSString *const FTDownloaderErrorDomain = @"FTDownloaderErrorDomain";


@interface FTDownloader()<NSURLSessionDownloadDelegate, NSURLSessionDataDelegate, NSStreamDelegate>

@property (nonatomic, strong) NSString * downloadPath;
@property (nonatomic, strong) NSURL * url;
@property (nonatomic, strong) NSString * fileHash;

@end

@implementation FTDownloader

CC_SHA1_CTX hashObject;
NSURL *tmpUrl;
NSInputStream *iStream;
NSURLSession *_defaultSession;

- (instancetype)initWithDelegate:(id<FTDownloaderDelegate>)delegate {
  self = [[FTDownloader alloc]init];
  if (self) {
    self.delegate = delegate;
    
    
    //  NSURLSessionConfiguration *defaultConfiguration = [NSURLSessionConfiguration defaultSessionConfiguration];
    NSURLSessionConfiguration *defaultConfiguration = [NSURLSessionConfiguration backgroundSessionConfigurationWithIdentifier: @"FTDownloader"];
    
    NSString *cachesDirectory = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES).firstObject;
    NSString *cachePath = [cachesDirectory stringByAppendingPathComponent:@"FTDownloader"];
    
    NSURLCache *cache = [[NSURLCache alloc] initWithMemoryCapacity:16384 diskCapacity:268435456 diskPath:cachePath];
    defaultConfiguration.URLCache = cache;
    defaultConfiguration.requestCachePolicy = NSURLRequestUseProtocolCachePolicy;
    
    NSOperationQueue *operationQueue = [NSOperationQueue mainQueue];
    
    _defaultSession = [NSURLSession sessionWithConfiguration:defaultConfiguration delegate:self delegateQueue:operationQueue];
    
  }
  return self;
}

- (void) downloadFileFromUrl:(NSURL *)url toPath:(NSString *) path withSHA1Hash:(NSString *)hash; {
  
  self.downloadPath = path;
  self.url = url;
  self.fileHash = hash;
  
  
  NSURLSessionDownloadTask *downloadTask = [_defaultSession downloadTaskWithURL:url];
  [downloadTask resume];
  
}

-(void)checkFileHash {
  
  CC_SHA1_Init(&hashObject);
  
  // Read file as stream
  iStream = [[NSInputStream alloc]initWithFileAtPath:self.downloadPath];
  iStream.delegate = self;
  [iStream scheduleInRunLoop:[NSRunLoop mainRunLoop] forMode:NSDefaultRunLoopMode];
  [iStream open];
  
}

-(void)removeFileAtDestination {
  [[NSFileManager defaultManager] removeItemAtPath:self.downloadPath error:nil];
}

-(void)copyFromUrl:(NSURL *)url toDestinationWithError:(NSError **)error {
  // Copy temp file download to filePath specified
  NSURL *destUrl = [NSURL fileURLWithPath:self.downloadPath];
  // Remove file, if present
  [self removeFileAtDestination];
  [[NSFileManager defaultManager] copyItemAtURL:url toURL:destUrl error:error];
  
}

#pragma mark NSStreamDelegate methods

-(void)stream:(NSStream *)aStream handleEvent:(NSStreamEvent)eventCode {
  switch (eventCode) {
    case NSStreamEventHasBytesAvailable: {
      uint8_t buf[FileHashDefaultChunkSizeForReadingData];
      NSInteger len = [(NSInputStream *)aStream read:buf maxLength:FileHashDefaultChunkSizeForReadingData];
      if (len) {
        CC_SHA1_Update(&hashObject, (const void *)buf, (CC_LONG)len);
      }
    }
      break;
    case NSStreamEventEndEncountered: {
      
      // Compute the hash digest
      unsigned char digest[CC_SHA1_DIGEST_LENGTH];
      CC_SHA1_Final(digest, &hashObject);
      
      NSMutableString* output = [NSMutableString stringWithCapacity:CC_SHA1_DIGEST_LENGTH * 2];
      
      for(int i = 0; i < CC_SHA1_DIGEST_LENGTH; i++)
        [output appendFormat:@"%02x", digest[i]];
      
      if ([[output lowercaseString] isEqualToString:self.fileHash]) {
        [self.delegate downloader:self didFinishDownloadingUrlToPath:self.downloadPath];
      }
      else if ([self.delegate respondsToSelector:@selector(downloader:didCompleteWithError:)]) {
        
        [self removeFileAtDestination];
        
        NSError *error = [NSError errorWithDomain:FTDownloaderErrorDomain
                                             code:-1
                                         userInfo:@{
                                                    NSLocalizedDescriptionKey : @"Downloaded file's hash did not match the provided hash",
                                                    NSLocalizedFailureReasonErrorKey: [NSString stringWithFormat:@"%@ did not match %@", output, self.fileHash]
                                                    }];
        
        [self.delegate downloader:self didCompleteWithError:error];
      }
      
      [aStream close];
      [aStream removeFromRunLoop:[NSRunLoop mainRunLoop] forMode:NSDefaultRunLoopMode];
      aStream = nil;
    }
      break;
    default:
      break;
  }
}


#pragma mark NSURLSessionDelegate methods

-(void)URLSession:(NSURLSession *)session downloadTask:(NSURLSessionDownloadTask *)downloadTask didFinishDownloadingToURL:(NSURL *)location {
  NSError *error;
  [self copyFromUrl:location toDestinationWithError:&error];
  
  if (error) {
    NSLog(@"Unable to download %@: %@", self.url.absoluteURL, [error description]);
    if ([self.delegate respondsToSelector:@selector(downloader:didCompleteWithError:)]) {
      [self.delegate downloader:self didCompleteWithError:error];
    }
  }
  else if ([self.delegate respondsToSelector:@selector(downloader:didFinishDownloadingUrlToPath:)]) {
    [self checkFileHash];
  }
  
}

-(void)URLSession:(NSURLSession *)session downloadTask:(nonnull NSURLSessionDownloadTask *)downloadTask didWriteData:(int64_t)bytesWritten totalBytesWritten:(int64_t)totalBytesWritten totalBytesExpectedToWrite:(int64_t)totalBytesExpectedToWrite {
  
  if ([self.delegate respondsToSelector:@selector(downloader:didDownloadProgress:)]) {
    
    float progress = FILE_LENGTH_UNKNOWN;
    
    if (totalBytesExpectedToWrite != NSURLSessionTransferSizeUnknown) {
      progress = (float)totalBytesWritten / totalBytesExpectedToWrite;
    }
    [self.delegate downloader:self didDownloadProgress:progress];
  }
}

-(void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task didCompleteWithError:(NSError *)error {
  if (error && [self.delegate respondsToSelector:@selector(downloader:didCompleteWithError:)]) {
    [self.delegate downloader:self didCompleteWithError:error];
  }
}

@end
