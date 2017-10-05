package com.bengga.react.views;

import android.content.Context;
import android.util.AttributeSet;
import android.util.Base64;
import android.util.Log;
import android.webkit.WebResourceError;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;

import com.bengga.react.core.FunTypeViewProtocol;
import com.bengga.react.core.FunTypeViewProtocolDelegate;
import com.bengga.react.webkit.FunTypeWebChromeClient;
import com.bengga.react.webkit.FunTypeWebViewClient;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.google.gson.Gson;

import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.Charset;

/**
 * Created by ryanbrozo on 04/10/2017.
 */

public class WebFunTypeView extends RelativeLayout implements FunTypeViewProtocol, FunTypeWebViewClient.FunTypeWebViewClientCallback {

  private ProgressBar _progressBar;
  private WebView _webView;
  private URL _url;
  private FunTypeViewProtocolDelegate _delegate;

  public WebFunTypeView(Context context, URL url, FunTypeViewProtocolDelegate delegate) {
    super(context);
    this._url = url;
    this._delegate = delegate;
    initView();
  }

  public WebFunTypeView(Context context, AttributeSet attrs) {
    this(context, attrs, 0);
    initView();
  }

  public WebFunTypeView(Context context, AttributeSet attrs, int defStyle) {
    super(context, attrs, defStyle);
    initView();
  }

  private void initView(){
    ProgressBar progressBar = new ProgressBar(getContext());
    progressBar.setIndeterminate(true);
    addView(progressBar);

    RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
    );
    layoutParams.addRule(RelativeLayout.CENTER_IN_PARENT, RelativeLayout.TRUE);
    progressBar.setLayoutParams(layoutParams);

    _progressBar = progressBar;

    WebView webView = new WebView(getContext());
    addView(webView);

    layoutParams = new RelativeLayout.LayoutParams(
        LayoutParams.MATCH_PARENT,
        LayoutParams.MATCH_PARENT
    );
    layoutParams.addRule(RelativeLayout.ALIGN_PARENT_START, RelativeLayout.TRUE);
    layoutParams.addRule(RelativeLayout.ALIGN_PARENT_END, RelativeLayout.TRUE);
    layoutParams.addRule(RelativeLayout.ALIGN_PARENT_LEFT, RelativeLayout.TRUE);
    layoutParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT, RelativeLayout.TRUE);
    layoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP, RelativeLayout.TRUE);
    layoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM, RelativeLayout.TRUE);
    webView.setLayoutParams(layoutParams);

    // Setup webview
    WebSettings webSettings = webView.getSettings();
    webSettings.setJavaScriptEnabled(true);

    webView.setWebViewClient(new FunTypeWebViewClient(this));
    webView.setWebChromeClient(new FunTypeWebChromeClient());

    webView.loadUrl(this._url.toString());

    _webView = webView;
  }

  private String toBase64(String input) {
    byte[] sanitizedBytes = input.getBytes(Charset.forName("UTF-8"));
    return Base64.encodeToString(sanitizedBytes, Base64.NO_WRAP);
  }

  private String sanitize(Object value){
    Gson gson = new Gson();
    if (value == null){
      return "null";
    }
    else if (value instanceof ReadableMap){
      return "'" + toBase64(gson.toJson(((ReadableMap) value).toHashMap())) + "'";
    }
    else if (value instanceof ReadableArray){
      return "'" + toBase64(gson.toJson(((ReadableArray) value).toArrayList())) + "'";
    }
    else {
      return "'" + value.toString() + "'";
    }
  }

  private boolean shouldDecode(Object value){
    return value instanceof ReadableMap || value instanceof ReadableArray;
  }

  private void sendToCallback(String jsCode){
    this._webView.loadUrl("javascript:" + jsCode);
  }


  //region FunTypeViewProtocol methods

  @Override
  public void sendResult(String message, String key, Object value) {
    String sanitizedValue = sanitize(value);
    Log.d(this.getClass().getPackage().getName(), "sendResult message=" + message + " key=" + key + " value=" + sanitizedValue);
    boolean shouldDecode = shouldDecode(value);
    String jsCode = "window.funTypeCallback('" + message + "', '" + key + "', " + sanitizedValue + ", " + Boolean.toString(shouldDecode) + ");";
    Log.d(this.getClass().getPackage().getName(), "jsCode = " + jsCode);
    sendToCallback(jsCode);
  }

  @Override
  public void sendError(String message, ReadableMap value) {

  }

  //endregion

  //region FunTypeWebViewClientCallback methods

  @Override
  public void didLoad() {
    this._delegate.didLoad(this);
  }

  @Override
  public void didFailNavigation(WebResourceError error) {
    WritableMap errorMap = new WritableNativeMap();
    switch (error.getErrorCode()){
      case WebViewClient.ERROR_TIMEOUT:
        errorMap.putString("error", "Timeout while accessing the fun type");
        break;
      case WebViewClient.ERROR_HOST_LOOKUP:
        errorMap.putString("error", "Server associated with the fun type cannot be accessed.");
        break;
      case WebViewClient.ERROR_CONNECT:
        errorMap.putString("error", "Failed to connect to the server");
        break;
      default:
        errorMap.putString("error", "Unable to load the fun type");
        break;
    }
    this._delegate.didFailNavigation(this, errorMap);
  }

  @Override
  public void didReceiveHttpError(int code) {
    WritableMap errorMap = new WritableNativeMap();
    switch (code){
      case HttpURLConnection.HTTP_NOT_FOUND:
        errorMap.putString("error", "URL associated with the fun type was not found.");
        break;
      default:
        errorMap.putString("error", "Unable to load the fun type");
        break;
    }
    this._delegate.didFailNavigation(this, errorMap);
  }

  //endregion
}
