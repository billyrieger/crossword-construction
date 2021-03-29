<script lang="ts">
  import _ from "lodash";
  import { onMount } from "svelte";
  import type { CellType } from "../types";
  import Cell from "./Cell.svelte";

  export let rows = 15;
  export let cols = 15;

  const createEmptyGrid = (): CellType[][] => {
    return _.chunk(
      _.range(0, rows * cols).map((id) => {
        return { block: false, id };
      }),
      cols
    );
  };

  let cells: CellType[][] = createEmptyGrid();

  $: {
    let counter = 0;
    let seen = 0;
    for (const [r, row] of cells.entries()) {
      for (const [c, cell] of row.entries()) {
        if (cell.block) {
          continue;
        }
        updateCell(r, c, { id: seen });
        seen += 1;
        if (
          r === 0 ||
          c === 0 ||
          cells[r - 1][c].block ||
          cells[r][c - 1].block
        ) {
          counter += 1;
          updateCell(r, c, { number: counter });
        } else {
          updateCell(r, c, { number: undefined });
        }
      }
    }
  }

  export function resetGrid() {
    cells = _.chunk(
      _.range(0, rows * cols).map((id) => {
        return { block: false, id };
      }),
      cols
    );
  }

  export function updateCell(
    row: number,
    col: number,
    updated: Partial<CellType>
  ) {
    cells[row][col] = { ...cells[row][col], ...updated };
  }

  export function toggleCell(row: number, col: number) {
    if (cells[row][col].block) {
      cells[row][col] = { block: false };
    } else {
      cells[row][col] = { block: true, id: undefined };
    }
  }

  export function entries(): number[][] {
    let entries = [];
    for (const row of cells) {
      let currentEntry = [];
      for (const cell of row) {
        if (cell.block) {
          console.log("block!");
          entries = [...entries, currentEntry];
          currentEntry = [];
        } else {
          currentEntry = [...currentEntry, cell.id];
        }
      }
      entries = [...entries, currentEntry];
    }
    console.log(entries);
    return entries;
  }

  onMount(resetGrid);
</script>

<table class="grid">
  {#each cells as gridRow, row}
    <tr>
      {#each gridRow as cell, col}
        <td
          on:mousedown={() => {
            toggleCell(row, col);
          }}
        >
          <Cell {cell} />
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
