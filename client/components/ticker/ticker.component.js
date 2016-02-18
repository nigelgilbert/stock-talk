import { Component, View } from "angular2/core";

@Component({
  selector: "ticker",
  inputs: ["symbol"],
  template: `<b>{{ symbol }}</b>`
})
export class Ticker {
  constructor() {}
}