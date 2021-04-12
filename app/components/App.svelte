<script lang="ts">
  import { Grid as GridType } from "../crossword";
  import Grid from "./Grid.svelte";
  import Solver from "./Solver.svelte";

  let crossword = new GridType(5, 5);
</script>

<main>
  <div class="wrap">
    <Grid bind:crossword editable={true} />
    <Solver input={crossword} />
  </div>
</main>

<style>
  .wrap {
    margin: 0 auto;
    width: 600px;
  }
</style>
