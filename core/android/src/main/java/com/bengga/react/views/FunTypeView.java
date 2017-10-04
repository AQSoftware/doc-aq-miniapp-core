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
import com.bengga.react.events.FunTypeLoadedEvent;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;

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

  private void emitEvent(){
//    ReactContext reactContext = (ReactContext)getContext();
//    reactContext.getJSModule(RCTEventEmitter.class).
  }

  //region FunTypeViewProtocolDelegate methods

  @Override
  public void didLoad(FunTypeViewProtocol view) {
    dispatchEvent(new FunTypeLoadedEvent(getId(), null));
  }

  //endregion


}
