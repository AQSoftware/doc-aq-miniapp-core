package com.bengga.react.webkit;

import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * Created by ryanbrozo on 04/10/2017.
 */

public class FunTypeWebViewClient extends WebViewClient {

  public interface FunTypeWebViewClientCallback {
    void didLoad();
  }

  private FunTypeWebViewClientCallback _callback;

  public FunTypeWebViewClient(FunTypeWebViewClientCallback callback) {
    this._callback = callback;
  }

  @Override
  public boolean shouldOverrideUrlLoading(WebView view, String url) {
    return false;
  }

  @Override
  public void onPageFinished(WebView view, String url) {
    this._callback.didLoad();
  }
}
