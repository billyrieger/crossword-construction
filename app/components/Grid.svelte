<script lang="ts">
  import range from "lodash/range";
  import { CellKind, Grid as CrosswordGrid } from "../crossword";
  import Cell from "./Cell.svelte";

  export let crossword = new CrosswordGrid(5, 5);
  export let editable = false;

  function toggleCell(row: number, col: number) {
    const coords = { row, col };
    if (crossword.get(coords)?.kind === CellKind.Block) {
      crossword = crossword.set(coords, { kind: CellKind.Open, number: 69 });
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
          <Cell
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
    border-bottom: solid #555 1px;
    border-right: solid #555 1px;
  }

  td:first-of-type {
    border-left: solid #555 1px;
  }

  tr:first-of-type td {
    border-top: solid #555 1px;
  }
</style>
