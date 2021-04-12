<script lang="ts">
  import { CellKind } from ".";
  import type { Cell } from "./types";

  export let cell: Cell;
</script>

<div
  class="cell"
  class:block={cell.kind === CellKind.Block}
  class:open={cell.kind === CellKind.Open}
  on:mousedown
>
  {#if cell.kind === CellKind.Open}
    <div class="number">{cell.number ?? ""}</div>
    <div class="value">{cell.value ?? ""}</div>
  {/if}
</div>

<style>
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

  .open {
    background-color: white;
  }

  .block {
    background-color: black;
  }

  .number {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 75%;

    background-color: inherit;
  }

  .value {
    background-color: inherit;
  }
</style>
