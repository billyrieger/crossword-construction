<script lang="ts">
  import { Grid } from "../crossword/grid";
  import GridComponent from "./Grid.svelte";
  import Solver from "./Solver.svelte";

  let crossword = new Grid(7, 7);
</script>

<main>
  <div class="wrap">
    <GridComponent bind:crossword editable={true} />
    <Solver input={crossword} />
  </div>
</main>

<style lang="scss">
  @import "../../style/global.scss";

  .wrap {
    margin: 0 auto;
    width: 600px;
  }
</style>
