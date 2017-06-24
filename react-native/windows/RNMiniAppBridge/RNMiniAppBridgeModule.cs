using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Com.Reactlibrary.RNMiniAppBridge
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNMiniAppBridgeModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNMiniAppBridgeModule"/>.
        /// </summary>
        internal RNMiniAppBridgeModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNMiniAppBridge";
            }
        }
    }
}
