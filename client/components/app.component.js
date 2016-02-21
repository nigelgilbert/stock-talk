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
    <h3 id="title">Angular 2 is dope</h3>
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
    return [[SymbolsService], [RxSocketService]];
  }
  constructor(symbols, socket) {
    this.symbols = symbols.getData();
  }
}