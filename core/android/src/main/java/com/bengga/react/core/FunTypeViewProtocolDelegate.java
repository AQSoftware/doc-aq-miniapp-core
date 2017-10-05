package com.bengga.react.core;

import com.facebook.react.bridge.WritableMap;

/**
 * Created by ryanbrozo on 04/10/2017.
 */

public interface FunTypeViewProtocolDelegate {
  void didLoad(FunTypeViewProtocol view);
  void didFailNavigation(FunTypeViewProtocol view, WritableMap error);
}
