<script lang="ts">
  import Grid from "./Grid.svelte";
  import type { Message, Query } from "../types";

  const input = 1442;

  let result: number;

  const worker = new Worker("worker.js");
  worker.addEventListener("message", (event: MessageEvent<Message>) => {
    switch (event.data.kind) {
      case "solution":
        result = event.data.output;
        break;
      default:
        break;
    }
  });

  const solve = () => {
    const msg: Query = {
      kind: "query",
      input,
    };
    worker.postMessage(msg);
  };
</script>

<main>
  <div class="wrap">
    <button on:click={solve}>Click me</button>
    <p>{result ?? `What is ${input} squared?`}</p>
    <Grid />
  </div>
</main>

<style>
  .wrap {
    margin: 0 auto;
    width: 400px;
  }
</style>
