<script lang="ts">
  import clamp from "lodash/clamp";
  import range from "lodash/range";
  import { CellKind, GridPos } from "../crossword";
  import { Grid } from "../crossword/grid";
  import GridComponent from "./Grid.svelte";
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

  const handleKey = (e: KeyboardEvent) => {
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
  };

  function toggleCell(coords: GridPos) {
    if (crossword.get(coords)?.kind === CellKind.Block) {
      crossword = crossword.set(coords, { kind: CellKind.Open });
    } else {
      crossword = crossword.set(coords, { kind: CellKind.Block });
    }
  }
</script>

<GridComponent {crossword} />
