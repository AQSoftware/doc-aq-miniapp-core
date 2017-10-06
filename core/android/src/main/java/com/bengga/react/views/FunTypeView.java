package com.bengga.react.views;


import android.content.Context;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;
import android.widget.RelativeLayout;

import com.bengga.core.FunType;
import com.bengga.react.core.FunTypeMode;
import com.bengga.react.core.FunTypeService;
import com.bengga.react.core.FunTypeViewProtocol;
import com.bengga.react.core.FunTypeViewProtocolDelegate;
import com.bengga.react.events.FunTypeDidEndEvent;
import com.bengga.react.events.FunTypeDidInformPublishStatusEvent;
import com.bengga.react.events.FunTypeDidInformReadyEvent;
import com.bengga.react.events.FunTypeDidJoinEvent;
import com.bengga.react.events.FunTypeDidLoadEvent;
import com.bengga.react.events.FunTypeDidReceiveMessageEvent;
import com.bengga.react.events.FunTypeDidRequestSelectorEvent;
import com.bengga.react.events.FunTypeDidRequestShowPreviewEvent;
import com.bengga.react.events.FunTypeDidSetAppDataEvent;
import com.bengga.react.events.FunTypeNavigationFailedEvent;
import com.bengga.react.events.FunTypeOnLoadProgressEvent;
import com.bengga.react.util.JSONHelper;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.remobile.cordova.JsonConvert;

import org.json.JSONObject;

import java.net.URL;

public class FunTypeView extends RelativeLayout implements FunTypeViewProtocolDelegate {

  public FunType funType;
  public FunTypeMode mode;
  public String engagementId;

  public FunTypeViewProtocol subView;

  public FunTypeView(Context context) {
    super(context);
  }

  public FunTypeView(Context context, AttributeSet attrs) {
    super(context, attrs);
  }

  public FunTypeView(Context context, AttributeSet attrs, int defStyleAttr) {
    super(context, attrs, defStyleAttr);
  }

  private void setSubView(View view) {
    if (!(view instanceof FunTypeViewProtocol)) {
      Log.w(this.getClass().getName(), "Supplied subview does not conform to FunTypeViewProtocol.");
    }
    else {
      if (this.subView != null){
        removeView((View)this.subView);
      }
      this.subView = (FunTypeViewProtocol) view;

      RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(
          LayoutParams.MATCH_PARENT,
          LayoutParams.MATCH_PARENT
      );
      layoutParams.addRule(RelativeLayout.ALIGN_PARENT_START, RelativeLayout.TRUE);
      layoutParams.addRule(RelativeLayout.ALIGN_PARENT_END, RelativeLayout.TRUE);
      layoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP, RelativeLayout.TRUE);
      layoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM, RelativeLayout.TRUE);
      view.setLayoutParams(layoutParams);
      addView(view);
    }
  }

  public void updateContent() {
    if (this.funType != null) {
      FunTypeService funTypeService = FunTypeService.getInstance();

      switch (funTypeService.isFunTypeDownloaded(this.funType)) {
        case ONLINE:
        case IN_APP_DOWNLOADED:
          View view = funTypeService.createFunTypeView(getContext(), this.funType, this.mode, this.engagementId, this);
          setSubView(view);
          break;
        case IN_APP_NOT_DOWNLOADED:
          break;
      }
    }
  }

  protected void dispatchEvent(Event event) {
    ReactContext reactContext = (ReactContext) getContext();
    EventDispatcher eventDispatcher =
        reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
    eventDispatcher.dispatchEvent(event);
  }

  //region FunTypeViewProtocolDelegate methods

  @Override
  public void didLoad(FunTypeViewProtocol view) {
    dispatchEvent(new FunTypeDidLoadEvent(getId(), null));
  }

  @Override
  public void didFailNavigation(FunTypeViewProtocol view, WritableMap error) {
    dispatchEvent(new FunTypeNavigationFailedEvent(getId(), error));
  }

  @Override
  public void didJoin(FunTypeViewProtocol view, String id, String imageUrl, boolean winCriteriaPassed, JSONObject notificationItem) {
    WritableMap params = new WritableNativeMap();
    params.putString("joinImageUrl", imageUrl);
    params.putBoolean("winCriteriaPassed", winCriteriaPassed);

    if (id != null){
      params.putString("id", id);
    }
    if (notificationItem != null){
      WritableMap notificationItemMap = JSONHelper.toWritableMap(notificationItem);
      if (notificationItemMap != null) {
        params.putMap("notificationItem", notificationItemMap);
      }
    }
    dispatchEvent(new FunTypeDidJoinEvent(getId(), params));
  }

  @Override
  public void didEnd(FunTypeViewProtocol view) {
    dispatchEvent(new FunTypeDidEndEvent(getId(), null));
  }

  @Override
  public void didRequestShowPreview(FunTypeViewProtocol view, String title, String coverImageUrl, JSONObject data) {
    WritableMap params = new WritableNativeMap();
    params.putString("title", title);
    params.putString("coverImageUrl", coverImageUrl);
    if (data != null){
      params.putMap("data", JSONHelper.toWritableMap(data));
    }
    else {
      params.putNull("data");
    }
    dispatchEvent(new FunTypeDidRequestShowPreviewEvent(getId(), null));
  }

  @Override
  public void didInformPublishStatus(FunTypeViewProtocol view, Boolean status) {
    WritableMap params = new WritableNativeMap();
    params.putBoolean("status", status);
    dispatchEvent(new FunTypeDidInformPublishStatusEvent(getId(), params));
  }

  @Override
  public void didRequestSelector(FunTypeViewProtocol view, String selector, String key, JSONObject data) {
    WritableMap params = new WritableNativeMap();
    params.putString("selector", selector);
    params.putString("key", key);
    if (data != null){
      params.putMap("data", JSONHelper.toWritableMap(data));
    }
    else {
      params.putNull("data");
    }
    dispatchEvent(new FunTypeDidRequestSelectorEvent(getId(), params));
  }

  @Override
  public void didSetAppData(FunTypeViewProtocol view, JSONObject data) {
    WritableMap params = new WritableNativeMap();
    params.putMap("appData", JSONHelper.toWritableMap(data));
    dispatchEvent(new FunTypeDidSetAppDataEvent(getId(), params));
  }

  @Override
  public void didInformReady(FunTypeViewProtocol view) {
    dispatchEvent(new FunTypeDidInformReadyEvent(getId(), null));
  }

  @Override
  public void didReceiveMesssage(FunTypeViewProtocol view, String message, JSONObject params) {
    WritableMap eventParams = new WritableNativeMap();
    eventParams.putString("message", message);
    if (params != null){
      eventParams.putMap("params", JSONHelper.toWritableMap(params));
    }
    else {
      eventParams.putNull("params");
    }
    dispatchEvent(new FunTypeDidReceiveMessageEvent(getId(), eventParams));
  }

  @Override
  public void loadProgress(FunTypeViewProtocol view, double progress) {
    WritableMap eventParams = new WritableNativeMap();
    eventParams.putDouble("progress", progress);
    dispatchEvent(new FunTypeOnLoadProgressEvent(getId(), eventParams));
  }

  //endregion


}
