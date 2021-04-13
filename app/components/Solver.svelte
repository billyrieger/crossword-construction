<script lang="ts">
  import type { Grid as GridType } from "../crossword/grid";
  import { Coords, MsgKind, ReturnMsg, WorkerMsg } from "../types";
  import GridComponent from "./Grid.svelte";

  import findIndex from "lodash/findIndex";
  import { cloneDeep, range } from "lodash";
  import { CellKind } from "../crossword";

  export let input: GridType;

  let worker = new Worker("./worker.js");
  const send = (msg: WorkerMsg) => {
    worker.postMessage(msg);
  };
  send({ msgKind: MsgKind.RESET });

  let found = new Array<GridType>();

  worker.addEventListener(
    "message",
    ({ data: msg }: MessageEvent<ReturnMsg>) => {
      switch (msg.msgKind) {
        case MsgKind.SOLUTION_FOUND: {
          console.log(`found! ${msg.solution}`);
          let grid = cloneDeep(input);
          let i = 0;
          for (const row of range(0, grid.rows)) {
            for (const col of range(0, grid.cols)) {
              if (grid.get({ row, col })!.kind === CellKind.Block) {
                continue;
              }
              grid = grid.update(
                { row, col },
                { value: msg.solution.charAt(i) }
              );
              i += 1;
            }
          }
          found = [...found, grid];
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
    let allCoords: Coords[] = [];
    for (const row of range(0, input.rows)) {
      for (const col of range(0, input.cols)) {
        const coords = { row, col };
        if (input.get(coords)!.kind === CellKind.Open) {
          allCoords.push(coords);
        }
      }
    }
    let slots = [];
    for (const slot of input.slots()) {
      const ids = slot.map((coords) =>
        findIndex(allCoords, (x) => coordsEq(x, coords))
      );
      slots.push(ids);
      send({ msgKind: MsgKind.ADD_ENTRY, entry: ids });
    }
    console.log(slots);
    console.log("begin search");
    send({ msgKind: MsgKind.BEGIN_SEARCH });
  };
</script>

<div>
  <button on:click={solve}>Solve</button>
  {#each found as solution}
    <div class="solution">
      <GridComponent crossword={solution} />
    </div>
  {/each}
</div>

<style>
  .solution {
    font-size: 75%;
    padding: 1em;
  }
</style>
