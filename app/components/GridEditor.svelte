<script lang="ts">
  import clamp from "lodash/clamp";
  import { CellKind, GridPos } from "../crossword";
  import { Grid } from "../crossword/grid";
  import GridComponent from "./Grid.svelte";
  import Cell from "./Cell.svelte";

  export let grid = new Grid(15, 15);

  function toggleCell(coords: GridPos) {
    if (grid.getCell(coords)?.kind === CellKind.Block) {
      grid = grid.setCell(coords, { kind: CellKind.Open });
    } else {
      grid = grid.setCell(coords, { kind: CellKind.Block });
    }
  }
</script>

<GridComponent crossword={grid} />
