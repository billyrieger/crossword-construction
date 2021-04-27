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
  $: console.log(found);

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
              if (grid.getCell({ row, col })!.kind === CellKind.Block) {
                continue;
              }
              grid = grid.updateCell(
                { row, col },
                { value: msg.solution.charAt(i) }
              );
              i += 1;
            }
          }
          found = [...found, cloneDeep(grid)];
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
        if (input.getCell(coords)!.kind === CellKind.Open) {
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
<button class="icon-eye" on:click={solve} />
<ul class="list">
  {#each found as solution}
    <li class="solution">
      <GridComponent crossword={solution} />
    </li>
  {/each}
</ul>

<style lang="scss">
  .list {
    padding: 0;
    width: min-content;
    max-height: 500px;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    padding-top: 1em;
    border: 5px solid var(--foreground);
  }

  .solution {
    font-size: 75%;
    display: block;
    padding: 1em;
    padding-top: 0;
  }
</style>
