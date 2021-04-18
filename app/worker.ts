/// <reference lib="webworker" />

import * as wasm from "../solver/wasm/pkg/solver_wasm";
import type { WorkerMsg } from "./types";

onmessage = ({ data: msg }: MessageEvent<WorkerMsg>) => {
  switch (msg.msgKind) {
    case "INIT": {
      wasm.init();
      break;
    }
    case "RESET": {
      wasm.reset();
      break;
    }
    case "ADD_ENTRY": {
      wasm.add_entry(new Uint32Array(msg.entry));
      break;
    }
    case "ADD_WORD": {
      wasm.add_word(msg.word);
      break;
    }
    case "FINALIZE": {
      wasm.finalize();
      break;
    }
    case "BEGIN_SEARCH": {
      const solution = wasm.search();
      if (solution) {
        postMessage({
          msgKind: "SOLUTION_FOUND",
          solution,
        });
      } else {
        postMessage({
          msgKind: "NO_SOLUTION_FOUND",
        });
      }
      break;
    }
  }
};
