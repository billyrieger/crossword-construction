<script lang="ts">
  import filter from "lodash/filter";
  import reduce from "lodash/reduce";
  import { Direction, Entry } from "../crossword";
  import type { Grid } from "../crossword/grid";

  export let input: Grid;

  let entries: Entry[], across: Entry[], down: Entry[], averageLength: number;
  $: {
    entries = input.entries();
    across = filter(entries, { dir: Direction.Across });
    down = filter(entries, { dir: Direction.Down });
    averageLength =
      reduce(entries, (sum, entry) => sum + entry.cells.length, 0) /
      entries.length;
  }
</script>

<ul>
  <li>Dimensions: {input.rows}x{input.cols}.</li>
  <li>Total entries: {entries.length}.</li>
  <li>Total across: {across.length}.</li>
  <li>Total down: {down.length}.</li>
</ul>

<style lang="scss">
</style>
