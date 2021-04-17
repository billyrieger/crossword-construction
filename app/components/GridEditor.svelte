<script lang="ts">
  import clamp from "lodash/clamp";
  import range from "lodash/range";
  import { CellKind, GridPos } from "../crossword";
  import type { Grid } from "../crossword/grid";
  import GridComponent from "./Grid.svelte";
  import Cell from "./Cell.svelte";

  export let crossword: Grid;

  const toggleCell = (coords: GridPos) => {
    if (crossword.get(coords)?.kind === CellKind.Block) {
      crossword = crossword.set(coords, { kind: CellKind.Open });
    } else {
      crossword = crossword.set(coords, { kind: CellKind.Block });
    }
  }
</script>

<GridComponent {crossword} />
