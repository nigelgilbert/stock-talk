"use strict";

import { Component } from "angular2/core";
import "./ticker.css";

@Component({
  selector: "stock-ticker",
  inputs: ["symbol"],
  template: `
    <h4 id="symbol-name">{{symbol}}</h4>
      <svg viewBox="0 0 298 150" class="chart" #chart>
        <polyline
          fill="none"
          stroke="#91AFFF"
          stroke-width="3"
          [attr.points]="points"
        />
      </svg>
  `
})
export class Ticker {
  constructor() {
    this.points = "";
    this.tick.call(this);
  }

  tick() {
    let x = 0;
    let y = 0;
    return setInterval(()=> {
      y = this.rand(100);
      this.points += ` ${x},${y}`;
      x += 20;
    },  this.rand(5000));
  }

  rand(range) {
    return Math.floor((Math.random() * range) + 1);
  }
}