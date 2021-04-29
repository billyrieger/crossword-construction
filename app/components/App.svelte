<script lang="ts">
  import { Grid } from "../crossword/grid";
  import GridComponent from "./Grid.svelte";
  import GridEditor from "./GridEditor.svelte";
  import GridStatistics from "./GridStatistics.svelte";
  import Solver from "./Solver.svelte";

  let gridRows = 6;
  let gridCols = 6;

  let useDark = true;

  $: crossword = new Grid(gridRows, gridCols);

  $: {
    document.documentElement.setAttribute(
      "data-theme",
      useDark ? "dark" : "light"
    );
  }

  const toggleDark = () => {
    useDark = !useDark;
  };
</script>

<main>
  <button on:click={toggleDark}>Dark mode</button>
  <GridEditor bind:grid={crossword} />
  <GridStatistics input={crossword} />
  <Solver input={crossword} />
</main>

<style lang="scss" global>
  @import "../style/global";

  main {
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    color: black;
    background-color: white;
  }

  :root[data-theme="light"] main {
    color: white;
    background-color: black;
  }
</style>
