<script lang="ts">
  import { Grid } from "../crossword/grid";
  import GridComponent from "./Grid.svelte";
  import GridStatistics from "./GridStatistics.svelte";

  let gridRows = 15;
  let gridCols = 15;

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

<main class="main" class:dark={useDark}>
  <!-- <button on:click={toggleDark}>Dark mode</button> -->
  <div class="center">
    <GridComponent bind:crossword />
    <GridStatistics input={crossword} />
  </div>
</main>

<style lang="scss" global>
  @import "../style/global";

  .main {
    overflow: clip;

    width: 100vw;
    height: 100vh;
  }

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
