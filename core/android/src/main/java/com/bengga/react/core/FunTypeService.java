package com.bengga.react.core;

import android.content.Context;
import android.util.Log;
import android.view.View;

import com.bengga.core.FunType;
import com.bengga.react.views.NativeFunTypeView;
import com.bengga.react.views.WebFunTypeView;

import java.net.MalformedURLException;
import java.net.URL;

/**
 * Created by ryanbrozo on 04/10/2017.
 */

public class FunTypeService {

  private static FunTypeService _instance = null;

  protected FunTypeService() {

  }

  public static FunTypeService getInstance() {
    if (_instance == null){
      _instance = new FunTypeService();
    }
    return _instance;
  }

  public FunTypeDownload isFunTypeDownloaded(FunType funType) {
    return FunTypeDownload.ONLINE;
  }

  private URL resolveUrl(FunType funType) {
    if (funType.packageFileUrl != null && funType.packageFileHash != null && !funType.packageFileHash.equals("")) {
      // TODO: Return local web server url
      return funType.webUrl;
    }
    else {
      return funType.webUrl;
    }
  }

  public View createFunTypeView(Context context,
                                FunType funType,
                                FunTypeMode mode,
                                String engagementId,
                                FunTypeViewProtocolDelegate delegate) {

    switch (funType.type){
      case EXTERNAL_NATIVE:
        return new NativeFunTypeView(context);
      case EXTERNAL_WEB_BASED:
        URL webUrl = null;
        try {
          switch (mode) {
            case CREATE:
              webUrl = new URL(resolveUrl(funType), "?action=create");
            case JOIN:
              webUrl = new URL(resolveUrl(funType), "?action=join&id=" + engagementId);
            case PREVIEW:
              webUrl = new URL(resolveUrl(funType), "?action=preview");

          }
        }
        catch (MalformedURLException e){
          Log.e(this.getClass().getPackage().getName(), "Unable to produce a valid webUrl for " + resolveUrl(funType));
        }
        if (webUrl != null) {
          return new WebFunTypeView(context, webUrl, delegate);
        }
        else {
          return new View(context);
        }
      default:
        return new View(context);
    }
  }
}
