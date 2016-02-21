"use strict";

import { Component } from "angular2/core";
import "./ticker.css";

@Component({
  selector: "stock-ticker",
  inputs: ["symbol"],
  template: `
    <div id="container">
      {{ symbol }}
    </div>
  `
})
export class Ticker {
  //  <svg width="50" height="50">
  //    <circle cx="25" cy="25" r="10" />
  //  </svg>
  constructor() {}
}