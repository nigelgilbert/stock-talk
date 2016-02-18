import { Component, View } from "angular2/core";
import { Ticker } from "./ticker/ticker.component";

@Component({
  selector: "app",
  directives: [Ticker],
  template: `
    <h3>Angular 2</h3>
    <ul>
      <li *ngFor="#symbol of symbols">
        <ticker [symbol]=symbol></ticker>
      </li>
    </ul>
  `
})
export class App {
  symbols = ["AAPL", "GOOG", "NFLX"];
  constructor() {}
}