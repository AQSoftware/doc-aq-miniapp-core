package com.bengga.react.events;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * Created by ryanbrozo on 05/10/2017.
 */

public class FunTypeNavigationFailedEvent extends Event<FunTypeNavigationFailedEvent> {

  public static String EVENT_NAME = "FunTypeNavigationFailed";

  private WritableMap _params;

  public FunTypeNavigationFailedEvent(int viewTag, WritableMap params) {
    super(viewTag);
    this._params = params;
  }

  @Override
  public String getEventName() {
    return EVENT_NAME;
  }

  @Override
  public void dispatch(RCTEventEmitter rctEventEmitter) {
    init(getViewTag());
    rctEventEmitter.receiveEvent(getViewTag(), getEventName(), _params);
  }
}