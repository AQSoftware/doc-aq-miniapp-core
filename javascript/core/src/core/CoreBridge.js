// @flow
import { CallbackHelper, defaultCallbackHelper } from './CallbackHelper';

const MESSAGE_GET_FRIENDS = 'getFriends';
const MESSAGE_GET_BM_BALANCE = 'getBmBalance';
const MESSAGE_CREATE_BET = 'createBet';
const MESSAGE_CLAIM_BET = 'claimBet';
const MESSAGE_PAY = 'pay';

/**
Core class that allows a MiniApp to send/receive various core messages
to and from the AQ App

Copyright (c) 2017 AQ Software Inc.
*/
class CoreBridge {

  _callbackHelper: CallbackHelper;

  constructor(callbackHelper: CallbackHelper){
    this._callbackHelper = callbackHelper;
  }

  _saveCallbackAndProcessMessage(message: string,
                                callback: ?((value: any) => void) = null,
                                param: ?Object = null) {
    if (callback) {
      this._callbackHelper.setCoreCallback(message, callback);
    }
    this._callbackHelper.processMessage(message, null, param);
  }

  /**
  Requests the AQ App to return a list of friends without going through the friends selector UI.

  @param {Core~requestCallback} callback - Callback function to be called when
    with the list of friends as the parameter.
  */
  getFriends(callback: (value: Array<Object>) => void){
    this._saveCallbackAndProcessMessage(MESSAGE_GET_FRIENDS, callback);
  }

  /**
  Requests the AQ App to return a list of available Bengga Money balances.
  */
  getBmBalance(){
    return new Promise((resolve: (value: number) => void, reject) => {
      this._saveCallbackAndProcessMessage(MESSAGE_GET_BM_BALANCE, resolve);
    });
  }

  /**
  Requests the AQ App to create a bet for the current user
  */
  createBet(amount: number, tag: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this._saveCallbackAndProcessMessage(MESSAGE_CREATE_BET, resolve, {
        amount: amount,
        tag: tag
      });
    });
  }

  /**
  Requests the AQ App to create a bet for the current user
  */
  claimBet(userId: string, amount: string, tag: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._saveCallbackAndProcessMessage(MESSAGE_CLAIM_BET, resolve, {
        userId: userId,
        amount: amount,
        tag: tag
      });
    });
  }

  /**
  Requests the AQ App to pay another user
  */
  pay(userId: string, amount: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._saveCallbackAndProcessMessage(MESSAGE_PAY, resolve, {
        userId: userId,
        amount: amount
      });
    });
  }
}

const defaultCoreBridge = new CoreBridge(defaultCallbackHelper);
export { defaultCoreBridge };
