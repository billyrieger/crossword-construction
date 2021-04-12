<script lang="ts">
  import { Grid as GridType } from "../crossword";
  import Grid from "./Grid.svelte";
  import Solver from "./Solver.svelte";

  import "../../node_modules/normalize.css/normalize.css";

  let crossword = new GridType(15, 15);
</script>

<main>
  <div class="wrap">
    <Grid bind:crossword editable={true} />
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
