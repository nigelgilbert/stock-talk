"use strict";

import { Observable } from "rxjs/Rx";
import io from "socket.io-client";

export class RxSocketService {
  constructor() {
    this.socket = io();
    this.socket.on("data", msg => { console.log(msg) });
    console.log("constructed service");
  }
  getData() {}
}