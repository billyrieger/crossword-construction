/// <reference lib="webworker" />

import range from "lodash/range";
import * as wasm from "../solver/pkg";
import type { WorkerMsg, ReturnMsg } from "./types";

onmessage = (event: MessageEvent<WorkerMsg>) => {
    switch (event.data.kind) {
        case "INIT": {
            console.debug("Web worker started.");
            break;
        }

        case "BEGIN_SEARCH": {
            const msg: ReturnMsg = {
                kind: "SolutionFound",
            };
            postMessage(msg);
            console.log("Solved!");
            break;
        }

        default:
            break;
    }
};
