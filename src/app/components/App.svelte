<script lang="ts">
  import { Crossword } from "../crossword";
  import Grid from "./Grid.svelte";
  import Solver from "./Solver.svelte";

  let crossword = new Crossword(15, 15);
</script>

<main>
  <div class="wrap">
    <Grid bind:crossword />
    <Solver input={crossword} />
  </div>
</main>

<style>
  .wrap {
    margin: 0 auto;
    width: 600px;
  }
</style>
