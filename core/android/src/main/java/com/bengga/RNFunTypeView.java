package com.bengga;

import android.graphics.Color;
import android.view.View;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * Created by ryanbrozo on 03/10/2017.
 */

public class RNFunTypeView extends SimpleViewManager<View> {

  @Override
  public String getName() {
    return "RNFunTypeView";
  }

  @Override
  protected View createViewInstance(ThemedReactContext reactContext) {
    View view = new View(reactContext);
    view.setBackgroundColor(Color.parseColor("#00FFFF"));
    return view;
  }

  @ReactProp(name = "src", defaultFloat = 0f)
  public void setSrc(View view, float borderRadius) {
    //STUB!
  }
}
