
package com.bengga.react.core;

import android.support.annotation.Nullable;
import android.util.Log;
import android.view.View;

import com.bengga.core.FunType;
import com.bengga.core.FunTypeType;
import com.bengga.react.events.FunTypeLoadedEvent;
import com.bengga.react.events.FunTypeNavigationFailedEvent;
import com.bengga.react.views.FunTypeView;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Map;

public class RNFunTypeViewManager extends SimpleViewManager<FunTypeView> {

  private final ReactApplicationContext reactContext;

  private interface TriggerCallback {
    void execute(FunTypeViewProtocol view);
  }

  public RNFunTypeViewManager(ReactApplicationContext reactContext) {
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNFunTypeViewManager";
  }

  @Override
  protected FunTypeView createViewInstance(ThemedReactContext reactContext) {
    FunTypeView view = new FunTypeView(reactContext);
    return view;
  }


  @Override
  public @Nullable Map<String, Object> getExportedCustomDirectEventTypeConstants() {
    Map<String, Object> export = super.getExportedCustomDirectEventTypeConstants();
    if (export == null) {
      export = MapBuilder.newHashMap();
    }
    export.put(FunTypeLoadedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onFunTypeViewDidLoad"));
    export.put(FunTypeNavigationFailedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onFunTypeViewError"));
    return export;
  }

  @ReactProp(name = "mode")
  public void setMode(FunTypeView view, @Nullable String value){
    view.mode = FunTypeMode.fromString(value);
    view.updateContent();
  }

  @ReactProp(name = "funType")
  public void setFunType(FunTypeView view, ReadableMap value){
    FunType funType = new FunType();
    funType.id = value.getString("id");
    funType.name = value.getString("name");
    funType.type = FunTypeType.values()[value.getInt("type")];
    try {
      funType.webUrl = new URL(value.getString("webUrl"));
    }
    catch(MalformedURLException e){
      Log.w(getName(), "Unable to parse webUrl: " + value.getString("webUrl"));
    }
    try {
      if (value.getString("packageFileUrl") != null) {
        funType.packageFileUrl = new URL(value.getString("packageFileUrl"));
      }
    }
    catch(MalformedURLException e){
      Log.w(getName(), "Unable to parse packageFileUrl: " + value.getString("packageFileUrl"));
    }
    funType.packageFileHash = value.getString("packageFileHash");
    view.funType = funType;
    view.updateContent();

  }

  @ReactMethod
  public void triggerViewCallbackWithTag(int tag, final String message, final String key, final ReadableMap value) {
    triggerViewCallback(tag, new TriggerCallback() {
      @Override
      public void execute(FunTypeViewProtocol view) {
        view.sendResult(message, key, value);
      }
    });
  }

  @ReactMethod
  public void triggerViewErrorCallbackWithTag(int tag, final String message, final ReadableMap value) {
    triggerViewCallback(tag, new TriggerCallback() {
      @Override
      public void execute(FunTypeViewProtocol view) {
        view.sendError(message, value);
      }
    });
  }

  private void triggerViewCallback(final int tag, final TriggerCallback callback) {
    UIManagerModule uiManager = this.reactContext.getNativeModule(UIManagerModule.class);
    uiManager.addUIBlock(new UIBlock() {
      @Override
      public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
        View view = nativeViewHierarchyManager.resolveView(tag);

        if (!(view instanceof FunTypeView)) {
          Log.w(getName(), "Expecting FunTypeView, got: " + view.getClass().getName());
        }
        else {
          Log.d(getName(), "triggerViewCallback tag = " + tag + ", view = " + view.getClass().getName());
          if (((FunTypeView) view).subView != null) {
            callback.execute(((FunTypeView) view).subView);
          }
        }
      }
    });
  }

}