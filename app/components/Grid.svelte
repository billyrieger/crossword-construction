<script lang="ts">
  // Lodash imports.
  import clamp from "lodash/clamp";
  import range from "lodash/range";

  import { CellKind, GridPos } from "../crossword";
  import { Grid } from "../crossword/grid";

  import Cell from "./Cell.svelte";

  export let crossword = new Grid(15, 15);
  export let editable = false;

  let tableRef: HTMLElement;

  let active: GridPos | undefined;

  const moveActive = (drow: number, dcol: number) => {
    if (active) {
      active = {
        row: clamp(active.row + drow, 0, crossword.rows - 1),
        col: clamp(active.col + dcol, 0, crossword.cols - 1),
      };
    }
  };

  function toggleCell(coords: GridPos) {
    if (crossword.get(coords)?.kind === CellKind.Block) {
      crossword = crossword.set(coords, { kind: CellKind.Open });
    } else {
      crossword = crossword.set(coords, { kind: CellKind.Block });
    }
  }
</script>

<table
  bind:this={tableRef}
  tabindex={-1}
  on:blur={() => {
    active = undefined;
  }}
  on:keydown|preventDefault={(e) => {
    switch (e.key) {
      case "ArrowUp": {
        moveActive(-1, 0);
        break;
      }
      case "ArrowDown": {
        moveActive(1, 0);
        break;
      }
      case "ArrowLeft": {
        moveActive(0, -1);
        break;
      }
      case "ArrowRight": {
        moveActive(0, 1);
        break;
      }

      case "Backspace": {
        if (active) {
          if (crossword.get(active)?.kind === CellKind.Open) {
            crossword = crossword.update(active, { value: undefined });
          }
        }
        break;
      }

      case ".": {
        if (active) {
          toggleCell(active);
        }
        break;
      }

      default: {
        if (
          /^[a-zA-Z]$/.test(e.key) &&
          active &&
          crossword.get(active)?.kind === CellKind.Open
        ) {
          crossword = crossword.update(active, { value: e.key.toUpperCase() });
        }
      }
    }
  }}
>
  {#each range(0, crossword.rows) as row}
    <tr>
      {#each range(0, crossword.cols) as col}
        <td
          on:mousedown={() => {
            if (editable) {
              tableRef.focus();
              toggleCell({ row, col });
            }
          }}
        >
          <Cell
            cell={crossword.get({ row, col }) ?? { kind: CellKind.Block }}
            style={active?.row === row && active?.col === col
              ? "ACTIVE"
              : "NONE"}
          />
        </td>
      {/each}
    </tr>
  {/each}
</table>

<style lang="scss">
  $border: solid var(--colorCellBlock) 1px;

  table {
    border-collapse: collapse;
    display: block;
  }

  td {
    margin: 0;
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
