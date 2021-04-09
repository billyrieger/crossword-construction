/// <reference lib="webworker" />

import { square, solve } from "../solver/pkg";
import type { Message, Solution } from "./types";

onmessage = (event: MessageEvent<Message>) => {
  switch (event.data.kind) {
    case "init":
      console.log("Web worker started.");
      break;

    case "query":
      console.log("Preparing to solve.");
      const solution = square(BigInt(5));
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
