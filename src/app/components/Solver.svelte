<script lang="ts">
  import type { Crossword } from "../crossword";
  import { BeginSearch, MsgKind, ReturnMsg, WorkerMsg } from "../types";

  export let input: Crossword;

  let worker = new Worker("./worker.js");
  const send = (msg: WorkerMsg) => {
    worker.postMessage(msg);
  };
  send({ msgKind: MsgKind.RESET });

  let found = new Array<string>();

  worker.addEventListener(
    "message",
    ({ data: msg }: MessageEvent<ReturnMsg>) => {
      switch (msg.msgKind) {
        case MsgKind.SOLUTION_FOUND: {
          found.push(msg.solution);
          found = found;
          break;
        }
      }
    }
  );

  const solve = () => {
    send({ msgKind: MsgKind.RESET });
    console.log("appending entries");
    for (const entry of input.allEntries()) {
      send({ msgKind: MsgKind.ADD_ENTRY, entry });
    }
    console.log("begin search");
    send({ msgKind: MsgKind.BEGIN_SEARCH });
  };
</script>

<div>
  <button on:click={solve}>Solve</button>
  <p>The solution(s) are: {found}</p>
</div>

<style>
</style>
