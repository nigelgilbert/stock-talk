import { Component, View } from "angular2/core";
import "./ticker.css";

@Component({
  selector: "ticker",
  inputs: ["symbol"],
  template: `
    <div class="container">
      {{ symbol }}
    <div>
   `
})
export class Ticker {
  constructor() {}
}