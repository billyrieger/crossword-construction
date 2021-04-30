<script lang="ts">
  import chunk from "lodash/chunk";
  import type { Grid } from "../crossword/grid";
  import type { Cell as CellType, GridPos } from "../crossword";
  import Cell from "./Cell.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let crossword: Grid;
  export let focusable = false;
  export let clickable = false;

  const onMousedown = (e: MouseEvent, cell: CellType & GridPos) => {
    dispatch("cellMousedown", { event: e, cell: cell });
  };
</script>

<table tabindex={focusable ? 0 : undefined}>
  {#each chunk(crossword.allCells(), crossword.cols) as row}
    <tr>
      {#each row as cell}
        <td on:mousedown={clickable ? (e) => onMousedown(e, cell) : undefined}>
          <Cell cell={crossword.getCellUnchecked(cell)} />
        </td>
      {/each}
    </tr>
  {/each}
</table>

<style lang="scss">
  @import "../style/variables";

  $border: solid 1px;

  table {
    border-collapse: collapse;
  }

  td {
    padding: 0;
    vertical-align: middle;
    border-bottom: $border;
    border-right: $border;
  }

  td:first-of-type {
    border-left: $border;
  }

  tr:first-of-type td {
    border-top: $border;
  }
</style>
