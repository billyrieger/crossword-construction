<script lang="ts">
  import { Grid } from "../crossword/grid";
  import GridComponent from "./Grid.svelte";
  import Solver from "./Solver.svelte";

  let gridRows = 15;
  let gridCols = 15;

  $: crossword = new Grid(gridRows, gridCols);
</script>

<main class="main">
  <div class="dimensions">
    <button
      class="icon-minus"
      on:click={() => {
        gridRows -= 1;
      }}
    />
    <span>{gridRows}</span>
    <button
      class="button"
      on:click={() => {
        gridRows += 1;
      }}
    >
      <div class="icon-clock" />
    </button>
  </div>
  <div class="dimensions">
    <button
      class="icon-minus"
      on:click={() => {
        gridCols -= 1;
      }}
    />
    <span>{gridCols}</span>
    <button
      class="icon-plus"
      on:click={() => {
        gridCols += 1;
      }}
    />
  </div>
  <GridComponent bind:crossword editable={true} />
  <Solver input={crossword} />
</main>

<style lang="scss" global>
  $picnic-primary: #fa8;

  @import "../style/global";
</style>
