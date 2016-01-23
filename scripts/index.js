"use strict";
require("webcomponents-lite");

var socket = io();

document.getElementById("chat-form").onsubmit = function() {
  let userInput = document.getElementById("user-input").value;
  socket.emit("message", userInput);
  document.getElementById("user-input").value = "";
  return false;
};

socket.on("broadcast", (msg) => {
  console.log(msg);
  let message = document.createElement("message-component");
  message.setAttribute("text", msg);
  document.getElementById("messages").appendChild(message);
});
