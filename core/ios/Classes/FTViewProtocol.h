//
//  FTViewProtocol.h
//  Pods
//
//  Created by Ryan Brozo on 11/03/2017.
//
//

#ifndef FTViewProtocol_h
#define FTViewProtocol_h

@protocol FTViewProtocolDelegate;

@protocol FTViewProtocol<NSObject>

@property (nonatomic, strong) FTFunType * _Nonnull funType;
//@property (nonatomic, weak) id<FTViewProtocolDelegate> _Nullable funTypeDelegate;

-(void)sendResultFromMessage:(NSString * _Nonnull)message key:(NSString *_Nonnull)key value:(id _Nullable)value;

@end


#endif /* FTViewProtocol_h */
