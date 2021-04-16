<script lang="ts">
  import { Grid } from "../crossword/grid";
  import GridComponent from "./Grid.svelte";
  import GridStatistics from "./GridStatistics.svelte";

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
    }}>Dark mode</button
  >
  <GridComponent bind:crossword editable={true} />
  <GridStatistics input={crossword} />
</main>

<style lang="scss" global>
  $picnic-primary: rgb(102, 37, 155);

  @import "../style/global";

  .main {
    color: var(--colorFg);
    background-color: var(--colorBg);
    width: 100vw;
    height: 100vh;
  }
</style>