<script lang="ts">
  import { CellKind, GridCell, GridPos } from "../crossword";
  import { Grid } from "../crossword/grid";
  import GridComponent from "./Grid.svelte";

  export let grid = new Grid(15, 15);

  function toggleCell(coords: GridPos) {
    if (grid.getCell(coords)?.kind === CellKind.Block) {
      grid = grid.setCell(coords, { kind: CellKind.Open });
    } else {
      grid = grid.setCell(coords, { kind: CellKind.Block });
    }
  }

  const onClick = (e: CustomEvent<{event: MouseEvent, cell: GridCell}>) => {
    console.log(e.detail);
    toggleCell(e.detail.cell);
  };
</script>

<GridComponent crossword={grid} clickable={true} on:cellMousedown={onClick} />
