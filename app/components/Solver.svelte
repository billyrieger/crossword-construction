<script lang="ts">
  import findIndex from "lodash/findIndex";
  import cloneDeep from "lodash/cloneDeep";
  import range from "lodash/range";
  import type { Grid as GridType } from "../crossword/grid";
  import type { GridPos } from "../crossword";
  import { MsgKind, ReturnMsg, WorkerMsg } from "../types";
  import GridComponent from "./Grid.svelte";
  import { CellKind } from "../crossword";

  export let input: GridType;

  let worker = new Worker(new URL("../worker.ts", import.meta.url));
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
        case MsgKind.NO_SOLUTION_FOUND: {
          console.log("no solution found :(");
        }
      }
    }
  );

  const solve = () => {
    send({ msgKind: MsgKind.RESET });
    console.log("appending entries");
    const coordsEq = (x: GridPos, y: GridPos): boolean => {
      return x.row === y.row && x.col === y.col;
    };
    let allCoords: GridPos[] = [];
    for (const row of range(0, input.rows)) {
      for (const col of range(0, input.cols)) {
        const coords = { row, col };
        if (input.get(coords)!.kind === CellKind.Open) {
          allCoords.push(coords);
        }
      }
    }
    let slots = [];
    for (const entry of input.entries()) {
      const ids = entry.coords.map((coords) =>
        findIndex(allCoords, (x) => coordsEq(x, coords))
      );
      slots.push(ids);
      send({ msgKind: MsgKind.ADD_ENTRY, entry: ids });
    }
    console.log(slots);
    console.log("begin search");
    send({ msgKind: MsgKind.BEGIN_SEARCH });
  };

  const loadWordlist = async () => {
    console.log("loading wordlist");
    const response = await fetch("wordlist.txt");
    const body = await response.text();
    console.log("sending to wasm");
    for (const word of body.split("\n")) {
      send({ msgKind: MsgKind.ADD_WORD, word });
    }
    send({ msgKind: MsgKind.FINALIZE });
    console.log("done");
  };
</script>

<button on:click={loadWordlist}>Load wordlist</button>
<div>
  <button class="icon-eye" on:click={solve} />
  {#each found as solution}
    <div class="solution">
      <GridComponent crossword={solution} />
    </div>
  {/each}
</div>

<style lang="scss">
  .solution {
    font-size: 75%;
    padding: 1em;
  }
</style>
