<script lang="ts">
  import _ from "lodash";
  import Cell, { CellKind, Highlight } from "./Cell.svelte";
  import type { CellData } from "./Cell.svelte";

  export let rows = 15;
  export let cols = 15;

  let cells: CellData[][] = Array(rows)
    .fill(0)
    .map(() => _.fill(Array(cols), { kind: CellKind.Open }));
  let active: { row: number; col: number } | undefined = undefined;

  let activeCell: CellData | undefined;
  $: activeCell = cells[active?.row]?.[active.col];

  renumber();

  function updateCell(row: number, col: number, data: CellData) {
    cells[row][col] = { ...cells[row][col], ...data };
  }

  $: highlight = (row: number, col: number): Highlight => {
    if (row === active?.row && col === active?.col) {
      return Highlight.Primary;
    } else {
      return Highlight.None;
    }
  };

  const toggleCell = (row: number, col: number) => {
    let cell = cells[row][col];
    switch (cell.kind) {
      case CellKind.Block:
        cells[row][col] = { kind: CellKind.Open };
        break;
      case CellKind.Open:
        cells[row][col] = { kind: CellKind.Block };
        break;
    }
    renumber();
  };

  function renumber() {
    let counter = 0;
    for (const row of _.range(rows)) {
      for (const col of _.range(cols)) {
        const cell = cells[row][col];
        if (cell.kind === CellKind.Open) {
          if (
            row === 0 ||
            col === 0 ||
            cells[row - 1][col].kind === CellKind.Block ||
            cells[row][col - 1].kind === CellKind.Block
          ) {
            counter += 1;
            updateCell(row, col, { kind: CellKind.Open, number: counter });
          } else {
            updateCell(row, col, { kind: CellKind.Open, number: undefined });
          }
        }
      }
    }
  }

  const onClick = (e) => {
    const { row, col } = e.detail;
    if (active?.row === row && active?.col === col) {
      toggleCell(row, col);
    } else {
      active = { row, col };
    }
  };

  function onBlur(e) {
    active = undefined;
  }

  function set(row: number, col: number, data) {
    cells[row][col] = { ...cells[row][col], ...data };
  }

  function onKeyDown(e: KeyboardEvent) {
    if (/^[a-zA-Z]$/.test(e.key) && activeCell !== undefined) {
      cells[active.row][active.col].value =
        activeCell.kind === CellKind.Open ? e.key.toUpperCase() : undefined;
    }
    switch (e.key) {
      // Movement
      case "ArrowUp":
        active.row = Math.max(active.row - 1, 0);
        break;
      case "ArrowDown":
        active.row = Math.min(active.row + 1, rows - 1);
        break;
      case "ArrowLeft":
        active.col = Math.max(active.col - 1, 0);
        break;
      case "ArrowRight":
        active.col = Math.min(active.col + 1, cols - 1);
        break;

      // Input
      case ".":
        toggleCell(active.row, active.col);
        break;
    }
  }
</script>

<div>active: ({active?.row}, {active?.col})</div>

<div
  class="grid"
  tabindex="-1"
  on:keydown|preventDefault={onKeyDown}
  on:blur={onBlur}
>
  {#each _.range(rows) as row}
    <div class="grid-row">
      {#each _.range(cols) as col}
        <Cell
          data={cells[row][col]}
          highlight={highlight(row, col)}
          {row}
          {col}
          on:click={onClick}
        />
      {/each}
    </div>
  {/each}
</div>

<style>
  .grid {
    width: min-content;
  }
  .grid-row {
    display: flex;
  }
</style>
