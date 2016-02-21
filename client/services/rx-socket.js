"use strict";

import { Observable } from "rxjs/Rx";
import io from "socket.io-client";

export class RxSocketService {
  constructor() {
    this.socket = io();
    this.socketObservable = Observable.fromEvent(this.socket, "data");
  }
  getObservable(symbol) {
    if (typeof symbol === "undefined") {
      return this.socketObservable;
    }
    return this.socketObservable.filter(payload => {
      return payload.symbol === symbol;
    });
  }
}