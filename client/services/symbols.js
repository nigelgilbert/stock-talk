"use strict";

export class SymbolsService {
  constructor() {
    this._symbols = ["AAPL", "GOOG", "NFLX"];
    console.log("symbol service created");
  }
  getData() {
    return this._symbols;
  }
}