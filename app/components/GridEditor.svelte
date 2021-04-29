<script lang="ts">
  import { CellKind, GridPos } from "../crossword";
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

  const onClick = (e: CustomEvent<MouseEvent & GridPos>) => {
    console.log(e.detail);
    toggleCell(e.detail);
  };
</script>

<GridComponent crossword={grid} clickable={true} on:click={onClick} />
