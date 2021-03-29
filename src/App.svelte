<script lang="ts">
  import Grid from "./components/Grid.svelte";
  import Solver from "./components/Solver.svelte";

  let grid: Grid;
  $: console.log(grid);
  $: entries = grid ? grid.entries() : [];
  let width = 15;
</script>

<main>
  <button
    on:click={() => {
      grid.resetGrid();
      grid = grid;
    }}>Reset grid</button
  >
  <Grid bind:this={grid} rows={width} />
</main>

<Solver {entries} />

<style>
  main {
    margin: 0 auto;
    width: 80%;
  }
</style>
