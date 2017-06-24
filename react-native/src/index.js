//@flow

// import './shim.js';
import { NativeModules } from 'react-native';
import { LifeCycle } from './LifeCycle';
import { UIBridge } from './UIBridge';

// export * from './CloudStorage';
export * from './MediaStorage';

// export const defaultLifeCycle = NativeModules.RNMiniAppLifeCycleBridge;
// export const defaultUIBridge = NativeModules.RNMiniAppUIBridge;

let defaultLifeCycle = NativeModules.MiniAppLifeCycleBridge;
if (defaultLifeCycle === undefined){
  defaultLifeCycle = new LifeCycle();
}
export { defaultLifeCycle };

let defaultUIBridge = NativeModules.MiniAppUIBridge;
if (defaultUIBridge === undefined){
  defaultUIBridge = new UIBridge();
}
export { defaultUIBridge };
