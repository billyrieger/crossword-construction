import * as wasm from "../solver/pkg/solver";

onmessage = ({ data: msg }) => {
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
    case "BEGIN_SEARCH": {
      const solution = wasm.begin_search();
      const msg = {
        msgKind: "SOLUTION_FOUND",
        solution,
      };
      postMessage(msg);
      break;
    }
  }
};
