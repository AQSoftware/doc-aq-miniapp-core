package com.bengga.react.events;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * Created by ryanbrozo on 04/10/2017.
 */

public class FunTypeDidReceiveMessageEvent extends Event<FunTypeDidReceiveMessageEvent> {

  public static String EVENT_NAME = "FunTypeDidReceiveMessage";

  private WritableMap _params;

  public FunTypeDidReceiveMessageEvent(int viewTag, WritableMap params) {
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
