<script lang="ts">
  import Grid from "./Grid.svelte";
  import type { Message, Query } from "../types";
  import { Crossword } from "../crossword";

  const input: BigInt = BigInt(1442);

  let result: BigInt;
  let crossword = new Crossword(15, 15);

  const worker = new Worker("worker.js");
  worker.addEventListener("message", (event: MessageEvent<Message>) => {
    switch (event.data.kind) {
      case "SOLUTION":
        result = event.data.output;
        break;
      default:
        break;
    }
  });

  const solve = () => {
    const entries = [...crossword.across, ...crossword.down].map((entry) =>
      entry.map((cell) => cell.id)
    );
    const msg: Query = {
      kind: "QUERY",
      input: entries,
    };
    worker.postMessage(msg);
  };
</script>

<main>
  <div class="wrap">
    <button on:click={solve}>Click me</button>
    <Grid bind:crossword />
  </div>
</main>

<style>
  .wrap {
    margin: 0 auto;
    width: 600px;
  }
</style>
