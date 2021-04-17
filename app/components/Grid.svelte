<script lang="ts">
  import range from "lodash/range";
  import type { Grid } from "../crossword/grid";
  import Cell from "./Cell.svelte";

  export let crossword: Grid;
</script>

<table>
  {#each range(0, crossword.rows) as row}
    <tr>
      {#each range(0, crossword.cols) as col}
        <td>
          <Cell cell={crossword.getUnchecked({ row, col })} />
        </td>
      {/each}
    </tr>
  {/each}
</table>

<style lang="scss">
  $border: solid var(--cell-block) 1px;

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
