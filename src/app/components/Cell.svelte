<script lang="ts">
  import type { Cell } from "../crossword";
  import { CellKind } from "../crossword";
  export let cell: Cell;
</script>

{#if cell.kind === CellKind.Block}
  <div class="cell block" on:mousedown />
{:else}
  <div class="cell" on:mousedown>
    <div class="number">{cell.number ?? ""}</div>
    <div class="value">{cell.value ?? ""}</div>
  </div>
{/if}

<style>
  * {
    user-select: none;
  }

  .cell {
    width: 2em;
    height: 2em;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .block {
    background-color: black;
  }

  .number {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 75%;
  }
</style>
