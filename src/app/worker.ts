/// <reference lib="webworker" />

import * as wasm from "../solver/pkg";

self.onmessage = () => {
  console.log("Web worker started.");
  self.postMessage(wasm.square(15));
};
