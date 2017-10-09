package com.bengga.react.core;


import org.json.JSONObject;

/**
 * Created by ryanbrozo on 04/10/2017.
 */

public interface FunTypeViewProtocolDelegate {
  void didLoad(FunTypeViewProtocol view);
  void didFailNavigation(FunTypeViewProtocol view, JSONObject error);
  void didJoin(FunTypeViewProtocol view, String id, String imageUrl, boolean winCriteriaPassed, JSONObject notificationItem);
  void didEnd(FunTypeViewProtocol view);
  void didRequestShowPreview(FunTypeViewProtocol view, String title, String coverImageUrl, JSONObject data);
  void didInformPublishStatus(FunTypeViewProtocol view, Boolean status);
  void didRequestSelector(FunTypeViewProtocol view, String selector, String key, JSONObject data);
  void didSetAppData(FunTypeViewProtocol view, JSONObject data);
  void didInformReady(FunTypeViewProtocol view);
  void didReceiveMesssage(FunTypeViewProtocol view, String message, JSONObject params);
  void loadProgress(FunTypeViewProtocol view, double progress);
}
