package com.bengga.react.webkit;

import android.webkit.JsPromptResult;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebView;

/**
 * Created by ryanbrozo on 04/10/2017.
 */

public class FunTypeWebChromeClient extends WebChromeClient {

  public interface FunTypeWebChromeClientCallback {
    void onProgress(double progress);
  }

  private FunTypeWebChromeClientCallback _callback;

  public FunTypeWebChromeClient(FunTypeWebChromeClientCallback callback) {
    this._callback = callback;
  }

  @Override
  public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
    result.cancel();
    return true;
  }

  @Override
  public boolean onJsConfirm(WebView view, String url, String message, JsResult result) {
    result.cancel();
    return true;
  }

  @Override
  public boolean onJsPrompt(WebView view, String url, String message, String defaultValue, JsPromptResult result) {
    result.cancel();
    return true;
  }

  @Override
  public void onProgressChanged(WebView view, int newProgress) {
    this._callback.onProgress(newProgress / 100.0);
  }
}
