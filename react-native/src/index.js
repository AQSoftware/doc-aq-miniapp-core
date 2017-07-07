//@flow

// import './shim.js';
import { NativeModules } from 'react-native';
import { LifeCycle } from './core/LifeCycle';
import { UIBridge } from './core/UIBridge';

export * from './core/CloudStorage';
export * from './core/MediaStorage';

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

export * from './components';
export { default as MiniApp } from './app/MiniApp';
