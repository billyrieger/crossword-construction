/// <reference lib="webworker" />

import * as wasm from "../solver/pkg";
import type { Message, Solution } from "./types";

onmessage = (event: MessageEvent<Message>) => {
  switch (event.data.kind) {
    case "init":
      console.log("Web worker started.");
      break;

    case "query":
      console.log("Preparing to solve.");
      const solution = wasm.square(event.data.input);
      const msg: Solution = {
        kind: "solution",
        output: solution,
      };
      postMessage(msg);
      console.log("Solved!");
      break;

    default:
      break;
  }
};
