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
    void didFailNavigation(int errorCode, String description);
    void didReceiveHttpError(int code);
  }

  private FunTypeWebViewClientCallback _callback;
  private boolean _loaded;

  public FunTypeWebViewClient(FunTypeWebViewClientCallback callback) {
    this._callback = callback;
  }

  @Override
  public boolean shouldOverrideUrlLoading(WebView view, String url) {
    return false;
  }

  @Override
  public void onPageFinished(WebView view, String url) {
    // Don't fire onLoad event if page is loaded via <a href="#"/> links
    if(!_loaded && !url.substring(url.length() -1, url.length()).equals("#")) {
      this._callback.didLoad();
      _loaded = true;
    }
  }

  @Override
  public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
    this._callback.didFailNavigation(error);
  }

  @Override
  public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
    this._callback.didFailNavigation(errorCode, description);
  }

  @Override
  public void onReceivedHttpError(WebView view, WebResourceRequest request, WebResourceResponse errorResponse) {
    this._callback.didReceiveHttpError(errorResponse.getStatusCode());
  }
}
