package com.bengga.react.util;

import com.facebook.react.bridge.WritableMap;
import com.remobile.cordova.JsonConvert;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by ryanbrozo on 06/10/2017.
 */

public class JSONHelper {
  private JSONObject _json;

  public JSONHelper(JSONObject json){
    this._json = json;
  }

  public static WritableMap toWritableMap(JSONObject json){
    try {
      return JsonConvert.jsonToReact(json);
    }
    catch (JSONException e){
      return null;
    }
  }

  public String getString(String key, String defaultValue){
    try {
      if (!_json.isNull(key)) {
        return _json.getString(key);
      }
      else return defaultValue;
    }
    catch (JSONException e){
      return defaultValue;
    }
  }

  public String getString(String key){
    return getString(key, null);
  }

  public Double getDouble(String key, Double defaultValue){
    try {
      if (!_json.isNull(key)) {
        return _json.getDouble(key);
      }
      else return defaultValue;
    }
    catch (JSONException e){
      return defaultValue;
    }
  }

  public Double getDouble(String key){
    return getDouble(key, null);
  }

  public Integer getInt(String key, Integer defaultValue){
    try {
      if (!_json.isNull(key)) {
        return _json.getInt(key);
      }
      else return defaultValue;
    }
    catch (JSONException e){
      return defaultValue;
    }
  }

  public Integer getInt(String key){
    return getInt(key, null);
  }

  public boolean getBoolean(String key, boolean defaultValue){
    try {
      if (!_json.isNull(key)) {
        return _json.getBoolean(key);
      }
      else return defaultValue;
    }
    catch (JSONException e){
      return defaultValue;
    }
  }

  public boolean getBoolean(String key){
    return getBoolean(key, false);
  }

  public JSONObject getJSONObject(String key, JSONObject defaultValue){
    try {
      if (!_json.isNull(key)) {
        return _json.getJSONObject(key);
      }
      else return defaultValue;
    }
    catch (JSONException e){
      return defaultValue;
    }
  }

  public JSONObject getJSONObject(String key){
    return getJSONObject(key, null);
  }

  public JSONArray getJSONArray(String key, JSONArray defaultValue){
    try {
      if (!_json.isNull(key)) {
        return _json.getJSONArray(key);
      }
      else return defaultValue;
    }
    catch (JSONException e){
      return defaultValue;
    }
  }

  public JSONArray getJSONArray(String key){
    return getJSONArray(key, null);
  }
}
