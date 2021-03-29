<script lang="ts">
  import Solver from "./components/Solver.svelte";
  import Grid from "./components/Grid.svelte";
  import { Crossword } from "./Crossword";
  import { range } from "lodash";
  import { CellKind } from "./types";

  let crossword = new Crossword(15, 15);
</script>

<main>
  <Grid bind:crossword />
  <Solver
    entries={crossword.entries()}
    on:solved={(e) => {
      const solution = e.detail;
      for (const r of range(0, crossword.rows)) {
        for (const c of range(0, crossword.cols)) {
          const cell = crossword.cells[r][c];
          if (cell.kind === CellKind.OPEN) {
            crossword.cells[r][c].value = solution.charAt(cell.id);
          }
        }
      }
    }}
  />
</main>

<style>
  main {
    margin: 0 auto;
    width: 80%;
  }
</style>
