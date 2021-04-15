<script lang="ts">
  import { CellKind } from "../crossword";
  import type { Cell } from "../crossword";

  export let cell: Cell;
  export let style: "NONE" | "ACTIVE" = "NONE";
</script>

<div
  class="cell"
  class:block={cell.kind === CellKind.Block}
  class:open={cell.kind === CellKind.Open}
  class:active={style === "ACTIVE"}
  on:mousedown
>
  {#if cell.kind === CellKind.Open}
    {#if cell.number !== undefined}
      <div class="number">{cell.number}</div>
    {/if}
    {#if cell.value !== undefined}
      <div class="value">{cell.value}</div>
    {/if}
  {/if}
</div>

<style lang="scss">
  @import "../style/_theme";

  * {
    user-select: none;
  }

  .cell {
    font-family: sans-serif;
    width: 2em;
    height: 2em;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .block {
    background-color: var(--colorCellBlock);
  }

  .open {
    background-color: var(--colorCellOpen);
  }

  .number {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 75%;

    background-color: transparent;
  }

  .active {
    background-color: hotpink;
  }

  .value {
    background-color: none;
  }
</style>
