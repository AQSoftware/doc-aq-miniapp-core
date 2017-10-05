package com.bengga.react.views;

import android.content.Context;
import android.util.AttributeSet;
import android.widget.RelativeLayout;

import com.bengga.react.core.FunTypeViewProtocol;
import com.facebook.react.bridge.ReadableMap;

/**
 * Created by ryanbrozo on 04/10/2017.
 */

public class NativeFunTypeView extends RelativeLayout implements FunTypeViewProtocol {

  public NativeFunTypeView(Context context) {
    super(context);
  }

  public NativeFunTypeView(Context context, AttributeSet attrs) {
    this(context, attrs, 0);
  }

  public NativeFunTypeView(Context context, AttributeSet attrs, int defStyle) {
    super(context, attrs, defStyle);
  }

  @Override
  public void sendResult(String message, String key, Object value) {

  }

  @Override
  public void sendError(String message, ReadableMap value) {

  }
}
