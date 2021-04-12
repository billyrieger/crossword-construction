<script lang="ts">
  import range from "lodash/range";
  import { CellKind } from ".";
  import { Grid } from "./grid";

  import CellComponent from "./Cell.svelte";

  export let crossword = new Grid(5, 5);
  export let editable = false;

  function toggleCell(row: number, col: number) {
    const coords = { row, col };
    if (crossword.get(coords)?.kind === CellKind.Block) {
      crossword = crossword.set(coords, { kind: CellKind.Open });
    } else {
      crossword = crossword.set(coords, { kind: CellKind.Block });
    }
  }
</script>

<table>
  {#each range(0, crossword.rows) as row}
    <tr>
      {#each range(0, crossword.cols) as col}
        <td
          on:mousedown={() => {
            if (editable) {
              toggleCell(row, col);
            }
          }}
        >
          <CellComponent
            cell={crossword.get({ row, col }) ?? { kind: CellKind.Block }}
          />
        </td>
      {/each}
    </tr>
  {/each}
</table>

<style lang="scss">
  table {
    border-collapse: collapse;
  }

  td {
    margin: 0;
    padding: 0;
    border-bottom: solid black 1px;
    border-right: solid black 1px;
    vertical-align: middle;
  }

  td:first-of-type {
    border-left: solid #555 1px;
  }

  tr:first-of-type td {
    border-top: solid #555 1px;
  }
</style>
