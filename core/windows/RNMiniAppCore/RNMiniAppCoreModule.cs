using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Com.Reactlibrary.RNMiniAppCore
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNMiniAppCoreModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNMiniAppCoreModule"/>.
        /// </summary>
        internal RNMiniAppCoreModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNMiniAppCore";
            }
        }
    }
}
