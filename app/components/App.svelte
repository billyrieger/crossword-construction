<script lang="ts">
  import { Grid } from "../crossword/grid";
  import GridComponent from "./Grid.svelte";
  import Solver from "./Solver.svelte";

  let gridRows = 15;
  let gridCols = 15;

  let useDark = false;

  $: crossword = new Grid(gridRows, gridCols);

  $: {
    document.documentElement.setAttribute(
      "data-theme",
      useDark ? "dark" : "light"
    );
  }
</script>

<main class="main" class:dark={useDark}>
  <button
    on:click={() => {
      useDark = !useDark;
      console.log(useDark);
    }}>Dark mode</button
  >
  <GridComponent bind:crossword editable={true} />
  <Solver input={crossword} />
</main>

<style lang="scss" global>
  $picnic-primary: rgb(102, 37, 155);

  @import "../style/global";

  :global(:root) {
    --colorBg: white;
    --colorFg: black;

    --colorCellBlock: black;
    --colorCellOpen: white;
    --colorCellText: black;
  }

  :global(:root[data-theme="dark"]) {
    --colorBg:black;
    --colorFg: white;

    --colorCellBlock: black;
    --colorCellOpen: #444;
    --colorCellText: white;
  }

  .main {
    color: var(--colorFg);
    background-color: var(--colorBg);
  }
</style>
