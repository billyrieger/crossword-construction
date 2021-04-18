<script lang="ts">
  import range from "lodash/range";
  import { CellKind, GridPos } from "../crossword";
  import { Grid } from "../crossword/grid";
  import Cell from "./Cell.svelte";

  export let crossword = new Grid(15, 15);
</script>

<table>
  {#each range(0, crossword.rows) as row}
    <tr>
      {#each range(0, crossword.cols) as col}
        <td>
          <Cell
            cell={crossword.get({ row, col }) ?? { kind: CellKind.Block }}
          />
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
