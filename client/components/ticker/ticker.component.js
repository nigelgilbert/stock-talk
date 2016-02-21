"use strict";

import { Component } from "angular2/core";
import "./ticker.css";

@Component({
  selector: "stock-ticker",
  inputs: ["symbol"],
  template: `
    <div class="fadeInDown" id="container">
      {{ symbol }}
    </div>
    <div class="chart" id="graph-1-container">
    <div class="chart-svg">
    </div>
  `
})
export class Ticker {

}