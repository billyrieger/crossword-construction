<script lang="ts">
  import range from "lodash/range";
  import { CellKind, Crossword } from "../crossword";
  import Cell from "./Cell.svelte";

  export let crossword: Crossword = new Crossword(5, 5);
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

<style>
  table {
    border-collapse: collapse;
  }

  td {
    border-bottom: solid black 1px;
    border-right: solid black 1px;
  }

  td:first-of-type {
    border-left: solid black 1px;
  }

  tr:first-of-type td {
    border-top: solid black 1px;
  }
</style>
