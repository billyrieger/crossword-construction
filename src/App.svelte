<script lang="ts">
  import _, { entries } from "lodash";
  import Solver from "./components/Solver.svelte";
  import Grid from "./components/Grid.svelte";
  import { Crossword } from "./Crossword";
  import { CellKind } from "./types";
  import WebWorker from "web-worker:./Worker.ts";

  let crossword = new Crossword(15, 15);

  let worker;
</script>

<main>
  <button
    on:click={() => {
      worker = new WebWorker();
      worker.onmessage = ({ data }) => {
        console.log("received");
        console.log(data);
      };
      worker.postMessage({ type: "init" });
    }}>Init</button
  >
  <button
    on:click={() => {
      console.log("solving");
      worker.postMessage({ type: "solve", entries: crossword.entries() });
    }}>Work</button
  >
  <Grid bind:crossword />
  <Solver
    entries={crossword.entries()}
    on:solved={(e) => {
      const solution = e.detail;
      for (const r of _.range(0, crossword.rows)) {
        for (const c of _.range(0, crossword.cols)) {
          const cell = crossword.cells[r][c];
          if (cell.kind === CellKind.OPEN) {
            crossword.cells[r][c].value = solution.charAt(cell.id);
          }
        }
      }
    }}
  />
</main>

<style lang="scss">
  main {
    margin: 0 auto;
    width: 70%;
  }
</style>
