
# react-native-mini-app-bridge

## Getting started

`$ npm install react-native-mini-app-bridge --save`

### Mostly automatic installation

`$ react-native link react-native-mini-app-bridge`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-mini-app-bridge` and add `RNMiniAppBridge.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNMiniAppBridge.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.bengga.RNMiniAppBridgePackage;` to the imports at the top of the file
  - Add `new RNMiniAppBridgePackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-mini-app-bridge'
  	project(':react-native-mini-app-bridge').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-mini-app-bridge/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-mini-app-bridge')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNMiniAppBridge.sln` in `node_modules/react-native-mini-app-bridge/windows/RNMiniAppBridge.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Com.Reactlibrary.RNMiniAppBridge;` to the usings at the top of the file
  - Add `new RNMiniAppBridgePackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNMiniAppBridge from 'react-native-mini-app-bridge';

// TODO: What to do with the module?
RNMiniAppBridge;
```
  