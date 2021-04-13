<script lang="ts">
  import { Grid } from "../crossword/grid";
  import GridComponent from "./Grid.svelte";
  import Solver from "./Solver.svelte";

  let gridRows = 15;
  let gridCols = 15;

  $: crossword = new Grid(gridRows, gridCols);
</script>

<button on:click={() => {gridRows += 1;}}>Add row</button>
<button on:click={() => {gridCols += 1;}}>Add col</button>
<main class="main">
  <GridComponent bind:crossword editable={true} />
  {#if crossword}
    <Solver input={crossword} />
  {/if}
</main>

<style lang="scss" global>
  $picnic-primary: #70d;

  @import "../../node_modules/picnic/src/picnic";

  .main {
    width: 100%;
    height: 100%;
  }
</style>
