package com.bengga.react.core;

/**
 * Created by ryanbrozo on 04/10/2017.
 */

public enum FunTypeMode {
  CREATE, JOIN, PREVIEW;

  public static FunTypeMode fromString(String value) {
    switch (value.toLowerCase()) {
      case "create":
        return CREATE;
      case "join":
        return JOIN;
      case "preview":
        return PREVIEW;
      default:
        return null;
    }
  }
}
