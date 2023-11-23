import { reactive } from "vue";
import { io } from "socket.io-client";
import * as Tools from './env.js'

export const state = reactive({
  connected: false,
  messages: []
});

// "undefined" means the URL will be computed from the `window.location` object
const URL = (Tools.STATUS) ? Tools.API : Tools.DEV;

export const socket = io(URL)

socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});


socket.on("error", (message) => {
  return location.href="/"
});


socket.on("receiveMessages", (messages) => {
  state.messages = messages.messages;
});
