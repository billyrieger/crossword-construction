<script lang="ts">
  import { Grid } from "../crossword/grid";
  import GridComponent from "../crossword/Grid.svelte";
  import Solver from "./Solver.svelte";

  let crossword = new Grid(15, 15);
</script>

<main>
  <div class="wrap">
    <GridComponent bind:crossword editable={true} />
    <Solver input={crossword} />
  </div>
</main>

<style lang="scss">
  @import "./style/global.scss";

  :global(*) {
    background-color: #222222;
    color: #555555;
  }

  .wrap {
    margin: 0 auto;
    width: 600px;
  }
</style>
