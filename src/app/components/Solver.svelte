<script lang="ts">
  import _ from "lodash";
  import { xlink_attr } from "svelte/internal";

  import type { Crossword } from "../crossword";
  import { Coords, MsgKind, ReturnMsg, WorkerMsg } from "../types";
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
          console.log(`found! ${msg.solution}`);
          break;
        }
      }
    }
  );

  const solve = () => {
    send({ msgKind: MsgKind.RESET });
    console.log("appending entries");
    const coordsEq = (x: Coords, y: Coords): boolean => {
      return x.row === y.row && x.col === y.col;
    };
    const allCoords = _.uniqWith(_.flatten(input.slots()), coordsEq);
    console.log(allCoords);
    for (const slot of input.slots()) {
      const ids = slot.map((coords) =>
        _.findIndex(allCoords, (x) => coordsEq(x, coords))
      );
      send({ msgKind: MsgKind.ADD_ENTRY, entry: ids });
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
