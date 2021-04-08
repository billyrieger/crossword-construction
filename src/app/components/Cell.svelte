<script lang="ts">
  import type { CellType } from "../types";
  export let cell: CellType | undefined;
</script>

<div class="cell" class:block={!cell} on:mousedown>
  <div class="number">{cell?.number ?? ""}</div>
  <div class="value">{cell?.value ?? ""}</div>
</div>

<style>
  * {
    user-select: none;
  }

  .cell {
    width: 100%;
    height: 100%;
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
