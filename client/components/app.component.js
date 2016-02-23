"use strict";

import { Component } from "angular2/core";
import { Ticker } from "./ticker/ticker.component";
import { SymbolsService } from "../services/symbols";
import { RxSocketService } from "../services/rx-socket";
import "./app.css";

@Component({
  selector: "ng-app",
  directives: [Ticker],
  providers: [SymbolsService, RxSocketService],
  template: `
    <h2 id="title">Angular 2 is dope</h2>
    <div id="content">
      <ul id="tickers-dashboard">
        <li id="ticker-container" *ngFor="#symbol of symbols">
          <stock-ticker [symbol]=symbol></stock-ticker>
        </li>
      </ul>
    </div>
  `
})
export class App {
  static get parameters() {
    return [[RxSocketService], [SymbolsService]];
  }
  constructor(socket, symbols) {
    this.symbols = symbols.getData();
    socket.getObservable().subscribe(data => console.log(data));
  }
}