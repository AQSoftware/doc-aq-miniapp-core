package com.bengga.react.views;

import android.content.Context;
import android.os.Build;
import android.util.AttributeSet;
import android.util.Base64;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceError;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;

import com.bengga.react.core.FunTypeViewProtocol;
import com.bengga.react.core.FunTypeViewProtocolDelegate;
import com.bengga.react.core.Messages;
import com.bengga.react.util.JSONHelper;
import com.bengga.react.webkit.FunTypeWebChromeClient;
import com.bengga.react.webkit.FunTypeWebViewClient;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.Charset;

/**
 * Created by ryanbrozo on 04/10/2017.
 */

public class WebFunTypeView extends RelativeLayout
    implements FunTypeViewProtocol, FunTypeWebViewClient.FunTypeWebViewClientCallback, FunTypeWebChromeClient.FunTypeWebChromeClientCallback {

  private class FunTypeJsInterface {
    private FunTypeViewProtocolDelegate _delegate;

    FunTypeJsInterface(FunTypeViewProtocolDelegate delegate) {
      this._delegate = delegate;
    }

    @JavascriptInterface
    public void postMessage(String message, String params, boolean shouldDecode){
//      Log.d(this.getClass().getPackage().getName(), "postMessage message=" + message + ", params=" + params + ", shouldDecode=" + Boolean.toString(shouldDecode));

      if (this._delegate != null && Messages.isValid(message)){
        JSONObject json;
        JSONHelper jsonParams;

        try {
          json = new JSONObject(params);
          jsonParams = new JSONHelper(json);
          switch (Messages.valueFor(message)){
            case MESSAGE_JOIN:
              String joinId = jsonParams.getString("id");
              String joinImageUrl = jsonParams.getString("joinImageUrl");
              boolean winCriteriaPassed = jsonParams.getBoolean("winCriteriaPassed");
              JSONObject notificationItem = jsonParams.getJSONObject("notificationItem");

              this._delegate.didJoin(_funTypeView, joinId, joinImageUrl, winCriteriaPassed, notificationItem);
              break;
            case MESSAGE_END:
              this._delegate.didEnd(_funTypeView);
              break;
            case MESSAGE_SHOW_PREVIEW_WITH_DATA:
              String title = jsonParams.getString("title");
              String coverImageUrl = jsonParams.getString("coverImageUrl");
              this._delegate.didRequestShowPreview(_funTypeView, title, coverImageUrl, json);
              break;
            case MESSAGE_PUBLISH_STATUS:
              boolean status = jsonParams.getBoolean("status");
              this._delegate.didInformPublishStatus(_funTypeView, status);
              break;
            case MESSAGE_GET_FRIENDS:
            case MESSAGE_GET_BM_BALANCE:
              this._delegate.didRequestSelector(_funTypeView, message, message, null);
              break;
            case MESSAGE_SET_APP_DATA:
              JSONObject appData = jsonParams.getJSONObject("appData");
              if (appData != null){
                this._delegate.didSetAppData(_funTypeView, appData);
              }
              break;
            case MESSAGE_INFORM_READY:
              this._delegate.didInformReady(_funTypeView);
              break;
            default:
              String key = jsonParams.getString("key");
              JSONObject data;
              if (message.equals(Messages.MESSAGE_SHOW_GALLERY_IMAGE_SELECTOR.message)){
                data = new JSONObject();
                data.put("title", jsonParams.getString("title", ""));
              }
              else if (message.equals(Messages.MESSAGE_SHOW_WEB_IMAGE_SELECTOR.message)){
                data = new JSONObject();
                data.put("title", jsonParams.getString("title", ""));
                data.put("imageUrls", jsonParams.getJSONArray("imageUrls", new JSONArray()));
              }
              if (key != null) {
                this._delegate.didRequestSelector(_funTypeView, message, key, null);
              }
              else {
                this._delegate.didReceiveMesssage(_funTypeView, message, json);
              }
              break;
          }
        }
        catch (JSONException ex) {
          Log.e(this.getClass().getPackage().getName(), "Unable to convert postMessage with message='" + message + "'params to a jsonObject");
        }
        catch (IllegalArgumentException ex) {
          Log.e(this.getClass().getPackage().getName(), "Invalid message sent to postMessage: '" + message + "'");
        }
      }
    }
  }

  private ProgressBar _progressBar;
  private WebView _webView;
  private URL _url;
  private FunTypeViewProtocolDelegate _delegate;
  private FunTypeViewProtocol _funTypeView = this;

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

  private void initWebView(){
    WebView webView = new WebView(getContext());
    addView(webView);

    RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(
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
    webView.setWebChromeClient(new FunTypeWebChromeClient(this));

    webView.loadUrl(this._url.toString());
    webView.addJavascriptInterface(new FunTypeJsInterface(this._delegate), "AqJsInterface");

    _webView = webView;
  }

  private void initProgressBar(){
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
  }
  private void initView(){
    initWebView();
    initProgressBar();
    setLoadedState(false);
  }

  private void setLoadedState(boolean isLoaded){
    if (isLoaded){
      _progressBar.setVisibility(GONE);
      _webView.setVisibility(VISIBLE);
    }
    else {
      _progressBar.setVisibility(VISIBLE);
      _webView.setVisibility(INVISIBLE);
    }
  }

  private String toBase64(String input) {
    byte[] sanitizedBytes = input.getBytes(Charset.forName("UTF-8"));
    return Base64.encodeToString(sanitizedBytes, Base64.NO_WRAP);
  }


  private String sanitize(Object value){
    if (value == null){
      return "null";
    }
    else if (value instanceof ReadableMap){
      return "'" + toBase64(new JSONObject(((ReadableMap) value).toHashMap()).toString()) + "'";
    }
    else if (value instanceof ReadableArray){
      return "'" + toBase64(new JSONArray(((ReadableArray) value).toArrayList()).toString()) + "'";
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

  private void didFailNavigation(int errorCode){
    WritableMap errorMap = new WritableNativeMap();
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      switch (errorCode) {
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
    }
    else {
      errorMap.putString("error", "Unable to load the fun type");
    }

    this._delegate.didFailNavigation(this, errorMap);
  }

  private void injectJsInterface(){
    sendToCallback("window.aqAppSimulatorConfirmed = true;");
    sendToCallback(
      "window.aqJsPostMessage = function(message, params) {" +
      "  sanitizedParams = params.toString();" +
      "  shouldDecode = false; " +
      "  if(typeof params === 'object') {" +
      "    sanitizedParams =  JSON.stringify(params);" +
      "    shouldDecode = true;" +
      "  }" +
      "  window.AqJsInterface.postMessage(message, sanitizedParams, shouldDecode);" +
      "}"
    );
  }

  //region FunTypeViewProtocol methods

  @Override
  public void sendResult(String message, String key, Object value) {
    String sanitizedValue = sanitize(value);
//    Log.d(this.getClass().getPackage().getName(), "sendResult message=" + message + " key=" + key + " value=" + sanitizedValue);
    boolean shouldDecode = shouldDecode(value);
    String jsCode = "window.funTypeCallback('" + message + "', '" + key + "', " + sanitizedValue + ", " + Boolean.toString(shouldDecode) + ");";
//    Log.d(this.getClass().getPackage().getName(), "jsCode = " + jsCode);
    sendToCallback(jsCode);
  }

  @Override
  public void sendError(String message, ReadableMap value) {

  }

  //endregion

  //region FunTypeWebViewClientCallback methods

  @Override
  public void didLoad() {
    injectJsInterface();
    setLoadedState(true);
    this._delegate.didLoad(this);
  }

  @Override
  public void didFailNavigation(WebResourceError error) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      didFailNavigation(error.getErrorCode());
    }
    else didFailNavigation(999999); // Arbitrary code to produce generic error
  }

  @Override
  public void didFailNavigation(int errorCode, String description) {
    didFailNavigation(errorCode);
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

  //region FunTypeWebChromeClientCallback methods

  @Override
  public void onProgress(double progress) {
    this._delegate.loadProgress(this, progress);
  }

  //endregion
}
