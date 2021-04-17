<script lang="ts">
  import { Grid } from "../crossword/grid";
  import GridComponent from "./Grid.svelte";
  import GridStatistics from "./GridStatistics.svelte";

  let useDark = true;

  let crossword = new Grid(15, 15);

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
  <!-- <button on:click={toggleDark}>Dark mode</button> -->
  <GridComponent bind:crossword />
  <GridStatistics input={crossword} />
</main>

<style lang="scss" global>
  @import "../style/global";

  main {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
</style>
