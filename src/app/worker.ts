/// <reference lib="webworker" />

import range from "lodash/range";
import * as wasm from "../solver/pkg";
import type { Message, Solution } from "./types";

onmessage = (event: MessageEvent<Message>) => {
  switch (event.data.kind) {
    case "init": {
      console.log("Web worker started.");
      break;
    }

    case "query": {
      console.log("Preparing to solve.");
      wasm.clear();
      event.data.input.forEach((entry) => {
        wasm.add_entry(new Uint32Array(entry));
      });
      for (const n of range(0, 16)) {
        console.log(`entries_len(${n}) = ${wasm.entries_len(n)}`);
      }
      const msg: Solution = {
        kind: "solution",
        output: BigInt(11111),
      };
      postMessage(msg);
      console.log("Solved!");
      break;
    }

    default:
      break;
  }
};
