package com.bengga.react.core;

import com.facebook.react.bridge.ReadableMap;

/**
 * Created by ryanbrozo on 04/10/2017.
 */

public interface FunTypeViewProtocol {

  void sendResult(String message, String key, Object value);
  void sendError(String message, ReadableMap value);
}
