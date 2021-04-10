<script lang="ts">
  import range from "lodash/range";
  import { Crossword } from "../crossword";
  import Cell from "./Cell.svelte";

  export let crossword: Crossword = new Crossword(5, 5);
  export let editable = false;

  function toggleCell(row: number, col: number) {
    crossword.toggleCell(row, col);
    crossword = crossword;
  }
</script>

<table>
  {#each range(0, crossword.rows) as r}
    <tr>
      {#each range(0, crossword.cols) as c}
        <td
          on:mousedown={() => {
            if (editable) {
              toggleCell(r, c);
            }
          }}
        >
          <Cell cell={crossword.cells[r][c]} />
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
    width: 2em;
    height: 2em;
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
