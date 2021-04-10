<script lang="ts">
  import type { Crossword } from "../crossword";
  import { MsgKind, ReturnMsg, WorkerMsg } from "../types";
  import Grid from "./Grid.svelte";

  export let input: Crossword;

  let worker = new Worker("./worker.js");
  const send = (msg: WorkerMsg) => {
    worker.postMessage(msg);
  };
  send({ msgKind: MsgKind.RESET });

  let found = new Array<Crossword>();

  worker.addEventListener(
    "message",
    ({ data: msg }: MessageEvent<ReturnMsg>) => {
      switch (msg.msgKind) {
        case MsgKind.SOLUTION_FOUND: {
          found.push(input.applySolution(msg.solution));
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
  {#each found as solution}
    <div class="solution">
      <Grid crossword={solution} />
    </div>
  {/each}
</div>

<style>
  .solution {
    font-size: 75%;
    padding: 1em;
  }
</style>
