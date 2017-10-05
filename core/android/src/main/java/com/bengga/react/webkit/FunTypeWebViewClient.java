package com.bengga.react.webkit;

import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * Created by ryanbrozo on 04/10/2017.
 */

public class FunTypeWebViewClient extends WebViewClient {

  public interface FunTypeWebViewClientCallback {
    void didLoad();
    void didFailNavigation(WebResourceError error);
    void didReceiveHttpError(int code);
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

  @Override
  public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
    this._callback.didFailNavigation(error);
  }

  @Override
  public void onReceivedHttpError(WebView view, WebResourceRequest request, WebResourceResponse errorResponse) {
    this._callback.didReceiveHttpError(errorResponse.getStatusCode());
  }
}
