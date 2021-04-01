<script lang="ts">
  import _ from "lodash";
  import { Crossword } from "../Crossword";
  import Cell from "./Cell.svelte";

  export let crossword: Crossword = new Crossword(5, 5);
</script>

<table>
  {#each _.range(0, crossword.rows) as r}
    <tr>
      {#each _.range(0, crossword.cols) as c}
        <td
          on:mousedown={() => {
            crossword.toggleCell(r, c);
            crossword = crossword;
          }}
        >
          <Cell cell={crossword.cells[r][c]} />
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
    width: 30px;
    height: 30px;
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
