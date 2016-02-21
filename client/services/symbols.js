"use strict";

export class SymbolsService {
  constructor() {
    this._symbols = ["AAPL", "GOOG", "NFLX", "QQQ", "MSFT", "TSLA", "YHOO"];
  }
  getData() {
    return this._symbols;
  }
}