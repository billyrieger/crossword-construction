<script lang="ts">
  import _ from "lodash";
  import Solver from "./Solver.svelte";
  import Grid from "./Grid.svelte";
  import { Crossword } from "../Crossword";
  import { CellKind } from "../types";

  let crossword = new Crossword(15, 15);
</script>

<main>
  <button
    on:click={() => {
      let blocks = [];
      for (const r of _.range(0, crossword.rows)) {
        for (const c of _.range(0, crossword.cols)) {
          const cell = crossword.cells[r][c];
          if (cell.kind === CellKind.BLOCK) {
            blocks.push([r, c]);
          }
        }
      }
      console.log(blocks);
    }}>Blocks</button
  >
  <button
    on:click={() => {
      crossword = new Crossword(15, 15);
      crossword.sample();
    }}>Load sample grid</button
  >
  <button
    on:click={() => {
      for (const r of _.range(0, crossword.rows)) {
        for (const c of _.range(0, crossword.cols)) {
          const cell = crossword.cells[r][c];
          if (cell.kind === CellKind.OPEN) {
            crossword.cells[r][c].value = undefined;
          }
        }
      }
    }}>Clear grid</button
  >
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
  <Grid bind:crossword />
</main>

<style>
  main {
    margin: 0 auto;
    width: 70%;
  }
</style>
