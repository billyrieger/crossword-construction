/// <reference lib="webworker" />

import wasm from "../solver/Cargo.toml";

let module;

self.onmessage = async ({ data }) => {
    switch (data.type) {
        case "init":
            module = await wasm();
            break;
        case "solve":
            self.postMessage(module.solve([[0, 1, 2]]));
            break;
    }
};
